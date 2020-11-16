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

const makeDomo = (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'RAWR! Both name and age are required' });
    }
    
    let pub = false;
    
    if (req.body.public === "on"){
        pub = true;
    }
    
    const domoData = {
        name: req.body.name,
        age: req.body.age,
        public: pub,
        owner: req.session.account._id,
    };
    
    const newDomo = new Domo.DomoModel(domoData);
    
    const domoPromise = newDomo.save();
    
    domoPromise.then(() => res.json({ redirect: '/maker' }));
    
    domoPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists.' });
        }
        
        return res.status(400).json({ error: 'An error occured' });
    });
    
    return domoPromise;
};

const getDomos = (request, response) => {
    const req = request;
    const res = response;
    
    return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.json({ domos: docs });
    });
};

const pubPage = (req, res) => {
  Domo.DomoModel.findByPub((err, docs) => {
      if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error occurred' });
      }
      
      return res.render('public', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getPubDomos = (request, response) => {
    const req = request;
    const res = response;
    
    return Domo.DomoModel.findByPub((err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.json({ domos: docs });
    });
};

module.exports.makerPage = makerPage;
module.exports.pubPage = pubPage;
module.exports.getDomos = getDomos;
module.exports.getPubDomos = getPubDomos;
module.exports.make = makeDomo;