
function getUser({ ws }) {
  return (req, res) => {
    let message = req.query.message;
    ws.emit('message', message);

    return res.status(200).send({ message: 'Hello!' });
  };
}

export default function user() {
  this.get('/user', getUser(this));
}