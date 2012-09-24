exports.TYPE_CHANGE 		= TYPE_CHANGE = 3;
exports.TYPE_NEW			= TYPE_NEW = 2;
exports.TYPE_CONFIRM		= TYPE_CONFIRM = 1;

var WINDOW_WIDTH 					= null;
var BACK_BUTTON_TITLE 				= 'Back';
var PASSCODE_TITLE_ENTER 			= L('enter_passcode', 'Enter passcode');
var PASSCODE_TITLE_NEW 				= L('enter_new_passcode', 'Enter new passcode');
var PASSCODE_TITLE_CONFIRM 			= L('confirm_passcode', 'Confirm passcode');
var PASSCODE_TITLE_UNLOCK 			= L('enter_passcode_to_unlock', 'Enter passcode to unlock');
var PASSCODE_TITLE_FAILED 			= L('last_chance_before_resetting_the_app', 'Last chance before resetting the app');
var ERROR_INCORRECT 					= L('auth_error_passcode', 'Incorrect passcode');
var ERROR_DONT_MATCH 				= L('auth_error_passcode_mismatch', 'Passcode mismatch');


//var params = arguments[0];


var win				= $.getView();
var mainView			= $.main_view;
var hiddenTextField	= $.hidden_text_field;

var currentPasscodeIndex	= 0;
var currentPasscodeView	= {};
var hasFailAttemps	= false;
var resetPasscode	= false;
var failedAttempts	= 0;
var passCodeView	 	= [];

var firstStyle		= type = TYPE_CONFIRM;
var attempts			= null;
var newPasscode		= currentPasscode = originalPasscode = '0000';

var backButton;
var keypad;
var self = {};
var delegate = {};
if(OS_IOS) {
	backButton = Ti.UI.createButton({title:BACK_BUTTON_TITLE});
}
if(OS_ANDROID) {
	keypad = Alloy.createWidget('ti.pedro.lockscreen', 'keypad');
	keypad.setDelegate(self);	
	win.remove(hiddenTextField);
}
function screenView(obj) {
	return Alloy.createWidget('ti.pedro.lockscreen', 'screen', {width: obj.width, left:obj.left});
}
function addScreens() {
	for(var i = 0; i < type; i++){
		// pass in the left property
		var passCode = screenView({width: WINDOW_WIDTH, left: (WINDOW_WIDTH * i) });
		passCodeView.push(passCode);
		mainView.add(passCode.getView());
	}
}

function onWindowFocus() {
	if(OS_IOS) {
		hiddenTextField.focus();
	}
}
function onWindowOpen(e) {
	WINDOW_WIDTH = OS_IOS ? win.size.width : Ti.Platform.displayCaps.platformWidth;
	mainView.width = WINDOW_WIDTH * type;
	addScreens();
	switch(type){
		case TYPE_CHANGE: 
			passCodeView[0].changeTitle(PASSCODE_TITLE_ENTER);
			passCodeView[1].changeTitle(PASSCODE_TITLE_NEW);
			passCodeView[2].changeTitle(PASSCODE_TITLE_CONFIRM);
			break;
		case TYPE_NEW: 
			resetPasscode = true;
			passCodeView[0].changeTitle(PASSCODE_TITLE_NEW);
			passCodeView[1].changeTitle(PASSCODE_TITLE_CONFIRM);
			break;
		case TYPE_CONFIRM: 
			passCodeView[0].changeTitle(PASSCODE_TITLE_UNLOCK);
			break;
	}
	currentPasscodeView = passCodeView[currentPasscodeIndex];
}

// slide-in / slide-out function
function slideTo(left){
	failedAttempts = 0;
	currentPasscodeView.emptyAll();
	// in case we want to go back, reset the original passcode
	if(type == TYPE_CHANGE){
		currentPasscode = originalPasscode;
	}
	if(OS_ANDROID) {
		if(type == firstStyle + 1) {
			win.close();
			return;
		}
	}
	// disable the button to avoid multiple pressed
	if(OS_IOS) {
		backButton.enabled = false;
		// add or remove the button accordngly
		if(type == firstStyle){
			win.leftNavButton = null;
		} else {
			win.leftNavButton = backButton;
		}
	}
	// slide our view
	var tempView = mainView;
	var tempButton = backButton;
	exports.empty();
	currentPasscodeView = passCodeView[currentPasscodeIndex];
	mainView.animate({left: left, duration: 300}, function(){
		tempView.left = left;
		tempView = null;
		if(OS_IOS)
			tempButton.enabled = true;
		tempButton = null;
	});
	
}

