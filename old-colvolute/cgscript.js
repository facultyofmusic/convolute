/**
 * 
 * Interaction models from Dygraphs.  NOT MY CODE!
 *
 */

// Code for a variety of interaction models. Used in interaction.html, but split out from
// that file so they can be tested in isolation.
//
function downV3(event, g, context) {
	context.initializeMouseDown(event, g, context);
	if (event.altKey || event.shiftKey) {
		Dygraph.startZoom(event, g, context);
	} else {
		Dygraph.startPan(event, g, context);
	}
}

function moveV3(event, g, context) {
	if (context.isPanning) {
		Dygraph.movePan(event, g, context);
	} else if (context.isZooming) {
		Dygraph.moveZoom(event, g, context);
	}
}

function upV3(event, g, context) {
	if (context.isPanning) {
		Dygraph.endPan(event, g, context);
	} else if (context.isZooming) {
		Dygraph.endZoom(event, g, context);
	}
}

// Take the offset of a mouse event on the dygraph canvas and
// convert it to a pair of percentages from the bottom left. 
// (Not top left, bottom is where the lower value is.)
function offsetToPercentage(g, offsetX, offsetY) {
  // This is calculating the pixel offset of the leftmost date.
  var xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
  var yar0 = g.yAxisRange(0);

  // This is calculating the pixel of the higest value. (Top pixel)
  var yOffset = g.toDomCoords(null, yar0[1])[1];

  // x y w and h are relative to the corner of the drawing area,
  // so that the upper corner of the drawing area is (0, 0).
  var x = offsetX - xOffset;
  var y = offsetY - yOffset;

  // This is computing the rightmost pixel, effectively defining the
  // width.
  var w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;

  // This is computing the lowest pixel, effectively defining the height.
  var h = g.toDomCoords(null, yar0[0])[1] - yOffset;

  // Percentage from the left.
  var xPct = w == 0 ? 0 : (x / w);
  // Percentage from the top.
  var yPct = h == 0 ? 0 : (y / h);

  // The (1-) part below changes it from "% distance down from the top"
  // to "% distance up from the bottom".
  return [xPct, (1-yPct)];
}

function dblClickV3(event, g, context) {
  // Reducing by 20% makes it 80% the original size, which means
  // to restore to original size it must grow by 25%

  if (!(event.offsetX && event.offsetY)){
  	event.offsetX = event.layerX - event.target.offsetLeft;
  	event.offsetY = event.layerY - event.target.offsetTop;
  }

  var percentages = offsetToPercentage(g, event.offsetX, event.offsetY);
  var xPct = percentages[0];
  var yPct = percentages[1];

  if (event.ctrlKey) {
  	zoom(g, -.25, xPct, yPct);
  } else {
  	zoom(g, +.2, xPct, yPct);
  }
}

var lastClickedGraph = null;

function clickV3(event, g, context) {
	lastClickedGraph = g;
	Dygraph.cancelEvent(event);
}

function scrollV3(event, g, context) {
	if (lastClickedGraph != g) {
		return;
	}
	var normal = event.detail ? event.detail * -1 : event.wheelDelta / 40;
  // For me the normalized value shows 0.075 for one click. If I took
  // that verbatim, it would be a 7.5%.
  var percentage = normal / 50;

  if (!(event.offsetX && event.offsetY)){
  	event.offsetX = event.layerX - event.target.offsetLeft;
  	event.offsetY = event.layerY - event.target.offsetTop;
  }

  var percentages = offsetToPercentage(g, event.offsetX, event.offsetY);
  var xPct = percentages[0];
  var yPct = percentages[1];

  zoom(g, percentage, xPct, yPct);
  Dygraph.cancelEvent(event);
}

// Adjusts [x, y] toward each other by zoomInPercentage%
// Split it so the left/bottom axis gets xBias/yBias of that change and
// tight/top gets (1-xBias)/(1-yBias) of that change.
//
// If a bias is missing it splits it down the middle.
function zoom(g, zoomInPercentage, xBias, yBias) {
	xBias = xBias || 0.5;
	yBias = yBias || 0.5;
	function adjustAxis(axis, zoomInPercentage, bias) {
		var delta = axis[1] - axis[0];
		var increment = delta * zoomInPercentage;
		var foo = [increment * bias, increment * (1-bias)];
		return [ axis[0] + foo[0], axis[1] - foo[1] ];
	}
	var yAxes = g.yAxisRanges();
	var newYAxes = [];
	for (var i = 0; i < yAxes.length; i++) {
		newYAxes[i] = adjustAxis(yAxes[i], zoomInPercentage, yBias);
	}

	g.updateOptions({
		dateWindow: adjustAxis(g.xAxisRange(), zoomInPercentage, xBias),
		valueRange: newYAxes[0]
	});
}







