var nav = null;
if(OS_IOS) {
	var win = Ti.UI.createWindow();
	nav = Ti.UI.iPhone.createNavigationGroup({
		window: $.index
	});
	win.add(nav);
	win.open()
} else {
	$.index.open();
}
function openWindow(win) {
	if(OS_IOS) {
		nav.open(win.getWindow());
	} else {
		win.open();
	}
	
}
function openChat(e) {
	openWindow(Alloy.createController('chatwindow'));
}
function openLockScreen(e) {
	openWindow(Alloy.createController('lockscreen'));	
}
