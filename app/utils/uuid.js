/*eslint-env node*/

module.exports = function uuid( forceInitialAlpha ) {

	var template = ( forceInitialAlpha ? "a" : "x" ) + "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
	//! thanks: http://stackoverflow.com/a/2117523/275501
	return template.replace( /[xy]/g, function(c) {

		var r = Math.random() * 16 | 0, v = c === "x" ? r : ( r & 0x3 | 0x8 );
		return v.toString(16);

	} );

};
