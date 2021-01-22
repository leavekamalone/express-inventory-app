var mongoose = require('mongoose');

var Schema = mongoose.Schema;

let GameSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 100},
        description: {type: String, required: true, maxlength: 250},
        category: [{ type: Schema.Types.ObjectId, ref: 'Category'}],
        price: {type: Number, required: [true, 'please give a price'], min: 0, max: 100},
        number_in_stock: {type: Number, required: true, min: 0, max: 10}


    }
)

GameSchema
.virtual('url')
.get(function(){
    return '/catalog/game/' + this._id;
});

module.exports = mongoose.model('Game', GameSchema);