/**
 *
 */



 var leftSideFunction;
 var rightSideFunction;
 var resultFunction;

 var selectedItem;

 var GLOBAL_DATA_RANGE = {
 	low: -500,
 	high: 500
 };

 var functions = {
 	'Identity': {
 		low: GLOBAL_DATA_RANGE.low, 
 		high: GLOBAL_DATA_RANGE.high, 
 		fString : 'function(x) {\n  return (x >= 0) ? x : 0;\n}',
 		sample: null
 	},
 	'Sine': {
 		low : GLOBAL_DATA_RANGE.low,
 		high : GLOBAL_DATA_RANGE.high,
 		fString : 'function(x) {\n  return (x >= 0) ? Math.sin(x/2/Math.PI) : 0;\n}',
 		sample: null
 	},
 	'Square-wave': {
 		low: -10,
 		high: 10,
 		fString: 'function(x) {\n  return (Math.abs(x) < 5) ? 1 : 0;\n}',
 		sample: null
 	},
 	'Unit-step': {
 		low: -1, 
 		high: GLOBAL_DATA_RANGE.high, 
 		fString: 'function(x) {\n  return (x >= 0) ? 1 : 0;\n}',
 		sample: null
 	},
 	'Differentiate':{
 		low: -5, 
 		high: 5, 
 		fString: 'function(x) {\n  if(x == -1) return 1; if(x == 1) return -1; return 0;\n}' ,
 		sample: null
 	},
 	'Delta':{
 		low: -1, 
 		high: 1, 
 		fString: 'function(x) {\n  return (x == 0) ? 1 : 0;\n}' ,
 		sample: null
 	},
 	'e':{
 		low: -1, 
 		high: GLOBAL_DATA_RANGE.high, 
 		fString: 'function(x) {\n  return (x >= 0) ? Math.exp(-x/5.0) : 0;\n}' ,
 		sample: null
 	},
 	'N-Square':{
 		low: -1, 
 		high: GLOBAL_DATA_RANGE.high, 
 		fString: 'function(x) {\n  return (x >= 0) ? x*x : 0;\n}' ,
 		sample: null
 	}
 };


 discreteSignalPlotter = function (e) {
 	var ctx = e.drawingContext;
 	var points = e.points;
	// see http://dygraphs.com/jsdoc/symbols/Dygraph.html#toDomYCoord
	var y_bottom = e.dygraph.toDomYCoord(0);  

  // This should really be based on the minimum gap
  // var bar_width = 2/3 * (points[1].canvasx - points[0].canvasx);
  var bar_width = 1;
  ctx.fillStyle = e.color;

  // Do the actual plotting.
  for (var i = 0; i < points.length; i++) {
  	var p = points[i];
    var center_x = p.canvasx;  // center of the bar

    ctx.fillRect(center_x - bar_width / 2, p.canvasy,
    	bar_width, y_bottom - p.canvasy);

    ctx.strokeRect(center_x - bar_width / 2 - 1, p.canvasy - 1,
    	3, 3);
}
}


var large_graph_style = {
	plotter: discreteSignalPlotter,
	colors: ['#70DB98', '#FF00FF'],
 	//strokeWidth: 1.5,
	//displayAnnotations: false,
	gridLineColor: 'rgb(90, 90, 90)',
	drawYGrid: true,
	drawYAxis: true,
	drawAxisAtZero: true,
	axisLabelFontSize: 10,
	axisLabelColor: "white",
	axisLineColor: "white",
	drawAxesAtZero: true,
	animatedZooms: true,
	yAxisLabelWidth:20,
	labelsDivStyles: {
		'font-size':'100%',
		'background':'none',
		'margin-top':'-10px',
		'display':'none'
	},
	interactionModel : {
		'mousedown' : downV3,
		'mousemove' : moveV3,
		'mouseup' : upV3,
		'click' : clickV3,
		'dblclick' : dblClickV3,
		'mousewheel' : scrollV3
	},
	connectSeparatedPoints: false,
	stepPlot: true
};

