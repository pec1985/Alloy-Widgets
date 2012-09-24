var self = {};
var lockScreen = $.widget;
var win = lockScreen.getWindow();

lockScreen.setDelegate(self);
lockScreen.setPasscode('1212');
lockScreen.setNumberOfAttempts(4);
lockScreen.setType(lockScreen.TYPE_CHANGE);

// Delegate callbacks
self.onSuccess = function(newPassCode) {
	Ti.API.info('lockScreen.onSuccess()');
	Ti.API.info(newPassCode);
	win.close();
}
self.onFailure = function() {
	Ti.API.error('lockScreen.onFailure()');
	alert('fail, sucker!');
}
exports.getWindow = function(){
	return win;
}
exports.open = function(args) {
	args = args || {};
	win.open();
}
