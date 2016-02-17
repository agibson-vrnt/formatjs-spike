/*eslint-env node*/

const locale = require("locale");
const locales = [

    { code: "en", displayName: "English" },
    { code: "de", displayName: "German" },
    { code: "ar", displayName: "Arabic (Generic)" },
    { code: "ja", displayName: "Japan" }

];
const urlLocaleDetectionPattern = /^(https?:\/\/)([^\.]*)(\..*)$/;

function localiseUrl( locales, locale, url ) {

    var codes = locales.map( l => l.code );
    var pattern = /^(https?:\/\/)([^\.]*)(\..*)$/;
    var matched = pattern.exec( url );
    if( ~codes.indexOf( matched[ 2 ] ) ) {

        return url.replace( pattern, "$1" + locale.code + "$3" );

    } else {

        return url.replace( pattern, "$1" + locale.code + ".$2$3" );

    }

}

module.exports = {

    configure: function configure( app ) {

        var supported = locales.map( l => l.code );

        // detect through headers
        app.use( locale( supported ) );

        // override if we have a locale-specific host
        app.use( function( req, res, next ) {


            var ns = req.service = req.service || {};
            var matched = urlLocaleDetectionPattern.exec( ns.fullUrl );
            var hostBasedLocale = matched[ 2 ];
            if( ~supported.indexOf( hostBasedLocale ) ) {

                req.locale = hostBasedLocale;

            }
            next();

        } );

        // attach and select the current locale metadata for this request
        app.use( function( req, res, next ) {

            var ns = req.service = req.service || {};
            ns.locales = JSON.parse( JSON.stringify( locales ) );
            ns.locales.forEach( l => {

                if( l.code === req.locale ) {

                    l.url = ns.fullUrl;
                    l.isSelected = true;

                } else {

                    l.url = localiseUrl( ns.locales, l, ns.fullUrl );

                }

            } );
            next();

        } );

    }

};
