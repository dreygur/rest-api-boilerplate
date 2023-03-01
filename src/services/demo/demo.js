import { demoget } from "./demo.entity";

export default function demo() {
  this.get('/demo', demoget(this));// don't forget to pass this.
  this.post('/demo');
};

// don't forget to configure this service at service index.