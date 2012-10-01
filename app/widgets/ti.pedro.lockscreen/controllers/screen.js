/**
 * Declared variables to be used
 */

// Properties passed in
var props = arguments[0];
// With and height of this view
var WIDTH = props.width;
var LEFT = props.left;
// For easy access
var mainView	= $.getView();
var box1		= $.box1;
var box2		= $.box2;
var box3		= $.box3;
var box4		= $.box4;
var panicLabel	= $.panic;
var titleLabel	= $.title;
// Devide the width by four to get the four "parts"
var parts		= WIDTH / 4;
var left		= parts / 2;
mainView.left	= LEFT;
mainView.width	= WIDTH;
// Set the center, no matter how big or small the actual boxes are
box1.center = { x: left, y: '60dp'};
box2.center = { x: left + parts * 1, y: '30dp'};
box3.center = { x: left + parts * 2, y: '30dp'};
box4.center = { x: left + parts * 3, y: '30dp'};
/**
 * Empties the value of textfield "n"
 * @param  {Number} n number of textfield
 */
exports.emptyValueOfField = function(n) {
	// What? do not use "eval"? why not? it works just fine
	var box = eval('box'+n);
	box.value = '';
};
/**
 * Changes the value of textfield "n"
 * @param  {Number} n number of textfield
 */
exports.changeValueOfField = function(n) {
	// If not "eval", how in the world am I supposed to get the right box?
	// array? nah! "eval" works fine
	var box = eval('box'+n);
	box.value = '0';
}
/**
 * Empties all of the boxes
 */
exports.emptyAll = function(){
	box1.value = '';
	box2.value = '';
	box3.value = '';
	box4.value = '';
}
/**
 * Changes the title of this view, screen, whatever
 * @param  {String} text Title of the screen
 */
exports.changeTitle = function(text) {
	titleLabel.text = text;
}
/**
 * Flashes red view when called, tricky on Android
 * @param  {String} text Message
 */
exports.panic = function(text) {
	// Empty all	
	exports.emptyAll();
	// Set the opacity to 0, in case it is not already
	panicLabel.opacity = 0;
	// Empty the text
	panicLabel.text = '';
	// Set the text
	panicLabel.text = text;
	// for some reason in Android, this does not work all the time
	// as if, while animating, it cannot restart animating, bug?
	
	// As usual, temporary vaiable to avoid memory leak, bug?
	var tempPanic = panicLabel;
	panicLabel.animate({opacity: 1, duration:100}, function(){
		// Vibrate!
		Ti.Media.vibrate();
		// Change opacity
		tempPanic.opacity = 1;
		// Going one level deeper, create temp variable
		var tempTempPanic = tempPanic;
		tempPanic.animate({opacity: 0, duration: 1000}, function(){
			// reset the opacity
			tempTempPanic.opacity = 0;
			// null it out!
			tempTempPanic = null;
		});
		tempPanic = null;
	});
}
