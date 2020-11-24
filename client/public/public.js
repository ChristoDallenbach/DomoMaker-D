const ListingList = function(props) {
    if(props.listings.length === 0) {
        return (
            <div className="listingList">
                <h3 className="emptyListing">No Listings yet</h3>
            </div>
        );
    }
    
    const listingNodes = props.listings.map(function(listing) {
        
        return (
            <div key={listing._id} className="listing">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="listingFace" />
                <h3 className="listingName"> Name: {listing.name} </h3>
                <h3 className="listingPrice"> Price: {listing.price} </h3>
                <h3 className="listingContact"> Contact: {listing.contact} </h3>
            </div>
        );
    });
    
    return (
        <div className="listingList">
            {listingNodes}
        </div>
    );
};

const loadPubListingsFromServer = () => {
    sendAjax('GET', '/getPubListings', null, (data) => {
       ReactDOM.render(
        <ListingList listings={data.listings} />, document.querySelector("#pubListings")
       ); 
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <ListingList listings={[]} />, document.querySelector("#pubListings")
    );
    
    loadPubListingsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});