const handleListing = (e) => {
    e.preventDefault();
    
    $("#listingMessage").animate({width:'hide'},350);
    
    if($("#listingName").val() == '' || $("#listingPrice").val() == '' || $("#listingContact").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#listingForm").attr("action"), $("#listingForm").serialize(), function() {
        loadListingsFromServer();
    });
    
    return false;
};

const ListingForm = (props) => {
    return (
        <form id="listingForm" onSubmit={handleListing} name="listingForm" action="/maker" method="POST" className="listingForm">
            <label htmlFor="name">Name: </label>
            <input id="listingName" type="text" name="name" placeholder="Listing Name" />
            <label htmlFor="price">Price: </label>
            <input id="listingPrice" type="text" name="price" placeholder="Listing Price" />
            <label htmlFor="public">Public: </label>
            <input id="listingPub" type="checkbox" name="public" placeholder="Listing Public" />
            <label htmlFor="contact">Contact: </label>
            <input id="listingContact" type="text" name="contact" placeholder="Listing Contact Info" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeListingSubmit" type="submit" value="Make Listing" />
        </form>
    );
};

const ListingList = function(props) {
    if(props.listings.length === 0) {
        return (
            <div className="listingList">
                <h3 className="emptyListing">No Listings yet</h3>
            </div>
        );
    }
    
    const listingNodes = props.listings.map(function(listing) {
        let pub = "False";
        
        if(listing.public){
            pub = "True";
        }
        
        return (
            <div key={listing._id} className="listing">
                <img src="/assets/img/shopping.png" alt="cart" className="listingFace" />
                <h3 className="listingName"> Name: {listing.name} </h3>
                <h3 className="listingPrice"> Price: {listing.price} </h3>
                <h3 className="listingPub"> Public: {pub} </h3>
                <h3 className="listingContact"> Contact: {listing.contact}</h3>
            </div>
        );
    });
    
    return (
        <div className="listingList">
            {listingNodes}
        </div>
    );
};

const loadListingsFromServer = () => {
    sendAjax('GET', '/getListings', null, (data) => {
        ReactDOM.render(
            <ListingList listings={data.listings} />, document.querySelector("#listings")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <ListingForm csrf={csrf} />, document.querySelector("#makeListing")
    );
    ReactDOM.render(
        <ListingList listings={[]} />, document.querySelector("#listings")
    );
    
    loadListingsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});