var Category = require('../models/category');
var Game = require('../models/game');

const { body,validationResult } = require("express-validator");
var async = require('async');
// Display list of all categories
exports.category_list = function(req, res, next) {
    Category.find()
    .exec(function (err, list_category) {
        if(err) {return next(err)}

        res.render('category_list', {title: 'List of Categories', category_list: list_category})
    });
};

// Display detail page for specific Category
exports.category_detail = function(req, res, next) {
    Category.findById(req.params.id)
    .exec(function(err, category){
        if(err) {return next(err)}

        res.render('category_detail', {title: category.name + ' details', category: category})
    });
};

// Display Category create form on GET
exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Create a Category' });
};

// Handle Category create POST
exports.category_create_post = [
    body('name', 'Category Name Required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Category Description Required').trim().isLength({ min: 1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        if(!errors.isEmpty()) {
            //there are errors, reloads page with values
            res.render('category_form', {title: 'Create a Category', category: req.body, errors: errors.array() });
            return;
        }

        else {
            Category.findOne({ name: req.body.name})
            .exec( function(err, found_category) {
                if(err) {return next(err)}

                if(found_category) {
                    res.redirect(found_category.url)
                }
                else {
                    category.save(function(err) {
                        if (err) { return next(err); }
                        //successful, redirect to new category page
                        res.redirect(category.url);
                    } );

                }

            })
         }

    }

];

// Display Category Delete form
exports.category_delete_get = function(req, res) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
        game: function(callback) {
            Game.find({ 'category': req.params.id }).exec(callback) 
        },

    }, function(err, results) {
        if(err) {return next(err); }
        if(results.category == null) {
            res.redirect('/catalog/categories');
        }
            res.render('category_delete', {title: 'Delete Category', category: results.category, game: results.game});
 
    });
};

// Handle Category delete post
exports.category_delete_post = function(req,res) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.body.categoryid).exec(callback)
        },
        game: function(callback) {
            Game.find({ 'category': req.body.categoryid}).exec(callback)
        },

    }, function(err,results) {
        if(err) {return next(err); }
        if (results.game.length > 0) {
            res.render('category_delete', {title: 'Delete Category', category: results.category, game: results.game});
            return;
        }
        else {
            Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
                if(err) { return next(err); }

                res.redirect('/catalog/categories/')
            })
        }
    })
};

// Display Category update form
exports.category_update_get = function(req, res) {
    Category.findById(req.params.id)
    .exec(function(err, category){
        if(err) {return next(err)}

        res.render('category_form', {title: 'Update Category', category: category})
    });
};

//Handle Category update post
exports.category_update_post = [
    body('name', 'Category Name Required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Category Description Required').trim().isLength({ min: 1}).escape(),

 (req, res, next) => {

    const errors = validationResult(req);

    var category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id
    });

    if (!errors.isEmpty()) {
        //there are errors, reloads page with values
        res.render('category_form', {title: 'Update Category', category: req.body, errors: errors.array() });
        return;
    }
    else {
        Category.findByIdAndUpdate(req.params.id, category, {}, function (err, thecategory) {
            if(err) {return next(err); }

            res.redirect(thecategory.url);
        } )
    }


 }
];


