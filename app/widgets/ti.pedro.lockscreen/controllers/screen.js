var props = arguments[0];

var WIDTH = props.width;
var LEFT = props.left;

var mainView = $.getView();
var box1 = $.box1;
var box2 = $.box2;
var box3 = $.box3;
var box4 = $.box4;
var panicLabel = $.panic;
var titleLabel = $.title;
var parts = WIDTH / 4;
var left = parts / 2;
mainView.left = LEFT;
mainView.width = WIDTH;

box1.center = { x: left, y: '60dp'};
box2.center = { x: left + parts * 1, y: '30dp'};
box3.center = { x: left + parts * 2, y: '30dp'};
box4.center = { x: left + parts * 3, y: '30dp'};

exports.emptyValueOfField = function(n) {
	var box = eval('box'+n);
	box.value = '';
}
exports.changeValueOfField = function(n) {
	var box = eval('box'+n);
	box.value = '0';
}
exports.emptyAll = function(){
	box1.value = '';
	box2.value = '';
	box3.value = '';
	box4.value = '';
}
exports.changeTitle = function(text) {
	titleLabel.text = text;
}
exports.panic = function(text) {
	Ti.API.debug('panic? hello??');
	
	exports.emptyAll();
	panicLabel.opacity = 0;
	panicLabel.text = '';
	panicLabel.text = text;
	// for some reason in Android, this does not work all the time
	// as if, while animating, it cannot restart
	var tempPanic = panicLabel;
	tempPanic.animate({opacity: 1, duration:100}, function(){
		Ti.Media.vibrate();
		tempPanic.opacity = 1;
		var tempTempPanic = tempPanic;
		tempTempPanic.animate({opacity: 0, duration: 1000}, function(){
			tempTempPanic.opacity = 0;
			tempTempPanic = null;
		});
		tempPanic = null;
	});
}
