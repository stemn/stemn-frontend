(function (root, factory) {
	if(typeof define === "function" && define.amd) {
		define(function(){
			return factory();
		});
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	} else {
		root.ViewEEPCB = factory();
	}
}(this, function () {

var p = function(o){ console.log(o) }

// -------------------
// --- CONSTRUCTOR ---
// -------------------

// parser just fill out board/scheme obect
// board/scheme object can load data and check what parser is applicable,
// also contains board data and can draw using renderer

function ViewEE (targetSelector) {
	if (targetSelector instanceof HTMLCanvasElement) {
		this.canvas = targetSelector;
	} else if (targetSelector instanceof SVGElement) {
		this.svg = targetSelector;
	} else if (targetSelector.constructor && targetSelector.constructor === String) {
		var target = document.querySelector (targetSelector);
		return ViewEE (target);
	} else {
		console.error ('Cannot instantiate board for ', targetSelector);
		return;
	}

	var resizeHandler = function () {
		this.scaleToFit ();
		// this.canvas.draw ();
	}.bind (this);

	var resizeTimer;
	window.addEventListener ('resize', function() {
		clearTimeout (resizeTimer);
		resizeTimer = setTimeout (resizeHandler, 100);
	});

	window.addEventListener ('orientationchange', function(){
		resizeHandler ();
	});

	// using minivents library
	new Minivents (this);

	this.visibleLayers = {};
	this.visibleLayers[ViewEE.LayerId.BOTTOM_COPPER]        = true;
	this.visibleLayers[ViewEE.LayerId.BOTTOM_SILKSCREEN]    = true;
	this.visibleLayers[ViewEE.LayerId.BOTTOM_DOCUMENTATION] = true;
	this.visibleLayers[ViewEE.LayerId.DIM_BOARD]            = true;
	this.visibleLayers[ViewEE.LayerId.TOP_COPPER]           = true;
	this.visibleLayers[ViewEE.LayerId.TOP_SILKSCREEN]       = true;
	this.visibleLayers[ViewEE.LayerId.TOP_DOCUMENTATION]    = true;
	this.visibleLayers[ViewEE.LayerId.VIAS]                 = true;
	this.visibleLayers[ViewEE.LayerId.OUTLINE]              = true;

	this.renderLayerOrder = [];
	this.renderLayerOrder.push(ViewEE.LayerId.BOTTOM_DOCUMENTATION);
	this.renderLayerOrder.push(ViewEE.LayerId.BOTTOM_SILKSCREEN);
	this.renderLayerOrder.push(ViewEE.LayerId.BOTTOM_COPPER);
	this.renderLayerOrder.push(ViewEE.LayerId.DIM_BOARD);
	this.renderLayerOrder.push(ViewEE.LayerId.OUTLINE);
	this.renderLayerOrder.push(ViewEE.LayerId.TOP_COPPER);
	this.renderLayerOrder.push(ViewEE.LayerId.VIAS);
	this.renderLayerOrder.push(ViewEE.LayerId.TOP_SILKSCREEN);
	this.renderLayerOrder.push(ViewEE.LayerId.TOP_DOCUMENTATION);

	this.reverseRenderLayerOrder = [];
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.TOP_DOCUMENTATION);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.TOP_SILKSCREEN);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.TOP_COPPER);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.DIM_BOARD);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.OUTLINE);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.BOTTOM_COPPER);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.VIAS);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.BOTTOM_SILKSCREEN);
	this.reverseRenderLayerOrder.push(ViewEE.LayerId.BOTTOM_DOCUMENTATION);

	this.layerRenderFunctions = {};

	this.layerRenderFunctions[ViewEE.LayerId.BOTTOM_COPPER] = function (renderer, board, ctx) {
		renderer.drawSignalWires(board.eagleLayersByName['Bottom'],ctx);
		renderer.drawElements(board.eagleLayersByName['Bottom'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['Bottom'],ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.BOTTOM_SILKSCREEN] = function(renderer, board, ctx) {
		renderer.drawElements(board.eagleLayersByName['bNames'],ctx);
		renderer.drawElements(board.eagleLayersByName['bValues'],ctx);
		renderer.drawElements(board.eagleLayersByName['bPlace'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['bNames'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['bValues'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['bPlace'],ctx);
		renderer.drawPlainWires(board.eagleLayersByName['bNames'],ctx);
		renderer.drawPlainWires(board.eagleLayersByName['bValues'],ctx);
		renderer.drawPlainWires(board.eagleLayersByName['bPlace'],ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.BOTTOM_DOCUMENTATION] = function(renderer, board, ctx) {
		renderer.drawElements(board.eagleLayersByName['bKeepout'],ctx);
		renderer.drawElements(board.eagleLayersByName['bDocu'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['bKeepout'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['bDocu'],ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.TOP_COPPER] = function(renderer, board, ctx) {
		renderer.drawSignalWires(board.eagleLayersByName['Top'],ctx);
		renderer.drawElements   (board.eagleLayersByName['Top'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['Top'],ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.TOP_SILKSCREEN] = function(renderer, board, ctx) {
		renderer.drawElements(board.eagleLayersByName['tNames'],ctx);
		renderer.drawElements(board.eagleLayersByName['tValues'],ctx);
		renderer.drawElements(board.eagleLayersByName['tPlace'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['tNames'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['tValues'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['tPlace'],ctx);
		renderer.drawPlainWires(board.eagleLayersByName['tNames'],ctx);
		renderer.drawPlainWires(board.eagleLayersByName['tValues'],ctx);
		renderer.drawPlainWires(board.eagleLayersByName['tPlace'],ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.TOP_DOCUMENTATION] = function(renderer, board, ctx) {
		renderer.drawElements(board.eagleLayersByName['tKeepout'],ctx);
		renderer.drawElements(board.eagleLayersByName['tDocu'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['tKeepout'],ctx);
		renderer.drawPlainTexts(board.eagleLayersByName['tDocu'],ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.DIM_BOARD] = function(renderer, board, ctx) {
		renderer.dimCanvas(board.dimBoardAlpha, ctx);
	}

	this.layerRenderFunctions[ViewEE.LayerId.VIAS] = function(renderer, board, ctx) {
		renderer.drawSignalVias('1-16',ctx, board.viaPadColor());
	}

	this.layerRenderFunctions[ViewEE.LayerId.OUTLINE] = function(renderer, board, ctx) {
		renderer.drawPlainWires(board.eagleLayersByName['Dimension'],ctx);
		renderer.drawPlainHoles(board.eagleLayersByName['Dimension'],ctx);
	}

	this.hitTestFunctions = {};

	this.hitTestFunctions[ViewEE.LayerId.BOTTOM_COPPER] = function(x,y) {
		return this.hitTestElements (this.eagleLayersByName['Bottom'],x,y)
			|| this.hitTestSignals  (this.eagleLayersByName['Bottom'],x,y);
	}.bind (this);

	this.hitTestFunctions[ViewEE.LayerId.TOP_COPPER] = function(x,y) {
		return this.hitTestElements (this.eagleLayersByName['Top'],x,y)
			|| this.hitTestSignals  (this.eagleLayersByName['Top'],x,y);
	}.bind (this);

}

// -----------------------
// --- ENUMS, DEFAULTS ---
// -----------------------

ViewEE.LayerId = {
	'BOTTOM_COPPER' : 1,
	'BOTTOM_SILKSCREEN' : 2,
	'BOTTOM_DOCUMENTATION' : 3,
	'DIM_BOARD' : 4,
	'TOP_COPPER' : 5,
	'TOP_SILKSCREEN' : 6,
	'TOP_DOCUMENTATION' : 7,
	'VIAS' : 8,
	'OUTLINE' : 9
}

ViewEE.LARGE_NUMBER = 99999;

ViewEE.warnings = {};

ViewEE.prototype.scale = 1;
ViewEE.prototype.minScale = 0.1;
ViewEE.prototype.maxScale = 10;
ViewEE.prototype.minLineWidth = 0.05;
ViewEE.prototype.boardFlipped = false;
ViewEE.prototype.dimBoardAlpha = 0.7;

// -------------------------
// --- GENERIC ACCESSORS ---
// -------------------------

/** sets an element id to which the drawing should be initially scaled */
ViewEE.prototype.setScaleToFit = function(elementSelector) {
	this.scaleToFitSelector = elementSelector;
}

ViewEE.prototype.scaleToFit = function(a) {
	// if (!this.scaleToFitSelector) { return; }
//	var fitElement = this.scaleToFitSelector ? document.querySelector (this.scaleToFitSelector) : this.canvas;
//	if (!fitElement) { return; }
//	var fitWidth  = fitElement.offsetWidth,
//		fitHeight = fitElement.offsetHeight,
//		scaleX    = fitWidth / this.nativeSize[0],
//		scaleY    = fitHeight / this.nativeSize[1],
//		scale     = Math.min(scaleX, scaleY);
//	scale *= 0.9;
//	this.baseScale = scale;
//	this.minScale = scale / 10;
//	this.maxScale = scale * 10;
//	this.setScale (1);

    var fitElement = this.scaleToFitSelector ? document.querySelector (this.scaleToFitSelector) : this.canvas;
	if (!fitElement) { return; }
	var fitWidth  = fitElement.width,
		fitHeight = fitElement.height,
		scaleX    = fitWidth / this.nativeSize[0],
		scaleY    = fitHeight / this.nativeSize[1],
		scale     = Math.min(scaleX, scaleY);
	scale *= 0.9;
	this.baseScale = scale;
	this.minScale = scale / 10;
	this.maxScale = scale * 10;
	this.setScale (1);
}


ViewEE.prototype.getScale = function(scale) {
	return this.scale;
}

/** sets the scale factor, triggers resizing and redrawing */
ViewEE.prototype.setScale = function (scale, noResize) {
	// console.log (scale, this.scale, this.baseScale);

	console.time && console.time ('scale');

	this.scale = scale // * (this.scale || 1);

	var fitElement = this.scaleToFitSelector
		? document.querySelector (this.scaleToFitSelector)
		: this.canvas;
	if (!fitElement) { return; }
	var fitWidth  = fitElement.offsetWidth,
		fitHeight = fitElement.offsetHeight;

	var scrollX = (fitElement.scrollLeft + fitElement.clientWidth  / 2) / fitElement.scrollWidth;
	var scrollY = (fitElement.scrollTop  + fitElement.clientHeight / 2) / fitElement.scrollHeight;

	// console.log ('scroll amount: %s, position: %s, width: %s', scrollX, fitElement.scrollLeft, fitElement.scrollWidth);

	if ('svg' in this) {
		// this.svg.setAttributeNS (null, 'width', scale * this.baseScale * this.nativeSize[0]);
		// this.svg.setAttributeNS (null, 'height', scale * this.baseScale * this.nativeSize[1]);

		this.svg.style.width  = scale * this.baseScale * this.nativeSize[0] + "px"; // fitElement.offsetWidth //
		this.svg.style.height = scale * this.baseScale * this.nativeSize[1] + "px"; // fitElement.offsetHeight //

	} else if ('canvas' in this) {

	var canvas = this.canvas;
	var context = canvas.getContext('2d'),
		devicePixelRatio = window.devicePixelRatio || 1,
		backingStoreRatio =
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1,
		ratio = devicePixelRatio / backingStoreRatio;

	if (!noResize) {
		canvas.width  = scale * this.baseScale * this.nativeSize[0] * ratio;
		canvas.height = scale * this.baseScale * this.nativeSize[1] * ratio;

		canvas.style.width  = scale * this.baseScale * this.nativeSize[0] + "px";
		canvas.style.height = scale * this.baseScale * this.nativeSize[1] + "px";
	}

	this.canvasWidth  = scale * this.baseScale * this.nativeSize[0] * ratio;
	this.canvasHeight = scale * this.baseScale * this.nativeSize[0] * ratio;

	this.ratio = ratio;

	}

	// console.log ('new scroll position: %s, width: %s', scrollX * fitElement.scrollWidth, fitElement.scrollWidth);

	fitElement.scrollLeft = scrollX * fitElement.scrollWidth  - fitElement.clientWidth  / 2;
	fitElement.scrollTop  = scrollY * fitElement.scrollHeight - fitElement.clientHeight / 2;

	console.timeEnd && console.timeEnd ('scale');

	this.redraw();

}


/** Returns whether a given layer is visible or not */
ViewEE.prototype.isLayerVisible = function (layerId) {
	return this.visibleLayers[layerId] ? true : false;
}

/** Turns a layer on or off */
ViewEE.prototype.setLayerVisible = function (layerId, on) {
	if (this.isLayerVisible(layerId) == on) { return; }
	this.visibleLayers[layerId] = on ? true : false;
	this.redraw();
}

/** Returns whether the board is flipped (bottom at fromt) or not */
ViewEE.prototype.isBoardFlipped = function () {
	return this.boardFlipped;
}

/** Turns top or bottom to the front */
ViewEE.prototype.setBoardFlipped = function (flipped) {
	if (this.boardFlipped == flipped) { return; }
	this.boardFlipped = flipped ? true : false;

	this.redraw();
}

ViewEE.prototype.setHighlightedItem = function(item) {
	this.highlightedItem = item;

	this.redraw();
}

// Draw is need to be called just once for single layout,
// redraw is needed to rerender layout for new parameters, like scale, selection and so on
// Usually, for objects like svg draw is important and redraw is empty,
// for a canvas, draw will be empty and redraw need to contain actual drawing code

ViewEE.prototype.draw = function () {

	if (!this.renderer) this.initRenderer ();

	this.emit ('draw-start');
	console.time && console.time ('draw');

	this.renderer.draw ();
	console.timeEnd && console.timeEnd ('draw');
	this.emit ('draw-end');

    // Stemn Change - Add a Draw callback!
    if(this.drawCallback){
        this.drawCallback();
    }
}

ViewEE.prototype.redraw = function () {
	if (!this.renderer) this.initRenderer ();

	this.emit ('redraw-start');
	console.time && console.time ('redraw');

	this.renderer.redraw ();

	console.timeEnd && console.timeEnd ('redraw');
	this.emit ('redraw-end');
}

ViewEE.prototype.initRenderer = function () {
	if ('svg' in this && !this.renderer) {
		this.renderer = new ViewEESVGRenderer (this);
	} else if ('canvas' in this && !this.renderer) {
		this.renderer = new ViewEECanvasRenderer (this);
	}
}

// ---------------
// --- PARSERS ---
// ---------------

ViewEE.parsers = [
];

if ("EagleXMLParser" in window) {
	ViewEE.parsers.push (window.EagleXMLParser);
}

if ("KicadNewParser" in window) {
	ViewEE.parsers.push (window.KicadNewParser);
}

if ("AltiumParser" in window) {
	ViewEE.parsers.push (window.AltiumParser);
}

if ("GEDAParser" in window) {
	ViewEE.parsers.push (window.GEDAParser);
}

ViewEE.prototype.findParser = function (text) {
	var parserFound = ViewEE.parsers.some (function (parser) {
		if (!parser) return;
		if (parser.supports (text)) {
			var timerLabel = 'parsing using ' + parser.name;
			console.time && console.time (timerLabel);
			var parser = new parser (this);
			parser.parse (text);
			console.timeEnd && console.timeEnd (timerLabel);

			this.emit ('parse-end');

			this.nativeBounds = this.calculateBounds();
			this.nativeSize   = [this.nativeBounds[2]-this.nativeBounds[0],this.nativeBounds[3]-this.nativeBounds[1]];
			this.scaleToFit();
			this.draw();

			return true;
		}
	}, this);

	if (!parserFound)
		alert ('cannot find parser for selected file');
}

ViewEE.prototype.loadText = function (text) {
	this.text = text;

	this.emit ('parse-start');
    this.findParser(text)
//	typeof requestAnimationFrame !== "undefined"
//		? requestAnimationFrame (this.findParser.bind (this, text))
//		: this.findParser (text);

}


// ---------------
// --- LOADING ---
// ---------------

// TODO: use binary loading for binary formats such as altium
// TextEncoder polyfill https://github.com/inexorabletash/text-encoding
// Ajax binary data https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
ViewEE.prototype.loadURL = function (url, cb) {
	this.url = url;
	var request = new XMLHttpRequest(),
		self = this;
	request.open('GET', this.url, true);
	// XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
	// request.overrideMimeType('text/plain; charset=x-user-defined');
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			var result = cb && cb(request.responseText);
			if (result === undefined)
				self.loadText (request.responseText);

		}
	};
	request.send(null);
};



// -------------------
// --- HIT TESTING ---
// -------------------

ViewEE.prototype.hitTest = function(x,y) {
	var canvas = this.canvas;
	//Translate screen to model coordinates
	var rx = x / (this.scale * this.baseScale);
	var ry = (this.coordYFlip ? y : canvas.height / this.ratio - y) / (this.scale * this.baseScale);
	ry += this.nativeBounds[1];
	rx = this.boardFlipped ? (this.nativeBounds[2]-rx) : (rx+this.nativeBounds[0]);

	var layerOrder = (this.boardFlipped) ? this.reverseRenderLayerOrder : this.renderLayerOrder;
	for (var i = layerOrder.length-1; i >= 0; i--) {
		var layerId = layerOrder[i];
		if (!this.visibleLayers[layerId]) { continue; }
		var hitTestFunc = this.hitTestFunctions[layerId];
		if (!hitTestFunc) { continue; }
		var hit = hitTestFunc (rx, ry);
		if (hit) { return hit; }
	}
	return null;
}

ViewEE.prototype.hitTestElements = function(layer, x, y) {
	if (!layer) { return; }

	for (var elemKey in this.elements) {
		var elem = this.elements[elemKey],
			pkg = typeof elem.pkg === "string" ? this.packagesByName[elem.pkg] : elem.pkg;

		var rotMat = elem.matrix;

		var bbox = pkg.bbox;
		if (bbox) {
			var layerNum = this.eagleLayersByName['Top'].number;
			if (elem.mirror) layerNum = this.mirrorLayer(layerNum);
			if (layer.number != layerNum) continue;
			var x1 = elem.x + rotMat[0]*bbox[0] + rotMat[1]*bbox[1],	//top left
				y1 = elem.y + rotMat[2]*bbox[0] + rotMat[3]*bbox[1],
				x2 = elem.x + rotMat[0]*bbox[2] + rotMat[1]*bbox[1],	//top right
				y2 = elem.y + rotMat[2]*bbox[2] + rotMat[3]*bbox[1],
				x3 = elem.x + rotMat[0]*bbox[2] + rotMat[1]*bbox[3],	//bottom right
				y3 = elem.y + rotMat[2]*bbox[2] + rotMat[3]*bbox[3],
				x4 = elem.x + rotMat[0]*bbox[0] + rotMat[1]*bbox[3],	//bottom left
				y4 = elem.y + rotMat[2]*bbox[0] + rotMat[3]*bbox[3];
			if (this.pointInRect(x,y,x1,y1,x2,y2,x3,y3,x4,y4)) {
				return {'type':'element','name':elem.name, description: pkg.description};
			}
		}

		for (var smdIdx in pkg.smds) {
			if (!pkg.smds.hasOwnProperty(smdIdx)) continue;
			var smd = pkg.smds[smdIdx];
			var layerNum = smd.layer;
			if (elem.mirror) layerNum = this.mirrorLayer(layerNum);
			if (layer.number != layerNum) continue;
			var x1 = elem.x + rotMat[0]*smd.x1 + rotMat[1]*smd.y1,	//top left
				y1 = elem.y + rotMat[2]*smd.x1 + rotMat[3]*smd.y1,
				x2 = elem.x + rotMat[0]*smd.x2 + rotMat[1]*smd.y1,	//top right
				y2 = elem.y + rotMat[2]*smd.x2 + rotMat[3]*smd.y1,
				x3 = elem.x + rotMat[0]*smd.x2 + rotMat[1]*smd.y2,	//bottom right
				y3 = elem.y + rotMat[2]*smd.x2 + rotMat[3]*smd.y2,
				x4 = elem.x + rotMat[0]*smd.x1 + rotMat[1]*smd.y2,	//bottom left
				y4 = elem.y + rotMat[2]*smd.x1 + rotMat[3]*smd.y2;
			if (this.pointInRect(x,y,x1,y1,x2,y2,x3,y3,x4,y4)) {
				var padName = smd.name;
				if (padName) {
					var signalName = elem.padSignals[padName];
					if (signalName) { return {'type':'signal','name':signalName}; }
				}
				return {'type':'element','name':elem.name};
			}
		}
	}
	return null;
}

ViewEE.prototype.hitTestSignals = function(layer, x, y) {
	for (var signalName in this.signalItems) {
		var signalLayers = this.signalItems[signalName];
		if (!signalLayers) { continue; }
		var layerItems = signalLayers[layer.number];
		if (!layerItems) { continue; }
		var layerWires = layerItems['wires'];
		if (!layerWires) { continue; }
		for (var wireIdx in layerWires) {
			if (!layerWires.hasOwnProperty(wireIdx)) continue;
			var wire = layerWires[wireIdx],
				x1 = wire.x1,
				y1 = wire.y1,
				x2 = wire.x2,
				y2 = wire.y2,
				width = wire.width;
			if (this.pointInLine(x,y,x1,y1,x2,y2,width)) {
				return {'type':'signal','name':signalName};
			}
		}
	}
	return null;
}

ViewEE.prototype.pointInLine = function(x, y, x1, y1, x2, y2, width) {
	var width2 = width * width;

	if (((x-x1)*(x-x1)+(y-y1)*(y-y1)) < width2) { return true; }	//end 1
	if (((x-x2)*(x-x2)+(y-y2)*(y-y2)) < width2) { return true; }	//end 2

	var length2 = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
	if (length2 <= 0) { return false; }

	var s = ((y - y1) * (y2-y1) - (x - x1) * (x1-x2)) / length2;				// s = param of line p1..p2 (0..1)
	if ((s >= 0) && (s <= 1)) {													//between p1 and p2
		var px = x1 + s * (x2-x1),
			py = y1 + s * (y2-y1);
		if (((x-px)*(x-px)+(y-py)*(y-py)) < width2) {
			return true;	//end 2
		}
	}
	return false;
}

ViewEE.prototype.pointInRect = function(x, y, x1, y1, x2, y2, x3, y3, x4, y4) {
	//p1..p4 in clockwise or counterclockwise order
	//Do four half-area tests
	return (((x-x1)*(x2-x1)+(y-y1)*(y2-y1)) >= 0)
		&& (((x-x1)*(x4-x1)+(y-y1)*(y4-y1)) >= 0)
		&& (((x-x3)*(x2-x3)+(y-y3)*(y2-y3)) >= 0)
		&& (((x-x3)*(x4-x3)+(y-y3)*(y4-y3)) >= 0);
}


// --------------------
// --- COMMON UTILS ---
// --------------------

ViewEE.prototype.calcBBox = function (wires) {
	var bbox = [
		ViewEE.LARGE_NUMBER,
		ViewEE.LARGE_NUMBER,
		-ViewEE.LARGE_NUMBER,
		-ViewEE.LARGE_NUMBER
	];
	wires.forEach (function (wireDict) {
		if (wireDict.x1 < bbox[0]) { bbox[0] = wireDict.x1; }
		if (wireDict.x1 > bbox[2]) { bbox[2] = wireDict.x1; }
		if (wireDict.y1 < bbox[1]) { bbox[1] = wireDict.y1; }
		if (wireDict.y1 > bbox[3]) { bbox[3] = wireDict.y1; }
		if (wireDict.x2 < bbox[0]) { bbox[0] = wireDict.x2; }
		if (wireDict.x2 > bbox[2]) { bbox[2] = wireDict.x2; }
		if (wireDict.y2 < bbox[1]) { bbox[1] = wireDict.y2; }
		if (wireDict.y2 > bbox[3]) { bbox[3] = wireDict.y2; }
	});
	if ((bbox[0] >= bbox[2]) || (bbox[1] >= bbox[3])) {
		bbox = null;
	}

	return bbox;
}


ViewEE.prototype.colorPalette = [
	[127,127,127],
	[ 35, 35,141],
	[ 35,141, 35],
	[ 35,141,141],
	[141, 35, 35],
	[141, 35,141],
	[141,141, 35],
	[141,141,141],
	[ 39, 39, 39],
	[  0,  0,180],
	[  0,180,  0],
	[  0,180,180],
	[180,  0,  0],
	[180,  0,180],
	[180,180,  0],
	[ 63, 63, 63],
	//[  0,  0,  0]
];

ViewEE.prototype.layerColor = function(colorIdx) {
	var rgb = this.colorPalette[colorIdx];
	if (!rgb) {
		console.warn ("color %s not defined, using default color", colorIdx, this.colorPalette[0]);
		rgb = this.colorPalette[colorIdx] = this.colorPalette[0];
	}
	return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
}

ViewEE.prototype.highlightColor = function(colorIdx) {
	var rgb = this.colorPalette[colorIdx];
	if (!rgb) {
		console.warn ("color %s not defined, using default color", colorIdx, this.colorPalette[0]);
		rgb = this.colorPalette[colorIdx] = this.colorPalette[0];
	}
	return 'rgb('+(rgb[0]+50)+','+(rgb[1]+50)+','+(rgb[2]+50)+')';
}

ViewEE.prototype.viaPadColor = function () {
	return "#0b0";
}

ViewEE.prototype.angleForRot = function (rot) {
	if (!rot) return {degrees: 0};
	var spin    = (rot.indexOf('S') >= 0), // TODO: spin rotate
		flipped = (rot.indexOf('M') >= 0),
		degrees = parseFloat (rot.split ('R')[1]);
	return {spin: spin, flipped: flipped, degrees: degrees};
}

ViewEE.prototype.matrixForRot = function(rot) {
	var angle = this.angleForRot (rot);
	var spin         = angle.spin, // TODO: spin rotate
		flipped      = angle.flipped,
		degrees      = angle.degrees,
		rad          = degrees * Math.PI / 180.0,
		flipSign     = flipped ? -1 : 1,
		matrix       = [
			flipSign * Math.cos(rad),
			flipSign * -Math.sin(rad),
			Math.sin(rad),
			Math.cos(rad)
		];
	return matrix;
}

ViewEE.prototype.mirrorLayer = function(layerIdx) {
	if (layerIdx == 1) {
		return 16;
	} else if (layerIdx == 16) {
		return 1;
	}
	var name   = this.layersByNumber[layerIdx].name,
		prefix = name.substring(0,1);
	if (prefix == 't') {
		var mirrorName  = 'b' + name.substring(1),
			mirrorLayer = this.eagleLayersByName[mirrorName];
		if (mirrorLayer) {
			return mirrorLayer.number;
		}
	} else if (prefix == 'b') {
		var mirrorName = 't' + name.substring(1),
			mirrorLayer = this.eagleLayersByName[mirrorName];
		if (mirrorLayer) {
			return mirrorLayer.number;
		}
	}
	return layerIdx;
}

function max() {
	var args = [].slice.call(arguments);
	return Math.max.apply(Math, args.filter(function(val) {
		return !isNaN(val);
	}));
}

function min() {
	var args = [].slice.call(arguments);
	return Math.min.apply(Math, args.filter(function(val) {
		return !isNaN(val);
	}));
}

ViewEE.prototype.calculateBounds = function() {
	var minX = ViewEE.LARGE_NUMBER,
		minY = ViewEE.LARGE_NUMBER,
		maxX = -ViewEE.LARGE_NUMBER,
		maxY = -ViewEE.LARGE_NUMBER;
	//Plain elements
	for (var layerKey in this.plainWires) {
		var lines = this.plainWires[layerKey];
		for (var lineKey in lines) {
			var line = lines[lineKey],
				x1 = line.x1,
				x2 = line.x2,
				y1 = line.y1,
				y2 = line.y2,
				width = line.width || this.minLineWidth;
			minX = min (minX, x1-width, x1+width, x2-width, x2+width);
			maxX = max (maxX, x1-width, x1+width, x2-width, x2+width);
			minY = min (minY, y1-width, y1+width, y2-width, y2+width);
			maxY = max (maxY, y1-width, y1+width, y2-width, y2+width);
		}
	}

	for (var netName in this.signalItems) {
		for (var layerKey in this.signalItems[netName]) {
			var lines = this.signalItems[netName][layerKey].wires;
			for (var lineKey in lines) {
				var line = lines[lineKey],
					x1 = line.x1,
					x2 = line.x2,
					y1 = line.y1,
					y2 = line.y2,
					width = line.width || this.minLineWidth;
				minX = min (minX, x1-width, x1+width, x2-width, x2+width);
				maxX = max (maxX, x1-width, x1+width, x2-width, x2+width);
				minY = min (minY, y1-width, y1+width, y2-width, y2+width);
				maxY = max (maxY, y1-width, y1+width, y2-width, y2+width);
			}
		}
	}

	//Elements
	for (var elemKey in this.elements) {
		var elem = this.elements[elemKey];
		var pkg = typeof elem.pkg === "string" ? this.packagesByName[elem.pkg] : elem.pkg;
		var rotMat = elem.matrix;
		for (var smdIdx in pkg.smds) {
			var smd = pkg.smds[smdIdx],
				x1 = elem.x + rotMat[0]*smd.x1 + rotMat[1]*smd.y1,
				y1 = elem.y + rotMat[2]*smd.x1 + rotMat[3]*smd.y1,
				x2 = elem.x + rotMat[0]*smd.x2 + rotMat[1]*smd.y2,
				y2 = elem.y + rotMat[2]*smd.x2 + rotMat[3]*smd.y2;
			minX = min (minX, x1, x2);
			maxX = max (maxX, x1, x2);
			minY = min (minY, y1, y2);
			maxY = max (maxY, y1, y2);
		}
		for (var wireIdx in pkg.wires) {
			var wire = pkg.wires[wireIdx],
				x1 = elem.x + rotMat[0]*wire.x1 + rotMat[1]*wire.y1,
				y1 = elem.y + rotMat[2]*wire.x1 + rotMat[3]*wire.y1,
				x2 = elem.x + rotMat[0]*wire.x2 + rotMat[1]*wire.y2,
				y2 = elem.y + rotMat[2]*wire.x2 + rotMat[3]*wire.y2,
				width = wire.width || this.minLineWidth;
			minX = min (minX, x1-width, x1+width, x2-width, x2+width);
			maxX = max (maxX, x1-width, x1+width, x2-width, x2+width);
			minY = min (minY, y1-width, y1+width, y2-width, y2+width);
			maxY = max (maxY, y1-width, y1+width, y2-width, y2+width);
		}
	}

//	 console.log ("board size:", [minX, minY, maxX, maxY]);

	return [minX, minY, maxX, maxY];
}

	return ViewEE;

}));
