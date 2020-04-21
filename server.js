var express = require('express');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static('public'));

var exphbs = require('express-handlebars');

const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
app.engine('handlebars', exphbs({ 
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main' 
}));
app.set('view engine', 'handlebars');

const bracketApiRoutes = require("./controllers/bracketController");
const userApiRoutes = require("./controllers/userController");
const htmlRoutes = require("./controllers/htmlController");

app.use(htmlRoutes);

app.use("/api/TournamentBracket",bracketApiRoutes);
// app.use("/api/reviews",reviewApiRoutes);

db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});