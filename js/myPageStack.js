/*
	(╯°□°)╯︵ ┻━┻ ¯\_(ツ)_/¯
	@kelvin___
*/

;(function( $, window, document, undefined ) {
	'use strict';

	$.fn.myPageStack = function( options ) {
		// prevent scope issues
		var me = this;

		// set up variables
		var $window      = $( window ),
			$document    = $( document ),
			$myPageStack = $( '#my-page-stack' ),
			$sections    = $( '.section' ),
			$current     = $sections.first(),
			totalNum     = $sections.length,
			isAnimating  = false,
			pageHeight   = $window.innerHeight(),
			swipeDiv     = document.createElement( 'div' ),
			lastTouch    = 0;

		// load settings if any
		var settings = $.extend( true, {}, {
			// default settings
			stacked   : 1,
			callback  : false,
			hiddenNav : false,
			dotNav    : false,
			topNav    : false,
			loopTop   : true
		}, options );

		// add listeners
		$document.on( 'keydown', onKeyDown );
		$window.on( 'touchmove', onTouchStart );
		$window.on ( 'touchend', onTouchEnd );
		$window.on( 'mousewheel DOMMouseScroll', onMouseWheel );
		$window.on( 'resize', onResize ).resize();

		// if there are next buttons
		if ( $( '.next' ).length ) {
			var	$nextButton = $( '.next' );

			$nextButton.on( 'click', function() {
				goNext();
			});

			TweenMax.to( $nextButton, 0.5, {
				y      : '-=10px',
				yoyo   : true,
				repeat : -1
			});
		}

		// if there are top buttons
		if ( $( '.top' ).length ) {
			var	$topButton = $( '.top a' );

			$topButton.on( 'click', function() {
				goTo( $sections.first() );
			});
		}

		// keyboard nav
		function onKeyDown( e ) {
			e.preventDefault();

			if ( e.keyCode === 38 ) {
				goPrev();
			} else if ( e.keyCode === 40 ) {
				goNext();
			}
		}

		// phone scroll
		function onTouchStart() {
			lastTouch = $current.scrollTop();
		}

		function onTouchEnd() {
			if ( $current.hasClass( 'scroll' ) ) {
				var maxScroll = $current[0].scrollHeight - $current.outerHeight();
				var touchDiff = $current.scrollTop() - lastTouch;

				if ( $current.scrollTop() > 0 ) {
					if ( touchDiff >= 0) {
						if ( $current.scrollTop() === maxScroll ) {
							goNext();
						}
					}
				}

				if ( $current.scrollTop() < maxScroll ) {
					if ( touchDiff <= 0) {
						if ( $current.scrollTop() < 1 ) {
							goPrev();
						}
					}
				}

				lastTouch = $current.scrollTop();
			}
		}

		// mousescroll nav
		function onMouseWheel( e ) {
			// normalize e wheel delta
			var delta = e.originalEvent.wheelDelta / 30 || -e.originalEvent.detail;

			// scrollable section
			if ( $current.hasClass( 'scroll' ) ) {
				var maxScroll = $current[0].scrollHeight - $current.outerHeight();
				if( delta < -1 ) {
					if ( $current.scrollTop() === maxScroll ) {
						goNext();
					}
				} else if( delta > 1 ) {
					if ( $current.scrollTop() === 0 ) {
						goPrev();
					}
				}

			// non scrollable section
			} else {
				e.preventDefault();

				if( delta < -1 ) {
					goNext();
				} else if( delta > 1 ) {
					goPrev();
				}
			}
		}

		// on swipe
		var onSwipe = Draggable.create(swipeDiv, {
			type      : 'y',
			cursor    : 'auto',
			lockAxis  : true ,
			trigger   : $myPageStack,
			onDragEnd : function() {
				if ( this.getDirection( 'start' ) === 'up' ) {
					goNext();
				} else if ( this.getDirection( 'start' ) === 'down' ) {
					goPrev();
				}
		  	}
		});

		// page resized
		function onResize( e ) {
			pageHeight = $window.innerHeight();
			isAnimating = false;

			// normal scrolling
			if ( settings.stacked === 1 ) {
				TweenMax.set( $myPageStack, {
					scrollTo: { y: pageHeight * $current.index() }
				});

			// stack above
			} else if ( settings.stacked === 2 ) {
				TweenMax.set( $current, {
					y : -pageHeight * $current.index()
				});

				if ( $current.next().length ) {
					var start = $current.next().index();
					var end = $sections.length;
					for ( var i = start; i < end; i++ ) {
						TweenMax.set( $sections[i], {
							y : -pageHeight * ( i - 1 )
						});
					}
				}

			// stack below
			} else if ( settings.stacked === 3 ) {
				for ( var o = 0; o < totalNum; o++ ) {
					if ( o < $current.index() ) {
						// those before current
						TweenMax.set( $sections[o], {
							y : -pageHeight * ( o + 1 )
						});
					} else {
						// current and after
						TweenMax.set( $sections[o], {
							y : -pageHeight * ( o )
						});
					}
				}
			}
		}

		// set z-index for stacking below
		if ( settings.stacked === 3 ) {
			for ( var i = 0; i < totalNum; i++ ) {
				TweenMax.set( $sections[i], {
					css : { zIndex: totalNum - i }
				});
			}
		}

		// if there is hidden nav
		if ( settings.hiddenNav ) {
			var $hiddenNav = $( '#hidden-nav ul' ),
				$li = $( 'li' );

			$hiddenNav.on( 'click', 'li', function( e ) {
				var thisIndex = $( this ).index();
				goTo( $sections.parent().children().eq( thisIndex ) );

				$myPageStack.trigger( 'section', 'close' );
			});
		}

		// if there is top nav
		if ( settings.topNav ) {
			var $topNav = $( '#top-nav' ),
				$a = $( 'a' );

			$topNav.on( 'click', 'a', function( e ) {
				var thisIndex = $( this ).index();
				goTo( $sections.parent().children().eq( thisIndex ) );
			});
		}

		// if there is dot nav
		if ( settings.dotNav ) {
			var $dotNav = $( '#dot-nav' ),
				$dot = $( '.dot' );

			$dotNav.on( 'click', 'div', function( e ) {
				var thisIndex = $( this ).index();
				goTo( $sections.parent().children().eq( thisIndex ) );
			});
		}

/*	engine starts
---------------------------------------------------------------------------------- */

		function goPrev() {
			if ( $current.prev().length ) {
				goTo( $current.prev() );
			}
		}

		function goNext() {
			if ( $current.next().length ) {
				goTo( $current.next() );
			} else {
				if ( settings.loopTop ) {
					goTo ( $sections.first() );
				}
			}
		}

		function goTo( $section ) {
			if ( !isAnimating ) {

				isAnimating = true;

				// allow for looser scroll spamming
				// if ( timeOut ) {
				// 	clearTimeout( timeOut );
				// }
				// var timeOut = setTimeout( function() {
				// 	isAnimating = false;
				// }, 333 );

				$current = $section;

				if ( $current.hasClass( 'scroll' ) ) {
					$current.scrollTop( 0 );
					onSwipe[0].disable();
				} else {
					onSwipe[0].enable();
				}

				// hidden, top, dot nav switching
				if ( $hiddenNav || $topNav || $dotNav ) {
					for ( var i = 0; i < totalNum; i++ ) {
						if ( i != $current.index() ) {
							if ( $hiddenNav ) {
								TweenMax.set( $hiddenNav.children().eq( i ), {
									className: '-=active'
								});
							}

							if ( $topNav ) {
								TweenMax.set( $topNav.children().eq( i ), {
									className: '-=active'
								});
							}

							if ( $dotNav ) {
								TweenMax.set( $dotNav.children().eq( i ), {
									className: '-=active'
								});
							}
						} else {
							if ( $hiddenNav ) {
								TweenMax.set( $hiddenNav.children().eq( $current.index() ), {
									className: '+=active'
								});
							}

							if ( $topNav ) {
								TweenMax.set( $topNav.children().eq( $current.index() ), {
									className: '+=active'
								});
							}

							if ( $dotNav ) {
								TweenMax.set( $dotNav.children().eq( $current.index() ), {
									className: '+=active'
								});
							}
						}
					}
				}

				// normal scrolling
				if ( settings.stacked === 1 ) {
					TweenMax.to( $myPageStack, 1, {
						scrollTo   : { y: pageHeight * $current.index() },
						ease       : Expo.easeInOut,
						onComplete : animationEnds
					});

				// stack above
				} else if ( settings.stacked === 2 ) {
					for ( var o = 0; o < totalNum; o++ ) {
						if ( o < $current.index() ) {
							// before
							var oSpeed = o * 0.3;
							TweenMax.to( $sections[o], oSpeed, {
								y          : -pageHeight * o,
								ease       : Expo.easeInOut
							});
						} else if ( o === $current.index() ) {
							// current
							TweenMax.to( $current, 1, {
								y          : -pageHeight * o,
								ease       : Expo.easeInOut,
								onComplete : animationEnds
							});
						} else {
							// after
							var oSpeed2 = 1.3 - ( o * 0.3 );
							TweenMax.to( $sections[o], oSpeed2, {
								y          : -pageHeight * ( o - 1 ),
								ease       : Expo.easeInOut
							});
						}
					}

				// stack below
				} else if ( settings.stacked === 3 ) {
					for ( var u = 0; u < totalNum; u++ ) {
						if ( u < $current.index() ) {
							// before
							var uSpeed = 0.3 + ( u * 0.3 );
							if ( u === $current.index() - 1 ) { uSpeed = 1; }
							TweenMax.to( $sections[u], uSpeed, {
								y : -pageHeight * ( u + 1 ),
								ease       : Expo.easeInOut
							});
						} else if ( u === $current.index() ) {
							// current
							TweenMax.to( $current, 1, {
								y          : -pageHeight * ( u ),
								ease       : Expo.easeInOut,
								onComplete : animationEnds
							});
						} else {
							// after
							var uSpeed2 = 1 - ( u * 0.3 );
							TweenMax.to( $sections[u], uSpeed2, {
								y          : -pageHeight * ( u ),
								ease       : Expo.easeInOut
							});
						}
					}
				}
			}
		}

		function animationEnds() {
			if ( settings.callback === true ) {
				$myPageStack.trigger( 'section', $current.index() );
			}

			isAnimating = false;
		}

/*	engine ends
---------------------------------------------------------------------------------- */

		// always start at first section
		goTo( $current );
	};

})( jQuery, window, document );
