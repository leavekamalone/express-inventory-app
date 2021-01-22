var express = require('express');
var router = express.Router();

// Require controller modules
var game_controller = require('../controllers/gamesController');
var category_controller = require('../controllers/categoryController');


/// GAME ROUTES ///

// Get catalog home
router.get('/', game_controller.index);

// Get request for creating a Game. Must come before those that use ID, example: displaying Game
router.get('/game/create', game_controller.game_create_get);

// Post request for creating a Game
router.post('/game/create', game_controller.game_create_post);

// Get request to delete a Game
router.get('/game/:id/delete', game_controller.game_delete_get);

// POST request for deleting a Game
router.post('/game/:id/delete', game_controller.game_delete_post);

// GET request to update Genre.
router.get('/game/:id/update', game_controller.game_update_get);

// POST request to update Genre.
router.post('/game/:id/update', game_controller.game_update_post);

// GET request for one Game
router.get('/game/:id', game_controller.game_detail);

// GET request for all games
router.get('/games', game_controller.game_list);

/// CATEGORY ROUTES ///

// Get request for creating a Category. Must come before those that use ID, example: displaying Category
router.get('/category/create', category_controller.category_create_get);

// Post request for creating a Category
router.post('/category/create', category_controller.category_create_post);

// Get request to delete a Category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request for deleting a Category
router.post('/category/:id/delete', category_controller.category_delete_post);

// // GET request for deleting a Category
router.get('/category/:id/update', category_controller.category_update_get);

// // POST request for deleting a Category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category
router.get('/category/:id', category_controller.category_detail);

// GET request for all Categories
router.get('/categories', category_controller.category_list);

module.exports = router;