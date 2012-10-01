var table = $.getView();
var delegate = {};

var titleLabel = Ti.UI.createLabel({
	width: Ti.UI.FILL,
	textAlign: 'center',
	font: {
		fontSize: '18',
		fontWeight: 'bold'
	},
	color: 'black'
});
var footerButton = Ti.UI.createButton({
	height: Ti.UI.SIZE,
	left: '20dp',
	right: '20dp'
});

footerButton.addEventListener('click', function(){
	if(delegate.onSubmit) {

		var data = [];

		for(var i = 0, len = rows.length; i < len; i++) {
			var row = rows[i];
			var obj = {
				id: row.getId(),
				value: row.getValue()
			}
			data.push(obj);
		}

		delegate.onSubmit(data);
	}
});

function newRow(obj) {
	obj = obj || {};
	obj.title	= obj.title	|| '';
	obj.value	= obj.value	|| '';
	obj.id		= obj.id;
	obj.hintText= obj.hintText || '';
	return Alloy.createWidget('ti.pedro.forms', 'fieldrow', obj);

}

var rows = [];

exports.setFields = function(array) {
	var tableData = [];
	for(var i = 0, len = array.length; i < len; i++) {
		var r = newRow(array[i]);
		rows.push(r);
		tableData.push(r.getView());
	}
	table.data = tableData;
}
exports.setTitle = function(str) {
	var v = Ti.UI.createView({
		height: '44dp'
	});
	v.add(titleLabel);
	table.headerView = v;
	titleLabel.text = str;
}
exports.setSubmit = function(str) {
	var v = Ti.UI.createView({
		height: '44dp'
	});
	v.add(footerButton);
	table.footerView = v;
	footerButton.title = str;
}
exports.addField = function(obj) {
	var r = newRow(obj);
	rows.push(r);
	table.appendRow(r.getView());
}

exports.getFiedById = function (id) {
	for(var i = 0, len = rows.length; i < len; i++) {
		if(rows[i].getId() == id) return rows[i];
	}
	return null;
}
exports.setDelegate = function(del) {
	delegate = del;
}