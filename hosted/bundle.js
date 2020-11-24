"use strict";

var handleListing = function handleListing(e) {
  e.preventDefault();
  $("#listingMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#listingName").val() == '' || $("#listingPrice").val() == '' || $("#listingContact").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#listingForm").attr("action"), $("#listingForm").serialize(), function () {
    loadListingsFromServer();
  });
  return false;
};

var ListingForm = function ListingForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "listingForm",
    onSubmit: handleListing,
    name: "listingForm",
    action: "/maker",
    method: "POST",
    className: "listingForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "listingName",
    type: "text",
    name: "name",
    placeholder: "Listing Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "price"
  }, "Price: "), /*#__PURE__*/React.createElement("input", {
    id: "listingPrice",
    type: "text",
    name: "price",
    placeholder: "Listing Price"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "public"
  }, "Public: "), /*#__PURE__*/React.createElement("input", {
    id: "listingPub",
    type: "checkbox",
    name: "public",
    placeholder: "Listing Public"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact"
  }, "Contact: "), /*#__PURE__*/React.createElement("input", {
    id: "listingContact",
    type: "text",
    name: "contact",
    placeholder: "Listing Contact Info"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeListingSubmit",
    type: "submit",
    value: "Make Listing"
  }));
};

var ListingList = function ListingList(props) {
  if (props.listings.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "listingList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyListing"
    }, "No Listings yet"));
  }

  var listingNodes = props.listings.map(function (listing) {
    var pub = "False";

    if (listing["public"]) {
      pub = "True";
    }

    return /*#__PURE__*/React.createElement("div", {
      key: listing._id,
      className: "listing"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "listingFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "listingName"
    }, " Name: ", listing.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "listingPrice"
    }, " Price: ", listing.price, " "), /*#__PURE__*/React.createElement("h3", {
      className: "listingPub"
    }, " Public: ", pub, " "), /*#__PURE__*/React.createElement("h3", {
      className: "listingContact"
    }, " Contact: ", listing.contact));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "listingList"
  }, listingNodes);
};

var loadListingsFromServer = function loadListingsFromServer() {
  sendAjax('GET', '/getListings', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ListingList, {
      listings: data.listings
    }), document.querySelector("#listings"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ListingForm, {
    csrf: csrf
  }), document.querySelector("#makeListing"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ListingList, {
    listings: []
  }), document.querySelector("#listings"));
  loadListingsFromServer();
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
