var self = {};

var ChatWindow = $.widget;
var win = ChatWindow.getWindow();

ChatWindow.setDelegate(self);

self.onSendButtonClick = function(message){
	ChatWindow.createMessage({
		avatar: '/ti.pedro.chatwindow/me.jpg',
		name: 'Me',
		message: message,
		date: new Date()
	});
	ChatWindow.clearTextfield();
}

win.addEventListener('open', function(){
	setTimeout(function(){
	ChatWindow.setMessages([
		{ name: 'John Smith', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ name: 'John Smith', message: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
		{ image: '/me.jpg', message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' },
		{ name: 'John Smith', message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' },
		{ name: 'John Smith', message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ image: '/me.jpg', message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' },
		{ name: 'John Smith', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ name: 'John Smith', message: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
		{ name: 'John Smith', message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ name: 'John Smith', message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ name: 'John Smith', message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat' },
		{ image: '/me.jpg', message: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
		{ name: 'John Smith', message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat' },
		{ name: 'John Smith', message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }
	]);
	},500);
})

exports.open = function(){
	win.open();
}
exports.getWindow = function() {
	return win;
}
