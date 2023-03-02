export const demoget = () => (req, res) => {
  try {
    // do what you used to do in the previous way.
    res.status(200).send('Yo yo');
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Don"t connect with me');
  }
};