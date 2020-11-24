const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  //app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/pubPage', mid.requiresLogin, controllers.Listing.pubPage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Listing.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Listing.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getListings', mid.requiresLogin, controllers.Listing.getListings);
  app.get('/getPubListings', mid.requiresLogin, controllers.Listing.getPubListings);
  //app.get('/accPage', mid.requiresLogin, controllers);
  //app.post('/postListing', mid.requiresLogin, controllers);
};

module.exports = router;
