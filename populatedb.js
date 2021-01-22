#! /usr/bin/env node

console.log('This script populates some test games and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Game = require('./models/game')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var games = []
var categories = []

function gameCreate(title, description, category, price, number_in_stock, cb) {
  let gamedetail = {title: title , description: description, price: price, number_in_stock: number_in_stock }
  if (category != false) gamedetail.category = category;

  
  var game = new Game(gamedetail);
       
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game:' + game);
    games.push(game)
    cb(null, game)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name , description: description});
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}




function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Role Playing Game','A role-playing game is a game in which players assume the roles of characters in a fictional setting.', callback);
        },
        function(callback) {
          categoryCreate('First Person Shooter Game', 'centered on gun and other weapon-based combat in a first-person perspective', callback);
        },
        function(callback) {
          categoryCreate('Sports Game', 'Games based on a sport', callback);
        },
        ],
        // optional callback
        cb);
}


function createGames(cb) {
    async.parallel([
        function(callback) {
          gameCreate('The Witcher', 'The story takes place in a medieval fantasy world and follows Geralt of Rivia, one of a few traveling monster hunters who have supernatural powers, known as Witchers. ', categories[0], 79.99, 1, callback);
        },
        function(callback) {
          gameCreate('Call of Duty', 'The story takes place in the year 2011, where a radical leader has executed the president of an unnamed country in the Middle East, and an ultranationalist movement ignites a civil war in Russia.', categories[1], 79.99, 10, callback);
        },
        function(callback) {
          gameCreate('NBA 2k21', 'Basketball game based on the NBA, released for the 2020-2021 season', categories[2], 79.99, 3, callback)
        }
        ],
        // optional callback
        cb);
}




async.series([
    createCategories,
    createGames
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Categories: '+categories);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



