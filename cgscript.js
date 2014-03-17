var selectedItem;

var presets = {
	'Identity': [ -10, 10, 'function(x) {\n  return x;\n}' ],
	'Sine': [ -10, 10, 'function(x) {\n  return Math.sin(x);\n}' ],
	'Square-wave': [-10, 10, 'function(x) {\n  var y = 0;\n  for (var i = 1; i < 20; i+=2) {\n    y += Math.sin(i * x)/i;\n  }\n  var final = 1 - 2*(Math.abs(Math.floor(x / Math.PI)) % 2);\n  return [4/Math.PI * y, final];\n}' ],
	'Unit-step':[-10, 10, 'function(x) {\n  return (x > 0) ? 1 : 0;\n}' ],
	'Delta':[-10, 10, 'function(x) {\n  return (x == 0) ? 1 : 0;\n}' ]
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

	g = new Dygraph(graph, data, {
		strokeWidth: 1.5,
		//displayAnnotations: false,
		gridLineColor: 'rgb(196, 196, 196)',
		drawYGrid: false,
		drawYAxis: true,
		axisLabelFontSize: 10,
		axisLabelColor: "white",
		drawAxesAtZero: true,
		yAxisLabelWidth:20
	});
}

$(document).ready(function () {

	var select = document.getElementById("presets");

	select.onchange = function() {
		var sel = select.selectedIndex;
		var id = select.options[sel].id;

		if (id == "custom") { return; }
		document.getElementById("x1").value = presets[id][0];
		document.getElementById("x2").value = presets[id][1];
		document.getElementById("eq").value = presets[id][2];
		plot();
	}

	var plotButton = document.getElementById("plot");
	var plot = function() {
		var eq = document.getElementById("eq").value;
		eval("fn = " + eq);

		var graph = document.getElementById("graph_div");
		var width = parseInt(graph.style.width);
		var x1 = parseFloat(document.getElementById("x1").value);
		var x2 = parseFloat(document.getElementById("x2").value);
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

		g = new Dygraph(graph, data);
	}
	plotButton.onclick = plot;
	plot();


	/**
	 * 		ADD preset functions to functons list
	 *
	 */
	// test adding things to the sidebar
	$('<h3 class="side-bar-title">' + 'Preset functions:' + '</h3>').appendTo('#leftsidebar');
	// Generate the HTML for preset functions
	for(var key in presets){
		// HTML for function properties
		var html = '<div class="item"><div class="title">' + key + '</div><div class="contents"><table>';
		html += '<tr><td>Non-Zero range:</td><td>' + presets[key][0] + ' ---> ' + presets[key][1] + '</td></tr>';
		html += '<tr><td>' + 'OTHER NAME' + ':</td><td><div class="segmented"> PLACE HOLDER </div></td></tr>';
		html += '</table>';

		html += '<div class="small-graph" id="small-graph-' + key + '" style="width:250px; height:100px;"></div>'

		// HTML for accept button
		html += '<div id=' + key + ' class="button accept">Accept</div>';
		html += '<div id=' + key + ' class="button edit">Edit function</div>';
		var item = $(html).appendTo('#leftsidebar')[0];

		plotToID('small-graph-' + key, presets[key][2], -5, 5);
	}


	$('.edit').live('click', function() {
		var editor = ace.edit("function-editor");
		editor.setValue(presets[this.id][2]);
        //editor.gotoLine(lineNumber);
        editor.setReadOnly(false);
    });

	$('.accept').live('click', function() {
        //contractItem(selectedItem);
        
        // here we put in the graph we want
        console.log("Putting in graph of " + this.id);

        alert('push to main screen!');


        //selectedItem = null;
    });




    /**
     * Make custom functions space.
     */
     $('<h3 class="side-bar-title">' + 'Custom functions:' + '</h3>').appendTo('#leftsidebar');



     $('#loading').hide();
 });

// Change the filter when a leftsidebar item is clicked
$('#leftsidebar .item .title').live('mousedown', function(e) {
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




