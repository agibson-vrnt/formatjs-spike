/*eslint-env node*/
var areIntlLocalesSupported = require("intl-locales-supported");

var localesMyAppSupports = require( "./detect-locale").locales.map( x => x.code );

if (global.Intl) {

    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {

        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and patch the constructors we need with the polyfill's.
        var IntlPolyfill = require("intl");
        global.Intl.NumberFormat = IntlPolyfill.NumberFormat;
        global.Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

    }

} else {

    // No `Intl`, so use and load the polyfill.
    global.Intl = require("intl");

}
