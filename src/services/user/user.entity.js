/*
routes: [{route: '/:id', getUser}, {route: '/:id', deleteUser}]

*/


export default class User {
  constructor() {
    this.route = '/users';
    this.routes = [
      { route: '/:id', entity: this.getUser },
      { route: '/:id', entity: this.deleteUser }
    ];
  }

  getUser() {
    this.event.emit('user', JSON.stringify({ username: 'CoreDevs' }));
    return { username: 'CoreDevs' };
  }
}