// slide to next view
function slideToNext(){
	type--;
	var left = mainView.left;
	var newLeft = left - WINDOW_WIDTH;
	currentPasscodeIndex++;
	slideTo(newLeft);
}
// slide to previous view
function slideToPrevious(){
	type++;
	var left = mainView.left;
	var newLeft = left + WINDOW_WIDTH;
	currentPasscodeIndex--;
	slideTo(newLeft);
}

// this is the done() function, it's called after the four characters are filled
function done(str){
	switch(type){
		// ------------------ we're correctly confirming passcode ------------
		case TYPE_CONFIRM:
			if(newPasscode == currentPasscode && currentPasscode == str){
				if(OS_IOS) {
					win.leftNavButton = null;
				}
				if(delegate.onSuccess)
					delegate.onSuccess(str);
			} else {
				exports.panic(resetPasscode == true ? ERROR_DONT_MATCH : ERROR_INCORRECT);
			}
			return;
		// ------------------ we're correctly creating a new passcode ------------
		case TYPE_NEW:
			if(newPasscode == currentPasscode){
				newPasscode = str;
				if(resetPasscode == true){
					currentPasscode = newPasscode;
				}
			} else if(newPasscode != currentPasscode){
				exports.panic(ERROR_INCORRECT);
				return;
			} else {
				slideToNext();
				return;
			}
		// ------------------ we're trying to change the passcode ------------
		case TYPE_CHANGE:
			if(currentPasscode != str){
				exports.panic(ERROR_INCORRECT);
				return;
			}
			newPasscode = currentPasscode = str;
			resetPasscode = true;
			slideToNext();
			return;
		default:
			Ti.API.error('Something went wrong');
			return;
	}
}

function onTextFieldChange(e) {
	var value = e.value;
	var len = value.length;
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
	if(len >= 4){
		value = value.substr(0,4);
		done(value);
		if(OS_IOS) {
			hiddenTextField.value = '';
		} 
		if(OS_ANDROID) {
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
	win.add(keypad.getView());
	self.onKeyPressed = onTextFieldChange;
}


exports.empty = function(){
	if(OS_IOS) {
		hiddenTextField.value = '';
	} 
	if(OS_ANDROID) {
		keypad.empty();
	}
	currentPasscodeView.emptyAll();
};
exports.panic = function(text){
	failedAttempts++;
	text = text || '';

	if(attempts && (attempts - 1 == failedAttempts)){
		text = PASSCODE_TITLE_FAILED;
	}

	currentPasscodeView.panic(text);
	exports.empty();

	if(attempts && hasFailAttemps && failedAttempts >= attempts){
		if(delegate.onFailure) {
			delegate.onFailure();
		}
	}
};
exports.getWindow = function(){
	return win;
};
exports.setType = function(_type) {
	if(_type != TYPE_CHANGE && _type != TYPE_CONFIRM && _type != TYPE_NEW) {
		Ti.API.error('Type must TYPE_CHANGE, TYPE_CONFIRM, or TYPE_NEW');
		Ti.API.error('Was ' + _type);
		return;
	}
	firstStyle = type = _type;
};
exports.hasFailAttempts = function(bool) {
	hasFailAttemps = bool;
};
exports.setNumberOfAttempts = function(n) {
	hasFailAttemps = true;
	attempts	 = n;
};
exports.setPasscode = function(str) {
	if(!_.isString(str) || str.length != 4) {
		Ti.API.error('setPasscode('+str+')');
		Ti.API.error('passcode must be a four-character string');
		Ti.API.error('defaulting to "0000"');
		return;
	}
	newPasscode	= originalPasscode = currentPasscode = str;
};
exports.setDelegate = function(del) {
	delegate = del;
};
