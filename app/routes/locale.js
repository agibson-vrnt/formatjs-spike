/*eslint-env node*/
var bodyParser = require( "body-parser" );

module.exports = {

	configure: ( app ) => {

		app.use( "/locale", bodyParser.urlencoded( { extended: true } ) );
		app.get( "/locale", ( req, res ) => {

			var viewModel = {};
			var parts = {

				"LanguageToggle": { part: "LanguageToggle", props: viewModel }

			};
			res.renderWithPartials( parts, "locale", viewModel );

		} );

	}

};
