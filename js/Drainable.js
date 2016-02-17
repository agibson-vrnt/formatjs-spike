const STORE = Symbol( "queue storage" );
function empty( queue ) {

	if( queue.drain && queue[STORE].length ) {

		var next = queue[STORE].shift();
		queue.drain( next );
		empty( queue );

	}

}

const DRAIN = Symbol( "drain stategy" );
class Drainable {

	constructor() {

		this[STORE] = [];

	}
	set drain( callback ) {

		this[DRAIN] = callback;
		empty( this );

	}
	get drain() { return this[DRAIN]; }
	enqueue( x ) {

		this[STORE].push( x );
		empty( this );

	}

}
export default Drainable;
