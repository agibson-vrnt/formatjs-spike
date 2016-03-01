/*eslint-env node*/

const locale = require("locale");
const locales = [

    { code: "en", displayName: "English" },
    { code: "de", displayName: "German" },
    { code: "ar", displayName: "Arabic", rtl: true },
    { code: "ja", displayName: "Japan" }

];
const urlLocaleDetectionPattern = /^(https?:\/\/)([^\.]*)(\..*)$/;

function localiseUrl( targetLocale, url ) {

    var codes = locales.map( l => l.code );
    var pattern = /^(https?:\/\/)([^\.]*)(\..*)$/;
    var matched = pattern.exec( url );
    if( matched && !!~codes.indexOf( matched[ 2 ] ) ) {

        return url.replace( pattern, "$1" + targetLocale.code + "$3" );

    } else {

        return url.replace( pattern, "$1" + targetLocale.code + ".$2$3" );

    }

}

module.exports = {

    locales: locales,
    configure: function configure( app ) {

        var supported = locales.map( l => l.code );

        // detect through headers
        app.use( locale( supported ) );

        // override if we have a locale-specific host
        app.use( function( req, res, next ) {

            if( !~supported.indexOf( req.locale ) ) {

                req.locale = supported[ 0 ];

            }
            var ns = req.service = req.service || {};
            var matched = urlLocaleDetectionPattern.exec( ns.fullUrl );
            if( matched ) {

                var hostBasedLocale = matched[ 2 ];
                if( ~supported.indexOf( hostBasedLocale ) ) {

                    req.locale = hostBasedLocale;

                }

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

                    l.url = localiseUrl( l, ns.fullUrl );

                }

            } );
            next();

        } );

    }

};
