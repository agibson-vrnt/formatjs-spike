/*eslint-env browser*/

import Drainable from "./Drainable";
import base from "./base";

var lru = window.lru = window.lru || {};
var queue = new Drainable();
lru.bootstrapPart = function( name, containerSelector, props ) {

	queue.enqueue( { name, containerSelector, props } );

};
window.addEventListener( "DOMContentLoaded", function() {

	queue.drain = ( { name, containerSelector, props } ) => {

		var element = base.React.createElement( base.controls[ name ], props );
		var container = document.querySelector( containerSelector );
		base.ReactDOM.render( element, container );

	};

} );
