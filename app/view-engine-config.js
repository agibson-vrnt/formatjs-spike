/*eslint-env node*/
/*eslint-disable no-underscore-dangle*/// -- this is a handlebars convention

var React = require( "react" );
var ReactServer = require( "react-dom/server" );
var uuid = require( "./utils/uuid" );
var expressHandlebars = require( "express-handlebars" );
var locales = require( "./detect-locale" ).locales;

var messages = require( "../messages/root.json" );
locales.forEach( x => {

    messages = Object.assign( {}, messages, require( "../messages/" + x.code + ".json" ) );

} );



module.exports = {

    configure: ( app, config, lib ) => {

        function renderPartToHTML( options, props ) {

            var component = lib.controls[ options.part ];
            var element = React.createElement( component, props );
            return ReactServer.renderToString( element );

        }

        var handlebars = expressHandlebars.create( {

            defaultLayout: "layout.html",
            extname: ".html",
            views: __dirname + "/views",
            partialsDir: __dirname + "/views",
            layoutsDir: __dirname + "/views/layouts",
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
                __: function( key ) {

                    var localeMessages = messages[ this.locale ];
                    var rootMessages = messages.root;
                    var args = [].slice.call( arguments, 1, 9999 );
                    var messageFormats = Object.assign( {}, rootMessages, localeMessages );
                    return lib.formatMessage( messageFormats, this.locale, key, args );

                }

            }

        } );
        app.engine( "html", handlebars.engine );
        app.set( "views", __dirname + "/views" );
        app.set( "view engine", "html" );

        function combineMessages( root, locale ) {

            return Object.assign( {}, root, locale );

        }

        app.use( function( req, res, next ) {

            res.renderWithPartials = function( parts, view, viewModel ) {

                var partId = uuid( true );
                var selectedLocale = req.service.locales.find( l => l.isSelected );
                var outputParts = Object.keys( parts ).reduce( ( ret, key ) => {

                    var part = parts[ key ];
                    var rawProps = JSON.parse( JSON.stringify( part.props || {} ) );
                    rawProps.locales = req.service.locales;
                    rawProps.fullUrl = req.service.fullUrl;

                    var localeMessages = messages[ selectedLocale.code ];
                    var rootMessages = messages.root;
                    rawProps.messageFormats = Object.assign( {}, rootMessages, localeMessages );
                    rawProps.currentLocale = selectedLocale;

                    rawProps.formatMessage = lib.formatMessage.bind( null, rawProps.messageFormats, rawProps.currentLocale.code );
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
                viewModel.messages = combineMessages( messages.root, messages[ viewModel.locale ] );
                res.render( view, viewModel );

            };
            next();

        } );

    }



};
