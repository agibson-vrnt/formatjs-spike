/*eslint-env node*/

const ld = require( "json-ld" );
const fakedArticle = require( "../../mocked-API/article-1234.json" );

module.exports = {

	configure: ( app ) => {

		app.get( "/", ( req, res ) => {


			ld.expand( fakedArticle, ( err, expanded ) => {

				if( err ) {

					console.error( err.stack );
					res.status( 500 ).send( "Internal error" );

				} else {


					var parts = {

						"UserHeader": { part: "UserHeader", props: viewModel }

					};
					var article = expanded[ 0 ];
					var body = article[ "http://www.kana-test.com/globalization-demo#body" ];
					var localisedBody = body.find( l => l[ "@language" ] === req.locale ) || body[ 0 ];
					var viewModel = { article: localisedBody[ "@value" ].split( "\n" ) };
console.log( viewModel );
					res.renderWithPartials( parts, "index", viewModel );

				}

			} );

		} );

	}

};
