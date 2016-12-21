(function (root, factory) {
	if(typeof define === "function" && define.amd) {
		define(function(){
			return factory();
		});
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	} else {
		root.ViewEESVGRenderer = factory();
	}
}(this, function () {

	// ---------------
	// --- HELPERS ---
	// ---------------

	var significantDigits = 4;

	function polarToCartesian(centerX, centerY, radius, angleInDegrees, angleInRadians) {
		if (!angleInRadians)
			angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle){

		console.log (startAngle, endAngle);

		var start = polarToCartesian(x, y, radius, startAngle);
		var end   = polarToCartesian(x, y, radius, endAngle);

//		var start = polarToCartesian(x, y, radius, endAngle);
//		var end   = polarToCartesian(x, y, radius, startAngle);

		var arcSweep = endAngle - startAngle <= 180 ? "1" : "0";

		var d = [
			"M", start.x.toFixed (significantDigits), start.y.toFixed (significantDigits),
			"A", radius, radius, 0, arcSweep, 0, end.x.toFixed (significantDigits), end.y.toFixed (significantDigits)
		].join(" ");

		return d;
	}

	function describeArcRadians (x, y, radius, startAngle, endAngle){

//		var start = polarToCartesian(x, y, radius, null, startAngle);
//		var end   = polarToCartesian(x, y, radius, null, endAngle);

		var start = polarToCartesian(x, y, radius, null, endAngle + 2*Math.PI);
		var end   = polarToCartesian(x, y, radius, null, startAngle + 2*Math.PI);

		var arcSweep = endAngle - startAngle <= Math.PI ? "0" : "1";

		var d = [
			"M", start.x.toFixed (significantDigits), start.y.toFixed (significantDigits),
			"A", radius, radius, 0, arcSweep, 0, end.x.toFixed (significantDigits), end.y.toFixed (significantDigits)
		].join(" ");

		return d;
	}

	// ---------------
	// --- DRAWING ---
	// ---------------

	function SVGRenderer (board) {
		var svg = board.svg;

		this.el    = svg;
		this.board = board;

		this.warnings = [];
	}

	SVGRenderer.prototype = Object.create (ViewEERenderer.prototype);

	SVGRenderer.prototype.getScope = function (ctx, attrs) {

		var g = ctx.querySelector ('g[name="'+attrs.name+'"]');
		if (!g) {
			g = SvgEl ('g', {name: attrs.name});
			ctx.appendChild (g);
		}

		for (var a in attrs) {
			g.setAttributeNS (null, a, attrs[a]);
		}

		return g;
	}

	SVGRenderer.prototype.redraw = function () {
		// TODO: layer visibility

		// flip board

		if (this.svgCtx) {
			var layerNodes = [].slice.apply (this.svgCtx.childNodes);
			var isFlipped;
			layerNodes.some (function (layerNode) {
				var layerName = layerNode.getAttribute ('name');
				// console.log (layerName);
				if (layerName === 'Bottom') {
					isFlipped = false;
					return true;
				} else if (layerName === 'Top') {
					isFlipped = true;
					return true;
				}
			});

			// console.log ('is render flipped? %s is board flipped? %s', isFlipped, this.board.boardFlipped);
			if (isFlipped !== this.board.boardFlipped) {
				var layerNodesCount = layerNodes.length;
				var viaLayer;
				for (var i = layerNodesCount - 1; i >= 0; i--) {
					var layerNode = layerNodes[i];
					var layerName = layerNode.getAttribute ('name');
					var n = this.svgCtx.removeChild (layerNodes[i]);
					if (layerName === 'via') {
						viaLayer = n;
					} else {
						this.svgCtx.appendChild (n);
					}

					if (layerName === 'Top' && isFlipped === true) {
						this.svgCtx.appendChild (viaLayer);
					} else if (layerName === 'Bottom' && isFlipped === false) {
						this.svgCtx.appendChild (viaLayer);
					}
				}
			}
		}

		// TODO: element selection

		// scale change
		this.rescale ();
	}

	SVGRenderer.prototype.rescale = function () {

		if (!this.svgCtx) return;

		var board = this.board;

		board.ratio = 1;

		var scale = 1; // board.scale;

		var baseScale = 1; // board.baseScale;

		var scaleX = (scale * baseScale * board.ratio * (board.boardFlipped ? -1.0 : 1.0)).toFixed (significantDigits);
		var scaleY = ((board.coordYFlip ? 1 : -1) * scale  * baseScale * board.ratio).toFixed (significantDigits);
		var scaleTransY = board.coordYFlip ? 0 : (board.nativeBounds[3] - board.nativeBounds[1]).toFixed (significantDigits);

		var transX = (board.boardFlipped ? -board.nativeBounds[2] : -board.nativeBounds[0]).toFixed (significantDigits);
		var transY = (-board.nativeBounds[1]).toFixed (significantDigits); //board.coordYFlip ? 0 : board.nativeBounds[1]; //-board.nativeBounds[1];

		this.svgCtx.setAttributeNS (
			null,
			'transform',
			'translate('+transX+', '+transY+')'
		);

		this.svgCtx.parentNode.setAttributeNS (
			null,
			'transform',
			'matrix('+scaleX+', 0, 0, '+scaleY+', 0, '+scaleTransY+')' // board.scale*board.baseScale
		);

	}

	SVGRenderer.prototype.draw = function () {
		var svg = this.el;

		var board = this.board;

		if (board.interactive && board.interactive.destroy)
			board.interactive.destroy ();

		while (svg.firstChild) {
			svg.removeChild (svg.firstChild);
		}

		this.el.setAttributeNS (null, 'preserveAspectRatio', 'xMinYMin meet');

		this.el.setAttributeNS (null, 'viewBox', [
			0,
			0,
			board.nativeSize[0].toFixed (significantDigits),
			board.nativeSize[1].toFixed (significantDigits)
		].join (','));

		var g;

		svg.appendChild (SvgEl ('g', {
			className: 'viewport'
		}, SvgEl ('g', {
		}, g = SvgEl ('g', {
			className: 'container',
		}))));

		this.svgCtx = g;

		this.rescale ();

		var layerOrder = board.boardFlipped ? board.reverseRenderLayerOrder : board.renderLayerOrder;
		for (var layerKey in layerOrder) {
			var layerId = layerOrder[layerKey];
			if (!board.visibleLayers[layerId]) { continue };
			board.layerRenderFunctions[layerId](this, board, g);
		}

		if (board.initInteractive)
			board.initInteractive ();

	}

	SVGRenderer.prototype.drawSingleWire = function (wire, ctx) {
		var path = this.drawWire (wire, ctx);
		path.setAttributeNS (null, 'stroke', wire.strokeStyle);
		path.setAttributeNS (null, 'stroke-width', wire.width);
		path.setAttributeNS (null, 'fill', "none");
	}

	SVGRenderer.prototype.drawWire = function (wire, ctx) {

		var attrs = {};

		var lineDash;
		if (wire.style === "longdash") {
			lineDash = [3];
		} else if (wire.style === "shortdash") {
			lineDash = [1];
		} else if (wire.style === "dashdot") {
			lineDash = [3, 1, 1, 1];
		}

		if (lineDash) attrs["stroke-dasharray"] = lineDash.join (', ');

		if (wire.cap && wire.cap === "flat") {
			attrs["stroke-linecap"] = "butt";
		} else {
			attrs["stroke-linecap"] = "round";
		}

		if (wire.curve === undefined) {
			attrs.d = [
				'M',
				wire.x1.toFixed (significantDigits),
				wire.y1.toFixed (significantDigits),
				'L',
				wire.x2.toFixed (significantDigits),
				wire.y2.toFixed (significantDigits)
			].join (' ');

		} else if (wire.curve === 360) {

			attrs.cx = wire.x;
			attrs.cy = wire.y;

			attrs.r  = wire.radius.constructor === Array ? wire.radius[0] : wire.radius;

			var circle = SvgEl ('circle', attrs);
			ctx.appendChild (circle);
			return circle;

		} else {

			var angle = this.board.angleForRot (wire.rot);

			var rotate = angle.degrees / 180 * Math.PI;

			var mirror = angle.flipped;

			var startAngle = rotate + wire.start;
			var endAngle   = rotate + wire.start + wire.angle;

			if (mirror) {
				// startAngle = rotate - wire.start;
				// endAngle   = rotate - wire.start - wire.angle;
			}

			var radiusX, radiusY;
			radiusX = radiusY = wire.radius;
			if (wire.radius.constructor === Array) {
				radiusX = wire.radius[0];
				radiusY = wire.radius[1];
			}

			attrs.d = describeArcRadians (wire.x, wire.y, radiusX, startAngle, endAngle);
			// attrs.transform = 'scale('+radiusX+','+radiusY+') translate('+wire.x+', '+wire.y+')';
		}

		var path = SvgEl ('path', attrs);
		ctx.appendChild (path);
		return path;

	}

	SVGRenderer.prototype.drawHole = function (hole, ctx) {

		var board = this.board;

		// TODO: rotation

		var attrs = {
			fill: hole.strokeStyle,
			'fill-rule': 'even-odd'
		};

		hole.shape = hole.shape || 'circle';

		// TODO: get rid of strokeWidth

		var drillRadius = hole.drill/2;
		var shapeRadius = hole.diameter/2 || drillRadius + hole.strokeWidth/2;

		var dShapeAttr = '';
		if (hole.shape === 'square') {
			var poly = {points: [
				{x: hole.x + shapeRadius, y: hole.y + shapeRadius},
				{x: hole.x - shapeRadius, y: hole.y + shapeRadius},
				{x: hole.x - shapeRadius, y: hole.y - shapeRadius},
				{x: hole.x + shapeRadius, y: hole.y - shapeRadius}
			]};
			dShapeAttr = this.polyToD (poly);

		} else if (hole.shape === 'octagon') {
			// TODO: support rotation
			var mult = .4;
			var poly = {points: [
				{x: hole.x + shapeRadius, y: hole.y + shapeRadius*mult},
				{x: hole.x + shapeRadius*mult, y: hole.y + shapeRadius},
				{x: hole.x - shapeRadius*mult, y: hole.y + shapeRadius},
				{x: hole.x - shapeRadius, y: hole.y + shapeRadius*mult},
				{x: hole.x - shapeRadius, y: hole.y - shapeRadius*mult},
				{x: hole.x - shapeRadius*mult, y: hole.y - shapeRadius},
				{x: hole.x + shapeRadius*mult, y: hole.y - shapeRadius},
				{x: hole.x + shapeRadius, y: hole.y - shapeRadius*mult}
			]};
			dShapeAttr = this.polyToD (poly);

		// shape long is without hole
//		} else if (hole.shape === 'long') {
//
//			dShapeAttr = [
//				describeArcRadians (
//					hole.x - shapeRadius, hole.y, shapeRadius, Math.PI*.5, Math.PI*1.5
//				),
//				//'M', hole.x + shapeRadius, hole.y + shapeRadius,
//				'L', hole.x + shapeRadius, hole.y + shapeRadius,
//				describeArcRadians (
//					hole.x + shapeRadius, hole.y, shapeRadius, Math.PI*1.5, Math.PI*2.5
//				).replace (
//					/M.*A/, 'A'
//				),
//				'L', hole.x - shapeRadius, hole.y - shapeRadius,
////				'z'
//			].join (' ');
//
//			attrs.d = dShapeAttr// + ' ' + dAttr;
//
//			ctx.appendChild (SvgEl ('path', attrs));
//			return;

//		} else if (hole.shape === 'oval') {
//
//			dShapeAttr = [
//				describeArcRadians (
//					hole.x - shapeRadius, hole.y, shapeRadius, Math.PI*.5, Math.PI*1.5
//				),
//				//'M', hole.x + shapeRadius, hole.y + shapeRadius,
//				'L', hole.x + shapeRadius, hole.y + shapeRadius,
//				describeArcRadians (
//					hole.x + shapeRadius, hole.y, shapeRadius, Math.PI*1.5, Math.PI*2.5
//				).replace (
//					/M.*A/, 'A'
//				),
//				'L', hole.x - shapeRadius, hole.y - shapeRadius,
////				'z'
//			].join (' ');

//			dAttr = [
//				describeArcRadians (
//					hole.x - drillRadius, hole.y, drillRadius, Math.PI*.5, Math.PI*1.5
//				),
//				//'M', hole.x + drillRadius, hole.y + drillRadius,
//				'L', hole.x + drillRadius, hole.y + drillRadius,
//				describeArcRadians (
//					hole.x + drillRadius, hole.y, drillRadius, Math.PI*1.5, Math.PI*2.5
//				).replace (
//					/M.*A/, 'A'
//				),
//				'L', hole.x - drillRadius, hole.y - drillRadius,
////				'z'
//			].join (' ');
//
//			attrs.d = dShapeAttr// + ' ' + dAttr;
//
//			ctx.appendChild (SvgEl ('path', attrs));
//			return;


		} else {
			if (hole.shape !== 'circle') {

				if (!this.warnings["pad_shape_" + hole.shape]) {
					this.warnings["pad_shape_" + hole.shape] = true;
					console.warn ("pad shape '%s' is not supported yet", hole.shape);
				}
			}

			attrs.fill = "none";
			attrs.stroke = hole.strokeStyle;
			var restring = (hole.diameter - hole.drill)/2 || hole.strokeWidth;
			attrs['stroke-width'] = restring;
			drillRadius = (hole.drill + restring)/2 || hole.drill/2 + hole.strokeWidth/2;

			if (isNaN (restring))
				console.log (hole.diameter, hole.drill, hole.strokeWidth, drillRadius);
		}

		// two arcs
		var dAttr = describeArcRadians (
			hole.x, hole.y, drillRadius, 0, Math.PI
		) + describeArcRadians (
			hole.x, hole.y, drillRadius, Math.PI, Math.PI*2
		).replace (
			/M.*A/, 'A'
		) + 'z';

		attrs.d = dShapeAttr + ' ' + dAttr;

		ctx.appendChild (SvgEl ('path', attrs));
	}


	SVGRenderer.prototype.drawText = function (attrs, text, ctx) {
		var x = attrs.x || text.x,
			y = attrs.y || text.y,
			rot = attrs.rot || text.rot || "R0",
			size = text.size,
			flipText = attrs.flipText !== undefined ? attrs.flipText : text.flipText;

		var board = this.board;

		var content = attrs.content || text.content;
		var color   = attrs.color;

		var textAngle = board.angleForRot (rot);

		//rotation from 90.1 to 270 causes Eagle to draw labels 180 degrees rotated with top right anchor point
		var degrees  = textAngle.degrees,
			textRot  = board.matrixForRot(rot),
			fontSize = 10;

		var font = ''+fontSize+'pt vector';	//Use a regular font size - very small sizes seem to mess up spacing / kerning

		var strings = content.split (/\r?\n/);
		var stringOffset = (text.interlinear || 50) * fontSize / 100;

		var textCtx;

		ctx.appendChild (SvgEl ('g', {
			className: 'text',
			transform: 'matrix('+[textRot[0],textRot[2],textRot[1],textRot[3], x, y].join(', ')+')'
		}, textCtx = SvgEl ('g', {

		})));

		if (0) { // enable to draw zero points for text origin
			textCtx.appendChild (SvgEl ('circle', {cx: 0, cy: 0, r: 0.2, fill: textAngle.spin ? "grey" : flipText ? "blue" : "red"}));
		}

		var textEl;

		var textBlockHeight = (strings.length - 1) * (stringOffset + fontSize);
		var textBlockWidth = 0;

		var textAttrs = {
			'font-size': fontSize + 'pt',
			'font-family': 'vector',
			fill: color
		};

		var svgAlign = {left: 'start', center: 'middle', right: 'end'};
		var svgBaseline = {top: 'start', middle: 'middle', bottom: 'end'};

		if (text.align)  textAttrs['text-anchor'] = svgAlign[text.align];
		//if (text.valign) textAttrs['dominant-baseline'] = text.valign;
		if (text.valign) textAttrs['alignment-baseline'] = text.valign;

		textCtx.appendChild (textEl = SvgEl ('text', textAttrs));

		var xOffset = 0;

		strings.forEach (function (string, idx) {
			var yOffset = idx * (stringOffset + fontSize);
			if (text.valign === "middle") {
				yOffset -= textBlockHeight/2;
			} else if (text.valign === "bottom") {
				yOffset -= textBlockHeight;
			}
			var tspan = SvgEl ('tspan', {x: xOffset, y: yOffset}, string);
			textEl.appendChild (tspan);
			textBlockWidth = Math.max (textBlockWidth, tspan.getComputedTextLength());
			// ctx.fillText(string, xOffset, yOffset);
		}, this);

		var translateX = 0;
		var translateY = 0;

		var scale = (size / fontSize).toFixed (significantDigits);
		var scaleX = (scale * 1.25).toFixed (significantDigits),
			scaleY = ((board.coordYFlip ? 1 : -1) * scale).toFixed (significantDigits);

		if (flipText) {
			var xMult = {center: 0, left: 1, right: 1};
			var yMult = {middle: 0, bottom: -1, top: 1};

			translateX = xMult[text.align || "left"] * textBlockWidth;
			translateY = yMult[text.valign || "bottom"] * (textBlockHeight + fontSize);

			if (!textAngle.spin) {
				//textCtx.setAttributeNS (null, 'transform', 'matrix('+[-textRot[0],textRot[2],textRot[1],-textRot[3], x, y].join(', ')+')');
				scaleX = -scaleX;
				scaleY = -scaleY;
				translateX = -translateX;
				translateY = -translateY;
			};
		}

		textEl.setAttributeNS (null, 'transform', 'scale('+scaleX+', '+scaleY+') translate('+translateX+', '+translateY+')');

	}

	SVGRenderer.prototype.polyToD = function (poly) {
		var dAttr = [];
		poly.points.forEach (function (point, idx) {
			if (idx === 0)
				dAttr.push ('M')
			else
				dAttr.push ('L')
				dAttr.push (point.x.toFixed (significantDigits));
			dAttr.push (point.y.toFixed (significantDigits));
		});
		dAttr.push ('z');

		return dAttr.join (' ');
	}

	SVGRenderer.prototype.drawFilledPoly = function (poly, ctx) {
		var dAttr = this.polyToD (poly);

		ctx.appendChild (SvgEl ('path', {
			className: 'package-rect',
			d: dAttr,
			fill: poly.fillStyle,
			//"stroke-width": board.minLineWidth,
			"stroke-linecap": "round"
		}));
	}

	SVGRenderer.prototype.drawFilledCircle = function (poly, ctx) {

		ctx.appendChild (SvgEl ('circle', {
			className: 'package-circle',
			cx: poly.x,
			cy: poly.y,
			r: poly.radius,
			fill: poly.fillStyle,
			//"stroke-width": board.minLineWidth,
			"stroke-linecap": "round"
		}));
	}

	SVGRenderer.prototype.dimCanvas = function(alpha, ctx) {

		var board = this.board;

		ctx.appendChild (SvgEl ('rect', {
			x: board.boardFlipped ? board.nativeBounds[2] : board.nativeBounds[0],
			y: board.nativeBounds[1],
			width: board.nativeSize[0],
			height: board.nativeSize[1],
			fill: 'rgba(255,255,255,'+alpha+')'
		}));
//		ctx.save();
//		ctx.setTransform(1, 0, 0, 1, 0, 0);
//		ctx.globalCompositeOperation = 'destination-out';
//		ctx.fillStyle =
//		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//		ctx.restore();
	};

	return SVGRenderer;

}));
