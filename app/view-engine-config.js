/*eslint-env node*/
/*eslint-disable no-underscore-dangle*/// -- this is a handlebars convention

var React = require( "react" );
var ReactServer = require( "react-dom/server" );
var uuid = require( "./utils/uuid" );
var messageIndex = require( "../messages/root.json" ).root;
var messages = [

    "../messages/root.json",
    "../messages/ar.json",
    "../messages/en.json",
    "../messages/de.json",
    "../messages/ja.json"

];
var expressHandlebars = require( "express-handlebars" );
var Globalize = require( "globalize" );
Globalize.load( require( "cldr-data" ).entireSupplemental() );
Globalize.load( require( "cldr-data" ).entireMainFor( "en", "de", "ar", "ja" ) );
messages.forEach( m => {

    console.log( "Loading", m );
    Globalize.loadMessages( require( m ) );

} );

module.exports = {

    configure: ( app, config, controls ) => {

        function renderPartToHTML( options, props ) {

            var component = controls[ options.part ];
            var element = React.createElement( component, props );
            return ReactServer.renderToString( element );

        }

        function compileMessages( locale ) {

            Globalize.locale( locale.code );
            var ret = JSON.parse( JSON.stringify( messageIndex ) );
            for( var k in ret ) {

                ret[ k ] = Globalize.formatMessage( k, { count: 13 } );

            }
            return ret;

        }

        var handlebars = expressHandlebars.create( {

            defaultLayout: "layout.html",
            extname: ".hbs",
            views: __dirname + "/views",
            partialsDir: __dirname + "/views",
            helpers: {

                placeholder: function(name){

                    var blocks = this._blocks;
                    var content = blocks && blocks[name];
                    return content ? content.join( "\n" ) : null;
                },
                content: function(name, options){

                    var blocks = this._blocks || (this._blocks = {});
                    var block = blocks[name] || (blocks[name] = []); //Changed this to [] instead of {}
                    block.push(options.fn(this));

                },
                __: function() {

                    return Globalize.formatMessage.apply( Globalize, arguments );

                }

            }

        } );
        app.engine( ".html", handlebars.engine );
        app.set( "view engine", ".html" );

        app.use( function( req, res, next ) {

            res.renderWithPartials = function( parts, view, viewModel ) {

                var partId = uuid( true );
                var selectedLocale = req.service.locales.find( l => l.isSelected ) || {};

                var outputParts = Object.keys( parts ).reduce( ( ret, key ) => {

                    var part = parts[ key ];
                    var rawProps = JSON.parse( JSON.stringify( part.props || {} ) );
                    rawProps.locales = req.service.locales;
                    rawProps.fullUrl = req.service.fullUrl;
                    rawProps.i18n = compileMessages( selectedLocale );
                    ret[ key ] = {

                        id: partId,
                        html: renderPartToHTML( part, rawProps ),
                        script: "window.lru.bootstrapPart( '" + key + "', '#" + partId + "', " + JSON.stringify( rawProps ) + ");"

                    };
                    return ret;

                }, {} );
                viewModel.parts = outputParts;
                viewModel.isRTL = selectedLocale.rtl;
                viewModel.locale = selectedLocale.code;
                res.render( view, viewModel );

            };
            next();

        } );

    }



};
