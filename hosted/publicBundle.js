"use strict";

var ListingList = function ListingList(props) {
  if (props.listings.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "listingList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyListing"
    }, "No Listings yet"));
  }

  var listingNodes = props.listings.map(function (listing) {
    return /*#__PURE__*/React.createElement("div", {
      key: listing._id,
      className: "listing"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/shopping.png",
      alt: "cart",
      className: "listingFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "listingName"
    }, " Name: ", listing.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "listingPrice"
    }, " Price: ", listing.price, " "), /*#__PURE__*/React.createElement("h3", {
      className: "listingContact"
    }, " Contact: ", listing.contact, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "listingList"
  }, listingNodes);
};

var loadPubListingsFromServer = function loadPubListingsFromServer() {
  sendAjax('GET', '/getPubListings', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ListingList, {
      listings: data.listings
    }), document.querySelector("#pubListings"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ListingList, {
    listings: []
  }), document.querySelector("#pubListings"));
  loadPubListingsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#listingMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#listingMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