function contractItem(item) {
	$(item).removeClass('active').animate({ paddingTop: 0 });
	$(item).children('.contents').slideUp();
}

function expandItem(item) {
	$(item).addClass('active').animate({ paddingTop: 10 });
	$(item).children('.contents').slideDown(function(){
		var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false,window,0);
		window.dispatchEvent(evt);
	});
}

function showFunctionEditor(){
	$("#rightsidebar").animate({ right:0 });
	editor.resize();
}

function hideFunctionEditor(){
	$("#rightsidebar").animate({ right:-500 });
	editor.resize();
}


function toggleFunctionEditor(){
	if($("#rightsidebar").css('right') == '0px'){
		hideFunctionEditor();
	}else{
		showFunctionEditor();
	}
}

function showFunctionPropertiesPanel(){
	$('#function-properties-container').animate({
		bottom: 0
	}, { duration: 200, queue: false });
	$("#function-editor").animate({
		bottom: 125
	}, { duration: 0, queue: false });

	editor.resize();
}

function hideFunctionPropertiesPanel(){
	$('#function-properties-container').animate({
		height: -125
	}, { duration: 200, queue: false });
	$("#function-editor").animate({
		bottom: 0
	}, { duration: 200, queue: false });

	editor.resize();
}

function sampleData(fn){
	var data = [];

	eval('___TEMP_FUNC = ' + fn.fString);

	for(var n = GLOBAL_DATA_RANGE.low; n < fn.low; n++){
		data.push([n, 0]);
	}

	for (var n = fn.low; n <= fn.high; n++) {
		var row = [n];
		row.push(___TEMP_FUNC(n));
		data.push(row);
	}

	for(var n = fn.high+1; n <= GLOBAL_DATA_RANGE.high; n++){
		data.push([n, 0]);
	}

	return data;
}

function resampleFunction(fn){
	fn.sample = sampleData(fn);
}

function convolutionSum(fnStatic, fnMoving, n){
 	// 'Sine': {
 	// 	low : GLOBAL_DATA_RANGE.low,
 	// 	high : GLOBAL_DATA_RANGE.high,
 	// 	fString : 'function(x) {\n  return Math.sin(x/2/Math.PI);\n}',
 	// 	sample: null
 	// },

 	eval('_STATIC_FUNC = ' + fnStatic.fString);
 	eval('_MOVING_FUNC = ' + fnMoving.fString);


 	var start = Math.max(fnStatic.low, -fnMoving.high + n);
 	var end = Math.min(fnStatic.high, -fnMoving.low + n);
 	var sum = 0;

 	for(var i = start; i <= end; i++){
 		sum += _STATIC_FUNC(i) * _MOVING_FUNC(n - i);
 	}

 	return sum;
 }

 function convolute(fnStatic, fnMoving){
 	console.log("CONVOLUTING!");
 	console.log(fnStatic);
 	console.log(fnMoving);
 	var startN = fnStatic.low + fnMoving.low;
 	var endN = fnStatic.high + fnMoving.high;
 	console.log('START: ' + startN + ', END: ' + endN);

 	var data = [];

 	for(var n = GLOBAL_DATA_RANGE.low + 1; n < startN; n++){
 		data.push([n, 0]);
 	}

 	for (var n = startN; n <= endN; n++) {
 		var row = [n];
 		row.push(convolutionSum(fnStatic, fnMoving, n));
 		data.push(row);
 	}

 	for(var n = endN+1; n < GLOBAL_DATA_RANGE.high; n++){
 		data.push([n, 0]);
 	}

 	// return data;
 	return {
 		low : startN,
 		high : endN,
 		fString : 'function(x) {\n  //convolute(...);\n}',
 		sample: data
 	}
 }

 function addNewFunctionToList(name, fn){
 	var html = '';
 	html += '<div class="item">';
 	html += '    <div class="title">' + name + '</div>';
 	html += '    <div class="contents">';
 	html += '        <table>';
 	html += '            <tr>';
 	html += '                <td>Non-Zero Range:</td>';
 	html += '                <td>[' + fn.low + ', ' + fn.high + ']</td>';
 	html += '           </tr>';  
 	html += '           <tr>';
 	html += '                <td>' + 'OTHER' + ':</td>';
 	html += '                <td><div class="segmented"> PLACE HOLDER </div></td>';
 	html += '           </tr>';
 	html += '        </table>';
 	html += '        <div class="small-graph" id="small-graph-' + name + 
 	'" style="width:235px; height:100px;"></div>';
 	html += '        <div id=' + name + ' class="button send-to-graph1">Set Red</div>';
 	html += '        <div id=' + name + ' class="button send-to-graph2">Set Blue</div>';
 	html += '        <div id=' + name + ' class="button edit">Edit</div>';
 	html += '    </div>';
 	html += '</div>';
 	var item = $(html).appendTo('#leftsidebar')[0];

 	plotToID('small-graph-' + name, fn);
 }

 function plotToID(container_id, fn) {
	//eval("fn = " + eq);

	var graph = document.getElementById(container_id);

	if(fn.sample == null){
		resampleFunction(fn);
	}

	g = new Dygraph(graph, fn.sample, large_graph_style);
	g.updateOptions({
		dateWindow: [-15, 15]
	});

	return g;
}



