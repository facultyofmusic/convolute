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





 var selectedItem;

 var presets = {
 	'Identity': {
 		low: -10, 
 		high: 10, 
 		fString : 'function(x) {\n  return x;\n}'
 	},
 	'Sine': {
 		low : -10,
 		high : 10,
 		fString : 'function(x) {\n  return Math.sin(x);\n}' 
 	},
 	'Square-wave': {
 		low: -10,
 		high: 10,
 		fString: 'function(x) {\n  var y = 0;\n  for (var i = 1; i < 20; i+=2) {'+
 				'\n    y += Math.sin(i * x)/i;\n  }\n'+
 				'  var final = 1 - 2*(Math.abs(Math.floor(x / Math.PI)) % 2);\n' +
 				'  return [4/Math.PI * y, final];\n}'
 	},
 	'Unit-step': {
 		low: -10, 
 		high: 10, 
 		fString: 'function(x) {\n  return (x > 0) ? 1 : 0;\n}'
 	},
 	'Delta':{
 		low: -10, 
 		high: 10, 
 		fString: 'function(x) {\n  return (x == 0) ? 1 : 0;\n}' 
 	}
 };

 var large_graph_style = {
 	strokeWidth: 1.5,
	//displayAnnotations: false,
	gridLineColor: 'rgb(196, 196, 196)',
	drawYGrid: true,
	drawYAxis: true,
	axisLabelFontSize: 10,
	axisLabelColor: "white",
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
	}
};


function addNewFunctionToList(name, fModel){
	var html = '';
	html += '<div class="item">';
	html += '    <div class="title">' + name + '</div>';
	html += '    <div class="contents">';
	html += '        <table>';
	html += '            <tr>';
	html += '                <td>Non-Zero Range:</td>';
	html += '                <td>[' + fModel.low + ', ' + fModel.high + ']</td>';
	html += '           </tr>';  
	html += '           <tr>';
	html += '                <td>' + 'OTHER' + ':</td>';
	html += '                <td><div class="segmented"> PLACE HOLDER </div></td>';
	html += '           </tr>';
	html += '        </table>';
	html += '        <div class="small-graph" id="small-graph-' +name + '" style="width:235px; height:100px;"></div>';
	html += '        <div id=' + name + ' class="button accept">Accept</div>';
	html += '        <div id=' + name + ' class="button edit">Edit function</div>';
	html += '    </div>';
	html += '</div>';
	var item = $(html).appendTo('#leftsidebar')[0];

	plotToID('small-graph-' + name, fModel.fString, -5, 5);
}

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

function plotToID(container_id, fn, low, high) {
	//eval("fn = " + eq);

	var graph = document.getElementById(container_id);

	//console.log(fn);

	eval('graph_function = ' + fn);

	var width = parseInt(graph.style.width);
	var x1 = low;
	var x2 = high;
	var xs = 1.0 * (x2 - x1) / width;

	var data = [];
	for (var i = 0; i < width; i++) {
		var x = x1 + i * xs;
		var y = graph_function(x);
		var row = [x];
		if (y.length > 0) {
			for (var j = 0; j < y.length; j++) {
				row.push(y[j]);
			}
		} else {
			row.push(y);
		}
		data.push(row);
	}

	g = new Dygraph(graph, data, large_graph_style);
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





	fn = function(x) {
		var y = 0;
		for (var i = 1; i < 10; i+=2) {
			y += Math.sin(i * x)/i;
		}
		var final = 1 - 2*(Math.abs(Math.floor(x / Math.PI)) % 2);
		return [4/Math.PI * y, final];
	}

	var graph = document.getElementById("graph_div1");
	var width = parseInt(graph.style.width);
	var x1 = -10;
	var x2 = 10;
	var xs = 1.0 * (x2 - x1) / width;

	var data = [];
	for (var i = 0; i < width; i++) {
		var x = x1 + i * xs;
		var y = fn(x);
		var row = [x];
		if (y.length > 0) {
			for (var j = 0; j < y.length; j++) {
				row.push(y[j]);
			}
		} else {
			row.push(y);
		}
		data.push(row);
	}

	g = new Dygraph(document.getElementById("graph_div1"), data, large_graph_style);
	g = new Dygraph(document.getElementById("graph_div2"), data, large_graph_style);
	g = new Dygraph(document.getElementById("graph_result"), data, large_graph_style);

	/**
	 * 		ADD preset functions to functons list
	 *
	 */
	// test adding things to the sidebar
	$('<h3 class="side-bar-title">' + 'Preset functions:' + '</h3>').appendTo('#leftsidebar');
	// Generate the HTML for preset functions
	for(var key in presets){
		addNewFunctionToList(key, presets[key]);
	}

    /**
     * Make custom functions space.
     */
     $('<h3 class="side-bar-title">' + 'Custom functions:' + '</h3>').appendTo('#leftsidebar');







     $('.edit').click(function() {
     	var editor = ace.edit("function-editor");
     	editor.setValue(presets[this.id][2]);
        //editor.gotoLine(lineNumber);
        editor.setReadOnly(false);
    });

     $('.accept').click(function() {
        //contractItem(selectedItem);
        
        // here we put in the graph we want
        console.log("Putting in graph of " + this.id);

        alert('push to main screen!');


        //selectedItem = null;
    });

     $('#toggle-editor').click(function() {

     	var bar = $("#rightsidebar");

     	if(bar.css('width') != '0px'){
     		bar.animate({ width: 0 });
     	}else{
     		bar.animate({ width: 500 });
     	}

        //selectedItem = null;
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



	$("#rightsidebar").animate({ width: 0 }, function(){
		$('#loading').hide();
	});
});




