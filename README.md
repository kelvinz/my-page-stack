# myPageStack

A very basic page stacking system.
Learning to create jQuery plugins.

## Assumptions

Assumes usage of:
* [jQuery] (https://jquery.com/) for easier DOM manipulation
* [TweenMax] (https://greensock.com/) for simplier animation controls

## Usage

Add myPageStack.js

```
<script src="js/myPageStack.js"></script>
```

Have a div with the id of my-page-stack.

```
<div id="my-page-stack"></div>
```

Have section divs nested inside my-page-stack.

```
<div id="my-page-stack">
	<div class="section"></div>
	<div class="section"></div>
</div>
```

For dot navs, scrollable sections etc, follow index.html and app.scss for configurations.

Add the script that attaches myPageStack to the page.

```
<script type="text/javascript">
	$( '#my-page-stack' ).myPageStack({
		// change settings or else can remove them
		stacked  : 3,     // 1 is scroll, 2 is stack, 3 is reverse stack
		callback : false, // should there be a callback to section
		dotNav   : true,  // is there a dot menu
		topNav   : true,  // is there a top menu
		loopTop  : false  // loop sections
	});

	// section animations
	$( '#my-page-stack' ).on( 'section', function( e, which ) {
		// which is a number index from 0 to x
		// alert( which );
	});
</script>
```

## Notes ( to self )

* Add tooltip for dot menu buttons
* Combine scolling functions to minimize scripts

Feel free to use this or point out any mistakes.

[@Kelvin___] (https://twitter.com/Kelvin___)
