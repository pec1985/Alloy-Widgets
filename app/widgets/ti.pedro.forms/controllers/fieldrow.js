var args = arguments[0];
var title = $.title;
var field = $.field;

title.text = args.title;
field.value = args.value;
field.hintText = args.hintText;

exports.getId = function() {
	return args.id;
}
exports.getValue = function() {
	return field.value;
}