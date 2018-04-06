const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};
const makeDomo = (request, response) => {
  const req = request;
  const res = response;

  const age = `${req.body.age}`;
  const name = `${req.body.name}`;

  if (!name || !age) {
    return res.status(400).json({ error: 'RAWR! Domo must have a name and age!' });
  }

  const newDomo = new Domo.DomoModel({
    name,
    age,
    owner: req.session.account._id,
  });

  return newDomo.save().then(() => res.json({ redirect: '/maker' })).catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
};
const getDomos = (request, response) => {
    const req = request;
    const res = response;

    return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred'});
        }

        return res.json({ domos: docs});
    });
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