$(document).ready(function () {

	splitWidth = ($(window).width() - 267)/2;
	splitHeight = ($(window).height() - 75)/3;

	$('#graph_div1').css({
		'width': splitWidth +'px',
		'height': splitHeight + 'px'
	});


	$('#graph_div2').css({
		'width':splitWidth +'px',
		'height': splitHeight + 'px'
	});


	$('#secondContainer').css({
		'left':(splitWidth + 10)+'px'
	});


	$('#graph_result').css({
		'width':($(window).width() - 260) +'px',
		'height': (splitHeight*2) + 'px'
	});


	$('#resultContainer').css({
		'top': (splitHeight+12) + 'px'
	});

	// leftSideFunction = plotToID('graph_div1', functions['Identity']);
	// rightSideFunction = plotToID('graph_div2', functions['Identity']);
	// resultFunction = plotToID('graph_result', functions['Identity']);

	/**
	 *	ADD preset functions to functons list
	 */
	 $('<h3 class="side-bar-title">' + 'Preset functions:' + '</h3>').appendTo('#leftsidebar');
	 for(var key in functions){
	 	addNewFunctionToList(key, functions[key]);
	 }

    /**
     * Make custom functions space.
     */
     $('<h3 class="side-bar-title">' + 'Custom functions:' + '</h3>').appendTo('#leftsidebar');




     $('.send-to-graph1').click(function() {
     	leftSideFunction = functions[this.id];
     	plotToID('graph_div1', functions[this.id]);
     });


     $('.send-to-graph2').click(function() {
     	rightSideFunction = functions[this.id];
     	plotToID('graph_div2', functions[this.id]);
     });


     $('.edit').click(function() {
     	showFunctionPropertiesPanel();
     	showFunctionEditor();

     	var editor = ace.edit("function-editor");
     	editor.resize();
     	editor.setValue(functions[this.id].fString);
	    // editor.gotoLine(lineNumber);
	    editor.setReadOnly(false);


	    
	});

     $('.accept').click(function() {
        //contractItem(selectedItem);
        
        // here we put in the graph we want
        console.log("Putting in graph of " + this.id);

        alert('push to main screen!');


        //selectedItem = null;
    });

     $('#new-function').click(function() {
        convolutedFunction = convolute(leftSideFunction, rightSideFunction);
        plotToID('graph_result', convolutedFunction);
    });

     $('#convolute').click(function() {
        convolutedFunction = convolute(leftSideFunction, rightSideFunction);
        plotToID('graph_result', convolutedFunction);
    });

     $('#toggle-editor').click(function() {
     	toggleFunctionEditor();
     });

	// Change the filter when a leftsidebar item is clicked
	$('#leftsidebar .item .title').click(function(e) {
		var item = e.target.parentNode;
		if (selectedItem) contractItem(selectedItem);
		if (selectedItem != item) {
			expandItem(item);
			selectedItem = item;

			'setSelectedFilter(item.filter);'
		} else {
			'setSelectedFilter(null);'
			selectedItem = null;
		}
	});



	$('#loading').hide();

});




