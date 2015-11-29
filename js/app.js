/*
	(╯°□°)╯︵ ┻━┻ ¯\_(ツ)_/¯
	@kelvin___
*/

// @codekit-prepend 'fastclick.js';
// @codekit-prepend 'Draggable.min.js';
// @codekit-prepend 'ScrollToPlugin.min.js';
// @codekit-prepend 'myPageStack.js';

$(function() {
	FastClick.attach( document.body );

/*	app.js starts here
---------------------------------------------------------------------------------- */
	$( '#my-page-stack' ).myPageStack({
		// change settings or else can remove them
		stacked   : 3,     // 1 is scroll, 2 is stack, 3 is reverse stack
		callback  : false, // should there be a callback to section
		hiddenNav : true,  // is there a hidden menu
		dotNav    : true,  // is there a dot menu
		topNav    : true,  // is there a top menu
		loopTop   : false  // loop sections
	});

	// section animations
	$( '#my-page-stack' ).on( 'section', function( e, which ) {
		// which is a number index from 0 to x
		// alert( which );
		if ( !TweenMax.isTweening( $hidden1 ) && !TweenMax.isTweening( $hiddenNav ) ) {
			if ( which === 'close' ) { navClose(); }
		}
	});

	// toggle
	var $patty 	   = $( '#patty' ),
		$top       = $( '#top' ),
		$bottom    = $( '#bottom' ),
		$middle    = $( '#middle' ),
		$hiddenNav = $( '#hidden-nav' ),
		$hidden1   = $( '#hidden-nav ul li:nth-child(1)' ),
		$hidden2   = $( '#hidden-nav ul li:nth-child(2)' ),
		$hidden3   = $( '#hidden-nav ul li:nth-child(3)' ),
		$hidden4   = $( '#hidden-nav ul li:nth-child(4)' ),
		$array     = [ $hidden4, $hidden3, $hidden2, $hidden1 ];

	$patty.on( 'click', function() {
		if ( !TweenMax.isTweening( $hidden1 ) && !TweenMax.isTweening( $hiddenNav ) ) {
			if ( $hiddenNav.css( 'visibility' ) === 'hidden' ) {
				navOpen();
			} else {
				navClose();
			}
		}
	});

	function navOpen() {
		TweenMax.to( $top, 0.15, { rotation: 45, y: '+=9' });
		TweenMax.to( $bottom, 0.15, { rotation: -45, y: '-=9' });
		TweenMax.to( $middle, 0, { alpha: 0 });

		TweenMax.staggerFrom( $array, 0.5,
							{ y: '-=500px', alpha: 0, ease: Expo.easeInOut }, 0.1 );

		$hiddenNav.css( 'visibility', 'visible' );
		TweenMax.fromTo( $hiddenNav, 0.5, { alpha: 0 }, { alpha: 1 });
	}

	function navClose() {
		TweenMax.to( $top, 0.15, { rotation: 0, y: '-=9' });
		TweenMax.to( $bottom, 0.15, { rotation: 0, y: '+=9' });
		TweenMax.to( $middle, 0, { alpha: 1 });

		TweenMax.to( $hiddenNav, 0.4, { alpha: 0, onComplete: resetNav });
	}

	function resetNav() {
		$hiddenNav.css( 'visibility', 'hidden' );
	}
});
