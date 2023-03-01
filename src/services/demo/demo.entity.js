export const demoget = ({ db, ws }) => (req, res) => {
  try {
    // write your business logics here and send response.
    res.status(200).send('Yo yo');
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Don"t connect with me');
  }
}