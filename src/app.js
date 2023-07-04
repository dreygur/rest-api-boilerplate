import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import form from 'express-form-data';
import express from 'express';
import { Router } from 'express';
import http2 from 'https';
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import actuator from 'express-actuator';
import { readFileSync } from 'fs';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// import http2 from 'spdy';

// Local Services
import { hooks } from './hooks';
import { services } from './services';
import socket, { listen as wsListen } from './controllers/socket';
import SearchCtrl from './controllers/search/search';
import NewMailer from './controllers/email';
import * as operations from './controllers/operations';

// Settings
import settings from '../settings.json';

// Controllers
import { imageUp } from './controllers/imageUp';
import gracefullShutdown from './controllers/gracefullShutdown';
import { driverCache } from './controllers/driverCache';

export default class App {
  constructor({ deps } = {}) {
    this.express = express();
    this.router = new Router();
    this.config = settings;
    this.search = new SearchCtrl();
    this.mail = NewMailer(this.config);
    this.imageUp = imageUp;
    this.db = operations;
    this.events = {};
    this.wsMiddlewares = [];

    if (deps) {
      let promises = deps.map(({ method, args }) => new Promise((resolve, reject) => method(...args).then(r => resolve(r)).catch((err) => reject(err))));
      Promise.all(promises).then((res) => console.log(`=> ${res}!`)).then(() => this.init()).catch((err) => console.log(err));
    }
  }

  start() {
    const readyStatus = setInterval(() => {
      if (this.ready) {
        this.listen();
        clearInterval(readyStatus);
      }
    }, 300);
  }

  init() {
    driverCache.born();
    const { parse } = form;

    this.express.enable('trust proxy');

    // Rate Limiter
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    // Load the middlewwares
    this.express.use(
      cors({
        origin: this.config.origin,
        credentials: true
      }));
    this.express.use(morgan('common')); // Logger
    this.express.use(actuator({ infoGitMode: 'full' })); // Health Checker
    this.express.use(json()); // Parse JSON response
    this.express.use(urlencoded({ extended: false })); // Legacy URL encoding
    this.express.use(cookieParser()); // Parse cookies
    this.express.use(parse()); // Parse Form data as JSON
    this.express.use('/api', limiter, this.router); // All the API routes
    this.express.use(express.static(path.resolve(__dirname, '..', 'client'))); // REACT build files (Statics)

    if (this.config.useHTTP2) {
      // SSL configuration
      this.ssl = {
        key: readFileSync(path.resolve('ssl', 'privatekey.pem')),
        cert: readFileSync(path.resolve('ssl', 'certificate.pem')),
      };

      this.options = {
        ...this.ssl,
        allowHTTP1: true
      };

      // Server
      this.server = http2.createServer(this.options, this.express);

      // Load the Hooks
      hooks(this);
    } else {
      this.server = http.createServer(this.express);
    }

    // Start Search service
    this.search.start();
    // Sokcet Server
    this.socket = socket(this.server, { origin: this.config.origin });
    // Load the Services
    services(this);

    // Listen for events
    wsListen(this.socket, this.events, ...this.wsMiddlewares);

    this.ready = true;
    gracefullShutdown.call({ ...this });
  }

  listen() {
    // Serve Front-end
    this.express.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
    });

    // Boot the server
    this.server.listen(this.config.port, () => {
      console.log(`=> Listening on ${this.config.port}`);
    });
  }

  // Register Hooks
  hook(callback) {
    callback.call({ ...this });
  }

  // configure service with api
  configure(callback) {
    callback.call({
      ...this.express,
      route: this.router,
      ws: this.socket,
      imageUp: this.imageUp,
      lyra: this.search,
      db: this.db,
      mail: this.mail,
      settings: this.config
    });
  }

  // register events for ws with service
  register(event, middlewares, callback) {
    let callee;
    if (typeof middlewares === 'function') {
      callee = middlewares;
    } else {
      callee = callback;
      this.wsMiddlewares = middlewares;
    }
    this.events[event] = {
      method: callee,
      props: {
        ws: this.socket,
        lyra: this.search,
        db: this.db,
        mail: this.mail,
        settings: this.config
      }
    };
  }
}