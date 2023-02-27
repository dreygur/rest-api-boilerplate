import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import form from 'express-form-data';
import express from 'express';
import http2 from 'spdy';
import morgan from 'morgan';
import actuator from 'express-actuator';
import { readFileSync } from 'fs';

// Settings
import settings from '../config/settings.json';

export default class App {
  constructor() {
    this.express = express();
    this.config = settings;

    this.init();
  }

  start() {
    // SSL configuration
    const options = {
      key: readFileSync('ssl/privatekey.pem'),
      cert: readFileSync('ssl/certificate.pem'),
      allowHTTP1: true
    };

    // Server
    this.server = http2.createServer(options, this.express);
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
  }

  listen() {
    this.server.listen()
  }
}