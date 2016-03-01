import IntlMessageFormat from "intl-messageformat";

function formatMessage( messageFormats, locale, key, args ) {

    var messageFormat = [].concat( messageFormats[ key ] || [] ).join( "" );
    var formatter = new IntlMessageFormat( messageFormat, locale );
    return formatter.format( args );

}
export default formatMessage;
