function HtmlEl (name, attrs) {
	attrs = attrs || {};
	var el = attrs.xmlns ? document.createElementNS (attrs.xmlns, name) : document.createElement (name);
	for (var i in attrs) {
		if (i === 'xmlns') continue;
		el.setAttributeNS (null, i, attrs[i]);
		if (i.toLowerCase() == 'class') {
			el.className = attrs[i];  // for IE compatibility
		} else if (i.toLowerCase() == 'style') {
			el.style.cssText = attrs[i]; // for IE compatibility
		}
	}
	for (var i = 2; i<arguments.length; i++) {
		var val = arguments[i];
		if (typeof val == 'string')
			val = document.createTextNode( val );
		if (el && el.appendChild)
			el.appendChild (val);
	}
	return el;
}

function SvgEl (name, attrs) {
	attrs = Object.create (attrs || {});
	attrs.xmlns = "http://www.w3.org/2000/svg";
	var args = [].slice.call (arguments, 2);
	return HtmlEl.apply (window, [].concat ([name, attrs], args));
}
