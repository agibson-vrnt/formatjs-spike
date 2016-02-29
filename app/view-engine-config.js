/*eslint-env node*/
/*eslint-disable no-underscore-dangle*/// -- this is a handlebars convention

var React = require( "react" );
var ReactServer = require( "react-dom/server" );
var uuid = require( "./utils/uuid" );
//var messageIndex = require( "../messages/root.json" ).root;
var expressHandlebars = require( "express-handlebars" );

module.exports = {

    configure: ( app, config, controls ) => {

        function renderPartToHTML( options, props ) {

            var component = controls[ options.part ];
            var element = React.createElement( component, props );
            return ReactServer.renderToString( element );

        }

        function compileMessages( locale ) {

            /*Globalize.locale( locale ? locale.code : "en" );
            var ret = JSON.parse( JSON.stringify( messageIndex ) );
            for( var k in ret ) {

                ret[ k ] = Globalize.formatMessage( k, { count: 13 } );

            }
            return ret;*/

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
                __: function() {

                    return "not implemented";

                }

            }

        } );
        app.engine( "html", handlebars.engine );
        app.set( "views", __dirname + "/views" );
        app.set( "view engine", "html" );

        app.use( function( req, res, next ) {

            res.renderWithPartials = function( parts, view, viewModel ) {

                var partId = uuid( true );
                var selectedLocale = req.service.locales.find( l => l.isSelected );
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
