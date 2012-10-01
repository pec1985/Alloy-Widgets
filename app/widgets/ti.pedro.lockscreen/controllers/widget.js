/**
 * Three different types
 * @type {TYPE_CHANGE}
 * @type {TYPE_NEW}
 * @type {TYPE_CONFIRM}
 */
exports.TYPE_CHANGE 		= TYPE_CHANGE = 3;
exports.TYPE_NEW			= TYPE_NEW = 2;
exports.TYPE_CONFIRM		= TYPE_CONFIRM = 1;

/**
 * All the needed variables
 */
var WINDOW_WIDTH 					= null;
var BACK_BUTTON_TITLE 				= 'Back';
var PASSCODE_TITLE_ENTER 			= L('enter_passcode', 'Enter passcode');
var PASSCODE_TITLE_NEW 				= L('enter_new_passcode', 'Enter new passcode');
var PASSCODE_TITLE_CONFIRM 			= L('confirm_passcode', 'Confirm passcode');
var PASSCODE_TITLE_UNLOCK 			= L('enter_passcode_to_unlock', 'Enter passcode to unlock');
var PASSCODE_TITLE_FAILED 			= L('last_chance_before_resetting_the_app', 'Last chance before resetting the app');
var ERROR_INCORRECT 				= L('auth_error_passcode', 'Incorrect passcode');
var ERROR_DONT_MATCH 				= L('auth_error_passcode_mismatch', 'Passcode mismatch');

var win				= $.getView();
win.orientationModes=[Ti.UI.PORTRAIT];
var mainView		= $.main_view;
var hiddenTextField	= $.hidden_text_field;

var currentPasscodeIndex	= 0;
var currentPasscodeView		= {};
var hasFailAttemps			= false;
var resetPasscode			= false;
var failedAttempts			= 0;
var passCodeView			= [];
// Default type is CONFIRM
var firstStyle				= type = TYPE_CONFIRM;
var attempts				= null;
// Default passcode is 0000
var newPasscode				= currentPasscode = originalPasscode = '0000';

var backButton;
var keypad;
var self = {};
// Delegate object for android
var delegate = {};

if(OS_IOS) {
	// If iOS, create the back button
	backButton = Ti.UI.createButton({title:BACK_BUTTON_TITLE});
}
if(OS_ANDROID) {
	// If android, import the keyboard
	keypad = Alloy.createWidget('ti.pedro.lockscreen', 'keypad');
	keypad.setDelegate(self);	

	// Remove the hiddenTextField for android, we don't need it
	win.remove(hiddenTextField);
}
/**
 * Creates the passcode screens
 * @param  {Object} obj Object containing the width and left position of the screen
 */
function screenView(obj) {
	return Alloy.createWidget('ti.pedro.lockscreen', 'screen', {width: obj.width, left:obj.left});
}
/**
 * Loop as many times as "type" and create the screens
 */
function addScreens() {
	for(var i = 0; i < type; i++){
		// create the passcode screen
		var passCode = screenView({width: WINDOW_WIDTH, left: (WINDOW_WIDTH * i) });
		// add it to the array
		passCodeView.push(passCode);
		// add it to the main view
		mainView.add(passCode.getView());
	}
}
/**
 * Fires on window focus, focus the hidden textfield for iOS
 */
function onWindowFocus() {
	if(OS_IOS) {
		hiddenTextField.focus();
	}
}
/**
 * Fires on window open
 * @param  {Object} e Event of window open
 */
function onWindowOpen(e) {

	var androidWidth = 0;
	if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight){
		androidWidth = Ti.Platform.displayCaps.platformHeight;
	}else{
		androidWidth = Ti.Platform.displayCaps.platformWidth;
	}
	// Gets the window width, win.size.width does not work on Android, bug?
	WINDOW_WIDTH = OS_IOS ? win.size.width : androidWidth;
	// main view with is window width times "type"
	mainView.width = WINDOW_WIDTH * type;
	// Add the screens to the main view
	addScreens();
	// Set the appropiate titles for the passcode screens
	switch(type){
		case TYPE_CHANGE: 
			passCodeView[0].changeTitle(PASSCODE_TITLE_ENTER);
			passCodeView[1].changeTitle(PASSCODE_TITLE_NEW);
			passCodeView[2].changeTitle(PASSCODE_TITLE_CONFIRM);
		break;
		case TYPE_NEW:
			// If this is a new password, switch the resetPasscode flag to true
			resetPasscode = true;
			passCodeView[0].changeTitle(PASSCODE_TITLE_NEW);
			passCodeView[1].changeTitle(PASSCODE_TITLE_CONFIRM);
		break;
		case TYPE_CONFIRM: 
			passCodeView[0].changeTitle(PASSCODE_TITLE_UNLOCK);
		break;
	}
	// Set the current passcode view to the current passcode index
	currentPasscodeView = passCodeView[currentPasscodeIndex];
}

