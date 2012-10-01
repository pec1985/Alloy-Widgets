exports.getWindow = function() {
	return $.getView();
}
exports.open = function() {
	Ti.API.error('Open!!!');
	exports.getWindow().open();
}