/*eslint-env node*/

var path = require( "path" );
var webpack = require( "webpack" );

module.exports = {

    // your entry point - js/index.js or perhaps js/main.js - can be an array of files
    entry: {

        "public/js/bundle": path.resolve( __dirname, "js/client-bundle.js" ),
        "partials": path.resolve( __dirname, "js/server-bundle.js" )

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

        new webpack.optimize.UglifyJsPlugin({
            compress: {
               warnings: false
            }
        })

    ]

};
