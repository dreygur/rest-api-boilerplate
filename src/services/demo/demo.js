import { demoget } from './demo.entity';
import { demoMid } from './demo.middleware';

export default function demo() {
  this.get('/demo', demoMid, demoget(this));// don't forget to pass this.
  this.post('/demo');
}

// don't forget to configure this service at service index.