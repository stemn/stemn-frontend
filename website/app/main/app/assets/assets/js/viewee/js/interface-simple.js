/* globals define, exports, module */

(function(root, definition) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], definition);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but only CommonJS-like
		// environments that support module.exports, like Node.
		module.exports = definition();
	} else {
		// Browser globals (root is window)
		root.ViewEE = definition();
	}
}(window, function() {

var fontLoaded = false;

function stupidWebfontTrick(eagle) {
	if (!fontLoaded) {
		// see http://stackoverflow.com/a/8223543/27408
		var i = new Image()
		i.src = "../fonts/osifont.woff"
		i.onerror = function() {
			eagle.draw()
			setTimeout(function(){eagle.draw()}, 50)
			fontLoaded = true;
		};
	}

	updateCheckboxes()
	selectItem(null)
}

function loadWebFonts (cb) {
	if (typeof FontLoader === "undefined") {
		setTimeout (cb, 500);
		return;
	}

	var fontLoader = new FontLoader(["vector"], {
		"complete": function(error) {
			if (error !== null) {
				// Reached the timeout but not all fonts were loaded
				console.log(error.message);
				console.log(error.notLoadedFonts);
			} else {
				// All fonts were loaded
				// console.log("all fonts were loaded");
			}
			cb();
		}
	}, 500);

	fontLoader.loadFonts();
}

function getFormFields (formEl, formData) {
	formData = formData || {};
	for (var k in formData) {
		delete formData[k];
	}
	for (var i = 0; i < formEl.elements.length; i ++) {
		var formField = formEl.elements[i];
		var checkedType = formField.type.match (/^(?:radio|checkbox)$/);
		if ((checkedType && formField.checked) || !checkedType) {
			formData[formField.name] = formField.value;
		}
	}
	return formData;
}

var layers = [
	{id: 5, title: "Top Copper"},
	{id: 6, title: "Top silkscreen"},
	{id: 7, title: "Top documentation"},
	{id: 1, title: "Bottom copper"},
	{id: 2, title: "Bottom silkscreen"},
	{id: 3, title: "Bottom documentation"},
	{id: 9, title: "Outline"},
	{id: 8, title: "Vias"},
	{id: 4, title: "Dim backside"},
];

var EagleCanvas;

function ViewEE (options, EagleCanvasClass) {

	if (!options) options = {};

	if (!options.fromScratch && ViewEE.initialized)
		return ViewEE.initialized;

	EagleCanvas = EagleCanvas || EagleCanvasClass || window.ViewEEPCB;

	this.node = options.node || document;

	this.canvasSelector = options.canvasSelector || '.canvas';
	this.scaleSelector  = options.scaleSelector  || '.canvas-wrap';
	this.formSelector   = options.formSelector   || ".controls";
	this.progressBarSel = options.progressBarSel || '.controls';

	this.canvas = new EagleCanvas (this.node.querySelector (this.canvasSelector));

	// flip side switch

	var form = this.node.querySelector (this.formSelector);

	var outer = this.node.querySelector (this.scaleSelector);
	outer.addEventListener ('click', function () {
		ViewEE.deselect();
	});


	var layerList = form.querySelector ('div.dropdown ul.layers');
	layerList.innerHTML = '';

	for (var i = 0; i < layers.length; i++) {
		var layerNum = layers[i].id;
		var chk = HtmlEl ('input', {
			type: "checkbox", checked: "true", id: "layer-"+layerNum, "data-layer": layerNum
		});
		var li = HtmlEl (
			'li', {},
			chk,
			HtmlEl ('label', {for: "layer-"+layerNum}, layers[i].title)
		);

		layerList.appendChild (li);

		chk.addEventListener ('click', this.toggleLayer.bind (this));
	}

	var canvas = this.node.querySelector (this.canvasSelector);
	canvas.addEventListener ("click", this.canvasClick.bind (this), false);

	ViewEE.initialized = this;

	var changeProgressGen = function (method, className) {
		var progressBarSel = this.progressBarSel;
		var node = this.node;
		return function () {
			var progressBar = node.querySelector (progressBarSel);
			progressBar.classList[method] (className);
		}
	}.bind (this);

	this.canvas.on ('draw-start', changeProgressGen ('add', 'pending'));
	this.canvas.on ('redraw-start', changeProgressGen ('add', 'pending'));
	this.canvas.on ('parse-start', changeProgressGen ('add', 'pending'));

	this.canvas.on ('draw-end', changeProgressGen ('remove', 'pending'));
	this.canvas.on ('redraw-end', changeProgressGen ('remove', 'pending'));
	this.canvas.on ('parse-end', changeProgressGen ('remove', 'pending'));

	this.beforeRender = options.beforeRender;
	this.afterRender  = options.afterRender;

	// TODO: refactor this crap
	loadWebFonts (function () {
		ViewEE.fontReady = true;
		if (this.loadUrl.delayed) {
			this.canvas.loadURL (this.loadUrl.delayed, function (data) {
				this.beforeRender && this.beforeRender ();
				console.log ('before render', this.beforeRender);
				this.canvas.loadText (data);
				console.log ('after render', this.afterRender);
				this.afterRender && this.afterRender ();
				return true;
			}.bind (this));
			delete this.loadUrl.delayed;
		} else if (this.loadText.delayed) {
			this.canvas.loadText (this.loadText.delayed);
			delete this.loadText.delayed;
		}
	}.bind (this));

}

ViewEE.init = function (url, options) {
    console.log('INIT!');
	var viewee = new ViewEE(options);
	viewee.loadUrl (url);
	return viewee;
}

ViewEE.deselect = function () {
	var viewee = new ViewEE ();
	viewee.selectItem (null);
}

ViewEE.prototype.addEventListeners = function () {

}

ViewEE.prototype.loadUrl = function (url) {

	var defaultUrl;

	var form = this.node.querySelector (this.formSelector);
	if (form && !url) {
		var option = form.querySelector ("select.board option");
		defaultUrl = option.value;
	}

	this.canvas.setScaleToFit (this.scaleSelector);
	if (!ViewEE.fontReady) {
		this.loadUrl.delayed = url || defaultUrl;
	} else {
		this.canvas.loadURL(url || defaultUrl, function () {});
	}

}

ViewEE.prototype.loadText = function (text) {

	// this.canvas = new EagleCanvas (this.node.querySelector (this.canvasSelector));

	this.canvas.setScaleToFit (this.scaleSelector);

	if (!ViewEE.fontReady) {
		this.loadText.delayed = text;
	} else {
		this.canvas.loadText (text);
	}
}


ViewEE.prototype.toggleLayer = function (e, layer) {
	e = e || window.event;
	if (e) e.stopPropagation();
	if (!layer) layer = parseInt (e.target.getAttribute ('data-layer'));
	var shown = this.canvas.isLayerVisible(layer);
	shown = !shown;
	this.canvas.setLayerVisible(layer,shown);
	this.updateCheckboxes();
}

ViewEE.prototype.updateCheckboxes = function () {
	for (var layerKey in EagleCanvas.LayerId) {
		var layerId = EagleCanvas.LayerId[layerKey];
		var form = this.node.querySelector (this.formSelector);
		var chk = form.querySelector ('input[data-layer="'+layerId+'"]');
		if (!chk) continue;
		chk.checked = (this.canvas.isLayerVisible(layerId)) ? "checked" : "";
	}
}

ViewEE.prototype.canvasClick = function (e) {
	e = e || window.event;
	if (!e) return;
	e.stopPropagation();
	var canvas = this.node.querySelector (this.canvasSelector);
	var x = e.clientX - canvas.getBoundingClientRect().left - canvas.clientLeft + canvas.scrollLeft;
	var y = e.clientY - canvas.getBoundingClientRect().top - canvas.clientTop + canvas.scrollTop;
	var hit = this.canvas.hitTest(x,y);
	this.selectItem(hit);
}

ViewEE.prototype.selectItem = function (hit) {
    console.log(hit);
}

return ViewEE;

}))
