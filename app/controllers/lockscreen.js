/**
 * LockScreen widget for Alloy!
 * Pedro Enrique 
 * @pecdev September 2012
 *
 * 	Methods:
 *		.empty()					 - Empties the current passcode
 *		.panic(String)				 - Empties the current passcode, and shows a warning text in red background
 *  	.setType(Number)			 - Sets the type of the lockscreen, see constants bellow
 *  	.getWindow()				 - Returns the window
 *  	.hasFailAttempts(Boolean)	 - Wether or not there's a limit of failed attempts
 *  	.setNumberOfAttempts(Number) - Sets the number of attempts before "last chance" warning
 *  	.setPasscode(String)		 - Sets the expected passcode, must be four-character sctring
 *  	.setDelegate(Object)		 - Assigns the delegate callback object
 *
 * 	Callbacks
 * 		.onSuccess(string)			 - Gets fired when all the passcode screens are completed, returns the (new) passcode
 * 		.onFailure()				 - Gets fired when the passcode fails for the last time (number of attempts)
 * 		
 *	Constants:
 *		.TYPE_CHANGE				 - Three screens are presented
 *		.TYPE_NEW					 - Two screens are presented
 *		.TYPE_CONFIRM				 - One screen is presented
 *
 */

var self		= {};
// Get the widget from the markup
var LockScreen	= $.widget;
// Get the window from the widget
var win			= LockScreen.getWindow();
var nav			= null;

// Set the delegate to the "self" object
LockScreen.setDelegate(self);
// Set a new passcode (defaults to 0000)
LockScreen.setPasscode('1212');
// Set the number of attempts
LockScreen.setNumberOfAttempts(4);
// Set the passcode type
LockScreen.setType(LockScreen.TYPE_CHANGE);

// Delegate callbacks
self.onSuccess = function(newPassCode) {
	Ti.API.info('LockScreen.onSuccess()');
	Ti.API.info(newPassCode);
	if(OS_IOS){
		nav.close(win);
	} else {
		win.close();
	}
}
self.onFailure = function() {
	Ti.API.error('LockScreen.onFailure()');
	alert('fail, sucker!');
}
exports.getWindow = function(_nav){
	nav = _nav;
	return win;
}
exports.open = function(args) {
	args = args || {};
	win.open();
}
