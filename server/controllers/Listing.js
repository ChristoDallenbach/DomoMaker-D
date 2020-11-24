const models = require('../models');

const Listing = models.Listing;

const makerPage = (req, res) => {
  Listing.ListingModel.findByOwner(req.session.account._id, (err, docs) => {
      if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error occurred' });
      }
      
      return res.render('app', { csrfToken: req.csrfToken(), listings: docs });
  });
};

const makeListing = (req, res) => {
    if (!req.body.name || !req.body.price || !req.body.contact) {
        return res.status(400).json({ error: 'RAWR! Name, price, and contact info is required' });
    }
    
    let pub = false;
    
    if (req.body.public === "on"){
        pub = true;
    }
    
    const listingData = {
        name: req.body.name,
        price: req.body.price,
        contact: req.body.contact,
        public: pub,
        owner: req.session.account._id,
    };
    
    const newListing = new Listing.ListingModel(listingData);
    
    const listingPromise = newListing.save();
    
    listingPromise.then(() => res.json({ redirect: '/maker' }));
    
    listingPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Listing already exists.' });
        }
        
        return res.status(400).json({ error: 'An error occured' });
    });
    
    return listingPromise;
};

const getListings = (request, response) => {
    const req = request;
    const res = response;
    
    return Listing.ListingModel.findByOwner(req.session.account._id, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.json({ listings: docs });
    });
};

const pubPage = (req, res) => {
  Listing.ListingModel.findByPub((err, docs) => {
      if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error occurred' });
      }
      
      return res.render('public', { csrfToken: req.csrfToken(), listings: docs });
  });
};

const getPubListings = (request, response) => {
    const res = response;
    
    return Listing.ListingModel.findByPub((err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.json({ listings: docs });
    });
};

module.exports.makerPage = makerPage;
module.exports.pubPage = pubPage;
module.exports.getListings = getListings;
module.exports.getPubListings = getPubListings;
module.exports.make = makeListing;