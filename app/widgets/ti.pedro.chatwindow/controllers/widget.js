// Store in variables for easy access
var win				= $.getView();
var sendButton		= $.send_button;
var textfieldBar	= $.textfield_bar;
var textfield		= $.textfield;
var messageView		= $.message_view;
var sendButton		= $.send_button;
var delegate		= {};

// Creates a new message row
function newRow(image, message, name, date) {
	var rowWidget = Alloy.createWidget('ti.pedro.chatwindow', 'messagerow', {
		text: message.replace(/^\s+/,'').replace(/\s+$/,''),
		image: image,
		name: name,
		date: date
	});
	return rowWidget.getRow();
}

exports.getWindow = function(){
	return win;
};
exports.clearTextfield = function() {
	textfield.value = '';
};
exports.setTextfieldValue = function(val) {
	textfield.value = val;
};
exports.getTextfieldValue = function() {
	return textfield.value;
};
exports.scrollToBottom = function() {
	if(messageView.data[0] && messageView.data[0].rows)
		messageView.scrollToIndex(messageView.data[0].rows.length);
}
exports.setDelegate = function(del) {
	delegate = del;
};
exports.createMessage = function(rowInfo) {
	messageView.appendRow(newRow(rowInfo.image, rowInfo.message, rowInfo.name, rowInfo.date));
	exports.scrollToBottom();
};
exports.setMessages = function(array) {
	var data = [];
	for(var i = 0, len = array.length; i < len; i++) {
		var rowInfo = array[i];
		data.push(newRow(rowInfo.image, rowInfo.message, rowInfo.name, rowInfo.date));
	}
	messageView.setData(data);
	exports.scrollToBottom();
};

exports.addMessages = function(array) {
	for(var i = 0, len = array.length; i < len; i++) {
		var rowInfo = array[i];
		messageView.appendRow(newRow(rowInfo.image, rowInfo.message, rowInfo.name, rowInfo.date));
	}
	exports.scrollToBottom();
};

if(OS_ANDROID){
	textfieldBar.addEventListener('postlayout', function(e){
		if(e.source && e.source.size && e.source.size.height)
			messageView.bottom = textfieldBar.size.height;
	});
}
if(OS_IOS) {
	var x = 0;
	textfield.addEventListener('change', function(e){
		textfield.height = Ti.UI.SIZE;
		Ti.API.error('-=-=-=-=-' + x);
		x++;
		Ti.API.error(textfield.size.height);
		Ti.API.error(textfieldBar.size.height);
		if(textfield.size.height < textfieldBar.size.height - 10) {
			textfield.height = textfieldBar.size.height - 10;
		}
		messageView.bottom = textfieldBar.size.height + textfieldBar.rect.bottom;
	});
};
textfield.addEventListener('focus', function() {
	if(delegate.onFocus) {
		delegate.onFocus();
	}
	exports.scrollToBottom();
});

sendButton.addEventListener('click', function(){
	var str = textfield.value || '';
	str = str.replace(/^\s+/,'').replace(/\s+$/,'');
	
	if(delegate.onSendButtonClick && str.length > 0) {
		delegate.onSendButtonClick(textfield.value)
	}
});

function onKeyboardFrameChange(e) {
	Ti.API.info(e);
	textfieldBar.bottom = e.keyboardFrame.height;
}
if(OS_IOS) {
	win.addEventListener('focus', function(){
		Ti.App.addEventListener('keyboardFrameChanged', onKeyboardFrameChange);
	});
	win.addEventListener('blur', function(){
		Ti.App.removeEventListener('keyboardFrameChanged', onKeyboardFrameChange)
	});
}