// slide-in / slide-out function
function slideTo(left){
	// Reset the failed attemptes
	failedAttempts = 0;
	// Empty the passcode view
	currentPasscodeView.emptyAll();
	// in case we want to go back, reset the original passcode
	if(type == TYPE_CHANGE){
		currentPasscode = originalPasscode;
	}
	if(OS_ANDROID) {
		// on back button pressed, if this is the very first screen, close the window
		if(type == firstStyle + 1) {
			win.close();
			return;
		}
	}
	// on iOS disable the button to avoid multiple pressed
	if(OS_IOS) {
		backButton.enabled = false;
		// add or remove the button accordngly
		if(type == firstStyle){
			win.leftNavButton = null;
		} else {
			win.leftNavButton = backButton;
		}
	}
	// Empty the hidden textfield, or the android custom keyboard
	exports.empty();
	// reset the current passcode view to the new one
	currentPasscodeView = passCodeView[currentPasscodeIndex];
	// create temporary views to avoid memory leaks after animation, bug?
	var tempView = mainView;
	var tempButton = backButton;
	// slide our view
	mainView.animate({left: left, duration: 300}, function(){
		// set the new left, needed?
		tempView.left = left;
		if(OS_IOS)
			tempButton.enabled = true;
		// null out temp variables, look comment on line 148
		tempButton = null;
		tempView = null;
	});
	
}

// slide to next view
function slideToNext(){
	// reduce the "type" number
	type--;
	// create the newLeft vairable
	var newLeft = mainView.left - WINDOW_WIDTH;
	// increase the current passcode index
	currentPasscodeIndex++;
	// slide to the new left position
	slideTo(newLeft);
}
// slide to previous view
function slideToPrevious(){
	// increase the "type" number
	type++;
	// create the newLeft variable
	var newLeft = mainView.left + WINDOW_WIDTH;
	// decrease the current passcode index
	currentPasscodeIndex--;
	// slide to the new left position
	slideTo(newLeft);
}

// this is the done() function, it's called after the four characters are filled
function done(str){
	// Depending on the current type....
	switch(type){
		// ------------------ we're correctly confirming passcode ------------
		case TYPE_CONFIRM:
			if(newPasscode == currentPasscode && currentPasscode == str){
				if(OS_IOS) {
					// remove the left button, on android
					win.leftNavButton = null;
				}
				// YES! success!
				if(delegate.onSuccess){
					delegate.onSuccess(str);
				}
			} else {
				// OH NO! either incorrect passcode or passcodes don't match
				exports.panic(resetPasscode == true ? ERROR_DONT_MATCH : ERROR_INCORRECT);
			}
			return;
		// ------------------ we're correctly creating a new passcode ------------
		case TYPE_NEW:
			// if new and current passcode are the same, reassign
			// new passcode becomes the entered passcode
			// if the resetPasscode flag is true, the currentPasscode becomes the new passcode
			if(newPasscode == currentPasscode){
				newPasscode = str;
				if(resetPasscode == true){
					currentPasscode = newPasscode;
				}
				// reset passcode? yes, please
				resetPasscode = true;
				// slide to the next screen
				slideToNext();
				return;

			// but if the current passcode is NOT the same as the new passcode
			// then the passcode is incorrent
			} else if(newPasscode != currentPasscode){
				exports.panic(ERROR_INCORRECT);
				return;

			// not sure about this one...
			} else {
				slideToNext();
				return;
			}
		// ------------------ we're trying to change the passcode ------------
		case TYPE_CHANGE:
			// We cannot change the passcode if the current is not the same as the one entered
			if(currentPasscode != str){
				exports.panic(ERROR_INCORRECT);
				return;
			}
			// new and current become the same as the entered passcode
			newPasscode = currentPasscode = str;
			// reset passcode? yes, please
			resetPasscode = true;
			// slide to the next screen
			slideToNext();
			return;
		default:
			// Yeah... dead code, hehe :)
			Ti.API.error('Something went wrong');
			return;
	}
}
/**
 * Fires on every single stroke
 * @param  {Event} e Event from the keyboard, custom made for android
 */
