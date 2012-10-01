var win = $.getView();
var form = $.widget;
var self = {};

var data = [];
for (var  i = 0; i < 10; i++) {
	data.push({
		title: 'Row #'+i,
		value: i % 4 ? 'Value #'+i : null,
		hintText: 'Value #'+i,
		id:i
	});
}
form.setFields(data);
form.setDelegate(self);
form.setTitle('Testing Title');
form.setSubmit('Submit');

self.onSubmit = function(values){
	Ti.API.debug(values)
}

exports.getWindow = function() {
	return win;
}
exports.open = function() {
	Ti.API.error('Open!!!');
	win.open();
}