var passedObject = arguments[0];
var message = $.message;
var date = $.date;
var name = $.name;
var avatar = $.avatar;

function formatDate(date) {
	if(!_.isDate(date)) return date;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    if(hour < 10) hour = '0' + hour;
    if(minutes < 10) minutes = '0' + minutes;
    if(seconds < 10) seconds = '0' + seconds;

    return months[month] + ' ' + day + ', ' + year + ' ' + hour + ':' + minutes + ':' + seconds;
}

message.text = passedObject.text || '';
date.text = formatDate(passedObject.date || new Date());
name.text = passedObject.name || L('me', 'Me');

if(passedObject.image) {
	avatar.image = passedObject.image;
}


exports.getRow = function(){
	return $.getView();
}
