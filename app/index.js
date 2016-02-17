/*eslint-env node*/
var config = require( "./config" );
var viewEngineConfig = require( "./view-engine-config" );
var express = require( "express" );
var partialsBundle = require( "./partials.js" );
var detectLocale = require( "./detect-locale" );

process.env.PWD = process.cwd(); // heroku hack...

// route builders
var routeBuilders = [

    // the top-level "root" URL
    require( "./routes/root" )

];

var app = express();
// static routes
app.use( "/public", express.static( __dirname + "/public" ) );
// metadata
app.use( ( req, res, next ) => {

    var ns = req.service = req.service || {};
    ns.fullUrl = req.protocol + "://" + req.get( "host" ) + req.originalUrl;
    next();

} );
// locale detection middleware
detectLocale.configure( app, config );
// configure the view engine
viewEngineConfig.configure( app, config, partialsBundle.default.controls );
// register routes
routeBuilders.forEach( route => route.configure( app, config ) );
// listen
app.listen( config.port, () => console.log( "Listening on", config.port ) ); // eslint-disable-line no-console
