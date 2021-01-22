var mongoose = require('mongoose');

var Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 50},
        description: {type: String, required: true, maxlength: 200}

    }
)

CategorySchema
.virtual('url')
.get(function() {
    return '/catalog/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