function onTextFieldChange(e) {
	// Store the value in a variable, for easy access
	var value = e.value;
	// Also the length
	var len = value.length;
	// What to do? depends on the number of keys in the hidden textfield or the custom android keypad
	switch(len){
		case 0: currentPasscodeView.emptyValueOfField(1);
				break;
		case 1: currentPasscodeView.changeValueOfField(1);
				currentPasscodeView.emptyValueOfField(2);
				break;
		case 2: currentPasscodeView.changeValueOfField(2);
				currentPasscodeView.emptyValueOfField(3);
				break;
		case 3: currentPasscodeView.changeValueOfField(3);
				currentPasscodeView.emptyValueOfField(4);
				break;
		case 4: currentPasscodeView.changeValueOfField(4);
				break;
	}
	// If we have the four keys...
	if(len >= 4){
		value = value.substr(0,4);
		// call the done function and pass in the value
		done(value);
		if(OS_IOS) {
			// Emoty the hidden textfield for iOS
			hiddenTextField.value = '';
		}
		if(OS_ANDROID) {
			// empty the android keypad
			keypad.empty();
		}
	}
}
// Back listeners
if(OS_IOS) {
	backButton.addEventListener('click', slideToPrevious);
}
if(OS_ANDROID) {
	win.addEventListener('android:back', slideToPrevious);
	// add the keypad to the screen, for android
	win.add(keypad.getView());
	// Delegate method, call the textfield change event
	self.onKeyPressed = onTextFieldChange;
}

//--------- PUBLIC METHODS --------
/**
 * Empties the hidden textfield, then android keypad, and the current passcode screen
 */
exports.empty = function(){
	if(OS_IOS) {
		hiddenTextField.value = '';
	} 
	if(OS_ANDROID) {
		keypad.empty();
	}
	currentPasscodeView.emptyAll();
};
/**
 * Red view with message flashes on the current passcode screen
 * @param  {Strin} text Message
 */
exports.panic = function(text){
	// increase the fail attempts
	failedAttempts++;
	// make sure the text is not null
	text = text || '';
	// Change the text if need be
	// @TODO allow customization from the outside here
	if(attempts && (attempts - 1 == failedAttempts)){
		text = PASSCODE_TITLE_FAILED;
	}
	// Flash!
	currentPasscodeView.panic(text);
	// Empty
	exports.empty();

	// Call the failure callback in case we reached the end
	if(attempts && hasFailAttemps && failedAttempts >= attempts){
		if(delegate.onFailure) {
			delegate.onFailure();
		}
	}
};
/**
 * getWindow
 * @return {Ti.UI.Window} Returns the passcode window
 */
exports.getWindow = function(){
	return win;
};
/**
 * Sets the passcode type
 * @param {TYPE} _type CHANGE, CONFIRM, NEW
 */
exports.setType = function(_type) {
	if(_type != TYPE_CHANGE && _type != TYPE_CONFIRM && _type != TYPE_NEW) {
		Ti.API.error('Type must TYPE_CHANGE, TYPE_CONFIRM, or TYPE_NEW');
		Ti.API.error('Was ' + _type);
		return;
	}
	firstStyle = type = _type;
};
/**
 * Sets the fail attempts boolean to true or false
 * @param  {BOOL}  bool
 */
exports.hasFailAttempts = function(bool) {
	hasFailAttemps = bool;
};
/**
 * Sets the number of allowed fail attempts
 * @param {Number} n number
 */
exports.setNumberOfAttempts = function(n) {
	hasFailAttemps = true;
	attempts = n;
};
/**
 * Sets the default passcode, must be a string of 4 characters
 * @param {String} str Default passcode
 * @default "0000"
 */
exports.setPasscode = function(str) {
	if(!_.isString(str) || str.length != 4) {
		Ti.API.error('setPasscode('+str+')');
		Ti.API.error('passcode must be a four-character string');
		Ti.API.error('defaulting to "0000"');
		return;
	}
	newPasscode	= originalPasscode = currentPasscode = str;
};
/**
 * Sets the delegate
 * @param {Object} del Delegate object
 */
exports.setDelegate = function(del) {
	delegate = del;
};
