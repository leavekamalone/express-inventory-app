var Game = require('../models/game');
var Category = require('../models/category');

var async = require('async');
const { category_list } = require('./categoryController');
const { body, validationResult } = require('express-validator');


exports.index = function(req, res, next) {
    async.parallel({
        game_count: function(callback) {
            Game.countDocuments({}, callback);
        },
        category_count: function(callback){
            Category.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', {title: 'Inventory Application', error: err, data: results});
    });
};


// Display list of all games
exports.game_list = function(req, res, next) {
    Game.find({}, 'title price')
    .populate('category')
    .exec(function(err, list_games) {
        if(err) {return next(err)}
        
        res.render('game_list', {title: 'Game list', game_list: list_games})
    });
};

// Display detail page for specific Game
exports.game_detail = function(req, res, next) {
    Game.findById(req.params.id)
    .populate('category')
    .exec(function(err, game){
        if(err) {return next(err); }

        res.render('game_detail', {title: game.title, game: game})
    })
};

// Display Game create form on GET
exports.game_create_get = function(req, res) {
    Category.find({}, 'name')
    .exec(function(err, list_category) {
        if(err) {return next(err); }

        res.render('game_form', {title: 'Create a New Game', category_list: list_category});
    });


    
};

// Handle game create POST
exports.game_create_post = [

        // Validate and sanitise fields.
        body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('number_in_stock', 'Number in Stock must not be empty').trim().isLength({ min: 1 }).escape(),
        body('category', 'Select Category, if not here, Please Create Category').trim().isLength().escape(),

        (req, res, next) => {

            const errors = validationResult(req);

            var game = new Game( 
                { title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                category: req.body.category

            });

            if (!errors.isEmpty()) {
                Category.find({}, 'name')
                .exec(function(err, list_category) {
                    if(err) {return next(err);}

                    res.render('game_form', {title: 'Create a New Game', category_list: list_category});
                });
                return;
             }

            else {
                game.save(function(err) {
                    if(err) {return next(err); }

                    res.redirect(game.url);
                });
            }


        }


];

// Display Game Delete form
exports.game_delete_get = function(req, res, next) {
    Game.findById(req.params.id)
    .exec(function(err, game) {
        if(err) {return next(err);}
        if(game==null) {
            res.redirect('/catalog/games');
        }
        res.render('game_delete', {title: game.title, game: game});
    });
};

// Handle game delete post
exports.game_delete_post = function(req,res, next) {
    Game.findByIdAndRemove(req.body.gameid, function deleteGame(err) {
        if(err) {return next(err);}

        res.redirect('/catalog/games');

    })
};

// Display Game update form
exports.game_update_get = function(req, res, next) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.params.id).populate('category').exec(callback);
        },
        category: function(callback) {
            Category.find(callback)
        },
    }, function(err, results) {
        if(err) {return next(err); }

        if (results.game == null) {
            let err = new Error('Book Not Found');
            err.status= 404;
            return next(err);
        }

        res.render('game_form', {title: 'Update Book', game: results.game, category_list: results.category });
    });
};

//Handle game update post
exports.game_update_post = [
        // Validate and sanitise fields.
        body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('number_in_stock', 'Number in Stock must not be empty').trim().isLength({ min: 1 }).escape(),
        body('category', 'Select Category, if not here, Please Create Category').trim().isLength().escape(),

        (req,res, next) => {
            
            const errors = validationResult(req);

            let game = new Game({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                category: req.body.category,
                _id: req.params.id
            })

            if(!errors.isEmpty()) {
                async.parallel({
                    game: function(callback) {
                        Game.findById(req.params.id).populate('category').exec(callback);
                    },
                    category: function(callback) {
                        Category.find(callback)
                    },
                }, function(err, results) {
                    if(err) {return next(err); }
            
                    res.render('game_form', {title: 'Update Book', game: results.game, category_list: results.category });
                });
                return;
                


            }
            else {
                Game.findByIdAndUpdate(req.params.id, game, {}, function(err,thegame) {
                    if(err) {return next(err); }

                    res.redirect(thegame.url);
                })
            }
        }
    ];


