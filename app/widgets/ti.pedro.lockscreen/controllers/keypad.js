// Code for string arrow pointing back
var DELETE_CODE = 8592;
$.del.title = String.fromCharCode(DELETE_CODE);
// delegate object
var delegate = {};
// value if ""
var value = '';
// Fired on button click
function onKeyPressed(e) {
	// get the key, which is the title
	var key = e.source.title;
	// but if it is the back button, delete one for the "value"
	if(key == String.fromCharCode(DELETE_CODE)) {
		value = value.substring(0, value.length-1); 
	} else {
		value += key;
	}
	// Call the delegate callback
	if(delegate.onKeyPressed) {
		delegate.onKeyPressed({value: value});
	}
}
/**
 * Sets the delegate object
 * @param {Object} del delegate object
 */
exports.setDelegate = function(del) {
	delegate = del;
};
/**
 * Empties the value
 * @return {[type]} [description]
 */
exports.empty = function(){
	value = '';
};
