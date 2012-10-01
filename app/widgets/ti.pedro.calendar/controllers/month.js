if(!Date.isIncluded) {
	Ti.include('/ti.pedro.calendar/date.js');
}

var args = arguments[0];
var DAY_COLOR = '#EEE';
var DAY_COLOR_SELECTED = '#CCC';

var today = new Date();
var year = args.year || today.getFullYear();
var month = args.month ? args.month + 1 : today.getMonth();

var firstDay = new Date(year,month,1);

var days = [];
for(var i = 1; i < 43; i++) {
	var d = eval('$.day'+i);
	d.applyProperties({
		width: (Ti.Platform.displayCaps.platformWidth + 2) / 7,
		backgroundColor: DAY_COLOR
	})
	days.push(d);
}

var d = 1;
var i = firstDay.getDay();
var len = Date.getDaysInMonth (year, month) + i;

for(i; i < len; i++) {
	days[i].text = d;
	d++;
}

var currentDay = null;
function onDayClick(e) {
	if(!e.source.text) return;
	if(currentDay) {
		currentDay.backgroundColor = DAY_COLOR;
	}
	currentDay = e.source;
	currentDay.backgroundColor = DAY_COLOR_SELECTED;
}