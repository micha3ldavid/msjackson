
/**********************************************************************************************

	The MIT License (MIT)
	Copyright (c) 2016 Michael Juliano
	https://github.com/micha3ldavid

	Permission is hereby granted, free of charge, to any person obtaining 
	a copy of this software and associated documentation files (the "Software"), 
	to deal in the Software without restriction, including without limitation the 
	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
	copies of the Software, and to permit persons to whom the Software is 
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all 
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
	INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
	PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
	OTHER DEALINGS IN THE SOFTWARE.

***********************************************************************************************/

(function ( root, factory ) {
	
	//
	// AMD support
	// ---------------------------------------------------
	if ( typeof define === 'object' && define.amd ) {

		define( [], function () {
			return factory( root );
		});
	}

	//
	// CommonJS module support
	// -----------------------------------------------------
	else if ( typeof module === 'object' && module.exports ) {

		module.exports = root.document ?

			factory( root ) :

			function( w ) {
				if ( !w.document ) {
					throw new Error( "msJackson requires a window with a document" );
				}
				return factory( w );
			};
	}

	//
	// Everybody else
	// -----------------------------------------------------
	else {

		root.msJackson = factory( root );
	}

})( typeof window !== undefined ? window : this, function ( root ) {


	// root will always be window, but to make more 
	// sense with AMD and CommonJS style setups, we'll call the 
	// original arguments 'root.'
	var w = root;

	//
	// addClass
	// super simple add/remove class helpers
	// used in place of libraries like jQuery for easy 
	// play with Angular and React.
	// ----------------------------------------------------

	function addClass( el, value ) {

		var cls = ' ' + ( el.className || '' ) + ' ';

		if ( cls.indexOf( ' ' + value + ' ' ) < 0 ) {
			el.className = cls.replace( /^\s+/, '' ) + value;
		}
	}

	function removeClass( el, value ) {

		var cls = ' ' + ( el.className || '' ) + ' ',
			val = ' ' + value + ' ';

		if ( cls.indexOf( val ) > -1 ) {

			el.className = 
				cls.replace( val, ' ' )
					.replace( /(^\s+|\s+$)/g, '' );
		}
	}

	//
	// msJackson constructor
	// ----------------------------------------------

	function msJackson( breakpoints, container ) {

		return this.init( breakpoints, container );
	}

	//
	// msJackson.event
	// We only set a single resize event on the page. 
	// Instead, all handlers are pushed into an array, which 
	// is looped and invoked when resize is triggers and throttle 
	// meets its requirements.
	// -----------------------------------------------

	msJackson.event = {
		//
		// stack of function hanlers called on resize
		// -------------------------------------------
		handlers: [],
		//
		// original event object 
		// -------------------------------------------
		original: null,
		//
		// reference to the throttle timeout
		// -------------------------------------------
		timeout: null,
		//
		// throttle time in miliseconds
		// -------------------------------------------
		throttle: 100,
		//
		// add
		// Add a handler to the resize event. Only one event is 
		// set per page, so if one exists the handler just gets pushed
		// to the stack.
		//
		// @params {Function} handler
		// -------------------------------------------
		add: function ( handler ) {

			if ( typeof this.original !== 'function' ) {

				var me = this;

				this.original = function () {

					// throttle handlers with a timeout so we
					// arent hitting the cpu so hard

					if ( me.timeout ) {
						clearTimeout( me.timeout );
						me.timeout = null;
					}

					me.timeout = setTimeout( function () { 

						//emit our handlers
						me.emit();

					}, me.throttle );
				};

				// Sorry but we are not supporting below IE 9
				// Well, actually you're welcome.

				w.addEventListener( 'resize', this.original, false );
			}

			this.handlers.push( handler );
		},
		//
		// emit
		// Simply loop and invoke the handlers
		// ---------------------------------------------
		emit: function () {

			var 
			i = 0,
			l = this.handlers.length;

			for ( ; i < l; i++ ) {
				this.handlers[ i ]();
			}
		},
		//
		// remove
		// remove one or all handlers in the stack
		//
		// @params {Function} handler
		// ---------------------------------------------
		remove: function ( handler ) {

			if ( typeof handler === 'undefined' ) {
				
				w.removeEventListener( 'resize', this.original );

				this.handlers.splice(o, this.handlers.length);
				this.original = null;

				return;
			}

			var 
			i = 0,
			l = this.handlers.length;

			for ( ; i < l; i++ ) {

				if ( handler === this.handlers[i] ) {

					this.handlers.splice(i, 1);
					i--; l--;
				}
			}

			if ( handlers.length < 1 ) {
				this.remove();
			}
		}
	};

	//
	// msJackson prototype members
	// --------------------------------------------------

	msJackson.prototype = {

		version: 'v1.0.2',

		breakpoints: null,

		container: null,

		elements: null,

		handler: null,

		length: 0,
		//
		// init
		// contructor function
		//
		// @params {Array -> {Object -> name{string}/value{number}}} breakpoints
		// @param {Node/Element} container
		//-------------------------------------------------
		init: function ( breakpoints, container ) {

			this.breakpoints = 
				( breakpoints || [] ).sort(function ( a, b ) {
					return a.value < b.value || b.value !== '*';
			});

			this.container = container && container.nodeType === 1
				? container : document;

			return this.query().watch();
		},
		//
		// watch
		// add a resize handler to the stack if none exist
		// ----------------------------------------------------
		watch: function () {

			if ( typeof this.handler !== 'function' ) {

				var me = this;

				msJackson.event.add(( this.handler = function () {
					me.updateAll();
				}));
			}

			return this;
		},
		//
		// unwatch
		// remove handler for this instance of msJackson only
		// -----------------------------------------------------
		unwatch: function () {

			msJackson.event.remove( this.handler );
			
			this.handler = null;

			return this;
		},
		//
		// query
		// refresh our NodeList of msJackson elements to watch.
		// ------------------------------------------------------
		query: function () {

			this.elements = 
				this.container.querySelectorAll('.mj');

			return this.updateAll();
		},
		//
		// updateAll
		// update all elements in our NodeList to see if any 
		// breakpoints have changed.
		// ------------------------------------------------------
		updateAll: function () {

			var 
			n = this.elements,
			l = n.length,
			i = 0;

			for( ; i < l; i++ ) {
				this.update( n[ i ] );
			}
			return this;
		},
		//
		// update
		// update a single Node setting the breakpoint value 
		// if one has changed.
		//
		// @param {Node/Element} el
		// -------------------------------------------------------
		update: function ( el ) {

			var 
			bs = this.breakpoints,
			l = bs.length,
			w = el.offsetWidth,
			f = false,
			i = 0,
			b;

			for( ; i < l; i++ ) {

				b = bs[i];

				if ( (w > b.value || b.value === '*') && !f ) {

					addClass( el, 'mj-' + b.name );
					f = true;
				} 
				else {
					removeClass( el, 'mj-' + b.name );
				}
			}

			return this;
		}
	};

	return msJackson;
});