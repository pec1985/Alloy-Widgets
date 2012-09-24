var DELETE_CODE = 8592;
$.del.title = String.fromCharCode(DELETE_CODE);
var delegate = {};

var value = '';
function onKeyPressed(e) {
	var key = e.source.title;
	if(key == String.fromCharCode(DELETE_CODE)) {
		value = value.substring(0, value.length-1); 
	} else {
		value += key;
	}
	if(delegate.onKeyPressed) {
		delegate.onKeyPressed({value: value});
	}
}

exports.setDelegate = function(del) {
	delegate = del;
}
exports.empty = function(){
	value = ''	
}
