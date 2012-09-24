var self = {};

var SMSWindow = $.widget;
var win = SMSWindow.getWindow();

SMSWindow.setDelegate(self);

self.onSendButtonClick = function(message){
	SMSWindow.createMessage({
		avatar: '/ti.pedro.smsview/me.jpg',
		name: 'Me',
		message: message,
		data: new Date()
	});
	SMSWindow.clearTextfield();
}

win.addEventListener('open', function(){
	setTimeout(function(){
	SMSWindow.setMessages([
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
		{ image: '/me.jpg', message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ image: '/me.jpg', message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' },
		{ image: '/me.jpg', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat' },
		{ image: '/me.jpg', message: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat' },
		{ image: '/rick.jpg', name: 'Rick Blalock', message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' },
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
