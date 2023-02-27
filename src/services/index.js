function test() {
  console.log(this);
  console.log('args');

}

export const services = (app) => {
  app.configure(test);
};