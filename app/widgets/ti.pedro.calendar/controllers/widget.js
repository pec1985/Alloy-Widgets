var mainView = $.month_container;
var width = Ti.Platform.displayCaps.platformWidth;

mainView.applyProperties({
	width: width * 3,
	left: -width
})

function createMonth(args) {
	var month = Alloy.createWidget('ti.pedro.calendar', 'month', args);

	return month.getView();
}

var currentMonth = 1;
var currentYear = 2012;
currentMonth--;
var prev = createMonth({month:currentMonth++,year:currentYear});
var curr = createMonth({month:currentMonth++,year:currentYear});
var next = createMonth({month:currentMonth++,year:currentYear});
curr.left = width;

mainView.add(curr);

function moveToNext() {

	if(currentMonth > 11) {
		currentMonth = 1;
		currentYear ++;
	}

	mainView.animate({left: -1 * (width*2), duration:300}, function(){
		mainView.left = -width;
		next.left = width;
		mainView.remove(curr);
		curr = next;
		next = createMonth({month:currentMonth++,year:currentYear});
	});
}
function moveToPrev() {

	if(currentMonth < 1) {
		currentMonth = 11;
		currentYear --;
	}

	mainView.animate({left: 0, duration:300}, function(){
		mainView.left = -width;
		prev.left = width;
		mainView.remove(curr);
		curr = prev;
		prev = createMonth({month:currentMonth--,year:currentYear});
	});
}

function onClickNext() {
	next.left = width*2;
	mainView.add(next);
	moveToNext();
}
function onClickPrev() {
	prev.left = 0;
	mainView.add(prev);
	moveToPrev();
}