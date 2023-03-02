import conncetMongoDB from './controllers/mongodb';
import App from './app';

(() => {
  // Connect to MongoDB
  conncetMongoDB()
    .then(function (res) {
      console.log(`=> ${res}!`);

      // Boot Up the server & services
      const app = new App();
      app.start();
    })
    .catch(err => console.log(err));
})();