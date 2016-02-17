/*eslint-env node*/
/*eslint-disable no-underscore-dangle*/// -- this is a handlebars convention

var React = require( "react" );
var ReactServer = require( "react-dom/server" );
var uuid = require( "./utils/uuid" );
var expressHandlebars = require( "express-handlebars" );


module.exports = {

    configure: ( app, config, controls ) => {

        function renderPartToHTML( options, props ) {

            var component = controls[ options.part ];
            var element = React.createElement( component, props );
            return ReactServer.renderToString( element );

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

                }

            }

        } );
        app.engine( ".html", handlebars.engine );
        app.set( "view engine", ".html" );

        app.use( function( req, res, next ) {

            res.renderWithPartials = function( parts, view, viewModel ) {

                var partId = uuid( true );
                var outputParts = Object.keys( parts ).reduce( ( ret, key ) => {

                    var part = parts[ key ];
                    var rawProps = JSON.parse( JSON.stringify( part.props || {} ) );
                    rawProps.locales = req.service.locales;
                    rawProps.fullUrl = req.service.fullUrl;
                    ret[ key ] = {

                        id: partId,
                        html: renderPartToHTML( part, rawProps ),
                        script: "window.lru.bootstrapPart( '" + key + "', '#" + partId + "', " + JSON.stringify( rawProps ) + ");"

                    };
                    return ret;

                }, {} );
                viewModel.parts = outputParts;
                res.render( view, viewModel );

            };
            next();

        } );

    }



};
