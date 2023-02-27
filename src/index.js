import App from './app';

(() => {
  const app = (new App()).start();
  app.listen().then((res) => console.log(res));
})();