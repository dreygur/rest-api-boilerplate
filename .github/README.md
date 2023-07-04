# Rest api Boilerplate

A framework like boilerplate on top of express.js, [socket.io](https://www.npmjs.com/package/socket.io), mongodb, orama

This booilerplate handles static file serving for SPA and also does the api serving part.

## Features:

- SPA Server
- REST api serving
- Search using [orama](https://www.npmjs.com/package/@orama/orama) (a js search engine)
- Service Layer Architecture
- Websocket using [socket.io](https://www.npmjs.com/package/socket.io)
- Mongoose ORM
- Mailer using nodemailer
- Basic database operations pebuilt, so one just have to write schema and nothing more
- Disc caching
- Written in ES6 so newcomers or frontend developers don't have to worry about node.js native api's
- Pre-integrated linter using eslint so the code is always abide by the standards

_More to be coming soon_

## User Doc:
### Serving Front-end pages
Place the compiled html page having a `index.html` in client directory of this project and the rest will be handled.

### Serving APIs
The default path for the api is `/api` means, all the api endpoints will be served from a path starting with `/api/`.
This template tries to implement clean architecture (not exactly). So the api endpoiints are served from the `services` directory inside `src`. To create a new endpoint, a new directory inside service should be created.

An example service inside `services` directory:
```
|- chat
|---|- chat.js
    |- chat.entity.js
    |- chat.schema.js
    |- chat.middlewares.js
```

All the http routes should be placed inside the file same as service directory name. A developer should default export a function containing the http routes. Inside that function, object of the express app will be available with `route`, `ws`, `imageUp`, `lyra`, `db`, `mail`, `settings`. The `route` is the express route method, `ws` is for managing websocket, `imageUp` method is for getting uploaded images, `lyra` is for searching (like elastic search), `db` is for database operations, `mail` is for sending emails, and `settings` is an object containing application settings. The application settings should be saved in `settings.json` file in the root directory and the json will be available in settings as it is.
All of the methods has documentation. Your code editor should give hint/highlight of the documentation upon using.

Route handlers should return another function. And the inner function will have access to `request`, `response` and other objects of express middlewares. More specifically the inner function will be treated as the express middleware.

> This template has a `demo` service pre-created so that you can have a look on how the services should be created.

In the `*.schema.js` file, mongoose schema should be written. Than should be used as any traditional express application.

[Incomplete....]

Made with :heart: by [Rakibul Yeasin](https://facebook.com/dreygur)
