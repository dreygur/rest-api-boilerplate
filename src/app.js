import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import form from 'express-form-data';
import express from 'express';
import http2 from 'spdy';
import http from 'http';
import morgan from 'morgan';
import actuator from 'express-actuator';
import { readFileSync } from 'fs';

// Local Services
import socket from './socket';
import { services } from './services';
import SearchCtrl from './search';
import * as operations from './operations';

// Settings
import settings from '../config/settings.json';

export default class App {
  constructor() {
    this.express = express();
    this.config = settings;
    this.search = new SearchCtrl();
    this.db = operations;

    this.init();
  }

  start() {
    this.listen();
  }

  init() {
    const { parse } = form;
    // Load the middlewwares
    this.express.use(morgan('common')); // Logger
    this.express.use(actuator({ infoGitMode: 'full' })); // Health Checker
    this.express.use(json()); // Parse JSON response
    this.express.use(urlencoded({ extended: false })); // Legacy URL encoding
    this.express.use(cookieParser()); // Parse cookies
    this.express.use(parse()); // Parse Form data as JSON

    if (this.config.useHTTP2) {
      // SSL configuration
      const options = {
        key: readFileSync('ssl/privatekey.pem'),
        cert: readFileSync('ssl/certificate.pem'),
        allowHTTP1: true
      };

      // Server
      this.server = http2.createServer(options, this.express);
    } else {
      this.server = http.createServer(this.express);
    }
    // Start Search service
    this.search.start();
    // Sokcet Server
    this.socket = socket(this.server, { origin: this.config.origin });

    // Load the Services
    services(this);
  }

  listen() {
    this.server.listen(this.config.port, () => {
      console.log(`=> Listening on ${this.config.port}`);
    });
  }

  configure(callback) {
    callback.call({ ...this.express, ws: this.socket, search: this.search, db: this.db });
  }
}