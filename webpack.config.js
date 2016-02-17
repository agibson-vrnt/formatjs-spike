/*eslint-env node*/

var path = require( "path" );
var webpack = require( "webpack" );
var GlobalizePlugin = require( "globalize-webpack-plugin" );
var CommonsChunkPlugin = require( "webpack/lib/optimize/CommonsChunkPlugin" );

module.exports = {

    // your entry point - js/index.js or perhaps js/main.js - can be an array of files
    entry: {

        "public/js/bundle": path.resolve( __dirname, "js/client-bundle.js" ),
        "partials": path.resolve( __dirname, "js/server-bundle.js" )/*,
        "vendor": [
            "globalize",
            "globalize/dist/globalize-runtime/number",
            "globalize/dist/globalize-runtime/currency",
            "globalize/dist/globalize-runtime/date",
            "globalize/dist/globalize-runtime/message",
            "globalize/dist/globalize-runtime/plural",
            "globalize/dist/globalize-runtime/relative-time",
            "globalize/dist/globalize-runtime/unit"
        ]*/

    },

    // the output folder when forming the packed bundle (also affects the dev server's naming)
    output: {

        path: path.resolve( __dirname, "app/" ),
        filename: "[name].js",
        libraryTarget: "umd"

    },
    module: {

        "loaders": [
            // this loader works for both js and jsx - react and es2015
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: [ "es2015", "react" ]
                }
            }

        ]

    },
    plugins: [

        //new CommonsChunkPlugin( "vendor", "public/js/vendor.[hash].js" ),
        //new webpack.optimize.DedupePlugin(),
       /* new webpack.optimize.UglifyJsPlugin( {

            compress: {

               warnings: false

            }

        } ),*/
        new GlobalizePlugin( {

            production: false,
            developmentLocale: "en",
            supportedLocales: [ "ar", "de", "en", "ja" ],
            messages: "messages/[locale].json",
            output: "public/js/i18n/[locale].[hash].js"

        } )

    ]

};
