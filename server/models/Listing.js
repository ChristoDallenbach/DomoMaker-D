const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ListingModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ListingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
        
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    
    contact: {
        type: String,
        required: true,
        trim: true,
    },
    
    public: {
        type: Boolean,
        required: true,
    },
    
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    
    createdDate: {
        type: Date,
        default: Date.now,
    },
});
      
ListingSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    price: doc.price,
    contact: doc.contact,
    public: doc.public,
});

ListingSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    
    return ListingModel.find(search).select('name price contact public').lean().exec(callback);
};

ListingSchema.statics.findByPub = (callback) => {
    const search = {
        public: true,
    };
    
    return ListingModel.find(search).select('name price contact').lean().exec(callback);
};

ListingModel = mongoose.model('Listing', ListingSchema);

module.exports.ListingModel = ListingModel;
module.exports.ListingSchema = ListingSchema;