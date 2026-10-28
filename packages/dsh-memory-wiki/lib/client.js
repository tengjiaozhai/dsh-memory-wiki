window.__ModuleLoader__.load({
	id: "dsh-memory-wiki",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
react = __toESM(react, 1);
let react_jsx_runtime = require("react/jsx-runtime");
let zod = require("zod");
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/dist/inherits-d1a1e29b.esm.js
function _toPrimitive$1(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _classCallCheck$1(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$1(e, r) {
	for (var t = 0; t < r.length; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey$1(o.key), o);
	}
}
function _createClass$1(e, r, t) {
	return r && _defineProperties$1(e.prototype, r), t && _defineProperties$1(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function _getPrototypeOf$1(t) {
	return _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
		return t.__proto__ || Object.getPrototypeOf(t);
	}, _getPrototypeOf$1(t);
}
function _isNativeReflectConstruct$1() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$1 = function() {
		return !!t;
	})();
}
function _assertThisInitialized$1(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function _possibleConstructorReturn$1(t, e) {
	if (e && ("object" == typeof e || "function" == typeof e)) return e;
	if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$1(t);
}
function _callSuper$1(t, o, e) {
	return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e));
}
function _setPrototypeOf$1(t, e) {
	return _setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf$1(t, e);
}
function _inherits$1(t, e) {
	if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
	t.prototype = Object.create(e && e.prototype, { constructor: {
		value: t,
		writable: !0,
		configurable: !0
	} }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf$1(t, e);
}
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/dist/colors-beb06eb2.esm.js
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayLikeToArray$1(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _unsupportedIterableToArray$1(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$1(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$1(r, a) : void 0;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray$1(r, e) || _nonIterableRest();
}
var HTML_COLORS = {
	black: "#000000",
	silver: "#C0C0C0",
	gray: "#808080",
	grey: "#808080",
	white: "#FFFFFF",
	maroon: "#800000",
	red: "#FF0000",
	purple: "#800080",
	fuchsia: "#FF00FF",
	green: "#008000",
	lime: "#00FF00",
	olive: "#808000",
	yellow: "#FFFF00",
	navy: "#000080",
	blue: "#0000FF",
	teal: "#008080",
	aqua: "#00FFFF",
	darkblue: "#00008B",
	mediumblue: "#0000CD",
	darkgreen: "#006400",
	darkcyan: "#008B8B",
	deepskyblue: "#00BFFF",
	darkturquoise: "#00CED1",
	mediumspringgreen: "#00FA9A",
	springgreen: "#00FF7F",
	cyan: "#00FFFF",
	midnightblue: "#191970",
	dodgerblue: "#1E90FF",
	lightseagreen: "#20B2AA",
	forestgreen: "#228B22",
	seagreen: "#2E8B57",
	darkslategray: "#2F4F4F",
	darkslategrey: "#2F4F4F",
	limegreen: "#32CD32",
	mediumseagreen: "#3CB371",
	turquoise: "#40E0D0",
	royalblue: "#4169E1",
	steelblue: "#4682B4",
	darkslateblue: "#483D8B",
	mediumturquoise: "#48D1CC",
	indigo: "#4B0082",
	darkolivegreen: "#556B2F",
	cadetblue: "#5F9EA0",
	cornflowerblue: "#6495ED",
	rebeccapurple: "#663399",
	mediumaquamarine: "#66CDAA",
	dimgray: "#696969",
	dimgrey: "#696969",
	slateblue: "#6A5ACD",
	olivedrab: "#6B8E23",
	slategray: "#708090",
	slategrey: "#708090",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	mediumslateblue: "#7B68EE",
	lawngreen: "#7CFC00",
	chartreuse: "#7FFF00",
	aquamarine: "#7FFFD4",
	skyblue: "#87CEEB",
	lightskyblue: "#87CEFA",
	blueviolet: "#8A2BE2",
	darkred: "#8B0000",
	darkmagenta: "#8B008B",
	saddlebrown: "#8B4513",
	darkseagreen: "#8FBC8F",
	lightgreen: "#90EE90",
	mediumpurple: "#9370DB",
	darkviolet: "#9400D3",
	palegreen: "#98FB98",
	darkorchid: "#9932CC",
	yellowgreen: "#9ACD32",
	sienna: "#A0522D",
	brown: "#A52A2A",
	darkgray: "#A9A9A9",
	darkgrey: "#A9A9A9",
	lightblue: "#ADD8E6",
	greenyellow: "#ADFF2F",
	paleturquoise: "#AFEEEE",
	lightsteelblue: "#B0C4DE",
	powderblue: "#B0E0E6",
	firebrick: "#B22222",
	darkgoldenrod: "#B8860B",
	mediumorchid: "#BA55D3",
	rosybrown: "#BC8F8F",
	darkkhaki: "#BDB76B",
	mediumvioletred: "#C71585",
	indianred: "#CD5C5C",
	peru: "#CD853F",
	chocolate: "#D2691E",
	tan: "#D2B48C",
	lightgray: "#D3D3D3",
	lightgrey: "#D3D3D3",
	thistle: "#D8BFD8",
	orchid: "#DA70D6",
	goldenrod: "#DAA520",
	palevioletred: "#DB7093",
	crimson: "#DC143C",
	gainsboro: "#DCDCDC",
	plum: "#DDA0DD",
	burlywood: "#DEB887",
	lightcyan: "#E0FFFF",
	lavender: "#E6E6FA",
	darksalmon: "#E9967A",
	violet: "#EE82EE",
	palegoldenrod: "#EEE8AA",
	lightcoral: "#F08080",
	khaki: "#F0E68C",
	aliceblue: "#F0F8FF",
	honeydew: "#F0FFF0",
	azure: "#F0FFFF",
	sandybrown: "#F4A460",
	wheat: "#F5DEB3",
	beige: "#F5F5DC",
	whitesmoke: "#F5F5F5",
	mintcream: "#F5FFFA",
	ghostwhite: "#F8F8FF",
	salmon: "#FA8072",
	antiquewhite: "#FAEBD7",
	linen: "#FAF0E6",
	lightgoldenrodyellow: "#FAFAD2",
	oldlace: "#FDF5E6",
	magenta: "#FF00FF",
	deeppink: "#FF1493",
	orangered: "#FF4500",
	tomato: "#FF6347",
	hotpink: "#FF69B4",
	coral: "#FF7F50",
	darkorange: "#FF8C00",
	lightsalmon: "#FFA07A",
	orange: "#FFA500",
	lightpink: "#FFB6C1",
	pink: "#FFC0CB",
	gold: "#FFD700",
	peachpuff: "#FFDAB9",
	navajowhite: "#FFDEAD",
	moccasin: "#FFE4B5",
	bisque: "#FFE4C4",
	mistyrose: "#FFE4E1",
	blanchedalmond: "#FFEBCD",
	papayawhip: "#FFEFD5",
	lavenderblush: "#FFF0F5",
	seashell: "#FFF5EE",
	cornsilk: "#FFF8DC",
	lemonchiffon: "#FFFACD",
	floralwhite: "#FFFAF0",
	snow: "#FFFAFA",
	lightyellow: "#FFFFE0",
	ivory: "#FFFFF0"
};
/**
* Memoized function returning a float-encoded color from various string
* formats describing colors.
*/
var INT8 = /* @__PURE__ */ new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function parseColor(val) {
	var r = 0;
	var g = 0;
	var b = 0;
	var a = 1;
	if (val[0] === "#") {
		if (val.length === 4) {
			r = parseInt(val.charAt(1) + val.charAt(1), 16);
			g = parseInt(val.charAt(2) + val.charAt(2), 16);
			b = parseInt(val.charAt(3) + val.charAt(3), 16);
		} else {
			r = parseInt(val.charAt(1) + val.charAt(2), 16);
			g = parseInt(val.charAt(3) + val.charAt(4), 16);
			b = parseInt(val.charAt(5) + val.charAt(6), 16);
		}
		if (val.length === 9) a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
	} else if (RGBA_TEST_REGEX.test(val)) {
		var match = val.match(RGBA_EXTRACT_REGEX);
		if (match) {
			r = +match[1];
			g = +match[2];
			b = +match[3];
			if (match[4]) a = +match[4];
		}
	}
	return {
		r,
		g,
		b,
		a
	};
}
var FLOAT_COLOR_CACHE = {};
for (var htmlColor in HTML_COLORS) {
	FLOAT_COLOR_CACHE[htmlColor] = floatColor(HTML_COLORS[htmlColor]);
	FLOAT_COLOR_CACHE[HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}
function rgbaToFloat(r, g, b, a, masking) {
	INT32[0] = a << 24 | b << 16 | g << 8 | r;
	if (masking) INT32[0] = INT32[0] & 4278190079;
	return FLOAT32[0];
}
function floatColor(val) {
	val = val.toLowerCase();
	if (typeof FLOAT_COLOR_CACHE[val] !== "undefined") return FLOAT_COLOR_CACHE[val];
	var parsed = parseColor(val);
	var r = parsed.r, g = parsed.g, b = parsed.b;
	var a = parsed.a;
	a = a * 255 | 0;
	var color = rgbaToFloat(r, g, b, a, true);
	FLOAT_COLOR_CACHE[val] = color;
	return color;
}
var FLOAT_INDEX_CACHE = {};
function indexToColor(index) {
	if (typeof FLOAT_INDEX_CACHE[index] !== "undefined") return FLOAT_INDEX_CACHE[index];
	var color = rgbaToFloat((index & 16711680) >>> 16, (index & 65280) >>> 8, index & 255, 255, true);
	FLOAT_INDEX_CACHE[index] = color;
	return color;
}
function colorToIndex(r, g, b, _a) {
	return b + (g << 8) + (r << 16);
}
function getPixelColor(gl, frameBuffer, x, y, pixelRatio, downSizingRatio) {
	var bufferX = Math.floor(x / downSizingRatio * pixelRatio);
	var bufferY = Math.floor(gl.drawingBufferHeight / downSizingRatio - y / downSizingRatio * pixelRatio);
	var pixel = /* @__PURE__ */ new Uint8Array(4);
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.readPixels(bufferX, bufferY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	var _pixel = _slicedToArray(pixel, 4);
	return [
		_pixel[0],
		_pixel[1],
		_pixel[2],
		_pixel[3]
	];
}
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/dist/index-fad77a13.esm.js
function _defineProperty$1(e, r, t) {
	return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _superPropBase(t, o) {
	for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf$1(t)););
	return t;
}
function _get() {
	return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, r) {
		var p = _superPropBase(e, t);
		if (p) {
			var n = Object.getOwnPropertyDescriptor(p, t);
			return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
		}
	}, _get.apply(null, arguments);
}
function _superPropGet(t, o, e, r) {
	var p = _get(_getPrototypeOf$1(1 & r ? t.prototype : t), o, e);
	return 2 & r && "function" == typeof p ? function(t) {
		return p.apply(e, t);
	} : p;
}
function getAttributeItemsCount(attr) {
	return attr.normalized ? 1 : attr.size;
}
function getAttributesItemsCount(attrs) {
	var res = 0;
	attrs.forEach(function(attr) {
		return res += getAttributeItemsCount(attr);
	});
	return res;
}
function loadShader(type, gl, source) {
	var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
	var shader = gl.createShader(glType);
	if (shader === null) throw new Error("loadShader: error while creating the shader");
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		var infoLog = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error("loadShader: error while compiling the shader:\n".concat(infoLog, "\n").concat(source));
	}
	return shader;
}
function loadVertexShader(gl, source) {
	return loadShader("VERTEX", gl, source);
}
function loadFragmentShader(gl, source) {
	return loadShader("FRAGMENT", gl, source);
}
/**
* Function used to load a program.
*/
function loadProgram(gl, shaders) {
	var program = gl.createProgram();
	if (program === null) throw new Error("loadProgram: error while creating the program.");
	var i = 0, l = shaders.length;
	for (; i < l; i++) gl.attachShader(program, shaders[i]);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		var info = gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw new Error("loadProgram: error while linking the program: ".concat(info));
	}
	return program;
}
function killProgram(_ref) {
	var gl = _ref.gl, buffer = _ref.buffer, program = _ref.program, vertexShader = _ref.vertexShader, fragmentShader = _ref.fragmentShader;
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	gl.deleteProgram(program);
	gl.deleteBuffer(buffer);
}
var PICKING_PREFIX = "#define PICKING_MODE\n";
var SIZE_FACTOR_PER_ATTRIBUTE_TYPE = _defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1({}, WebGL2RenderingContext.BOOL, 1), WebGL2RenderingContext.BYTE, 1), WebGL2RenderingContext.UNSIGNED_BYTE, 1), WebGL2RenderingContext.SHORT, 2), WebGL2RenderingContext.UNSIGNED_SHORT, 2), WebGL2RenderingContext.INT, 4), WebGL2RenderingContext.UNSIGNED_INT, 4), WebGL2RenderingContext.FLOAT, 4);
var Program = /*#__PURE__*/ function() {
	function Program(gl, pickingBuffer, renderer) {
		_classCallCheck$1(this, Program);
		_defineProperty$1(this, "array", /* @__PURE__ */ new Float32Array());
		_defineProperty$1(this, "constantArray", /* @__PURE__ */ new Float32Array());
		_defineProperty$1(this, "capacity", 0);
		_defineProperty$1(this, "verticesCount", 0);
		var def = this.getDefinition();
		this.VERTICES = def.VERTICES;
		this.VERTEX_SHADER_SOURCE = def.VERTEX_SHADER_SOURCE;
		this.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE;
		this.UNIFORMS = def.UNIFORMS;
		this.ATTRIBUTES = def.ATTRIBUTES;
		this.METHOD = def.METHOD;
		this.CONSTANT_ATTRIBUTES = "CONSTANT_ATTRIBUTES" in def ? def.CONSTANT_ATTRIBUTES : [];
		this.CONSTANT_DATA = "CONSTANT_DATA" in def ? def.CONSTANT_DATA : [];
		this.isInstanced = "CONSTANT_ATTRIBUTES" in def;
		this.ATTRIBUTES_ITEMS_COUNT = getAttributesItemsCount(this.ATTRIBUTES);
		this.STRIDE = this.VERTICES * this.ATTRIBUTES_ITEMS_COUNT;
		this.renderer = renderer;
		this.normalProgram = this.getProgramInfo("normal", gl, def.VERTEX_SHADER_SOURCE, def.FRAGMENT_SHADER_SOURCE, null);
		this.pickProgram = pickingBuffer ? this.getProgramInfo("pick", gl, PICKING_PREFIX + def.VERTEX_SHADER_SOURCE, PICKING_PREFIX + def.FRAGMENT_SHADER_SOURCE, pickingBuffer) : null;
		if (this.isInstanced) {
			var constantAttributesItemsCount = getAttributesItemsCount(this.CONSTANT_ATTRIBUTES);
			if (this.CONSTANT_DATA.length !== this.VERTICES) throw new Error("Program: error while getting constant data (expected ".concat(this.VERTICES, " items, received ").concat(this.CONSTANT_DATA.length, " instead)"));
			this.constantArray = new Float32Array(this.CONSTANT_DATA.length * constantAttributesItemsCount);
			for (var i = 0; i < this.CONSTANT_DATA.length; i++) {
				var vector = this.CONSTANT_DATA[i];
				if (vector.length !== constantAttributesItemsCount) throw new Error("Program: error while getting constant data (one vector has ".concat(vector.length, " items instead of ").concat(constantAttributesItemsCount, ")"));
				for (var j = 0; j < vector.length; j++) this.constantArray[i * constantAttributesItemsCount + j] = vector[j];
			}
			this.STRIDE = this.ATTRIBUTES_ITEMS_COUNT;
		}
	}
	return _createClass$1(Program, [
		{
			key: "kill",
			value: function kill() {
				killProgram(this.normalProgram);
				if (this.pickProgram) {
					killProgram(this.pickProgram);
					this.pickProgram = null;
				}
			}
		},
		{
			key: "getProgramInfo",
			value: function getProgramInfo(name, gl, vertexShaderSource, fragmentShaderSource, frameBuffer) {
				var def = this.getDefinition();
				var buffer = gl.createBuffer();
				if (buffer === null) throw new Error("Program: error while creating the WebGL buffer.");
				var vertexShader = loadVertexShader(gl, vertexShaderSource);
				var fragmentShader = loadFragmentShader(gl, fragmentShaderSource);
				var program = loadProgram(gl, [vertexShader, fragmentShader]);
				var uniformLocations = {};
				def.UNIFORMS.forEach(function(uniformName) {
					var location = gl.getUniformLocation(program, uniformName);
					if (location) uniformLocations[uniformName] = location;
				});
				var attributeLocations = {};
				def.ATTRIBUTES.forEach(function(attr) {
					attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
				});
				var constantBuffer;
				if ("CONSTANT_ATTRIBUTES" in def) {
					def.CONSTANT_ATTRIBUTES.forEach(function(attr) {
						attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
					});
					constantBuffer = gl.createBuffer();
					if (constantBuffer === null) throw new Error("Program: error while creating the WebGL constant buffer.");
				}
				return {
					name,
					program,
					gl,
					frameBuffer,
					buffer,
					constantBuffer: constantBuffer || {},
					uniformLocations,
					attributeLocations,
					isPicking: name === "pick",
					vertexShader,
					fragmentShader
				};
			}
		},
		{
			key: "bindProgram",
			value: function bindProgram(program) {
				var _this = this;
				var offset = 0;
				var gl = program.gl, buffer = program.buffer;
				if (!this.isInstanced) {
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					offset = 0;
					this.ATTRIBUTES.forEach(function(attr) {
						return offset += _this.bindAttribute(attr, program, offset);
					});
					gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
				} else {
					gl.bindBuffer(gl.ARRAY_BUFFER, program.constantBuffer);
					offset = 0;
					this.CONSTANT_ATTRIBUTES.forEach(function(attr) {
						return offset += _this.bindAttribute(attr, program, offset, false);
					});
					gl.bufferData(gl.ARRAY_BUFFER, this.constantArray, gl.STATIC_DRAW);
					gl.bindBuffer(gl.ARRAY_BUFFER, program.buffer);
					offset = 0;
					this.ATTRIBUTES.forEach(function(attr) {
						return offset += _this.bindAttribute(attr, program, offset, true);
					});
					gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
				}
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
			}
		},
		{
			key: "unbindProgram",
			value: function unbindProgram(program) {
				var _this2 = this;
				if (!this.isInstanced) this.ATTRIBUTES.forEach(function(attr) {
					return _this2.unbindAttribute(attr, program);
				});
				else {
					this.CONSTANT_ATTRIBUTES.forEach(function(attr) {
						return _this2.unbindAttribute(attr, program, false);
					});
					this.ATTRIBUTES.forEach(function(attr) {
						return _this2.unbindAttribute(attr, program, true);
					});
				}
			}
		},
		{
			key: "bindAttribute",
			value: function bindAttribute(attr, program, offset, setDivisor) {
				var sizeFactor = SIZE_FACTOR_PER_ATTRIBUTE_TYPE[attr.type];
				if (typeof sizeFactor !== "number") throw new Error("Program.bind: yet unsupported attribute type \"".concat(attr.type, "\""));
				var location = program.attributeLocations[attr.name];
				var gl = program.gl;
				if (location !== -1) {
					gl.enableVertexAttribArray(location);
					var stride = !this.isInstanced ? this.ATTRIBUTES_ITEMS_COUNT * Float32Array.BYTES_PER_ELEMENT : (setDivisor ? this.ATTRIBUTES_ITEMS_COUNT : getAttributesItemsCount(this.CONSTANT_ATTRIBUTES)) * Float32Array.BYTES_PER_ELEMENT;
					gl.vertexAttribPointer(location, attr.size, attr.type, attr.normalized || false, stride, offset);
					if (this.isInstanced && setDivisor) {
						if (gl instanceof WebGL2RenderingContext) gl.vertexAttribDivisor(location, 1);
						else {
							var ext = gl.getExtension("ANGLE_instanced_arrays");
							if (ext) ext.vertexAttribDivisorANGLE(location, 1);
						}
					}
				}
				return attr.size * sizeFactor;
			}
		},
		{
			key: "unbindAttribute",
			value: function unbindAttribute(attr, program, unsetDivisor) {
				var location = program.attributeLocations[attr.name];
				var gl = program.gl;
				if (location !== -1) {
					gl.disableVertexAttribArray(location);
					if (this.isInstanced && unsetDivisor) {
						if (gl instanceof WebGL2RenderingContext) gl.vertexAttribDivisor(location, 0);
						else {
							var ext = gl.getExtension("ANGLE_instanced_arrays");
							if (ext) ext.vertexAttribDivisorANGLE(location, 0);
						}
					}
				}
			}
		},
		{
			key: "reallocate",
			value: function reallocate(capacity) {
				if (capacity === this.capacity) return;
				this.capacity = capacity;
				this.verticesCount = this.VERTICES * capacity;
				this.array = new Float32Array(!this.isInstanced ? this.verticesCount * this.ATTRIBUTES_ITEMS_COUNT : this.capacity * this.ATTRIBUTES_ITEMS_COUNT);
			}
		},
		{
			key: "hasNothingToRender",
			value: function hasNothingToRender() {
				return this.verticesCount === 0;
			}
		},
		{
			key: "renderProgram",
			value: function renderProgram(params, programInfo) {
				var gl = programInfo.gl, program = programInfo.program;
				gl.enable(gl.BLEND);
				gl.useProgram(program);
				this.setUniforms(params, programInfo);
				this.drawWebGL(this.METHOD, programInfo);
			}
		},
		{
			key: "render",
			value: function render(params) {
				if (this.hasNothingToRender()) return;
				if (this.pickProgram) {
					this.pickProgram.gl.viewport(0, 0, params.width * params.pixelRatio / params.downSizingRatio, params.height * params.pixelRatio / params.downSizingRatio);
					this.bindProgram(this.pickProgram);
					this.renderProgram(_objectSpread2$1(_objectSpread2$1({}, params), {}, { pixelRatio: params.pixelRatio / params.downSizingRatio }), this.pickProgram);
					this.unbindProgram(this.pickProgram);
				}
				this.normalProgram.gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
				this.bindProgram(this.normalProgram);
				this.renderProgram(params, this.normalProgram);
				this.unbindProgram(this.normalProgram);
			}
		},
		{
			key: "drawWebGL",
			value: function drawWebGL(method, _ref) {
				var gl = _ref.gl, frameBuffer = _ref.frameBuffer;
				gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
				if (!this.isInstanced) gl.drawArrays(method, 0, this.verticesCount);
				else if (gl instanceof WebGL2RenderingContext) gl.drawArraysInstanced(method, 0, this.VERTICES, this.capacity);
				else {
					var ext = gl.getExtension("ANGLE_instanced_arrays");
					if (ext) ext.drawArraysInstancedANGLE(method, 0, this.VERTICES, this.capacity);
				}
			}
		}
	]);
}();
var NodeProgram = /*#__PURE__*/ function(_ref) {
	function NodeProgram() {
		_classCallCheck$1(this, NodeProgram);
		return _callSuper$1(this, NodeProgram, arguments);
	}
	_inherits$1(NodeProgram, _ref);
	return _createClass$1(NodeProgram, [{
		key: "kill",
		value: function kill() {
			_superPropGet(NodeProgram, "kill", this, 3)([]);
		}
	}, {
		key: "process",
		value: function process(nodeIndex, offset, data) {
			var i = offset * this.STRIDE;
			if (data.hidden) {
				for (var l = i + this.STRIDE; i < l; i++) this.array[i] = 0;
				return;
			}
			return this.processVisibleItem(indexToColor(nodeIndex), i, data);
		}
	}]);
}(Program);
var EdgeProgram = /*#__PURE__*/ function(_ref) {
	function EdgeProgram() {
		var _this;
		_classCallCheck$1(this, EdgeProgram);
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		_this = _callSuper$1(this, EdgeProgram, [].concat(args));
		_defineProperty$1(_this, "drawLabel", void 0);
		return _this;
	}
	_inherits$1(EdgeProgram, _ref);
	return _createClass$1(EdgeProgram, [{
		key: "kill",
		value: function kill() {
			_superPropGet(EdgeProgram, "kill", this, 3)([]);
		}
	}, {
		key: "process",
		value: function process(edgeIndex, offset, sourceData, targetData, data) {
			var i = offset * this.STRIDE;
			if (data.hidden || sourceData.hidden || targetData.hidden) {
				for (var l = i + this.STRIDE; i < l; i++) this.array[i] = 0;
				return;
			}
			return this.processVisibleItem(indexToColor(edgeIndex), i, sourceData, targetData, data);
		}
	}]);
}(Program);
/**
* Helper function combining two or more programs into a single compound one.
* Note that this is more a quick & easy way to combine program than a really
* performant option. More performant programs can be written entirely.
*
* @param  {array}    programClasses - Program classes to combine.
* @param  {function} drawLabel - An optional edge "draw label" function.
* @return {function}
*/
function createEdgeCompoundProgram(programClasses, drawLabel) {
	return /*#__PURE__*/ function() {
		function EdgeCompoundProgram(gl, pickingBuffer, renderer) {
			_classCallCheck$1(this, EdgeCompoundProgram);
			_defineProperty$1(this, "drawLabel", drawLabel);
			this.programs = programClasses.map(function(Program) {
				return new Program(gl, pickingBuffer, renderer);
			});
		}
		return _createClass$1(EdgeCompoundProgram, [
			{
				key: "reallocate",
				value: function reallocate(capacity) {
					this.programs.forEach(function(program) {
						return program.reallocate(capacity);
					});
				}
			},
			{
				key: "process",
				value: function process(edgeIndex, offset, sourceData, targetData, data) {
					this.programs.forEach(function(program) {
						return program.process(edgeIndex, offset, sourceData, targetData, data);
					});
				}
			},
			{
				key: "render",
				value: function render(params) {
					this.programs.forEach(function(program) {
						return program.render(params);
					});
				}
			},
			{
				key: "kill",
				value: function kill() {
					this.programs.forEach(function(program) {
						return program.kill();
					});
				}
			}
		]);
	}();
}
function drawStraightEdgeLabel(context, edgeData, sourceData, targetData, settings) {
	var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000" : settings.edgeLabelColor.color;
	var label = edgeData.label;
	if (!label) return;
	context.fillStyle = color;
	context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
	var sSize = sourceData.size;
	var tSize = targetData.size;
	var sx = sourceData.x;
	var sy = sourceData.y;
	var tx = targetData.x;
	var ty = targetData.y;
	var cx = (sx + tx) / 2;
	var cy = (sy + ty) / 2;
	var dx = tx - sx;
	var dy = ty - sy;
	var d = Math.sqrt(dx * dx + dy * dy);
	if (d < sSize + tSize) return;
	sx += dx * sSize / d;
	sy += dy * sSize / d;
	tx -= dx * tSize / d;
	ty -= dy * tSize / d;
	cx = (sx + tx) / 2;
	cy = (sy + ty) / 2;
	dx = tx - sx;
	dy = ty - sy;
	d = Math.sqrt(dx * dx + dy * dy);
	var textLength = context.measureText(label).width;
	if (textLength > d) {
		var ellipsis = "…";
		label = label + ellipsis;
		textLength = context.measureText(label).width;
		while (textLength > d && label.length > 1) {
			label = label.slice(0, -2) + ellipsis;
			textLength = context.measureText(label).width;
		}
		if (label.length < 4) return;
	}
	var angle;
	if (dx > 0) {
		if (dy > 0) angle = Math.acos(dx / d);
		else angle = Math.asin(dy / d);
	} else if (dy > 0) angle = Math.acos(dx / d) + Math.PI;
	else angle = Math.asin(dx / d) + Math.PI / 2;
	context.save();
	context.translate(cx, cy);
	context.rotate(angle);
	context.fillText(label, -textLength / 2, edgeData.size / 2 + size);
	context.restore();
}
function drawDiscNodeLabel(context, data, settings) {
	if (!data.label) return;
	var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
	context.fillStyle = settings.labelColor.attribute ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000" : settings.labelColor.color;
	context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
	context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
/**
* Draw an hovered node.
* - if there is no label => display a shadow on the node
* - if the label box is bigger than node size => display a label box that contains the node with a shadow
* - else node with shadow and the label box
*/
function drawDiscNodeHover(context, data, settings) {
	var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
	context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
	context.fillStyle = "#FFF";
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 8;
	context.shadowColor = "#000";
	var PADDING = 2;
	if (typeof data.label === "string") {
		var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 5), boxHeight = Math.round(size + 2 * PADDING), radius = Math.max(data.size, size / 2) + PADDING;
		var angleRadian = Math.asin(boxHeight / 2 / radius);
		var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));
		context.beginPath();
		context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
		context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
		context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
		context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
		context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
		context.closePath();
		context.fill();
	} else {
		context.beginPath();
		context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	drawDiscNodeLabel(context, data, settings);
}
var FRAGMENT_SHADER_SOURCE$2 = "\nprecision highp float;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\n\nuniform float u_correctionRatio;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float border = u_correctionRatio * 2.0;\n  float dist = length(v_diffVector) - v_radius + border;\n\n  // No antialiasing for picking mode:\n  #ifdef PICKING_MODE\n  if (dist > border)\n    gl_FragColor = transparent;\n  else\n    gl_FragColor = v_color;\n\n  #else\n  float t = 0.0;\n  if (dist > border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / border;\n\n  gl_FragColor = mix(v_color, transparent, t);\n  #endif\n}\n";
var VERTEX_SHADER_SOURCE$3 = "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_position;\nattribute float a_size;\nattribute float a_angle;\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;\n  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));\n  vec2 position = a_position + diffVector;\n  gl_Position = vec4(\n    (u_matrix * vec3(position, 1)).xy,\n    0,\n    1\n  );\n\n  v_diffVector = diffVector;\n  v_radius = size / 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n";
var _WebGLRenderingContex$3 = WebGLRenderingContext;
var UNSIGNED_BYTE$3 = _WebGLRenderingContex$3.UNSIGNED_BYTE;
var FLOAT$3 = _WebGLRenderingContex$3.FLOAT;
var UNIFORMS$3 = [
	"u_sizeRatio",
	"u_correctionRatio",
	"u_matrix"
];
var NodeCircleProgram = /*#__PURE__*/ function(_NodeProgram) {
	function NodeCircleProgram() {
		_classCallCheck$1(this, NodeCircleProgram);
		return _callSuper$1(this, NodeCircleProgram, arguments);
	}
	_inherits$1(NodeCircleProgram, _NodeProgram);
	return _createClass$1(NodeCircleProgram, [
		{
			key: "getDefinition",
			value: function getDefinition() {
				return {
					VERTICES: 3,
					VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$3,
					FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE$2,
					METHOD: WebGLRenderingContext.TRIANGLES,
					UNIFORMS: UNIFORMS$3,
					ATTRIBUTES: [
						{
							name: "a_position",
							size: 2,
							type: FLOAT$3
						},
						{
							name: "a_size",
							size: 1,
							type: FLOAT$3
						},
						{
							name: "a_color",
							size: 4,
							type: UNSIGNED_BYTE$3,
							normalized: true
						},
						{
							name: "a_id",
							size: 4,
							type: UNSIGNED_BYTE$3,
							normalized: true
						}
					],
					CONSTANT_ATTRIBUTES: [{
						name: "a_angle",
						size: 1,
						type: FLOAT$3
					}],
					CONSTANT_DATA: [
						[NodeCircleProgram.ANGLE_1],
						[NodeCircleProgram.ANGLE_2],
						[NodeCircleProgram.ANGLE_3]
					]
				};
			}
		},
		{
			key: "processVisibleItem",
			value: function processVisibleItem(nodeIndex, startIndex, data) {
				var array = this.array;
				var color = floatColor(data.color);
				array[startIndex++] = data.x;
				array[startIndex++] = data.y;
				array[startIndex++] = data.size;
				array[startIndex++] = color;
				array[startIndex++] = nodeIndex;
			}
		},
		{
			key: "setUniforms",
			value: function setUniforms(params, _ref) {
				var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
				var u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_matrix = uniformLocations.u_matrix;
				gl.uniform1f(u_correctionRatio, params.correctionRatio);
				gl.uniform1f(u_sizeRatio, params.sizeRatio);
				gl.uniformMatrix3fv(u_matrix, false, params.matrix);
			}
		}
	]);
}(NodeProgram);
_defineProperty$1(NodeCircleProgram, "ANGLE_1", 0);
_defineProperty$1(NodeCircleProgram, "ANGLE_2", 2 * Math.PI / 3);
_defineProperty$1(NodeCircleProgram, "ANGLE_3", 4 * Math.PI / 3);
var FRAGMENT_SHADER_SOURCE$1 = "\nprecision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n";
var VERTEX_SHADER_SOURCE$2 = "\nattribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_radius;\nattribute vec3 a_barycentric;\n\n#ifdef PICKING_MODE\nattribute vec4 a_id;\n#else\nattribute vec4 a_color;\n#endif\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_widenessToThicknessRatio;\n\nvarying vec4 v_color;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl and\n  // edge.clamped.vert.glsl. Please read it to get better comments on what's\n  // happening:\n  float pixelsThickness = max(normalLength / u_sizeRatio, minThickness);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float webGLNodeRadius = a_radius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n  float webGLArrowHeadThickness = webGLThickness * u_widenessToThicknessRatio;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * (webGLNodeRadius * unitNormal.y)\n    + db * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y + webGLArrowHeadThickness * unitNormal.x)\n    + dc * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y - webGLArrowHeadThickness * unitNormal.x),\n\n      da * (-webGLNodeRadius * unitNormal.x)\n    + db * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x + webGLArrowHeadThickness * unitNormal.y)\n    + dc * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x - webGLArrowHeadThickness * unitNormal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n";
var _WebGLRenderingContex$2 = WebGLRenderingContext;
var UNSIGNED_BYTE$2 = _WebGLRenderingContex$2.UNSIGNED_BYTE;
var FLOAT$2 = _WebGLRenderingContex$2.FLOAT;
var UNIFORMS$2 = [
	"u_matrix",
	"u_sizeRatio",
	"u_correctionRatio",
	"u_minEdgeThickness",
	"u_lengthToThicknessRatio",
	"u_widenessToThicknessRatio"
];
var DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS = {
	extremity: "target",
	lengthToThicknessRatio: 2.5,
	widenessToThicknessRatio: 2
};
function createEdgeArrowHeadProgram(inputOptions) {
	var options = _objectSpread2$1(_objectSpread2$1({}, DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS), inputOptions || {});
	return /*#__PURE__*/ function(_EdgeProgram) {
		function EdgeArrowHeadProgram() {
			_classCallCheck$1(this, EdgeArrowHeadProgram);
			return _callSuper$1(this, EdgeArrowHeadProgram, arguments);
		}
		_inherits$1(EdgeArrowHeadProgram, _EdgeProgram);
		return _createClass$1(EdgeArrowHeadProgram, [
			{
				key: "getDefinition",
				value: function getDefinition() {
					return {
						VERTICES: 3,
						VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$2,
						FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE$1,
						METHOD: WebGLRenderingContext.TRIANGLES,
						UNIFORMS: UNIFORMS$2,
						ATTRIBUTES: [
							{
								name: "a_position",
								size: 2,
								type: FLOAT$2
							},
							{
								name: "a_normal",
								size: 2,
								type: FLOAT$2
							},
							{
								name: "a_radius",
								size: 1,
								type: FLOAT$2
							},
							{
								name: "a_color",
								size: 4,
								type: UNSIGNED_BYTE$2,
								normalized: true
							},
							{
								name: "a_id",
								size: 4,
								type: UNSIGNED_BYTE$2,
								normalized: true
							}
						],
						CONSTANT_ATTRIBUTES: [{
							name: "a_barycentric",
							size: 3,
							type: FLOAT$2
						}],
						CONSTANT_DATA: [
							[
								1,
								0,
								0
							],
							[
								0,
								1,
								0
							],
							[
								0,
								0,
								1
							]
						]
					};
				}
			},
			{
				key: "processVisibleItem",
				value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
					if (options.extremity === "source") {
						var _ref = [targetData, sourceData];
						sourceData = _ref[0];
						targetData = _ref[1];
					}
					var thickness = data.size || 1;
					var radius = targetData.size || 1;
					var x1 = sourceData.x;
					var y1 = sourceData.y;
					var x2 = targetData.x;
					var y2 = targetData.y;
					var color = floatColor(data.color);
					var dx = x2 - x1;
					var dy = y2 - y1;
					var len = dx * dx + dy * dy;
					var n1 = 0;
					var n2 = 0;
					if (len) {
						len = 1 / Math.sqrt(len);
						n1 = -dy * len * thickness;
						n2 = dx * len * thickness;
					}
					var array = this.array;
					array[startIndex++] = x2;
					array[startIndex++] = y2;
					array[startIndex++] = -n1;
					array[startIndex++] = -n2;
					array[startIndex++] = radius;
					array[startIndex++] = color;
					array[startIndex++] = edgeIndex;
				}
			},
			{
				key: "setUniforms",
				value: function setUniforms(params, _ref2) {
					var gl = _ref2.gl, uniformLocations = _ref2.uniformLocations;
					var u_matrix = uniformLocations.u_matrix, u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio, u_widenessToThicknessRatio = uniformLocations.u_widenessToThicknessRatio;
					gl.uniformMatrix3fv(u_matrix, false, params.matrix);
					gl.uniform1f(u_sizeRatio, params.sizeRatio);
					gl.uniform1f(u_correctionRatio, params.correctionRatio);
					gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
					gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
					gl.uniform1f(u_widenessToThicknessRatio, options.widenessToThicknessRatio);
				}
			}
		]);
	}(EdgeProgram);
}
createEdgeArrowHeadProgram();
var FRAGMENT_SHADER_SOURCE = "\nprecision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  // We only handle antialiasing for normal mode:\n  #ifdef PICKING_MODE\n  gl_FragColor = v_color;\n  #else\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - v_feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, transparent, t);\n  #endif\n}\n";
var VERTEX_SHADER_SOURCE$1 = "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_normal;\nattribute float a_normalCoef;\nattribute vec2 a_positionStart;\nattribute vec2 a_positionEnd;\nattribute float a_positionCoef;\nattribute float a_radius;\nattribute float a_radiusCoef;\n\nuniform mat3 u_matrix;\nuniform float u_zoomRatio;\nuniform float u_sizeRatio;\nuniform float u_pixelRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_feather;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  float radius = a_radius * a_radiusCoef;\n  vec2 normal = a_normal * a_normalCoef;\n  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;\n\n  float normalLength = length(normal);\n  vec2 unitNormal = normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;\n\n  // Here, we move the point to leave space for the arrow head:\n  float direction = sign(radius);\n  float webGLNodeRadius = direction * radius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n\n  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (webGLNodeRadius + webGLArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness + compensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_zoomRatio;\n\n  v_normal = unitNormal;\n\n  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n";
var _WebGLRenderingContex$1 = WebGLRenderingContext;
var UNSIGNED_BYTE$1 = _WebGLRenderingContex$1.UNSIGNED_BYTE;
var FLOAT$1 = _WebGLRenderingContex$1.FLOAT;
var UNIFORMS$1 = [
	"u_matrix",
	"u_zoomRatio",
	"u_sizeRatio",
	"u_correctionRatio",
	"u_pixelRatio",
	"u_feather",
	"u_minEdgeThickness",
	"u_lengthToThicknessRatio"
];
var DEFAULT_EDGE_CLAMPED_PROGRAM_OPTIONS = { lengthToThicknessRatio: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS.lengthToThicknessRatio };
function createEdgeClampedProgram(inputOptions) {
	var options = _objectSpread2$1(_objectSpread2$1({}, DEFAULT_EDGE_CLAMPED_PROGRAM_OPTIONS), inputOptions || {});
	return /*#__PURE__*/ function(_EdgeProgram) {
		function EdgeClampedProgram() {
			_classCallCheck$1(this, EdgeClampedProgram);
			return _callSuper$1(this, EdgeClampedProgram, arguments);
		}
		_inherits$1(EdgeClampedProgram, _EdgeProgram);
		return _createClass$1(EdgeClampedProgram, [
			{
				key: "getDefinition",
				value: function getDefinition() {
					return {
						VERTICES: 6,
						VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$1,
						FRAGMENT_SHADER_SOURCE,
						METHOD: WebGLRenderingContext.TRIANGLES,
						UNIFORMS: UNIFORMS$1,
						ATTRIBUTES: [
							{
								name: "a_positionStart",
								size: 2,
								type: FLOAT$1
							},
							{
								name: "a_positionEnd",
								size: 2,
								type: FLOAT$1
							},
							{
								name: "a_normal",
								size: 2,
								type: FLOAT$1
							},
							{
								name: "a_color",
								size: 4,
								type: UNSIGNED_BYTE$1,
								normalized: true
							},
							{
								name: "a_id",
								size: 4,
								type: UNSIGNED_BYTE$1,
								normalized: true
							},
							{
								name: "a_radius",
								size: 1,
								type: FLOAT$1
							}
						],
						CONSTANT_ATTRIBUTES: [
							{
								name: "a_positionCoef",
								size: 1,
								type: FLOAT$1
							},
							{
								name: "a_normalCoef",
								size: 1,
								type: FLOAT$1
							},
							{
								name: "a_radiusCoef",
								size: 1,
								type: FLOAT$1
							}
						],
						CONSTANT_DATA: [
							[
								0,
								1,
								0
							],
							[
								0,
								-1,
								0
							],
							[
								1,
								1,
								1
							],
							[
								1,
								1,
								1
							],
							[
								0,
								-1,
								0
							],
							[
								1,
								-1,
								-1
							]
						]
					};
				}
			},
			{
				key: "processVisibleItem",
				value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
					var thickness = data.size || 1;
					var x1 = sourceData.x;
					var y1 = sourceData.y;
					var x2 = targetData.x;
					var y2 = targetData.y;
					var color = floatColor(data.color);
					var dx = x2 - x1;
					var dy = y2 - y1;
					var radius = targetData.size || 1;
					var len = dx * dx + dy * dy;
					var n1 = 0;
					var n2 = 0;
					if (len) {
						len = 1 / Math.sqrt(len);
						n1 = -dy * len * thickness;
						n2 = dx * len * thickness;
					}
					var array = this.array;
					array[startIndex++] = x1;
					array[startIndex++] = y1;
					array[startIndex++] = x2;
					array[startIndex++] = y2;
					array[startIndex++] = n1;
					array[startIndex++] = n2;
					array[startIndex++] = color;
					array[startIndex++] = edgeIndex;
					array[startIndex++] = radius;
				}
			},
			{
				key: "setUniforms",
				value: function setUniforms(params, _ref) {
					var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
					var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio;
					gl.uniformMatrix3fv(u_matrix, false, params.matrix);
					gl.uniform1f(u_zoomRatio, params.zoomRatio);
					gl.uniform1f(u_sizeRatio, params.sizeRatio);
					gl.uniform1f(u_correctionRatio, params.correctionRatio);
					gl.uniform1f(u_pixelRatio, params.pixelRatio);
					gl.uniform1f(u_feather, params.antiAliasingFeather);
					gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
					gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
				}
			}
		]);
	}(EdgeProgram);
}
createEdgeClampedProgram();
function createEdgeArrowProgram(inputOptions) {
	return createEdgeCompoundProgram([createEdgeClampedProgram(inputOptions), createEdgeArrowHeadProgram(inputOptions)]);
}
var EdgeArrowProgram$1 = createEdgeArrowProgram();
var VERTEX_SHADER_SOURCE = "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_normal;\nattribute float a_normalCoef;\nattribute vec2 a_positionStart;\nattribute vec2 a_positionEnd;\nattribute float a_positionCoef;\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_zoomRatio;\nuniform float u_pixelRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_feather;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  vec2 normal = a_normal * a_normalCoef;\n  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;\n\n  float normalLength = length(normal);\n  vec2 unitNormal = normal / normalLength;\n\n  // We require edges to be at least \"minThickness\" pixels thick *on screen*\n  // (so we need to compensate the size ratio):\n  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);\n\n  // Then, we need to retrieve the normalized thickness of the edge in the WebGL\n  // referential (in a ([0, 1], [0, 1]) space), using our \"magic\" correction\n  // ratio:\n  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness, 1)).xy, 0, 1);\n\n  // For the fragment shader though, we need a thickness that takes the \"magic\"\n  // correction ratio into account (as in webGLThickness), but so that the\n  // antialiasing effect does not depend on the zoom level. So here's yet\n  // another thickness version:\n  v_thickness = webGLThickness / u_zoomRatio;\n\n  v_normal = unitNormal;\n\n  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n";
var _WebGLRenderingContex$4 = WebGLRenderingContext;
var UNSIGNED_BYTE$4 = _WebGLRenderingContex$4.UNSIGNED_BYTE;
var FLOAT$4 = _WebGLRenderingContex$4.FLOAT;
var UNIFORMS = [
	"u_matrix",
	"u_zoomRatio",
	"u_sizeRatio",
	"u_correctionRatio",
	"u_pixelRatio",
	"u_feather",
	"u_minEdgeThickness"
];
var EdgeRectangleProgram = /*#__PURE__*/ function(_EdgeProgram) {
	function EdgeRectangleProgram() {
		_classCallCheck$1(this, EdgeRectangleProgram);
		return _callSuper$1(this, EdgeRectangleProgram, arguments);
	}
	_inherits$1(EdgeRectangleProgram, _EdgeProgram);
	return _createClass$1(EdgeRectangleProgram, [
		{
			key: "getDefinition",
			value: function getDefinition() {
				return {
					VERTICES: 6,
					VERTEX_SHADER_SOURCE,
					FRAGMENT_SHADER_SOURCE,
					METHOD: WebGLRenderingContext.TRIANGLES,
					UNIFORMS,
					ATTRIBUTES: [
						{
							name: "a_positionStart",
							size: 2,
							type: FLOAT$4
						},
						{
							name: "a_positionEnd",
							size: 2,
							type: FLOAT$4
						},
						{
							name: "a_normal",
							size: 2,
							type: FLOAT$4
						},
						{
							name: "a_color",
							size: 4,
							type: UNSIGNED_BYTE$4,
							normalized: true
						},
						{
							name: "a_id",
							size: 4,
							type: UNSIGNED_BYTE$4,
							normalized: true
						}
					],
					CONSTANT_ATTRIBUTES: [{
						name: "a_positionCoef",
						size: 1,
						type: FLOAT$4
					}, {
						name: "a_normalCoef",
						size: 1,
						type: FLOAT$4
					}],
					CONSTANT_DATA: [
						[0, 1],
						[0, -1],
						[1, 1],
						[1, 1],
						[0, -1],
						[1, -1]
					]
				};
			}
		},
		{
			key: "processVisibleItem",
			value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
				var thickness = data.size || 1;
				var x1 = sourceData.x;
				var y1 = sourceData.y;
				var x2 = targetData.x;
				var y2 = targetData.y;
				var color = floatColor(data.color);
				var dx = x2 - x1;
				var dy = y2 - y1;
				var len = dx * dx + dy * dy;
				var n1 = 0;
				var n2 = 0;
				if (len) {
					len = 1 / Math.sqrt(len);
					n1 = -dy * len * thickness;
					n2 = dx * len * thickness;
				}
				var array = this.array;
				array[startIndex++] = x1;
				array[startIndex++] = y1;
				array[startIndex++] = x2;
				array[startIndex++] = y2;
				array[startIndex++] = n1;
				array[startIndex++] = n2;
				array[startIndex++] = color;
				array[startIndex++] = edgeIndex;
			}
		},
		{
			key: "setUniforms",
			value: function setUniforms(params, _ref) {
				var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
				var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness;
				gl.uniformMatrix3fv(u_matrix, false, params.matrix);
				gl.uniform1f(u_zoomRatio, params.zoomRatio);
				gl.uniform1f(u_sizeRatio, params.sizeRatio);
				gl.uniform1f(u_correctionRatio, params.correctionRatio);
				gl.uniform1f(u_pixelRatio, params.pixelRatio);
				gl.uniform1f(u_feather, params.antiAliasingFeather);
				gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
			}
		}
	]);
}(EdgeProgram);
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/types/dist/sigma-types.esm.js
var import_events = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var R = typeof Reflect === "object" ? Reflect : null;
	var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply(target, receiver, args) {
		return Function.prototype.apply.call(target, receiver, args);
	};
	var ReflectOwnKeys;
	if (R && typeof R.ownKeys === "function") ReflectOwnKeys = R.ownKeys;
	else if (Object.getOwnPropertySymbols) ReflectOwnKeys = function ReflectOwnKeys(target) {
		return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
	};
	else ReflectOwnKeys = function ReflectOwnKeys(target) {
		return Object.getOwnPropertyNames(target);
	};
	function ProcessEmitWarning(warning) {
		if (console && console.warn) console.warn(warning);
	}
	var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
		return value !== value;
	};
	function EventEmitter() {
		EventEmitter.init.call(this);
	}
	module.exports = EventEmitter;
	module.exports.once = once;
	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.prototype._events = void 0;
	EventEmitter.prototype._eventsCount = 0;
	EventEmitter.prototype._maxListeners = void 0;
	var defaultMaxListeners = 10;
	function checkListener(listener) {
		if (typeof listener !== "function") throw new TypeError("The \"listener\" argument must be of type Function. Received type " + typeof listener);
	}
	Object.defineProperty(EventEmitter, "defaultMaxListeners", {
		enumerable: true,
		get: function() {
			return defaultMaxListeners;
		},
		set: function(arg) {
			if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) throw new RangeError("The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received " + arg + ".");
			defaultMaxListeners = arg;
		}
	});
	EventEmitter.init = function() {
		if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
			this._events = Object.create(null);
			this._eventsCount = 0;
		}
		this._maxListeners = this._maxListeners || void 0;
	};
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
		if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) throw new RangeError("The value of \"n\" is out of range. It must be a non-negative number. Received " + n + ".");
		this._maxListeners = n;
		return this;
	};
	function _getMaxListeners(that) {
		if (that._maxListeners === void 0) return EventEmitter.defaultMaxListeners;
		return that._maxListeners;
	}
	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
		return _getMaxListeners(this);
	};
	EventEmitter.prototype.emit = function emit(type) {
		var args = [];
		for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
		var doError = type === "error";
		var events = this._events;
		if (events !== void 0) doError = doError && events.error === void 0;
		else if (!doError) return false;
		if (doError) {
			var er;
			if (args.length > 0) er = args[0];
			if (er instanceof Error) throw er;
			var err = /* @__PURE__ */ new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
			err.context = er;
			throw err;
		}
		var handler = events[type];
		if (handler === void 0) return false;
		if (typeof handler === "function") ReflectApply(handler, this, args);
		else {
			var len = handler.length;
			var listeners = arrayClone(handler, len);
			for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
		}
		return true;
	};
	function _addListener(target, type, listener, prepend) {
		var m;
		var events;
		var existing;
		checkListener(listener);
		events = target._events;
		if (events === void 0) {
			events = target._events = Object.create(null);
			target._eventsCount = 0;
		} else {
			if (events.newListener !== void 0) {
				target.emit("newListener", type, listener.listener ? listener.listener : listener);
				events = target._events;
			}
			existing = events[type];
		}
		if (existing === void 0) {
			existing = events[type] = listener;
			++target._eventsCount;
		} else {
			if (typeof existing === "function") existing = events[type] = prepend ? [listener, existing] : [existing, listener];
			else if (prepend) existing.unshift(listener);
			else existing.push(listener);
			m = _getMaxListeners(target);
			if (m > 0 && existing.length > m && !existing.warned) {
				existing.warned = true;
				var w = /* @__PURE__ */ new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
				w.name = "MaxListenersExceededWarning";
				w.emitter = target;
				w.type = type;
				w.count = existing.length;
				ProcessEmitWarning(w);
			}
		}
		return target;
	}
	EventEmitter.prototype.addListener = function addListener(type, listener) {
		return _addListener(this, type, listener, false);
	};
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	EventEmitter.prototype.prependListener = function prependListener(type, listener) {
		return _addListener(this, type, listener, true);
	};
	function onceWrapper() {
		if (!this.fired) {
			this.target.removeListener(this.type, this.wrapFn);
			this.fired = true;
			if (arguments.length === 0) return this.listener.call(this.target);
			return this.listener.apply(this.target, arguments);
		}
	}
	function _onceWrap(target, type, listener) {
		var state = {
			fired: false,
			wrapFn: void 0,
			target,
			type,
			listener
		};
		var wrapped = onceWrapper.bind(state);
		wrapped.listener = listener;
		state.wrapFn = wrapped;
		return wrapped;
	}
	EventEmitter.prototype.once = function once(type, listener) {
		checkListener(listener);
		this.on(type, _onceWrap(this, type, listener));
		return this;
	};
	EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
		checkListener(listener);
		this.prependListener(type, _onceWrap(this, type, listener));
		return this;
	};
	EventEmitter.prototype.removeListener = function removeListener(type, listener) {
		var list, events, position, i, originalListener;
		checkListener(listener);
		events = this._events;
		if (events === void 0) return this;
		list = events[type];
		if (list === void 0) return this;
		if (list === listener || list.listener === listener) {
			if (--this._eventsCount === 0) this._events = Object.create(null);
			else {
				delete events[type];
				if (events.removeListener) this.emit("removeListener", type, list.listener || listener);
			}
		} else if (typeof list !== "function") {
			position = -1;
			for (i = list.length - 1; i >= 0; i--) if (list[i] === listener || list[i].listener === listener) {
				originalListener = list[i].listener;
				position = i;
				break;
			}
			if (position < 0) return this;
			if (position === 0) list.shift();
			else spliceOne(list, position);
			if (list.length === 1) events[type] = list[0];
			if (events.removeListener !== void 0) this.emit("removeListener", type, originalListener || listener);
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
		var listeners, events = this._events, i;
		if (events === void 0) return this;
		if (events.removeListener === void 0) {
			if (arguments.length === 0) {
				this._events = Object.create(null);
				this._eventsCount = 0;
			} else if (events[type] !== void 0) {
				if (--this._eventsCount === 0) this._events = Object.create(null);
				else delete events[type];
			}
			return this;
		}
		if (arguments.length === 0) {
			var keys = Object.keys(events);
			var key;
			for (i = 0; i < keys.length; ++i) {
				key = keys[i];
				if (key === "removeListener") continue;
				this.removeAllListeners(key);
			}
			this.removeAllListeners("removeListener");
			this._events = Object.create(null);
			this._eventsCount = 0;
			return this;
		}
		listeners = events[type];
		if (typeof listeners === "function") this.removeListener(type, listeners);
		else if (listeners !== void 0) for (i = listeners.length - 1; i >= 0; i--) this.removeListener(type, listeners[i]);
		return this;
	};
	function _listeners(target, type, unwrap) {
		var events = target._events;
		if (events === void 0) return [];
		var evlistener = events[type];
		if (evlistener === void 0) return [];
		if (typeof evlistener === "function") return unwrap ? [evlistener.listener || evlistener] : [evlistener];
		return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
	}
	EventEmitter.prototype.listeners = function listeners(type) {
		return _listeners(this, type, true);
	};
	EventEmitter.prototype.rawListeners = function rawListeners(type) {
		return _listeners(this, type, false);
	};
	EventEmitter.listenerCount = function(emitter, type) {
		if (typeof emitter.listenerCount === "function") return emitter.listenerCount(type);
		else return listenerCount.call(emitter, type);
	};
	EventEmitter.prototype.listenerCount = listenerCount;
	function listenerCount(type) {
		var events = this._events;
		if (events !== void 0) {
			var evlistener = events[type];
			if (typeof evlistener === "function") return 1;
			else if (evlistener !== void 0) return evlistener.length;
		}
		return 0;
	}
	EventEmitter.prototype.eventNames = function eventNames() {
		return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
	};
	function arrayClone(arr, n) {
		var copy = new Array(n);
		for (var i = 0; i < n; ++i) copy[i] = arr[i];
		return copy;
	}
	function spliceOne(list, index) {
		for (; index + 1 < list.length; index++) list[index] = list[index + 1];
		list.pop();
	}
	function unwrapListeners(arr) {
		var ret = new Array(arr.length);
		for (var i = 0; i < ret.length; ++i) ret[i] = arr[i].listener || arr[i];
		return ret;
	}
	function once(emitter, name) {
		return new Promise(function(resolve, reject) {
			function errorListener(err) {
				emitter.removeListener(name, resolver);
				reject(err);
			}
			function resolver() {
				if (typeof emitter.removeListener === "function") emitter.removeListener("error", errorListener);
				resolve([].slice.call(arguments));
			}
			eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
			if (name !== "error") addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
		});
	}
	function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
		if (typeof emitter.on === "function") eventTargetAgnosticAddListener(emitter, "error", handler, flags);
	}
	function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
		if (typeof emitter.on === "function") {
			if (flags.once) emitter.once(name, listener);
			else emitter.on(name, listener);
		} else if (typeof emitter.addEventListener === "function") emitter.addEventListener(name, function wrapListener(arg) {
			if (flags.once) emitter.removeEventListener(name, wrapListener);
			listener(arg);
		});
		else throw new TypeError("The \"emitter\" argument must be of type EventEmitter. Received type " + typeof emitter);
	}
})))();
/**
* Util type to represent maps of typed elements, but implemented with
* JavaScript objects.
*/
/**
* Returns a type similar to T, but with the K set of properties of the type
* T *required*, and the rest optional.
*/
/**
* Returns a type similar to Partial<T>, but with at least one key set.
*/
/**
* Custom event emitter types.
*/
var TypedEventEmitter = /*#__PURE__*/ function(_ref) {
	function TypedEventEmitter() {
		var _this;
		_classCallCheck$1(this, TypedEventEmitter);
		_this = _callSuper$1(this, TypedEventEmitter);
		_this.rawEmitter = _this;
		return _this;
	}
	_inherits$1(TypedEventEmitter, _ref);
	return _createClass$1(TypedEventEmitter);
}(import_events.EventEmitter);
//#endregion
//#region ../../node_modules/.pnpm/graphology-utils@2.5.2_graphology-types@0.24.8/node_modules/graphology-utils/is-graph.js
var require_is_graph = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology isGraph
	* ===================
	*
	* Very simple function aiming at ensuring the given variable is a
	* graphology instance.
	*/
	/**
	* Checking the value is a graphology instance.
	*
	* @param  {any}     value - Target value.
	* @return {boolean}
	*/
	module.exports = function isGraph(value) {
		return value !== null && typeof value === "object" && typeof value.addUndirectedEdgeWithKey === "function" && typeof value.dropNode === "function" && typeof value.multi === "boolean";
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/dist/normalization-be445518.esm.js
var import_is_graph = /* @__PURE__ */ __toESM(require_is_graph());
var easings = {
	linear: function linear(k) {
		return k;
	},
	quadraticIn: function quadraticIn(k) {
		return k * k;
	},
	quadraticOut: function quadraticOut(k) {
		return k * (2 - k);
	},
	quadraticInOut: function quadraticInOut(k) {
		if ((k *= 2) < 1) return .5 * k * k;
		return -.5 * (--k * (k - 2) - 1);
	},
	cubicIn: function cubicIn(k) {
		return k * k * k;
	},
	cubicOut: function cubicOut(k) {
		return --k * k * k + 1;
	},
	cubicInOut: function cubicInOut(k) {
		if ((k *= 2) < 1) return .5 * k * k * k;
		return .5 * ((k -= 2) * k * k + 2);
	}
};
/**
* Defaults.
*/
var ANIMATE_DEFAULTS = {
	easing: "quadraticInOut",
	duration: 150
};
function identity() {
	return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
function scale(m, x, y) {
	m[0] = x;
	m[4] = typeof y === "number" ? y : x;
	return m;
}
function rotate(m, r) {
	var s = Math.sin(r), c = Math.cos(r);
	m[0] = c;
	m[1] = s;
	m[3] = -s;
	m[4] = c;
	return m;
}
function translate(m, x, y) {
	m[6] = x;
	m[7] = y;
	return m;
}
function multiply(a, b) {
	var a00 = a[0], a01 = a[1], a02 = a[2];
	var a10 = a[3], a11 = a[4], a12 = a[5];
	var a20 = a[6], a21 = a[7], a22 = a[8];
	var b00 = b[0], b01 = b[1], b02 = b[2];
	var b10 = b[3], b11 = b[4], b12 = b[5];
	var b20 = b[6], b21 = b[7], b22 = b[8];
	a[0] = b00 * a00 + b01 * a10 + b02 * a20;
	a[1] = b00 * a01 + b01 * a11 + b02 * a21;
	a[2] = b00 * a02 + b01 * a12 + b02 * a22;
	a[3] = b10 * a00 + b11 * a10 + b12 * a20;
	a[4] = b10 * a01 + b11 * a11 + b12 * a21;
	a[5] = b10 * a02 + b11 * a12 + b12 * a22;
	a[6] = b20 * a00 + b21 * a10 + b22 * a20;
	a[7] = b20 * a01 + b21 * a11 + b22 * a21;
	a[8] = b20 * a02 + b21 * a12 + b22 * a22;
	return a;
}
function multiplyVec2(a, b) {
	var z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
	var a00 = a[0];
	var a01 = a[1];
	var a10 = a[3];
	var a11 = a[4];
	var a20 = a[6];
	var a21 = a[7];
	var b0 = b.x;
	var b1 = b.y;
	return {
		x: b0 * a00 + b1 * a10 + a20 * z,
		y: b0 * a01 + b1 * a11 + a21 * z
	};
}
/**
* In sigma, the graph is normalized into a [0, 1], [0, 1] square, before being given to the various renderers. This
* helps to deal with quadtree in particular.
* But at some point, we need to rescale it so that it takes the best place in the screen, i.e. we always want to see two
* nodes "touching" opposite sides of the graph, with the camera being at its default state.
*
* This function determines this ratio.
*/
function getCorrectionRatio(viewportDimensions, graphDimensions) {
	var viewportRatio = viewportDimensions.height / viewportDimensions.width;
	var graphRatio = graphDimensions.height / graphDimensions.width;
	if (viewportRatio < 1 && graphRatio > 1 || viewportRatio > 1 && graphRatio < 1) return 1;
	return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}
/**
* Function returning a matrix from the current state of the camera.
*/
function matrixFromCamera(state, viewportDimensions, graphDimensions, padding, inverse) {
	var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
	var width = viewportDimensions.width, height = viewportDimensions.height;
	var matrix = identity();
	var smallestDimension = Math.min(width, height) - 2 * padding;
	var correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);
	if (!inverse) {
		multiply(matrix, scale(identity(), 2 * (smallestDimension / width) * correctionRatio, 2 * (smallestDimension / height) * correctionRatio));
		multiply(matrix, rotate(identity(), -angle));
		multiply(matrix, scale(identity(), 1 / ratio));
		multiply(matrix, translate(identity(), -x, -y));
	} else {
		multiply(matrix, translate(identity(), x, y));
		multiply(matrix, scale(identity(), ratio));
		multiply(matrix, rotate(identity(), angle));
		multiply(matrix, scale(identity(), width / smallestDimension / 2 / correctionRatio, height / smallestDimension / 2 / correctionRatio));
	}
	return matrix;
}
/**
* All these transformations we apply on the matrix to get it rescale the graph
* as we want make it very hard to get pixel-perfect distances in WebGL. This
* function returns a factor that properly cancels the matrix effect on lengths.
*
* [jacomyal]
* To be fully honest, I can't really explain happens here... I notice that the
* following ratio works (i.e. it correctly compensates the matrix impact on all
* camera states I could try):
* > `R = size(V) / size(M * V) / W`
* as long as `M * V` is in the direction of W (ie. parallel to (Ox)). It works
* as well with H and a vector that transforms into something parallel to (Oy).
*
* Also, note that we use `angle` and not `-angle` (that would seem logical,
* since we want to anticipate the rotation), because the image is vertically
* swapped in WebGL.
*/
function getMatrixImpact(matrix, cameraState, viewportDimensions) {
	var _multiplyVec = multiplyVec2(matrix, {
		x: Math.cos(cameraState.angle),
		y: Math.sin(cameraState.angle)
	}, 0), x = _multiplyVec.x, y = _multiplyVec.y;
	return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
}
/**
* Function returning the graph's node extent in x & y.
*/
function graphExtent(graph) {
	if (!graph.order) return {
		x: [0, 1],
		y: [0, 1]
	};
	var xMin = Infinity;
	var xMax = -Infinity;
	var yMin = Infinity;
	var yMax = -Infinity;
	graph.forEachNode(function(_, attr) {
		var x = attr.x, y = attr.y;
		if (x < xMin) xMin = x;
		if (x > xMax) xMax = x;
		if (y < yMin) yMin = y;
		if (y > yMax) yMax = y;
	});
	return {
		x: [xMin, xMax],
		y: [yMin, yMax]
	};
}
/**
* Check if the graph variable is a valid graph, and if sigma can render it.
*/
function validateGraph(graph) {
	if (!(0, import_is_graph.default)(graph)) throw new Error("Sigma: invalid graph instance.");
	graph.forEachNode(function(key, attributes) {
		if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) throw new Error("Sigma: Coordinates of node ".concat(key, " are invalid. A node must have a numeric 'x' and 'y' attribute."));
	});
}
/**
* Function used to create DOM elements easily.
*/
function createElement(tag, style, attributes) {
	var element = document.createElement(tag);
	if (style) for (var k in style) element.style[k] = style[k];
	if (attributes) for (var _k in attributes) element.setAttribute(_k, attributes[_k]);
	return element;
}
/**
* Function returning the browser's pixel ratio.
*/
function getPixelRatio() {
	if (typeof window.devicePixelRatio !== "undefined") return window.devicePixelRatio;
	return 1;
}
/**
* Function ordering the given elements in reverse z-order so they drawn
* the correct way.
*/
function zIndexOrdering(_extent, getter, elements) {
	return elements.sort(function(a, b) {
		var zA = getter(a) || 0, zB = getter(b) || 0;
		if (zA < zB) return -1;
		if (zA > zB) return 1;
		return 0;
	});
}
/**
* Factory returning a function normalizing the given node's position & size.
*/
function createNormalizationFunction(extent) {
	var _extent$x = _slicedToArray(extent.x, 2), minX = _extent$x[0], maxX = _extent$x[1], _extent$y = _slicedToArray(extent.y, 2), minY = _extent$y[0], maxY = _extent$y[1];
	var ratio = Math.max(maxX - minX, maxY - minY), dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
	if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio)) ratio = 1;
	if (isNaN(dX)) dX = 0;
	if (isNaN(dY)) dY = 0;
	var fn = function fn(data) {
		return {
			x: .5 + (data.x - dX) / ratio,
			y: .5 + (data.y - dY) / ratio
		};
	};
	fn.applyTo = function(data) {
		data.x = .5 + (data.x - dX) / ratio;
		data.y = .5 + (data.y - dY) / ratio;
	};
	fn.inverse = function(data) {
		return {
			x: dX + ratio * (data.x - .5),
			y: dY + ratio * (data.y - .5)
		};
	};
	fn.ratio = ratio;
	return fn;
}
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/dist/data-11df7124.esm.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
/**
* Extends the target array with the given values.
*/
function extend(array, values) {
	var l2 = values.size;
	if (l2 === 0) return;
	var l1 = array.length;
	array.length += l2;
	var i = 0;
	values.forEach(function(value) {
		array[l1 + i] = value;
		i++;
	});
}
/**
* Helper to use `Object.assign` with more than two objects.
*/
function assign$1(target) {
	target = target || {};
	for (var i = 0, l = arguments.length <= 1 ? 0 : arguments.length - 1; i < l; i++) {
		var o = i + 1 < 1 || arguments.length <= i + 1 ? void 0 : arguments[i + 1];
		if (!o) continue;
		Object.assign(target, o);
	}
	return target;
}
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/settings/dist/sigma-settings.esm.js
/**
* Sigma.js Settings
* =================================
*
* The list of settings and some handy functions.
* @module
*/
/**
* Sigma.js settings
* =================================
*/
var DEFAULT_SETTINGS = {
	hideEdgesOnMove: false,
	hideLabelsOnMove: false,
	renderLabels: true,
	renderEdgeLabels: false,
	enableEdgeEvents: false,
	defaultNodeColor: "#999",
	defaultNodeType: "circle",
	defaultEdgeColor: "#ccc",
	defaultEdgeType: "line",
	labelFont: "Arial",
	labelSize: 14,
	labelWeight: "normal",
	labelColor: { color: "#000" },
	edgeLabelFont: "Arial",
	edgeLabelSize: 14,
	edgeLabelWeight: "normal",
	edgeLabelColor: { attribute: "color" },
	stagePadding: 30,
	defaultDrawEdgeLabel: drawStraightEdgeLabel,
	defaultDrawNodeLabel: drawDiscNodeLabel,
	defaultDrawNodeHover: drawDiscNodeHover,
	minEdgeThickness: 1.7,
	antiAliasingFeather: 1,
	dragTimeout: 100,
	draggedEventsTolerance: 3,
	inertiaDuration: 200,
	inertiaRatio: 3,
	zoomDuration: 250,
	zoomingRatio: 1.7,
	doubleClickTimeout: 300,
	doubleClickZoomingRatio: 2.2,
	doubleClickZoomingDuration: 200,
	tapMoveTolerance: 10,
	zoomToSizeRatioFunction: Math.sqrt,
	itemSizesReference: "screen",
	autoRescale: true,
	autoCenter: true,
	labelDensity: 1,
	labelGridCellSize: 100,
	labelRenderedSizeThreshold: 6,
	nodeReducer: null,
	edgeReducer: null,
	zIndex: false,
	minCameraRatio: null,
	maxCameraRatio: null,
	enableCameraZooming: true,
	enableCameraPanning: true,
	enableCameraRotation: true,
	cameraPanBoundaries: null,
	allowInvalidContainer: false,
	nodeProgramClasses: {},
	nodeHoverProgramClasses: {},
	edgeProgramClasses: {}
};
var DEFAULT_NODE_PROGRAM_CLASSES = { circle: NodeCircleProgram };
var DEFAULT_EDGE_PROGRAM_CLASSES = {
	arrow: EdgeArrowProgram$1,
	line: EdgeRectangleProgram
};
function validateSettings(settings) {
	if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
	var minCameraRatio = settings.minCameraRatio, maxCameraRatio = settings.maxCameraRatio;
	if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.");
}
function resolveSettings(settings) {
	var resolvedSettings = assign$1({}, DEFAULT_SETTINGS, settings);
	resolvedSettings.nodeProgramClasses = assign$1({}, DEFAULT_NODE_PROGRAM_CLASSES, resolvedSettings.nodeProgramClasses);
	resolvedSettings.edgeProgramClasses = assign$1({}, DEFAULT_EDGE_PROGRAM_CLASSES, resolvedSettings.edgeProgramClasses);
	return resolvedSettings;
}
//#endregion
//#region ../../node_modules/.pnpm/sigma@3.0.3_graphology-types@0.24.8/node_modules/sigma/dist/sigma.esm.js
/**
* Defaults.
*/
var DEFAULT_ZOOMING_RATIO = 1.5;
/**
* Event types.
*/
/**
* Camera class
*/
var Camera = /*#__PURE__*/ function(_TypedEventEmitter) {
	function Camera() {
		var _this;
		_classCallCheck$1(this, Camera);
		_this = _callSuper$1(this, Camera);
		_defineProperty$1(_this, "x", .5);
		_defineProperty$1(_this, "y", .5);
		_defineProperty$1(_this, "angle", 0);
		_defineProperty$1(_this, "ratio", 1);
		_defineProperty$1(_this, "minRatio", null);
		_defineProperty$1(_this, "maxRatio", null);
		_defineProperty$1(_this, "enabledZooming", true);
		_defineProperty$1(_this, "enabledPanning", true);
		_defineProperty$1(_this, "enabledRotation", true);
		_defineProperty$1(_this, "clean", null);
		_defineProperty$1(_this, "nextFrame", null);
		_defineProperty$1(_this, "previousState", null);
		_defineProperty$1(_this, "enabled", true);
		_this.previousState = _this.getState();
		return _this;
	}
	/**
	* Static method used to create a Camera object with a given state.
	*/
	_inherits$1(Camera, _TypedEventEmitter);
	return _createClass$1(Camera, [
		{
			key: "enable",
			value: 
			/**
			* Method used to enable the camera.
			*/
			function enable() {
				this.enabled = true;
				return this;
			}
		},
		{
			key: "disable",
			value: function disable() {
				this.enabled = false;
				return this;
			}
		},
		{
			key: "getState",
			value: function getState() {
				return {
					x: this.x,
					y: this.y,
					angle: this.angle,
					ratio: this.ratio
				};
			}
		},
		{
			key: "hasState",
			value: function hasState(state) {
				return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
			}
		},
		{
			key: "getPreviousState",
			value: function getPreviousState() {
				var state = this.previousState;
				if (!state) return null;
				return {
					x: state.x,
					y: state.y,
					angle: state.angle,
					ratio: state.ratio
				};
			}
		},
		{
			key: "getBoundedRatio",
			value: function getBoundedRatio(ratio) {
				var r = ratio;
				if (typeof this.minRatio === "number") r = Math.max(r, this.minRatio);
				if (typeof this.maxRatio === "number") r = Math.min(r, this.maxRatio);
				return r;
			}
		},
		{
			key: "validateState",
			value: function validateState(state) {
				var validatedState = {};
				if (this.enabledPanning && typeof state.x === "number") validatedState.x = state.x;
				if (this.enabledPanning && typeof state.y === "number") validatedState.y = state.y;
				if (this.enabledZooming && typeof state.ratio === "number") validatedState.ratio = this.getBoundedRatio(state.ratio);
				if (this.enabledRotation && typeof state.angle === "number") validatedState.angle = state.angle;
				return this.clean ? this.clean(_objectSpread2$1(_objectSpread2$1({}, this.getState()), validatedState)) : validatedState;
			}
		},
		{
			key: "isAnimated",
			value: function isAnimated() {
				return !!this.nextFrame;
			}
		},
		{
			key: "setState",
			value: function setState(state) {
				if (!this.enabled) return this;
				this.previousState = this.getState();
				var validState = this.validateState(state);
				if (typeof validState.x === "number") this.x = validState.x;
				if (typeof validState.y === "number") this.y = validState.y;
				if (typeof validState.ratio === "number") this.ratio = validState.ratio;
				if (typeof validState.angle === "number") this.angle = validState.angle;
				if (!this.hasState(this.previousState)) this.emit("updated", this.getState());
				return this;
			}
		},
		{
			key: "updateState",
			value: function updateState(updater) {
				this.setState(updater(this.getState()));
				return this;
			}
		},
		{
			key: "animate",
			value: function animate(state) {
				var _this2 = this;
				var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var callback = arguments.length > 2 ? arguments[2] : void 0;
				if (!callback) return new Promise(function(resolve) {
					return _this2.animate(state, opts, resolve);
				});
				if (!this.enabled) return;
				var options = _objectSpread2$1(_objectSpread2$1({}, ANIMATE_DEFAULTS), opts);
				var validState = this.validateState(state);
				var easing = typeof options.easing === "function" ? options.easing : easings[options.easing];
				var start = Date.now(), initialState = this.getState();
				var _fn = function fn() {
					var t = (Date.now() - start) / options.duration;
					if (t >= 1) {
						_this2.nextFrame = null;
						_this2.setState(validState);
						if (_this2.animationCallback) {
							_this2.animationCallback.call(null);
							_this2.animationCallback = void 0;
						}
						return;
					}
					var coefficient = easing(t);
					var newState = {};
					if (typeof validState.x === "number") newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
					if (typeof validState.y === "number") newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
					if (_this2.enabledRotation && typeof validState.angle === "number") newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
					if (typeof validState.ratio === "number") newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;
					_this2.setState(newState);
					_this2.nextFrame = requestAnimationFrame(_fn);
				};
				if (this.nextFrame) {
					cancelAnimationFrame(this.nextFrame);
					if (this.animationCallback) this.animationCallback.call(null);
					this.nextFrame = requestAnimationFrame(_fn);
				} else _fn();
				this.animationCallback = callback;
			}
		},
		{
			key: "animatedZoom",
			value: function animatedZoom(factorOrOptions) {
				if (!factorOrOptions) return this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
				if (typeof factorOrOptions === "number") return this.animate({ ratio: this.ratio / factorOrOptions });
				return this.animate({ ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO) }, factorOrOptions);
			}
		},
		{
			key: "animatedUnzoom",
			value: function animatedUnzoom(factorOrOptions) {
				if (!factorOrOptions) return this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
				if (typeof factorOrOptions === "number") return this.animate({ ratio: this.ratio * factorOrOptions });
				return this.animate({ ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO) }, factorOrOptions);
			}
		},
		{
			key: "animatedReset",
			value: function animatedReset(options) {
				return this.animate({
					x: .5,
					y: .5,
					ratio: 1,
					angle: 0
				}, options);
			}
		},
		{
			key: "copy",
			value: function copy() {
				return Camera.from(this.getState());
			}
		}
	], [{
		key: "from",
		value: function from(state) {
			return new Camera().setState(state);
		}
	}]);
}(TypedEventEmitter);
/**
* Captor utils functions
* ======================
*/
/**
* Extract the local X and Y coordinates from a mouse event or touch object. If
* a DOM element is given, it uses this element's offset to compute the position
* (this allows using events that are not bound to the container itself and
* still have a proper position).
*
* @param  {event}       e - A mouse event or touch object.
* @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
* @return {number}      The local Y value of the mouse.
*/
function getPosition(e, dom) {
	var bbox = dom.getBoundingClientRect();
	return {
		x: e.clientX - bbox.left,
		y: e.clientY - bbox.top
	};
}
/**
* Convert mouse coords to sigma coords.
*
* @param  {event}       e   - A mouse event or touch object.
* @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
* @return {object}
*/
function getMouseCoords(e, dom) {
	var res = _objectSpread2$1(_objectSpread2$1({}, getPosition(e, dom)), {}, {
		sigmaDefaultPrevented: false,
		preventSigmaDefault: function preventSigmaDefault() {
			res.sigmaDefaultPrevented = true;
		},
		original: e
	});
	return res;
}
/**
* Takes a touch coords or a mouse coords, and always returns a clean mouse coords object.
*/
function cleanMouseCoords(e) {
	var res = "x" in e ? e : _objectSpread2$1(_objectSpread2$1({}, e.touches[0] || e.previousTouches[0]), {}, {
		original: e.original,
		sigmaDefaultPrevented: e.sigmaDefaultPrevented,
		preventSigmaDefault: function preventSigmaDefault() {
			e.sigmaDefaultPrevented = true;
			res.sigmaDefaultPrevented = true;
		}
	});
	return res;
}
/**
* Convert mouse wheel event coords to sigma coords.
*
* @param  {event}       e   - A wheel mouse event.
* @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
* @return {object}
*/
function getWheelCoords(e, dom) {
	return _objectSpread2$1(_objectSpread2$1({}, getMouseCoords(e, dom)), {}, { delta: getWheelDelta(e) });
}
var MAX_TOUCHES = 2;
function getTouchesArray(touches) {
	var arr = [];
	for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++) arr.push(touches[i]);
	return arr;
}
/**
* Convert touch coords to sigma coords.
*
* @param  {event}       e               - A touch event.
* @param  {Touch[]}     previousTouches - An array of the previously stored touches.
* @param  {HTMLElement} dom             - A DOM element to compute offset relatively to.
* @return {object}
*/
function getTouchCoords(e, previousTouches, dom) {
	var res = {
		touches: getTouchesArray(e.touches).map(function(touch) {
			return getPosition(touch, dom);
		}),
		previousTouches: previousTouches.map(function(touch) {
			return getPosition(touch, dom);
		}),
		sigmaDefaultPrevented: false,
		preventSigmaDefault: function preventSigmaDefault() {
			res.sigmaDefaultPrevented = true;
		},
		original: e
	};
	return res;
}
/**
* Extract the wheel delta from a mouse event or touch object.
*
* @param  {event}  e - A mouse event or touch object.
* @return {number}     The wheel delta of the mouse.
*/
function getWheelDelta(e) {
	if (typeof e.deltaY !== "undefined") return e.deltaY * -3 / 360;
	if (typeof e.detail !== "undefined") return e.detail / -9;
	throw new Error("Captor: could not extract delta from event.");
}
/**
* Abstract class representing a captor like the user's mouse or touch controls.
*/
var Captor = /*#__PURE__*/ function(_TypedEventEmitter) {
	function Captor(container, renderer) {
		var _this;
		_classCallCheck$1(this, Captor);
		_this = _callSuper$1(this, Captor);
		_this.container = container;
		_this.renderer = renderer;
		return _this;
	}
	_inherits$1(Captor, _TypedEventEmitter);
	return _createClass$1(Captor);
}(TypedEventEmitter);
var DEFAULT_MOUSE_SETTINGS = [
	"doubleClickTimeout",
	"doubleClickZoomingDuration",
	"doubleClickZoomingRatio",
	"dragTimeout",
	"draggedEventsTolerance",
	"inertiaDuration",
	"inertiaRatio",
	"zoomDuration",
	"zoomingRatio"
].reduce(function(iter, key) {
	return _objectSpread2$1(_objectSpread2$1({}, iter), {}, _defineProperty$1({}, key, DEFAULT_SETTINGS[key]));
}, {});
/**
* Event types.
*/
/**
* Mouse captor class.
*
* @constructor
*/
var MouseCaptor = /*#__PURE__*/ function(_Captor) {
	function MouseCaptor(container, renderer) {
		var _this;
		_classCallCheck$1(this, MouseCaptor);
		_this = _callSuper$1(this, MouseCaptor, [container, renderer]);
		_defineProperty$1(_this, "enabled", true);
		_defineProperty$1(_this, "draggedEvents", 0);
		_defineProperty$1(_this, "downStartTime", null);
		_defineProperty$1(_this, "lastMouseX", null);
		_defineProperty$1(_this, "lastMouseY", null);
		_defineProperty$1(_this, "isMouseDown", false);
		_defineProperty$1(_this, "isMoving", false);
		_defineProperty$1(_this, "movingTimeout", null);
		_defineProperty$1(_this, "startCameraState", null);
		_defineProperty$1(_this, "clicks", 0);
		_defineProperty$1(_this, "doubleClickTimeout", null);
		_defineProperty$1(_this, "currentWheelDirection", 0);
		_defineProperty$1(_this, "settings", DEFAULT_MOUSE_SETTINGS);
		_this.handleClick = _this.handleClick.bind(_this);
		_this.handleRightClick = _this.handleRightClick.bind(_this);
		_this.handleDown = _this.handleDown.bind(_this);
		_this.handleUp = _this.handleUp.bind(_this);
		_this.handleMove = _this.handleMove.bind(_this);
		_this.handleWheel = _this.handleWheel.bind(_this);
		_this.handleLeave = _this.handleLeave.bind(_this);
		_this.handleEnter = _this.handleEnter.bind(_this);
		container.addEventListener("click", _this.handleClick, { capture: false });
		container.addEventListener("contextmenu", _this.handleRightClick, { capture: false });
		container.addEventListener("mousedown", _this.handleDown, { capture: false });
		container.addEventListener("wheel", _this.handleWheel, { capture: false });
		container.addEventListener("mouseleave", _this.handleLeave, { capture: false });
		container.addEventListener("mouseenter", _this.handleEnter, { capture: false });
		document.addEventListener("mousemove", _this.handleMove, { capture: false });
		document.addEventListener("mouseup", _this.handleUp, { capture: false });
		return _this;
	}
	_inherits$1(MouseCaptor, _Captor);
	return _createClass$1(MouseCaptor, [
		{
			key: "kill",
			value: function kill() {
				var container = this.container;
				container.removeEventListener("click", this.handleClick);
				container.removeEventListener("contextmenu", this.handleRightClick);
				container.removeEventListener("mousedown", this.handleDown);
				container.removeEventListener("wheel", this.handleWheel);
				container.removeEventListener("mouseleave", this.handleLeave);
				container.removeEventListener("mouseenter", this.handleEnter);
				document.removeEventListener("mousemove", this.handleMove);
				document.removeEventListener("mouseup", this.handleUp);
			}
		},
		{
			key: "handleClick",
			value: function handleClick(e) {
				var _this2 = this;
				if (!this.enabled) return;
				this.clicks++;
				if (this.clicks === 2) {
					this.clicks = 0;
					if (typeof this.doubleClickTimeout === "number") {
						clearTimeout(this.doubleClickTimeout);
						this.doubleClickTimeout = null;
					}
					return this.handleDoubleClick(e);
				}
				setTimeout(function() {
					_this2.clicks = 0;
					_this2.doubleClickTimeout = null;
				}, this.settings.doubleClickTimeout);
				if (this.draggedEvents < this.settings.draggedEventsTolerance) this.emit("click", getMouseCoords(e, this.container));
			}
		},
		{
			key: "handleRightClick",
			value: function handleRightClick(e) {
				if (!this.enabled) return;
				this.emit("rightClick", getMouseCoords(e, this.container));
			}
		},
		{
			key: "handleDoubleClick",
			value: function handleDoubleClick(e) {
				if (!this.enabled) return;
				e.preventDefault();
				e.stopPropagation();
				var mouseCoords = getMouseCoords(e, this.container);
				this.emit("doubleClick", mouseCoords);
				if (mouseCoords.sigmaDefaultPrevented) return;
				var camera = this.renderer.getCamera();
				var newRatio = camera.getBoundedRatio(camera.getState().ratio / this.settings.doubleClickZoomingRatio);
				camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
					easing: "quadraticInOut",
					duration: this.settings.doubleClickZoomingDuration
				});
			}
		},
		{
			key: "handleDown",
			value: function handleDown(e) {
				if (!this.enabled) return;
				if (e.button === 0) {
					this.startCameraState = this.renderer.getCamera().getState();
					var _getPosition = getPosition(e, this.container), x = _getPosition.x, y = _getPosition.y;
					this.lastMouseX = x;
					this.lastMouseY = y;
					this.draggedEvents = 0;
					this.downStartTime = Date.now();
					this.isMouseDown = true;
				}
				this.emit("mousedown", getMouseCoords(e, this.container));
			}
		},
		{
			key: "handleUp",
			value: function handleUp(e) {
				var _this3 = this;
				if (!this.enabled || !this.isMouseDown) return;
				var camera = this.renderer.getCamera();
				this.isMouseDown = false;
				if (typeof this.movingTimeout === "number") {
					clearTimeout(this.movingTimeout);
					this.movingTimeout = null;
				}
				var _getPosition2 = getPosition(e, this.container), x = _getPosition2.x, y = _getPosition2.y;
				var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || {
					x: 0,
					y: 0
				};
				if (this.isMoving) camera.animate({
					x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
					y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y)
				}, {
					duration: this.settings.inertiaDuration,
					easing: "quadraticOut"
				});
				else if (this.lastMouseX !== x || this.lastMouseY !== y) camera.setState({
					x: cameraState.x,
					y: cameraState.y
				});
				this.isMoving = false;
				setTimeout(function() {
					var shouldRefresh = _this3.draggedEvents > 0;
					_this3.draggedEvents = 0;
					if (shouldRefresh && _this3.renderer.getSetting("hideEdgesOnMove")) _this3.renderer.refresh();
				}, 0);
				this.emit("mouseup", getMouseCoords(e, this.container));
			}
		},
		{
			key: "handleMove",
			value: function handleMove(e) {
				var _this4 = this;
				if (!this.enabled) return;
				var mouseCoords = getMouseCoords(e, this.container);
				this.emit("mousemovebody", mouseCoords);
				if (e.target === this.container || e.composedPath()[0] === this.container) this.emit("mousemove", mouseCoords);
				if (mouseCoords.sigmaDefaultPrevented) return;
				if (this.isMouseDown) {
					this.isMoving = true;
					this.draggedEvents++;
					if (typeof this.movingTimeout === "number") clearTimeout(this.movingTimeout);
					this.movingTimeout = window.setTimeout(function() {
						_this4.movingTimeout = null;
						_this4.isMoving = false;
					}, this.settings.dragTimeout);
					var camera = this.renderer.getCamera();
					var _getPosition3 = getPosition(e, this.container), eX = _getPosition3.x, eY = _getPosition3.y;
					var lastMouse = this.renderer.viewportToFramedGraph({
						x: this.lastMouseX,
						y: this.lastMouseY
					});
					var mouse = this.renderer.viewportToFramedGraph({
						x: eX,
						y: eY
					});
					var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
					var cameraState = camera.getState();
					var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
					camera.setState({
						x,
						y
					});
					this.lastMouseX = eX;
					this.lastMouseY = eY;
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		{
			key: "handleLeave",
			value: function handleLeave(e) {
				this.emit("mouseleave", getMouseCoords(e, this.container));
			}
		},
		{
			key: "handleEnter",
			value: function handleEnter(e) {
				this.emit("mouseenter", getMouseCoords(e, this.container));
			}
		},
		{
			key: "handleWheel",
			value: function handleWheel(e) {
				var _this5 = this;
				var camera = this.renderer.getCamera();
				if (!this.enabled || !camera.enabledZooming) return;
				var delta = getWheelDelta(e);
				if (!delta) return;
				var wheelCoords = getWheelCoords(e, this.container);
				this.emit("wheel", wheelCoords);
				if (wheelCoords.sigmaDefaultPrevented) {
					e.preventDefault();
					e.stopPropagation();
					return;
				}
				var currentRatio = camera.getState().ratio;
				var ratioDiff = delta > 0 ? 1 / this.settings.zoomingRatio : this.settings.zoomingRatio;
				var newRatio = camera.getBoundedRatio(currentRatio * ratioDiff);
				var wheelDirection = delta > 0 ? 1 : -1;
				var now = Date.now();
				if (currentRatio === newRatio) return;
				e.preventDefault();
				e.stopPropagation();
				if (this.currentWheelDirection === wheelDirection && this.lastWheelTriggerTime && now - this.lastWheelTriggerTime < this.settings.zoomDuration / 5) return;
				camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
					easing: "quadraticOut",
					duration: this.settings.zoomDuration
				}, function() {
					_this5.currentWheelDirection = 0;
				});
				this.currentWheelDirection = wheelDirection;
				this.lastWheelTriggerTime = now;
			}
		},
		{
			key: "setSettings",
			value: function setSettings(settings) {
				this.settings = settings;
			}
		}
	]);
}(Captor);
var DEFAULT_TOUCH_SETTINGS = [
	"dragTimeout",
	"inertiaDuration",
	"inertiaRatio",
	"doubleClickTimeout",
	"doubleClickZoomingRatio",
	"doubleClickZoomingDuration",
	"tapMoveTolerance"
].reduce(function(iter, key) {
	return _objectSpread2$1(_objectSpread2$1({}, iter), {}, _defineProperty$1({}, key, DEFAULT_SETTINGS[key]));
}, {});
/**
* Event types.
*/
/**
* Touch captor class.
*
* @constructor
*/
var TouchCaptor = /*#__PURE__*/ function(_Captor) {
	function TouchCaptor(container, renderer) {
		var _this;
		_classCallCheck$1(this, TouchCaptor);
		_this = _callSuper$1(this, TouchCaptor, [container, renderer]);
		_defineProperty$1(_this, "enabled", true);
		_defineProperty$1(_this, "isMoving", false);
		_defineProperty$1(_this, "hasMoved", false);
		_defineProperty$1(_this, "touchMode", 0);
		_defineProperty$1(_this, "startTouchesPositions", []);
		_defineProperty$1(_this, "lastTouches", []);
		_defineProperty$1(_this, "lastTap", null);
		_defineProperty$1(_this, "settings", DEFAULT_TOUCH_SETTINGS);
		_this.handleStart = _this.handleStart.bind(_this);
		_this.handleLeave = _this.handleLeave.bind(_this);
		_this.handleMove = _this.handleMove.bind(_this);
		container.addEventListener("touchstart", _this.handleStart, { capture: false });
		container.addEventListener("touchcancel", _this.handleLeave, { capture: false });
		document.addEventListener("touchend", _this.handleLeave, {
			capture: false,
			passive: false
		});
		document.addEventListener("touchmove", _this.handleMove, {
			capture: false,
			passive: false
		});
		return _this;
	}
	_inherits$1(TouchCaptor, _Captor);
	return _createClass$1(TouchCaptor, [
		{
			key: "kill",
			value: function kill() {
				var container = this.container;
				container.removeEventListener("touchstart", this.handleStart);
				container.removeEventListener("touchcancel", this.handleLeave);
				document.removeEventListener("touchend", this.handleLeave);
				document.removeEventListener("touchmove", this.handleMove);
			}
		},
		{
			key: "getDimensions",
			value: function getDimensions() {
				return {
					width: this.container.offsetWidth,
					height: this.container.offsetHeight
				};
			}
		},
		{
			key: "handleStart",
			value: function handleStart(e) {
				var _this2 = this;
				if (!this.enabled) return;
				e.preventDefault();
				var touches = getTouchesArray(e.touches);
				this.touchMode = touches.length;
				this.startCameraState = this.renderer.getCamera().getState();
				this.startTouchesPositions = touches.map(function(touch) {
					return getPosition(touch, _this2.container);
				});
				if (this.touchMode === 2) {
					var _this$startTouchesPos = _slicedToArray(this.startTouchesPositions, 2), _this$startTouchesPos2 = _this$startTouchesPos[0], x0 = _this$startTouchesPos2.x, y0 = _this$startTouchesPos2.y, _this$startTouchesPos3 = _this$startTouchesPos[1], x1 = _this$startTouchesPos3.x, y1 = _this$startTouchesPos3.y;
					this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
					this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
				}
				this.emit("touchdown", getTouchCoords(e, this.lastTouches, this.container));
				this.lastTouches = touches;
				this.lastTouchesPositions = this.startTouchesPositions;
			}
		},
		{
			key: "handleLeave",
			value: function handleLeave(e) {
				if (!this.enabled || !this.startTouchesPositions.length) return;
				if (e.cancelable) e.preventDefault();
				if (this.movingTimeout) {
					this.isMoving = false;
					clearTimeout(this.movingTimeout);
				}
				switch (this.touchMode) {
					case 2: if (e.touches.length === 1) {
						this.handleStart(e);
						e.preventDefault();
						break;
					}
					case 1:
						if (this.isMoving) {
							var camera = this.renderer.getCamera();
							var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || {
								x: 0,
								y: 0
							};
							camera.animate({
								x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
								y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y)
							}, {
								duration: this.settings.inertiaDuration,
								easing: "quadraticOut"
							});
						}
						this.hasMoved = false;
						this.isMoving = false;
						this.touchMode = 0;
				}
				this.emit("touchup", getTouchCoords(e, this.lastTouches, this.container));
				if (!e.touches.length) {
					var position = getPosition(this.lastTouches[0], this.container);
					var downPosition = this.startTouchesPositions[0];
					var dSquare = Math.pow(position.x - downPosition.x, 2) + Math.pow(position.y - downPosition.y, 2);
					if (!e.touches.length && dSquare < Math.pow(this.settings.tapMoveTolerance, 2)) {
						if (this.lastTap && Date.now() - this.lastTap.time < this.settings.doubleClickTimeout) {
							var touchCoords = getTouchCoords(e, this.lastTouches, this.container);
							this.emit("doubletap", touchCoords);
							this.lastTap = null;
							if (!touchCoords.sigmaDefaultPrevented) {
								var _camera = this.renderer.getCamera();
								var newRatio = _camera.getBoundedRatio(_camera.getState().ratio / this.settings.doubleClickZoomingRatio);
								_camera.animate(this.renderer.getViewportZoomedState(position, newRatio), {
									easing: "quadraticInOut",
									duration: this.settings.doubleClickZoomingDuration
								});
							}
						} else {
							var _touchCoords = getTouchCoords(e, this.lastTouches, this.container);
							this.emit("tap", _touchCoords);
							this.lastTap = {
								time: Date.now(),
								position: _touchCoords.touches[0] || _touchCoords.previousTouches[0]
							};
						}
					}
				}
				this.lastTouches = getTouchesArray(e.touches);
				this.startTouchesPositions = [];
			}
		},
		{
			key: "handleMove",
			value: function handleMove(e) {
				var _this3 = this;
				if (!this.enabled || !this.startTouchesPositions.length) return;
				e.preventDefault();
				var touches = getTouchesArray(e.touches);
				var touchesPositions = touches.map(function(touch) {
					return getPosition(touch, _this3.container);
				});
				var lastTouches = this.lastTouches;
				this.lastTouches = touches;
				this.lastTouchesPositions = touchesPositions;
				var touchCoords = getTouchCoords(e, lastTouches, this.container);
				this.emit("touchmove", touchCoords);
				if (touchCoords.sigmaDefaultPrevented) return;
				this.hasMoved || (this.hasMoved = touchesPositions.some(function(position, idx) {
					var startPosition = _this3.startTouchesPositions[idx];
					return startPosition && (position.x !== startPosition.x || position.y !== startPosition.y);
				}));
				if (!this.hasMoved) return;
				this.isMoving = true;
				if (this.movingTimeout) clearTimeout(this.movingTimeout);
				this.movingTimeout = window.setTimeout(function() {
					_this3.isMoving = false;
				}, this.settings.dragTimeout);
				var camera = this.renderer.getCamera();
				var startCameraState = this.startCameraState;
				var padding = this.renderer.getSetting("stagePadding");
				switch (this.touchMode) {
					case 1:
						var _this$renderer$viewpo = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0]), xStart = _this$renderer$viewpo.x, yStart = _this$renderer$viewpo.y;
						var _this$renderer$viewpo2 = this.renderer.viewportToFramedGraph(touchesPositions[0]), x = _this$renderer$viewpo2.x, y = _this$renderer$viewpo2.y;
						camera.setState({
							x: startCameraState.x + xStart - x,
							y: startCameraState.y + yStart - y
						});
						break;
					case 2:
						/**
						* Here is the thinking here:
						*
						* 1. We can find the new angle and ratio, by comparing the vector from "touch one" to "touch two" at the start
						*    of the d'n'd and now
						*
						* 2. We can use `Camera#viewportToGraph` inside formula to retrieve the new camera position, using the graph
						*    position of a touch at the beginning of the d'n'd (using `startCamera.viewportToGraph`) and the viewport
						*    position of this same touch now
						*/
						var newCameraState = {
							x: .5,
							y: .5,
							angle: 0,
							ratio: 1
						};
						var _touchesPositions$ = touchesPositions[0], x0 = _touchesPositions$.x, y0 = _touchesPositions$.y;
						var _touchesPositions$2 = touchesPositions[1], x1 = _touchesPositions$2.x, y1 = _touchesPositions$2.y;
						var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
						var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
						var newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
						newCameraState.ratio = newRatio;
						newCameraState.angle = startCameraState.angle + angleDiff;
						var dimensions = this.getDimensions();
						var touchGraphPosition = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0], { cameraState: startCameraState });
						var smallestDimension = Math.min(dimensions.width, dimensions.height) - 2 * padding;
						var dx = smallestDimension / dimensions.width;
						var dy = smallestDimension / dimensions.height;
						var ratio = newRatio / smallestDimension;
						var _x = x0 - smallestDimension / 2 / dx;
						var _y = y0 - smallestDimension / 2 / dy;
						var _ref = [_x * Math.cos(-newCameraState.angle) - _y * Math.sin(-newCameraState.angle), _y * Math.cos(-newCameraState.angle) + _x * Math.sin(-newCameraState.angle)];
						_x = _ref[0];
						_y = _ref[1];
						newCameraState.x = touchGraphPosition.x - _x * ratio;
						newCameraState.y = touchGraphPosition.y + _y * ratio;
						camera.setState(newCameraState);
				}
			}
		},
		{
			key: "setSettings",
			value: function setSettings(settings) {
				this.settings = settings;
			}
		}
	]);
}(Captor);
function _arrayWithoutHoles$1(r) {
	if (Array.isArray(r)) return _arrayLikeToArray$1(r);
}
function _iterableToArray$1(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread$1() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray$1(r) {
	return _arrayWithoutHoles$1(r) || _iterableToArray$1(r) || _unsupportedIterableToArray$1(r) || _nonIterableSpread$1();
}
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
/**
* Sigma.js Labels Heuristics
* ===========================
*
* Miscellaneous heuristics related to label display.
* @module
*/
/**
* Class representing a single candidate for the label grid selection.
*
* It also describes a deterministic way to compare two candidates to assess
* which one is better.
*/
var LabelCandidate = /*#__PURE__*/ function() {
	function LabelCandidate(key, size) {
		_classCallCheck$1(this, LabelCandidate);
		this.key = key;
		this.size = size;
	}
	return _createClass$1(LabelCandidate, null, [{
		key: "compare",
		value: function compare(first, second) {
			if (first.size > second.size) return -1;
			if (first.size < second.size) return 1;
			if (first.key > second.key) return 1;
			return -1;
		}
	}]);
}();
/**
* Class representing a 2D spatial grid divided into constant-size cells.
*/
var LabelGrid = /*#__PURE__*/ function() {
	function LabelGrid() {
		_classCallCheck$1(this, LabelGrid);
		_defineProperty$1(this, "width", 0);
		_defineProperty$1(this, "height", 0);
		_defineProperty$1(this, "cellSize", 0);
		_defineProperty$1(this, "columns", 0);
		_defineProperty$1(this, "rows", 0);
		_defineProperty$1(this, "cells", {});
	}
	return _createClass$1(LabelGrid, [
		{
			key: "resizeAndClear",
			value: function resizeAndClear(dimensions, cellSize) {
				this.width = dimensions.width;
				this.height = dimensions.height;
				this.cellSize = cellSize;
				this.columns = Math.ceil(dimensions.width / cellSize);
				this.rows = Math.ceil(dimensions.height / cellSize);
				this.cells = {};
			}
		},
		{
			key: "getIndex",
			value: function getIndex(pos) {
				var xIndex = Math.floor(pos.x / this.cellSize);
				return Math.floor(pos.y / this.cellSize) * this.columns + xIndex;
			}
		},
		{
			key: "add",
			value: function add(key, size, pos) {
				var candidate = new LabelCandidate(key, size);
				var index = this.getIndex(pos);
				var cell = this.cells[index];
				if (!cell) {
					cell = [];
					this.cells[index] = cell;
				}
				cell.push(candidate);
			}
		},
		{
			key: "organize",
			value: function organize() {
				for (var k in this.cells) this.cells[k].sort(LabelCandidate.compare);
			}
		},
		{
			key: "getLabelsToDisplay",
			value: function getLabelsToDisplay(ratio, density) {
				var cellArea = this.cellSize * this.cellSize;
				var scaledDensity = cellArea / ratio / ratio * density / cellArea;
				var labelsToDisplayPerCell = Math.ceil(scaledDensity);
				var labels = [];
				for (var k in this.cells) {
					var cell = this.cells[k];
					for (var i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) labels.push(cell[i].key);
				}
				return labels;
			}
		}
	]);
}();
/**
* Label heuristic selecting edge labels to display, based on displayed node
* labels
*
* @param  {object} params                 - Parameters:
* @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
* @param  {Set}      highlightedNodes     - Highlighted nodes.
* @param  {Graph}    graph                - The rendered graph.
* @param  {string}   hoveredNode          - Hovered node (optional)
* @return {Array}                         - The selected labels.
*/
function edgeLabelsToDisplayFromNodes(params) {
	var graph = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
	var worthyEdges = [];
	graph.forEachEdge(function(edge, _, source, target) {
		if (source === hoveredNode || target === hoveredNode || highlightedNodes.has(source) || highlightedNodes.has(target) || displayedNodeLabels.has(source) && displayedNodeLabels.has(target)) worthyEdges.push(edge);
	});
	return worthyEdges;
}
/**
* Constants.
*/
var X_LABEL_MARGIN = 150;
var Y_LABEL_MARGIN = 50;
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* Important functions.
*/
function applyNodeDefaults(settings, key, data) {
	if (!hasOwnProperty.call(data, "x") || !hasOwnProperty.call(data, "y")) throw new Error("Sigma: could not find a valid position (x, y) for node \"".concat(key, "\". All your nodes must have a number \"x\" and \"y\". Maybe your forgot to apply a layout or your \"nodeReducer\" is not returning the correct data?"));
	if (!data.color) data.color = settings.defaultNodeColor;
	if (!data.label && data.label !== "") data.label = null;
	if (data.label !== void 0 && data.label !== null) data.label = "" + data.label;
	else data.label = null;
	if (!data.size) data.size = 2;
	if (!hasOwnProperty.call(data, "hidden")) data.hidden = false;
	if (!hasOwnProperty.call(data, "highlighted")) data.highlighted = false;
	if (!hasOwnProperty.call(data, "forceLabel")) data.forceLabel = false;
	if (!data.type || data.type === "") data.type = settings.defaultNodeType;
	if (!data.zIndex) data.zIndex = 0;
	return data;
}
function applyEdgeDefaults(settings, _key, data) {
	if (!data.color) data.color = settings.defaultEdgeColor;
	if (!data.label) data.label = "";
	if (!data.size) data.size = .5;
	if (!hasOwnProperty.call(data, "hidden")) data.hidden = false;
	if (!hasOwnProperty.call(data, "forceLabel")) data.forceLabel = false;
	if (!data.type || data.type === "") data.type = settings.defaultEdgeType;
	if (!data.zIndex) data.zIndex = 0;
	return data;
}
/**
* Sigma.js Library Endpoint
* =========================
*
* The library endpoint.
* @module
*/
var Sigma = /* @__PURE__ */ function(_TypedEventEmitter) {
	function Sigma(graph, container) {
		var _this;
		var settings = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		_classCallCheck$1(this, Sigma);
		_this = _callSuper$1(this, Sigma);
		_defineProperty$1(_this, "elements", {});
		_defineProperty$1(_this, "canvasContexts", {});
		_defineProperty$1(_this, "webGLContexts", {});
		_defineProperty$1(_this, "pickingLayers", /* @__PURE__ */ new Set());
		_defineProperty$1(_this, "textures", {});
		_defineProperty$1(_this, "frameBuffers", {});
		_defineProperty$1(_this, "activeListeners", {});
		_defineProperty$1(_this, "labelGrid", new LabelGrid());
		_defineProperty$1(_this, "nodeDataCache", {});
		_defineProperty$1(_this, "edgeDataCache", {});
		_defineProperty$1(_this, "nodeProgramIndex", {});
		_defineProperty$1(_this, "edgeProgramIndex", {});
		_defineProperty$1(_this, "nodesWithForcedLabels", /* @__PURE__ */ new Set());
		_defineProperty$1(_this, "edgesWithForcedLabels", /* @__PURE__ */ new Set());
		_defineProperty$1(_this, "nodeExtent", {
			x: [0, 1],
			y: [0, 1]
		});
		_defineProperty$1(_this, "nodeZExtent", [Infinity, -Infinity]);
		_defineProperty$1(_this, "edgeZExtent", [Infinity, -Infinity]);
		_defineProperty$1(_this, "matrix", identity());
		_defineProperty$1(_this, "invMatrix", identity());
		_defineProperty$1(_this, "correctionRatio", 1);
		_defineProperty$1(_this, "customBBox", null);
		_defineProperty$1(_this, "normalizationFunction", createNormalizationFunction({
			x: [0, 1],
			y: [0, 1]
		}));
		_defineProperty$1(_this, "graphToViewportRatio", 1);
		_defineProperty$1(_this, "itemIDsIndex", {});
		_defineProperty$1(_this, "nodeIndices", {});
		_defineProperty$1(_this, "edgeIndices", {});
		_defineProperty$1(_this, "width", 0);
		_defineProperty$1(_this, "height", 0);
		_defineProperty$1(_this, "pixelRatio", getPixelRatio());
		_defineProperty$1(_this, "pickingDownSizingRatio", 2 * _this.pixelRatio);
		_defineProperty$1(_this, "displayedNodeLabels", /* @__PURE__ */ new Set());
		_defineProperty$1(_this, "displayedEdgeLabels", /* @__PURE__ */ new Set());
		_defineProperty$1(_this, "highlightedNodes", /* @__PURE__ */ new Set());
		_defineProperty$1(_this, "hoveredNode", null);
		_defineProperty$1(_this, "hoveredEdge", null);
		_defineProperty$1(_this, "renderFrame", null);
		_defineProperty$1(_this, "renderHighlightedNodesFrame", null);
		_defineProperty$1(_this, "needToProcess", false);
		_defineProperty$1(_this, "checkEdgesEventsFrame", null);
		_defineProperty$1(_this, "nodePrograms", {});
		_defineProperty$1(_this, "nodeHoverPrograms", {});
		_defineProperty$1(_this, "edgePrograms", {});
		_this.settings = resolveSettings(settings);
		validateSettings(_this.settings);
		validateGraph(graph);
		if (!(container instanceof HTMLElement)) throw new Error("Sigma: container should be an html element.");
		_this.graph = graph;
		_this.container = container;
		_this.createWebGLContext("edges", { picking: settings.enableEdgeEvents });
		_this.createCanvasContext("edgeLabels");
		_this.createWebGLContext("nodes", { picking: true });
		_this.createCanvasContext("labels");
		_this.createCanvasContext("hovers");
		_this.createWebGLContext("hoverNodes");
		_this.createCanvasContext("mouse", { style: {
			touchAction: "none",
			userSelect: "none"
		} });
		_this.resize();
		for (var type in _this.settings.nodeProgramClasses) _this.registerNodeProgram(type, _this.settings.nodeProgramClasses[type], _this.settings.nodeHoverProgramClasses[type]);
		for (var _type in _this.settings.edgeProgramClasses) _this.registerEdgeProgram(_type, _this.settings.edgeProgramClasses[_type]);
		_this.camera = new Camera();
		_this.bindCameraHandlers();
		_this.mouseCaptor = new MouseCaptor(_this.elements.mouse, _this);
		_this.mouseCaptor.setSettings(_this.settings);
		_this.touchCaptor = new TouchCaptor(_this.elements.mouse, _this);
		_this.touchCaptor.setSettings(_this.settings);
		_this.bindEventHandlers();
		_this.bindGraphHandlers();
		_this.handleSettingsUpdate();
		_this.refresh();
		return _this;
	}
	/**---------------------------------------------------------------------------
	* Internal methods.
	**---------------------------------------------------------------------------
	*/
	/**
	* Internal function used to register a node program
	*
	* @param  {string}           key              - The program's key, matching the related nodes "type" values.
	* @param  {NodeProgramType}  NodeProgramClass - A nodes program class.
	* @param  {NodeProgramType?} NodeHoverProgram - A nodes program class to render hovered nodes (optional).
	* @return {Sigma}
	*/
	_inherits$1(Sigma, _TypedEventEmitter);
	return _createClass$1(Sigma, [
		{
			key: "registerNodeProgram",
			value: function registerNodeProgram(key, NodeProgramClass, NodeHoverProgram) {
				if (this.nodePrograms[key]) this.nodePrograms[key].kill();
				if (this.nodeHoverPrograms[key]) this.nodeHoverPrograms[key].kill();
				this.nodePrograms[key] = new NodeProgramClass(this.webGLContexts.nodes, this.frameBuffers.nodes, this);
				this.nodeHoverPrograms[key] = new (NodeHoverProgram || NodeProgramClass)(this.webGLContexts.hoverNodes, null, this);
				return this;
			}
		},
		{
			key: "registerEdgeProgram",
			value: function registerEdgeProgram(key, EdgeProgramClass) {
				if (this.edgePrograms[key]) this.edgePrograms[key].kill();
				this.edgePrograms[key] = new EdgeProgramClass(this.webGLContexts.edges, this.frameBuffers.edges, this);
				return this;
			}
		},
		{
			key: "unregisterNodeProgram",
			value: function unregisterNodeProgram(key) {
				if (this.nodePrograms[key]) {
					var _this$nodePrograms = this.nodePrograms, program = _this$nodePrograms[key], programs = _objectWithoutProperties(_this$nodePrograms, [key].map(_toPropertyKey$1));
					program.kill();
					this.nodePrograms = programs;
				}
				if (this.nodeHoverPrograms[key]) {
					var _this$nodeHoverProgra = this.nodeHoverPrograms, _program = _this$nodeHoverProgra[key], _programs = _objectWithoutProperties(_this$nodeHoverProgra, [key].map(_toPropertyKey$1));
					_program.kill();
					this.nodePrograms = _programs;
				}
				return this;
			}
		},
		{
			key: "unregisterEdgeProgram",
			value: function unregisterEdgeProgram(key) {
				if (this.edgePrograms[key]) {
					var _this$edgePrograms = this.edgePrograms, program = _this$edgePrograms[key], programs = _objectWithoutProperties(_this$edgePrograms, [key].map(_toPropertyKey$1));
					program.kill();
					this.edgePrograms = programs;
				}
				return this;
			}
		},
		{
			key: "resetWebGLTexture",
			value: function resetWebGLTexture(id) {
				var gl = this.webGLContexts[id];
				var frameBuffer = this.frameBuffers[id];
				var currentTexture = this.textures[id];
				if (currentTexture) gl.deleteTexture(currentTexture);
				var pickingTexture = gl.createTexture();
				gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
				gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);
				this.textures[id] = pickingTexture;
				return this;
			}
		},
		{
			key: "bindCameraHandlers",
			value: function bindCameraHandlers() {
				var _this2 = this;
				this.activeListeners.camera = function() {
					_this2.scheduleRender();
				};
				this.camera.on("updated", this.activeListeners.camera);
				return this;
			}
		},
		{
			key: "unbindCameraHandlers",
			value: function unbindCameraHandlers() {
				this.camera.removeListener("updated", this.activeListeners.camera);
				return this;
			}
		},
		{
			key: "getNodeAtPosition",
			value: function getNodeAtPosition(position) {
				var x = position.x, y = position.y;
				var color = getPixelColor(this.webGLContexts.nodes, this.frameBuffers.nodes, x, y, this.pixelRatio, this.pickingDownSizingRatio);
				var index = colorToIndex.apply(void 0, _toConsumableArray$1(color));
				var itemAt = this.itemIDsIndex[index];
				return itemAt && itemAt.type === "node" ? itemAt.id : null;
			}
		},
		{
			key: "bindEventHandlers",
			value: function bindEventHandlers() {
				var _this3 = this;
				this.activeListeners.handleResize = function() {
					_this3.scheduleRefresh();
				};
				window.addEventListener("resize", this.activeListeners.handleResize);
				this.activeListeners.handleMove = function(e) {
					var event = cleanMouseCoords(e);
					var baseEvent = {
						event,
						preventSigmaDefault: function preventSigmaDefault() {
							event.preventSigmaDefault();
						}
					};
					var nodeToHover = _this3.getNodeAtPosition(event);
					if (nodeToHover && _this3.hoveredNode !== nodeToHover && !_this3.nodeDataCache[nodeToHover].hidden) {
						if (_this3.hoveredNode) _this3.emit("leaveNode", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { node: _this3.hoveredNode }));
						_this3.hoveredNode = nodeToHover;
						_this3.emit("enterNode", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { node: nodeToHover }));
						_this3.scheduleHighlightedNodesRender();
						return;
					}
					if (_this3.hoveredNode) {
						if (_this3.getNodeAtPosition(event) !== _this3.hoveredNode) {
							var node = _this3.hoveredNode;
							_this3.hoveredNode = null;
							_this3.emit("leaveNode", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { node }));
							_this3.scheduleHighlightedNodesRender();
							return;
						}
					}
					if (_this3.settings.enableEdgeEvents) {
						var edgeToHover = _this3.hoveredNode ? null : _this3.getEdgeAtPoint(baseEvent.event.x, baseEvent.event.y);
						if (edgeToHover !== _this3.hoveredEdge) {
							if (_this3.hoveredEdge) _this3.emit("leaveEdge", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { edge: _this3.hoveredEdge }));
							if (edgeToHover) _this3.emit("enterEdge", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { edge: edgeToHover }));
							_this3.hoveredEdge = edgeToHover;
						}
					}
				};
				this.activeListeners.handleMoveBody = function(e) {
					var event = cleanMouseCoords(e);
					_this3.emit("moveBody", {
						event,
						preventSigmaDefault: function preventSigmaDefault() {
							event.preventSigmaDefault();
						}
					});
				};
				this.activeListeners.handleLeave = function(e) {
					var event = cleanMouseCoords(e);
					var baseEvent = {
						event,
						preventSigmaDefault: function preventSigmaDefault() {
							event.preventSigmaDefault();
						}
					};
					if (_this3.hoveredNode) {
						_this3.emit("leaveNode", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { node: _this3.hoveredNode }));
						_this3.scheduleHighlightedNodesRender();
					}
					if (_this3.settings.enableEdgeEvents && _this3.hoveredEdge) {
						_this3.emit("leaveEdge", _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { edge: _this3.hoveredEdge }));
						_this3.scheduleHighlightedNodesRender();
					}
					_this3.emit("leaveStage", _objectSpread2$1({}, baseEvent));
				};
				this.activeListeners.handleEnter = function(e) {
					var event = cleanMouseCoords(e);
					var baseEvent = {
						event,
						preventSigmaDefault: function preventSigmaDefault() {
							event.preventSigmaDefault();
						}
					};
					_this3.emit("enterStage", _objectSpread2$1({}, baseEvent));
				};
				var createInteractionListener = function createInteractionListener(eventType) {
					return function(e) {
						var event = cleanMouseCoords(e);
						var baseEvent = {
							event,
							preventSigmaDefault: function preventSigmaDefault() {
								event.preventSigmaDefault();
							}
						};
						var nodeAtPosition = _this3.getNodeAtPosition(event);
						if (nodeAtPosition) return _this3.emit("".concat(eventType, "Node"), _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { node: nodeAtPosition }));
						if (_this3.settings.enableEdgeEvents) {
							var edge = _this3.getEdgeAtPoint(event.x, event.y);
							if (edge) return _this3.emit("".concat(eventType, "Edge"), _objectSpread2$1(_objectSpread2$1({}, baseEvent), {}, { edge }));
						}
						return _this3.emit("".concat(eventType, "Stage"), baseEvent);
					};
				};
				this.activeListeners.handleClick = createInteractionListener("click");
				this.activeListeners.handleRightClick = createInteractionListener("rightClick");
				this.activeListeners.handleDoubleClick = createInteractionListener("doubleClick");
				this.activeListeners.handleWheel = createInteractionListener("wheel");
				this.activeListeners.handleDown = createInteractionListener("down");
				this.activeListeners.handleUp = createInteractionListener("up");
				this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
				this.mouseCaptor.on("mousemovebody", this.activeListeners.handleMoveBody);
				this.mouseCaptor.on("click", this.activeListeners.handleClick);
				this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
				this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
				this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
				this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
				this.mouseCaptor.on("mouseup", this.activeListeners.handleUp);
				this.mouseCaptor.on("mouseleave", this.activeListeners.handleLeave);
				this.mouseCaptor.on("mouseenter", this.activeListeners.handleEnter);
				this.touchCaptor.on("touchdown", this.activeListeners.handleDown);
				this.touchCaptor.on("touchdown", this.activeListeners.handleMove);
				this.touchCaptor.on("touchup", this.activeListeners.handleUp);
				this.touchCaptor.on("touchmove", this.activeListeners.handleMove);
				this.touchCaptor.on("tap", this.activeListeners.handleClick);
				this.touchCaptor.on("doubletap", this.activeListeners.handleDoubleClick);
				this.touchCaptor.on("touchmove", this.activeListeners.handleMoveBody);
				return this;
			}
		},
		{
			key: "bindGraphHandlers",
			value: function bindGraphHandlers() {
				var _this4 = this;
				var graph = this.graph;
				var LAYOUT_IMPACTING_FIELDS = /* @__PURE__ */ new Set([
					"x",
					"y",
					"zIndex",
					"type"
				]);
				this.activeListeners.eachNodeAttributesUpdatedGraphUpdate = function(e) {
					var _e$hints;
					var updatedFields = (_e$hints = e.hints) === null || _e$hints === void 0 ? void 0 : _e$hints.attributes;
					_this4.graph.forEachNode(function(node) {
						return _this4.updateNode(node);
					});
					var layoutChanged = !updatedFields || updatedFields.some(function(f) {
						return LAYOUT_IMPACTING_FIELDS.has(f);
					});
					_this4.refresh({
						partialGraph: { nodes: graph.nodes() },
						skipIndexation: !layoutChanged,
						schedule: true
					});
				};
				this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate = function(e) {
					var _e$hints2;
					var updatedFields = (_e$hints2 = e.hints) === null || _e$hints2 === void 0 ? void 0 : _e$hints2.attributes;
					_this4.graph.forEachEdge(function(edge) {
						return _this4.updateEdge(edge);
					});
					var layoutChanged = updatedFields && ["zIndex", "type"].some(function(f) {
						return updatedFields === null || updatedFields === void 0 ? void 0 : updatedFields.includes(f);
					});
					_this4.refresh({
						partialGraph: { edges: graph.edges() },
						skipIndexation: !layoutChanged,
						schedule: true
					});
				};
				this.activeListeners.addNodeGraphUpdate = function(payload) {
					var node = payload.key;
					_this4.addNode(node);
					_this4.refresh({
						partialGraph: { nodes: [node] },
						skipIndexation: false,
						schedule: true
					});
				};
				this.activeListeners.updateNodeGraphUpdate = function(payload) {
					var node = payload.key;
					_this4.refresh({
						partialGraph: { nodes: [node] },
						skipIndexation: false,
						schedule: true
					});
				};
				this.activeListeners.dropNodeGraphUpdate = function(payload) {
					var node = payload.key;
					_this4.removeNode(node);
					_this4.refresh({ schedule: true });
				};
				this.activeListeners.addEdgeGraphUpdate = function(payload) {
					var edge = payload.key;
					_this4.addEdge(edge);
					_this4.refresh({
						partialGraph: { edges: [edge] },
						schedule: true
					});
				};
				this.activeListeners.updateEdgeGraphUpdate = function(payload) {
					var edge = payload.key;
					_this4.refresh({
						partialGraph: { edges: [edge] },
						skipIndexation: false,
						schedule: true
					});
				};
				this.activeListeners.dropEdgeGraphUpdate = function(payload) {
					var edge = payload.key;
					_this4.removeEdge(edge);
					_this4.refresh({ schedule: true });
				};
				this.activeListeners.clearEdgesGraphUpdate = function() {
					_this4.clearEdgeState();
					_this4.clearEdgeIndices();
					_this4.refresh({ schedule: true });
				};
				this.activeListeners.clearGraphUpdate = function() {
					_this4.clearEdgeState();
					_this4.clearNodeState();
					_this4.clearEdgeIndices();
					_this4.clearNodeIndices();
					_this4.refresh({ schedule: true });
				};
				graph.on("nodeAdded", this.activeListeners.addNodeGraphUpdate);
				graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
				graph.on("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
				graph.on("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
				graph.on("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
				graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
				graph.on("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
				graph.on("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
				graph.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
				graph.on("cleared", this.activeListeners.clearGraphUpdate);
				return this;
			}
		},
		{
			key: "unbindGraphHandlers",
			value: function unbindGraphHandlers() {
				var graph = this.graph;
				graph.removeListener("nodeAdded", this.activeListeners.addNodeGraphUpdate);
				graph.removeListener("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
				graph.removeListener("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
				graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
				graph.removeListener("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
				graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
				graph.removeListener("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
				graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
				graph.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
				graph.removeListener("cleared", this.activeListeners.clearGraphUpdate);
			}
		},
		{
			key: "getEdgeAtPoint",
			value: function getEdgeAtPoint(x, y) {
				var color = getPixelColor(this.webGLContexts.edges, this.frameBuffers.edges, x, y, this.pixelRatio, this.pickingDownSizingRatio);
				var index = colorToIndex.apply(void 0, _toConsumableArray$1(color));
				var itemAt = this.itemIDsIndex[index];
				return itemAt && itemAt.type === "edge" ? itemAt.id : null;
			}
		},
		{
			key: "process",
			value: function process() {
				var _this5 = this;
				this.emit("beforeProcess");
				var graph = this.graph;
				var settings = this.settings;
				var dimensions = this.getDimensions();
				this.nodeExtent = graphExtent(this.graph);
				if (!this.settings.autoRescale) {
					var width = dimensions.width, height = dimensions.height;
					var _this$nodeExtent = this.nodeExtent, x = _this$nodeExtent.x, y = _this$nodeExtent.y;
					this.nodeExtent = {
						x: [(x[0] + x[1]) / 2 - width / 2, (x[0] + x[1]) / 2 + width / 2],
						y: [(y[0] + y[1]) / 2 - height / 2, (y[0] + y[1]) / 2 + height / 2]
					};
				}
				this.normalizationFunction = createNormalizationFunction(this.customBBox || this.nodeExtent);
				var nullCameraMatrix = matrixFromCamera(new Camera().getState(), dimensions, this.getGraphDimensions(), this.getStagePadding());
				this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
				var nodesPerPrograms = {};
				var nodeIndices = {};
				var edgeIndices = {};
				var itemIDsIndex = {};
				var incrID = 1;
				var nodes = graph.nodes();
				for (var i = 0, l = nodes.length; i < l; i++) {
					var node = nodes[i];
					var data = this.nodeDataCache[node];
					var attrs = graph.getNodeAttributes(node);
					data.x = attrs.x;
					data.y = attrs.y;
					this.normalizationFunction.applyTo(data);
					if (typeof data.label === "string" && !data.hidden) this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, { matrix: nullCameraMatrix }));
					nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
				}
				this.labelGrid.organize();
				for (var type in this.nodePrograms) {
					if (!hasOwnProperty.call(this.nodePrograms, type)) throw new Error("Sigma: could not find a suitable program for node type \"".concat(type, "\"!"));
					this.nodePrograms[type].reallocate(nodesPerPrograms[type] || 0);
					nodesPerPrograms[type] = 0;
				}
				if (this.settings.zIndex && this.nodeZExtent[0] !== this.nodeZExtent[1]) nodes = zIndexOrdering(this.nodeZExtent, function(node) {
					return _this5.nodeDataCache[node].zIndex;
				}, nodes);
				for (var _i = 0, _l = nodes.length; _i < _l; _i++) {
					var _node = nodes[_i];
					nodeIndices[_node] = incrID;
					itemIDsIndex[nodeIndices[_node]] = {
						type: "node",
						id: _node
					};
					incrID++;
					var _data = this.nodeDataCache[_node];
					this.addNodeToProgram(_node, nodeIndices[_node], nodesPerPrograms[_data.type]++);
				}
				var edgesPerPrograms = {};
				var edges = graph.edges();
				for (var _i2 = 0, _l2 = edges.length; _i2 < _l2; _i2++) {
					var edge = edges[_i2];
					var _data2 = this.edgeDataCache[edge];
					edgesPerPrograms[_data2.type] = (edgesPerPrograms[_data2.type] || 0) + 1;
				}
				if (this.settings.zIndex && this.edgeZExtent[0] !== this.edgeZExtent[1]) edges = zIndexOrdering(this.edgeZExtent, function(edge) {
					return _this5.edgeDataCache[edge].zIndex;
				}, edges);
				for (var _type2 in this.edgePrograms) {
					if (!hasOwnProperty.call(this.edgePrograms, _type2)) throw new Error("Sigma: could not find a suitable program for edge type \"".concat(_type2, "\"!"));
					this.edgePrograms[_type2].reallocate(edgesPerPrograms[_type2] || 0);
					edgesPerPrograms[_type2] = 0;
				}
				for (var _i3 = 0, _l3 = edges.length; _i3 < _l3; _i3++) {
					var _edge = edges[_i3];
					edgeIndices[_edge] = incrID;
					itemIDsIndex[edgeIndices[_edge]] = {
						type: "edge",
						id: _edge
					};
					incrID++;
					var _data3 = this.edgeDataCache[_edge];
					this.addEdgeToProgram(_edge, edgeIndices[_edge], edgesPerPrograms[_data3.type]++);
				}
				this.itemIDsIndex = itemIDsIndex;
				this.nodeIndices = nodeIndices;
				this.edgeIndices = edgeIndices;
				this.emit("afterProcess");
				return this;
			}
		},
		{
			key: "handleSettingsUpdate",
			value: function handleSettingsUpdate(oldSettings) {
				var _this6 = this;
				var settings = this.settings;
				this.camera.minRatio = settings.minCameraRatio;
				this.camera.maxRatio = settings.maxCameraRatio;
				this.camera.enabledZooming = settings.enableCameraZooming;
				this.camera.enabledPanning = settings.enableCameraPanning;
				this.camera.enabledRotation = settings.enableCameraRotation;
				if (settings.cameraPanBoundaries) this.camera.clean = function(state) {
					return _this6.cleanCameraState(state, settings.cameraPanBoundaries && _typeof(settings.cameraPanBoundaries) === "object" ? settings.cameraPanBoundaries : {});
				};
				else this.camera.clean = null;
				this.camera.setState(this.camera.validateState(this.camera.getState()));
				if (oldSettings) {
					if (oldSettings.edgeProgramClasses !== settings.edgeProgramClasses) {
						for (var type in settings.edgeProgramClasses) if (settings.edgeProgramClasses[type] !== oldSettings.edgeProgramClasses[type]) this.registerEdgeProgram(type, settings.edgeProgramClasses[type]);
						for (var _type3 in oldSettings.edgeProgramClasses) if (!settings.edgeProgramClasses[_type3]) this.unregisterEdgeProgram(_type3);
					}
					if (oldSettings.nodeProgramClasses !== settings.nodeProgramClasses || oldSettings.nodeHoverProgramClasses !== settings.nodeHoverProgramClasses) {
						for (var _type4 in settings.nodeProgramClasses) if (settings.nodeProgramClasses[_type4] !== oldSettings.nodeProgramClasses[_type4] || settings.nodeHoverProgramClasses[_type4] !== oldSettings.nodeHoverProgramClasses[_type4]) this.registerNodeProgram(_type4, settings.nodeProgramClasses[_type4], settings.nodeHoverProgramClasses[_type4]);
						for (var _type5 in oldSettings.nodeProgramClasses) if (!settings.nodeProgramClasses[_type5]) this.unregisterNodeProgram(_type5);
					}
				}
				this.mouseCaptor.setSettings(this.settings);
				this.touchCaptor.setSettings(this.settings);
				return this;
			}
		},
		{
			key: "cleanCameraState",
			value: function cleanCameraState(state) {
				var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$tolerance = _ref.tolerance, tolerance = _ref$tolerance === void 0 ? 0 : _ref$tolerance, boundaries = _ref.boundaries;
				var newState = _objectSpread2$1({}, state);
				var _ref2 = boundaries || this.nodeExtent, _ref2$x = _slicedToArray(_ref2.x, 2), xMinGraph = _ref2$x[0], xMaxGraph = _ref2$x[1], _ref2$y = _slicedToArray(_ref2.y, 2), yMinGraph = _ref2$y[0], yMaxGraph = _ref2$y[1];
				var corners = [
					this.graphToViewport({
						x: xMinGraph,
						y: yMinGraph
					}, { cameraState: state }),
					this.graphToViewport({
						x: xMaxGraph,
						y: yMinGraph
					}, { cameraState: state }),
					this.graphToViewport({
						x: xMinGraph,
						y: yMaxGraph
					}, { cameraState: state }),
					this.graphToViewport({
						x: xMaxGraph,
						y: yMaxGraph
					}, { cameraState: state })
				];
				var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
				corners.forEach(function(_ref3) {
					var x = _ref3.x, y = _ref3.y;
					xMin = Math.min(xMin, x);
					xMax = Math.max(xMax, x);
					yMin = Math.min(yMin, y);
					yMax = Math.max(yMax, y);
				});
				var graphWidth = xMax - xMin;
				var graphHeight = yMax - yMin;
				var _this$getDimensions = this.getDimensions(), width = _this$getDimensions.width, height = _this$getDimensions.height;
				var dx = 0;
				var dy = 0;
				if (graphWidth >= width) {
					if (xMax < width - tolerance) dx = xMax - (width - tolerance);
					else if (xMin > tolerance) dx = xMin - tolerance;
				} else if (xMax > width + tolerance) dx = xMax - (width + tolerance);
				else if (xMin < -tolerance) dx = xMin + tolerance;
				if (graphHeight >= height) {
					if (yMax < height - tolerance) dy = yMax - (height - tolerance);
					else if (yMin > tolerance) dy = yMin - tolerance;
				} else if (yMax > height + tolerance) dy = yMax - (height + tolerance);
				else if (yMin < -tolerance) dy = yMin + tolerance;
				if (dx || dy) {
					var origin = this.viewportToFramedGraph({
						x: 0,
						y: 0
					}, { cameraState: state });
					var delta = this.viewportToFramedGraph({
						x: dx,
						y: dy
					}, { cameraState: state });
					dx = delta.x - origin.x;
					dy = delta.y - origin.y;
					newState.x += dx;
					newState.y += dy;
				}
				return newState;
			}
		},
		{
			key: "renderLabels",
			value: function renderLabels() {
				if (!this.settings.renderLabels) return this;
				var cameraState = this.camera.getState();
				var labelsToDisplay = this.labelGrid.getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity);
				extend(labelsToDisplay, this.nodesWithForcedLabels);
				this.displayedNodeLabels = /* @__PURE__ */ new Set();
				var context = this.canvasContexts.labels;
				for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
					var node = labelsToDisplay[i];
					var data = this.nodeDataCache[node];
					if (this.displayedNodeLabels.has(node)) continue;
					if (data.hidden) continue;
					var _this$framedGraphToVi = this.framedGraphToViewport(data), x = _this$framedGraphToVi.x, y = _this$framedGraphToVi.y;
					var size = this.scaleSize(data.size);
					if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold) continue;
					if (x < -X_LABEL_MARGIN || x > this.width + X_LABEL_MARGIN || y < -Y_LABEL_MARGIN || y > this.height + Y_LABEL_MARGIN) continue;
					this.displayedNodeLabels.add(node);
					var defaultDrawNodeLabel = this.settings.defaultDrawNodeLabel;
					var nodeProgram = this.nodePrograms[data.type];
					((nodeProgram === null || nodeProgram === void 0 ? void 0 : nodeProgram.drawLabel) || defaultDrawNodeLabel)(context, _objectSpread2$1(_objectSpread2$1({ key: node }, data), {}, {
						size,
						x,
						y
					}), this.settings);
				}
				return this;
			}
		},
		{
			key: "renderEdgeLabels",
			value: function renderEdgeLabels() {
				if (!this.settings.renderEdgeLabels) return this;
				var context = this.canvasContexts.edgeLabels;
				context.clearRect(0, 0, this.width, this.height);
				var edgeLabelsToDisplay = edgeLabelsToDisplayFromNodes({
					graph: this.graph,
					hoveredNode: this.hoveredNode,
					displayedNodeLabels: this.displayedNodeLabels,
					highlightedNodes: this.highlightedNodes
				});
				extend(edgeLabelsToDisplay, this.edgesWithForcedLabels);
				var displayedLabels = /* @__PURE__ */ new Set();
				for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
					var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edge];
					if (displayedLabels.has(edge)) continue;
					if (edgeData.hidden || sourceData.hidden || targetData.hidden) continue;
					var defaultDrawEdgeLabel = this.settings.defaultDrawEdgeLabel;
					var edgeProgram = this.edgePrograms[edgeData.type];
					((edgeProgram === null || edgeProgram === void 0 ? void 0 : edgeProgram.drawLabel) || defaultDrawEdgeLabel)(context, _objectSpread2$1(_objectSpread2$1({ key: edge }, edgeData), {}, { size: this.scaleSize(edgeData.size) }), _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({ key: extremities[0] }, sourceData), this.framedGraphToViewport(sourceData)), {}, { size: this.scaleSize(sourceData.size) }), _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({ key: extremities[1] }, targetData), this.framedGraphToViewport(targetData)), {}, { size: this.scaleSize(targetData.size) }), this.settings);
					displayedLabels.add(edge);
				}
				this.displayedEdgeLabels = displayedLabels;
				return this;
			}
		},
		{
			key: "renderHighlightedNodes",
			value: function renderHighlightedNodes() {
				var _this7 = this;
				var context = this.canvasContexts.hovers;
				context.clearRect(0, 0, this.width, this.height);
				var render = function render(node) {
					var data = _this7.nodeDataCache[node];
					var _this7$framedGraphToV = _this7.framedGraphToViewport(data), x = _this7$framedGraphToV.x, y = _this7$framedGraphToV.y;
					var size = _this7.scaleSize(data.size);
					var defaultDrawNodeHover = _this7.settings.defaultDrawNodeHover;
					var nodeProgram = _this7.nodePrograms[data.type];
					((nodeProgram === null || nodeProgram === void 0 ? void 0 : nodeProgram.drawHover) || defaultDrawNodeHover)(context, _objectSpread2$1(_objectSpread2$1({ key: node }, data), {}, {
						size,
						x,
						y
					}), _this7.settings);
				};
				var nodesToRender = [];
				if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) nodesToRender.push(this.hoveredNode);
				this.highlightedNodes.forEach(function(node) {
					if (node !== _this7.hoveredNode) nodesToRender.push(node);
				});
				nodesToRender.forEach(function(node) {
					return render(node);
				});
				var nodesPerPrograms = {};
				nodesToRender.forEach(function(node) {
					var type = _this7.nodeDataCache[node].type;
					nodesPerPrograms[type] = (nodesPerPrograms[type] || 0) + 1;
				});
				for (var type in this.nodeHoverPrograms) {
					this.nodeHoverPrograms[type].reallocate(nodesPerPrograms[type] || 0);
					nodesPerPrograms[type] = 0;
				}
				nodesToRender.forEach(function(node) {
					var data = _this7.nodeDataCache[node];
					_this7.nodeHoverPrograms[data.type].process(0, nodesPerPrograms[data.type]++, data);
				});
				this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
				var renderParams = this.getRenderParams();
				for (var _type6 in this.nodeHoverPrograms) this.nodeHoverPrograms[_type6].render(renderParams);
			}
		},
		{
			key: "scheduleHighlightedNodesRender",
			value: function scheduleHighlightedNodesRender() {
				var _this8 = this;
				if (this.renderHighlightedNodesFrame || this.renderFrame) return;
				this.renderHighlightedNodesFrame = requestAnimationFrame(function() {
					_this8.renderHighlightedNodesFrame = null;
					_this8.renderHighlightedNodes();
					_this8.renderEdgeLabels();
				});
			}
		},
		{
			key: "render",
			value: function render() {
				var _this9 = this;
				this.emit("beforeRender");
				var exitRender = function exitRender() {
					_this9.emit("afterRender");
					return _this9;
				};
				if (this.renderFrame) {
					cancelAnimationFrame(this.renderFrame);
					this.renderFrame = null;
				}
				this.resize();
				if (this.needToProcess) this.process();
				this.needToProcess = false;
				this.clear();
				this.pickingLayers.forEach(function(layer) {
					return _this9.resetWebGLTexture(layer);
				});
				if (!this.graph.order) return exitRender();
				var mouseCaptor = this.mouseCaptor;
				var moving = this.camera.isAnimated() || mouseCaptor.isMoving || mouseCaptor.draggedEvents || mouseCaptor.currentWheelDirection;
				var cameraState = this.camera.getState();
				var viewportDimensions = this.getDimensions();
				var graphDimensions = this.getGraphDimensions();
				var padding = this.getStagePadding();
				this.matrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding);
				this.invMatrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding, true);
				this.correctionRatio = getMatrixImpact(this.matrix, cameraState, viewportDimensions);
				this.graphToViewportRatio = this.getGraphToViewportRatio();
				var params = this.getRenderParams();
				for (var type in this.nodePrograms) this.nodePrograms[type].render(params);
				if (!this.settings.hideEdgesOnMove || !moving) for (var _type7 in this.edgePrograms) this.edgePrograms[_type7].render(params);
				if (this.settings.hideLabelsOnMove && moving) return exitRender();
				this.renderLabels();
				this.renderEdgeLabels();
				this.renderHighlightedNodes();
				return exitRender();
			}
		},
		{
			key: "addNode",
			value: function addNode(key) {
				var attr = Object.assign({}, this.graph.getNodeAttributes(key));
				if (this.settings.nodeReducer) attr = this.settings.nodeReducer(key, attr);
				var data = applyNodeDefaults(this.settings, key, attr);
				this.nodeDataCache[key] = data;
				this.nodesWithForcedLabels["delete"](key);
				if (data.forceLabel && !data.hidden) this.nodesWithForcedLabels.add(key);
				this.highlightedNodes["delete"](key);
				if (data.highlighted && !data.hidden) this.highlightedNodes.add(key);
				if (this.settings.zIndex) {
					if (data.zIndex < this.nodeZExtent[0]) this.nodeZExtent[0] = data.zIndex;
					if (data.zIndex > this.nodeZExtent[1]) this.nodeZExtent[1] = data.zIndex;
				}
			}
		},
		{
			key: "updateNode",
			value: function updateNode(key) {
				this.addNode(key);
				var data = this.nodeDataCache[key];
				this.normalizationFunction.applyTo(data);
			}
		},
		{
			key: "removeNode",
			value: function removeNode(key) {
				delete this.nodeDataCache[key];
				delete this.nodeProgramIndex[key];
				this.highlightedNodes["delete"](key);
				if (this.hoveredNode === key) this.hoveredNode = null;
				this.nodesWithForcedLabels["delete"](key);
			}
		},
		{
			key: "addEdge",
			value: function addEdge(key) {
				var attr = Object.assign({}, this.graph.getEdgeAttributes(key));
				if (this.settings.edgeReducer) attr = this.settings.edgeReducer(key, attr);
				var data = applyEdgeDefaults(this.settings, key, attr);
				this.edgeDataCache[key] = data;
				this.edgesWithForcedLabels["delete"](key);
				if (data.forceLabel && !data.hidden) this.edgesWithForcedLabels.add(key);
				if (this.settings.zIndex) {
					if (data.zIndex < this.edgeZExtent[0]) this.edgeZExtent[0] = data.zIndex;
					if (data.zIndex > this.edgeZExtent[1]) this.edgeZExtent[1] = data.zIndex;
				}
			}
		},
		{
			key: "updateEdge",
			value: function updateEdge(key) {
				this.addEdge(key);
			}
		},
		{
			key: "removeEdge",
			value: function removeEdge(key) {
				delete this.edgeDataCache[key];
				delete this.edgeProgramIndex[key];
				if (this.hoveredEdge === key) this.hoveredEdge = null;
				this.edgesWithForcedLabels["delete"](key);
			}
		},
		{
			key: "clearNodeIndices",
			value: function clearNodeIndices() {
				this.labelGrid = new LabelGrid();
				this.nodeExtent = {
					x: [0, 1],
					y: [0, 1]
				};
				this.nodeDataCache = {};
				this.edgeProgramIndex = {};
				this.nodesWithForcedLabels = /* @__PURE__ */ new Set();
				this.nodeZExtent = [Infinity, -Infinity];
				this.highlightedNodes = /* @__PURE__ */ new Set();
			}
		},
		{
			key: "clearEdgeIndices",
			value: function clearEdgeIndices() {
				this.edgeDataCache = {};
				this.edgeProgramIndex = {};
				this.edgesWithForcedLabels = /* @__PURE__ */ new Set();
				this.edgeZExtent = [Infinity, -Infinity];
			}
		},
		{
			key: "clearIndices",
			value: function clearIndices() {
				this.clearEdgeIndices();
				this.clearNodeIndices();
			}
		},
		{
			key: "clearNodeState",
			value: function clearNodeState() {
				this.displayedNodeLabels = /* @__PURE__ */ new Set();
				this.highlightedNodes = /* @__PURE__ */ new Set();
				this.hoveredNode = null;
			}
		},
		{
			key: "clearEdgeState",
			value: function clearEdgeState() {
				this.displayedEdgeLabels = /* @__PURE__ */ new Set();
				this.highlightedNodes = /* @__PURE__ */ new Set();
				this.hoveredEdge = null;
			}
		},
		{
			key: "clearState",
			value: function clearState() {
				this.clearEdgeState();
				this.clearNodeState();
			}
		},
		{
			key: "addNodeToProgram",
			value: function addNodeToProgram(node, fingerprint, position) {
				var data = this.nodeDataCache[node];
				var nodeProgram = this.nodePrograms[data.type];
				if (!nodeProgram) throw new Error("Sigma: could not find a suitable program for node type \"".concat(data.type, "\"!"));
				nodeProgram.process(fingerprint, position, data);
				this.nodeProgramIndex[node] = position;
			}
		},
		{
			key: "addEdgeToProgram",
			value: function addEdgeToProgram(edge, fingerprint, position) {
				var data = this.edgeDataCache[edge];
				var edgeProgram = this.edgePrograms[data.type];
				if (!edgeProgram) throw new Error("Sigma: could not find a suitable program for edge type \"".concat(data.type, "\"!"));
				var extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
				edgeProgram.process(fingerprint, position, sourceData, targetData, data);
				this.edgeProgramIndex[edge] = position;
			}
		},
		{
			key: "getRenderParams",
			value: function getRenderParams() {
				return {
					matrix: this.matrix,
					invMatrix: this.invMatrix,
					width: this.width,
					height: this.height,
					pixelRatio: this.pixelRatio,
					zoomRatio: this.camera.ratio,
					cameraAngle: this.camera.angle,
					sizeRatio: 1 / this.scaleSize(),
					correctionRatio: this.correctionRatio,
					downSizingRatio: this.pickingDownSizingRatio,
					minEdgeThickness: this.settings.minEdgeThickness,
					antiAliasingFeather: this.settings.antiAliasingFeather
				};
			}
		},
		{
			key: "getStagePadding",
			value: function getStagePadding() {
				var _this$settings = this.settings, stagePadding = _this$settings.stagePadding;
				return _this$settings.autoRescale ? stagePadding || 0 : 0;
			}
		},
		{
			key: "createLayer",
			value: function createLayer(id, tag) {
				var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
				if (this.elements[id]) throw new Error("Sigma: a layer named \"".concat(id, "\" already exists"));
				var element = createElement(tag, { position: "absolute" }, { "class": "sigma-".concat(id) });
				if (options.style) Object.assign(element.style, options.style);
				this.elements[id] = element;
				if ("beforeLayer" in options && options.beforeLayer) this.elements[options.beforeLayer].before(element);
				else if ("afterLayer" in options && options.afterLayer) this.elements[options.afterLayer].after(element);
				else this.container.appendChild(element);
				return element;
			}
		},
		{
			key: "createCanvas",
			value: function createCanvas(id) {
				var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				return this.createLayer(id, "canvas", options);
			}
		},
		{
			key: "createCanvasContext",
			value: function createCanvasContext(id) {
				var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var canvas = this.createCanvas(id, options);
				var contextOptions = {
					preserveDrawingBuffer: false,
					antialias: false
				};
				this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
				return this;
			}
		},
		{
			key: "createWebGLContext",
			value: function createWebGLContext(id) {
				var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var canvas = (options === null || options === void 0 ? void 0 : options.canvas) || this.createCanvas(id, options);
				if (options.hidden) canvas.remove();
				var contextOptions = _objectSpread2$1({
					preserveDrawingBuffer: false,
					antialias: false
				}, options);
				var context = canvas.getContext("webgl2", contextOptions);
				if (!context) context = canvas.getContext("webgl", contextOptions);
				if (!context) context = canvas.getContext("experimental-webgl", contextOptions);
				var gl = context;
				this.webGLContexts[id] = gl;
				gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				if (options.picking) {
					this.pickingLayers.add(id);
					var newFrameBuffer = gl.createFramebuffer();
					if (!newFrameBuffer) throw new Error("Sigma: cannot create a new frame buffer for layer ".concat(id));
					this.frameBuffers[id] = newFrameBuffer;
				}
				return gl;
			}
		},
		{
			key: "killLayer",
			value: function killLayer(id) {
				var element = this.elements[id];
				if (!element) throw new Error("Sigma: cannot kill layer ".concat(id, ", which does not exist"));
				if (this.webGLContexts[id]) {
					var _gl$getExtension;
					(_gl$getExtension = this.webGLContexts[id].getExtension("WEBGL_lose_context")) === null || _gl$getExtension === void 0 || _gl$getExtension.loseContext();
					delete this.webGLContexts[id];
				} else if (this.canvasContexts[id]) delete this.canvasContexts[id];
				element.remove();
				delete this.elements[id];
				return this;
			}
		},
		{
			key: "getCamera",
			value: function getCamera() {
				return this.camera;
			}
		},
		{
			key: "setCamera",
			value: function setCamera(camera) {
				this.unbindCameraHandlers();
				this.camera = camera;
				this.bindCameraHandlers();
			}
		},
		{
			key: "getContainer",
			value: function getContainer() {
				return this.container;
			}
		},
		{
			key: "getGraph",
			value: function getGraph() {
				return this.graph;
			}
		},
		{
			key: "setGraph",
			value: function setGraph(graph) {
				if (graph === this.graph) return;
				if (this.hoveredNode && !graph.hasNode(this.hoveredNode)) this.hoveredNode = null;
				if (this.hoveredEdge && !graph.hasEdge(this.hoveredEdge)) this.hoveredEdge = null;
				this.unbindGraphHandlers();
				if (this.checkEdgesEventsFrame !== null) {
					cancelAnimationFrame(this.checkEdgesEventsFrame);
					this.checkEdgesEventsFrame = null;
				}
				this.graph = graph;
				this.bindGraphHandlers();
				this.refresh();
			}
		},
		{
			key: "getMouseCaptor",
			value: function getMouseCaptor() {
				return this.mouseCaptor;
			}
		},
		{
			key: "getTouchCaptor",
			value: function getTouchCaptor() {
				return this.touchCaptor;
			}
		},
		{
			key: "getDimensions",
			value: function getDimensions() {
				return {
					width: this.width,
					height: this.height
				};
			}
		},
		{
			key: "getGraphDimensions",
			value: function getGraphDimensions() {
				var extent = this.customBBox || this.nodeExtent;
				return {
					width: extent.x[1] - extent.x[0] || 1,
					height: extent.y[1] - extent.y[0] || 1
				};
			}
		},
		{
			key: "getNodeDisplayData",
			value: function getNodeDisplayData(key) {
				var node = this.nodeDataCache[key];
				return node ? Object.assign({}, node) : void 0;
			}
		},
		{
			key: "getEdgeDisplayData",
			value: function getEdgeDisplayData(key) {
				var edge = this.edgeDataCache[key];
				return edge ? Object.assign({}, edge) : void 0;
			}
		},
		{
			key: "getNodeDisplayedLabels",
			value: function getNodeDisplayedLabels() {
				return new Set(this.displayedNodeLabels);
			}
		},
		{
			key: "getEdgeDisplayedLabels",
			value: function getEdgeDisplayedLabels() {
				return new Set(this.displayedEdgeLabels);
			}
		},
		{
			key: "getSettings",
			value: function getSettings() {
				return _objectSpread2$1({}, this.settings);
			}
		},
		{
			key: "getSetting",
			value: function getSetting(key) {
				return this.settings[key];
			}
		},
		{
			key: "setSetting",
			value: function setSetting(key, value) {
				var oldValues = _objectSpread2$1({}, this.settings);
				this.settings[key] = value;
				validateSettings(this.settings);
				this.handleSettingsUpdate(oldValues);
				this.scheduleRefresh();
				return this;
			}
		},
		{
			key: "updateSetting",
			value: function updateSetting(key, updater) {
				this.setSetting(key, updater(this.settings[key]));
				return this;
			}
		},
		{
			key: "setSettings",
			value: function setSettings(settings) {
				var oldValues = _objectSpread2$1({}, this.settings);
				this.settings = _objectSpread2$1(_objectSpread2$1({}, this.settings), settings);
				validateSettings(this.settings);
				this.handleSettingsUpdate(oldValues);
				this.scheduleRefresh();
				return this;
			}
		},
		{
			key: "resize",
			value: function resize(force) {
				var previousWidth = this.width, previousHeight = this.height;
				this.width = this.container.offsetWidth;
				this.height = this.container.offsetHeight;
				this.pixelRatio = getPixelRatio();
				if (this.width === 0) {
					if (this.settings.allowInvalidContainer) this.width = 1;
					else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");
				}
				if (this.height === 0) {
					if (this.settings.allowInvalidContainer) this.height = 1;
					else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");
				}
				if (!force && previousWidth === this.width && previousHeight === this.height) return this;
				for (var id in this.elements) {
					var element = this.elements[id];
					element.style.width = this.width + "px";
					element.style.height = this.height + "px";
				}
				for (var _id in this.canvasContexts) {
					this.elements[_id].setAttribute("width", this.width * this.pixelRatio + "px");
					this.elements[_id].setAttribute("height", this.height * this.pixelRatio + "px");
					if (this.pixelRatio !== 1) this.canvasContexts[_id].scale(this.pixelRatio, this.pixelRatio);
				}
				for (var _id2 in this.webGLContexts) {
					this.elements[_id2].setAttribute("width", this.width * this.pixelRatio + "px");
					this.elements[_id2].setAttribute("height", this.height * this.pixelRatio + "px");
					var gl = this.webGLContexts[_id2];
					gl.viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
					if (this.pickingLayers.has(_id2)) {
						var currentTexture = this.textures[_id2];
						if (currentTexture) gl.deleteTexture(currentTexture);
					}
				}
				this.emit("resize");
				return this;
			}
		},
		{
			key: "clear",
			value: function clear() {
				this.emit("beforeClear");
				this.webGLContexts.nodes.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
				this.webGLContexts.nodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
				this.webGLContexts.edges.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
				this.webGLContexts.edges.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
				this.webGLContexts.hoverNodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
				this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
				this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
				this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
				this.emit("afterClear");
				return this;
			}
		},
		{
			key: "refresh",
			value: function refresh(opts) {
				var _this10 = this;
				var skipIndexation = (opts === null || opts === void 0 ? void 0 : opts.skipIndexation) !== void 0 ? opts === null || opts === void 0 ? void 0 : opts.skipIndexation : false;
				var schedule = (opts === null || opts === void 0 ? void 0 : opts.schedule) !== void 0 ? opts.schedule : false;
				var fullRefresh = !opts || !opts.partialGraph;
				if (fullRefresh) {
					this.clearEdgeIndices();
					this.clearNodeIndices();
					this.graph.forEachNode(function(node) {
						return _this10.addNode(node);
					});
					this.graph.forEachEdge(function(edge) {
						return _this10.addEdge(edge);
					});
				} else {
					var _opts$partialGraph, _opts$partialGraph2;
					var nodes = ((_opts$partialGraph = opts.partialGraph) === null || _opts$partialGraph === void 0 ? void 0 : _opts$partialGraph.nodes) || [];
					for (var i = 0, l = (nodes === null || nodes === void 0 ? void 0 : nodes.length) || 0; i < l; i++) {
						var node = nodes[i];
						this.updateNode(node);
						if (skipIndexation) {
							var programIndex = this.nodeProgramIndex[node];
							if (programIndex === void 0) throw new Error("Sigma: node \"".concat(node, "\" can't be repaint"));
							this.addNodeToProgram(node, this.nodeIndices[node], programIndex);
						}
					}
					var edges = (opts === null || opts === void 0 || (_opts$partialGraph2 = opts.partialGraph) === null || _opts$partialGraph2 === void 0 ? void 0 : _opts$partialGraph2.edges) || [];
					for (var _i4 = 0, _l4 = edges.length; _i4 < _l4; _i4++) {
						var edge = edges[_i4];
						this.updateEdge(edge);
						if (skipIndexation) {
							var _programIndex = this.edgeProgramIndex[edge];
							if (_programIndex === void 0) throw new Error("Sigma: edge \"".concat(edge, "\" can't be repaint"));
							this.addEdgeToProgram(edge, this.edgeIndices[edge], _programIndex);
						}
					}
				}
				if (fullRefresh || !skipIndexation) this.needToProcess = true;
				if (schedule) this.scheduleRender();
				else this.render();
				return this;
			}
		},
		{
			key: "scheduleRender",
			value: function scheduleRender() {
				var _this11 = this;
				if (!this.renderFrame) this.renderFrame = requestAnimationFrame(function() {
					_this11.render();
				});
				return this;
			}
		},
		{
			key: "scheduleRefresh",
			value: function scheduleRefresh(opts) {
				return this.refresh(_objectSpread2$1(_objectSpread2$1({}, opts), {}, { schedule: true }));
			}
		},
		{
			key: "getViewportZoomedState",
			value: function getViewportZoomedState(viewportTarget, newRatio) {
				var _this$camera$getState = this.camera.getState(), ratio = _this$camera$getState.ratio, angle = _this$camera$getState.angle, x = _this$camera$getState.x, y = _this$camera$getState.y;
				var _this$settings2 = this.settings, minCameraRatio = _this$settings2.minCameraRatio, maxCameraRatio = _this$settings2.maxCameraRatio;
				if (typeof maxCameraRatio === "number") newRatio = Math.min(newRatio, maxCameraRatio);
				if (typeof minCameraRatio === "number") newRatio = Math.max(newRatio, minCameraRatio);
				var ratioDiff = newRatio / ratio;
				var center = {
					x: this.width / 2,
					y: this.height / 2
				};
				var graphMousePosition = this.viewportToFramedGraph(viewportTarget);
				var graphCenterPosition = this.viewportToFramedGraph(center);
				return {
					angle,
					x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
					y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
					ratio: newRatio
				};
			}
		},
		{
			key: "viewRectangle",
			value: function viewRectangle() {
				var p1 = this.viewportToFramedGraph({
					x: 0,
					y: 0
				}), p2 = this.viewportToFramedGraph({
					x: this.width,
					y: 0
				}), h = this.viewportToFramedGraph({
					x: 0,
					y: this.height
				});
				return {
					x1: p1.x,
					y1: p1.y,
					x2: p2.x,
					y2: p2.y,
					height: p2.y - h.y
				};
			}
		},
		{
			key: "framedGraphToViewport",
			value: function framedGraphToViewport(coordinates) {
				var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
				var viewportPos = multiplyVec2(override.matrix ? override.matrix : recomputeMatrix ? matrixFromCamera(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getStagePadding()) : this.matrix, coordinates);
				return {
					x: (1 + viewportPos.x) * this.width / 2,
					y: (1 - viewportPos.y) * this.height / 2
				};
			}
		},
		{
			key: "viewportToFramedGraph",
			value: function viewportToFramedGraph(coordinates) {
				var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
				var res = multiplyVec2(override.matrix ? override.matrix : recomputeMatrix ? matrixFromCamera(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getStagePadding(), true) : this.invMatrix, {
					x: coordinates.x / this.width * 2 - 1,
					y: 1 - coordinates.y / this.height * 2
				});
				if (isNaN(res.x)) res.x = 0;
				if (isNaN(res.y)) res.y = 0;
				return res;
			}
		},
		{
			key: "viewportToGraph",
			value: function viewportToGraph(viewportPoint) {
				var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
			}
		},
		{
			key: "graphToViewport",
			value: function graphToViewport(graphPoint) {
				var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
			}
		},
		{
			key: "getGraphToViewportRatio",
			value: function getGraphToViewportRatio() {
				var graphP1 = {
					x: 0,
					y: 0
				};
				var graphP2 = {
					x: 1,
					y: 1
				};
				var graphD = Math.sqrt(Math.pow(graphP1.x - graphP2.x, 2) + Math.pow(graphP1.y - graphP2.y, 2));
				var viewportP1 = this.graphToViewport(graphP1);
				var viewportP2 = this.graphToViewport(graphP2);
				return Math.sqrt(Math.pow(viewportP1.x - viewportP2.x, 2) + Math.pow(viewportP1.y - viewportP2.y, 2)) / graphD;
			}
		},
		{
			key: "getBBox",
			value: function getBBox() {
				return this.nodeExtent;
			}
		},
		{
			key: "getCustomBBox",
			value: function getCustomBBox() {
				return this.customBBox;
			}
		},
		{
			key: "setCustomBBox",
			value: function setCustomBBox(customBBox) {
				this.customBBox = customBBox;
				this.scheduleRender();
				return this;
			}
		},
		{
			key: "kill",
			value: function kill() {
				this.emit("kill");
				this.removeAllListeners();
				this.unbindCameraHandlers();
				window.removeEventListener("resize", this.activeListeners.handleResize);
				this.mouseCaptor.kill();
				this.touchCaptor.kill();
				this.unbindGraphHandlers();
				this.clearIndices();
				this.clearState();
				this.nodeDataCache = {};
				this.edgeDataCache = {};
				this.highlightedNodes.clear();
				if (this.renderFrame) {
					cancelAnimationFrame(this.renderFrame);
					this.renderFrame = null;
				}
				if (this.renderHighlightedNodesFrame) {
					cancelAnimationFrame(this.renderHighlightedNodesFrame);
					this.renderHighlightedNodesFrame = null;
				}
				var container = this.container;
				while (container.firstChild) container.removeChild(container.firstChild);
				for (var type in this.nodePrograms) this.nodePrograms[type].kill();
				for (var _type8 in this.nodeHoverPrograms) this.nodeHoverPrograms[_type8].kill();
				for (var _type9 in this.edgePrograms) this.edgePrograms[_type9].kill();
				this.nodePrograms = {};
				this.nodeHoverPrograms = {};
				this.edgePrograms = {};
				for (var id in this.elements) this.killLayer(id);
				this.canvasContexts = {};
				this.webGLContexts = {};
				this.elements = {};
			}
		},
		{
			key: "scaleSize",
			value: function scaleSize() {
				var size = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
				var cameraRatio = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.camera.ratio;
				return size / this.settings.zoomToSizeRatioFunction(cameraRatio) * (this.getSetting("itemSizesReference") === "positions" ? cameraRatio * this.graphToViewportRatio : 1);
			}
		},
		{
			key: "getCanvases",
			value: function getCanvases() {
				var res = {};
				for (var layer in this.elements) if (this.elements[layer] instanceof HTMLCanvasElement) res[layer] = this.elements[layer];
				return res;
			}
		}
	]);
}(TypedEventEmitter);
//#endregion
//#region ../../node_modules/.pnpm/@sigma+edge-curve@3.1.0_sigma@3.0.3_graphology-types@0.24.8_/node_modules/@sigma/edge-curve/dist/sigma-edge-curve.esm.js
function _toPrimitive(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
	for (var t = 0; t < r.length; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
	}
}
function _createClass(e, r, t) {
	return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function _getPrototypeOf(t) {
	return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
		return t.__proto__ || Object.getPrototypeOf(t);
	}, _getPrototypeOf(t);
}
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct = function() {
		return !!t;
	})();
}
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function _possibleConstructorReturn(t, e) {
	if (e && ("object" == typeof e || "function" == typeof e)) return e;
	if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(t);
}
function _callSuper(t, o, e) {
	return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf(t, e);
}
function _inherits(t, e) {
	if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
	t.prototype = Object.create(e && e.prototype, { constructor: {
		value: t,
		writable: !0,
		configurable: !0
	} }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e);
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function getCurvePoint(t, p0, p1, p2) {
	return {
		x: Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x,
		y: Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y
	};
}
function getCurveLength(p0, p1, p2) {
	var steps = 20;
	var length = 0;
	var lastPoint = p0;
	for (var i = 0; i < steps; i++) {
		var point = getCurvePoint((i + 1) / steps, p0, p1, p2);
		length += Math.sqrt(Math.pow(lastPoint.x - point.x, 2) + Math.pow(lastPoint.y - point.y, 2));
		lastPoint = point;
	}
	return length;
}
function createDrawCurvedEdgeLabel(_ref) {
	var curvatureAttribute = _ref.curvatureAttribute, defaultCurvature = _ref.defaultCurvature, _ref$keepLabelUpright = _ref.keepLabelUpright, keepLabelUpright = _ref$keepLabelUpright === void 0 ? true : _ref$keepLabelUpright;
	return function(context, edgeData, sourceData, targetData, settings) {
		var size = settings.edgeLabelSize, curvature = edgeData[curvatureAttribute] || defaultCurvature, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000" : settings.edgeLabelColor.color;
		var label = edgeData.label;
		if (!label) return;
		context.fillStyle = color;
		context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
		var ltr = !keepLabelUpright || sourceData.x < targetData.x;
		var sourceX = ltr ? sourceData.x : targetData.x;
		var sourceY = ltr ? sourceData.y : targetData.y;
		var targetX = ltr ? targetData.x : sourceData.x;
		var targetY = ltr ? targetData.y : sourceData.y;
		var centerX = (sourceX + targetX) / 2;
		var centerY = (sourceY + targetY) / 2;
		var diffX = targetX - sourceX;
		var diffY = targetY - sourceY;
		var diff = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
		var orientation = ltr ? 1 : -1;
		var anchorX = centerX + diffY * curvature * orientation;
		var anchorY = centerY - diffX * curvature * orientation;
		var offset = edgeData.size * .7 + 5;
		var sourceOffsetVector = {
			x: anchorY - sourceY,
			y: -(anchorX - sourceX)
		};
		var sourceOffsetVectorLength = Math.sqrt(Math.pow(sourceOffsetVector.x, 2) + Math.pow(sourceOffsetVector.y, 2));
		var targetOffsetVector = {
			x: targetY - anchorY,
			y: -(targetX - anchorX)
		};
		var targetOffsetVectorLength = Math.sqrt(Math.pow(targetOffsetVector.x, 2) + Math.pow(targetOffsetVector.y, 2));
		sourceX += offset * sourceOffsetVector.x / sourceOffsetVectorLength;
		sourceY += offset * sourceOffsetVector.y / sourceOffsetVectorLength;
		targetX += offset * targetOffsetVector.x / targetOffsetVectorLength;
		targetY += offset * targetOffsetVector.y / targetOffsetVectorLength;
		anchorX += offset * diffY / diff;
		anchorY -= offset * diffX / diff;
		var anchorPoint = {
			x: anchorX,
			y: anchorY
		};
		var sourcePoint = {
			x: sourceX,
			y: sourceY
		};
		var targetPoint = {
			x: targetX,
			y: targetY
		};
		var curveLength = getCurveLength(sourcePoint, anchorPoint, targetPoint);
		if (curveLength < sourceData.size + targetData.size) return;
		var textLength = context.measureText(label).width;
		var availableTextLength = curveLength - sourceData.size - targetData.size;
		if (textLength > availableTextLength) {
			var ellipsis = "…";
			label = label + ellipsis;
			textLength = context.measureText(label).width;
			while (textLength > availableTextLength && label.length > 1) {
				label = label.slice(0, -2) + ellipsis;
				textLength = context.measureText(label).width;
			}
			if (label.length < 4) return;
		}
		var charactersLengthCache = {};
		for (var i = 0, length = label.length; i < length; i++) {
			var character = label[i];
			if (!charactersLengthCache[character]) charactersLengthCache[character] = context.measureText(character).width * (1 + curvature * .35);
		}
		var t = .5 - textLength / curveLength / 2;
		for (var _i = 0, _length = label.length; _i < _length; _i++) {
			var _character = label[_i];
			var point = getCurvePoint(t, sourcePoint, anchorPoint, targetPoint);
			var tangentX = 2 * (1 - t) * (anchorX - sourceX) + 2 * t * (targetX - anchorX);
			var tangentY = 2 * (1 - t) * (anchorY - sourceY) + 2 * t * (targetY - anchorY);
			var angle = Math.atan2(tangentY, tangentX);
			context.save();
			context.translate(point.x, point.y);
			context.rotate(angle);
			context.fillText(_character, 0, 0);
			context.restore();
			t += charactersLengthCache[_character] / curveLength;
		}
	};
}
function getFragmentShader(_ref) {
	var arrowHead = _ref.arrowHead;
	var hasTargetArrowHead = (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "target" || (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "both";
	var hasSourceArrowHead = (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "source" || (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "both";
	return "\nprecision highp float;\n\nvarying vec4 v_color;\nvarying float v_thickness;\nvarying float v_feather;\nvarying vec2 v_cpA;\nvarying vec2 v_cpB;\nvarying vec2 v_cpC;\n".concat(hasTargetArrowHead ? "\nvarying float v_targetSize;\nvarying vec2 v_targetPoint;" : "", "\n").concat(hasSourceArrowHead ? "\nvarying float v_sourceSize;\nvarying vec2 v_sourcePoint;" : "", "\n").concat(arrowHead ? "\nuniform float u_lengthToThicknessRatio;\nuniform float u_widenessToThicknessRatio;" : "", "\n\nfloat det(vec2 a, vec2 b) {\n  return a.x * b.y - b.x * a.y;\n}\n\nvec2 getDistanceVector(vec2 b0, vec2 b1, vec2 b2) {\n  float a = det(b0, b2), b = 2.0 * det(b1, b0), d = 2.0 * det(b2, b1);\n  float f = b * d - a * a;\n  vec2 d21 = b2 - b1, d10 = b1 - b0, d20 = b2 - b0;\n  vec2 gf = 2.0 * (b * d21 + d * d10 + a * d20);\n  gf = vec2(gf.y, -gf.x);\n  vec2 pp = -f * gf / dot(gf, gf);\n  vec2 d0p = b0 - pp;\n  float ap = det(d0p, d20), bp = 2.0 * det(d10, d0p);\n  float t = clamp((ap + bp) / (2.0 * a + b + d), 0.0, 1.0);\n  return mix(mix(b0, b1, t), mix(b1, b2, t), t);\n}\n\nfloat distToQuadraticBezierCurve(vec2 p, vec2 b0, vec2 b1, vec2 b2) {\n  return length(getDistanceVector(b0 - p, b1 - p, b2 - p));\n}\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = distToQuadraticBezierCurve(gl_FragCoord.xy, v_cpA, v_cpB, v_cpC);\n  float thickness = v_thickness;\n").concat(hasTargetArrowHead ? "\n  float distToTarget = length(gl_FragCoord.xy - v_targetPoint);\n  float targetArrowLength = v_targetSize + thickness * u_lengthToThicknessRatio;\n  if (distToTarget < targetArrowLength) {\n    thickness = (distToTarget - v_targetSize) / (targetArrowLength - v_targetSize) * u_widenessToThicknessRatio * thickness;\n  }" : "", "\n").concat(hasSourceArrowHead ? "\n  float distToSource = length(gl_FragCoord.xy - v_sourcePoint);\n  float sourceArrowLength = v_sourceSize + thickness * u_lengthToThicknessRatio;\n  if (distToSource < sourceArrowLength) {\n    thickness = (distToSource - v_sourceSize) / (sourceArrowLength - v_sourceSize) * u_widenessToThicknessRatio * thickness;\n  }" : "", "\n\n  float halfThickness = thickness / 2.0;\n  if (dist < halfThickness) {\n    #ifdef PICKING_MODE\n    gl_FragColor = v_color;\n    #else\n    float t = smoothstep(\n      halfThickness - v_feather,\n      halfThickness,\n      dist\n    );\n\n    gl_FragColor = mix(v_color, transparent, t);\n    #endif\n  } else {\n    gl_FragColor = transparent;\n  }\n}\n");
}
function getVertexShader(_ref) {
	var arrowHead = _ref.arrowHead;
	var hasTargetArrowHead = (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "target" || (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "both";
	var hasSourceArrowHead = (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "source" || (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "both";
	return "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute float a_direction;\nattribute float a_thickness;\nattribute vec2 a_source;\nattribute vec2 a_target;\nattribute float a_current;\nattribute float a_curvature;\n".concat(hasTargetArrowHead ? "attribute float a_targetSize;\n" : "", "\n").concat(hasSourceArrowHead ? "attribute float a_sourceSize;\n" : "", "\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_pixelRatio;\nuniform vec2 u_dimensions;\nuniform float u_minEdgeThickness;\nuniform float u_feather;\n\nvarying vec4 v_color;\nvarying float v_thickness;\nvarying float v_feather;\nvarying vec2 v_cpA;\nvarying vec2 v_cpB;\nvarying vec2 v_cpC;\n").concat(hasTargetArrowHead ? "\nvarying float v_targetSize;\nvarying vec2 v_targetPoint;" : "", "\n").concat(hasSourceArrowHead ? "\nvarying float v_sourceSize;\nvarying vec2 v_sourcePoint;" : "", "\n").concat(arrowHead ? "\nuniform float u_widenessToThicknessRatio;" : "", "\n\nconst float bias = 255.0 / 254.0;\nconst float epsilon = 0.7;\n\nvec2 clipspaceToViewport(vec2 pos, vec2 dimensions) {\n  return vec2(\n    (pos.x + 1.0) * dimensions.x / 2.0,\n    (pos.y + 1.0) * dimensions.y / 2.0\n  );\n}\n\nvec2 viewportToClipspace(vec2 pos, vec2 dimensions) {\n  return vec2(\n    pos.x / dimensions.x * 2.0 - 1.0,\n    pos.y / dimensions.y * 2.0 - 1.0\n  );\n}\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  // Selecting the correct position\n  // Branchless \"position = a_source if a_current == 1.0 else a_target\"\n  vec2 position = a_source * max(0.0, a_current) + a_target * max(0.0, 1.0 - a_current);\n  position = (u_matrix * vec3(position, 1)).xy;\n\n  vec2 source = (u_matrix * vec3(a_source, 1)).xy;\n  vec2 target = (u_matrix * vec3(a_target, 1)).xy;\n\n  vec2 viewportPosition = clipspaceToViewport(position, u_dimensions);\n  vec2 viewportSource = clipspaceToViewport(source, u_dimensions);\n  vec2 viewportTarget = clipspaceToViewport(target, u_dimensions);\n\n  vec2 delta = viewportTarget.xy - viewportSource.xy;\n  float len = length(delta);\n  vec2 normal = vec2(-delta.y, delta.x) * a_direction;\n  vec2 unitNormal = normal / len;\n  float boundingBoxThickness = len * a_curvature;\n\n  float curveThickness = max(minThickness, a_thickness / u_sizeRatio);\n  v_thickness = curveThickness * u_pixelRatio;\n  v_feather = u_feather;\n\n  v_cpA = viewportSource;\n  v_cpB = 0.5 * (viewportSource + viewportTarget) + unitNormal * a_direction * boundingBoxThickness;\n  v_cpC = viewportTarget;\n\n  vec2 viewportOffsetPosition = (\n    viewportPosition +\n    unitNormal * (boundingBoxThickness / 2.0 + sign(boundingBoxThickness) * (").concat(arrowHead ? "curveThickness * u_widenessToThicknessRatio" : "curveThickness", " + epsilon)) *\n    max(0.0, a_direction) // NOTE: cutting the bounding box in half to avoid overdraw\n  );\n\n  position = viewportToClipspace(viewportOffsetPosition, u_dimensions);\n  gl_Position = vec4(position, 0, 1);\n    \n").concat(hasTargetArrowHead ? "\n  v_targetSize = a_targetSize * u_pixelRatio / u_sizeRatio;\n  v_targetPoint = viewportTarget;\n" : "", "\n").concat(hasSourceArrowHead ? "\n  v_sourceSize = a_sourceSize * u_pixelRatio / u_sizeRatio;\n  v_sourcePoint = viewportSource;\n" : "", "\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n");
}
var DEFAULT_EDGE_CURVATURE = .25;
var DEFAULT_EDGE_CURVE_PROGRAM_OPTIONS = {
	arrowHead: null,
	curvatureAttribute: "curvature",
	defaultCurvature: DEFAULT_EDGE_CURVATURE
};
/**
* This function helps to identify parallel edges, to adjust their curvatures.
*/
var DEFAULT_INDEX_PARALLEL_EDGES_OPTIONS = {
	edgeIndexAttribute: "parallelIndex",
	edgeMinIndexAttribute: "parallelMinIndex",
	edgeMaxIndexAttribute: "parallelMaxIndex"
};
function indexParallelEdgesIndex(graph, options) {
	var opts = _objectSpread2(_objectSpread2({}, DEFAULT_INDEX_PARALLEL_EDGES_OPTIONS), options || {});
	var nodeIDsMapping = {};
	var edgeDirectedIDsMapping = {};
	var edgeUndirectedIDsMapping = {};
	var incr = 0;
	graph.forEachNode(function(node) {
		nodeIDsMapping[node] = ++incr + "";
	});
	graph.forEachEdge(function(edge, _attrs, source, target) {
		var sourceId = nodeIDsMapping[source];
		var targetId = nodeIDsMapping[target];
		var directedId = [sourceId, targetId].join("-");
		edgeDirectedIDsMapping[edge] = directedId;
		edgeUndirectedIDsMapping[directedId] = [sourceId, targetId].sort().join("-");
	});
	var directedIndex = {};
	var undirectedIndex = {};
	graph.forEachEdge(function(edge) {
		var directedId = edgeDirectedIDsMapping[edge];
		var undirectedId = edgeUndirectedIDsMapping[directedId];
		directedIndex[directedId] = directedIndex[directedId] || [];
		directedIndex[directedId].push(edge);
		undirectedIndex[undirectedId] = undirectedIndex[undirectedId] || [];
		undirectedIndex[undirectedId].push(edge);
	});
	for (var directedId in directedIndex) {
		var edges = directedIndex[directedId];
		var directedCount = edges.length;
		var undirectedCount = undirectedIndex[edgeUndirectedIDsMapping[directedId]].length;
		if (directedCount === 1 && undirectedCount === 1) {
			var edge = edges[0];
			graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, null);
			graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, null);
		} else if (directedCount === 1) {
			var _edge = edges[0];
			graph.setEdgeAttribute(_edge, opts.edgeIndexAttribute, 1);
			graph.setEdgeAttribute(_edge, opts.edgeMaxIndexAttribute, 1);
		} else if (directedCount === undirectedCount) {
			var max = (directedCount - 1) / 2;
			var min = -max;
			for (var i = 0; i < directedCount; i++) {
				var _edge2 = edges[i];
				var edgeIndex = -(directedCount - 1) / 2 + i;
				graph.setEdgeAttribute(_edge2, opts.edgeIndexAttribute, edgeIndex);
				graph.setEdgeAttribute(_edge2, opts.edgeMinIndexAttribute, min);
				graph.setEdgeAttribute(_edge2, opts.edgeMaxIndexAttribute, max);
			}
		} else for (var _i = 0; _i < directedCount; _i++) {
			var _edge3 = edges[_i];
			graph.setEdgeAttribute(_edge3, opts.edgeIndexAttribute, _i + 1);
			graph.setEdgeAttribute(_edge3, opts.edgeMaxIndexAttribute, directedCount);
		}
	}
}
var _WebGLRenderingContex = WebGLRenderingContext;
var UNSIGNED_BYTE = _WebGLRenderingContex.UNSIGNED_BYTE;
var FLOAT = _WebGLRenderingContex.FLOAT;
function createEdgeCurveProgram(inputOptions) {
	var options = _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_CURVE_PROGRAM_OPTIONS), inputOptions || {});
	var _ref = options, arrowHead = _ref.arrowHead, curvatureAttribute = _ref.curvatureAttribute, drawLabel = _ref.drawLabel;
	var hasTargetArrowHead = (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "target" || (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "both";
	var hasSourceArrowHead = (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "source" || (arrowHead === null || arrowHead === void 0 ? void 0 : arrowHead.extremity) === "both";
	var UNIFORMS = [
		"u_matrix",
		"u_sizeRatio",
		"u_dimensions",
		"u_pixelRatio",
		"u_feather",
		"u_minEdgeThickness"
	].concat(_toConsumableArray(arrowHead ? ["u_lengthToThicknessRatio", "u_widenessToThicknessRatio"] : []));
	return /*#__PURE__*/ function(_EdgeProgram) {
		_inherits(EdgeCurveProgram, _EdgeProgram);
		function EdgeCurveProgram() {
			var _this;
			_classCallCheck(this, EdgeCurveProgram);
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			_this = _callSuper(this, EdgeCurveProgram, [].concat(args));
			_defineProperty(_assertThisInitialized(_this), "drawLabel", drawLabel || createDrawCurvedEdgeLabel(options));
			return _this;
		}
		_createClass(EdgeCurveProgram, [
			{
				key: "getDefinition",
				value: function getDefinition() {
					return {
						VERTICES: 6,
						VERTEX_SHADER_SOURCE: getVertexShader(options),
						FRAGMENT_SHADER_SOURCE: getFragmentShader(options),
						METHOD: WebGLRenderingContext.TRIANGLES,
						UNIFORMS,
						ATTRIBUTES: [{
							name: "a_source",
							size: 2,
							type: FLOAT
						}, {
							name: "a_target",
							size: 2,
							type: FLOAT
						}].concat(_toConsumableArray(hasTargetArrowHead ? [{
							name: "a_targetSize",
							size: 1,
							type: FLOAT
						}] : []), _toConsumableArray(hasSourceArrowHead ? [{
							name: "a_sourceSize",
							size: 1,
							type: FLOAT
						}] : []), [
							{
								name: "a_thickness",
								size: 1,
								type: FLOAT
							},
							{
								name: "a_curvature",
								size: 1,
								type: FLOAT
							},
							{
								name: "a_color",
								size: 4,
								type: UNSIGNED_BYTE,
								normalized: true
							},
							{
								name: "a_id",
								size: 4,
								type: UNSIGNED_BYTE,
								normalized: true
							}
						]),
						CONSTANT_ATTRIBUTES: [{
							name: "a_current",
							size: 1,
							type: FLOAT
						}, {
							name: "a_direction",
							size: 1,
							type: FLOAT
						}],
						CONSTANT_DATA: [
							[0, 1],
							[0, -1],
							[1, 1],
							[0, -1],
							[1, 1],
							[1, -1]
						]
					};
				}
			},
			{
				key: "processVisibleItem",
				value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
					var _data;
					var thickness = data.size || 1;
					var x1 = sourceData.x;
					var y1 = sourceData.y;
					var x2 = targetData.x;
					var y2 = targetData.y;
					var color = floatColor(data.color);
					var curvature = (_data = data[curvatureAttribute]) !== null && _data !== void 0 ? _data : DEFAULT_EDGE_CURVATURE;
					var array = this.array;
					array[startIndex++] = x1;
					array[startIndex++] = y1;
					array[startIndex++] = x2;
					array[startIndex++] = y2;
					if (hasTargetArrowHead) array[startIndex++] = targetData.size;
					if (hasSourceArrowHead) array[startIndex++] = sourceData.size;
					array[startIndex++] = thickness;
					array[startIndex++] = curvature;
					array[startIndex++] = color;
					array[startIndex++] = edgeIndex;
				}
			},
			{
				key: "setUniforms",
				value: function setUniforms(params, _ref2) {
					var gl = _ref2.gl, uniformLocations = _ref2.uniformLocations;
					var u_matrix = uniformLocations.u_matrix, u_pixelRatio = uniformLocations.u_pixelRatio, u_feather = uniformLocations.u_feather, u_sizeRatio = uniformLocations.u_sizeRatio, u_dimensions = uniformLocations.u_dimensions, u_minEdgeThickness = uniformLocations.u_minEdgeThickness;
					gl.uniformMatrix3fv(u_matrix, false, params.matrix);
					gl.uniform1f(u_pixelRatio, params.pixelRatio);
					gl.uniform1f(u_sizeRatio, params.sizeRatio);
					gl.uniform1f(u_feather, params.antiAliasingFeather);
					gl.uniform2f(u_dimensions, params.width * params.pixelRatio, params.height * params.pixelRatio);
					gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
					if (arrowHead) {
						var u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio, u_widenessToThicknessRatio = uniformLocations.u_widenessToThicknessRatio;
						gl.uniform1f(u_lengthToThicknessRatio, arrowHead.lengthToThicknessRatio);
						gl.uniform1f(u_widenessToThicknessRatio, arrowHead.widenessToThicknessRatio);
					}
				}
			}
		]);
		return EdgeCurveProgram;
	}(EdgeProgram);
}
createEdgeCurveProgram();
createEdgeCurveProgram({ arrowHead: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS });
createEdgeCurveProgram({ arrowHead: _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS), {}, { extremity: "both" }) });
//#endregion
//#region ../../node_modules/.pnpm/graphology@0.26.0_graphology-types@0.24.8/node_modules/graphology/dist/graphology.mjs
/**
* Graphology Utilities
* =====================
*
* Collection of helpful functions used by the implementation.
*/
/**
* Object.assign-like polyfill.
*
* @param  {object} target       - First object.
* @param  {object} [...objects] - Objects to merge.
* @return {object}
*/
function assignPolyfill() {
	const target = arguments[0];
	for (let i = 1, l = arguments.length; i < l; i++) {
		if (!arguments[i]) continue;
		for (const k in arguments[i]) target[k] = arguments[i][k];
	}
	return target;
}
let assign = assignPolyfill;
if (typeof Object.assign === "function") assign = Object.assign;
/**
* Function returning the first matching edge for given path.
* Note: this function does not check the existence of source & target. This
* must be performed by the caller.
*
* @param  {Graph}  graph  - Target graph.
* @param  {any}    source - Source node.
* @param  {any}    target - Target node.
* @param  {string} type   - Type of the edge (mixed, directed or undirected).
* @return {string|null}
*/
function getMatchingEdge(graph, source, target, type) {
	const sourceData = graph._nodes.get(source);
	let edge = null;
	if (!sourceData) return edge;
	if (type === "mixed") edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
	else if (type === "directed") edge = sourceData.out && sourceData.out[target];
	else edge = sourceData.undirected && sourceData.undirected[target];
	return edge;
}
/**
* Checks whether the given value is a plain object.
*
* @param  {mixed}   value - Target value.
* @return {boolean}
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null;
}
/**
* Checks whether the given object is empty.
*
* @param  {object}  o - Target Object.
* @return {boolean}
*/
function isEmpty(o) {
	let k;
	for (k in o) return false;
	return true;
}
/**
* Creates a "private" property for the given member name by concealing it
* using the `enumerable` option.
*
* @param {object} target - Target object.
* @param {string} name   - Member name.
*/
function privateProperty(target, name, value) {
	Object.defineProperty(target, name, {
		enumerable: false,
		configurable: false,
		writable: true,
		value
	});
}
/**
* Creates a read-only property for the given member name & the given getter.
*
* @param {object}   target - Target object.
* @param {string}   name   - Member name.
* @param {mixed}    value  - The attached getter or fixed value.
*/
function readOnlyProperty(target, name, value) {
	const descriptor = {
		enumerable: true,
		configurable: true
	};
	if (typeof value === "function") descriptor.get = value;
	else {
		descriptor.value = value;
		descriptor.writable = false;
	}
	Object.defineProperty(target, name, descriptor);
}
/**
* Returns whether the given object constitute valid hints.
*
* @param {object} hints - Target object.
*/
function validateHints(hints) {
	if (!isPlainObject(hints)) return false;
	if (hints.attributes && !Array.isArray(hints.attributes)) return false;
	return true;
}
/**
* Creates a function generating incremental ids for edges.
*
* @return {function}
*/
function incrementalIdStartingFromRandomByte() {
	let i = Math.floor(Math.random() * 256) & 255;
	return () => {
		return i++;
	};
}
/**
* Chains multiple iterators into a single iterator.
*
* @param {...Iterator} iterables
* @returns {Iterator}
*/
function chain() {
	const iterables = arguments;
	let current = null;
	let i = -1;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			let step = null;
			do {
				if (current === null) {
					i++;
					if (i >= iterables.length) return { done: true };
					current = iterables[i][Symbol.iterator]();
				}
				step = current.next();
				if (step.done) {
					current = null;
					continue;
				}
				break;
			} while (true);
			return step;
		}
	};
}
function emptyIterator() {
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			return { done: true };
		}
	};
}
/**
* Graphology Custom Errors
* =========================
*
* Defining custom errors for ease of use & easy unit tests across
* implementations (normalized typology rather than relying on error
* messages to check whether the correct error was found).
*/
var GraphError = class extends Error {
	constructor(message) {
		super();
		this.name = "GraphError";
		this.message = message;
	}
};
var InvalidArgumentsGraphError = class InvalidArgumentsGraphError extends GraphError {
	constructor(message) {
		super(message);
		this.name = "InvalidArgumentsGraphError";
		if (typeof Error.captureStackTrace === "function") Error.captureStackTrace(this, InvalidArgumentsGraphError.prototype.constructor);
	}
};
var NotFoundGraphError = class NotFoundGraphError extends GraphError {
	constructor(message) {
		super(message);
		this.name = "NotFoundGraphError";
		if (typeof Error.captureStackTrace === "function") Error.captureStackTrace(this, NotFoundGraphError.prototype.constructor);
	}
};
var UsageGraphError = class UsageGraphError extends GraphError {
	constructor(message) {
		super(message);
		this.name = "UsageGraphError";
		if (typeof Error.captureStackTrace === "function") Error.captureStackTrace(this, UsageGraphError.prototype.constructor);
	}
};
/**
* Graphology Internal Data Classes
* =================================
*
* Internal classes hopefully reduced to structs by engines & storing
* necessary information for nodes & edges.
*
* Note that those classes don't rely on the `class` keyword to avoid some
* cruft introduced by most of ES2015 transpilers.
*/
/**
* MixedNodeData class.
*
* @constructor
* @param {string} string     - The node's key.
* @param {object} attributes - Node's attributes.
*/
function MixedNodeData(key, attributes) {
	this.key = key;
	this.attributes = attributes;
	this.clear();
}
MixedNodeData.prototype.clear = function() {
	this.inDegree = 0;
	this.outDegree = 0;
	this.undirectedDegree = 0;
	this.undirectedLoops = 0;
	this.directedLoops = 0;
	this.in = {};
	this.out = {};
	this.undirected = {};
};
/**
* DirectedNodeData class.
*
* @constructor
* @param {string} string     - The node's key.
* @param {object} attributes - Node's attributes.
*/
function DirectedNodeData(key, attributes) {
	this.key = key;
	this.attributes = attributes;
	this.clear();
}
DirectedNodeData.prototype.clear = function() {
	this.inDegree = 0;
	this.outDegree = 0;
	this.directedLoops = 0;
	this.in = {};
	this.out = {};
};
/**
* UndirectedNodeData class.
*
* @constructor
* @param {string} string     - The node's key.
* @param {object} attributes - Node's attributes.
*/
function UndirectedNodeData(key, attributes) {
	this.key = key;
	this.attributes = attributes;
	this.clear();
}
UndirectedNodeData.prototype.clear = function() {
	this.undirectedDegree = 0;
	this.undirectedLoops = 0;
	this.undirected = {};
};
/**
* EdgeData class.
*
* @constructor
* @param {boolean} undirected   - Whether the edge is undirected.
* @param {string}  string       - The edge's key.
* @param {string}  source       - Source of the edge.
* @param {string}  target       - Target of the edge.
* @param {object}  attributes   - Edge's attributes.
*/
function EdgeData(undirected, key, source, target, attributes) {
	this.key = key;
	this.attributes = attributes;
	this.undirected = undirected;
	this.source = source;
	this.target = target;
}
EdgeData.prototype.attach = function() {
	let outKey = "out";
	let inKey = "in";
	if (this.undirected) outKey = inKey = "undirected";
	const source = this.source.key;
	const target = this.target.key;
	this.source[outKey][target] = this;
	if (this.undirected && source === target) return;
	this.target[inKey][source] = this;
};
EdgeData.prototype.attachMulti = function() {
	let outKey = "out";
	let inKey = "in";
	const source = this.source.key;
	const target = this.target.key;
	if (this.undirected) outKey = inKey = "undirected";
	const adj = this.source[outKey];
	const head = adj[target];
	if (typeof head === "undefined") {
		adj[target] = this;
		if (!(this.undirected && source === target)) this.target[inKey][source] = this;
		return;
	}
	head.previous = this;
	this.next = head;
	adj[target] = this;
	this.target[inKey][source] = this;
};
EdgeData.prototype.detach = function() {
	const source = this.source.key;
	const target = this.target.key;
	let outKey = "out";
	let inKey = "in";
	if (this.undirected) outKey = inKey = "undirected";
	delete this.source[outKey][target];
	delete this.target[inKey][source];
};
EdgeData.prototype.detachMulti = function() {
	const source = this.source.key;
	const target = this.target.key;
	let outKey = "out";
	let inKey = "in";
	if (this.undirected) outKey = inKey = "undirected";
	if (this.previous === void 0) {
		if (this.next === void 0) {
			delete this.source[outKey][target];
			delete this.target[inKey][source];
		} else {
			this.next.previous = void 0;
			this.source[outKey][target] = this.next;
			this.target[inKey][source] = this.next;
		}
	} else {
		this.previous.next = this.next;
		if (this.next !== void 0) this.next.previous = this.previous;
	}
};
/**
* Graphology Node Attributes methods
* ===================================
*/
const NODE = 0;
const SOURCE = 1;
const TARGET = 2;
const OPPOSITE = 3;
function findRelevantNodeData(graph, method, mode, nodeOrEdge, nameOrEdge, add1, add2) {
	let nodeData, edgeData, arg1, arg2;
	nodeOrEdge = "" + nodeOrEdge;
	if (mode === NODE) {
		nodeData = graph._nodes.get(nodeOrEdge);
		if (!nodeData) throw new NotFoundGraphError(`Graph.${method}: could not find the "${nodeOrEdge}" node in the graph.`);
		arg1 = nameOrEdge;
		arg2 = add1;
	} else if (mode === OPPOSITE) {
		nameOrEdge = "" + nameOrEdge;
		edgeData = graph._edges.get(nameOrEdge);
		if (!edgeData) throw new NotFoundGraphError(`Graph.${method}: could not find the "${nameOrEdge}" edge in the graph.`);
		const source = edgeData.source.key;
		const target = edgeData.target.key;
		if (nodeOrEdge === source) nodeData = edgeData.target;
		else if (nodeOrEdge === target) nodeData = edgeData.source;
		else throw new NotFoundGraphError(`Graph.${method}: the "${nodeOrEdge}" node is not attached to the "${nameOrEdge}" edge (${source}, ${target}).`);
		arg1 = add1;
		arg2 = add2;
	} else {
		edgeData = graph._edges.get(nodeOrEdge);
		if (!edgeData) throw new NotFoundGraphError(`Graph.${method}: could not find the "${nodeOrEdge}" edge in the graph.`);
		if (mode === SOURCE) nodeData = edgeData.source;
		else nodeData = edgeData.target;
		arg1 = nameOrEdge;
		arg2 = add1;
	}
	return [
		nodeData,
		arg1,
		arg2
	];
}
function attachNodeAttributeGetter(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
		const [data, name] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1);
		return data.attributes[name];
	};
}
function attachNodeAttributesGetter(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge) {
		const [data] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge);
		return data.attributes;
	};
}
function attachNodeAttributeChecker(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
		const [data, name] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1);
		return data.attributes.hasOwnProperty(name);
	};
}
function attachNodeAttributeSetter(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1, add2) {
		const [data, name, value] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1, add2);
		data.attributes[name] = value;
		this.emit("nodeAttributesUpdated", {
			key: data.key,
			type: "set",
			attributes: data.attributes,
			name
		});
		return this;
	};
}
function attachNodeAttributeUpdater(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1, add2) {
		const [data, name, updater] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1, add2);
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError(`Graph.${method}: updater should be a function.`);
		const attributes = data.attributes;
		attributes[name] = updater(attributes[name]);
		this.emit("nodeAttributesUpdated", {
			key: data.key,
			type: "set",
			attributes: data.attributes,
			name
		});
		return this;
	};
}
function attachNodeAttributeRemover(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
		const [data, name] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1);
		delete data.attributes[name];
		this.emit("nodeAttributesUpdated", {
			key: data.key,
			type: "remove",
			attributes: data.attributes,
			name
		});
		return this;
	};
}
function attachNodeAttributesReplacer(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
		const [data, attributes] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1);
		if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);
		data.attributes = attributes;
		this.emit("nodeAttributesUpdated", {
			key: data.key,
			type: "replace",
			attributes: data.attributes
		});
		return this;
	};
}
function attachNodeAttributesMerger(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
		const [data, attributes] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1);
		if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);
		assign(data.attributes, attributes);
		this.emit("nodeAttributesUpdated", {
			key: data.key,
			type: "merge",
			attributes: data.attributes,
			data: attributes
		});
		return this;
	};
}
function attachNodeAttributesUpdater(Class, method, mode) {
	Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
		const [data, updater] = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1);
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError(`Graph.${method}: provided updater is not a function.`);
		data.attributes = updater(data.attributes);
		this.emit("nodeAttributesUpdated", {
			key: data.key,
			type: "update",
			attributes: data.attributes
		});
		return this;
	};
}
/**
* List of methods to attach.
*/
const NODE_ATTRIBUTES_METHODS = [
	{
		name: (element) => `get${element}Attribute`,
		attacher: attachNodeAttributeGetter
	},
	{
		name: (element) => `get${element}Attributes`,
		attacher: attachNodeAttributesGetter
	},
	{
		name: (element) => `has${element}Attribute`,
		attacher: attachNodeAttributeChecker
	},
	{
		name: (element) => `set${element}Attribute`,
		attacher: attachNodeAttributeSetter
	},
	{
		name: (element) => `update${element}Attribute`,
		attacher: attachNodeAttributeUpdater
	},
	{
		name: (element) => `remove${element}Attribute`,
		attacher: attachNodeAttributeRemover
	},
	{
		name: (element) => `replace${element}Attributes`,
		attacher: attachNodeAttributesReplacer
	},
	{
		name: (element) => `merge${element}Attributes`,
		attacher: attachNodeAttributesMerger
	},
	{
		name: (element) => `update${element}Attributes`,
		attacher: attachNodeAttributesUpdater
	}
];
/**
* Attach every attributes-related methods to a Graph class.
*
* @param {function} Graph - Target class.
*/
function attachNodeAttributesMethods(Graph) {
	NODE_ATTRIBUTES_METHODS.forEach(function({ name, attacher }) {
		attacher(Graph, name("Node"), NODE);
		attacher(Graph, name("Source"), SOURCE);
		attacher(Graph, name("Target"), TARGET);
		attacher(Graph, name("Opposite"), OPPOSITE);
	});
}
/**
* Graphology Edge Attributes methods
* ===================================
*/
/**
* Attach an attribute getter method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributeGetter(Class, method, type) {
	/**
	* Get the desired attribute for the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}    element - Target element.
	* @param  {string} name    - Attribute's name.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source - Source element.
	* @param  {any}     target - Target element.
	* @param  {string}  name   - Attribute's name.
	*
	* @return {mixed}          - The attribute's value.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, name) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 2) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element;
			const target = "" + name;
			name = arguments[2];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		return data.attributes[name];
	};
}
/**
* Attach an attributes getter method onto the provided class.
*
* @param {function} Class       - Target class.
* @param {string}   method      - Method name.
* @param {string}   type        - Type of the edge to find.
*/
function attachEdgeAttributesGetter(Class, method, type) {
	/**
	* Retrieves all the target element's attributes.
	*
	* Arity 2:
	* @param  {any}    element - Target element.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source - Source element.
	* @param  {any}     target - Target element.
	*
	* @return {object}          - The element's attributes.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 1) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element, target = "" + arguments[1];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		return data.attributes;
	};
}
/**
* Attach an attribute checker method onto the provided class.
*
* @param {function} Class       - Target class.
* @param {string}   method      - Method name.
* @param {string}   type        - Type of the edge to find.
*/
function attachEdgeAttributeChecker(Class, method, type) {
	/**
	* Checks whether the desired attribute is set for the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}    element - Target element.
	* @param  {string} name    - Attribute's name.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source - Source element.
	* @param  {any}     target - Target element.
	* @param  {string}  name   - Attribute's name.
	*
	* @return {boolean}
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, name) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 2) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element;
			const target = "" + name;
			name = arguments[2];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		return data.attributes.hasOwnProperty(name);
	};
}
/**
* Attach an attribute setter method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributeSetter(Class, method, type) {
	/**
	* Set the desired attribute for the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}    element - Target element.
	* @param  {string} name    - Attribute's name.
	* @param  {mixed}  value   - New attribute value.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source - Source element.
	* @param  {any}     target - Target element.
	* @param  {string}  name   - Attribute's name.
	* @param  {mixed}  value   - New attribute value.
	*
	* @return {Graph}          - Returns itself for chaining.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, name, value) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 3) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element;
			const target = "" + name;
			name = arguments[2];
			value = arguments[3];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		data.attributes[name] = value;
		this.emit("edgeAttributesUpdated", {
			key: data.key,
			type: "set",
			attributes: data.attributes,
			name
		});
		return this;
	};
}
/**
* Attach an attribute updater method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributeUpdater(Class, method, type) {
	/**
	* Update the desired attribute for the given element (node or edge) using
	* the provided function.
	*
	* Arity 2:
	* @param  {any}      element - Target element.
	* @param  {string}   name    - Attribute's name.
	* @param  {function} updater - Updater function.
	*
	* Arity 3 (only for edges):
	* @param  {any}      source  - Source element.
	* @param  {any}      target  - Target element.
	* @param  {string}   name    - Attribute's name.
	* @param  {function} updater - Updater function.
	*
	* @return {Graph}            - Returns itself for chaining.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, name, updater) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 3) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element;
			const target = "" + name;
			name = arguments[2];
			updater = arguments[3];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError(`Graph.${method}: updater should be a function.`);
		data.attributes[name] = updater(data.attributes[name]);
		this.emit("edgeAttributesUpdated", {
			key: data.key,
			type: "set",
			attributes: data.attributes,
			name
		});
		return this;
	};
}
/**
* Attach an attribute remover method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributeRemover(Class, method, type) {
	/**
	* Remove the desired attribute for the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}    element - Target element.
	* @param  {string} name    - Attribute's name.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source - Source element.
	* @param  {any}     target - Target element.
	* @param  {string}  name   - Attribute's name.
	*
	* @return {Graph}          - Returns itself for chaining.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, name) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 2) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element;
			const target = "" + name;
			name = arguments[2];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		delete data.attributes[name];
		this.emit("edgeAttributesUpdated", {
			key: data.key,
			type: "remove",
			attributes: data.attributes,
			name
		});
		return this;
	};
}
/**
* Attach an attribute replacer method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributesReplacer(Class, method, type) {
	/**
	* Replace the attributes for the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}    element    - Target element.
	* @param  {object} attributes - New attributes.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source     - Source element.
	* @param  {any}     target     - Target element.
	* @param  {object}  attributes - New attributes.
	*
	* @return {Graph}              - Returns itself for chaining.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, attributes) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 2) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element, target = "" + attributes;
			attributes = arguments[2];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);
		data.attributes = attributes;
		this.emit("edgeAttributesUpdated", {
			key: data.key,
			type: "replace",
			attributes: data.attributes
		});
		return this;
	};
}
/**
* Attach an attribute merger method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributesMerger(Class, method, type) {
	/**
	* Merge the attributes for the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}    element    - Target element.
	* @param  {object} attributes - Attributes to merge.
	*
	* Arity 3 (only for edges):
	* @param  {any}     source     - Source element.
	* @param  {any}     target     - Target element.
	* @param  {object}  attributes - Attributes to merge.
	*
	* @return {Graph}              - Returns itself for chaining.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, attributes) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 2) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element, target = "" + attributes;
			attributes = arguments[2];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);
		assign(data.attributes, attributes);
		this.emit("edgeAttributesUpdated", {
			key: data.key,
			type: "merge",
			attributes: data.attributes,
			data: attributes
		});
		return this;
	};
}
/**
* Attach an attribute updater method onto the provided class.
*
* @param {function} Class         - Target class.
* @param {string}   method        - Method name.
* @param {string}   type          - Type of the edge to find.
*/
function attachEdgeAttributesUpdater(Class, method, type) {
	/**
	* Update the attributes of the given element (node or edge).
	*
	* Arity 2:
	* @param  {any}      element - Target element.
	* @param  {function} updater - Updater function.
	*
	* Arity 3 (only for edges):
	* @param  {any}      source  - Source element.
	* @param  {any}      target  - Target element.
	* @param  {function} updater - Updater function.
	*
	* @return {Graph}            - Returns itself for chaining.
	*
	* @throws {Error} - Will throw if too many arguments are provided.
	* @throws {Error} - Will throw if any of the elements is not found.
	*/
	Class.prototype[method] = function(element, updater) {
		let data;
		if (this.type !== "mixed" && type !== "mixed" && type !== this.type) throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);
		if (arguments.length > 2) {
			if (this.multi) throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);
			const source = "" + element, target = "" + updater;
			updater = arguments[2];
			data = getMatchingEdge(this, source, target, type);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
		} else {
			if (type !== "mixed") throw new UsageGraphError(`Graph.${method}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);
			element = "" + element;
			data = this._edges.get(element);
			if (!data) throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
		}
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError(`Graph.${method}: provided updater is not a function.`);
		data.attributes = updater(data.attributes);
		this.emit("edgeAttributesUpdated", {
			key: data.key,
			type: "update",
			attributes: data.attributes
		});
		return this;
	};
}
/**
* List of methods to attach.
*/
const EDGE_ATTRIBUTES_METHODS = [
	{
		name: (element) => `get${element}Attribute`,
		attacher: attachEdgeAttributeGetter
	},
	{
		name: (element) => `get${element}Attributes`,
		attacher: attachEdgeAttributesGetter
	},
	{
		name: (element) => `has${element}Attribute`,
		attacher: attachEdgeAttributeChecker
	},
	{
		name: (element) => `set${element}Attribute`,
		attacher: attachEdgeAttributeSetter
	},
	{
		name: (element) => `update${element}Attribute`,
		attacher: attachEdgeAttributeUpdater
	},
	{
		name: (element) => `remove${element}Attribute`,
		attacher: attachEdgeAttributeRemover
	},
	{
		name: (element) => `replace${element}Attributes`,
		attacher: attachEdgeAttributesReplacer
	},
	{
		name: (element) => `merge${element}Attributes`,
		attacher: attachEdgeAttributesMerger
	},
	{
		name: (element) => `update${element}Attributes`,
		attacher: attachEdgeAttributesUpdater
	}
];
/**
* Attach every attributes-related methods to a Graph class.
*
* @param {function} Graph - Target class.
*/
function attachEdgeAttributesMethods(Graph) {
	EDGE_ATTRIBUTES_METHODS.forEach(function({ name, attacher }) {
		attacher(Graph, name("Edge"), "mixed");
		attacher(Graph, name("DirectedEdge"), "directed");
		attacher(Graph, name("UndirectedEdge"), "undirected");
	});
}
/**
* Graphology Edge Iteration
* ==========================
*
* Attaching some methods to the Graph class to be able to iterate over a
* graph's edges.
*/
/**
* Definitions.
*/
const EDGES_ITERATION = [
	{
		name: "edges",
		type: "mixed"
	},
	{
		name: "inEdges",
		type: "directed",
		direction: "in"
	},
	{
		name: "outEdges",
		type: "directed",
		direction: "out"
	},
	{
		name: "inboundEdges",
		type: "mixed",
		direction: "in"
	},
	{
		name: "outboundEdges",
		type: "mixed",
		direction: "out"
	},
	{
		name: "directedEdges",
		type: "directed"
	},
	{
		name: "undirectedEdges",
		type: "undirected"
	}
];
/**
* Function iterating over edges from the given object to match one of them.
*
* @param {object}   object   - Target object.
* @param {function} callback - Function to call.
*/
function forEachSimple(breakable, object, callback, avoid) {
	let shouldBreak = false;
	for (const k in object) {
		if (k === avoid) continue;
		const edgeData = object[k];
		shouldBreak = callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
		if (breakable && shouldBreak) return edgeData.key;
	}
}
function forEachMulti(breakable, object, callback, avoid) {
	let edgeData, source, target;
	let shouldBreak = false;
	for (const k in object) {
		if (k === avoid) continue;
		edgeData = object[k];
		do {
			source = edgeData.source;
			target = edgeData.target;
			shouldBreak = callback(edgeData.key, edgeData.attributes, source.key, target.key, source.attributes, target.attributes, edgeData.undirected);
			if (breakable && shouldBreak) return edgeData.key;
			edgeData = edgeData.next;
		} while (edgeData !== void 0);
	}
}
/**
* Function returning an iterator over edges from the given object.
*
* @param  {object}   object - Target object.
* @return {Iterator}
*/
function createIterator(object, avoid) {
	const keys = Object.keys(object);
	const l = keys.length;
	let edgeData;
	let i = 0;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			do
				if (!edgeData) {
					if (i >= l) return { done: true };
					const k = keys[i++];
					if (k === avoid) {
						edgeData = void 0;
						continue;
					}
					edgeData = object[k];
				} else edgeData = edgeData.next;
			while (!edgeData);
			return {
				done: false,
				value: {
					edge: edgeData.key,
					attributes: edgeData.attributes,
					source: edgeData.source.key,
					target: edgeData.target.key,
					sourceAttributes: edgeData.source.attributes,
					targetAttributes: edgeData.target.attributes,
					undirected: edgeData.undirected
				}
			};
		}
	};
}
/**
* Function iterating over the egdes from the object at given key to match
* one of them.
*
* @param {object}   object   - Target object.
* @param {mixed}    k        - Neighbor key.
* @param {function} callback - Callback to use.
*/
function forEachForKeySimple(breakable, object, k, callback) {
	const edgeData = object[k];
	if (!edgeData) return;
	const sourceData = edgeData.source;
	const targetData = edgeData.target;
	if (callback(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected) && breakable) return edgeData.key;
}
function forEachForKeyMulti(breakable, object, k, callback) {
	let edgeData = object[k];
	if (!edgeData) return;
	let shouldBreak = false;
	do {
		shouldBreak = callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
		if (breakable && shouldBreak) return edgeData.key;
		edgeData = edgeData.next;
	} while (edgeData !== void 0);
}
/**
* Function returning an iterator over the egdes from the object at given key.
*
* @param  {object}   object   - Target object.
* @param  {mixed}    k        - Neighbor key.
* @return {Iterator}
*/
function createIteratorForKey(object, k) {
	let edgeData = object[k];
	if (edgeData.next !== void 0) return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			if (!edgeData) return { done: true };
			const value = {
				edge: edgeData.key,
				attributes: edgeData.attributes,
				source: edgeData.source.key,
				target: edgeData.target.key,
				sourceAttributes: edgeData.source.attributes,
				targetAttributes: edgeData.target.attributes,
				undirected: edgeData.undirected
			};
			edgeData = edgeData.next;
			return {
				done: false,
				value
			};
		}
	};
	let done = false;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			if (done === true) return { done: true };
			done = true;
			return {
				done: false,
				value: {
					edge: edgeData.key,
					attributes: edgeData.attributes,
					source: edgeData.source.key,
					target: edgeData.target.key,
					sourceAttributes: edgeData.source.attributes,
					targetAttributes: edgeData.target.attributes,
					undirected: edgeData.undirected
				}
			};
		}
	};
}
/**
* Function creating an array of edges for the given type.
*
* @param  {Graph}   graph - Target Graph instance.
* @param  {string}  type  - Type of edges to retrieve.
* @return {array}         - Array of edges.
*/
function createEdgeArray(graph, type) {
	if (graph.size === 0) return [];
	if (type === "mixed" || type === graph.type) return Array.from(graph._edges.keys());
	const size = type === "undirected" ? graph.undirectedSize : graph.directedSize;
	const list = new Array(size), mask = type === "undirected";
	const iterator = graph._edges.values();
	let i = 0;
	let step, data;
	while (step = iterator.next(), step.done !== true) {
		data = step.value;
		if (data.undirected === mask) list[i++] = data.key;
	}
	return list;
}
/**
* Function iterating over a graph's edges using a callback to match one of
* them.
*
* @param  {Graph}    graph    - Target Graph instance.
* @param  {string}   type     - Type of edges to retrieve.
* @param  {function} callback - Function to call.
*/
function forEachEdge(breakable, graph, type, callback) {
	if (graph.size === 0) return;
	const shouldFilter = type !== "mixed" && type !== graph.type;
	const mask = type === "undirected";
	let step, data;
	let shouldBreak = false;
	const iterator = graph._edges.values();
	while (step = iterator.next(), step.done !== true) {
		data = step.value;
		if (shouldFilter && data.undirected !== mask) continue;
		const { key, attributes, source, target } = data;
		shouldBreak = callback(key, attributes, source.key, target.key, source.attributes, target.attributes, data.undirected);
		if (breakable && shouldBreak) return key;
	}
}
/**
* Function creating an iterator of edges for the given type.
*
* @param  {Graph}    graph - Target Graph instance.
* @param  {string}   type  - Type of edges to retrieve.
* @return {Iterator}
*/
function createEdgeIterator(graph, type) {
	if (graph.size === 0) return emptyIterator();
	const shouldFilter = type !== "mixed" && type !== graph.type;
	const mask = type === "undirected";
	const iterator = graph._edges.values();
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			let step, data;
			while (true) {
				step = iterator.next();
				if (step.done) return step;
				data = step.value;
				if (shouldFilter && data.undirected !== mask) continue;
				break;
			}
			return {
				value: {
					edge: data.key,
					attributes: data.attributes,
					source: data.source.key,
					target: data.target.key,
					sourceAttributes: data.source.attributes,
					targetAttributes: data.target.attributes,
					undirected: data.undirected
				},
				done: false
			};
		}
	};
}
/**
* Function iterating over a node's edges using a callback to match one of them.
*
* @param  {boolean}  multi     - Whether the graph is multi or not.
* @param  {string}   type      - Type of edges to retrieve.
* @param  {string}   direction - In or out?
* @param  {any}      nodeData  - Target node's data.
* @param  {function} callback  - Function to call.
*/
function forEachEdgeForNode(breakable, multi, type, direction, nodeData, callback) {
	const fn = multi ? forEachMulti : forEachSimple;
	let found;
	if (type !== "undirected") {
		if (direction !== "out") {
			found = fn(breakable, nodeData.in, callback);
			if (breakable && found) return found;
		}
		if (direction !== "in") {
			found = fn(breakable, nodeData.out, callback, !direction ? nodeData.key : void 0);
			if (breakable && found) return found;
		}
	}
	if (type !== "directed") {
		found = fn(breakable, nodeData.undirected, callback);
		if (breakable && found) return found;
	}
}
/**
* Function creating an array of edges for the given type & the given node.
*
* @param  {boolean} multi     - Whether the graph is multi or not.
* @param  {string}  type      - Type of edges to retrieve.
* @param  {string}  direction - In or out?
* @param  {any}     nodeData  - Target node's data.
* @return {array}             - Array of edges.
*/
function createEdgeArrayForNode(multi, type, direction, nodeData) {
	const edges = [];
	forEachEdgeForNode(false, multi, type, direction, nodeData, function(key) {
		edges.push(key);
	});
	return edges;
}
/**
* Function iterating over a node's edges using a callback.
*
* @param  {string}   type      - Type of edges to retrieve.
* @param  {string}   direction - In or out?
* @param  {any}      nodeData  - Target node's data.
* @return {Iterator}
*/
function createEdgeIteratorForNode(type, direction, nodeData) {
	let iterator = emptyIterator();
	if (type !== "undirected") {
		if (direction !== "out" && typeof nodeData.in !== "undefined") iterator = chain(iterator, createIterator(nodeData.in));
		if (direction !== "in" && typeof nodeData.out !== "undefined") iterator = chain(iterator, createIterator(nodeData.out, !direction ? nodeData.key : void 0));
	}
	if (type !== "directed" && typeof nodeData.undirected !== "undefined") iterator = chain(iterator, createIterator(nodeData.undirected));
	return iterator;
}
/**
* Function iterating over edges for the given path using a callback to match
* one of them.
*
* @param  {string}   type       - Type of edges to retrieve.
* @param  {boolean}  multi      - Whether the graph is multi.
* @param  {string}   direction  - In or out?
* @param  {NodeData} sourceData - Source node's data.
* @param  {string}   target     - Target node.
* @param  {function} callback   - Function to call.
*/
function forEachEdgeForPath(breakable, type, multi, direction, sourceData, target, callback) {
	const fn = multi ? forEachForKeyMulti : forEachForKeySimple;
	let found;
	if (type !== "undirected") {
		if (typeof sourceData.in !== "undefined" && direction !== "out") {
			found = fn(breakable, sourceData.in, target, callback);
			if (breakable && found) return found;
		}
		if (typeof sourceData.out !== "undefined" && direction !== "in" && (direction || sourceData.key !== target)) {
			found = fn(breakable, sourceData.out, target, callback);
			if (breakable && found) return found;
		}
	}
	if (type !== "directed") {
		if (typeof sourceData.undirected !== "undefined") {
			found = fn(breakable, sourceData.undirected, target, callback);
			if (breakable && found) return found;
		}
	}
}
/**
* Function creating an array of edges for the given path.
*
* @param  {string}   type       - Type of edges to retrieve.
* @param  {boolean}  multi      - Whether the graph is multi.
* @param  {string}   direction  - In or out?
* @param  {NodeData} sourceData - Source node's data.
* @param  {any}      target     - Target node.
* @return {array}               - Array of edges.
*/
function createEdgeArrayForPath(type, multi, direction, sourceData, target) {
	const edges = [];
	forEachEdgeForPath(false, type, multi, direction, sourceData, target, function(key) {
		edges.push(key);
	});
	return edges;
}
/**
* Function returning an iterator over edges for the given path.
*
* @param  {string}   type       - Type of edges to retrieve.
* @param  {string}   direction  - In or out?
* @param  {NodeData} sourceData - Source node's data.
* @param  {string}   target     - Target node.
* @param  {function} callback   - Function to call.
*/
function createEdgeIteratorForPath(type, direction, sourceData, target) {
	let iterator = emptyIterator();
	if (type !== "undirected") {
		if (typeof sourceData.in !== "undefined" && direction !== "out" && target in sourceData.in) iterator = chain(iterator, createIteratorForKey(sourceData.in, target));
		if (typeof sourceData.out !== "undefined" && direction !== "in" && target in sourceData.out && (direction || sourceData.key !== target)) iterator = chain(iterator, createIteratorForKey(sourceData.out, target));
	}
	if (type !== "directed") {
		if (typeof sourceData.undirected !== "undefined" && target in sourceData.undirected) iterator = chain(iterator, createIteratorForKey(sourceData.undirected, target));
	}
	return iterator;
}
/**
* Function attaching an edge array creator method to the Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachEdgeArrayCreator(Class, description) {
	const { name, type, direction } = description;
	/**
	* Function returning an array of certain edges.
	*
	* Arity 0: Return all the relevant edges.
	*
	* Arity 1: Return all of a node's relevant edges.
	* @param  {any}   node   - Target node.
	*
	* Arity 2: Return the relevant edges across the given path.
	* @param  {any}   source - Source node.
	* @param  {any}   target - Target node.
	*
	* @return {array|number} - The edges or the number of edges.
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[name] = function(source, target) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return [];
		if (!arguments.length) return createEdgeArray(this, type);
		if (arguments.length === 1) {
			source = "" + source;
			const nodeData = this._nodes.get(source);
			if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);
			return createEdgeArrayForNode(this.multi, type === "mixed" ? this.type : type, direction, nodeData);
		}
		if (arguments.length === 2) {
			source = "" + source;
			target = "" + target;
			const sourceData = this._nodes.get(source);
			if (!sourceData) throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);
			if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);
			return createEdgeArrayForPath(type, this.multi, direction, sourceData, target);
		}
		throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
	};
}
/**
* Function attaching a edge callback iterator method to the Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachForEachEdge(Class, description) {
	const { name, type, direction } = description;
	const forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
	/**
	* Function iterating over the graph's relevant edges by applying the given
	* callback.
	*
	* Arity 1: Iterate over all the relevant edges.
	* @param  {function} callback - Callback to use.
	*
	* Arity 2: Iterate over all of a node's relevant edges.
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* Arity 3: Iterate over the relevant edges across the given path.
	* @param  {any}      source   - Source node.
	* @param  {any}      target   - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[forEachName] = function(source, target, callback) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return;
		if (arguments.length === 1) {
			callback = source;
			return forEachEdge(false, this, type, callback);
		}
		if (arguments.length === 2) {
			source = "" + source;
			callback = target;
			const nodeData = this._nodes.get(source);
			if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${forEachName}: could not find the "${source}" node in the graph.`);
			return forEachEdgeForNode(false, this.multi, type === "mixed" ? this.type : type, direction, nodeData, callback);
		}
		if (arguments.length === 3) {
			source = "" + source;
			target = "" + target;
			const sourceData = this._nodes.get(source);
			if (!sourceData) throw new NotFoundGraphError(`Graph.${forEachName}:  could not find the "${source}" source node in the graph.`);
			if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.${forEachName}:  could not find the "${target}" target node in the graph.`);
			return forEachEdgeForPath(false, type, this.multi, direction, sourceData, target, callback);
		}
		throw new InvalidArgumentsGraphError(`Graph.${forEachName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`);
	};
	/**
	* Function mapping the graph's relevant edges by applying the given
	* callback.
	*
	* Arity 1: Map all the relevant edges.
	* @param  {function} callback - Callback to use.
	*
	* Arity 2: Map all of a node's relevant edges.
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* Arity 3: Map the relevant edges across the given path.
	* @param  {any}      source   - Source node.
	* @param  {any}      target   - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const mapName = "map" + name[0].toUpperCase() + name.slice(1);
	Class.prototype[mapName] = function() {
		const args = Array.prototype.slice.call(arguments);
		const callback = args.pop();
		let result;
		if (args.length === 0) {
			let length = 0;
			if (type !== "directed") length += this.undirectedSize;
			if (type !== "undirected") length += this.directedSize;
			result = new Array(length);
			let i = 0;
			args.push((e, ea, s, t, sa, ta, u) => {
				result[i++] = callback(e, ea, s, t, sa, ta, u);
			});
		} else {
			result = [];
			args.push((e, ea, s, t, sa, ta, u) => {
				result.push(callback(e, ea, s, t, sa, ta, u));
			});
		}
		this[forEachName].apply(this, args);
		return result;
	};
	/**
	* Function filtering the graph's relevant edges using the provided predicate
	* function.
	*
	* Arity 1: Filter all the relevant edges.
	* @param  {function} predicate - Predicate to use.
	*
	* Arity 2: Filter all of a node's relevant edges.
	* @param  {any}      node      - Target node.
	* @param  {function} predicate - Predicate to use.
	*
	* Arity 3: Filter the relevant edges across the given path.
	* @param  {any}      source    - Source node.
	* @param  {any}      target    - Target node.
	* @param  {function} predicate - Predicate to use.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const filterName = "filter" + name[0].toUpperCase() + name.slice(1);
	Class.prototype[filterName] = function() {
		const args = Array.prototype.slice.call(arguments);
		const callback = args.pop();
		const result = [];
		args.push((e, ea, s, t, sa, ta, u) => {
			if (callback(e, ea, s, t, sa, ta, u)) result.push(e);
		});
		this[forEachName].apply(this, args);
		return result;
	};
	/**
	* Function reducing the graph's relevant edges using the provided accumulator
	* function.
	*
	* Arity 1: Reduce all the relevant edges.
	* @param  {function} accumulator  - Accumulator to use.
	* @param  {any}      initialValue - Initial value.
	*
	* Arity 2: Reduce all of a node's relevant edges.
	* @param  {any}      node         - Target node.
	* @param  {function} accumulator  - Accumulator to use.
	* @param  {any}      initialValue - Initial value.
	*
	* Arity 3: Reduce the relevant edges across the given path.
	* @param  {any}      source       - Source node.
	* @param  {any}      target       - Target node.
	* @param  {function} accumulator  - Accumulator to use.
	* @param  {any}      initialValue - Initial value.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const reduceName = "reduce" + name[0].toUpperCase() + name.slice(1);
	Class.prototype[reduceName] = function() {
		let args = Array.prototype.slice.call(arguments);
		if (args.length < 2 || args.length > 4) throw new InvalidArgumentsGraphError(`Graph.${reduceName}: invalid number of arguments (expecting 2, 3 or 4 and got ${args.length}).`);
		if (typeof args[args.length - 1] === "function" && typeof args[args.length - 2] !== "function") throw new InvalidArgumentsGraphError(`Graph.${reduceName}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);
		let callback;
		let initialValue;
		if (args.length === 2) {
			callback = args[0];
			initialValue = args[1];
			args = [];
		} else if (args.length === 3) {
			callback = args[1];
			initialValue = args[2];
			args = [args[0]];
		} else if (args.length === 4) {
			callback = args[2];
			initialValue = args[3];
			args = [args[0], args[1]];
		}
		let accumulator = initialValue;
		args.push((e, ea, s, t, sa, ta, u) => {
			accumulator = callback(accumulator, e, ea, s, t, sa, ta, u);
		});
		this[forEachName].apply(this, args);
		return accumulator;
	};
}
/**
* Function attaching a breakable edge callback iterator method to the Graph
* prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachFindEdge(Class, description) {
	const { name, type, direction } = description;
	const findEdgeName = "find" + name[0].toUpperCase() + name.slice(1, -1);
	/**
	* Function iterating over the graph's relevant edges in order to match
	* one of them using the provided predicate function.
	*
	* Arity 1: Iterate over all the relevant edges.
	* @param  {function} callback - Callback to use.
	*
	* Arity 2: Iterate over all of a node's relevant edges.
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* Arity 3: Iterate over the relevant edges across the given path.
	* @param  {any}      source   - Source node.
	* @param  {any}      target   - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[findEdgeName] = function(source, target, callback) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return false;
		if (arguments.length === 1) {
			callback = source;
			return forEachEdge(true, this, type, callback);
		}
		if (arguments.length === 2) {
			source = "" + source;
			callback = target;
			const nodeData = this._nodes.get(source);
			if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${findEdgeName}: could not find the "${source}" node in the graph.`);
			return forEachEdgeForNode(true, this.multi, type === "mixed" ? this.type : type, direction, nodeData, callback);
		}
		if (arguments.length === 3) {
			source = "" + source;
			target = "" + target;
			const sourceData = this._nodes.get(source);
			if (!sourceData) throw new NotFoundGraphError(`Graph.${findEdgeName}:  could not find the "${source}" source node in the graph.`);
			if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.${findEdgeName}:  could not find the "${target}" target node in the graph.`);
			return forEachEdgeForPath(true, type, this.multi, direction, sourceData, target, callback);
		}
		throw new InvalidArgumentsGraphError(`Graph.${findEdgeName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`);
	};
	/**
	* Function iterating over the graph's relevant edges in order to assert
	* whether any one of them matches the provided predicate function.
	*
	* Arity 1: Iterate over all the relevant edges.
	* @param  {function} callback - Callback to use.
	*
	* Arity 2: Iterate over all of a node's relevant edges.
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* Arity 3: Iterate over the relevant edges across the given path.
	* @param  {any}      source   - Source node.
	* @param  {any}      target   - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const someName = "some" + name[0].toUpperCase() + name.slice(1, -1);
	Class.prototype[someName] = function() {
		const args = Array.prototype.slice.call(arguments);
		const callback = args.pop();
		args.push((e, ea, s, t, sa, ta, u) => {
			return callback(e, ea, s, t, sa, ta, u);
		});
		if (this[findEdgeName].apply(this, args)) return true;
		return false;
	};
	/**
	* Function iterating over the graph's relevant edges in order to assert
	* whether all of them matche the provided predicate function.
	*
	* Arity 1: Iterate over all the relevant edges.
	* @param  {function} callback - Callback to use.
	*
	* Arity 2: Iterate over all of a node's relevant edges.
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* Arity 3: Iterate over the relevant edges across the given path.
	* @param  {any}      source   - Source node.
	* @param  {any}      target   - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const everyName = "every" + name[0].toUpperCase() + name.slice(1, -1);
	Class.prototype[everyName] = function() {
		const args = Array.prototype.slice.call(arguments);
		const callback = args.pop();
		args.push((e, ea, s, t, sa, ta, u) => {
			return !callback(e, ea, s, t, sa, ta, u);
		});
		if (this[findEdgeName].apply(this, args)) return false;
		return true;
	};
}
/**
* Function attaching an edge iterator method to the Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachEdgeIteratorCreator(Class, description) {
	const { name: originalName, type, direction } = description;
	const name = originalName.slice(0, -1) + "Entries";
	/**
	* Function returning an iterator over the graph's edges.
	*
	* Arity 0: Iterate over all the relevant edges.
	*
	* Arity 1: Iterate over all of a node's relevant edges.
	* @param  {any}   node   - Target node.
	*
	* Arity 2: Iterate over the relevant edges across the given path.
	* @param  {any}   source - Source node.
	* @param  {any}   target - Target node.
	*
	* @return {array|number} - The edges or the number of edges.
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[name] = function(source, target) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return emptyIterator();
		if (!arguments.length) return createEdgeIterator(this, type);
		if (arguments.length === 1) {
			source = "" + source;
			const sourceData = this._nodes.get(source);
			if (!sourceData) throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);
			return createEdgeIteratorForNode(type, direction, sourceData);
		}
		if (arguments.length === 2) {
			source = "" + source;
			target = "" + target;
			const sourceData = this._nodes.get(source);
			if (!sourceData) throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);
			if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);
			return createEdgeIteratorForPath(type, direction, sourceData, target);
		}
		throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
	};
}
/**
* Function attaching every edge iteration method to the Graph class.
*
* @param {function} Graph - Graph class.
*/
function attachEdgeIterationMethods(Graph) {
	EDGES_ITERATION.forEach((description) => {
		attachEdgeArrayCreator(Graph, description);
		attachForEachEdge(Graph, description);
		attachFindEdge(Graph, description);
		attachEdgeIteratorCreator(Graph, description);
	});
}
/**
* Graphology Neighbor Iteration
* ==============================
*
* Attaching some methods to the Graph class to be able to iterate over
* neighbors.
*/
/**
* Definitions.
*/
const NEIGHBORS_ITERATION = [
	{
		name: "neighbors",
		type: "mixed"
	},
	{
		name: "inNeighbors",
		type: "directed",
		direction: "in"
	},
	{
		name: "outNeighbors",
		type: "directed",
		direction: "out"
	},
	{
		name: "inboundNeighbors",
		type: "mixed",
		direction: "in"
	},
	{
		name: "outboundNeighbors",
		type: "mixed",
		direction: "out"
	},
	{
		name: "directedNeighbors",
		type: "directed"
	},
	{
		name: "undirectedNeighbors",
		type: "undirected"
	}
];
/**
* Helpers.
*/
function CompositeSetWrapper() {
	this.A = null;
	this.B = null;
}
CompositeSetWrapper.prototype.wrap = function(set) {
	if (this.A === null) this.A = set;
	else if (this.B === null) this.B = set;
};
CompositeSetWrapper.prototype.has = function(key) {
	if (this.A !== null && key in this.A) return true;
	if (this.B !== null && key in this.B) return true;
	return false;
};
/**
* Function iterating over the given node's relevant neighbors to match
* one of them using a predicated function.
*
* @param  {string}   type      - Type of neighbors.
* @param  {string}   direction - Direction.
* @param  {any}      nodeData  - Target node's data.
* @param  {function} callback  - Callback to use.
*/
function forEachInObjectOnce(breakable, visited, nodeData, object, callback) {
	for (const k in object) {
		const edgeData = object[k];
		const sourceData = edgeData.source;
		const targetData = edgeData.target;
		const neighborData = sourceData === nodeData ? targetData : sourceData;
		if (visited && visited.has(neighborData.key)) continue;
		const shouldBreak = callback(neighborData.key, neighborData.attributes);
		if (breakable && shouldBreak) return neighborData.key;
	}
}
function forEachNeighbor(breakable, type, direction, nodeData, callback) {
	if (type !== "mixed") {
		if (type === "undirected") return forEachInObjectOnce(breakable, null, nodeData, nodeData.undirected, callback);
		if (typeof direction === "string") return forEachInObjectOnce(breakable, null, nodeData, nodeData[direction], callback);
	}
	const visited = new CompositeSetWrapper();
	let found;
	if (type !== "undirected") {
		if (direction !== "out") {
			found = forEachInObjectOnce(breakable, null, nodeData, nodeData.in, callback);
			if (breakable && found) return found;
			visited.wrap(nodeData.in);
		}
		if (direction !== "in") {
			found = forEachInObjectOnce(breakable, visited, nodeData, nodeData.out, callback);
			if (breakable && found) return found;
			visited.wrap(nodeData.out);
		}
	}
	if (type !== "directed") {
		found = forEachInObjectOnce(breakable, visited, nodeData, nodeData.undirected, callback);
		if (breakable && found) return found;
	}
}
/**
* Function creating an array of relevant neighbors for the given node.
*
* @param  {string}       type      - Type of neighbors.
* @param  {string}       direction - Direction.
* @param  {any}          nodeData  - Target node's data.
* @return {Array}                  - The list of neighbors.
*/
function createNeighborArrayForNode(type, direction, nodeData) {
	if (type !== "mixed") {
		if (type === "undirected") return Object.keys(nodeData.undirected);
		if (typeof direction === "string") return Object.keys(nodeData[direction]);
	}
	const neighbors = [];
	forEachNeighbor(false, type, direction, nodeData, function(key) {
		neighbors.push(key);
	});
	return neighbors;
}
/**
* Function returning an iterator over the given node's relevant neighbors.
*
* @param  {string}   type      - Type of neighbors.
* @param  {string}   direction - Direction.
* @param  {any}      nodeData  - Target node's data.
* @return {Iterator}
*/
function createDedupedObjectIterator(visited, nodeData, object) {
	const keys = Object.keys(object);
	const l = keys.length;
	let i = 0;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			let neighborData = null;
			do {
				if (i >= l) {
					if (visited) visited.wrap(object);
					return { done: true };
				}
				const edgeData = object[keys[i++]];
				const sourceData = edgeData.source;
				const targetData = edgeData.target;
				neighborData = sourceData === nodeData ? targetData : sourceData;
				if (visited && visited.has(neighborData.key)) {
					neighborData = null;
					continue;
				}
			} while (neighborData === null);
			return {
				done: false,
				value: {
					neighbor: neighborData.key,
					attributes: neighborData.attributes
				}
			};
		}
	};
}
function createNeighborIterator(type, direction, nodeData) {
	if (type !== "mixed") {
		if (type === "undirected") return createDedupedObjectIterator(null, nodeData, nodeData.undirected);
		if (typeof direction === "string") return createDedupedObjectIterator(null, nodeData, nodeData[direction]);
	}
	let iterator = emptyIterator();
	const visited = new CompositeSetWrapper();
	if (type !== "undirected") {
		if (direction !== "out") iterator = chain(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.in));
		if (direction !== "in") iterator = chain(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.out));
	}
	if (type !== "directed") iterator = chain(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.undirected));
	return iterator;
}
/**
* Function attaching a neighbors array creator method to the Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachNeighborArrayCreator(Class, description) {
	const { name, type, direction } = description;
	/**
	* Function returning an array of certain neighbors.
	*
	* @param  {any}   node   - Target node.
	* @return {array} - The neighbors of neighbors.
	*
	* @throws {Error} - Will throw if node is not found in the graph.
	*/
	Class.prototype[name] = function(node) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return [];
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${name}: could not find the "${node}" node in the graph.`);
		return createNeighborArrayForNode(type === "mixed" ? this.type : type, direction, nodeData);
	};
}
/**
* Function attaching a neighbors callback iterator method to the Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachForEachNeighbor(Class, description) {
	const { name, type, direction } = description;
	const forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
	/**
	* Function iterating over all the relevant neighbors using a callback.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[forEachName] = function(node, callback) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return;
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${forEachName}: could not find the "${node}" node in the graph.`);
		forEachNeighbor(false, type === "mixed" ? this.type : type, direction, nodeData, callback);
	};
	/**
	* Function mapping the relevant neighbors using a callback.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const mapName = "map" + name[0].toUpperCase() + name.slice(1);
	Class.prototype[mapName] = function(node, callback) {
		const result = [];
		this[forEachName](node, (n, a) => {
			result.push(callback(n, a));
		});
		return result;
	};
	/**
	* Function filtering the relevant neighbors using a callback.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const filterName = "filter" + name[0].toUpperCase() + name.slice(1);
	Class.prototype[filterName] = function(node, callback) {
		const result = [];
		this[forEachName](node, (n, a) => {
			if (callback(n, a)) result.push(n);
		});
		return result;
	};
	/**
	* Function reducing the relevant neighbors using a callback.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const reduceName = "reduce" + name[0].toUpperCase() + name.slice(1);
	Class.prototype[reduceName] = function(node, callback, initialValue) {
		if (arguments.length < 3) throw new InvalidArgumentsGraphError(`Graph.${reduceName}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);
		let accumulator = initialValue;
		this[forEachName](node, (n, a) => {
			accumulator = callback(accumulator, n, a);
		});
		return accumulator;
	};
}
/**
* Function attaching a breakable neighbors callback iterator method to the
* Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachFindNeighbor(Class, description) {
	const { name, type, direction } = description;
	const capitalizedSingular = name[0].toUpperCase() + name.slice(1, -1);
	const findName = "find" + capitalizedSingular;
	/**
	* Function iterating over all the relevant neighbors using a callback.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	* @return {undefined}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[findName] = function(node, callback) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return;
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${findName}: could not find the "${node}" node in the graph.`);
		return forEachNeighbor(true, type === "mixed" ? this.type : type, direction, nodeData, callback);
	};
	/**
	* Function iterating over all the relevant neighbors to find if any of them
	* matches the given predicate.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const someName = "some" + capitalizedSingular;
	Class.prototype[someName] = function(node, callback) {
		if (this[findName](node, callback)) return true;
		return false;
	};
	/**
	* Function iterating over all the relevant neighbors to find if all of them
	* matche the given predicate.
	*
	* @param  {any}      node     - Target node.
	* @param  {function} callback - Callback to use.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	const everyName = "every" + capitalizedSingular;
	Class.prototype[everyName] = function(node, callback) {
		if (this[findName](node, (n, a) => {
			return !callback(n, a);
		})) return false;
		return true;
	};
}
/**
* Function attaching a neighbors callback iterator method to the Graph prototype.
*
* @param {function} Class       - Target class.
* @param {object}   description - Method description.
*/
function attachNeighborIteratorCreator(Class, description) {
	const { name, type, direction } = description;
	const iteratorName = name.slice(0, -1) + "Entries";
	/**
	* Function returning an iterator over all the relevant neighbors.
	*
	* @param  {any}      node     - Target node.
	* @return {Iterator}
	*
	* @throws {Error} - Will throw if there are too many arguments.
	*/
	Class.prototype[iteratorName] = function(node) {
		if (type !== "mixed" && this.type !== "mixed" && type !== this.type) return emptyIterator();
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (typeof nodeData === "undefined") throw new NotFoundGraphError(`Graph.${iteratorName}: could not find the "${node}" node in the graph.`);
		return createNeighborIterator(type === "mixed" ? this.type : type, direction, nodeData);
	};
}
/**
* Function attaching every neighbor iteration method to the Graph class.
*
* @param {function} Graph - Graph class.
*/
function attachNeighborIterationMethods(Graph) {
	NEIGHBORS_ITERATION.forEach((description) => {
		attachNeighborArrayCreator(Graph, description);
		attachForEachNeighbor(Graph, description);
		attachFindNeighbor(Graph, description);
		attachNeighborIteratorCreator(Graph, description);
	});
}
/**
* Graphology Adjacency Iteration
* ===============================
*
* Attaching some methods to the Graph class to be able to iterate over a
* graph's adjacency.
*/
/**
* Function iterating over a simple graph's adjacency using a callback.
*
* @param {boolean}  breakable         - Can we break?
* @param {boolean}  assymetric        - Whether to emit undirected edges only once.
* @param {boolean}  disconnectedNodes - Whether to emit disconnected nodes.
* @param {Graph}    graph             - Target Graph instance.
* @param {callback} function          - Iteration callback.
*/
function forEachAdjacency(breakable, assymetric, disconnectedNodes, graph, callback) {
	const iterator = graph._nodes.values();
	const type = graph.type;
	let step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;
	while (step = iterator.next(), step.done !== true) {
		let hasEdges = false;
		sourceData = step.value;
		if (type !== "undirected") {
			adj = sourceData.out;
			for (neighbor in adj) {
				edgeData = adj[neighbor];
				do {
					targetData = edgeData.target;
					hasEdges = true;
					shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
					if (breakable && shouldBreak) return edgeData;
					edgeData = edgeData.next;
				} while (edgeData);
			}
		}
		if (type !== "directed") {
			adj = sourceData.undirected;
			for (neighbor in adj) {
				if (assymetric && sourceData.key > neighbor) continue;
				edgeData = adj[neighbor];
				do {
					targetData = edgeData.target;
					if (targetData.key !== neighbor) targetData = edgeData.source;
					hasEdges = true;
					shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
					if (breakable && shouldBreak) return edgeData;
					edgeData = edgeData.next;
				} while (edgeData);
			}
		}
		if (disconnectedNodes && !hasEdges) {
			shouldBreak = callback(sourceData.key, null, sourceData.attributes, null, null, null, null);
			if (breakable && shouldBreak) return null;
		}
	}
}
/**
* Graphology Serialization Utilities
* ===================================
*
* Collection of functions used by the graph serialization schemes.
*/
/**
* Formats internal node data into a serialized node.
*
* @param  {any}    key  - The node's key.
* @param  {object} data - Internal node's data.
* @return {array}       - The serialized node.
*/
function serializeNode(key, data) {
	const serialized = { key };
	if (!isEmpty(data.attributes)) serialized.attributes = assign({}, data.attributes);
	return serialized;
}
/**
* Formats internal edge data into a serialized edge.
*
* @param  {string} type - The graph's type.
* @param  {any}    key  - The edge's key.
* @param  {object} data - Internal edge's data.
* @return {array}       - The serialized edge.
*/
function serializeEdge(type, key, data) {
	const serialized = {
		key,
		source: data.source.key,
		target: data.target.key
	};
	if (!isEmpty(data.attributes)) serialized.attributes = assign({}, data.attributes);
	if (type === "mixed" && data.undirected) serialized.undirected = true;
	return serialized;
}
/**
* Checks whether the given value is a serialized node.
*
* @param  {mixed} value - Target value.
* @return {string|null}
*/
function validateSerializedNode(value) {
	if (!isPlainObject(value)) throw new InvalidArgumentsGraphError("Graph.import: invalid serialized node. A serialized node should be a plain object with at least a \"key\" property.");
	if (!("key" in value)) throw new InvalidArgumentsGraphError("Graph.import: serialized node is missing its key.");
	if ("attributes" in value && (!isPlainObject(value.attributes) || value.attributes === null)) throw new InvalidArgumentsGraphError("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
}
/**
* Checks whether the given value is a serialized edge.
*
* @param  {mixed} value - Target value.
* @return {string|null}
*/
function validateSerializedEdge(value) {
	if (!isPlainObject(value)) throw new InvalidArgumentsGraphError("Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a \"source\" & \"target\" property.");
	if (!("source" in value)) throw new InvalidArgumentsGraphError("Graph.import: serialized edge is missing its source.");
	if (!("target" in value)) throw new InvalidArgumentsGraphError("Graph.import: serialized edge is missing its target.");
	if ("attributes" in value && (!isPlainObject(value.attributes) || value.attributes === null)) throw new InvalidArgumentsGraphError("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
	if ("undirected" in value && typeof value.undirected !== "boolean") throw new InvalidArgumentsGraphError("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.");
}
/**
* Constants.
*/
const INSTANCE_ID = incrementalIdStartingFromRandomByte();
/**
* Enums.
*/
const TYPES = /* @__PURE__ */ new Set([
	"directed",
	"undirected",
	"mixed"
]);
const EMITTER_PROPS = /* @__PURE__ */ new Set([
	"domain",
	"_events",
	"_eventsCount",
	"_maxListeners"
]);
const EDGE_ADD_METHODS = [
	{
		name: (verb) => `${verb}Edge`,
		generateKey: true
	},
	{
		name: (verb) => `${verb}DirectedEdge`,
		generateKey: true,
		type: "directed"
	},
	{
		name: (verb) => `${verb}UndirectedEdge`,
		generateKey: true,
		type: "undirected"
	},
	{ name: (verb) => `${verb}EdgeWithKey` },
	{
		name: (verb) => `${verb}DirectedEdgeWithKey`,
		type: "directed"
	},
	{
		name: (verb) => `${verb}UndirectedEdgeWithKey`,
		type: "undirected"
	}
];
/**
* Default options.
*/
const DEFAULTS = {
	allowSelfLoops: true,
	multi: false,
	type: "mixed"
};
/**
* Abstract functions used by the Graph class for various methods.
*/
/**
* Internal method used to add a node to the given graph
*
* @param  {Graph}   graph           - Target graph.
* @param  {any}     node            - The node's key.
* @param  {object}  [attributes]    - Optional attributes.
* @return {NodeData}                - Created node data.
*/
function addNode(graph, node, attributes) {
	if (attributes && !isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`);
	node = "" + node;
	attributes = attributes || {};
	if (graph._nodes.has(node)) throw new UsageGraphError(`Graph.addNode: the "${node}" node already exist in the graph.`);
	const data = new graph.NodeDataClass(node, attributes);
	graph._nodes.set(node, data);
	graph.emit("nodeAdded", {
		key: node,
		attributes
	});
	return data;
}
/**
* Same as the above but without sanity checks because we call this in contexts
* where necessary checks were already done.
*/
function unsafeAddNode(graph, node, attributes) {
	const data = new graph.NodeDataClass(node, attributes);
	graph._nodes.set(node, data);
	graph.emit("nodeAdded", {
		key: node,
		attributes
	});
	return data;
}
/**
* Internal method used to add an arbitrary edge to the given graph.
*
* @param  {Graph}   graph           - Target graph.
* @param  {string}  name            - Name of the child method for errors.
* @param  {boolean} mustGenerateKey - Should the graph generate an id?
* @param  {boolean} undirected      - Whether the edge is undirected.
* @param  {any}     edge            - The edge's key.
* @param  {any}     source          - The source node.
* @param  {any}     target          - The target node.
* @param  {object}  [attributes]    - Optional attributes.
* @return {any}                     - The edge.
*
* @throws {Error} - Will throw if the graph is of the wrong type.
* @throws {Error} - Will throw if the given attributes are not an object.
* @throws {Error} - Will throw if source or target doesn't exist.
* @throws {Error} - Will throw if the edge already exist.
*/
function addEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {
	if (!undirected && graph.type === "undirected") throw new UsageGraphError(`Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);
	if (undirected && graph.type === "directed") throw new UsageGraphError(`Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);
	if (attributes && !isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`);
	source = "" + source;
	target = "" + target;
	attributes = attributes || {};
	if (!graph.allowSelfLoops && source === target) throw new UsageGraphError(`Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);
	const sourceData = graph._nodes.get(source), targetData = graph._nodes.get(target);
	if (!sourceData) throw new NotFoundGraphError(`Graph.${name}: source node "${source}" not found.`);
	if (!targetData) throw new NotFoundGraphError(`Graph.${name}: target node "${target}" not found.`);
	const eventData = {
		key: null,
		undirected,
		source,
		target,
		attributes
	};
	if (mustGenerateKey) edge = graph._edgeKeyGenerator();
	else {
		edge = "" + edge;
		if (graph._edges.has(edge)) throw new UsageGraphError(`Graph.${name}: the "${edge}" edge already exists in the graph.`);
	}
	if (!graph.multi && (undirected ? typeof sourceData.undirected[target] !== "undefined" : typeof sourceData.out[target] !== "undefined")) throw new UsageGraphError(`Graph.${name}: an edge linking "${source}" to "${target}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);
	const edgeData = new EdgeData(undirected, edge, sourceData, targetData, attributes);
	graph._edges.set(edge, edgeData);
	const isSelfLoop = source === target;
	if (undirected) {
		sourceData.undirectedDegree++;
		targetData.undirectedDegree++;
		if (isSelfLoop) {
			sourceData.undirectedLoops++;
			graph._undirectedSelfLoopCount++;
		}
	} else {
		sourceData.outDegree++;
		targetData.inDegree++;
		if (isSelfLoop) {
			sourceData.directedLoops++;
			graph._directedSelfLoopCount++;
		}
	}
	if (graph.multi) edgeData.attachMulti();
	else edgeData.attach();
	if (undirected) graph._undirectedSize++;
	else graph._directedSize++;
	eventData.key = edge;
	graph.emit("edgeAdded", eventData);
	return edge;
}
/**
* Internal method used to add an arbitrary edge to the given graph.
*
* @param  {Graph}   graph           - Target graph.
* @param  {string}  name            - Name of the child method for errors.
* @param  {boolean} mustGenerateKey - Should the graph generate an id?
* @param  {boolean} undirected      - Whether the edge is undirected.
* @param  {any}     edge            - The edge's key.
* @param  {any}     source          - The source node.
* @param  {any}     target          - The target node.
* @param  {object}  [attributes]    - Optional attributes.
* @param  {boolean} [asUpdater]       - Are we updating or merging?
* @return {any}                     - The edge.
*
* @throws {Error} - Will throw if the graph is of the wrong type.
* @throws {Error} - Will throw if the given attributes are not an object.
* @throws {Error} - Will throw if source or target doesn't exist.
* @throws {Error} - Will throw if the edge already exist.
*/
function mergeEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes, asUpdater) {
	if (!undirected && graph.type === "undirected") throw new UsageGraphError(`Graph.${name}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`);
	if (undirected && graph.type === "directed") throw new UsageGraphError(`Graph.${name}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`);
	if (attributes) {
		if (asUpdater) {
			if (typeof attributes !== "function") throw new InvalidArgumentsGraphError(`Graph.${name}: invalid updater function. Expecting a function but got "${attributes}"`);
		} else if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`);
	}
	source = "" + source;
	target = "" + target;
	let updater;
	if (asUpdater) {
		updater = attributes;
		attributes = void 0;
	}
	if (!graph.allowSelfLoops && source === target) throw new UsageGraphError(`Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);
	let sourceData = graph._nodes.get(source);
	let targetData = graph._nodes.get(target);
	let edgeData;
	let alreadyExistingEdgeData;
	if (!mustGenerateKey) {
		edgeData = graph._edges.get(edge);
		if (edgeData) {
			if (edgeData.source.key !== source || edgeData.target.key !== target) {
				if (!undirected || edgeData.source.key !== target || edgeData.target.key !== source) throw new UsageGraphError(`Graph.${name}: inconsistency detected when attempting to merge the "${edge}" edge with "${source}" source & "${target}" target vs. ("${edgeData.source.key}", "${edgeData.target.key}").`);
			}
			alreadyExistingEdgeData = edgeData;
		}
	}
	if (!alreadyExistingEdgeData && !graph.multi && sourceData) alreadyExistingEdgeData = undirected ? sourceData.undirected[target] : sourceData.out[target];
	if (alreadyExistingEdgeData) {
		const info = [
			alreadyExistingEdgeData.key,
			false,
			false,
			false
		];
		if (asUpdater ? !updater : !attributes) return info;
		if (asUpdater) {
			const oldAttributes = alreadyExistingEdgeData.attributes;
			alreadyExistingEdgeData.attributes = updater(oldAttributes);
			graph.emit("edgeAttributesUpdated", {
				type: "replace",
				key: alreadyExistingEdgeData.key,
				attributes: alreadyExistingEdgeData.attributes
			});
		} else {
			assign(alreadyExistingEdgeData.attributes, attributes);
			graph.emit("edgeAttributesUpdated", {
				type: "merge",
				key: alreadyExistingEdgeData.key,
				attributes: alreadyExistingEdgeData.attributes,
				data: attributes
			});
		}
		return info;
	}
	attributes = attributes || {};
	if (asUpdater && updater) attributes = updater(attributes);
	const eventData = {
		key: null,
		undirected,
		source,
		target,
		attributes
	};
	if (mustGenerateKey) edge = graph._edgeKeyGenerator();
	else {
		edge = "" + edge;
		if (graph._edges.has(edge)) throw new UsageGraphError(`Graph.${name}: the "${edge}" edge already exists in the graph.`);
	}
	let sourceWasAdded = false;
	let targetWasAdded = false;
	if (!sourceData) {
		sourceData = unsafeAddNode(graph, source, {});
		sourceWasAdded = true;
		if (source === target) {
			targetData = sourceData;
			targetWasAdded = true;
		}
	}
	if (!targetData) {
		targetData = unsafeAddNode(graph, target, {});
		targetWasAdded = true;
	}
	edgeData = new EdgeData(undirected, edge, sourceData, targetData, attributes);
	graph._edges.set(edge, edgeData);
	const isSelfLoop = source === target;
	if (undirected) {
		sourceData.undirectedDegree++;
		targetData.undirectedDegree++;
		if (isSelfLoop) {
			sourceData.undirectedLoops++;
			graph._undirectedSelfLoopCount++;
		}
	} else {
		sourceData.outDegree++;
		targetData.inDegree++;
		if (isSelfLoop) {
			sourceData.directedLoops++;
			graph._directedSelfLoopCount++;
		}
	}
	if (graph.multi) edgeData.attachMulti();
	else edgeData.attach();
	if (undirected) graph._undirectedSize++;
	else graph._directedSize++;
	eventData.key = edge;
	graph.emit("edgeAdded", eventData);
	return [
		edge,
		true,
		sourceWasAdded,
		targetWasAdded
	];
}
/**
* Internal method used to drop an edge.
*
* @param  {Graph}    graph    - Target graph.
* @param  {EdgeData} edgeData - Data of the edge to drop.
*/
function dropEdgeFromData(graph, edgeData) {
	graph._edges.delete(edgeData.key);
	const { source: sourceData, target: targetData, attributes } = edgeData;
	const undirected = edgeData.undirected;
	const isSelfLoop = sourceData === targetData;
	if (undirected) {
		sourceData.undirectedDegree--;
		targetData.undirectedDegree--;
		if (isSelfLoop) {
			sourceData.undirectedLoops--;
			graph._undirectedSelfLoopCount--;
		}
	} else {
		sourceData.outDegree--;
		targetData.inDegree--;
		if (isSelfLoop) {
			sourceData.directedLoops--;
			graph._directedSelfLoopCount--;
		}
	}
	if (graph.multi) edgeData.detachMulti();
	else edgeData.detach();
	if (undirected) graph._undirectedSize--;
	else graph._directedSize--;
	graph.emit("edgeDropped", {
		key: edgeData.key,
		attributes,
		source: sourceData.key,
		target: targetData.key,
		undirected
	});
}
/**
* Graph class
*
* @constructor
* @param  {object}  [options] - Options:
* @param  {boolean}   [allowSelfLoops] - Allow self loops?
* @param  {string}    [type]           - Type of the graph.
* @param  {boolean}   [map]            - Allow references as keys?
* @param  {boolean}   [multi]          - Allow parallel edges?
*
* @throws {Error} - Will throw if the arguments are not valid.
*/
var Graph = class Graph extends import_events.EventEmitter {
	constructor(options) {
		super();
		options = assign({}, DEFAULTS, options);
		if (typeof options.multi !== "boolean") throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${options.multi}".`);
		if (!TYPES.has(options.type)) throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${options.type}".`);
		if (typeof options.allowSelfLoops !== "boolean") throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${options.allowSelfLoops}".`);
		const NodeDataClass = options.type === "mixed" ? MixedNodeData : options.type === "directed" ? DirectedNodeData : UndirectedNodeData;
		privateProperty(this, "NodeDataClass", NodeDataClass);
		const instancePrefix = "geid_" + INSTANCE_ID() + "_";
		let edgeId = 0;
		const edgeKeyGenerator = () => {
			let availableEdgeKey;
			do
				availableEdgeKey = instancePrefix + edgeId++;
			while (this._edges.has(availableEdgeKey));
			return availableEdgeKey;
		};
		privateProperty(this, "_attributes", {});
		privateProperty(this, "_nodes", /* @__PURE__ */ new Map());
		privateProperty(this, "_edges", /* @__PURE__ */ new Map());
		privateProperty(this, "_directedSize", 0);
		privateProperty(this, "_undirectedSize", 0);
		privateProperty(this, "_directedSelfLoopCount", 0);
		privateProperty(this, "_undirectedSelfLoopCount", 0);
		privateProperty(this, "_edgeKeyGenerator", edgeKeyGenerator);
		privateProperty(this, "_options", options);
		EMITTER_PROPS.forEach((prop) => privateProperty(this, prop, this[prop]));
		readOnlyProperty(this, "order", () => this._nodes.size);
		readOnlyProperty(this, "size", () => this._edges.size);
		readOnlyProperty(this, "directedSize", () => this._directedSize);
		readOnlyProperty(this, "undirectedSize", () => this._undirectedSize);
		readOnlyProperty(this, "selfLoopCount", () => this._directedSelfLoopCount + this._undirectedSelfLoopCount);
		readOnlyProperty(this, "directedSelfLoopCount", () => this._directedSelfLoopCount);
		readOnlyProperty(this, "undirectedSelfLoopCount", () => this._undirectedSelfLoopCount);
		readOnlyProperty(this, "multi", this._options.multi);
		readOnlyProperty(this, "type", this._options.type);
		readOnlyProperty(this, "allowSelfLoops", this._options.allowSelfLoops);
		readOnlyProperty(this, "implementation", () => "graphology");
	}
	_resetInstanceCounters() {
		this._directedSize = 0;
		this._undirectedSize = 0;
		this._directedSelfLoopCount = 0;
		this._undirectedSelfLoopCount = 0;
	}
	/**---------------------------------------------------------------------------
	* Read
	**---------------------------------------------------------------------------
	*/
	/**
	* Method returning whether the given node is found in the graph.
	*
	* @param  {any}     node - The node.
	* @return {boolean}
	*/
	hasNode(node) {
		return this._nodes.has("" + node);
	}
	/**
	* Method returning whether the given directed edge is found in the graph.
	*
	* Arity 1:
	* @param  {any}     edge - The edge's key.
	*
	* Arity 2:
	* @param  {any}     source - The edge's source.
	* @param  {any}     target - The edge's target.
	*
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the arguments are invalid.
	*/
	hasDirectedEdge(source, target) {
		if (this.type === "undirected") return false;
		if (arguments.length === 1) {
			const edge = "" + source;
			const edgeData = this._edges.get(edge);
			return !!edgeData && !edgeData.undirected;
		} else if (arguments.length === 2) {
			source = "" + source;
			target = "" + target;
			const nodeData = this._nodes.get(source);
			if (!nodeData) return false;
			return nodeData.out.hasOwnProperty(target);
		}
		throw new InvalidArgumentsGraphError(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
	}
	/**
	* Method returning whether the given undirected edge is found in the graph.
	*
	* Arity 1:
	* @param  {any}     edge - The edge's key.
	*
	* Arity 2:
	* @param  {any}     source - The edge's source.
	* @param  {any}     target - The edge's target.
	*
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the arguments are invalid.
	*/
	hasUndirectedEdge(source, target) {
		if (this.type === "directed") return false;
		if (arguments.length === 1) {
			const edge = "" + source;
			const edgeData = this._edges.get(edge);
			return !!edgeData && edgeData.undirected;
		} else if (arguments.length === 2) {
			source = "" + source;
			target = "" + target;
			const nodeData = this._nodes.get(source);
			if (!nodeData) return false;
			return nodeData.undirected.hasOwnProperty(target);
		}
		throw new InvalidArgumentsGraphError(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
	}
	/**
	* Method returning whether the given edge is found in the graph.
	*
	* Arity 1:
	* @param  {any}     edge - The edge's key.
	*
	* Arity 2:
	* @param  {any}     source - The edge's source.
	* @param  {any}     target - The edge's target.
	*
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the arguments are invalid.
	*/
	hasEdge(source, target) {
		if (arguments.length === 1) {
			const edge = "" + source;
			return this._edges.has(edge);
		} else if (arguments.length === 2) {
			source = "" + source;
			target = "" + target;
			const nodeData = this._nodes.get(source);
			if (!nodeData) return false;
			return typeof nodeData.out !== "undefined" && nodeData.out.hasOwnProperty(target) || typeof nodeData.undirected !== "undefined" && nodeData.undirected.hasOwnProperty(target);
		}
		throw new InvalidArgumentsGraphError(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
	}
	/**
	* Method returning the edge matching source & target in a directed fashion.
	*
	* @param  {any} source - The edge's source.
	* @param  {any} target - The edge's target.
	*
	* @return {any|undefined}
	*
	* @throws {Error} - Will throw if the graph is multi.
	* @throws {Error} - Will throw if source or target doesn't exist.
	*/
	directedEdge(source, target) {
		if (this.type === "undirected") return;
		source = "" + source;
		target = "" + target;
		if (this.multi) throw new UsageGraphError("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");
		const sourceData = this._nodes.get(source);
		if (!sourceData) throw new NotFoundGraphError(`Graph.directedEdge: could not find the "${source}" source node in the graph.`);
		if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.directedEdge: could not find the "${target}" target node in the graph.`);
		const edgeData = sourceData.out && sourceData.out[target] || void 0;
		if (edgeData) return edgeData.key;
	}
	/**
	* Method returning the edge matching source & target in a undirected fashion.
	*
	* @param  {any} source - The edge's source.
	* @param  {any} target - The edge's target.
	*
	* @return {any|undefined}
	*
	* @throws {Error} - Will throw if the graph is multi.
	* @throws {Error} - Will throw if source or target doesn't exist.
	*/
	undirectedEdge(source, target) {
		if (this.type === "directed") return;
		source = "" + source;
		target = "" + target;
		if (this.multi) throw new UsageGraphError("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");
		const sourceData = this._nodes.get(source);
		if (!sourceData) throw new NotFoundGraphError(`Graph.undirectedEdge: could not find the "${source}" source node in the graph.`);
		if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.undirectedEdge: could not find the "${target}" target node in the graph.`);
		const edgeData = sourceData.undirected && sourceData.undirected[target] || void 0;
		if (edgeData) return edgeData.key;
	}
	/**
	* Method returning the edge matching source & target in a mixed fashion.
	*
	* @param  {any} source - The edge's source.
	* @param  {any} target - The edge's target.
	*
	* @return {any|undefined}
	*
	* @throws {Error} - Will throw if the graph is multi.
	* @throws {Error} - Will throw if source or target doesn't exist.
	*/
	edge(source, target) {
		if (this.multi) throw new UsageGraphError("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");
		source = "" + source;
		target = "" + target;
		const sourceData = this._nodes.get(source);
		if (!sourceData) throw new NotFoundGraphError(`Graph.edge: could not find the "${source}" source node in the graph.`);
		if (!this._nodes.has(target)) throw new NotFoundGraphError(`Graph.edge: could not find the "${target}" target node in the graph.`);
		const edgeData = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target] || void 0;
		if (edgeData) return edgeData.key;
	}
	/**
	* Method returning whether two nodes are directed neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areDirectedNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areDirectedNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return false;
		return neighbor in nodeData.in || neighbor in nodeData.out;
	}
	/**
	* Method returning whether two nodes are out neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areOutNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areOutNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return false;
		return neighbor in nodeData.out;
	}
	/**
	* Method returning whether two nodes are in neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areInNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areInNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return false;
		return neighbor in nodeData.in;
	}
	/**
	* Method returning whether two nodes are undirected neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areUndirectedNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areUndirectedNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type === "directed") return false;
		return neighbor in nodeData.undirected;
	}
	/**
	* Method returning whether two nodes are neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type !== "undirected") {
			if (neighbor in nodeData.in || neighbor in nodeData.out) return true;
		}
		if (this.type !== "directed") {
			if (neighbor in nodeData.undirected) return true;
		}
		return false;
	}
	/**
	* Method returning whether two nodes are inbound neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areInboundNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areInboundNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type !== "undirected") {
			if (neighbor in nodeData.in) return true;
		}
		if (this.type !== "directed") {
			if (neighbor in nodeData.undirected) return true;
		}
		return false;
	}
	/**
	* Method returning whether two nodes are outbound neighbors.
	*
	* @param  {any}     node     - The node's key.
	* @param  {any}     neighbor - The neighbor's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	areOutboundNeighbors(node, neighbor) {
		node = "" + node;
		neighbor = "" + neighbor;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.areOutboundNeighbors: could not find the "${node}" node in the graph.`);
		if (this.type !== "undirected") {
			if (neighbor in nodeData.out) return true;
		}
		if (this.type !== "directed") {
			if (neighbor in nodeData.undirected) return true;
		}
		return false;
	}
	/**
	* Method returning the given node's in degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	inDegree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.inDegree: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return 0;
		return nodeData.inDegree;
	}
	/**
	* Method returning the given node's out degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	outDegree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.outDegree: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return 0;
		return nodeData.outDegree;
	}
	/**
	* Method returning the given node's directed degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	directedDegree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.directedDegree: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return 0;
		return nodeData.inDegree + nodeData.outDegree;
	}
	/**
	* Method returning the given node's undirected degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	undirectedDegree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.undirectedDegree: could not find the "${node}" node in the graph.`);
		if (this.type === "directed") return 0;
		return nodeData.undirectedDegree;
	}
	/**
	* Method returning the given node's inbound degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's inbound degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	inboundDegree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.inboundDegree: could not find the "${node}" node in the graph.`);
		let degree = 0;
		if (this.type !== "directed") degree += nodeData.undirectedDegree;
		if (this.type !== "undirected") degree += nodeData.inDegree;
		return degree;
	}
	/**
	* Method returning the given node's outbound degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's outbound degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	outboundDegree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.outboundDegree: could not find the "${node}" node in the graph.`);
		let degree = 0;
		if (this.type !== "directed") degree += nodeData.undirectedDegree;
		if (this.type !== "undirected") degree += nodeData.outDegree;
		return degree;
	}
	/**
	* Method returning the given node's directed degree.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	degree(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.degree: could not find the "${node}" node in the graph.`);
		let degree = 0;
		if (this.type !== "directed") degree += nodeData.undirectedDegree;
		if (this.type !== "undirected") degree += nodeData.inDegree + nodeData.outDegree;
		return degree;
	}
	/**
	* Method returning the given node's in degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	inDegreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.inDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return 0;
		return nodeData.inDegree - nodeData.directedLoops;
	}
	/**
	* Method returning the given node's out degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	outDegreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.outDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return 0;
		return nodeData.outDegree - nodeData.directedLoops;
	}
	/**
	* Method returning the given node's directed degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	directedDegreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.directedDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		if (this.type === "undirected") return 0;
		return nodeData.inDegree + nodeData.outDegree - nodeData.directedLoops * 2;
	}
	/**
	* Method returning the given node's undirected degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's in degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	undirectedDegreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.undirectedDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		if (this.type === "directed") return 0;
		return nodeData.undirectedDegree - nodeData.undirectedLoops * 2;
	}
	/**
	* Method returning the given node's inbound degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's inbound degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	inboundDegreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.inboundDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		let degree = 0;
		let loops = 0;
		if (this.type !== "directed") {
			degree += nodeData.undirectedDegree;
			loops += nodeData.undirectedLoops * 2;
		}
		if (this.type !== "undirected") {
			degree += nodeData.inDegree;
			loops += nodeData.directedLoops;
		}
		return degree - loops;
	}
	/**
	* Method returning the given node's outbound degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's outbound degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	outboundDegreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.outboundDegreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		let degree = 0;
		let loops = 0;
		if (this.type !== "directed") {
			degree += nodeData.undirectedDegree;
			loops += nodeData.undirectedLoops * 2;
		}
		if (this.type !== "undirected") {
			degree += nodeData.outDegree;
			loops += nodeData.directedLoops;
		}
		return degree - loops;
	}
	/**
	* Method returning the given node's directed degree without considering self loops.
	*
	* @param  {any}     node - The node's key.
	* @return {number}       - The node's degree.
	*
	* @throws {Error} - Will throw if the node isn't in the graph.
	*/
	degreeWithoutSelfLoops(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.degreeWithoutSelfLoops: could not find the "${node}" node in the graph.`);
		let degree = 0;
		let loops = 0;
		if (this.type !== "directed") {
			degree += nodeData.undirectedDegree;
			loops += nodeData.undirectedLoops * 2;
		}
		if (this.type !== "undirected") {
			degree += nodeData.inDegree + nodeData.outDegree;
			loops += nodeData.directedLoops * 2;
		}
		return degree - loops;
	}
	/**
	* Method returning the given edge's source.
	*
	* @param  {any} edge - The edge's key.
	* @return {any}      - The edge's source.
	*
	* @throws {Error} - Will throw if the edge isn't in the graph.
	*/
	source(edge) {
		edge = "" + edge;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.source: could not find the "${edge}" edge in the graph.`);
		return data.source.key;
	}
	/**
	* Method returning the given edge's target.
	*
	* @param  {any} edge - The edge's key.
	* @return {any}      - The edge's target.
	*
	* @throws {Error} - Will throw if the edge isn't in the graph.
	*/
	target(edge) {
		edge = "" + edge;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.target: could not find the "${edge}" edge in the graph.`);
		return data.target.key;
	}
	/**
	* Method returning the given edge's extremities.
	*
	* @param  {any}   edge - The edge's key.
	* @return {array}      - The edge's extremities.
	*
	* @throws {Error} - Will throw if the edge isn't in the graph.
	*/
	extremities(edge) {
		edge = "" + edge;
		const edgeData = this._edges.get(edge);
		if (!edgeData) throw new NotFoundGraphError(`Graph.extremities: could not find the "${edge}" edge in the graph.`);
		return [edgeData.source.key, edgeData.target.key];
	}
	/**
	* Given a node & an edge, returns the other extremity of the edge.
	*
	* @param  {any}   node - The node's key.
	* @param  {any}   edge - The edge's key.
	* @return {any}        - The related node.
	*
	* @throws {Error} - Will throw if the edge isn't in the graph or if the
	*                   edge & node are not related.
	*/
	opposite(node, edge) {
		node = "" + node;
		edge = "" + edge;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.opposite: could not find the "${edge}" edge in the graph.`);
		const source = data.source.key;
		const target = data.target.key;
		if (node === source) return target;
		if (node === target) return source;
		throw new NotFoundGraphError(`Graph.opposite: the "${node}" node is not attached to the "${edge}" edge (${source}, ${target}).`);
	}
	/**
	* Returns whether the given edge has the given node as extremity.
	*
	* @param  {any}     edge - The edge's key.
	* @param  {any}     node - The node's key.
	* @return {boolean}      - The related node.
	*
	* @throws {Error} - Will throw if either the node or the edge isn't in the graph.
	*/
	hasExtremity(edge, node) {
		edge = "" + edge;
		node = "" + node;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.hasExtremity: could not find the "${edge}" edge in the graph.`);
		return data.source.key === node || data.target.key === node;
	}
	/**
	* Method returning whether the given edge is undirected.
	*
	* @param  {any}     edge - The edge's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the edge isn't in the graph.
	*/
	isUndirected(edge) {
		edge = "" + edge;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.isUndirected: could not find the "${edge}" edge in the graph.`);
		return data.undirected;
	}
	/**
	* Method returning whether the given edge is directed.
	*
	* @param  {any}     edge - The edge's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the edge isn't in the graph.
	*/
	isDirected(edge) {
		edge = "" + edge;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.isDirected: could not find the "${edge}" edge in the graph.`);
		return !data.undirected;
	}
	/**
	* Method returning whether the given edge is a self loop.
	*
	* @param  {any}     edge - The edge's key.
	* @return {boolean}
	*
	* @throws {Error} - Will throw if the edge isn't in the graph.
	*/
	isSelfLoop(edge) {
		edge = "" + edge;
		const data = this._edges.get(edge);
		if (!data) throw new NotFoundGraphError(`Graph.isSelfLoop: could not find the "${edge}" edge in the graph.`);
		return data.source === data.target;
	}
	/**---------------------------------------------------------------------------
	* Mutation
	**---------------------------------------------------------------------------
	*/
	/**
	* Method used to add a node to the graph.
	*
	* @param  {any}    node         - The node.
	* @param  {object} [attributes] - Optional attributes.
	* @return {any}                 - The node.
	*
	* @throws {Error} - Will throw if the given node already exist.
	* @throws {Error} - Will throw if the given attributes are not an object.
	*/
	addNode(node, attributes) {
		return addNode(this, node, attributes).key;
	}
	/**
	* Method used to merge a node into the graph.
	*
	* @param  {any}    node         - The node.
	* @param  {object} [attributes] - Optional attributes.
	* @return {any}                 - The node.
	*/
	mergeNode(node, attributes) {
		if (attributes && !isPlainObject(attributes)) throw new InvalidArgumentsGraphError(`Graph.mergeNode: invalid attributes. Expecting an object but got "${attributes}"`);
		node = "" + node;
		attributes = attributes || {};
		let data = this._nodes.get(node);
		if (data) {
			if (attributes) {
				assign(data.attributes, attributes);
				this.emit("nodeAttributesUpdated", {
					type: "merge",
					key: node,
					attributes: data.attributes,
					data: attributes
				});
			}
			return [node, false];
		}
		data = new this.NodeDataClass(node, attributes);
		this._nodes.set(node, data);
		this.emit("nodeAdded", {
			key: node,
			attributes
		});
		return [node, true];
	}
	/**
	* Method used to add a node if it does not exist in the graph or else to
	* update its attributes using a function.
	*
	* @param  {any}      node      - The node.
	* @param  {function} [updater] - Optional updater function.
	* @return {any}                - The node.
	*/
	updateNode(node, updater) {
		if (updater && typeof updater !== "function") throw new InvalidArgumentsGraphError(`Graph.updateNode: invalid updater function. Expecting a function but got "${updater}"`);
		node = "" + node;
		let data = this._nodes.get(node);
		if (data) {
			if (updater) {
				const oldAttributes = data.attributes;
				data.attributes = updater(oldAttributes);
				this.emit("nodeAttributesUpdated", {
					type: "replace",
					key: node,
					attributes: data.attributes
				});
			}
			return [node, false];
		}
		const attributes = updater ? updater({}) : {};
		data = new this.NodeDataClass(node, attributes);
		this._nodes.set(node, data);
		this.emit("nodeAdded", {
			key: node,
			attributes
		});
		return [node, true];
	}
	/**
	* Method used to drop a single node & all its attached edges from the graph.
	*
	* @param  {any}    node - The node.
	* @return {Graph}
	*
	* @throws {Error} - Will throw if the node doesn't exist.
	*/
	dropNode(node) {
		node = "" + node;
		const nodeData = this._nodes.get(node);
		if (!nodeData) throw new NotFoundGraphError(`Graph.dropNode: could not find the "${node}" node in the graph.`);
		let edgeData;
		if (this.type !== "undirected") {
			for (const neighbor in nodeData.out) {
				edgeData = nodeData.out[neighbor];
				do {
					dropEdgeFromData(this, edgeData);
					edgeData = edgeData.next;
				} while (edgeData);
			}
			for (const neighbor in nodeData.in) {
				edgeData = nodeData.in[neighbor];
				do {
					dropEdgeFromData(this, edgeData);
					edgeData = edgeData.next;
				} while (edgeData);
			}
		}
		if (this.type !== "directed") for (const neighbor in nodeData.undirected) {
			edgeData = nodeData.undirected[neighbor];
			do {
				dropEdgeFromData(this, edgeData);
				edgeData = edgeData.next;
			} while (edgeData);
		}
		this._nodes.delete(node);
		this.emit("nodeDropped", {
			key: node,
			attributes: nodeData.attributes
		});
	}
	/**
	* Method used to drop a single edge from the graph.
	*
	* Arity 1:
	* @param  {any}    edge - The edge.
	*
	* Arity 2:
	* @param  {any}    source - Source node.
	* @param  {any}    target - Target node.
	*
	* @return {Graph}
	*
	* @throws {Error} - Will throw if the edge doesn't exist.
	*/
	dropEdge(edge) {
		let edgeData;
		if (arguments.length > 1) {
			const source = "" + arguments[0];
			const target = "" + arguments[1];
			edgeData = getMatchingEdge(this, source, target, this.type);
			if (!edgeData) throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${source}" -> "${target}" edge in the graph.`);
		} else {
			edge = "" + edge;
			edgeData = this._edges.get(edge);
			if (!edgeData) throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${edge}" edge in the graph.`);
		}
		dropEdgeFromData(this, edgeData);
		return this;
	}
	/**
	* Method used to drop a single directed edge from the graph.
	*
	* @param  {any}    source - Source node.
	* @param  {any}    target - Target node.
	*
	* @return {Graph}
	*
	* @throws {Error} - Will throw if the edge doesn't exist.
	*/
	dropDirectedEdge(source, target) {
		if (arguments.length < 2) throw new UsageGraphError("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
		if (this.multi) throw new UsageGraphError("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
		source = "" + source;
		target = "" + target;
		const edgeData = getMatchingEdge(this, source, target, "directed");
		if (!edgeData) throw new NotFoundGraphError(`Graph.dropDirectedEdge: could not find a "${source}" -> "${target}" edge in the graph.`);
		dropEdgeFromData(this, edgeData);
		return this;
	}
	/**
	* Method used to drop a single undirected edge from the graph.
	*
	* @param  {any}    source - Source node.
	* @param  {any}    target - Target node.
	*
	* @return {Graph}
	*
	* @throws {Error} - Will throw if the edge doesn't exist.
	*/
	dropUndirectedEdge(source, target) {
		if (arguments.length < 2) throw new UsageGraphError("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
		if (this.multi) throw new UsageGraphError("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
		const edgeData = getMatchingEdge(this, source, target, "undirected");
		if (!edgeData) throw new NotFoundGraphError(`Graph.dropUndirectedEdge: could not find a "${source}" -> "${target}" edge in the graph.`);
		dropEdgeFromData(this, edgeData);
		return this;
	}
	/**
	* Method used to remove every edge & every node from the graph.
	*
	* @return {Graph}
	*/
	clear() {
		this._edges.clear();
		this._nodes.clear();
		this._resetInstanceCounters();
		this.emit("cleared");
	}
	/**
	* Method used to remove every edge from the graph.
	*
	* @return {Graph}
	*/
	clearEdges() {
		const iterator = this._nodes.values();
		let step;
		while (step = iterator.next(), step.done !== true) step.value.clear();
		this._edges.clear();
		this._resetInstanceCounters();
		this.emit("edgesCleared");
	}
	/**---------------------------------------------------------------------------
	* Attributes-related methods
	**---------------------------------------------------------------------------
	*/
	/**
	* Method returning the desired graph's attribute.
	*
	* @param  {string} name - Name of the attribute.
	* @return {any}
	*/
	getAttribute(name) {
		return this._attributes[name];
	}
	/**
	* Method returning the graph's attributes.
	*
	* @return {object}
	*/
	getAttributes() {
		return this._attributes;
	}
	/**
	* Method returning whether the graph has the desired attribute.
	*
	* @param  {string}  name - Name of the attribute.
	* @return {boolean}
	*/
	hasAttribute(name) {
		return this._attributes.hasOwnProperty(name);
	}
	/**
	* Method setting a value for the desired graph's attribute.
	*
	* @param  {string}  name  - Name of the attribute.
	* @param  {any}     value - Value for the attribute.
	* @return {Graph}
	*/
	setAttribute(name, value) {
		this._attributes[name] = value;
		this.emit("attributesUpdated", {
			type: "set",
			attributes: this._attributes,
			name
		});
		return this;
	}
	/**
	* Method using a function to update the desired graph's attribute's value.
	*
	* @param  {string}   name    - Name of the attribute.
	* @param  {function} updater - Function use to update the attribute's value.
	* @return {Graph}
	*/
	updateAttribute(name, updater) {
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError("Graph.updateAttribute: updater should be a function.");
		const value = this._attributes[name];
		this._attributes[name] = updater(value);
		this.emit("attributesUpdated", {
			type: "set",
			attributes: this._attributes,
			name
		});
		return this;
	}
	/**
	* Method removing the desired graph's attribute.
	*
	* @param  {string} name  - Name of the attribute.
	* @return {Graph}
	*/
	removeAttribute(name) {
		delete this._attributes[name];
		this.emit("attributesUpdated", {
			type: "remove",
			attributes: this._attributes,
			name
		});
		return this;
	}
	/**
	* Method replacing the graph's attributes.
	*
	* @param  {object} attributes - New attributes.
	* @return {Graph}
	*
	* @throws {Error} - Will throw if given attributes are not a plain object.
	*/
	replaceAttributes(attributes) {
		if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.replaceAttributes: provided attributes are not a plain object.");
		this._attributes = attributes;
		this.emit("attributesUpdated", {
			type: "replace",
			attributes: this._attributes
		});
		return this;
	}
	/**
	* Method merging the graph's attributes.
	*
	* @param  {object} attributes - Attributes to merge.
	* @return {Graph}
	*
	* @throws {Error} - Will throw if given attributes are not a plain object.
	*/
	mergeAttributes(attributes) {
		if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.mergeAttributes: provided attributes are not a plain object.");
		assign(this._attributes, attributes);
		this.emit("attributesUpdated", {
			type: "merge",
			attributes: this._attributes,
			data: attributes
		});
		return this;
	}
	/**
	* Method updating the graph's attributes.
	*
	* @param  {function} updater - Function used to update the attributes.
	* @return {Graph}
	*
	* @throws {Error} - Will throw if given updater is not a function.
	*/
	updateAttributes(updater) {
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError("Graph.updateAttributes: provided updater is not a function.");
		this._attributes = updater(this._attributes);
		this.emit("attributesUpdated", {
			type: "update",
			attributes: this._attributes
		});
		return this;
	}
	/**
	* Method used to update each node's attributes using the given function.
	*
	* @param {function}  updater - Updater function to use.
	* @param {object}    [hints] - Optional hints.
	*/
	updateEachNodeAttributes(updater, hints) {
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError("Graph.updateEachNodeAttributes: expecting an updater function.");
		if (hints && !validateHints(hints)) throw new InvalidArgumentsGraphError("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
		const iterator = this._nodes.values();
		let step, nodeData;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			nodeData.attributes = updater(nodeData.key, nodeData.attributes);
		}
		this.emit("eachNodeAttributesUpdated", { hints: hints ? hints : null });
	}
	/**
	* Method used to update each edge's attributes using the given function.
	*
	* @param {function}  updater - Updater function to use.
	* @param {object}    [hints] - Optional hints.
	*/
	updateEachEdgeAttributes(updater, hints) {
		if (typeof updater !== "function") throw new InvalidArgumentsGraphError("Graph.updateEachEdgeAttributes: expecting an updater function.");
		if (hints && !validateHints(hints)) throw new InvalidArgumentsGraphError("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
		const iterator = this._edges.values();
		let step, edgeData, sourceData, targetData;
		while (step = iterator.next(), step.done !== true) {
			edgeData = step.value;
			sourceData = edgeData.source;
			targetData = edgeData.target;
			edgeData.attributes = updater(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected);
		}
		this.emit("eachEdgeAttributesUpdated", { hints: hints ? hints : null });
	}
	/**---------------------------------------------------------------------------
	* Iteration-related methods
	**---------------------------------------------------------------------------
	*/
	/**
	* Method iterating over the graph's adjacency using the given callback.
	*
	* @param  {function}  callback - Callback to use.
	*/
	forEachAdjacencyEntry(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.forEachAdjacencyEntry: expecting a callback.");
		forEachAdjacency(false, false, false, this, callback);
	}
	forEachAdjacencyEntryWithOrphans(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");
		forEachAdjacency(false, false, true, this, callback);
	}
	/**
	* Method iterating over the graph's assymetric adjacency using the given callback.
	*
	* @param  {function}  callback - Callback to use.
	*/
	forEachAssymetricAdjacencyEntry(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");
		forEachAdjacency(false, true, false, this, callback);
	}
	forEachAssymetricAdjacencyEntryWithOrphans(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");
		forEachAdjacency(false, true, true, this, callback);
	}
	/**
	* Method returning the list of the graph's nodes.
	*
	* @return {array} - The nodes.
	*/
	nodes() {
		return Array.from(this._nodes.keys());
	}
	/**
	* Method iterating over the graph's nodes using the given callback.
	*
	* @param  {function}  callback - Callback (key, attributes, index).
	*/
	forEachNode(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.forEachNode: expecting a callback.");
		const iterator = this._nodes.values();
		let step, nodeData;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			callback(nodeData.key, nodeData.attributes);
		}
	}
	/**
	* Method iterating attempting to find a node matching the given predicate
	* function.
	*
	* @param  {function}  callback - Callback (key, attributes).
	*/
	findNode(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.findNode: expecting a callback.");
		const iterator = this._nodes.values();
		let step, nodeData;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			if (callback(nodeData.key, nodeData.attributes)) return nodeData.key;
		}
	}
	/**
	* Method mapping nodes.
	*
	* @param  {function}  callback - Callback (key, attributes).
	*/
	mapNodes(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.mapNode: expecting a callback.");
		const iterator = this._nodes.values();
		let step, nodeData;
		const result = new Array(this.order);
		let i = 0;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			result[i++] = callback(nodeData.key, nodeData.attributes);
		}
		return result;
	}
	/**
	* Method returning whether some node verify the given predicate.
	*
	* @param  {function}  callback - Callback (key, attributes).
	*/
	someNode(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.someNode: expecting a callback.");
		const iterator = this._nodes.values();
		let step, nodeData;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			if (callback(nodeData.key, nodeData.attributes)) return true;
		}
		return false;
	}
	/**
	* Method returning whether all node verify the given predicate.
	*
	* @param  {function}  callback - Callback (key, attributes).
	*/
	everyNode(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.everyNode: expecting a callback.");
		const iterator = this._nodes.values();
		let step, nodeData;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			if (!callback(nodeData.key, nodeData.attributes)) return false;
		}
		return true;
	}
	/**
	* Method filtering nodes.
	*
	* @param  {function}  callback - Callback (key, attributes).
	*/
	filterNodes(callback) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.filterNodes: expecting a callback.");
		const iterator = this._nodes.values();
		let step, nodeData;
		const result = [];
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			if (callback(nodeData.key, nodeData.attributes)) result.push(nodeData.key);
		}
		return result;
	}
	/**
	* Method reducing nodes.
	*
	* @param  {function}  callback - Callback (accumulator, key, attributes).
	*/
	reduceNodes(callback, initialValue) {
		if (typeof callback !== "function") throw new InvalidArgumentsGraphError("Graph.reduceNodes: expecting a callback.");
		if (arguments.length < 2) throw new InvalidArgumentsGraphError("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");
		let accumulator = initialValue;
		const iterator = this._nodes.values();
		let step, nodeData;
		while (step = iterator.next(), step.done !== true) {
			nodeData = step.value;
			accumulator = callback(accumulator, nodeData.key, nodeData.attributes);
		}
		return accumulator;
	}
	/**
	* Method returning an iterator over the graph's node entries.
	*
	* @return {Iterator}
	*/
	nodeEntries() {
		const iterator = this._nodes.values();
		return {
			[Symbol.iterator]() {
				return this;
			},
			next() {
				const step = iterator.next();
				if (step.done) return step;
				const data = step.value;
				return {
					value: {
						node: data.key,
						attributes: data.attributes
					},
					done: false
				};
			}
		};
	}
	/**---------------------------------------------------------------------------
	* Serialization
	**---------------------------------------------------------------------------
	*/
	/**
	* Method used to export the whole graph.
	*
	* @return {object} - The serialized graph.
	*/
	export() {
		const nodes = new Array(this._nodes.size);
		let i = 0;
		this._nodes.forEach((data, key) => {
			nodes[i++] = serializeNode(key, data);
		});
		const edges = new Array(this._edges.size);
		i = 0;
		this._edges.forEach((data, key) => {
			edges[i++] = serializeEdge(this.type, key, data);
		});
		return {
			options: {
				type: this.type,
				multi: this.multi,
				allowSelfLoops: this.allowSelfLoops
			},
			attributes: this.getAttributes(),
			nodes,
			edges
		};
	}
	/**
	* Method used to import a serialized graph.
	*
	* @param  {object|Graph} data  - The serialized graph.
	* @param  {boolean}      merge - Whether to merge data.
	* @return {Graph}              - Returns itself for chaining.
	*/
	import(data, merge = false) {
		if (data instanceof Graph) {
			data.forEachNode((n, a) => {
				if (merge) this.mergeNode(n, a);
				else this.addNode(n, a);
			});
			data.forEachEdge((e, a, s, t, _sa, _ta, u) => {
				if (merge) {
					if (u) this.mergeUndirectedEdgeWithKey(e, s, t, a);
					else this.mergeDirectedEdgeWithKey(e, s, t, a);
				} else if (u) this.addUndirectedEdgeWithKey(e, s, t, a);
				else this.addDirectedEdgeWithKey(e, s, t, a);
			});
			return this;
		}
		if (!isPlainObject(data)) throw new InvalidArgumentsGraphError("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");
		if (data.attributes) {
			if (!isPlainObject(data.attributes)) throw new InvalidArgumentsGraphError("Graph.import: invalid attributes. Expecting a plain object.");
			if (merge) this.mergeAttributes(data.attributes);
			else this.replaceAttributes(data.attributes);
		}
		let i, l, list, node, edge;
		if (data.nodes) {
			list = data.nodes;
			if (!Array.isArray(list)) throw new InvalidArgumentsGraphError("Graph.import: invalid nodes. Expecting an array.");
			for (i = 0, l = list.length; i < l; i++) {
				node = list[i];
				validateSerializedNode(node);
				const { key, attributes } = node;
				if (merge) this.mergeNode(key, attributes);
				else this.addNode(key, attributes);
			}
		}
		if (data.edges) {
			let undirectedByDefault = false;
			if (this.type === "undirected") undirectedByDefault = true;
			list = data.edges;
			if (!Array.isArray(list)) throw new InvalidArgumentsGraphError("Graph.import: invalid edges. Expecting an array.");
			for (i = 0, l = list.length; i < l; i++) {
				edge = list[i];
				validateSerializedEdge(edge);
				const { source, target, attributes, undirected = undirectedByDefault } = edge;
				let method;
				if ("key" in edge) {
					method = merge ? undirected ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : undirected ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey;
					method.call(this, edge.key, source, target, attributes);
				} else {
					method = merge ? undirected ? this.mergeUndirectedEdge : this.mergeDirectedEdge : undirected ? this.addUndirectedEdge : this.addDirectedEdge;
					method.call(this, source, target, attributes);
				}
			}
		}
		return this;
	}
	/**---------------------------------------------------------------------------
	* Utils
	**---------------------------------------------------------------------------
	*/
	/**
	* Method returning a null copy of the graph, i.e. a graph without nodes
	* & edges but with the exact same options.
	*
	* @param  {object} options - Options to merge with the current ones.
	* @return {Graph}          - The null copy.
	*/
	nullCopy(options) {
		const graph = new Graph(assign({}, this._options, options));
		graph.replaceAttributes(assign({}, this.getAttributes()));
		return graph;
	}
	/**
	* Method returning an empty copy of the graph, i.e. a graph without edges but
	* with the exact same options.
	*
	* @param  {object} options - Options to merge with the current ones.
	* @return {Graph}          - The empty copy.
	*/
	emptyCopy(options) {
		const graph = this.nullCopy(options);
		this._nodes.forEach((nodeData, key) => {
			const attributes = assign({}, nodeData.attributes);
			nodeData = new graph.NodeDataClass(key, attributes);
			graph._nodes.set(key, nodeData);
		});
		return graph;
	}
	/**
	* Method returning an exact copy of the graph.
	*
	* @param  {object} options - Upgrade options.
	* @return {Graph}          - The copy.
	*/
	copy(options) {
		options = options || {};
		if (typeof options.type === "string" && options.type !== this.type && options.type !== "mixed") throw new UsageGraphError(`Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${options.type}" because this would mean losing information about the current graph.`);
		if (typeof options.multi === "boolean" && options.multi !== this.multi && options.multi !== true) throw new UsageGraphError("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");
		if (typeof options.allowSelfLoops === "boolean" && options.allowSelfLoops !== this.allowSelfLoops && options.allowSelfLoops !== true) throw new UsageGraphError("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");
		const graph = this.emptyCopy(options);
		const iterator = this._edges.values();
		let step, edgeData;
		while (step = iterator.next(), step.done !== true) {
			edgeData = step.value;
			addEdge(graph, "copy", false, edgeData.undirected, edgeData.key, edgeData.source.key, edgeData.target.key, assign({}, edgeData.attributes));
		}
		return graph;
	}
	/**---------------------------------------------------------------------------
	* Known methods
	**---------------------------------------------------------------------------
	*/
	/**
	* Method used by JavaScript to perform JSON serialization.
	*
	* @return {object} - The serialized graph.
	*/
	toJSON() {
		return this.export();
	}
	/**
	* Method returning [object Graph].
	*/
	toString() {
		return "[object Graph]";
	}
	/**
	* Method used internally by node's console to display a custom object.
	*
	* @return {object} - Formatted object representation of the graph.
	*/
	inspect() {
		const nodes = {};
		this._nodes.forEach((data, key) => {
			nodes[key] = data.attributes;
		});
		const edges = {}, multiIndex = {};
		this._edges.forEach((data, key) => {
			const direction = data.undirected ? "--" : "->";
			let label = "";
			let source = data.source.key;
			let target = data.target.key;
			let tmp;
			if (data.undirected && source > target) {
				tmp = source;
				source = target;
				target = tmp;
			}
			const desc = `(${source})${direction}(${target})`;
			if (!key.startsWith("geid_")) label += `[${key}]: `;
			else if (this.multi) {
				if (typeof multiIndex[desc] === "undefined") multiIndex[desc] = 0;
				else multiIndex[desc]++;
				label += `${multiIndex[desc]}. `;
			}
			label += desc;
			edges[label] = data.attributes;
		});
		const dummy = {};
		for (const k in this) if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k) && typeof this[k] !== "function" && typeof k !== "symbol") dummy[k] = this[k];
		dummy.attributes = this._attributes;
		dummy.nodes = nodes;
		dummy.edges = edges;
		privateProperty(dummy, "constructor", this.constructor);
		return dummy;
	}
};
/**
* Attaching methods to the prototype.
*
* Here, we are attaching a wide variety of methods to the Graph class'
* prototype when those are very numerous and when their creation is
* abstracted.
*/
/**
* Attaching custom inspect method for node >= 10.
*/
if (typeof Symbol !== "undefined") Graph.prototype[Symbol.for("nodejs.util.inspect.custom")] = Graph.prototype.inspect;
/**
* Related to edge addition.
*/
EDGE_ADD_METHODS.forEach((method) => {
	[
		"add",
		"merge",
		"update"
	].forEach((verb) => {
		const name = method.name(verb);
		const fn = verb === "add" ? addEdge : mergeEdge;
		if (method.generateKey) Graph.prototype[name] = function(source, target, attributes) {
			return fn(this, name, true, (method.type || this.type) === "undirected", null, source, target, attributes, verb === "update");
		};
		else Graph.prototype[name] = function(edge, source, target, attributes) {
			return fn(this, name, false, (method.type || this.type) === "undirected", edge, source, target, attributes, verb === "update");
		};
	});
});
/**
* Attributes-related.
*/
attachNodeAttributesMethods(Graph);
attachEdgeAttributesMethods(Graph);
/**
* Edge iteration-related.
*/
attachEdgeIterationMethods(Graph);
/**
* Neighbor iteration-related.
*/
attachNeighborIterationMethods(Graph);
/**
* Graphology Helper Classes
* ==========================
*
* Building some higher-order classes instantiating the graph with
* predefinite options.
*/
/**
* Alternative constructors.
*/
var DirectedGraph = class extends Graph {
	constructor(options) {
		const finalOptions = assign({ type: "directed" }, options);
		if ("multi" in finalOptions && finalOptions.multi !== false) throw new InvalidArgumentsGraphError("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
		if (finalOptions.type !== "directed") throw new InvalidArgumentsGraphError("DirectedGraph.from: inconsistent \"" + finalOptions.type + "\" type in given options!");
		super(finalOptions);
	}
};
var UndirectedGraph = class extends Graph {
	constructor(options) {
		const finalOptions = assign({ type: "undirected" }, options);
		if ("multi" in finalOptions && finalOptions.multi !== false) throw new InvalidArgumentsGraphError("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
		if (finalOptions.type !== "undirected") throw new InvalidArgumentsGraphError("UndirectedGraph.from: inconsistent \"" + finalOptions.type + "\" type in given options!");
		super(finalOptions);
	}
};
var MultiGraph = class extends Graph {
	constructor(options) {
		const finalOptions = assign({ multi: true }, options);
		if ("multi" in finalOptions && finalOptions.multi !== true) throw new InvalidArgumentsGraphError("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");
		super(finalOptions);
	}
};
var MultiDirectedGraph = class extends Graph {
	constructor(options) {
		const finalOptions = assign({
			type: "directed",
			multi: true
		}, options);
		if ("multi" in finalOptions && finalOptions.multi !== true) throw new InvalidArgumentsGraphError("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
		if (finalOptions.type !== "directed") throw new InvalidArgumentsGraphError("MultiDirectedGraph.from: inconsistent \"" + finalOptions.type + "\" type in given options!");
		super(finalOptions);
	}
};
var MultiUndirectedGraph = class extends Graph {
	constructor(options) {
		const finalOptions = assign({
			type: "undirected",
			multi: true
		}, options);
		if ("multi" in finalOptions && finalOptions.multi !== true) throw new InvalidArgumentsGraphError("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
		if (finalOptions.type !== "undirected") throw new InvalidArgumentsGraphError("MultiUndirectedGraph.from: inconsistent \"" + finalOptions.type + "\" type in given options!");
		super(finalOptions);
	}
};
/**
* Attaching static #.from method to each of the constructors.
*/
function attachStaticFromMethod(Class) {
	/**
	* Builds a graph from serialized data or another graph's data.
	*
	* @param  {Graph|SerializedGraph} data      - Hydratation data.
	* @param  {object}                [options] - Options.
	* @return {Class}
	*/
	Class.from = function(data, options) {
		const instance = new Class(assign({}, data.options, options));
		instance.import(data);
		return instance;
	};
}
attachStaticFromMethod(Graph);
attachStaticFromMethod(DirectedGraph);
attachStaticFromMethod(UndirectedGraph);
attachStaticFromMethod(MultiGraph);
attachStaticFromMethod(MultiDirectedGraph);
attachStaticFromMethod(MultiUndirectedGraph);
Graph.Graph = Graph;
Graph.DirectedGraph = DirectedGraph;
Graph.UndirectedGraph = UndirectedGraph;
Graph.MultiGraph = MultiGraph;
Graph.MultiDirectedGraph = MultiDirectedGraph;
Graph.MultiUndirectedGraph = MultiUndirectedGraph;
Graph.InvalidArgumentsGraphError = InvalidArgumentsGraphError;
Graph.NotFoundGraphError = NotFoundGraphError;
Graph.UsageGraphError = UsageGraphError;
//#endregion
//#region ../../node_modules/.pnpm/graphology-utils@2.5.2_graphology-types@0.24.8/node_modules/graphology-utils/getters.js
var require_getters = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Graphology Weight Getter
	* =========================
	*
	* Function creating weight getters.
	*/
	function coerceWeight(value) {
		if (typeof value !== "number" || isNaN(value)) return 1;
		return value;
	}
	function createNodeValueGetter(nameOrFunction, defaultValue) {
		var getter = {};
		var coerceToDefault = function(v) {
			if (typeof v === "undefined") return defaultValue;
			return v;
		};
		if (typeof defaultValue === "function") coerceToDefault = defaultValue;
		var get = function(attributes) {
			return coerceToDefault(attributes[nameOrFunction]);
		};
		var returnDefault = function() {
			return coerceToDefault(void 0);
		};
		if (typeof nameOrFunction === "string") {
			getter.fromAttributes = get;
			getter.fromGraph = function(graph, node) {
				return get(graph.getNodeAttributes(node));
			};
			getter.fromEntry = function(node, attributes) {
				return get(attributes);
			};
		} else if (typeof nameOrFunction === "function") {
			getter.fromAttributes = function() {
				throw new Error("graphology-utils/getters/createNodeValueGetter: irrelevant usage.");
			};
			getter.fromGraph = function(graph, node) {
				return coerceToDefault(nameOrFunction(node, graph.getNodeAttributes(node)));
			};
			getter.fromEntry = function(node, attributes) {
				return coerceToDefault(nameOrFunction(node, attributes));
			};
		} else {
			getter.fromAttributes = returnDefault;
			getter.fromGraph = returnDefault;
			getter.fromEntry = returnDefault;
		}
		return getter;
	}
	function createEdgeValueGetter(nameOrFunction, defaultValue) {
		var getter = {};
		var coerceToDefault = function(v) {
			if (typeof v === "undefined") return defaultValue;
			return v;
		};
		if (typeof defaultValue === "function") coerceToDefault = defaultValue;
		var get = function(attributes) {
			return coerceToDefault(attributes[nameOrFunction]);
		};
		var returnDefault = function() {
			return coerceToDefault(void 0);
		};
		if (typeof nameOrFunction === "string") {
			getter.fromAttributes = get;
			getter.fromGraph = function(graph, edge) {
				return get(graph.getEdgeAttributes(edge));
			};
			getter.fromEntry = function(edge, attributes) {
				return get(attributes);
			};
			getter.fromPartialEntry = getter.fromEntry;
			getter.fromMinimalEntry = getter.fromEntry;
		} else if (typeof nameOrFunction === "function") {
			getter.fromAttributes = function() {
				throw new Error("graphology-utils/getters/createEdgeValueGetter: irrelevant usage.");
			};
			getter.fromGraph = function(graph, edge) {
				var extremities = graph.extremities(edge);
				return coerceToDefault(nameOrFunction(edge, graph.getEdgeAttributes(edge), extremities[0], extremities[1], graph.getNodeAttributes(extremities[0]), graph.getNodeAttributes(extremities[1]), graph.isUndirected(edge)));
			};
			getter.fromEntry = function(e, a, s, t, sa, ta, u) {
				return coerceToDefault(nameOrFunction(e, a, s, t, sa, ta, u));
			};
			getter.fromPartialEntry = function(e, a, s, t) {
				return coerceToDefault(nameOrFunction(e, a, s, t));
			};
			getter.fromMinimalEntry = function(e, a) {
				return coerceToDefault(nameOrFunction(e, a));
			};
		} else {
			getter.fromAttributes = returnDefault;
			getter.fromGraph = returnDefault;
			getter.fromEntry = returnDefault;
			getter.fromMinimalEntry = returnDefault;
		}
		return getter;
	}
	exports.createNodeValueGetter = createNodeValueGetter;
	exports.createEdgeValueGetter = createEdgeValueGetter;
	exports.createEdgeWeightGetter = function(name) {
		return createEdgeValueGetter(name, coerceWeight);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-forceatlas2@0.9.2_graphology-types@0.24.8/node_modules/graphology-layout-forceatlas2/iterate.js
var require_iterate$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology ForceAtlas2 Iteration
	* =================================
	*
	* Function used to perform a single iteration of the algorithm.
	*/
	/**
	* Matrices properties accessors.
	*/
	var NODE_X = 0;
	var NODE_Y = 1;
	var NODE_DX = 2;
	var NODE_DY = 3;
	var NODE_OLD_DX = 4;
	var NODE_OLD_DY = 5;
	var NODE_MASS = 6;
	var NODE_CONVERGENCE = 7;
	var NODE_SIZE = 8;
	var NODE_FIXED = 9;
	var EDGE_SOURCE = 0;
	var EDGE_TARGET = 1;
	var EDGE_WEIGHT = 2;
	var REGION_NODE = 0;
	var REGION_CENTER_X = 1;
	var REGION_CENTER_Y = 2;
	var REGION_SIZE = 3;
	var REGION_NEXT_SIBLING = 4;
	var REGION_FIRST_CHILD = 5;
	var REGION_MASS = 6;
	var REGION_MASS_CENTER_X = 7;
	var REGION_MASS_CENTER_Y = 8;
	var SUBDIVISION_ATTEMPTS = 3;
	/**
	* Constants.
	*/
	var PPN = 10;
	var PPE = 3;
	var PPR = 9;
	var MAX_FORCE = 10;
	/**
	* Function used to perform a single interation of the algorithm.
	*
	* @param  {object}       options    - Layout options.
	* @param  {Float32Array} NodeMatrix - Node data.
	* @param  {Float32Array} EdgeMatrix - Edge data.
	* @return {object}                  - Some metadata.
	*/
	module.exports = function iterate(options, NodeMatrix, EdgeMatrix) {
		var l, r, n, n1, n2, rn, e, w, g, s;
		var order = NodeMatrix.length, size = EdgeMatrix.length;
		var adjustSizes = options.adjustSizes;
		var thetaSquared = options.barnesHutTheta * options.barnesHutTheta;
		var outboundAttCompensation, coefficient, xDist, yDist, ewc, distance, factor;
		var RegionMatrix = [];
		for (n = 0; n < order; n += PPN) {
			NodeMatrix[n + NODE_OLD_DX] = NodeMatrix[n + NODE_DX];
			NodeMatrix[n + NODE_OLD_DY] = NodeMatrix[n + NODE_DY];
			NodeMatrix[n + NODE_DX] = 0;
			NodeMatrix[n + NODE_DY] = 0;
		}
		if (options.outboundAttractionDistribution) {
			outboundAttCompensation = 0;
			for (n = 0; n < order; n += PPN) outboundAttCompensation += NodeMatrix[n + NODE_MASS];
			outboundAttCompensation /= order / PPN;
		}
		if (options.barnesHutOptimize) {
			var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, q, q2, subdivisionAttempts;
			for (n = 0; n < order; n += PPN) {
				minX = Math.min(minX, NodeMatrix[n + NODE_X]);
				maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);
				minY = Math.min(minY, NodeMatrix[n + NODE_Y]);
				maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);
			}
			var dx = maxX - minX, dy = maxY - minY;
			if (dx > dy) {
				minY -= (dx - dy) / 2;
				maxY = minY + dx;
			} else {
				minX -= (dy - dx) / 2;
				maxX = minX + dy;
			}
			RegionMatrix[0] = -1;
			RegionMatrix[1] = (minX + maxX) / 2;
			RegionMatrix[2] = (minY + maxY) / 2;
			RegionMatrix[3] = Math.max(maxX - minX, maxY - minY);
			RegionMatrix[4] = -1;
			RegionMatrix[5] = -1;
			RegionMatrix[6] = 0;
			RegionMatrix[7] = 0;
			RegionMatrix[8] = 0;
			l = 1;
			for (n = 0; n < order; n += PPN) {
				r = 0;
				subdivisionAttempts = SUBDIVISION_ATTEMPTS;
				while (true) if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
					if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
						if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) q = RegionMatrix[r + REGION_FIRST_CHILD];
						else q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
					} else if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) q = RegionMatrix[r + REGION_FIRST_CHILD] + 18;
					else q = RegionMatrix[r + REGION_FIRST_CHILD] + 27;
					RegionMatrix[r + REGION_MASS_CENTER_X] = (RegionMatrix[r + REGION_MASS_CENTER_X] * RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_X] * NodeMatrix[n + NODE_MASS]) / (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);
					RegionMatrix[r + REGION_MASS_CENTER_Y] = (RegionMatrix[r + REGION_MASS_CENTER_Y] * RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_Y] * NodeMatrix[n + NODE_MASS]) / (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);
					RegionMatrix[r + REGION_MASS] += NodeMatrix[n + NODE_MASS];
					r = q;
					continue;
				} else if (RegionMatrix[r + REGION_NODE] < 0) {
					RegionMatrix[r + REGION_NODE] = n;
					break;
				} else {
					RegionMatrix[r + REGION_FIRST_CHILD] = l * PPR;
					w = RegionMatrix[r + REGION_SIZE] / 2;
					g = RegionMatrix[r + REGION_FIRST_CHILD];
					RegionMatrix[g + REGION_NODE] = -1;
					RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;
					RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;
					RegionMatrix[g + REGION_SIZE] = w;
					RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
					RegionMatrix[g + REGION_FIRST_CHILD] = -1;
					RegionMatrix[g + REGION_MASS] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;
					g += PPR;
					RegionMatrix[g + REGION_NODE] = -1;
					RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;
					RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;
					RegionMatrix[g + REGION_SIZE] = w;
					RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
					RegionMatrix[g + REGION_FIRST_CHILD] = -1;
					RegionMatrix[g + REGION_MASS] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;
					g += PPR;
					RegionMatrix[g + REGION_NODE] = -1;
					RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;
					RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;
					RegionMatrix[g + REGION_SIZE] = w;
					RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
					RegionMatrix[g + REGION_FIRST_CHILD] = -1;
					RegionMatrix[g + REGION_MASS] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;
					g += PPR;
					RegionMatrix[g + REGION_NODE] = -1;
					RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;
					RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;
					RegionMatrix[g + REGION_SIZE] = w;
					RegionMatrix[g + REGION_NEXT_SIBLING] = RegionMatrix[r + REGION_NEXT_SIBLING];
					RegionMatrix[g + REGION_FIRST_CHILD] = -1;
					RegionMatrix[g + REGION_MASS] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
					RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;
					l += 4;
					if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
						if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) q = RegionMatrix[r + REGION_FIRST_CHILD];
						else q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
					} else if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) q = RegionMatrix[r + REGION_FIRST_CHILD] + 18;
					else q = RegionMatrix[r + REGION_FIRST_CHILD] + 27;
					RegionMatrix[r + REGION_MASS] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS];
					RegionMatrix[r + REGION_MASS_CENTER_X] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];
					RegionMatrix[r + REGION_MASS_CENTER_Y] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];
					RegionMatrix[q + REGION_NODE] = RegionMatrix[r + REGION_NODE];
					RegionMatrix[r + REGION_NODE] = -1;
					if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
						if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) q2 = RegionMatrix[r + REGION_FIRST_CHILD];
						else q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
					} else if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) q2 = RegionMatrix[r + REGION_FIRST_CHILD] + 18;
					else q2 = RegionMatrix[r + REGION_FIRST_CHILD] + 27;
					if (q === q2) {
						if (subdivisionAttempts--) {
							r = q;
							continue;
						} else {
							subdivisionAttempts = SUBDIVISION_ATTEMPTS;
							break;
						}
					}
					RegionMatrix[q2 + REGION_NODE] = n;
					break;
				}
			}
		}
		if (options.barnesHutOptimize) {
			coefficient = options.scalingRatio;
			for (n = 0; n < order; n += PPN) {
				r = 0;
				while (true) if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
					distance = Math.pow(NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X], 2) + Math.pow(NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y], 2);
					s = RegionMatrix[r + REGION_SIZE];
					if (4 * s * s / distance < thetaSquared) {
						xDist = NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X];
						yDist = NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y];
						if (adjustSizes === true) {
							if (distance > 0) {
								factor = coefficient * NodeMatrix[n + NODE_MASS] * RegionMatrix[r + REGION_MASS] / distance;
								NodeMatrix[n + NODE_DX] += xDist * factor;
								NodeMatrix[n + NODE_DY] += yDist * factor;
							} else if (distance < 0) {
								factor = -coefficient * NodeMatrix[n + NODE_MASS] * RegionMatrix[r + REGION_MASS] / Math.sqrt(distance);
								NodeMatrix[n + NODE_DX] += xDist * factor;
								NodeMatrix[n + NODE_DY] += yDist * factor;
							}
						} else if (distance > 0) {
							factor = coefficient * NodeMatrix[n + NODE_MASS] * RegionMatrix[r + REGION_MASS] / distance;
							NodeMatrix[n + NODE_DX] += xDist * factor;
							NodeMatrix[n + NODE_DY] += yDist * factor;
						}
						r = RegionMatrix[r + REGION_NEXT_SIBLING];
						if (r < 0) break;
						continue;
					} else {
						r = RegionMatrix[r + REGION_FIRST_CHILD];
						continue;
					}
				} else {
					rn = RegionMatrix[r + REGION_NODE];
					if (rn >= 0 && rn !== n) {
						xDist = NodeMatrix[n + NODE_X] - NodeMatrix[rn + NODE_X];
						yDist = NodeMatrix[n + NODE_Y] - NodeMatrix[rn + NODE_Y];
						distance = xDist * xDist + yDist * yDist;
						if (adjustSizes === true) {
							if (distance > 0) {
								factor = coefficient * NodeMatrix[n + NODE_MASS] * NodeMatrix[rn + NODE_MASS] / distance;
								NodeMatrix[n + NODE_DX] += xDist * factor;
								NodeMatrix[n + NODE_DY] += yDist * factor;
							} else if (distance < 0) {
								factor = -coefficient * NodeMatrix[n + NODE_MASS] * NodeMatrix[rn + NODE_MASS] / Math.sqrt(distance);
								NodeMatrix[n + NODE_DX] += xDist * factor;
								NodeMatrix[n + NODE_DY] += yDist * factor;
							}
						} else if (distance > 0) {
							factor = coefficient * NodeMatrix[n + NODE_MASS] * NodeMatrix[rn + NODE_MASS] / distance;
							NodeMatrix[n + NODE_DX] += xDist * factor;
							NodeMatrix[n + NODE_DY] += yDist * factor;
						}
					}
					r = RegionMatrix[r + REGION_NEXT_SIBLING];
					if (r < 0) break;
					continue;
				}
			}
		} else {
			coefficient = options.scalingRatio;
			for (n1 = 0; n1 < order; n1 += PPN) for (n2 = 0; n2 < n1; n2 += PPN) {
				xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
				yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];
				if (adjustSizes === true) {
					distance = Math.sqrt(xDist * xDist + yDist * yDist) - NodeMatrix[n1 + NODE_SIZE] - NodeMatrix[n2 + NODE_SIZE];
					if (distance > 0) {
						factor = coefficient * NodeMatrix[n1 + NODE_MASS] * NodeMatrix[n2 + NODE_MASS] / distance / distance;
						NodeMatrix[n1 + NODE_DX] += xDist * factor;
						NodeMatrix[n1 + NODE_DY] += yDist * factor;
						NodeMatrix[n2 + NODE_DX] += xDist * factor;
						NodeMatrix[n2 + NODE_DY] += yDist * factor;
					} else if (distance < 0) {
						factor = 100 * coefficient * NodeMatrix[n1 + NODE_MASS] * NodeMatrix[n2 + NODE_MASS];
						NodeMatrix[n1 + NODE_DX] += xDist * factor;
						NodeMatrix[n1 + NODE_DY] += yDist * factor;
						NodeMatrix[n2 + NODE_DX] -= xDist * factor;
						NodeMatrix[n2 + NODE_DY] -= yDist * factor;
					}
				} else {
					distance = Math.sqrt(xDist * xDist + yDist * yDist);
					if (distance > 0) {
						factor = coefficient * NodeMatrix[n1 + NODE_MASS] * NodeMatrix[n2 + NODE_MASS] / distance / distance;
						NodeMatrix[n1 + NODE_DX] += xDist * factor;
						NodeMatrix[n1 + NODE_DY] += yDist * factor;
						NodeMatrix[n2 + NODE_DX] -= xDist * factor;
						NodeMatrix[n2 + NODE_DY] -= yDist * factor;
					}
				}
			}
		}
		g = options.gravity / options.scalingRatio;
		coefficient = options.scalingRatio;
		for (n = 0; n < order; n += PPN) {
			factor = 0;
			xDist = NodeMatrix[n + NODE_X];
			yDist = NodeMatrix[n + NODE_Y];
			distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
			if (options.strongGravityMode) {
				if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g;
			} else if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g / distance;
			NodeMatrix[n + NODE_DX] -= xDist * factor;
			NodeMatrix[n + NODE_DY] -= yDist * factor;
		}
		coefficient = 1 * (options.outboundAttractionDistribution ? outboundAttCompensation : 1);
		for (e = 0; e < size; e += PPE) {
			n1 = EdgeMatrix[e + EDGE_SOURCE];
			n2 = EdgeMatrix[e + EDGE_TARGET];
			w = EdgeMatrix[e + EDGE_WEIGHT];
			ewc = Math.pow(w, options.edgeWeightInfluence);
			xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
			yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];
			if (adjustSizes === true) {
				distance = Math.sqrt(xDist * xDist + yDist * yDist) - NodeMatrix[n1 + NODE_SIZE] - NodeMatrix[n2 + NODE_SIZE];
				if (options.linLogMode) {
					if (options.outboundAttractionDistribution) {
						if (distance > 0) factor = -coefficient * ewc * Math.log(1 + distance) / distance / NodeMatrix[n1 + NODE_MASS];
					} else if (distance > 0) factor = -coefficient * ewc * Math.log(1 + distance) / distance;
				} else if (options.outboundAttractionDistribution) {
					if (distance > 0) factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
				} else if (distance > 0) factor = -coefficient * ewc;
			} else {
				distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
				if (options.linLogMode) {
					if (options.outboundAttractionDistribution) {
						if (distance > 0) factor = -coefficient * ewc * Math.log(1 + distance) / distance / NodeMatrix[n1 + NODE_MASS];
					} else if (distance > 0) factor = -coefficient * ewc * Math.log(1 + distance) / distance;
				} else if (options.outboundAttractionDistribution) {
					distance = 1;
					factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
				} else {
					distance = 1;
					factor = -coefficient * ewc;
				}
			}
			if (distance > 0) {
				NodeMatrix[n1 + NODE_DX] += xDist * factor;
				NodeMatrix[n1 + NODE_DY] += yDist * factor;
				NodeMatrix[n2 + NODE_DX] -= xDist * factor;
				NodeMatrix[n2 + NODE_DY] -= yDist * factor;
			}
		}
		var force, swinging, traction, nodespeed, newX, newY;
		if (adjustSizes === true) {
			for (n = 0; n < order; n += PPN) if (NodeMatrix[n + NODE_FIXED] !== 1) {
				force = Math.sqrt(Math.pow(NodeMatrix[n + NODE_DX], 2) + Math.pow(NodeMatrix[n + NODE_DY], 2));
				if (force > MAX_FORCE) {
					NodeMatrix[n + NODE_DX] = NodeMatrix[n + NODE_DX] * MAX_FORCE / force;
					NodeMatrix[n + NODE_DY] = NodeMatrix[n + NODE_DY] * MAX_FORCE / force;
				}
				swinging = NodeMatrix[n + NODE_MASS] * Math.sqrt((NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]));
				traction = Math.sqrt((NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])) / 2;
				nodespeed = .1 * Math.log(1 + traction) / (1 + Math.sqrt(swinging));
				newX = NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
				NodeMatrix[n + NODE_X] = newX;
				newY = NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
				NodeMatrix[n + NODE_Y] = newY;
			}
		} else for (n = 0; n < order; n += PPN) if (NodeMatrix[n + NODE_FIXED] !== 1) {
			swinging = NodeMatrix[n + NODE_MASS] * Math.sqrt((NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]));
			traction = Math.sqrt((NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])) / 2;
			nodespeed = NodeMatrix[n + NODE_CONVERGENCE] * Math.log(1 + traction) / (1 + Math.sqrt(swinging));
			NodeMatrix[n + NODE_CONVERGENCE] = Math.min(1, Math.sqrt(nodespeed * (Math.pow(NodeMatrix[n + NODE_DX], 2) + Math.pow(NodeMatrix[n + NODE_DY], 2)) / (1 + Math.sqrt(swinging))));
			newX = NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
			NodeMatrix[n + NODE_X] = newX;
			newY = NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
			NodeMatrix[n + NODE_Y] = newY;
		}
		return {};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-forceatlas2@0.9.2_graphology-types@0.24.8/node_modules/graphology-layout-forceatlas2/helpers.js
var require_helpers$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Graphology ForceAtlas2 Helpers
	* ===============================
	*
	* Miscellaneous helper functions.
	*/
	/**
	* Constants.
	*/
	var PPN = 10;
	var PPE = 3;
	/**
	* Very simple Object.assign-like function.
	*
	* @param  {object} target       - First object.
	* @param  {object} [...objects] - Objects to merge.
	* @return {object}
	*/
	exports.assign = function(target) {
		target = target || {};
		var objects = Array.prototype.slice.call(arguments).slice(1), i = 0, k, l = objects.length;
		for (; i < l; i++) {
			if (!objects[i]) continue;
			for (k in objects[i]) target[k] = objects[i][k];
		}
		return target;
	};
	/**
	* Function used to validate the given settings.
	*
	* @param  {object}      settings - Settings to validate.
	* @return {object|null}
	*/
	exports.validateSettings = function(settings) {
		if ("linLogMode" in settings && typeof settings.linLogMode !== "boolean") return { message: "the `linLogMode` setting should be a boolean." };
		if ("outboundAttractionDistribution" in settings && typeof settings.outboundAttractionDistribution !== "boolean") return { message: "the `outboundAttractionDistribution` setting should be a boolean." };
		if ("adjustSizes" in settings && typeof settings.adjustSizes !== "boolean") return { message: "the `adjustSizes` setting should be a boolean." };
		if ("edgeWeightInfluence" in settings && typeof settings.edgeWeightInfluence !== "number") return { message: "the `edgeWeightInfluence` setting should be a number." };
		if ("scalingRatio" in settings && !(typeof settings.scalingRatio === "number" && settings.scalingRatio >= 0)) return { message: "the `scalingRatio` setting should be a number >= 0." };
		if ("strongGravityMode" in settings && typeof settings.strongGravityMode !== "boolean") return { message: "the `strongGravityMode` setting should be a boolean." };
		if ("gravity" in settings && !(typeof settings.gravity === "number" && settings.gravity >= 0)) return { message: "the `gravity` setting should be a number >= 0." };
		if ("slowDown" in settings && !(typeof settings.slowDown === "number" || settings.slowDown >= 0)) return { message: "the `slowDown` setting should be a number >= 0." };
		if ("barnesHutOptimize" in settings && typeof settings.barnesHutOptimize !== "boolean") return { message: "the `barnesHutOptimize` setting should be a boolean." };
		if ("barnesHutTheta" in settings && !(typeof settings.barnesHutTheta === "number" && settings.barnesHutTheta >= 0)) return { message: "the `barnesHutTheta` setting should be a number >= 0." };
		return null;
	};
	/**
	* Function generating a flat matrix for both nodes & edges of the given graph.
	*
	* @param  {Graph}    graph         - Target graph.
	* @param  {function} getEdgeWeight - Edge weight getter function.
	* @return {object}                 - Both matrices.
	*/
	exports.graphToByteArrays = function(graph, getEdgeWeight) {
		var order = graph.order;
		var size = graph.size;
		var index = {};
		var j;
		var NodeMatrix = new Float32Array(order * PPN);
		var EdgeMatrix = new Float32Array(size * PPE);
		j = 0;
		graph.forEachNode(function(node, attr) {
			index[node] = j;
			NodeMatrix[j] = attr.x;
			NodeMatrix[j + 1] = attr.y;
			NodeMatrix[j + 2] = 0;
			NodeMatrix[j + 3] = 0;
			NodeMatrix[j + 4] = 0;
			NodeMatrix[j + 5] = 0;
			NodeMatrix[j + 6] = 1;
			NodeMatrix[j + 7] = 1;
			NodeMatrix[j + 8] = attr.size || 1;
			NodeMatrix[j + 9] = attr.fixed ? 1 : 0;
			j += PPN;
		});
		j = 0;
		graph.forEachEdge(function(edge, attr, source, target, sa, ta, u) {
			var sj = index[source];
			var tj = index[target];
			NodeMatrix[sj + 6] += 1;
			NodeMatrix[tj + 6] += 1;
			EdgeMatrix[j] = sj;
			EdgeMatrix[j + 1] = tj;
			EdgeMatrix[j + 2] = getEdgeWeight(edge, attr, source, target, sa, ta, u);
			j += PPE;
		});
		return {
			nodes: NodeMatrix,
			edges: EdgeMatrix
		};
	};
	/**
	* Function applying the layout back to the graph.
	*
	* @param {Graph}         graph         - Target graph.
	* @param {Float32Array}  NodeMatrix    - Node matrix.
	* @param {function|null} outputReducer - A node reducer.
	*/
	exports.assignLayoutChanges = function(graph, NodeMatrix, outputReducer) {
		var i = 0;
		graph.updateEachNodeAttributes(function(node, attr) {
			attr.x = NodeMatrix[i];
			attr.y = NodeMatrix[i + 1];
			i += PPN;
			return outputReducer ? outputReducer(node, attr) : attr;
		});
	};
	/**
	* Function reading the positions (only) from the graph, to write them in the matrix.
	*
	* @param {Graph}        graph      - Target graph.
	* @param {Float32Array} NodeMatrix - Node matrix.
	*/
	exports.readGraphPositions = function(graph, NodeMatrix) {
		var i = 0;
		graph.forEachNode(function(node, attr) {
			NodeMatrix[i] = attr.x;
			NodeMatrix[i + 1] = attr.y;
			i += PPN;
		});
	};
	/**
	* Function collecting the layout positions.
	*
	* @param  {Graph}         graph         - Target graph.
	* @param  {Float32Array}  NodeMatrix    - Node matrix.
	* @param  {function|null} outputReducer - A nodes reducer.
	* @return {object}                      - Map to node positions.
	*/
	exports.collectLayoutChanges = function(graph, NodeMatrix, outputReducer) {
		var nodes = graph.nodes(), positions = {};
		for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
			if (outputReducer) {
				var newAttr = Object.assign({}, graph.getNodeAttributes(nodes[j]));
				newAttr.x = NodeMatrix[i];
				newAttr.y = NodeMatrix[i + 1];
				newAttr = outputReducer(nodes[j], newAttr);
				positions[nodes[j]] = {
					x: newAttr.x,
					y: newAttr.y
				};
			} else positions[nodes[j]] = {
				x: NodeMatrix[i],
				y: NodeMatrix[i + 1]
			};
			j++;
		}
		return positions;
	};
	/**
	* Function returning a web worker from the given function.
	*
	* @param  {function}  fn - Function for the worker.
	* @return {DOMString}
	*/
	exports.createWorker = function createWorker(fn) {
		var xURL = window.URL || window.webkitURL;
		var code = fn.toString();
		var objectUrl = xURL.createObjectURL(new Blob(["(" + code + ").call(this);"], { type: "text/javascript" }));
		var worker = new Worker(objectUrl);
		xURL.revokeObjectURL(objectUrl);
		return worker;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-forceatlas2@0.9.2_graphology-types@0.24.8/node_modules/graphology-layout-forceatlas2/defaults.js
var require_defaults$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology ForceAtlas2 Layout Default Settings
	* ===============================================
	*/
	module.exports = {
		linLogMode: false,
		outboundAttractionDistribution: false,
		adjustSizes: false,
		edgeWeightInfluence: 1,
		scalingRatio: 1,
		strongGravityMode: false,
		gravity: 1,
		slowDown: 1,
		barnesHutOptimize: false,
		barnesHutTheta: .5
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-forceatlas2@0.9.2_graphology-types@0.24.8/node_modules/graphology-layout-forceatlas2/index.js
var require_graphology_layout_forceatlas2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology ForceAtlas2 Layout
	* ==============================
	*
	* Library endpoint.
	*/
	var isGraph = require_is_graph();
	var createEdgeWeightGetter = require_getters().createEdgeWeightGetter;
	var iterate = require_iterate$1();
	var helpers = require_helpers$1();
	var DEFAULT_SETTINGS = require_defaults$1();
	/**
	* Asbtract function used to run a certain number of iterations.
	*
	* @param  {boolean}       assign          - Whether to assign positions.
	* @param  {Graph}         graph           - Target graph.
	* @param  {object|number} params          - If number, params.iterations, else:
	* @param  {function}        getWeight     - Edge weight getter function.
	* @param  {number}          iterations    - Number of iterations.
	* @param  {function|null}   outputReducer - A node reducer
	* @param  {object}          [settings]    - Settings.
	* @return {object|undefined}
	*/
	function abstractSynchronousLayout(assign, graph, params) {
		if (!isGraph(graph)) throw new Error("graphology-layout-forceatlas2: the given graph is not a valid graphology instance.");
		if (typeof params === "number") params = { iterations: params };
		var iterations = params.iterations;
		if (typeof iterations !== "number") throw new Error("graphology-layout-forceatlas2: invalid number of iterations.");
		if (iterations <= 0) throw new Error("graphology-layout-forceatlas2: you should provide a positive number of iterations.");
		var getEdgeWeight = createEdgeWeightGetter(params.getEdgeWeight).fromEntry;
		var outputReducer = typeof params.outputReducer === "function" ? params.outputReducer : null;
		var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings);
		var validationError = helpers.validateSettings(settings);
		if (validationError) throw new Error("graphology-layout-forceatlas2: " + validationError.message);
		var matrices = helpers.graphToByteArrays(graph, getEdgeWeight);
		var i = 0;
		for (; i < iterations; i++) iterate(settings, matrices.nodes, matrices.edges);
		if (assign) {
			helpers.assignLayoutChanges(graph, matrices.nodes, outputReducer);
			return;
		}
		return helpers.collectLayoutChanges(graph, matrices.nodes);
	}
	/**
	* Function returning sane layout settings for the given graph.
	*
	* @param  {Graph|number} graph - Target graph or graph order.
	* @return {object}
	*/
	function inferSettings(graph) {
		var order = typeof graph === "number" ? graph : graph.order;
		return {
			barnesHutOptimize: order > 2e3,
			strongGravityMode: true,
			gravity: .05,
			scalingRatio: 10,
			slowDown: 1 + Math.log(order)
		};
	}
	/**
	* Exporting.
	*/
	var synchronousLayout = abstractSynchronousLayout.bind(null, false);
	synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);
	synchronousLayout.inferSettings = inferSettings;
	module.exports = synchronousLayout;
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-noverlap@0.4.2_graphology-types@0.24.8/node_modules/graphology-layout-noverlap/iterate.js
var require_iterate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology Noverlap Iteration
	* ==============================
	*
	* Function used to perform a single iteration of the algorithm.
	*/
	/**
	* Matrices properties accessors.
	*/
	var NODE_X = 0;
	var NODE_Y = 1;
	var NODE_SIZE = 2;
	/**
	* Constants.
	*/
	var PPN = 3;
	/**
	* Helpers.
	*/
	function hashPair(a, b) {
		return a + "§" + b;
	}
	function jitter() {
		return .01 * (.5 - Math.random());
	}
	/**
	* Function used to perform a single interation of the algorithm.
	*
	* @param  {object}       options    - Layout options.
	* @param  {Float32Array} NodeMatrix - Node data.
	* @return {object}                  - Some metadata.
	*/
	module.exports = function iterate(options, NodeMatrix) {
		var margin = options.margin;
		var ratio = options.ratio;
		var expansion = options.expansion;
		var gridSize = options.gridSize;
		var speed = options.speed;
		var i, j, x, y, l, size;
		var converged = true;
		var length = NodeMatrix.length;
		var order = length / PPN | 0;
		var deltaX = new Float32Array(order);
		var deltaY = new Float32Array(order);
		var xMin = Infinity;
		var yMin = Infinity;
		var xMax = -Infinity;
		var yMax = -Infinity;
		for (i = 0; i < length; i += PPN) {
			x = NodeMatrix[i + NODE_X];
			y = NodeMatrix[i + NODE_Y];
			size = NodeMatrix[i + NODE_SIZE] * ratio + margin;
			xMin = Math.min(xMin, x - size);
			xMax = Math.max(xMax, x + size);
			yMin = Math.min(yMin, y - size);
			yMax = Math.max(yMax, y + size);
		}
		var width = xMax - xMin;
		var height = yMax - yMin;
		var xCenter = (xMin + xMax) / 2;
		var yCenter = (yMin + yMax) / 2;
		xMin = xCenter - expansion * width / 2;
		xMax = xCenter + expansion * width / 2;
		yMin = yCenter - expansion * height / 2;
		yMax = yCenter + expansion * height / 2;
		var grid = new Array(gridSize * gridSize), gridLength = grid.length, c = 0;
		for (; c < gridLength; c++) grid[c] = [];
		var nxMin, nxMax, nyMin, nyMax;
		var xMinBox, xMaxBox, yMinBox, yMaxBox;
		var col, row;
		for (i = 0; i < length; i += PPN) {
			x = NodeMatrix[i + NODE_X];
			y = NodeMatrix[i + NODE_Y];
			size = NodeMatrix[i + NODE_SIZE] * ratio + margin;
			nxMin = x - size;
			nxMax = x + size;
			nyMin = y - size;
			nyMax = y + size;
			xMinBox = Math.floor(gridSize * (nxMin - xMin) / (xMax - xMin));
			xMaxBox = Math.floor(gridSize * (nxMax - xMin) / (xMax - xMin));
			yMinBox = Math.floor(gridSize * (nyMin - yMin) / (yMax - yMin));
			yMaxBox = Math.floor(gridSize * (nyMax - yMin) / (yMax - yMin));
			for (col = xMinBox; col <= xMaxBox; col++) for (row = yMinBox; row <= yMaxBox; row++) grid[col * gridSize + row].push(i);
		}
		var cell;
		var collisions = /* @__PURE__ */ new Set();
		var n1, n2, x1, x2, y1, y2, s1, s2, h;
		var xDist, yDist, dist, collision;
		for (c = 0; c < gridLength; c++) {
			cell = grid[c];
			for (i = 0, l = cell.length; i < l; i++) {
				n1 = cell[i];
				x1 = NodeMatrix[n1 + NODE_X];
				y1 = NodeMatrix[n1 + NODE_Y];
				s1 = NodeMatrix[n1 + NODE_SIZE];
				for (j = i + 1; j < l; j++) {
					n2 = cell[j];
					h = hashPair(n1, n2);
					if (gridLength > 1 && collisions.has(h)) continue;
					if (gridLength > 1) collisions.add(h);
					x2 = NodeMatrix[n2 + NODE_X];
					y2 = NodeMatrix[n2 + NODE_Y];
					s2 = NodeMatrix[n2 + NODE_SIZE];
					xDist = x2 - x1;
					yDist = y2 - y1;
					dist = Math.sqrt(xDist * xDist + yDist * yDist);
					collision = dist < s1 * ratio + margin + (s2 * ratio + margin);
					if (collision) {
						converged = false;
						n2 = n2 / PPN | 0;
						if (dist > 0) {
							deltaX[n2] += xDist / dist * (1 + s1);
							deltaY[n2] += yDist / dist * (1 + s1);
						} else {
							deltaX[n2] += width * jitter();
							deltaY[n2] += height * jitter();
						}
					}
				}
			}
		}
		for (i = 0, j = 0; i < length; i += PPN, j++) {
			NodeMatrix[i + NODE_X] += deltaX[j] * .1 * speed;
			NodeMatrix[i + NODE_Y] += deltaY[j] * .1 * speed;
		}
		return { converged };
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-noverlap@0.4.2_graphology-types@0.24.8/node_modules/graphology-layout-noverlap/helpers.js
var require_helpers = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Graphology Noverlap Helpers
	* ============================
	*
	* Miscellaneous helper functions.
	*/
	/**
	* Constants.
	*/
	var PPN = 3;
	/**
	* Function used to validate the given settings.
	*
	* @param  {object}      settings - Settings to validate.
	* @return {object|null}
	*/
	exports.validateSettings = function(settings) {
		if ("gridSize" in settings && typeof settings.gridSize !== "number" || settings.gridSize <= 0) return { message: "the `gridSize` setting should be a positive number." };
		if ("margin" in settings && typeof settings.margin !== "number" || settings.margin < 0) return { message: "the `margin` setting should be 0 or a positive number." };
		if ("expansion" in settings && typeof settings.expansion !== "number" || settings.expansion <= 0) return { message: "the `expansion` setting should be a positive number." };
		if ("ratio" in settings && typeof settings.ratio !== "number" || settings.ratio <= 0) return { message: "the `ratio` setting should be a positive number." };
		if ("speed" in settings && typeof settings.speed !== "number" || settings.speed <= 0) return { message: "the `speed` setting should be a positive number." };
		return null;
	};
	/**
	* Function generating a flat matrix for the given graph's nodes.
	*
	* @param  {Graph}        graph   - Target graph.
	* @param  {function}     reducer - Node reducer function.
	* @return {Float32Array}         - The node matrix.
	*/
	exports.graphToByteArray = function(graph, reducer) {
		var order = graph.order;
		var matrix = new Float32Array(order * PPN);
		var j = 0;
		graph.forEachNode(function(node, attr) {
			if (typeof reducer === "function") attr = reducer(node, attr);
			matrix[j] = attr.x;
			matrix[j + 1] = attr.y;
			matrix[j + 2] = attr.size || 1;
			j += PPN;
		});
		return matrix;
	};
	/**
	* Function applying the layout back to the graph.
	*
	* @param {Graph}        graph      - Target graph.
	* @param {Float32Array} NodeMatrix - Node matrix.
	* @param {function}     reducer    - Reducing function.
	*/
	exports.assignLayoutChanges = function(graph, NodeMatrix, reducer) {
		var i = 0;
		graph.forEachNode(function(node) {
			var pos = {
				x: NodeMatrix[i],
				y: NodeMatrix[i + 1]
			};
			if (typeof reducer === "function") pos = reducer(node, pos);
			graph.mergeNodeAttributes(node, pos);
			i += PPN;
		});
	};
	/**
	* Function collecting the layout positions.
	*
	* @param  {Graph}        graph      - Target graph.
	* @param  {Float32Array} NodeMatrix - Node matrix.
	* @param  {function}     reducer    - Reducing function.
	* @return {object}                  - Map to node positions.
	*/
	exports.collectLayoutChanges = function(graph, NodeMatrix, reducer) {
		var positions = {};
		var i = 0;
		graph.forEachNode(function(node) {
			var pos = {
				x: NodeMatrix[i],
				y: NodeMatrix[i + 1]
			};
			if (typeof reducer === "function") pos = reducer(node, pos);
			positions[node] = pos;
			i += PPN;
		});
		return positions;
	};
	/**
	* Function returning a web worker from the given function.
	*
	* @param  {function}  fn - Function for the worker.
	* @return {DOMString}
	*/
	exports.createWorker = function createWorker(fn) {
		var xURL = window.URL || window.webkitURL;
		var code = fn.toString();
		var objectUrl = xURL.createObjectURL(new Blob(["(" + code + ").call(this);"], { type: "text/javascript" }));
		var worker = new Worker(objectUrl);
		xURL.revokeObjectURL(objectUrl);
		return worker;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-noverlap@0.4.2_graphology-types@0.24.8/node_modules/graphology-layout-noverlap/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology Noverlap Layout Default Settings
	* ============================================
	*/
	module.exports = {
		gridSize: 20,
		margin: 5,
		expansion: 1.1,
		ratio: 1,
		speed: 3
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/graphology-layout-noverlap@0.4.2_graphology-types@0.24.8/node_modules/graphology-layout-noverlap/index.js
var require_graphology_layout_noverlap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Graphology Noverlap Layout
	* ===========================
	*
	* Library endpoint.
	*/
	var isGraph = require_is_graph();
	var iterate = require_iterate();
	var helpers = require_helpers();
	var DEFAULT_SETTINGS = require_defaults();
	var DEFAULT_MAX_ITERATIONS = 500;
	/**
	* Asbtract function used to run a certain number of iterations.
	*
	* @param  {boolean}       assign       - Whether to assign positions.
	* @param  {Graph}         graph        - Target graph.
	* @param  {object|number} params       - If number, params.maxIterations, else:
	* @param  {number}          maxIterations - Maximum number of iterations.
	* @param  {object}          [settings] - Settings.
	* @return {object|undefined}
	*/
	function abstractSynchronousLayout(assign, graph, params) {
		if (!isGraph(graph)) throw new Error("graphology-layout-noverlap: the given graph is not a valid graphology instance.");
		if (typeof params === "number") params = { maxIterations: params };
		else params = params || {};
		var maxIterations = params.maxIterations || DEFAULT_MAX_ITERATIONS;
		if (typeof maxIterations !== "number" || maxIterations <= 0) throw new Error("graphology-layout-force: you should provide a positive number of maximum iterations.");
		var settings = Object.assign({}, DEFAULT_SETTINGS, params.settings), validationError = helpers.validateSettings(settings);
		if (validationError) throw new Error("graphology-layout-noverlap: " + validationError.message);
		var matrix = helpers.graphToByteArray(graph, params.inputReducer), converged = false, i = 0;
		for (; i < maxIterations && !converged; i++) converged = iterate(settings, matrix).converged;
		if (assign) {
			helpers.assignLayoutChanges(graph, matrix, params.outputReducer);
			return;
		}
		return helpers.collectLayoutChanges(graph, matrix, params.outputReducer);
	}
	/**
	* Exporting.
	*/
	var synchronousLayout = abstractSynchronousLayout.bind(null, false);
	synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);
	module.exports = synchronousLayout;
}));
//#endregion
//#region src/client/graph-layout.ts
var import_graphology_layout_forceatlas2 = /* @__PURE__ */ __toESM(require_graphology_layout_forceatlas2(), 1);
var import_graphology_layout_noverlap = /* @__PURE__ */ __toESM(require_graphology_layout_noverlap(), 1);
/**
* Collapse link occurrences onto one line per node pair.
*
* The corpus records every occurrence: a page may cite a neighbour twice, and
* two pages may cite each other. The drawn graph is undirected, so all of them
* are the same connection and must be the same line. The first occurrence wins,
* which keeps direction and `source` deterministic across renders.
*/
function uniqueLinks(result) {
	const seen = /* @__PURE__ */ new Set();
	const links = [];
	for (const edge of result.edges) {
		const key = edge.from < edge.to ? edge.from + "\0" + edge.to : edge.to + "\0" + edge.from;
		if (seen.has(key)) continue;
		seen.add(key);
		links.push(edge);
	}
	return links;
}
/** Visual hierarchy comes only from real, undirected link degree. */
function graphStructure(result) {
	const degree = new Map(result.pages.map((page) => [page.pageId, 0]));
	const neighbors = new Map(result.pages.map((page) => [page.pageId, /* @__PURE__ */ new Set()]));
	const links = uniqueLinks(result).filter((edge) => edge.from !== edge.to && degree.has(edge.from) && degree.has(edge.to));
	for (const edge of links) {
		degree.set(edge.from, degree.get(edge.from) + 1);
		degree.set(edge.to, degree.get(edge.to) + 1);
		neighbors.get(edge.from).add(edge.to);
		neighbors.get(edge.to).add(edge.from);
	}
	const limit = Math.min(10, Math.max(1, Math.ceil(result.pages.length * .1)));
	return {
		degree,
		neighbors,
		hubs: new Set([...degree].filter(([, value]) => value >= 10).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([id]) => id)),
		links
	};
}
/** Deterministic, bounded layout: FA2 clusters real links, noverlap separates hubs. */
function layoutGraph(result) {
	const { degree, hubs, links } = graphStructure(result);
	const graph = new Graph({
		multi: true,
		allowSelfLoops: false
	});
	const ordered = [...result.pages].sort((a, b) => a.pageId.localeCompare(b.pageId));
	const nodes = /* @__PURE__ */ new Map();
	ordered.forEach((page, index) => {
		const count = degree.get(page.pageId) ?? 0;
		const hub = hubs.has(page.pageId);
		const angle = index * 2.399963229728653;
		const radius = Math.sqrt(index + 1) * 8;
		const node = {
			page,
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			size: hub ? Math.min(9, 6 + Math.sqrt(count) * .3) : 3.4 + Math.min(2.2, Math.sqrt(count) * .35),
			degree: count,
			hub,
			labelSize: hub ? 15 : 12
		};
		nodes.set(page.pageId, node);
		graph.addNode(page.pageId, {
			...node,
			label: page.title,
			color: hub ? "#c7e4fa" : "#829ab2",
			labelColor: hub ? "#eef6ff" : "#c2cfdd",
			labelSize: node.labelSize,
			labelVisibility: hub ? "visible" : "auto",
			zIndex: hub ? 2 : 1
		});
	});
	links.forEach((edge, index) => {
		const structural = Math.max(degree.get(edge.from) ?? 0, degree.get(edge.to) ?? 0) >= 20;
		graph.addEdgeWithKey("edge-" + index, edge.from, edge.to, {
			source: edge.source,
			path: "curved",
			color: structural ? "#405a72" : "#2e4053",
			size: structural ? .8 : .55,
			opacity: structural ? .62 : .4
		});
	});
	const inferred = import_graphology_layout_forceatlas2.default.inferSettings(graph);
	import_graphology_layout_forceatlas2.default.assign(graph, {
		iterations: graph.order < 10 ? 80 : 180,
		settings: {
			...inferred,
			gravity: 1.6,
			scalingRatio: 12,
			slowDown: 5,
			barnesHutOptimize: graph.order > 60
		}
	});
	import_graphology_layout_noverlap.default.assign(graph, {
		maxIterations: 140,
		inputReducer: (id, attrs) => ({
			x: attrs.x,
			y: attrs.y,
			size: hubs.has(id) ? 34 : 12
		}),
		settings: {
			margin: 4,
			ratio: 1,
			expansion: 1.15,
			speed: 2
		}
	});
	graph.forEachNode((id, attrs) => {
		const node = nodes.get(id);
		node.x = attrs.x;
		node.y = attrs.y;
	});
	return {
		graph,
		nodes,
		hubs
	};
}
//#endregion
//#region src/client/graph-style.ts
const rgba = (hex, alpha) => {
	const value = parseInt(hex.slice(1), 16);
	return "rgba(" + (value >> 16) + "," + (value >> 8 & 255) + "," + (value & 255) + "," + alpha + ")";
};
function applyParallelCurvatures(layout) {
	layout.graph.forEachEdge((id, attrs) => {
		const index = typeof attrs.parallelIndex === "number" ? attrs.parallelIndex : 0;
		layout.graph.setEdgeAttribute(id, "curvature", .12 + index * .18);
	});
}
function applyGraphEmphasis(instance, layout, structure, activePageId, matches) {
	const neighborhood = new Set(activePageId === null ? [] : [activePageId]);
	if (activePageId !== null) for (const id of structure.neighbors.get(activePageId) ?? []) neighborhood.add(id);
	instance.setSetting("nodeReducer", (id, data) => {
		const node = layout.nodes.get(id);
		const active = id === activePageId;
		const dim = activePageId !== null && !neighborhood.has(id);
		const color = active ? "#8bc7f4" : matches.has(id) ? "#efc366" : node.hub ? "#c7e4fa" : "#829ab2";
		const labelColor = active ? "#ffffff" : matches.has(id) ? "#ffe4a6" : node.hub ? "#eef6ff" : "#c2cfdd";
		return {
			...data,
			color: dim ? rgba(color, .24) : color,
			labelColor: dim ? rgba(labelColor, .2) : labelColor,
			labelSize: active ? 17 : node.hub ? 15 : 12,
			forceLabel: active || matches.has(id),
			size: node.size * (active ? 1.35 : 1),
			zIndex: active ? 4 : matches.has(id) ? 3 : node.hub ? 2 : 1
		};
	});
	instance.setSetting("edgeReducer", (id, data) => {
		const source = layout.graph.source(id), target = layout.graph.target(id);
		const active = activePageId !== null && (source === activePageId || target === activePageId);
		const structural = Math.max(structure.degree.get(source) ?? 0, structure.degree.get(target) ?? 0) >= 20;
		const color = active ? "#8bc7f4" : structural ? "#405a72" : "#2e4053";
		return {
			...data,
			color: activePageId !== null && !active ? rgba(color, .14) : color,
			size: active ? 1.6 : structural ? .8 : .55,
			zIndex: active ? 2 : 0
		};
	});
	instance.refresh();
}
//#endregion
//#region src/client/icons.tsx
const paths = {
	search: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
		cx: "10.5",
		cy: "10.5",
		r: "6.5"
	}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m16 16 4 4" })] }),
	close: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m6 6 12 12M6 18 18 6" }),
	graph: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
			cx: "6",
			cy: "6",
			r: "2.5"
		}),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
			cx: "18",
			cy: "8",
			r: "2.5"
		}),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
			cx: "9",
			cy: "19",
			r: "2.5"
		}),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m8.5 6.5 7 1M6.5 8.5l2 8m2-1 6-5" })
	] }),
	plus: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" }),
	minus: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5 12h14" }),
	fit: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5" }),
	arrow: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m9 6 6 6-6 6" }),
	refresh: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M20 7v5h-5M4 17v-5h5" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6 7a7 7 0 0 1 11-2l3 4M4 15l3 4a7 7 0 0 0 11-2" })] }),
	back: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m10 5-7 7 7 7M3 12h18" })
};
function Icon({ name }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: paths[name]
	});
}
//#endregion
//#region src/client/EvidenceGraph.tsx
const motion = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FONT = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", sans-serif";
const curves = createEdgeCurveProgram({ defaultCurvature: .12 });
function drawLabel(context, data) {
	if (!data.label) return;
	const size = data.labelSize ?? 13;
	context.font = (data.hub ? "600 " : "400 ") + size + "px -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", sans-serif";
	context.fillStyle = data.labelColor ?? "#c2cfdd";
	context.lineWidth = 3;
	context.strokeStyle = "#171f27";
	context.lineJoin = "round";
	context.strokeText(data.label, data.x + data.size + 6, data.y + size / 3);
	context.fillText(data.label, data.x + data.size + 6, data.y + size / 3);
}
function Canvas({ visible = true, graph, activePageId, onSelect, matches, drawer, reset }) {
	const host = (0, react.useRef)(null);
	const renderer = (0, react.useRef)(null);
	const select = (0, react.useRef)(onSelect);
	const visibleRef = (0, react.useRef)(visible);
	visibleRef.current = visible;
	const focused = (0, react.useRef)(null);
	const [generation, setGeneration] = (0, react.useState)(0);
	const [failed, setFailed] = (0, react.useState)(false);
	const [zoom, setZoom] = (0, react.useState)(100);
	const layout = (0, react.useMemo)(() => layoutGraph(graph), [graph]);
	const structure = (0, react.useMemo)(() => graphStructure(graph), [graph]);
	select.current = onSelect;
	(0, react.useEffect)(() => {
		const element = host.current;
		if (!element) return;
		const mount = document.createElement("div");
		mount.className = "memory-wiki-panel__sigma-instance";
		element.appendChild(mount);
		let instance = null;
		let frame = 0;
		let observer = null;
		let detachContextListeners = () => {};
		const disposeRenderer = () => {
			observer?.disconnect();
			observer = null;
			if (frame !== 0) cancelAnimationFrame(frame);
			frame = 0;
			detachContextListeners();
			detachContextListeners = () => {};
			const previous = instance;
			instance = null;
			renderer.current = null;
			if (previous !== null) {
				previous.getCamera().removeAllListeners("updated");
				previous.kill();
			}
		};
		const cleanup = () => {
			disposeRenderer();
			mount.remove();
		};
		const create = () => {
			try {
				indexParallelEdgesIndex(layout.graph);
				applyParallelCurvatures(layout);
				const next = new Sigma(layout.graph, mount, {
					defaultEdgeType: "curved",
					edgeProgramClasses: { curved: curves },
					defaultDrawNodeLabel: drawLabel,
					labelColor: {
						attribute: "labelColor",
						color: "#c2cfdd"
					},
					labelFont: FONT,
					labelWeight: "400",
					autoRescale: true,
					autoCenter: true,
					itemSizesReference: "screen",
					labelDensity: .7,
					labelGridCellSize: 165,
					labelRenderedSizeThreshold: 7,
					hideEdgesOnMove: false,
					hideLabelsOnMove: false,
					enableEdgeEvents: false,
					zIndex: true,
					minCameraRatio: .08,
					maxCameraRatio: 5,
					zoomingRatio: 1.22,
					zoomDuration: motion() ? 100 : 0,
					stagePadding: 48,
					minEdgeThickness: .45,
					allowInvalidContainer: false
				});
				instance = next;
				renderer.current = next;
				next.on("clickNode", ({ node }) => select.current(node));
				next.getCamera().on("updated", () => {
					if (frame !== 0) return;
					frame = requestAnimationFrame(() => {
						frame = 0;
						if (instance === next) setZoom(Math.round(100 / next.getCamera().ratio));
					});
				});
				const lost = (event) => {
					if (instance !== next) return;
					event.preventDefault();
					setFailed(true);
				};
				const restored = () => {
					if (instance !== next) return;
					disposeRenderer();
					mount.replaceChildren();
					create();
				};
				const canvases = Object.values(next.getCanvases());
				for (const canvas of canvases) {
					canvas.addEventListener("webglcontextlost", lost);
					canvas.addEventListener("webglcontextrestored", restored, { once: true });
				}
				detachContextListeners = () => {
					for (const canvas of canvases) {
						canvas.removeEventListener("webglcontextlost", lost);
						canvas.removeEventListener("webglcontextrestored", restored);
					}
				};
				observer = new ResizeObserver(() => {
					if (instance === next && mount.clientWidth > 0 && mount.clientHeight > 0) next.resize();
				});
				observer.observe(mount);
				next.resize();
				setFailed(false);
				setGeneration((value) => value + 1);
			} catch (error) {
				console.error("memory-wiki: graph renderer initialization failed", error);
				cleanup();
				setFailed(true);
			}
		};
		create();
		return cleanup;
	}, [layout]);
	(0, react.useEffect)(() => {
		if (visible && renderer.current !== null) applyGraphEmphasis(renderer.current, layout, structure, activePageId, matches);
	}, [
		activePageId,
		matches,
		layout,
		structure,
		generation,
		visible
	]);
	(0, react.useEffect)(() => {
		const instance = renderer.current;
		if (!visible || !instance || !host.current) return;
		instance.resize();
		instance.refresh();
		if (activePageId === null) {
			focused.current = null;
			return;
		}
		if (focused.current?.layout === layout && focused.current.page === activePageId && focused.current.drawer === drawer) return;
		if (!layout.graph.hasNode(activePageId) || host.current.clientWidth < 700) return;
		const camera = instance.getCamera();
		focused.current = {
			layout,
			page: activePageId,
			drawer
		};
		const state = camera.getState();
		const node = instance.getNodeDisplayData(activePageId);
		if (!node) return;
		const width = (drawer ? host.current.closest(".memory-wiki-panel__workspace")?.querySelector(".memory-wiki-panel__drawer:not([hidden])") : null)?.offsetLeft ?? host.current.clientWidth;
		const height = host.current.clientHeight;
		const target = instance.viewportToFramedGraph({
			x: width / 2,
			y: height / 2
		}, { cameraState: state });
		camera.animate({
			x: state.x + node.x - target.x,
			y: state.y + node.y - target.y
		}, { duration: motion() ? 220 : 0 });
	}, [
		activePageId,
		drawer,
		layout,
		generation,
		visible
	]);
	const fit = () => {
		const instance = renderer.current;
		if (!instance) return;
		instance.getCamera().disable();
		instance.resize(true);
		instance.getCamera().setState({
			x: .5,
			y: .5,
			angle: 0,
			ratio: 1
		});
		instance.getCamera().enable();
		instance.refresh();
	};
	(0, react.useEffect)(() => {
		if (reset > 0 && visibleRef.current) fit();
	}, [reset]);
	const zoomCamera = (direction) => {
		const camera = renderer.current?.getCamera();
		if (!camera) return;
		camera.animate({ ratio: camera.getBoundedRatio(camera.ratio * (direction > 0 ? 1 / 1.35 : 1.35)) }, { duration: motion() ? 140 : 0 });
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "memory-wiki-panel__graph",
		"data-testid": "mw-graph",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: host,
				className: "memory-wiki-panel__sigma",
				"aria-hidden": "true"
			}),
			failed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__graph-fallback",
				role: "alert",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "当前环境无法绘制图谱" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "WebGL 暂不可用。你仍可使用顶部搜索，或从下面的页面索引打开知识。" })]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
				className: "memory-wiki-panel__page-index",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: ["页面索引", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: graph.pages.length })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: graph.pages.map((page) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "mw-node",
					"data-page-id": page.pageId,
					className: page.pageId === activePageId ? "is-active" : "",
					onClick: () => onSelect(page.pageId),
					"aria-pressed": page.pageId === activePageId,
					children: page.title
				}, page.pageId)) })]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__canvas-tools",
				"aria-label": "图谱视图",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						"data-testid": "mw-graph-facts",
						children: [
							graph.pages.length,
							" 页 · ",
							structure.links.length,
							" 条连接"
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "缩小",
						onClick: () => zoomCamera(-1),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "minus" })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__zoom",
						"data-testid": "mw-zoom",
						children: [zoom, "%"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "放大",
						onClick: () => zoomCamera(1),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "plus" })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "显示完整图谱",
						onClick: fit,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "fit" })
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__graph-legend",
				"data-testid": "mw-legend",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: "is-hub" }), "枢纽页"] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}), "普通页"] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "正文与 related 链接" })
				]
			})
		]
	});
}
function EvidenceGraph(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Canvas, { ...props });
}
//#endregion
//#region src/core/markdown.ts
/** Split into lines, dropping a single trailing empty line produced by a final newline. */
function toLines(text) {
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
	return lines;
}
const FENCE_RE = /^\s*(`{3,}|~{3,})(.*)$/;
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const HR_RE = /^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/;
const TABLE_RE = /^\s*\|/;
const QUOTE_RE = /^\s{0,3}>/;
const LIST_RE = /^\s*(?:[-*+]|\d{1,9}[.)])\s+/;
const HTML_RE = /^\s*<([A-Za-z][A-Za-z0-9-]*)/;
/**
* Split a page body into atomic Markdown blocks.
*
* Atomic means: a fenced code block is one block, a table is one block, a
* heading is its own block. The compiler may drop a whole block but must never
* hand the model half a fence or half a table (design §5.2).
*/
function splitBlocks(body, bodyStartLine) {
	const lines = toLines(body);
	const blocks = [];
	const headingStack = [];
	const currentPath = () => headingStack.map((entry) => entry.text);
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (line.trim().length === 0) {
			i += 1;
			continue;
		}
		const startIndex = i;
		const fence = FENCE_RE.exec(line);
		if (fence) {
			const marker = fence[1];
			const markerChar = marker[0];
			let j = i + 1;
			while (j < lines.length) {
				const candidate = lines[j].trim();
				if (candidate.length >= marker.length && candidate.split("").every((ch) => ch === markerChar)) {
					j += 1;
					break;
				}
				j += 1;
			}
			const text = lines.slice(startIndex, j).join("\n");
			blocks.push({
				kind: "code",
				startLine: bodyStartLine + startIndex,
				endLine: bodyStartLine + j - 1,
				headingPath: currentPath(),
				text
			});
			i = j;
			continue;
		}
		const heading = HEADING_RE.exec(line);
		if (heading) {
			const level = heading[1].length;
			const text = heading[2].trim();
			while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= level) headingStack.pop();
			blocks.push({
				kind: "heading",
				level,
				startLine: bodyStartLine + i,
				endLine: bodyStartLine + i,
				headingPath: currentPath(),
				text: line
			});
			headingStack.push({
				level,
				text
			});
			i += 1;
			continue;
		}
		if (HR_RE.test(line)) {
			blocks.push({
				kind: "hr",
				startLine: bodyStartLine + i,
				endLine: bodyStartLine + i,
				headingPath: currentPath(),
				text: line
			});
			i += 1;
			continue;
		}
		if (TABLE_RE.test(line)) {
			let j = i;
			while (j < lines.length && TABLE_RE.test(lines[j])) j += 1;
			blocks.push({
				kind: "table",
				startLine: bodyStartLine + i,
				endLine: bodyStartLine + j - 1,
				headingPath: currentPath(),
				text: lines.slice(i, j).join("\n")
			});
			i = j;
			continue;
		}
		if (QUOTE_RE.test(line)) {
			let j = i;
			while (j < lines.length && QUOTE_RE.test(lines[j])) j += 1;
			blocks.push({
				kind: "quote",
				startLine: bodyStartLine + i,
				endLine: bodyStartLine + j - 1,
				headingPath: currentPath(),
				text: lines.slice(i, j).join("\n")
			});
			i = j;
			continue;
		}
		if (LIST_RE.test(line)) {
			let j = i;
			while (j < lines.length) {
				const candidate = lines[j];
				if (candidate.trim().length === 0) break;
				if (LIST_RE.test(candidate) || /^\s{2,}\S/.test(candidate)) {
					j += 1;
					continue;
				}
				break;
			}
			blocks.push({
				kind: "list",
				startLine: bodyStartLine + i,
				endLine: bodyStartLine + j - 1,
				headingPath: currentPath(),
				text: lines.slice(i, j).join("\n")
			});
			i = j;
			continue;
		}
		if (HTML_RE.test(line)) {
			let j = i;
			while (j < lines.length && lines[j].trim().length > 0) j += 1;
			blocks.push({
				kind: "html",
				startLine: bodyStartLine + i,
				endLine: bodyStartLine + j - 1,
				headingPath: currentPath(),
				text: lines.slice(i, j).join("\n")
			});
			i = j;
			continue;
		}
		let j = i;
		while (j < lines.length) {
			const candidate = lines[j];
			if (candidate.trim().length === 0) break;
			if (j > i && (FENCE_RE.test(candidate) || HEADING_RE.test(candidate) || HR_RE.test(candidate) || TABLE_RE.test(candidate) || QUOTE_RE.test(candidate) || LIST_RE.test(candidate) || HTML_RE.test(candidate))) break;
			j += 1;
		}
		blocks.push({
			kind: "paragraph",
			startLine: bodyStartLine + i,
			endLine: bodyStartLine + j - 1,
			headingPath: currentPath(),
			text: lines.slice(i, j).join("\n")
		});
		i = j;
	}
	return blocks;
}
//#endregion
//#region src/client/MarkdownView.tsx
/**
* Markdown surface for the panel.
*
* Renders blocks produced by `core/markdown.ts` — the plugin's single parser
* (design §4.2) — instead of pulling a second Markdown pipeline into the client
* bundle. A GFM pipeline (react-markdown + remark-gfm) was tried first and
* could not load: `react-markdown -> vfile` needs `node:path` and
* `node:process`, which the host module table does not provide, and the client
* build config is not mine to alias. What the wiki actually contains (headings,
* paragraphs, lists, tables, fenced code, quotes, wikilinks, inline code/bold)
* is covered here; anything unsupported falls back to verbatim text, never to
* silently dropped content.
*/
const INLINE = /\*\*([^*]+)\*\*|`([^`]+)`|\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\(([^)]+)\)/g;
function inline(text) {
	const out = [];
	let last = 0;
	let match;
	let key = 0;
	INLINE.lastIndex = 0;
	while ((match = INLINE.exec(text)) !== null) {
		if (match.index > last) out.push(text.slice(last, match.index));
		const keyValue = "i" + key++;
		if (match[1] !== void 0) out.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: match[1] }, keyValue));
		else if (match[2] !== void 0) out.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: match[2] }, keyValue));
		else if (match[3] !== void 0) out.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "memory-wiki-panel__wikilink",
			title: match[3],
			children: match[4] ?? match[3]
		}, keyValue));
		else if (match[5] !== void 0 && match[6] !== void 0) out.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
			href: match[6],
			target: "_blank",
			rel: "noreferrer noopener",
			children: match[5]
		}, keyValue));
		last = match.index + match[0].length;
	}
	if (last < text.length) out.push(text.slice(last));
	return out;
}
function splitRow(line) {
	return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}
function renderTable(block) {
	const rows = block.text.split("\n").filter((line) => line.trim().startsWith("|"));
	if (rows.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
		className: "memory-wiki-panel__md-fallback",
		children: block.text
	});
	const header = splitRow(rows[0] ?? "");
	const isDelimiter = (line) => splitRow(line).every((cell) => /^:?-{1,}:?$/.test(cell));
	const bodyRows = rows.slice(1).filter((line) => !isDelimiter(line));
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: header.map((cell, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: inline(cell) }, index)) }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: bodyRows.map((line, rowIndex) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: splitRow(line).map((cell, cellIndex) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: inline(cell) }, cellIndex)) }, rowIndex)) })] });
}
function renderList(block) {
	const lines = block.text.split("\n").filter((line) => line.trim().length > 0);
	const ordered = /^\s*\d+[.)]\s/.test(lines[0] ?? "");
	const children = lines.map((line) => line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "")).map((item, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: inline(item) }, index));
	return ordered ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", { children }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children });
}
function renderBlock(block, index) {
	const key = "b" + index;
	switch (block.kind) {
		case "heading": {
			const Tag = "h" + Math.min(Math.max(block.level ?? 2, 1), 4);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tag, { children: inline(block.text.replace(/^#+\s*/, "")) }, key);
		}
		case "paragraph": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: inline(block.text.replace(/\n+/g, " ")) }, key);
		case "list": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react.Fragment, { children: renderList(block) }, key);
		case "table": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react.Fragment, { children: renderTable(block) }, key);
		case "code": {
			const body = block.text.replace(/^\s*```[^\n]*\n?/, "").replace(/\n?```\s*$/, "");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: body }) }, key);
		}
		case "quote": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("blockquote", { children: inline(block.text.replace(/^>\s?/gm, "")) }, key);
		case "hr": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", {}, key);
		default: return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
			className: "memory-wiki-panel__md-fallback",
			children: block.text
		}, key);
	}
}
function MarkdownView(props) {
	const parsed = splitBlocks(props.source, 1);
	const first = parsed[0];
	const blocks = props.title !== void 0 && first?.kind === "heading" && first.text.replace(/^#+\s*/, "").trim() === props.title ? parsed.slice(1) : parsed;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "memory-wiki-panel__md" + (props.compact === true ? " is-compact" : ""),
		"data-testid": props.testId ?? "mw-md",
		"data-blocks": blocks.length,
		children: blocks.map((block, index) => renderBlock(block, index))
	});
}
//#endregion
//#region src/client/CandidateList.tsx
const REASON_LABEL = {
	budget: "额度不足",
	"no-usable-block": "无可用块",
	"not-selected": "未选入"
};
function reasonLabel(reason) {
	return reason === void 0 ? null : REASON_LABEL[reason] ?? reason;
}
//#endregion
//#region src/client/SourceDetail.tsx
/**
* Detail pane. All page facts come from the core WikiPage DTO returned by
* `source.readPage`; the fragment boundaries come ONLY from the caller, which
* for the server view means `view.draft.preview.sources[].segments` (B9).
*
* Two things were removed on purpose:
*   - `excerptOf()`: it sliced `page.body` by line range and re-joined the
*     pieces. That made the panel a second Markdown compiler and let a
*     whole-page body be presented as "this turn's fragment".
*   - the fallback to `page.body` when no boundary existed: absence must be
*     visible as 服务端未提供片段边界, not silently filled with more text.
*
* The exact submitted text stays where the server put it: `draft.preview.text`
* (see 草稿预览). The client never assembles it.
*/
function SourceDetail(props) {
	const { candidate, page, loading, error, segments, selected } = props;
	const [showBody, setShowBody] = (0, react.useState)(false);
	if (candidate === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "memory-wiki-panel__detail",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
			className: "memory-wiki-panel__excerpt-note",
			children: "候选里选一页，这里显示它的片段边界与命中依据。"
		})
	});
	const excluded = reasonLabel(candidate.excludedReason);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "memory-wiki-panel__scroll memory-wiki-panel__detail",
		"data-testid": "mw-detail",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
				className: "memory-wiki-panel__detail-title",
				"data-testid": "mw-detail-title",
				children: candidate.title
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "memory-wiki-panel__detail-path",
				children: candidate.pageId
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__detail-meta",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "memory-wiki-panel__chip",
						children: page?.kind ?? "…"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__chip",
						children: ["资料日期 ", page?.asOf ?? candidate.asOf ?? "未提供"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__chip",
						children: ["confidence ", page?.confidence ?? "未提供"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__chip",
						"data-testid": "mw-detail-hash",
						children: ["页面哈希 ", candidate.contentHash.slice(0, 12)]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "memory-wiki-panel__chip",
						"data-testid": "mw-detail-selected",
						children: selected ? "已选入本轮" : excluded ?? "未选入"
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
				className: "memory-wiki-panel__subhead",
				children: selected ? "将使用的片段边界" : "候选片段边界（本轮未取用）"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "memory-wiki-panel__segments",
				"data-testid": "mw-segments",
				children: segments === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "memory-wiki-panel__segment",
					"data-testid": "mw-segments-missing",
					children: "服务端未提供片段边界"
				}) : segments.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "memory-wiki-panel__segment",
					children: "无"
				}) : segments.map((segment) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "memory-wiki-panel__segment",
					children: [
						segment.startLine,
						"-",
						segment.endLine
					]
				}, segment.startLine + "-" + segment.endLine))
			}),
			error !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
				className: "memory-wiki-panel__excerpt-note",
				"data-testid": "mw-page-error",
				role: "alert",
				children: ["readPage 失败：", error]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "memory-wiki-panel__excerpt",
				"data-testid": "mw-excerpt",
				children: loading ? "正在读取页面…" : segments === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"data-testid": "mw-excerpt-unavailable",
					children: "没有服务端片段边界，这里不拼正文，也不拿整页冒充片段。"
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "memory-wiki-panel__excerpt-note",
					children: "片段正文以服务端编译结果为准（见「草稿预览」的 text）；本面板不切片、不拼接。"
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "memory-wiki-panel__excerpt-note",
				children: "行段为一基文件行号（含 frontmatter）。字符口径 UTF-16 code units。"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
				className: "memory-wiki-panel__subhead",
				children: "命中依据"
			}),
			candidate.match === "direct" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__chips",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__chip",
						children: ["直接命中 · rank ", candidate.rank]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__chip",
						children: ["score ", candidate.score.toFixed(2)]
					}),
					candidate.why.map((term) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "memory-wiki-panel__chip memory-wiki-panel__chip--why",
						children: term
					}, term))
				]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__chips",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "memory-wiki-panel__chip",
					children: "关联候选"
				}), candidate.viaPageId !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "memory-wiki-panel__chip",
					children: ["经由 ", candidate.viaPageId]
				})]
			}),
			excluded !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
				className: "memory-wiki-panel__excerpt-note",
				"data-testid": "mw-detail-reason",
				children: [
					"未选入原因：",
					excluded,
					"（",
					candidate.excludedReason,
					"）"
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__toolbar",
				style: { marginTop: 10 },
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "memory-wiki-panel__seg",
					"data-testid": "mw-toggle-body",
					"aria-pressed": showBody,
					onClick: () => setShowBody((value) => !value),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: showBody ? "is-current" : "",
						style: { padding: "2px 8px" },
						children: showBody ? "收起整页正文" : "读取整页正文（readPage）"
					})
				}), page !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "memory-wiki-panel__excerpt-note",
					"data-testid": "mw-page-facts",
					children: [
						page.totalLines,
						" 行 · body 从第 ",
						page.bodyStartLine,
						" 行起 · 哈希 ",
						page.contentHash.slice(0, 12),
						page.truncated ? " · 已截断" : ""
					]
				})]
			}),
			showBody && page !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "memory-wiki-panel__excerpt memory-wiki-panel__excerpt--full",
				"data-testid": "mw-body",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownView, {
					source: page.body,
					testId: "mw-body-md"
				})
			})
		]
	});
}
//#endregion
//#region src/client/source/error-hints.ts
/**
* Business error codes → what the user can actually do.
*
* The contract returns errors as data (`value.error`), not exceptions, so the
* panel must translate every code instead of showing "call failed".
*/
const HINTS = {
	"wiki-unavailable": "暂时无法读取 Wiki：请检查插件中的 wikiRoot 设置后重试。",
	"unknown-session": "会话已不存在或无权访问：请重新打开一个会话，本面板不会自行创建。",
	"stale-revision": "视图已过期：点按钮读取服务端最新视图，确认当前选择后再操作。",
	"library-changed": "知识库在准备之后变更了：请重新预览再准备（旧选择不会自动沿用）。",
	"nothing-selected": "当前没有选中任何页面：先从候选里选入，或等自动检索结果。",
	"unknown-page": "页面不在当前知识库里：可能已被删除或改名。",
	"page-version-mismatch": "页面内容在准备之后变了：请重新预览，不要沿用旧快照。",
	"manual-over-budget": "手选超出额度：扩大额度或减少页面，客户端不会替你截断。",
	"no-usable-block": "所选页面没有可用的完整块：换一页，或缩小到有正文片段的部分。"
};
function hintFor(code, fallback) {
	if (code === void 0) return fallback;
	return HINTS[code] ?? fallback;
}
function describeBusinessError(error) {
	if (error === null || typeof error !== "object") return "服务端返回错误，但格式无法识别。";
	const record = error;
	const code = typeof record.code === "string" ? record.code : void 0;
	return hintFor(code, "服务端返回未知错误" + (code === void 0 ? "" : "（" + code + "）"));
}
//#endregion
//#region src/client/source/unwrap.ts
var RemoteCallError = class extends Error {
	code;
	detail;
	constructor(code, message, detail) {
		super(message);
		this.name = "RemoteCallError";
		this.code = code;
		this.detail = detail;
	}
};
/** Throws RemoteCallError for `{ok:false}`; returns the value otherwise. */
function unwrap(result) {
	if (result === null || typeof result !== "object") throw new RemoteCallError("malformed-result", "remote returned " + typeof result);
	const envelope = result;
	if (envelope.ok === true) return envelope.value;
	if (envelope.ok === false) {
		const detail = envelope.error ?? {};
		throw new RemoteCallError(typeof detail.code === "string" ? detail.code : "remote-failure", typeof detail.message === "string" ? detail.message : "remote call failed", detail);
	}
	return result;
}
//#endregion
//#region src/client/source/remote-source.ts
/**
* Turn a structured business error into one readable line.
*
* D22: errors are fields, not exceptions. The *numbers* the user needs
* (`expected`/`actual`, `overBy`) are rendered here verbatim — the panel then
* adds the action hint from `error-hints.ts`.
*/
function errorDetail(error) {
	switch (error.code) {
		case "capture-unavailable": return "暂时无法读取沉淀记录，请检查本地存储后重试。";
		case "capture-record-unavailable": return "记录不存在或不属于当前会话。";
		case "capture-invalid-query": return "记录查询参数无效：" + error.field;
		case "wiki-unavailable": return error.reason === "not-configured" ? "尚未设置 Wiki 路径，请在插件设置中配置 wikiRoot。" : "暂时无法读取 Wiki，请检查配置的目录是否可访问后重试。";
		case "stale-revision": return "面板带着 revision " + error.expected + " 发起写操作，服务端已是 " + error.actual;
		case "unknown-page": return "页面不在当前知识库：" + error.pageId;
		case "library-changed": return "准备之后知识库版本变了（期望 " + error.expected.slice(0, 12) + "，实际 " + error.actual.slice(0, 12) + "）";
		case "page-version-mismatch": return error.pageId + " 的内容已变化（期望 " + error.expected.slice(0, 12) + "，实际 " + error.actual.slice(0, 12) + "）";
		case "manual-over-budget": return "超出 " + error.overBy + " 字符（预算 " + error.budgetChars + "，选中 " + error.selectedChars + "）";
		case "nothing-selected": return "当前没有选中任何页面";
		case "unknown-session": return "会话不存在或无权访问：" + error.sessionId;
		default: return "服务端返回未知错误";
	}
}
/** `PageDocument` → panel page. Line offsets are passed through, never derived. */
function pageView(page) {
	return {
		pageId: page.pageId,
		title: page.title,
		kind: page.kind,
		contentHash: page.contentHash,
		...page.asOf === void 0 ? {} : { asOf: page.asOf },
		body: page.body,
		bodyStartLine: page.bodyStartLine,
		totalLines: page.totalLines,
		...page.truncated ? {
			truncated: true,
			limitChars: page.limitChars,
			fullChars: page.fullChars
		} : {}
	};
}
function createRemoteSource(client, reason) {
	const requireClient = () => {
		if (client === void 0) throw new RemoteCallError("not-wired", "remote source not wired (" + reason + ")");
		return client;
	};
	return {
		mode: "remote",
		async captureStatus(input) {
			const result = unwrap(await requireClient().captureStatus(input));
			if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error));
			return result;
		},
		async captureHistory(input) {
			const result = unwrap(await requireClient().captureHistory(input));
			if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error));
			return result;
		},
		async captureRecord(input) {
			const result = unwrap(await requireClient().captureRecord(input));
			if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error));
			return result;
		},
		async captureJudgment(input) {
			const result = unwrap(await requireClient().captureJudgment(input));
			if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error));
			return result;
		},
		async getGraph() {
			const result = unwrap(await requireClient().graph({}));
			if (result.error !== void 0) throw new RemoteCallError(result.error.code, errorDetail(result.error));
			return result;
		},
		/** `SessionView` → view model. Field-for-field, no recomputation. */
		async getView(request) {
			const view = unwrap(await requireClient().getView({ sessionId: request.sessionId }));
			return {
				revision: view.revision,
				mode: view.mode,
				budgetChars: view.budgetChars,
				hops: view.hops,
				draft: view.draft,
				prepared: view.prepared,
				currentTurn: view.currentTurn,
				capture: view.capture,
				skippedReason: view.skippedReason,
				error: view.error
			};
		},
		/** `SearchResult` → `RetrievalReport`. Candidate/edge arrays are core DTOs. */
		async search(request) {
			const result = unwrap(await requireClient().search({
				query: request.query,
				hops: request.hops,
				...request.sessionId === null || request.sessionId === void 0 ? {} : { sessionId: request.sessionId }
			}));
			if (result.error !== void 0) throw new RemoteCallError(result.error.code, errorDetail(result.error));
			return {
				libraryRevision: result.libraryRevision,
				query: result.query,
				hops: result.hops,
				candidates: result.candidates,
				edges: result.edges
			};
		},
		/**
		* `PageDocument` → `PageView`.
		*
		* `bodyStartLine` arrives as a file line (D25) and is kept as-is, so the
		* segment labels in "本轮依据" and the body shown here share one coordinate
		* system. `confidence` has no home in `PageDocument`, so it stays undefined
		* and the detail pane says 未提供 rather than inventing one.
		*/
		async readPage(request) {
			const result = unwrap(await requireClient().readPage({
				pageId: request.pageId,
				...request.contentHash === void 0 ? {} : { contentHash: request.contentHash }
			}));
			if (result.page === void 0) {
				const error = result.error;
				if (error === void 0) throw new RemoteCallError("unknown-page", "readPage returned no page for " + request.pageId);
				throw new RemoteCallError(error.code, errorDetail(error));
			}
			return pageView(result.page);
		},
		/**
		* Replace the server-owned draft with this selection.
		*
		* The result is returned whole (including `error`): a rejected revise still
		* carries the server's new mode and revision, and swallowing that would make
		* the panel show a state the server no longer has (D22).
		*/
		async reviseDraft(request) {
			return unwrap(await requireClient().reviseDraft(request));
		},
		/** Freeze the draft for the next human turn; preparing never commits (design §8.1). */
		async prepareOverride(request) {
			return unwrap(await requireClient().prepareOverride(request));
		},
		/** Drop a still-unconsumed override and return to automatic. */
		async clearOverride(request) {
			return unwrap(await requireClient().clearOverride(request));
		}
	};
}
//#endregion
//#region src/client/session-guard.ts
const WRITE_LABEL = {
	"revise-draft": "应用改选",
	"prepare-override": "准备覆盖",
	"clear-override": "清除覆盖"
};
/**
* B4: an unbound panel has no session to talk to.
*
* `null`/empty is NOT "the default session": sending `sessionId: null` to the
* server would be a request for someone else's state.
*/
function boundSession(sessionId) {
	return typeof sessionId === "string" && sessionId.length > 0;
}
function launchScope(sessionId) {
	return boundSession(sessionId) ? { sessionId } : null;
}
/**
* B3: an answer may only reach the UI when the panel is STILL showing the
* session that asked. Anything else is dropped, not merged.
*/
function stillCurrent(scope, currentSessionId) {
	return boundSession(currentSessionId) && currentSessionId === scope.sessionId;
}
/** B7: monotonic ids; a late search answer must not beat a newer one. */
function nextRequestId(current) {
	return current + 1;
}
function isCurrentRequest(id, latest) {
	return id === latest;
}
function effectiveSelection(draftSelected, override) {
	const out = [];
	for (const page of draftSelected) {
		if (override[page.pageId] === false) continue;
		if (!out.includes(page.pageId)) out.push(page.pageId);
	}
	for (const pageId of Object.keys(override)) {
		if (override[pageId] !== true) continue;
		if (!out.includes(pageId)) out.push(pageId);
	}
	return out;
}
/** B8: toggling a row flips it relative to what is currently shown. */
function toggleSelection(current, pageId, selected) {
	const next = { ...current };
	next[pageId] = !selected;
	return next;
}
/**
* B6: "应用改选（N 页）" must show the number of pages that will be sent, not
* the number of rows the user clicked. A selected page without a
* `contentHash` cannot be pinned, so the server could only guess which version
* was meant — it is reported as 未冻结·不可提交 and blocks the submit.
*/
function committableSelection(pageIds, view, candidates) {
	const hashes = /* @__PURE__ */ new Map();
	for (const candidate of candidates) if (candidate.contentHash.length > 0) hashes.set(candidate.pageId, candidate.contentHash);
	for (const page of view.draft?.selectedPages ?? []) if (!hashes.has(page.pageId)) hashes.set(page.pageId, page.contentHash);
	const selectedPageIds = [...pageIds];
	const committable = [];
	const unfrozen = [];
	for (const pageId of selectedPageIds) {
		const contentHash = hashes.get(pageId);
		if (contentHash === void 0) {
			unfrozen.push(pageId);
			continue;
		}
		committable.push({
			pageId,
			contentHash
		});
	}
	return {
		selectedPageIds,
		committable,
		unfrozen
	};
}
/** Preparing must freeze exactly the selection the user is looking at. */
function draftMatchesSelection(draft, query, pages) {
	return draft !== void 0 && draft.query === query && draft.selectedPages.length === pages.length && pages.every((page, index) => {
		const saved = draft.selectedPages[index];
		return saved?.pageId === page.pageId && saved.contentHash === page.contentHash;
	});
}
/**
* B9: fragment boundaries come from ONE place — the server's compiled preview.
*
* `null` means "the server did not provide boundaries for this page"; the UI
* must say so. Falling back to `candidate.segments` or to the whole page body
* would let the panel present a guess as evidence, and slicing/re-joining the
* body here would be a second Markdown compiler.
*/
function previewSegments(view, pageId) {
	const source = view.draft?.preview.sources.find((entry) => entry.pageId === pageId);
	if (source === void 0) return null;
	return source.segments.map((segment) => ({
		startLine: segment.startLine,
		endLine: segment.endLine
	}));
}
/**
* B10: nothing is "正在刷新" — the code deliberately does not refresh silently,
* the user presses the button. B11: a stale write is a WRITE, so the sentence
* names the operation that was rejected instead of describing a read.
*/
function staleCopy(error, operation) {
	return {
		title: "视图已过期，这次写入被拒绝",
		hint: "视图已过期：点按钮读取服务端最新视图，确认当前选择后再操作。",
		detail: "面板带 revision " + error.expected + " 发起「" + WRITE_LABEL[operation] + "」，服务端已是 " + error.actual + "。",
		action: "读取服务端最新视图"
	};
}
/**
* B5: a failed READ after a committed write is not a failed write.
*
* These three sentences are kept apart on purpose: the write already landed,
* and telling the user it failed would invite a duplicate submission.
*/
function committedReadFailureCopy(operation, message) {
	return "写入已提交（" + WRITE_LABEL[operation] + "），读取最新视图失败：" + message + "。界面仍停在写入前的视图，请点「读取服务端最新视图」核对。";
}
function rejectedReadFailureCopy(operation, message) {
	return "「" + WRITE_LABEL[operation] + "」被服务端拒绝，随后读取最新视图也失败：" + message + "。";
}
/** B5: a plain read failure (no write involved) never mentions a write. */
function readFailureCopy(message) {
	return "读取服务端最新视图失败：" + message + "。面板停在已显示的 revision，不假装已更新。";
}
//#endregion
//#region src/client/RemotePanel.tsx
/**
* Server view of the panel (P3b, hardened by the client review).
*
* Everything shown here is a field the server sent: `SessionView.draft.preview`
* (text/chars/fits/overBy/sources), `prepared`, `currentTurn`, `mode`,
* `revision`. The panel never re-compiles, never re-counts characters, never
* re-hashes a payload, never slices a page into "fragments", and never clears
* `prepared` locally — it disappears only when the server has observed our own
* `user/message` (D21).
*
* Session ownership rules this component must keep (B1–B12):
*   - the host remounts it with `key={sessionKey}`, and every local piece of
*     state below is session-scoped (B2);
*   - every async answer is checked against the session it was launched under
*     before it can reach the UI (B3);
*   - reads never carry a revision; only writes are pinned to the revision that
*     was displayed when the user clicked (B1 / D26);
*   - a committed write followed by a failed read is reported as exactly that,
*     never as a failed write (B5).
*/
const MODE_TEXT = {
	automatic: "自动",
	"manual-ready": "手选就绪",
	"manual-invalid": "手选无效"
};
const format = (value) => value.toLocaleString("zh-CN");
const messageOf$1 = (cause) => cause instanceof Error ? cause.message : String(cause);
/** One candidate row: picking is a separate action from opening the page. */
function PickRow(props) {
	const { candidate, picked, active, onToggle, onOpen } = props;
	const excluded = reasonLabel(candidate.excludedReason);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "memory-wiki-panel__candidate" + (active ? " is-active" : ""),
		"data-testid": "mw-pick-row",
		"data-page-id": candidate.pageId,
		"data-picked": picked ? "1" : "0",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__toolbar",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "memory-wiki-panel__pick-toggle",
						"data-testid": "mw-pick",
						"aria-pressed": picked,
						onClick: () => onToggle(candidate.pageId),
						children: picked ? "已选入" : "选入"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "memory-wiki-panel__pick-open",
						"data-testid": "mw-open-page",
						onClick: () => onOpen(candidate.pageId),
						children: candidate.title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "memory-wiki-panel__chip",
						children: candidate.match === "direct" ? "直接" : "关联"
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "memory-wiki-panel__candidate-id",
				children: candidate.pageId
			}),
			candidate.why.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "memory-wiki-panel__chips",
				children: candidate.why.map((term) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "memory-wiki-panel__chip memory-wiki-panel__chip--why",
					children: term
				}, term))
			}),
			candidate.viaPageId !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "memory-wiki-panel__via",
				children: ["经由 ", candidate.viaPageId]
			}),
			excluded !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "memory-wiki-panel__chips",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "memory-wiki-panel__chip memory-wiki-panel__chip--" + candidate.excludedReason,
					children: excluded
				})
			})
		]
	});
}
function RemotePanel(props) {
	const { source, sessionId, view, writeRevision, onView, pendingPage } = props;
	const [override, setOverride] = (0, react.useState)({});
	const [query, setQuery] = (0, react.useState)(view.draft?.query ?? "");
	const [report, setReport] = (0, react.useState)(null);
	const [searchState, setSearchState] = (0, react.useState)("idle");
	const [searchError, setSearchError] = (0, react.useState)(null);
	const [notice, setNotice] = (0, react.useState)(null);
	const [writeError, setWriteError] = (0, react.useState)(null);
	const [refreshError, setRefreshError] = (0, react.useState)(null);
	const [busy, setBusy] = (0, react.useState)(false);
	const [activePageId, setActivePageId] = (0, react.useState)(null);
	const [page, setPage] = (0, react.useState)(null);
	const [pageError, setPageError] = (0, react.useState)(null);
	const [pickedVersions, setPickedVersions] = (0, react.useState)([]);
	(0, react.useEffect)(() => {
		if (pendingPage === null || pendingPage === void 0) return;
		setPickedVersions((current) => [...current.filter((entry) => entry.pageId !== pendingPage.pageId), {
			pageId: pendingPage.pageId,
			contentHash: pendingPage.contentHash
		}]);
		setOverride((current) => ({
			...current,
			[pendingPage.pageId]: true
		}));
	}, [pendingPage]);
	/** B3: the only session this component's answers may land on. */
	const sessionRef = (0, react.useRef)(sessionId);
	const previousSessionRef = (0, react.useRef)(sessionId);
	const searchIdRef = (0, react.useRef)(0);
	const reloadIdRef = (0, react.useRef)(0);
	(0, react.useEffect)(() => {
		sessionRef.current = sessionId;
	}, [sessionId]);
	(0, react.useEffect)(() => {
		if (previousSessionRef.current === sessionId) return;
		previousSessionRef.current = sessionId;
		setOverride({});
		setReport(null);
		setQuery("");
		setSearchState("idle");
		setSearchError(null);
		setNotice(null);
		setWriteError(null);
		setRefreshError(null);
		setActivePageId(null);
		setPage(null);
		setPageError(null);
		setPickedVersions([]);
	}, [sessionId]);
	const revision = view.revision;
	(0, react.useEffect)(() => {
		if (view.draft === void 0) return;
		setQuery(view.draft.query);
	}, [revision, view.draft]);
	const candidates = report?.candidates ?? [];
	const draftSelected = view.draft?.selectedPages ?? [];
	const versionedPages = (0, react.useMemo)(() => [...candidates, ...pickedVersions], [report, pickedVersions]);
	const selection = (0, react.useMemo)(() => committableSelection(effectiveSelection(draftSelected, override), view, versionedPages), [
		draftSelected,
		override,
		view,
		versionedPages
	]);
	const selectedIds = (0, react.useMemo)(() => new Set(selection.selectedPageIds), [selection]);
	const hashOf = (0, react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const candidate of report?.candidates ?? []) map.set(candidate.pageId, candidate.contentHash);
		for (const pageRef of pickedVersions) map.set(pageRef.pageId, pageRef.contentHash);
		for (const pageRef of view.draft?.selectedPages ?? []) if (!map.has(pageRef.pageId)) map.set(pageRef.pageId, pageRef.contentHash);
		return map;
	}, [
		report,
		view.draft,
		pickedVersions
	]);
	const activeHash = activePageId === null ? void 0 : hashOf.get(activePageId);
	const activeCandidate = (0, react.useMemo)(() => candidates.find((candidate) => candidate.pageId === activePageId), [candidates, activePageId]);
	/** B9: boundaries come from the compiled preview — nowhere else. */
	const segments = activePageId === null ? null : previewSegments(view, activePageId);
	(0, react.useEffect)(() => {
		if (activePageId === null) return;
		const scope = launchScope(sessionId);
		if (scope === null) return;
		let cancelled = false;
		setPageError(null);
		setPage(null);
		const contentHash = activeHash;
		(async () => {
			try {
				const next = await source.readPage({
					pageId: activePageId,
					...contentHash === void 0 ? {} : { contentHash }
				});
				if (cancelled || !stillCurrent(scope, sessionRef.current)) return;
				setPage(next);
			} catch (cause) {
				if (cancelled || !stillCurrent(scope, sessionRef.current)) return;
				setPage(null);
				const code = cause instanceof RemoteCallError ? cause.code + ": " : "";
				setPageError(code + messageOf$1(cause));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		source,
		sessionId,
		activePageId,
		activeHash
	]);
	/** The one read path. B1: no revision is ever attached to a read. */
	const readView = (0, react.useCallback)((scope) => source.getView({ sessionId: scope.sessionId }), [source]);
	/**
	* B5: adopt what the write already told us, then re-read separately.
	*
	* The server returns the post-write state; a stale response even carries the
	* current view. Adopting those fields keeps `prepared`/`draft` on screen
	* (the "server has a prepared override, the panel says 未准备" failure).
	* A failure of the FOLLOW-UP READ is reported with its own sentence.
	*/
	const adoptWrite = (result) => {
		const next = {
			...view,
			revision: result.revision,
			mode: result.mode
		};
		if (result.draft !== void 0) next.draft = result.draft;
		if (result.error === void 0) delete next.error;
		else next.error = result.error;
		return next;
	};
	const reload = async (scope, operation, committed) => {
		const id = nextRequestId(reloadIdRef.current);
		reloadIdRef.current = id;
		try {
			const next = await readView(scope);
			if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return;
			setRefreshError(null);
			onView(next, scope.sessionId);
		} catch (cause) {
			if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return;
			setRefreshError(committed ? committedReadFailureCopy(operation, messageOf$1(cause)) : rejectedReadFailureCopy(operation, messageOf$1(cause)));
		}
	};
	const performWrite = async (operation, call) => {
		const scope = launchScope(sessionId);
		if (scope === null || writeRevision === void 0) return;
		setBusy(true);
		setNotice(null);
		setWriteError(null);
		setRefreshError(null);
		let result;
		try {
			result = await call(scope, writeRevision);
		} catch (cause) {
			setBusy(false);
			if (!stillCurrent(scope, sessionRef.current)) return;
			const code = cause instanceof RemoteCallError ? cause.code + ": " : "";
			setWriteError(code + messageOf$1(cause));
			return;
		}
		setBusy(false);
		if (!stillCurrent(scope, sessionRef.current)) return;
		onView(adoptWrite(result), scope.sessionId);
		if (result.error !== void 0) setNotice(result.error.code === "stale-revision" ? {
			kind: "stale",
			error: result.error,
			operation
		} : {
			kind: "error",
			error: result.error,
			operation
		});
		else setNotice(null);
		await reload(scope, operation, result.error === void 0);
	};
	/** Reading the server's current view is a READ: never pinned, always reported as a read. */
	const refreshView = async () => {
		const scope = launchScope(sessionId);
		if (scope === null) return;
		const id = nextRequestId(reloadIdRef.current);
		reloadIdRef.current = id;
		try {
			const next = await readView(scope);
			if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return;
			setNotice(null);
			setRefreshError(null);
			onView(next, scope.sessionId);
		} catch (cause) {
			if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return;
			setRefreshError(readFailureCopy(messageOf$1(cause)));
		}
	};
	const budgetChars = view.budgetChars;
	const hops = view.hops;
	const searching = searchState === "busy";
	const locked = busy || searching;
	const canWrite = source.reviseDraft !== void 0 && writeRevision !== void 0;
	const canRevise = canWrite && !locked && budgetChars !== void 0 && hops !== void 0 && selection.unfrozen.length === 0;
	const canSearch = hops !== void 0 && !locked;
	const draftDirty = selection.unfrozen.length > 0 || !draftMatchesSelection(view.draft, query, selection.committable);
	const revise = () => {
		const reviseDraft = source.reviseDraft;
		if (reviseDraft === void 0 || !canRevise || budgetChars === void 0 || hops === void 0) return Promise.resolve();
		return performWrite("revise-draft", (scope, expectedRevision) => reviseDraft({
			sessionId: scope.sessionId,
			expectedRevision,
			query,
			selectedPages: selection.committable,
			budgetChars,
			hops
		}));
	};
	const prepare = () => {
		const prepareOverride = source.prepareOverride;
		if (prepareOverride === void 0 || !canWrite || locked || draftDirty) return Promise.resolve();
		return performWrite("prepare-override", (scope, expectedRevision) => prepareOverride({
			sessionId: scope.sessionId,
			expectedRevision
		}));
	};
	const clear = () => {
		const clearOverride = source.clearOverride;
		if (clearOverride === void 0 || !canWrite || locked) return Promise.resolve();
		return performWrite("clear-override", (scope, expectedRevision) => clearOverride({
			sessionId: scope.sessionId,
			expectedRevision
		}));
	};
	/**
	* B7: a search gets a monotonic id; a late answer from an older query is
	* dropped. The search also locks the panel while it runs.
	*/
	const search = async () => {
		const scope = launchScope(sessionId);
		if (scope === null || hops === void 0 || locked) return;
		const id = nextRequestId(searchIdRef.current);
		searchIdRef.current = id;
		setSearchState("busy");
		setSearchError(null);
		try {
			const next = await source.search({
				query,
				hops,
				sessionId: scope.sessionId
			});
			if (!isCurrentRequest(id, searchIdRef.current) || !stillCurrent(scope, sessionRef.current)) return;
			setReport(next);
			setSearchState("done");
			setActivePageId((current) => current ?? next.candidates[0]?.pageId ?? null);
		} catch (cause) {
			if (!isCurrentRequest(id, searchIdRef.current) || !stillCurrent(scope, sessionRef.current)) return;
			setReport(null);
			setSearchState("failed");
			setSearchError(messageOf$1(cause));
		}
	};
	const toggle = (pageId) => {
		const selected = selectedIds.has(pageId);
		if (!selected && candidates.some((candidate) => candidate.pageId === pageId)) setPickedVersions((current) => current.filter((entry) => entry.pageId !== pageId));
		setOverride((current) => toggleSelection(current, pageId, selected));
	};
	const draft = view.draft;
	const preview = draft?.preview;
	const mode = view.mode ?? "automatic";
	const stale = notice?.kind === "stale" ? staleCopy(notice.error, notice.operation) : null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "memory-wiki-panel__body",
		"data-testid": "mw-server-view",
		"data-server-mode": mode,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__col memory-wiki-panel__col--list",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__section-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "手选候选" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"data-testid": "mw-search-status",
							children: searching ? "检索中…" : searchState === "done" ? "已检索" : searchState === "failed" ? "检索失败" : "未检索"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__toolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: "memory-wiki-panel__query",
							"data-testid": "mw-query",
							value: query,
							placeholder: "按本轮问题检索依据",
							"aria-label": "检索问题",
							onChange: (event) => setQuery(event.target.value)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": "mw-search",
							disabled: !canSearch,
							onClick: () => void search(),
							children: "检索"
						})]
					}),
					searchError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "memory-wiki-panel__over",
						role: "alert",
						"data-testid": "mw-search-error",
						children: searchError
					}),
					report === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "memory-wiki-panel__excerpt-note",
						"data-testid": "mw-candidates-empty",
						children: "输入本轮问题查找依据，也可以从图谱中选入页面。"
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__scroll",
						"data-testid": "mw-pick-list",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__section-head",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "候选" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								"data-testid": "mw-cand-counts",
								children: [
									"直接 ",
									report.candidates.filter((entry) => entry.match === "direct").length,
									" / 关联",
									" ",
									report.candidates.filter((entry) => entry.match === "linked").length,
									" · 手选",
									" ",
									selection.selectedPageIds.length
								]
							})]
						}), report.candidates.map((candidate) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PickRow, {
							candidate,
							picked: selectedIds.has(candidate.pageId),
							active: candidate.pageId === activePageId,
							onToggle: toggle,
							onOpen: setActivePageId
						}, candidate.pageId))]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "memory-wiki-panel__col memory-wiki-panel__col--center",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__server",
					"data-testid": "mw-server-status",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__section-head",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								"data-testid": "mw-server-mode",
								children: ["mode ", MODE_TEXT[mode]]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								"data-testid": "mw-server-rev",
								children: ["revision ", view.revision]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__chips",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "memory-wiki-panel__chip",
									"data-testid": "mw-server-budget",
									children: ["额度 ", budgetChars === void 0 ? "未提供" : format(budgetChars)]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "memory-wiki-panel__chip",
									"data-testid": "mw-server-hops",
									children: ["跳数 ", hops === void 0 ? "未提供" : hops]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "memory-wiki-panel__chip",
									"data-testid": "mw-skipped",
									children: ["跳过原因 ", view.skippedReason ?? "未提供"]
								})
							]
						}),
						stale !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__stale",
							role: "alert",
							"data-testid": "mw-stale",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: stale.title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: stale.hint }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									"data-testid": "mw-stale-detail",
									children: stale.detail
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "mw-stale-refresh",
									onClick: () => void refreshView(),
									children: stale.action
								})
							]
						}),
						notice?.kind === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "memory-wiki-panel__over",
							role: "alert",
							"data-testid": "mw-write-error",
							children: [
								hintFor(notice.error.code, "操作被服务端拒绝"),
								"（",
								errorDetail(notice.error),
								"）"
							]
						}),
						writeError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "memory-wiki-panel__over",
							role: "alert",
							"data-testid": "mw-write-transport-error",
							children: ["写调用失败：", writeError]
						}),
						refreshError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "memory-wiki-panel__over",
							role: "alert",
							"data-testid": "mw-refresh-error",
							children: [refreshError, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": "mw-refresh-retry",
								onClick: () => void refreshView(),
								children: "读取服务端最新视图"
							})]
						}),
						view.error !== void 0 && notice === null && writeError === null && refreshError === null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "memory-wiki-panel__over",
							role: "alert",
							"data-testid": "mw-server-error",
							children: [
								describeBusinessError(view.error),
								"（",
								errorDetail(view.error),
								"）"
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__toolbar",
							"data-testid": "mw-write-actions",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "mw-revise",
									disabled: !canRevise,
									"aria-busy": busy,
									onClick: () => void revise(),
									children: [
										"应用改选（",
										selection.committable.length,
										" 页）"
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "mw-prepare",
									disabled: !canWrite || locked || draft === void 0 || draftDirty,
									onClick: () => void prepare(),
									children: "准备下一轮"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "mw-clear",
									disabled: !canWrite || locked,
									onClick: () => void clear(),
									children: "清除覆盖"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "memory-wiki-panel__excerpt-note",
							"data-testid": "mw-write-note",
							children: "改选只更新草稿；准备后用于下一轮，不会立即发送消息。"
						}),
						draft !== void 0 && draftDirty && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "memory-wiki-panel__over",
							"data-testid": "mw-draft-dirty",
							children: "选择已修改，请先应用改选，再准备下一轮。"
						}),
						selection.unfrozen.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "memory-wiki-panel__over",
							role: "alert",
							"data-testid": "mw-unfrozen",
							children: [
								"未冻结·不可提交（",
								selection.unfrozen.length,
								" 页）：",
								selection.unfrozen.join("、"),
								" —— 没有服务端 contentHash，先重新检索或取消选入；本面板不会替你猜版本。"
							]
						}),
						preview === void 0 || draft === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "memory-wiki-panel__excerpt-note",
							"data-testid": "mw-draft-none",
							children: "选入页面后，点击「应用改选」预览将使用的依据。"
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-testid": "mw-draft",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "memory-wiki-panel__section-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "草稿预览 = 服务端编译结果" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										"data-testid": "mw-draft-facts",
										children: [
											format(preview.chars),
											" / ",
											format(draft.budgetChars),
											" 字符 · ",
											preview.sources.length,
											" 页 ·",
											" ",
											preview.fits ? "额度内" : "超额 " + format(preview.overBy)
										]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "memory-wiki-panel__chips",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "memory-wiki-panel__chip",
										"data-testid": "mw-draft-hash",
										children: ["已冻结哈希 ", preview.payloadHash.slice(0, 12)]
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
									className: "memory-wiki-panel__pre",
									"data-testid": "mw-draft-preview-text",
									children: preview.text
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__col memory-wiki-panel__col--detail",
				children: [activeCandidate !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
					className: "memory-wiki-panel__evidence-detail",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "核对候选的片段与版本" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SourceDetail, {
						candidate: activeCandidate,
						page,
						loading: pageError === null && page === null && activePageId !== null,
						error: pageError,
						segments,
						selected: activePageId !== null && selectedIds.has(activePageId)
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__hist",
					"data-testid": "mw-server-evidence",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h4", {
							className: "memory-wiki-panel__subhead",
							children: [
								"手选选入（",
								selection.selectedPageIds.length,
								" 页）"
							]
						}),
						selection.selectedPageIds.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "memory-wiki-panel__excerpt-note",
							children: "未选入任何页；自动模式不受影响。"
						}) : selection.selectedPageIds.map((pageId) => {
							const contentHash = hashOf.get(pageId);
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__hist-row",
								"data-testid": "mw-picked",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: pageId }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "memory-wiki-panel__hist-facts",
										children: contentHash === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-testid": "mw-picked-unfrozen",
											children: "未冻结·不可提交"
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-testid": "mw-picked-hash",
											children: contentHash.slice(0, 12)
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggle(pageId),
										children: "移除"
									})
								]
							}, pageId);
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h4", {
							className: "memory-wiki-panel__subhead",
							children: ["已准备覆盖", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "memory-wiki-panel__readonly",
								children: "本面板只读"
							})]
						}),
						view.prepared === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "memory-wiki-panel__excerpt-note",
							"data-testid": "mw-prepared-none",
							children: "尚未准备手动覆盖，继续使用自动检索。"
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__hist-row",
							"data-testid": "mw-prepared",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [
									view.prepared.origin === "manual" ? "手选" : "自动",
									" · ",
									view.prepared.snapshotId
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "memory-wiki-panel__hist-facts",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [format(view.prepared.chars), " 字符"] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [view.prepared.sources.length, " 页"] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-testid": "mw-prepared-hash",
											children: ["hash ", view.prepared.payloadHash.slice(0, 12)]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["lib ", view.prepared.libraryRevision] })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "memory-wiki-panel__excerpt-note",
									children: "已准备 ≠ 已注入：只有本插件自己的 user/message 落地后服务端才会清掉它。"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h4", {
							className: "memory-wiki-panel__subhead",
							children: ["本轮轮次", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "memory-wiki-panel__readonly",
								children: "本面板只读"
							})]
						}),
						view.currentTurn === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "memory-wiki-panel__excerpt-note",
							"data-testid": "mw-current-turn-none",
							children: "本会话还没有记录到轮次。"
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__hist-row",
							"data-testid": "mw-current-turn",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [
								"第 ",
								view.currentTurn.turn,
								" 轮 · ",
								view.currentTurn.phase
							] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__hist-facts",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: view.currentTurn.snapshotId ?? "无 snapshotId" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: view.currentTurn.payloadHash?.slice(0, 12) ?? "无 hash" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["补注 ", view.currentTurn.reInjections] }),
									view.currentTurn.committedSeq !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["seq ", view.currentTurn.committedSeq] })
								]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/client/CaptureHistory.tsx
const CAPTURE_LABEL = {
	queued: "等待判断",
	judging: "正在初判",
	preparing: "正在整理",
	verifying: "正在核验",
	publishing: "正在发布",
	ingested: "已沉淀",
	skipped: "无需沉淀",
	deferred: "待补证据",
	failed: "执行失败",
	needs_attention: "发布需处理"
};
const COLLECTOR = {
	disabled: "未启用",
	starting: "等待宿主服务",
	ready: "本地配置已就绪",
	blocked: "暂不可用"
};
const FILTERS = [
	["", "全部"],
	["processing", "处理中"],
	["ingested", "已沉淀"],
	["skipped", "无需沉淀"],
	["deferred", "待补证据"],
	["error", "异常"]
];
const EVENT = {
	registered: "登记原始证据",
	phase_changed: "阶段更新",
	judgment_started: "开始判定",
	judgment_finished: "判定返回",
	judgment_failed: "调用失败",
	judgment_interrupted: "调用结果未知",
	recovery_started: "恢复处理",
	publication_finished: "发布完成",
	publication_interrupted: "发布结果待核对",
	operation_failed: "执行异常",
	legacy_snapshot: "旧状态快照"
};
const time = (value) => value ? new Intl.DateTimeFormat(void 0, {
	dateStyle: "medium",
	timeStyle: "medium"
}).format(new Date(value)) + " · " + Intl.DateTimeFormat().resolvedOptions().timeZone : "时间未记录";
const message = (cause) => cause instanceof Error ? cause.message : String(cause);
const ongoing = (phase) => [
	"queued",
	"judging",
	"preparing",
	"verifying",
	"publishing"
].includes(phase);
function usePolling(refresh, active) {
	const callback = (0, react.useRef)(refresh);
	callback.current = refresh;
	(0, react.useEffect)(() => {
		if (!active) return;
		const poll = () => {
			if (document.visibilityState !== "hidden") callback.current();
		};
		const timer = window.setInterval(poll, 3e3);
		document.addEventListener("visibilitychange", poll);
		return () => {
			window.clearInterval(timer);
			document.removeEventListener("visibilitychange", poll);
		};
	}, [active]);
}
function HashValue({ label, value }) {
	const [copied, setCopied] = (0, react.useState)(false);
	const [error, setError] = (0, react.useState)("");
	if (!value) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "memory-wiki-panel__history-hash",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
				title: value,
				children: value.slice(0, 16)
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					navigator.clipboard.writeText(value).then(() => {
						setCopied(true);
						setError("");
					}, () => setError("复制失败，可展开完整值复制"));
				},
				children: copied ? "已复制" : "复制"
			}),
			error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				role: "status",
				children: error
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "完整值" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value })] })
		]
	});
}
function Judgment({ source, sessionId, jobId, lifecycle }) {
	const [open, setOpen] = (0, react.useState)(false);
	const [result, setResult] = (0, react.useState)(null);
	const [error, setError] = (0, react.useState)(null);
	const [nonce, setNonce] = (0, react.useState)(0);
	(0, react.useEffect)(() => {
		if (!open) return;
		let cancelled = false;
		setError(null);
		source.captureJudgment({
			sessionId,
			jobId,
			judgmentId: lifecycle.id
		}).then((value) => {
			if (!cancelled) setResult(value);
		}, (cause) => {
			if (!cancelled) setError(message(cause));
		});
		return () => {
			cancelled = true;
		};
	}, [
		source,
		sessionId,
		jobId,
		lifecycle.id,
		lifecycle.state,
		open,
		nonce
	]);
	const record = result?.judgment;
	const decision = record?.result?.kind === "decision" ? record.result : void 0;
	const failed = record?.result?.kind === "error" ? record.result.error : void 0;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
		className: "memory-wiki-panel__judgment",
		onToggle: (event) => setOpen(event.currentTarget.open),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
			lifecycle.stage === "assessment" ? "Jev 初判" : "Jev 核验",
			" · 第 ",
			lifecycle.attempt,
			" 次 · ",
			lifecycle.state === "started" ? "进行中" : lifecycle.state === "interrupted" ? "结果未知" : lifecycle.state === "failed" ? "调用失败" : lifecycle.disposition === "prepare" || lifecycle.disposition === "publish" ? "通过" : lifecycle.disposition === "skipped" ? "无需沉淀" : "待补证据"
		] }), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: lifecycle.model }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["开始：", time(lifecycle.startedAt)] }),
			lifecycle.finishedAt && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["结束：", time(lifecycle.finishedAt)] }),
			lifecycle.durationMs !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
				"本地调用总耗时：",
				Math.round(lifecycle.durationMs),
				" ms（含 SDK 重试）"
			] }),
			error ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
				role: "alert",
				children: [
					error,
					" ",
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setNonce((value) => value + 1),
						children: "重试读取"
					})
				]
			}) : !record ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				role: "status",
				children: "正在读取判定…"
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				lifecycle.state === "interrupted" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "进程中断，此次调用结果未知；不能据此判断请求是否发出或是否产生用量。" }),
				failed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					role: "alert",
					children: [
						failed.category,
						failed.httpStatus ? " · HTTP " + failed.httpStatus : "",
						"：",
						failed.message
					]
				}),
				decision && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
						decision.reason,
						" ",
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
							"（",
							decision.reasonCode,
							"）"
						] })
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
						"Token：输入 ",
						decision.usage?.inputTokens ?? "未提供",
						" · 输出 ",
						decision.usage?.outputTokens ?? "未提供"
					] }),
					decision.requestId && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["请求 ID：", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: decision.requestId })] })
				] }),
				record.questions.map((question) => {
					const answer = decision?.answers.find((value) => value.id === question.id);
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "memory-wiki-panel__question",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h5", { children: question.id }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: question.text }),
							question.options && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "候选选项" }), question.options.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: option.value }),
								"：",
								option.description
							] }, option.value))] }),
							answer?.type === "choice" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
								"所选：",
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: answer.choice }),
								" · confidence ",
								answer.confidence.toFixed(3)
							] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: answer.probabilities.map((value) => `${value.option} ${value.probability.toFixed(3)}`).join(" · ") })] }) : answer?.type === "noul" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["Noul：", answer.value.toFixed(3)] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "尚无有效答案" })
						]
					}, question.id);
				}),
				decision && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: "程序门槛" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "概率是模型返回值，不代表结论正确率。" }),
					decision.gateResults.map((gate) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: gate.passed ? "is-pass" : "is-deferred",
						children: [
							gate.passed ? "满足" : "未满足",
							" · ",
							gate.description,
							"：",
							String(gate.actual),
							" ",
							gate.operator === "gte" ? "≥" : "=",
							" ",
							String(gate.expected)
						]
					}, gate.id))
				] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(HashValue, {
					label: "请求",
					value: record.requestHash
				})
			] })
		] })]
	});
}
function RecordDetail({ source, sessionId, jobId, onBack, onOpen }) {
	const [record, setRecord] = (0, react.useState)(null);
	const [error, setError] = (0, react.useState)(null);
	const [busy, setBusy] = (0, react.useState)(false);
	const [nonce, setNonce] = (0, react.useState)(0);
	const live = (0, react.useRef)(true);
	const requestId = (0, react.useRef)(0);
	(0, react.useEffect)(() => () => {
		live.current = false;
	}, []);
	const read = (afterEventSeq) => {
		const request = ++requestId.current;
		setBusy(true);
		source.captureRecord({
			sessionId,
			jobId,
			...afterEventSeq === void 0 ? {} : { afterEventSeq }
		}).then((next) => {
			if (!live.current || request !== requestId.current) return;
			setRecord((current) => afterEventSeq === void 0 || !current ? next : {
				...next,
				events: [...current.events, ...next.events],
				judgments: [...new Map([...current.judgments, ...next.judgments].map((value) => [value.id, value])).values()]
			});
			setError(null);
		}, (cause) => {
			if (live.current && request === requestId.current) setError(message(cause));
		}).finally(() => {
			if (live.current && request === requestId.current) setBusy(false);
		});
	};
	(0, react.useEffect)(() => {
		read();
	}, [
		source,
		sessionId,
		jobId,
		nonce
	]);
	usePolling(() => {
		if (!busy && record?.summary && ongoing(record.summary.phase)) read(record.events.at(-1)?.seq ?? 0);
	}, true);
	const summary = record?.summary;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
		className: "memory-wiki-panel__history-detail",
		"aria-label": "沉淀记录详情",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__history-detail-head",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					children: "返回记录列表"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => setNonce((value) => value + 1),
					children: "刷新详情"
				})]
			}),
			error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				role: "alert",
				children: error
			}),
			!summary ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				role: "status",
				children: error ? "暂时无法读取这条记录。" : "正在读取记录…"
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h3", { children: [summary.task, summary.taskTruncated ? "…" : ""] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "memory-wiki-panel__history-state is-" + summary.phase,
					children: CAPTURE_LABEL[summary.phase]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: summary.reason }),
				summary.publicationUncertain && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					role: "alert",
					children: ["发布结果待核对：可能已有部分文件写入。", summary.retryable ? "重启采集服务后将依据已核验清单恢复。" : "请先处理发布冲突，保留现场文件。"]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["登记：", time(summary.registeredAt)] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
					"原始会话轮次 ",
					summary.origin.turn,
					" · 证据事件 seq ",
					summary.origin.turnStartSeq,
					"–",
					summary.origin.turnEndSeq
				] }),
				summary.historyCoverage === "legacy_snapshot" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "memory-wiki-panel__history-note",
					children: "旧记录：仅保留当时最新状态，阶段时间和判定答案未记录，不能还原完整历史。"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: "阶段时间线" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
						className: "memory-wiki-panel__timeline",
						children: record.events.map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", {
								dateTime: event.at,
								children: time(event.at)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [EVENT[event.kind], event.phase ? " · " + CAPTURE_LABEL[event.phase] : ""] }),
							event.reason && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: event.reason }),
							event.error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
								"错误类别：",
								event.error.category,
								event.stage ? " · 阶段：" + CAPTURE_LABEL[event.stage] : ""
							] }),
							event.kind === "judgment_interrupted" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "此次调用结果未知" }),
							event.judgmentId && record.judgments.find((value) => value.id === event.judgmentId) && event.kind === "judgment_started" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Judgment, {
								source,
								sessionId,
								jobId,
								lifecycle: record.judgments.find((value) => value.id === event.judgmentId)
							})
						] }, event.seq))
					}),
					record.nextEventSeq !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => read(record.nextEventSeq),
						children: "加载后续事件"
					})
				] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: "证据与改动" }),
					record.limitations.map((limit, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: limit }, index)),
					record.evidence.map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
							"原始证据 seq ",
							event.seq,
							" · ",
							event.kind
						] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: event.text }),
						event.truncated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "仅展示前 1,000 字符，完整证据保存在本地任务记录。" })
					] }, event.seq)),
					record.evidenceTruncated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "仅展示前 12 条原始事件。" }),
					record.changes.map((change) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: change.path }),
						" · ",
						change.beforeHash ? "更新" : "新增"
					] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HashValue, {
						label: "发布候选版本",
						value: change.afterHash
					})] }, change.path)),
					summary.phase === "ingested" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__history-pages",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "打开的是知识库当前内容，详情会标注与发布版本的差异。" }), summary.pages.filter((page) => !page.startsWith("wiki/sources/")).map((page) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onOpen(page, record.changes.find((change) => change.path === page || change.path === page + ".md")?.afterHash),
							children: page
						}, page))]
					})
				] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "记录标识与版本" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["任务 ID：", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: summary.jobId })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["规则版本：", summary.rubricVersion] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(HashValue, {
						label: "原始证据",
						value: summary.evidenceHash
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(HashValue, {
						label: "Wiki 规则",
						value: summary.rulesHash
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(HashValue, {
						label: "核验改动",
						value: summary.patchHash
					})
				] })
			] })
		]
	});
}
function CaptureHistory({ source, sessionId, initialJobId, onBack, onOpen }) {
	const [status, setStatus] = (0, react.useState)(null);
	const [list, setList] = (0, react.useState)(null);
	const [selected, setSelected] = (0, react.useState)(initialJobId ?? null);
	const [filter, setFilter] = (0, react.useState)("");
	const [error, setError] = (0, react.useState)(null);
	const [busy, setBusy] = (0, react.useState)(false);
	const [updates, setUpdates] = (0, react.useState)(false);
	const [nonce, setNonce] = (0, react.useState)(0);
	const live = (0, react.useRef)(true);
	const requestId = (0, react.useRef)(0);
	(0, react.useEffect)(() => () => {
		live.current = false;
	}, []);
	const read = (cursor, poll = false) => {
		const request = ++requestId.current;
		if (!poll) setBusy(true);
		Promise.all([source.captureStatus(sessionId ? { sessionId } : {}), sessionId ? source.captureHistory({
			sessionId,
			...filter ? { status: filter } : {},
			...cursor ? { cursor } : {}
		}) : Promise.resolve(null)]).then(([state, next]) => {
			if (!live.current || request !== requestId.current) return;
			setStatus(state);
			setError(null);
			if (poll && list) {
				if (JSON.stringify(next?.items) !== JSON.stringify(list.items.slice(0, 20))) setUpdates(true);
			} else {
				setList((current) => cursor && current && next ? {
					...next,
					items: [...current.items, ...next.items]
				} : next);
				setUpdates(false);
			}
		}, (cause) => {
			if (live.current && request === requestId.current) setError(message(cause));
		}).finally(() => {
			if (live.current && request === requestId.current) setBusy(false);
		});
	};
	(0, react.useEffect)(() => {
		setList(null);
		setUpdates(false);
	}, [
		source,
		sessionId,
		filter
	]);
	(0, react.useEffect)(() => {
		read();
	}, [
		source,
		sessionId,
		filter,
		nonce
	]);
	usePolling(() => {
		if (!busy) read(void 0, true);
	}, true);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "memory-wiki-panel__history",
		"data-testid": "mw-capture-history",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: "memory-wiki-panel__history-head",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "沉淀记录" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "原始证据 → Jev 初判 → 核验 → 发布" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					children: "返回图谱"
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__history-availability",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["自动采集：", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: status ? COLLECTOR[status.collector] : "正在读取状态" })] }),
					status && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: status.reason }),
					status?.history !== void 0 && status.history !== "readable" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "alert",
						children: status.history === "degraded" ? "部分历史记录无法读取，以下内容可能不完整。" : "历史存储暂不可读取。"
					}),
					status?.lastIssue && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						role: "alert",
						children: [
							time(status.lastIssue.at),
							" · ",
							status.lastIssue.stage === "collecting" ? "取证失败，未进入 Jev" : "采集运行异常",
							"：",
							status.lastIssue.message,
							!status.lastIssue.persisted && "（尚未持久化）"
						]
					})
				]
			}),
			!sessionId ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "memory-wiki-panel__history-note",
				children: "在宿主打开一个会话后，可查看该会话的沉淀历史。"
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__history-toolbar",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["状态 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
							value: filter,
							onChange: (event) => {
								setFilter(event.target.value);
								setSelected(null);
							},
							children: FILTERS.map(([value, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value,
								children: label
							}, value))
						})] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["当前会话 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: sessionId })] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => setNonce((value) => value + 1),
							children: "刷新记录"
						})
					]
				}),
				error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "alert",
					children: error
				}),
				updates && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					role: "status",
					children: ["有更新，", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setNonce((value) => value + 1),
						children: "刷新记录"
					})]
				}),
				list?.readCompleteness === "partial" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "alert",
					children: "本次历史查询不完整，部分记录未能读取。"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__history-layout" + (selected ? " has-selection" : ""),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__history-list",
						"aria-label": "沉淀记录列表",
						children: [list === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							role: "status",
							children: error ? "历史暂不可读取。" : "正在读取历史…"
						}) : list.items.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["尚无本会话采集记录。", status?.collector === "disabled" ? "自动采集当前未启用。" : ""] }) : list.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": selected === item.jobId,
							onClick: () => setSelected(item.jobId),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", {
									dateTime: item.registeredAt,
									children: time(item.registeredAt)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [item.task, item.taskTruncated ? "…" : ""] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "is-" + item.phase,
									children: [
										CAPTURE_LABEL[item.phase],
										" · 第 ",
										item.origin.turn,
										" 轮"
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [item.publicationUncertain ? "发布结果待核对 · " : "", item.reason] })
							]
						}, item.jobId)), list?.nextCursor && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => read(list.nextCursor),
							children: "加载更多"
						})]
					}), selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecordDetail, {
						source,
						sessionId,
						jobId: selected,
						onBack: () => setSelected(null),
						onOpen
					}, selected) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "memory-wiki-panel__history-placeholder",
						children: "选择一条记录，查看阶段时间线、判定条件和原始证据。"
					})]
				})
			] })
		]
	});
}
//#endregion
//#region src/client/CaptureStatus.tsx
function CaptureStatus({ capture, onOpen, onHistory }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: "memory-wiki-panel__context-note",
		"aria-live": "polite",
		"data-testid": "mw-capture-status",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h4", { children: ["经验沉淀 · ", CAPTURE_LABEL[capture.phase]] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: capture.reason }),
			onHistory && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onHistory,
				children: "查看完整沉淀记录"
			}),
			capture.phase === "ingested" && capture.pages.filter((page) => !page.startsWith("wiki/sources/")).map((page) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onOpen(page),
				children: page.split("/").at(-1)
			}, page)),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "证据与改动记录" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: capture.jobId }),
				capture.limitations?.map((limit) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: limit }, limit)),
				capture.changes?.map((change) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: change.path }),
					" · ",
					change.beforeHash ? "更新" : "新增"
				] }, change.path)),
				capture.evidence?.map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
						"seq ",
						event.seq,
						" · ",
						event.kind
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
						style: {
							whiteSpace: "pre-wrap",
							overflowWrap: "anywhere"
						},
						children: event.text
					}),
					event.truncated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "此处仅展示前 1,000 字符，完整证据保存在本地任务记录。" })
				] }, event.seq)),
				capture.evidenceTruncated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "此处仅展示前 12 条事件。" })
			] })
		]
	});
}
//#endregion
//#region src/client/MemoryPanel.tsx
function useSessionKey(uiSession) {
	const binding = uiSession?.adapter?.current;
	const subscribe = (0, react.useCallback)((listener) => binding?.subscribe(listener) ?? (() => {}), [binding]);
	const snapshot = (0, react.useCallback)(() => binding?.getSnapshot()?.key ?? null, [binding]);
	return (0, react.useSyncExternalStore)(subscribe, snapshot, snapshot);
}
const KIND = {
	concept: "概念",
	entity: "实体",
	source: "来源",
	synthesis: "综合",
	output: "产出"
};
const messageOf = (cause) => cause instanceof Error ? cause.message : String(cause);
/** The full library is global; only context editing belongs to a session. */
function MemoryPanel({ source, uiSession }) {
	const sessionKey = useSessionKey(uiSession);
	const sessionRef = (0, react.useRef)(sessionKey);
	sessionRef.current = sessionKey;
	const [historyOpen, setHistoryOpen] = (0, react.useState)(false);
	const [historyJob, setHistoryJob] = (0, react.useState)();
	const [publishedPage, setPublishedPage] = (0, react.useState)(null);
	const [graph, setGraph] = (0, react.useState)(null);
	const [graphError, setGraphError] = (0, react.useState)(null);
	const [graphBusy, setGraphBusy] = (0, react.useState)(true);
	const [graphNonce, setGraphNonce] = (0, react.useState)(0);
	const [query, setQuery] = (0, react.useState)("");
	const [searchOpen, setSearchOpen] = (0, react.useState)(false);
	const [activePageId, setActivePageId] = (0, react.useState)(null);
	const [drawer, setDrawer] = (0, react.useState)(null);
	const [reset, setReset] = (0, react.useState)(0);
	const [pageState, setPageState] = (0, react.useState)(null);
	const [pageError, setPageError] = (0, react.useState)(null);
	const [viewState, setViewState] = (0, react.useState)(null);
	const [viewError, setViewError] = (0, react.useState)(null);
	const [viewNonce, setViewNonce] = (0, react.useState)(0);
	const [lastReadAt, setLastReadAt] = (0, react.useState)(null);
	const [pendingPage, setPendingPage] = (0, react.useState)(null);
	const searchInput = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		let cancelled = false;
		setGraphBusy(true);
		setGraphError(null);
		source.getGraph().then((next) => {
			if (cancelled) return;
			setGraph(next);
			setGraphBusy(false);
		}, (cause) => {
			if (cancelled) return;
			setGraphError(messageOf(cause));
			setGraphBusy(false);
		});
		return () => {
			cancelled = true;
		};
	}, [source, graphNonce]);
	(0, react.useEffect)(() => {
		setPendingPage(null);
		setViewError(null);
		setLastReadAt(null);
		if (!boundSession(sessionKey)) {
			setViewState(null);
			return;
		}
		let cancelled = false;
		source.getView({ sessionId: sessionKey }).then((next) => {
			if (cancelled || sessionRef.current !== sessionKey) return;
			setViewState({
				session: sessionKey,
				view: next,
				...next.error === void 0 ? { cleanRevision: next.revision } : {}
			});
			setLastReadAt(Date.now());
		}, (cause) => {
			if (!cancelled && sessionRef.current === sessionKey) setViewError(messageOf(cause));
		});
		return () => {
			cancelled = true;
		};
	}, [
		source,
		sessionKey,
		viewNonce
	]);
	(0, react.useEffect)(() => {
		const refresh = () => {
			if (document.visibilityState !== "hidden" && boundSession(sessionRef.current)) setViewNonce((n) => n + 1);
		};
		window.addEventListener("focus", refresh);
		document.addEventListener("visibilitychange", refresh);
		return () => {
			window.removeEventListener("focus", refresh);
			document.removeEventListener("visibilitychange", refresh);
		};
	}, []);
	const view = viewState?.session === sessionKey ? viewState.view : null;
	const writeRevision = viewState?.session === sessionKey ? viewState.cleanRevision : void 0;
	const applyView = (0, react.useCallback)((next, requestSession) => {
		if (sessionRef.current !== requestSession) return;
		setViewState((current) => ({
			session: requestSession,
			view: next,
			cleanRevision: next.error === void 0 ? next.revision : current?.session === requestSession ? current.cleanRevision : void 0
		}));
		setViewError(null);
		setLastReadAt(Date.now());
	}, []);
	const pageIndex = (0, react.useMemo)(() => new Map(graph?.pages.map((entry) => [entry.pageId, entry])), [graph]);
	const active = activePageId === null ? void 0 : pageIndex.get(activePageId);
	const term = query.trim().toLocaleLowerCase();
	const results = (0, react.useMemo)(() => term === "" ? [] : (graph?.pages ?? []).filter((entry) => entry.title.toLocaleLowerCase().includes(term) || entry.pageId.toLocaleLowerCase().includes(term)), [graph, term]);
	const matches = (0, react.useMemo)(() => new Set(results.map((entry) => entry.pageId)), [results]);
	const outgoing = (0, react.useMemo)(() => [...new Set(graph?.edges.filter((edge) => edge.from === activePageId).map((edge) => edge.to))], [graph, activePageId]);
	const incoming = (0, react.useMemo)(() => [...new Set(graph?.edges.filter((edge) => edge.to === activePageId).map((edge) => edge.from))], [graph, activePageId]);
	(0, react.useEffect)(() => {
		setPageState(null);
		setPageError(null);
		if (active === void 0) return;
		let cancelled = false;
		source.readPage({
			pageId: active.pageId,
			contentHash: active.contentHash
		}).then((next) => {
			if (!cancelled) setPageState({
				hash: active.contentHash,
				page: next
			});
		}, (cause) => {
			if (!cancelled) setPageError({
				id: active.pageId,
				message: messageOf(cause)
			});
		});
		return () => {
			cancelled = true;
		};
	}, [
		source,
		graph,
		active?.pageId,
		active?.contentHash
	]);
	const page = pageState !== null && pageState.page.pageId === active?.pageId && pageState.hash === active?.contentHash ? pageState.page : null;
	const openPage = (0, react.useCallback)((id) => {
		setActivePageId(id);
		setDrawer("detail");
		setSearchOpen(false);
	}, []);
	const clearSearch = () => {
		setQuery("");
		setSearchOpen(false);
		setActivePageId(null);
		setDrawer(null);
		setReset((n) => n + 1);
	};
	const refreshGraph = () => {
		clearSearch();
		setGraphNonce((n) => n + 1);
	};
	const close = () => {
		setDrawer(null);
		setActivePageId(null);
		setReset((n) => n + 1);
	};
	const readFailure = pageError?.id === activePageId ? pageError.message : null;
	const relations = [["关联知识", outgoing], ["引用了本页", incoming]];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: "memory-wiki-panel",
		"data-testid": "mw-panel",
		"data-source": source.mode,
		onKeyDown: (event) => {
			if (historyOpen) return;
			if (event.key === "Escape") {
				setSearchOpen(false);
				close();
			}
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				searchInput.current?.focus();
			}
		},
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
			className: "memory-wiki-panel__head",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__brand",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "graph" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "记忆 Wiki" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "知识图谱" })
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__searchbox",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "search" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							ref: searchInput,
							value: query,
							placeholder: "搜索页面标题或路径",
							"aria-label": "搜索知识",
							"data-testid": "mw-browse-query",
							disabled: historyOpen,
							"aria-expanded": searchOpen && term !== "",
							"aria-controls": "mw-browse-results",
							autoComplete: "off",
							onFocus: () => setSearchOpen(true),
							onChange: (event) => {
								setQuery(event.target.value);
								setSearchOpen(true);
							},
							onKeyDown: (event) => {
								if (event.key === "Enter" && results[0] !== void 0) openPage(results[0].pageId);
							}
						}),
						query !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: historyOpen,
							onClick: clearSearch,
							"aria-label": "清空搜索",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "close" })
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "⌘ K" }),
						searchOpen && term !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "memory-wiki-panel__search-results",
							id: "mw-browse-results",
							"data-testid": "mw-browse-results",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									role: "status",
									children: results.length === 0 ? "没有找到页面，试试其他标题或路径。" : results.length + " 个匹配页面"
								}),
								results.slice(0, 30).map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => openPage(entry.pageId),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [entry.title, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: entry.pageId })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "arrow" })]
								}, entry.pageId)),
								results.length > 30 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
									"还有 ",
									results.length - 30,
									" 页，请缩小搜索范围。"
								] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "memory-wiki-panel__head-actions",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": historyOpen,
							onClick: () => {
								setHistoryJob(void 0);
								setHistoryOpen((value) => !value);
							},
							children: "沉淀记录"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "memory-wiki-panel__icon",
							onClick: refreshGraph,
							"aria-label": "刷新知识图谱",
							title: "重新读取 Wiki 页面与链接",
							disabled: graphBusy || historyOpen,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "refresh" })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: historyOpen,
							"data-testid": "mw-context-toggle",
							"aria-expanded": drawer === "context",
							"aria-controls": "mw-context",
							onClick: () => {
								setSearchOpen(false);
								setDrawer((current) => current === "context" ? null : "context");
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "graph" }), "上下文"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "memory-wiki-panel__surfaces",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "memory-wiki-panel__workspace",
				"aria-hidden": historyOpen || void 0,
				style: historyOpen ? {
					visibility: "hidden",
					pointerEvents: "none"
				} : void 0,
				children: [
					graph !== null && graph.pages.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EvidenceGraph, {
						visible: !historyOpen,
						graph,
						activePageId,
						onSelect: openPage,
						matches,
						drawer: drawer !== null,
						reset
					}),
					graphError !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__empty",
						role: "alert",
						"data-testid": "mw-graph-error",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "graph" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "暂时无法读取知识图谱" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: graphError }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: refreshGraph,
								children: "重新读取"
							})
						]
					}) : graph === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__empty",
						role: "status",
						"data-testid": "mw-loading",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "graph" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "正在展开知识图谱" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "读取 Wiki 页面与链接…" })
						]
					}) : graph.pages.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "memory-wiki-panel__empty",
						"data-testid": "mw-graph-empty",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "graph" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Wiki 里还没有可展示的页面" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "添加有效的 Markdown 知识页面后，刷新即可看到关系图。" })
						]
					}) : null,
					graphBusy && graph !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "memory-wiki-panel__updating",
						role: "status",
						children: "正在更新图谱…"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "memory-wiki-panel__canvas-status",
						"data-testid": "mw-browse-status",
						children: [source.mode === "fixture" ? "设计预览 · 示例内容" : !boundSession(sessionKey) ? "浏览模式 · 未绑定会话" : view === null ? "上下文未就绪" : view.prepared !== void 0 ? "已准备下一轮手选依据" : "自动模式", graph !== null && graph.brokenLinks > 0 ? " · " + graph.brokenLinks + " 个未解析链接" : ""]
					}),
					drawer === "detail" && active !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
						className: "memory-wiki-panel__drawer",
						"aria-label": "知识详情",
						"data-testid": "mw-knowledge-detail",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__drawer-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: active.title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "memory-wiki-panel__icon",
									onClick: close,
									"aria-label": "关闭知识详情",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "close" })
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__reader",
								children: [
									publishedPage?.id === active.pageId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "memory-wiki-panel__excerpt-note",
										children: page === null ? "正在读取知识库当前页面…" : publishedPage.hash && publishedPage.hash === page.contentHash ? "当前内容与当时发布版本一致。" : "正在查看知识库当前内容；可能与当时发布版本不同。"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "memory-wiki-panel__page-meta",
										children: [KIND[active.kind] ?? active.kind, active.asOf === void 0 ? "" : " · " + active.asOf]
									}),
									readFailure !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										role: "alert",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: readFailure }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setGraphNonce((n) => n + 1),
											children: "刷新图谱后重读"
										})]
									}) : page === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										role: "status",
										children: "正在读取页面…"
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownView, {
										source: page.body,
										title: active.title,
										testId: "mw-knowledge-body"
									}), page.truncated && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "memory-wiki-panel__excerpt-note",
										children: [
											"正文较长，当前展示前 ",
											page.limitChars?.toLocaleString(),
											" 字符。"
										]
									})] }),
									relations.map(([title, ids]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
										className: "memory-wiki-panel__relations",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: title }), ids.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["暂无", title === "关联知识" ? "出链" : "反链"] }) : ids.map((id) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => openPage(id),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: pageIndex.get(id)?.title ?? id }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "arrow" })]
										}, id))]
									}, String(title))),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
										className: "memory-wiki-panel__page-info",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "页面信息" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: active.pageId }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: ["版本 ", active.contentHash.slice(0, 12)] })
										]
									})
								]
							}, active.pageId),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
								className: "memory-wiki-panel__reader-footer",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "mw-add-evidence",
									disabled: !boundSession(sessionKey) || view === null || writeRevision === void 0 || source.reviseDraft === void 0,
									onClick: () => {
										setPendingPage({ ...active });
										setDrawer("context");
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "plus" }), "选为下一轮依据"]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: boundSession(sessionKey) ? "先选入，再在上下文中预览和准备。" : "浏览无需会话；选为依据需先打开一个会话。" })]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
						id: "mw-context",
						className: "memory-wiki-panel__drawer memory-wiki-panel__drawer--context",
						"aria-label": "会话上下文",
						hidden: drawer !== "context",
						children: [
							view?.capture && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CaptureStatus, {
								onHistory: () => {
									setHistoryJob(view.capture?.jobId);
									setHistoryOpen(true);
								},
								capture: view.capture,
								onOpen: (pageId) => {
									setGraphNonce((n) => n + 1);
									openPage(pageId);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__drawer-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "会话上下文" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "自动检索，或为下一轮指定依据。" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "memory-wiki-panel__icon",
									onClick: close,
									"aria-label": "关闭上下文",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "close" })
								})]
							}),
							!boundSession(sessionKey) ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__context-note",
								"data-testid": "mw-unbound",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: "打开一个会话后即可选择依据" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "你可以继续浏览整库图谱和知识正文。" })]
							}) : view === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "memory-wiki-panel__context-note",
								role: viewError === null ? "status" : "alert",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: viewError ?? "正在读取会话状态…" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setViewNonce((n) => n + 1),
									children: "重新读取"
								})]
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "memory-wiki-panel__context-meta",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-testid": "mw-mode",
											children: source.mode
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-testid": "mw-session",
											children: ["会话 ", sessionKey]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-testid": "mw-rev",
											children: ["视图 rev ", view.revision]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-testid": "mw-last-read",
											children: ["上次读取 ", lastReadAt === null ? "尚未读取" : new Date(lastReadAt).toLocaleTimeString("zh-CN", { hour12: false })]
										})
									]
								}),
								viewError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									role: "alert",
									"data-testid": "mw-error",
									children: viewError
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(RemotePanel, {
									source,
									sessionId: sessionKey,
									view,
									writeRevision,
									onView: applyView,
									pendingPage
								}, sessionKey)
							] })
						]
					})
				]
			}), historyOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CaptureHistory, {
				source,
				sessionId: sessionKey,
				initialJobId: historyJob,
				onBack: () => setHistoryOpen(false),
				onOpen: (id, hash) => {
					setPublishedPage({
						id,
						hash
					});
					setGraphNonce((value) => value + 1);
					setHistoryOpen(false);
					openPage(id);
				}
			}, sessionKey ?? "unbound")]
		})]
	});
}
//#endregion
//#region src/client/source/index.ts
/**
* The single switch point between a registered fixture and the real Remote.
*
* Change SOURCE_MODE (or pass a mode to createSource) and the panel runs on the
* other implementation; nothing else in the panel knows which one it is.
*
* P3b moved the fixture implementation OUT of `src/client`: the production
* bundle must not ship example knowledge. It is therefore *injected*:
*   - tests/dev: `registerFixtureSource(() => createFixtureSource())`
*   - production: nothing registers, so fixture mode fails with a typed
*     `fixture-not-bundled` error instead of quietly showing stale demo pages.
* No fixture module is imported here — not statically, not dynamically.
*/
/** P3b: the panel reads the host's server view. */
const SOURCE_MODE = "remote";
const REMOTE_NOT_WIRED_REASON = "host codec client is mounted in P3b";
/**
* Fixture mode without a registered factory.
*
* Fails loudly and typed on every call: a silent empty panel would look like a
* successful load, and synthetic demo data here would be worse than an error.
*/
function unregisteredFixtureSource(reason) {
	const fail = () => {
		throw new RemoteCallError("fixture-not-bundled", reason);
	};
	return {
		mode: "fixture",
		async captureStatus() {
			return fail();
		},
		async captureHistory() {
			return fail();
		},
		async captureRecord() {
			return fail();
		},
		async captureJudgment() {
			return fail();
		},
		async getGraph() {
			return fail();
		},
		async getView() {
			return fail();
		},
		async search() {
			return fail();
		},
		async readPage() {
			return fail();
		}
	};
}
function createSource(mode = SOURCE_MODE, remote) {
	if (mode === "remote") return createRemoteSource(remote, REMOTE_NOT_WIRED_REASON);
	return unregisteredFixtureSource("no fixture source registered; production bundles none");
}
//#endregion
//#region ../../node_modules/.pnpm/@deepseek-ai+dsh-typert-protocol@0.2.1-rc.3_@deepseek-ai+cordis@4.0.5/node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/remote-info.js
/** Lazy assembly of generated Remote definitions using caller-supplied Zod; no runtime imports. */
/**
* Retain one generated definition per endpoint without constructing parsers or projections.
* The class instance builds its shared descriptor/method index on first access;
* input schemas and JSON Schema projections are cached only when requested.
* @param spec - compiler-produced method facts and Zod factories.
* @param zod - the generated artifact's Zod runtime for named-input parsers.
* @returns a lazy, mountable info instance with no registration or transport effects.
*/
function createTypertRemoteInfo(spec, zod) {
	return new RemoteInfo(spec, zod);
}
var RemoteInfo = class {
	spec;
	zod;
	index;
	constructor(spec, zod) {
		this.spec = spec;
		this.zod = zod;
	}
	get package() {
		return this.spec.package;
	}
	get descriptors() {
		return this.resolve().descriptors;
	}
	get methods() {
		return this.resolve().methods;
	}
	resolve() {
		if (this.index !== void 0) return this.index;
		const zod = this.zod;
		const descriptors = [];
		const methods = Object.create(null);
		for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
			const separator = endpoint.indexOf("/");
			const namespace = endpoint.slice(0, separator);
			const method = endpoint.slice(separator + 1);
			const parameters = definition.parameters.map((parameter) => ({
				...parameter,
				wire: parameter.wire ?? parameter.name
			}));
			const descriptor = {
				...definition,
				id: `${this.spec.package}#${endpoint}`,
				namespace,
				method,
				parameters,
				result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
			};
			if (definition.invocation.kind === "direct") {
				const inputs = [];
				methods[endpoint] = Object.assign(descriptor, {
					input(options) {
						const strict = options?.strict === true;
						return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
					},
					invoke(remote, input, signal) {
						const named = input;
						const values = parameters.map((parameter) => named[parameter.wire]);
						if (definition.cancellation !== void 0) values.push(signal);
						const receiver = Reflect.get(remote, namespace);
						return Reflect.get(receiver, method).apply(receiver, values);
					}
				});
			}
			descriptors.push(descriptor);
		}
		return this.index = {
			descriptors,
			methods
		};
	}
};
function optional(parameter) {
	return parameter.source === "json" && parameter.acceptsUndefined === true;
}
var NamedInput = class {
	parameters;
	strict;
	zod;
	schema;
	projection;
	constructor(parameters, strict, zod) {
		this.parameters = parameters;
		this.strict = strict;
		this.zod = zod;
	}
	codec(parameter) {
		return this.strict ? parameter.strictCodec : parameter.codec;
	}
	create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
		const value = this.codec(parameter).create();
		return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
	})));
	get jsonSchema() {
		return this.project().jsonSchema;
	}
	get jsonSchemaError() {
		return this.project().jsonSchemaError;
	}
	project() {
		if (this.projection !== void 0) return this.projection;
		const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
		if (unavailable !== void 0) return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
		return this.projection = { jsonSchema: {
			type: "object",
			properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
				...this.codec(parameter).jsonSchema,
				...parameter.description === void 0 ? {} : { description: parameter.description }
			}])),
			required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
			additionalProperties: false
		} };
	}
};
var ResultValue = class {
	spec;
	projection;
	constructor(spec) {
		this.spec = spec;
	}
	get mode() {
		return this.spec.mode;
	}
	get typeSymbol() {
		return this.spec.typeSymbol;
	}
	get create() {
		return this.spec.create;
	}
	get decode() {
		return this.spec.decode;
	}
	get encode() {
		return this.spec.encode;
	}
	get description() {
		return this.spec.description;
	}
	get jsonSchemaError() {
		return this.spec.jsonSchemaError;
	}
	get jsonSchema() {
		if (this.projection === void 0) {
			const schema = this.spec.jsonSchema;
			this.projection = { value: schema === void 0 ? void 0 : {
				...schema,
				description: this.spec.description
			} };
		}
		return this.projection.value;
	}
};
//#endregion
//#region lib/typert.remote-client.js
let dsh_memory_wiki_memoryWiki_captureHistory_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_captureHistory_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_captureHistory_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"cursor": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
	"limit": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
	"status": zod.z.union([
		zod.z.undefined(),
		zod.z.literal("ingested"),
		zod.z.literal("skipped"),
		zod.z.literal("deferred"),
		zod.z.literal("processing"),
		zod.z.literal("error")
	]).optional()
});
let dsh_memory_wiki_memoryWiki_captureHistory_result$schema$value;
const dsh_memory_wiki_memoryWiki_captureHistory_result$schema = () => dsh_memory_wiki_memoryWiki_captureHistory_result$schema$value ??= zod.z.object({
	"items": zod.z.array(zod.z.object({
		"jobId": zod.z.string(),
		"phase": zod.z.union([
			zod.z.literal("queued"),
			zod.z.literal("judging"),
			zod.z.literal("preparing"),
			zod.z.literal("verifying"),
			zod.z.literal("publishing"),
			zod.z.literal("ingested"),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("failed"),
			zod.z.literal("needs_attention")
		]),
		"reason": zod.z.string(),
		"pages": zod.z.array(zod.z.string()),
		"updatedAt": zod.z.string(),
		"registeredAt": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"historyCoverage": zod.z.union([zod.z.literal("complete"), zod.z.literal("legacy_snapshot")]),
		"origin": zod.z.object({
			"sessionId": zod.z.string(),
			"turn": zod.z.number(),
			"turnStartSeq": zod.z.number(),
			"turnEndSeq": zod.z.number()
		}),
		"task": zod.z.string(),
		"taskTruncated": zod.z.boolean(),
		"evidenceHash": zod.z.string(),
		"rubricVersion": zod.z.string(),
		"rulesHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"patchHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"lastEventSeq": zod.z.number(),
		"publicationUncertain": zod.z.union([
			zod.z.undefined(),
			zod.z.literal(false),
			zod.z.literal(true)
		]).optional(),
		"retryable": zod.z.union([
			zod.z.undefined(),
			zod.z.literal(false),
			zod.z.literal(true)
		]).optional(),
		"judgments": zod.z.array(zod.z.object({
			"id": zod.z.string(),
			"stage": zod.z.union([zod.z.literal("assessment"), zod.z.literal("verification")]),
			"attempt": zod.z.number(),
			"model": zod.z.string(),
			"state": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("started"),
				zod.z.literal("completed"),
				zod.z.literal("interrupted")
			]),
			"startedAt": zod.z.string(),
			"finishedAt": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
			"durationMs": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
			"disposition": zod.z.union([
				zod.z.undefined(),
				zod.z.literal("skipped"),
				zod.z.literal("deferred"),
				zod.z.literal("prepare"),
				zod.z.literal("publish")
			]).optional(),
			"reason": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
		}))
	})),
	"nextCursor": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
	"readCompleteness": zod.z.union([zod.z.literal("complete"), zod.z.literal("partial")]),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"jobId": zod.z.string(),
	"judgmentId": zod.z.string()
});
let dsh_memory_wiki_memoryWiki_captureJudgment_result$schema$value;
const dsh_memory_wiki_memoryWiki_captureJudgment_result$schema = () => dsh_memory_wiki_memoryWiki_captureJudgment_result$schema$value ??= zod.z.object({
	"judgment": zod.z.union([zod.z.undefined(), zod.z.object({
		"id": zod.z.string(),
		"stage": zod.z.union([zod.z.literal("assessment"), zod.z.literal("verification")]),
		"attempt": zod.z.number(),
		"model": zod.z.string(),
		"rubricVersion": zod.z.string(),
		"requestHash": zod.z.string(),
		"evidenceHash": zod.z.string(),
		"patchHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"questions": zod.z.array(zod.z.object({
			"id": zod.z.string(),
			"type": zod.z.union([zod.z.literal("choice"), zod.z.literal("noul")]),
			"text": zod.z.string(),
			"options": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
				"value": zod.z.string(),
				"description": zod.z.string()
			}))]).optional()
		})),
		"result": zod.z.union([
			zod.z.undefined(),
			zod.z.object({
				"kind": zod.z.literal("decision"),
				"answers": zod.z.array(zod.z.union([zod.z.object({
					"id": zod.z.string(),
					"type": zod.z.literal("choice"),
					"choice": zod.z.string(),
					"confidence": zod.z.number(),
					"probabilities": zod.z.array(zod.z.object({
						"option": zod.z.string(),
						"probability": zod.z.number()
					}))
				}), zod.z.object({
					"id": zod.z.string(),
					"type": zod.z.literal("noul"),
					"value": zod.z.number()
				})])),
				"gateResults": zod.z.array(zod.z.object({
					"id": zod.z.string(),
					"questionId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
					"description": zod.z.string(),
					"operator": zod.z.union([zod.z.literal("gte"), zod.z.literal("eq")]),
					"actual": zod.z.union([
						zod.z.string(),
						zod.z.number(),
						zod.z.literal(false),
						zod.z.literal(true)
					]),
					"expected": zod.z.union([
						zod.z.string(),
						zod.z.number(),
						zod.z.literal(false),
						zod.z.literal(true)
					]),
					"passed": zod.z.boolean()
				})),
				"disposition": zod.z.union([
					zod.z.literal("skipped"),
					zod.z.literal("deferred"),
					zod.z.literal("prepare"),
					zod.z.literal("publish")
				]),
				"reasonCode": zod.z.string(),
				"reason": zod.z.string(),
				"usage": zod.z.union([zod.z.undefined(), zod.z.object({
					"inputTokens": zod.z.union([zod.z.literal(null), zod.z.number()]),
					"outputTokens": zod.z.union([zod.z.literal(null), zod.z.number()])
				})]).optional(),
				"requestId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
			}),
			zod.z.object({
				"kind": zod.z.literal("error"),
				"error": zod.z.object({
					"category": zod.z.string(),
					"message": zod.z.string(),
					"httpStatus": zod.z.union([zod.z.undefined(), zod.z.number()]).optional()
				})
			})
		]).optional()
	})]).optional(),
	"lifecycle": zod.z.union([zod.z.undefined(), zod.z.object({
		"id": zod.z.string(),
		"stage": zod.z.union([zod.z.literal("assessment"), zod.z.literal("verification")]),
		"attempt": zod.z.number(),
		"model": zod.z.string(),
		"state": zod.z.union([
			zod.z.literal("failed"),
			zod.z.literal("started"),
			zod.z.literal("completed"),
			zod.z.literal("interrupted")
		]),
		"startedAt": zod.z.string(),
		"finishedAt": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"durationMs": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
		"disposition": zod.z.union([
			zod.z.undefined(),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("prepare"),
			zod.z.literal("publish")
		]).optional(),
		"reason": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
	})]).optional(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_captureRecord_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_captureRecord_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_captureRecord_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"jobId": zod.z.string(),
	"afterEventSeq": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
	"limit": zod.z.union([zod.z.undefined(), zod.z.number()]).optional()
});
let dsh_memory_wiki_memoryWiki_captureRecord_result$schema$value;
const dsh_memory_wiki_memoryWiki_captureRecord_result$schema = () => dsh_memory_wiki_memoryWiki_captureRecord_result$schema$value ??= zod.z.object({
	"summary": zod.z.union([zod.z.undefined(), zod.z.object({
		"jobId": zod.z.string(),
		"phase": zod.z.union([
			zod.z.literal("queued"),
			zod.z.literal("judging"),
			zod.z.literal("preparing"),
			zod.z.literal("verifying"),
			zod.z.literal("publishing"),
			zod.z.literal("ingested"),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("failed"),
			zod.z.literal("needs_attention")
		]),
		"reason": zod.z.string(),
		"pages": zod.z.array(zod.z.string()),
		"updatedAt": zod.z.string(),
		"registeredAt": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"historyCoverage": zod.z.union([zod.z.literal("complete"), zod.z.literal("legacy_snapshot")]),
		"origin": zod.z.object({
			"sessionId": zod.z.string(),
			"turn": zod.z.number(),
			"turnStartSeq": zod.z.number(),
			"turnEndSeq": zod.z.number()
		}),
		"task": zod.z.string(),
		"taskTruncated": zod.z.boolean(),
		"evidenceHash": zod.z.string(),
		"rubricVersion": zod.z.string(),
		"rulesHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"patchHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"lastEventSeq": zod.z.number(),
		"publicationUncertain": zod.z.union([
			zod.z.undefined(),
			zod.z.literal(false),
			zod.z.literal(true)
		]).optional(),
		"retryable": zod.z.union([
			zod.z.undefined(),
			zod.z.literal(false),
			zod.z.literal(true)
		]).optional(),
		"judgments": zod.z.array(zod.z.object({
			"id": zod.z.string(),
			"stage": zod.z.union([zod.z.literal("assessment"), zod.z.literal("verification")]),
			"attempt": zod.z.number(),
			"model": zod.z.string(),
			"state": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("started"),
				zod.z.literal("completed"),
				zod.z.literal("interrupted")
			]),
			"startedAt": zod.z.string(),
			"finishedAt": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
			"durationMs": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
			"disposition": zod.z.union([
				zod.z.undefined(),
				zod.z.literal("skipped"),
				zod.z.literal("deferred"),
				zod.z.literal("prepare"),
				zod.z.literal("publish")
			]).optional(),
			"reason": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
		}))
	})]).optional(),
	"events": zod.z.array(zod.z.object({
		"seq": zod.z.number(),
		"at": zod.z.string(),
		"kind": zod.z.union([
			zod.z.literal("legacy_snapshot"),
			zod.z.literal("registered"),
			zod.z.literal("phase_changed"),
			zod.z.literal("judgment_started"),
			zod.z.literal("judgment_finished"),
			zod.z.literal("judgment_failed"),
			zod.z.literal("judgment_interrupted"),
			zod.z.literal("recovery_started"),
			zod.z.literal("publication_finished"),
			zod.z.literal("publication_interrupted"),
			zod.z.literal("operation_failed")
		]),
		"phase": zod.z.union([
			zod.z.undefined(),
			zod.z.literal("queued"),
			zod.z.literal("judging"),
			zod.z.literal("preparing"),
			zod.z.literal("verifying"),
			zod.z.literal("publishing"),
			zod.z.literal("ingested"),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("failed"),
			zod.z.literal("needs_attention")
		]).optional(),
		"reason": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"judgmentId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"stage": zod.z.union([
			zod.z.undefined(),
			zod.z.literal("queued"),
			zod.z.literal("judging"),
			zod.z.literal("preparing"),
			zod.z.literal("verifying"),
			zod.z.literal("publishing"),
			zod.z.literal("ingested"),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("failed"),
			zod.z.literal("needs_attention")
		]).optional(),
		"error": zod.z.union([zod.z.undefined(), zod.z.object({
			"category": zod.z.string(),
			"message": zod.z.string()
		})]).optional(),
		"durationMs": zod.z.union([zod.z.undefined(), zod.z.number()]).optional()
	})),
	"judgments": zod.z.array(zod.z.object({
		"id": zod.z.string(),
		"stage": zod.z.union([zod.z.literal("assessment"), zod.z.literal("verification")]),
		"attempt": zod.z.number(),
		"model": zod.z.string(),
		"state": zod.z.union([
			zod.z.literal("failed"),
			zod.z.literal("started"),
			zod.z.literal("completed"),
			zod.z.literal("interrupted")
		]),
		"startedAt": zod.z.string(),
		"finishedAt": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"durationMs": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
		"disposition": zod.z.union([
			zod.z.undefined(),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("prepare"),
			zod.z.literal("publish")
		]).optional(),
		"reason": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
	})),
	"nextEventSeq": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
	"evidence": zod.z.array(zod.z.object({
		"seq": zod.z.number(),
		"kind": zod.z.string(),
		"text": zod.z.string(),
		"truncated": zod.z.boolean()
	})),
	"evidenceTruncated": zod.z.boolean(),
	"limitations": zod.z.array(zod.z.string()),
	"changes": zod.z.array(zod.z.object({
		"path": zod.z.string(),
		"beforeHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"afterHash": zod.z.string()
	})),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_captureStatus_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_captureStatus_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_captureStatus_parameter_0$schema$value ??= zod.z.object({ "sessionId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional() });
let dsh_memory_wiki_memoryWiki_captureStatus_result$schema$value;
const dsh_memory_wiki_memoryWiki_captureStatus_result$schema = () => dsh_memory_wiki_memoryWiki_captureStatus_result$schema$value ??= zod.z.object({
	"collector": zod.z.union([
		zod.z.literal("disabled"),
		zod.z.literal("starting"),
		zod.z.literal("ready"),
		zod.z.literal("blocked")
	]),
	"history": zod.z.union([
		zod.z.literal("readable"),
		zod.z.literal("degraded"),
		zod.z.literal("unavailable")
	]),
	"reasonCode": zod.z.string(),
	"reason": zod.z.string(),
	"lastIssue": zod.z.union([zod.z.undefined(), zod.z.object({
		"at": zod.z.string(),
		"stage": zod.z.union([
			zod.z.literal("collecting"),
			zod.z.literal("worker_lock"),
			zod.z.literal("journal_write")
		]),
		"code": zod.z.string(),
		"message": zod.z.string(),
		"persisted": zod.z.boolean(),
		"turnEndSeq": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
		"jobId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
	})]).optional(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_clearOverride_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_clearOverride_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_clearOverride_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"expectedRevision": zod.z.number()
});
let dsh_memory_wiki_memoryWiki_clearOverride_result$schema$value;
const dsh_memory_wiki_memoryWiki_clearOverride_result$schema = () => dsh_memory_wiki_memoryWiki_clearOverride_result$schema$value ??= zod.z.object({
	"revision": zod.z.number(),
	"mode": zod.z.union([
		zod.z.literal("automatic"),
		zod.z.literal("manual-ready"),
		zod.z.literal("manual-invalid")
	]),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_graph_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_graph_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_graph_parameter_0$schema$value ??= zod.z.object({});
let dsh_memory_wiki_memoryWiki_graph_result$schema$value;
const dsh_memory_wiki_memoryWiki_graph_result$schema = () => dsh_memory_wiki_memoryWiki_graph_result$schema$value ??= zod.z.object({
	"libraryRevision": zod.z.string(),
	"pages": zod.z.array(zod.z.object({
		"pageId": zod.z.string(),
		"title": zod.z.string(),
		"kind": zod.z.union([
			zod.z.literal("source"),
			zod.z.literal("entity"),
			zod.z.literal("concept"),
			zod.z.literal("synthesis"),
			zod.z.literal("output")
		]),
		"contentHash": zod.z.string(),
		"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
	})),
	"edges": zod.z.array(zod.z.object({
		"from": zod.z.string(),
		"to": zod.z.string(),
		"source": zod.z.union([zod.z.literal("body"), zod.z.literal("related")]),
		"line": zod.z.union([zod.z.undefined(), zod.z.number()]).optional().describe("1-based file line for body edges; undefined for `related` edges.")
	})),
	"brokenLinks": zod.z.number(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"expectedRevision": zod.z.number()
});
let dsh_memory_wiki_memoryWiki_prepareOverride_result$schema$value;
const dsh_memory_wiki_memoryWiki_prepareOverride_result$schema = () => dsh_memory_wiki_memoryWiki_prepareOverride_result$schema$value ??= zod.z.object({
	"revision": zod.z.number(),
	"mode": zod.z.union([
		zod.z.literal("automatic"),
		zod.z.literal("manual-ready"),
		zod.z.literal("manual-invalid")
	]),
	"prepared": zod.z.union([zod.z.undefined(), zod.z.object({
		"snapshotId": zod.z.string(),
		"libraryRevision": zod.z.string(),
		"origin": zod.z.union([zod.z.literal("automatic"), zod.z.literal("manual")]),
		"budgetChars": zod.z.number().describe("Production values are 4000 | 8000; tests may pass smaller numbers."),
		"sources": zod.z.array(zod.z.object({
			"title": zod.z.string(),
			"segments": zod.z.array(zod.z.object({
				"startLine": zod.z.number(),
				"endLine": zod.z.number()
			})),
			"pageId": zod.z.string(),
			"contentHash": zod.z.string(),
			"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
		})),
		"text": zod.z.string(),
		"payloadHash": zod.z.string(),
		"chars": zod.z.number(),
		"report": zod.z.union([zod.z.undefined(), zod.z.object({
			"libraryRevision": zod.z.string(),
			"query": zod.z.string(),
			"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)]),
			"candidates": zod.z.array(zod.z.object({
				"pageId": zod.z.string(),
				"title": zod.z.string(),
				"contentHash": zod.z.string(),
				"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
				"match": zod.z.union([zod.z.literal("direct"), zod.z.literal("linked")]),
				"viaPageId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional().describe("For linked candidates: the direct hit that pulled this page in."),
				"selected": zod.z.boolean(),
				"excludedReason": zod.z.union([
					zod.z.undefined(),
					zod.z.literal("budget"),
					zod.z.literal("no-usable-block"),
					zod.z.literal("not-selected")
				]).optional(),
				"why": zod.z.array(zod.z.string()).describe("命中依据: the query terms that matched, most informative first."),
				"score": zod.z.number().describe("BM25 score for direct hits; 0 for linked-only candidates."),
				"rank": zod.z.number().describe("1-based ranking position among direct hits; 0 for linked candidates."),
				"segments": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
					"startLine": zod.z.number(),
					"endLine": zod.z.number()
				}))]).optional().describe("Block line ranges the compiler actually used (filled in by the compiler).")
			})),
			"edges": zod.z.array(zod.z.object({
				"from": zod.z.string(),
				"to": zod.z.string(),
				"source": zod.z.union([zod.z.literal("body"), zod.z.literal("related")])
			}))
		})]).optional()
	})]).optional(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_readPage_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_readPage_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_readPage_parameter_0$schema$value ??= zod.z.object({
	"pageId": zod.z.string(),
	"contentHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional().describe("When present, a page whose content hash differs is rejected rather than shown.")
});
let dsh_memory_wiki_memoryWiki_readPage_result$schema$value;
const dsh_memory_wiki_memoryWiki_readPage_result$schema = () => dsh_memory_wiki_memoryWiki_readPage_result$schema$value ??= zod.z.object({
	"page": zod.z.union([zod.z.undefined(), zod.z.object({
		"pageId": zod.z.string(),
		"title": zod.z.string(),
		"kind": zod.z.union([
			zod.z.literal("source"),
			zod.z.literal("entity"),
			zod.z.literal("concept"),
			zod.z.literal("synthesis"),
			zod.z.literal("output")
		]),
		"contentHash": zod.z.string(),
		"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"body": zod.z.string().describe("Markdown body (frontmatter removed). When `truncated` is true this is a prefix cut on a line boundary — never present it as the whole page."),
		"totalLines": zod.z.number(),
		"bodyStartLine": zod.z.number().describe("1-based **file** line of the first body line (frontmatter lines included). The server parses frontmatter, so this offset is derived here exactly once (design §4.2); clients must never recompute it."),
		"bodyChars": zod.z.number().describe("UTF-16 code units of `body` (the returned slice)."),
		"bodyBytes": zod.z.number().describe("UTF-8 bytes of `body` (the returned slice)."),
		"fullChars": zod.z.number().describe("UTF-16 code units of the FULL body, for a \"read the rest\" affordance."),
		"truncated": zod.z.boolean().describe("True when the page body exceeded the server threshold and was cut."),
		"limitChars": zod.z.number().describe("Server threshold that produced `truncated` (UTF-16 code units).")
	})]).optional(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"expectedRevision": zod.z.number(),
	"query": zod.z.string(),
	"selectedPages": zod.z.array(zod.z.object({
		"pageId": zod.z.string(),
		"contentHash": zod.z.string()
	})),
	"budgetChars": zod.z.union([zod.z.literal(4e3), zod.z.literal(8e3)]),
	"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)])
});
let dsh_memory_wiki_memoryWiki_reviseDraft_result$schema$value;
const dsh_memory_wiki_memoryWiki_reviseDraft_result$schema = () => dsh_memory_wiki_memoryWiki_reviseDraft_result$schema$value ??= zod.z.object({
	"revision": zod.z.number(),
	"mode": zod.z.union([
		zod.z.literal("automatic"),
		zod.z.literal("manual-ready"),
		zod.z.literal("manual-invalid")
	]),
	"draft": zod.z.union([zod.z.undefined(), zod.z.object({
		"query": zod.z.string(),
		"libraryRevision": zod.z.string(),
		"selectedPages": zod.z.array(zod.z.object({
			"pageId": zod.z.string(),
			"contentHash": zod.z.string(),
			"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
		})),
		"budgetChars": zod.z.union([zod.z.literal(4e3), zod.z.literal(8e3)]),
		"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)]),
		"preview": zod.z.object({
			"text": zod.z.string().describe("The exact text the panel shows. `prepareOverride` freezes THIS string."),
			"chars": zod.z.number(),
			"payloadHash": zod.z.string().describe("Hash of `text`; the prepared snapshot reuses it verbatim (design §5.2)."),
			"fits": zod.z.boolean(),
			"overBy": zod.z.number(),
			"sources": zod.z.array(zod.z.object({
				"pageId": zod.z.string(),
				"title": zod.z.string(),
				"contentHash": zod.z.string(),
				"segments": zod.z.array(zod.z.object({
					"startLine": zod.z.number(),
					"endLine": zod.z.number()
				}))
			}))
		})
	})]).optional(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_search_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_search_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_search_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string(),
	"query": zod.z.string(),
	"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)])
});
let dsh_memory_wiki_memoryWiki_search_result$schema$value;
const dsh_memory_wiki_memoryWiki_search_result$schema = () => dsh_memory_wiki_memoryWiki_search_result$schema$value ??= zod.z.object({
	"revision": zod.z.number(),
	"libraryRevision": zod.z.string(),
	"query": zod.z.string(),
	"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)]),
	"candidates": zod.z.array(zod.z.object({
		"pageId": zod.z.string(),
		"title": zod.z.string(),
		"contentHash": zod.z.string(),
		"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"match": zod.z.union([zod.z.literal("direct"), zod.z.literal("linked")]),
		"viaPageId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional().describe("For linked candidates: the direct hit that pulled this page in."),
		"selected": zod.z.boolean(),
		"excludedReason": zod.z.union([
			zod.z.undefined(),
			zod.z.literal("budget"),
			zod.z.literal("no-usable-block"),
			zod.z.literal("not-selected")
		]).optional(),
		"why": zod.z.array(zod.z.string()).describe("命中依据: the query terms that matched, most informative first."),
		"score": zod.z.number().describe("BM25 score for direct hits; 0 for linked-only candidates."),
		"rank": zod.z.number().describe("1-based ranking position among direct hits; 0 for linked candidates."),
		"segments": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
			"startLine": zod.z.number(),
			"endLine": zod.z.number()
		}))]).optional().describe("Block line ranges the compiler actually used (filled in by the compiler).")
	})),
	"edges": zod.z.array(zod.z.object({
		"from": zod.z.string(),
		"to": zod.z.string(),
		"source": zod.z.union([zod.z.literal("body"), zod.z.literal("related")])
	})),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_view_parameter_0$schema$value;
const dsh_memory_wiki_memoryWiki_view_parameter_0$schema = () => dsh_memory_wiki_memoryWiki_view_parameter_0$schema$value ??= zod.z.object({
	"sessionId": zod.z.string().describe("Client-visible session reference; the server re-resolves it (never trusted)."),
	"expectedRevision": zod.z.union([zod.z.undefined(), zod.z.number()]).optional().describe("Revision the client already shows. Omit to read the current state.")
});
let dsh_memory_wiki_memoryWiki_view_result$schema$value;
const dsh_memory_wiki_memoryWiki_view_result$schema = () => dsh_memory_wiki_memoryWiki_view_result$schema$value ??= zod.z.object({
	"revision": zod.z.number(),
	"mode": zod.z.union([
		zod.z.literal("automatic"),
		zod.z.literal("manual-ready"),
		zod.z.literal("manual-invalid")
	]),
	"budgetChars": zod.z.union([zod.z.literal(4e3), zod.z.literal(8e3)]),
	"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)]),
	"draft": zod.z.union([zod.z.undefined(), zod.z.object({
		"query": zod.z.string(),
		"libraryRevision": zod.z.string(),
		"selectedPages": zod.z.array(zod.z.object({
			"pageId": zod.z.string(),
			"contentHash": zod.z.string(),
			"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
		})),
		"budgetChars": zod.z.union([zod.z.literal(4e3), zod.z.literal(8e3)]),
		"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)]),
		"preview": zod.z.object({
			"text": zod.z.string().describe("The exact text the panel shows. `prepareOverride` freezes THIS string."),
			"chars": zod.z.number(),
			"payloadHash": zod.z.string().describe("Hash of `text`; the prepared snapshot reuses it verbatim (design §5.2)."),
			"fits": zod.z.boolean(),
			"overBy": zod.z.number(),
			"sources": zod.z.array(zod.z.object({
				"pageId": zod.z.string(),
				"title": zod.z.string(),
				"contentHash": zod.z.string(),
				"segments": zod.z.array(zod.z.object({
					"startLine": zod.z.number(),
					"endLine": zod.z.number()
				}))
			}))
		})
	})]).optional(),
	"prepared": zod.z.union([zod.z.undefined(), zod.z.object({
		"snapshotId": zod.z.string(),
		"libraryRevision": zod.z.string(),
		"origin": zod.z.union([zod.z.literal("automatic"), zod.z.literal("manual")]),
		"budgetChars": zod.z.number().describe("Production values are 4000 | 8000; tests may pass smaller numbers."),
		"sources": zod.z.array(zod.z.object({
			"title": zod.z.string(),
			"segments": zod.z.array(zod.z.object({
				"startLine": zod.z.number(),
				"endLine": zod.z.number()
			})),
			"pageId": zod.z.string(),
			"contentHash": zod.z.string(),
			"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional()
		})),
		"text": zod.z.string(),
		"payloadHash": zod.z.string(),
		"chars": zod.z.number(),
		"report": zod.z.union([zod.z.undefined(), zod.z.object({
			"libraryRevision": zod.z.string(),
			"query": zod.z.string(),
			"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)]),
			"candidates": zod.z.array(zod.z.object({
				"pageId": zod.z.string(),
				"title": zod.z.string(),
				"contentHash": zod.z.string(),
				"asOf": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
				"match": zod.z.union([zod.z.literal("direct"), zod.z.literal("linked")]),
				"viaPageId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional().describe("For linked candidates: the direct hit that pulled this page in."),
				"selected": zod.z.boolean(),
				"excludedReason": zod.z.union([
					zod.z.undefined(),
					zod.z.literal("budget"),
					zod.z.literal("no-usable-block"),
					zod.z.literal("not-selected")
				]).optional(),
				"why": zod.z.array(zod.z.string()).describe("命中依据: the query terms that matched, most informative first."),
				"score": zod.z.number().describe("BM25 score for direct hits; 0 for linked-only candidates."),
				"rank": zod.z.number().describe("1-based ranking position among direct hits; 0 for linked candidates."),
				"segments": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
					"startLine": zod.z.number(),
					"endLine": zod.z.number()
				}))]).optional().describe("Block line ranges the compiler actually used (filled in by the compiler).")
			})),
			"edges": zod.z.array(zod.z.object({
				"from": zod.z.string(),
				"to": zod.z.string(),
				"source": zod.z.union([zod.z.literal("body"), zod.z.literal("related")])
			}))
		})]).optional()
	})]).optional(),
	"currentTurn": zod.z.union([zod.z.undefined(), zod.z.object({
		"turn": zod.z.number(),
		"phase": zod.z.string(),
		"snapshotId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"payloadHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
		"committedSeq": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
		"reInjections": zod.z.number()
	})]).optional(),
	"capture": zod.z.union([zod.z.undefined(), zod.z.object({
		"jobId": zod.z.string(),
		"phase": zod.z.union([
			zod.z.literal("queued"),
			zod.z.literal("judging"),
			zod.z.literal("preparing"),
			zod.z.literal("verifying"),
			zod.z.literal("publishing"),
			zod.z.literal("ingested"),
			zod.z.literal("skipped"),
			zod.z.literal("deferred"),
			zod.z.literal("failed"),
			zod.z.literal("needs_attention")
		]),
		"reason": zod.z.string(),
		"pages": zod.z.array(zod.z.string()),
		"updatedAt": zod.z.string(),
		"evidence": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
			"seq": zod.z.number(),
			"kind": zod.z.string(),
			"text": zod.z.string(),
			"truncated": zod.z.boolean()
		}))]).optional(),
		"evidenceTruncated": zod.z.union([
			zod.z.undefined(),
			zod.z.literal(false),
			zod.z.literal(true)
		]).optional(),
		"changes": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
			"path": zod.z.string(),
			"beforeHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
			"afterHash": zod.z.string()
		}))]).optional(),
		"limitations": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).optional()
	})]).optional(),
	"skippedReason": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
	"error": zod.z.union([
		zod.z.undefined(),
		zod.z.object({
			"code": zod.z.literal("unknown-session"),
			"sessionId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("stale-revision"),
			"expected": zod.z.number(),
			"actual": zod.z.number()
		}),
		zod.z.object({ "code": zod.z.literal("nothing-selected") }),
		zod.z.object({
			"code": zod.z.literal("unknown-page"),
			"pageId": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("library-changed"),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("page-version-mismatch"),
			"pageId": zod.z.string(),
			"expected": zod.z.string(),
			"actual": zod.z.string()
		}),
		zod.z.object({
			"code": zod.z.literal("manual-over-budget"),
			"overBy": zod.z.number(),
			"budgetChars": zod.z.number(),
			"selectedChars": zod.z.number()
		}),
		zod.z.object({
			"code": zod.z.literal("no-usable-block"),
			"pageIds": zod.z.array(zod.z.string())
		}),
		zod.z.object({
			"code": zod.z.literal("wiki-unavailable"),
			"reason": zod.z.union([zod.z.literal("not-configured"), zod.z.literal("read-failed")])
		}),
		zod.z.object({ "code": zod.z.literal("capture-unavailable") }),
		zod.z.object({ "code": zod.z.literal("capture-record-unavailable") }),
		zod.z.object({
			"code": zod.z.literal("capture-invalid-query"),
			"field": zod.z.union([
				zod.z.literal("limit"),
				zod.z.literal("cursor"),
				zod.z.literal("status"),
				zod.z.literal("event-seq")
			])
		})
	]).optional()
});
let dsh_memory_wiki_memoryWiki_captureHistory_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_captureHistory_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_captureHistory_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"cursor": zod.z.union([zod.z.undefined(), zod.z.string()]).optional(),
	"limit": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
	"status": zod.z.union([
		zod.z.undefined(),
		zod.z.literal("ingested"),
		zod.z.literal("skipped"),
		zod.z.literal("deferred"),
		zod.z.literal("processing"),
		zod.z.literal("error")
	]).optional()
});
let dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"jobId": zod.z.string(),
	"judgmentId": zod.z.string()
});
let dsh_memory_wiki_memoryWiki_captureRecord_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_captureRecord_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_captureRecord_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"jobId": zod.z.string(),
	"afterEventSeq": zod.z.union([zod.z.undefined(), zod.z.number()]).optional(),
	"limit": zod.z.union([zod.z.undefined(), zod.z.number()]).optional()
});
let dsh_memory_wiki_memoryWiki_captureStatus_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_captureStatus_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_captureStatus_parameter_0_strict$schema$value ??= zod.z.strictObject({ "sessionId": zod.z.union([zod.z.undefined(), zod.z.string()]).optional() });
let dsh_memory_wiki_memoryWiki_clearOverride_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_clearOverride_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_clearOverride_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"expectedRevision": zod.z.number()
});
let dsh_memory_wiki_memoryWiki_graph_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_graph_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_graph_parameter_0_strict$schema$value ??= zod.z.strictObject({});
let dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"expectedRevision": zod.z.number()
});
let dsh_memory_wiki_memoryWiki_readPage_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_readPage_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_readPage_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"pageId": zod.z.string(),
	"contentHash": zod.z.union([zod.z.undefined(), zod.z.string()]).optional().describe("When present, a page whose content hash differs is rejected rather than shown.")
});
let dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"expectedRevision": zod.z.number(),
	"query": zod.z.string(),
	"selectedPages": zod.z.array(zod.z.strictObject({
		"pageId": zod.z.string(),
		"contentHash": zod.z.string()
	})),
	"budgetChars": zod.z.union([zod.z.literal(4e3), zod.z.literal(8e3)]),
	"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)])
});
let dsh_memory_wiki_memoryWiki_search_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_search_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_search_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string(),
	"query": zod.z.string(),
	"hops": zod.z.union([zod.z.literal(0), zod.z.literal(1)])
});
let dsh_memory_wiki_memoryWiki_view_parameter_0_strict$schema$value;
const dsh_memory_wiki_memoryWiki_view_parameter_0_strict$schema = () => dsh_memory_wiki_memoryWiki_view_parameter_0_strict$schema$value ??= zod.z.strictObject({
	"sessionId": zod.z.string().describe("Client-visible session reference; the server re-resolves it (never trusted)."),
	"expectedRevision": zod.z.union([zod.z.undefined(), zod.z.number()]).optional().describe("Revision the client already shows. Omit to read the current state.")
});
const TYPERT_REMOTE = createTypertRemoteInfo({
	package: "dsh-memory-wiki",
	methods: {
		"memoryWiki/captureHistory": {
			service: "memoryWiki",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureHistoryInput",
					create: dsh_memory_wiki_memoryWiki_captureHistory_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"cursor": { "type": "string" },
							"limit": { "type": "number" },
							"status": {
								"type": "string",
								"enum": [
									"ingested",
									"skipped",
									"deferred",
									"processing",
									"error"
								]
							}
						},
						"required": ["sessionId"],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureHistoryInput",
					create: dsh_memory_wiki_memoryWiki_captureHistory_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"cursor": { "type": "string" },
							"limit": { "type": "number" },
							"status": {
								"type": "string",
								"enum": [
									"ingested",
									"skipped",
									"deferred",
									"processing",
									"error"
								]
							}
						},
						"required": ["sessionId"],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#CaptureHistoryResult",
				create: dsh_memory_wiki_memoryWiki_captureHistory_result$schema,
				jsonSchema: {
					"type": "object",
					"properties": {
						"items": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"jobId": { "type": "string" },
									"phase": {
										"type": "string",
										"enum": [
											"queued",
											"judging",
											"preparing",
											"verifying",
											"publishing",
											"ingested",
											"skipped",
											"deferred",
											"failed",
											"needs_attention"
										]
									},
									"reason": { "type": "string" },
									"pages": {
										"type": "array",
										"items": { "type": "string" }
									},
									"updatedAt": { "type": "string" },
									"registeredAt": { "type": "string" },
									"historyCoverage": {
										"type": "string",
										"enum": ["complete", "legacy_snapshot"]
									},
									"origin": {
										"type": "object",
										"properties": {
											"sessionId": { "type": "string" },
											"turn": { "type": "number" },
											"turnStartSeq": { "type": "number" },
											"turnEndSeq": { "type": "number" }
										},
										"required": [
											"sessionId",
											"turn",
											"turnStartSeq",
											"turnEndSeq"
										],
										"additionalProperties": true
									},
									"task": { "type": "string" },
									"taskTruncated": { "type": "boolean" },
									"evidenceHash": { "type": "string" },
									"rubricVersion": { "type": "string" },
									"rulesHash": { "type": "string" },
									"patchHash": { "type": "string" },
									"lastEventSeq": { "type": "number" },
									"publicationUncertain": {
										"type": "boolean",
										"enum": [false, true]
									},
									"retryable": {
										"type": "boolean",
										"enum": [false, true]
									},
									"judgments": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"id": { "type": "string" },
												"stage": {
													"type": "string",
													"enum": ["assessment", "verification"]
												},
												"attempt": { "type": "number" },
												"model": { "type": "string" },
												"state": {
													"type": "string",
													"enum": [
														"failed",
														"started",
														"completed",
														"interrupted"
													]
												},
												"startedAt": { "type": "string" },
												"finishedAt": { "type": "string" },
												"durationMs": { "type": "number" },
												"disposition": {
													"type": "string",
													"enum": [
														"skipped",
														"deferred",
														"prepare",
														"publish"
													]
												},
												"reason": { "type": "string" }
											},
											"required": [
												"id",
												"stage",
												"attempt",
												"model",
												"state",
												"startedAt"
											],
											"additionalProperties": true
										}
									}
								},
								"required": [
									"jobId",
									"phase",
									"reason",
									"pages",
									"updatedAt",
									"historyCoverage",
									"origin",
									"task",
									"taskTruncated",
									"evidenceHash",
									"rubricVersion",
									"lastEventSeq",
									"judgments"
								],
								"additionalProperties": true
							}
						},
						"nextCursor": { "type": "string" },
						"readCompleteness": {
							"type": "string",
							"enum": ["complete", "partial"]
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": ["items", "readCompleteness"],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 169,
				"column": 9
			}
		},
		"memoryWiki/captureJudgment": {
			service: "memoryWiki",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureJudgmentInput",
					create: dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"jobId": { "type": "string" },
							"judgmentId": { "type": "string" }
						},
						"required": [
							"sessionId",
							"jobId",
							"judgmentId"
						],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureJudgmentInput",
					create: dsh_memory_wiki_memoryWiki_captureJudgment_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"jobId": { "type": "string" },
							"judgmentId": { "type": "string" }
						},
						"required": [
							"sessionId",
							"jobId",
							"judgmentId"
						],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#CaptureJudgmentResult",
				create: dsh_memory_wiki_memoryWiki_captureJudgment_result$schema,
				jsonSchema: {
					"type": "object",
					"properties": {
						"judgment": {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"stage": {
									"type": "string",
									"enum": ["assessment", "verification"]
								},
								"attempt": { "type": "number" },
								"model": { "type": "string" },
								"rubricVersion": { "type": "string" },
								"requestHash": { "type": "string" },
								"evidenceHash": { "type": "string" },
								"patchHash": { "type": "string" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"type": {
												"type": "string",
												"enum": ["choice", "noul"]
											},
											"text": { "type": "string" },
											"options": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"value": { "type": "string" },
														"description": { "type": "string" }
													},
													"required": ["value", "description"],
													"additionalProperties": true
												}
											}
										},
										"required": [
											"id",
											"type",
											"text"
										],
										"additionalProperties": true
									}
								},
								"result": { "oneOf": [{
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"const": "decision"
										},
										"answers": {
											"type": "array",
											"items": { "oneOf": [{
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"type": {
														"type": "string",
														"const": "choice"
													},
													"choice": { "type": "string" },
													"confidence": { "type": "number" },
													"probabilities": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"option": { "type": "string" },
																"probability": { "type": "number" }
															},
															"required": ["option", "probability"],
															"additionalProperties": true
														}
													}
												},
												"required": [
													"id",
													"type",
													"choice",
													"confidence",
													"probabilities"
												],
												"additionalProperties": true
											}, {
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"type": {
														"type": "string",
														"const": "noul"
													},
													"value": { "type": "number" }
												},
												"required": [
													"id",
													"type",
													"value"
												],
												"additionalProperties": true
											}] }
										},
										"gateResults": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"questionId": { "type": "string" },
													"description": { "type": "string" },
													"operator": {
														"type": "string",
														"enum": ["gte", "eq"]
													},
													"actual": { "oneOf": [
														{ "type": "string" },
														{ "type": "number" },
														{
															"type": "boolean",
															"enum": [false, true]
														}
													] },
													"expected": { "oneOf": [
														{ "type": "string" },
														{ "type": "number" },
														{
															"type": "boolean",
															"enum": [false, true]
														}
													] },
													"passed": { "type": "boolean" }
												},
												"required": [
													"id",
													"description",
													"operator",
													"actual",
													"expected",
													"passed"
												],
												"additionalProperties": true
											}
										},
										"disposition": {
											"type": "string",
											"enum": [
												"skipped",
												"deferred",
												"prepare",
												"publish"
											]
										},
										"reasonCode": { "type": "string" },
										"reason": { "type": "string" },
										"usage": {
											"type": "object",
											"properties": {
												"inputTokens": { "oneOf": [{
													"type": "null",
													"const": null
												}, { "type": "number" }] },
												"outputTokens": { "oneOf": [{
													"type": "null",
													"const": null
												}, { "type": "number" }] }
											},
											"required": ["inputTokens", "outputTokens"],
											"additionalProperties": true
										},
										"requestId": { "type": "string" }
									},
									"required": [
										"kind",
										"answers",
										"gateResults",
										"disposition",
										"reasonCode",
										"reason"
									],
									"additionalProperties": true
								}, {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"const": "error"
										},
										"error": {
											"type": "object",
											"properties": {
												"category": { "type": "string" },
												"message": { "type": "string" },
												"httpStatus": { "type": "number" }
											},
											"required": ["category", "message"],
											"additionalProperties": true
										}
									},
									"required": ["kind", "error"],
									"additionalProperties": true
								}] }
							},
							"required": [
								"id",
								"stage",
								"attempt",
								"model",
								"rubricVersion",
								"requestHash",
								"evidenceHash",
								"questions"
							],
							"additionalProperties": true
						},
						"lifecycle": {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"stage": {
									"type": "string",
									"enum": ["assessment", "verification"]
								},
								"attempt": { "type": "number" },
								"model": { "type": "string" },
								"state": {
									"type": "string",
									"enum": [
										"failed",
										"started",
										"completed",
										"interrupted"
									]
								},
								"startedAt": { "type": "string" },
								"finishedAt": { "type": "string" },
								"durationMs": { "type": "number" },
								"disposition": {
									"type": "string",
									"enum": [
										"skipped",
										"deferred",
										"prepare",
										"publish"
									]
								},
								"reason": { "type": "string" }
							},
							"required": [
								"id",
								"stage",
								"attempt",
								"model",
								"state",
								"startedAt"
							],
							"additionalProperties": true
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 175,
				"column": 9
			}
		},
		"memoryWiki/captureRecord": {
			service: "memoryWiki",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureRecordInput",
					create: dsh_memory_wiki_memoryWiki_captureRecord_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"jobId": { "type": "string" },
							"afterEventSeq": { "type": "number" },
							"limit": { "type": "number" }
						},
						"required": ["sessionId", "jobId"],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureRecordInput",
					create: dsh_memory_wiki_memoryWiki_captureRecord_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"jobId": { "type": "string" },
							"afterEventSeq": { "type": "number" },
							"limit": { "type": "number" }
						},
						"required": ["sessionId", "jobId"],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#CaptureRecordResult",
				create: dsh_memory_wiki_memoryWiki_captureRecord_result$schema,
				jsonSchema: {
					"type": "object",
					"properties": {
						"summary": {
							"type": "object",
							"properties": {
								"jobId": { "type": "string" },
								"phase": {
									"type": "string",
									"enum": [
										"queued",
										"judging",
										"preparing",
										"verifying",
										"publishing",
										"ingested",
										"skipped",
										"deferred",
										"failed",
										"needs_attention"
									]
								},
								"reason": { "type": "string" },
								"pages": {
									"type": "array",
									"items": { "type": "string" }
								},
								"updatedAt": { "type": "string" },
								"registeredAt": { "type": "string" },
								"historyCoverage": {
									"type": "string",
									"enum": ["complete", "legacy_snapshot"]
								},
								"origin": {
									"type": "object",
									"properties": {
										"sessionId": { "type": "string" },
										"turn": { "type": "number" },
										"turnStartSeq": { "type": "number" },
										"turnEndSeq": { "type": "number" }
									},
									"required": [
										"sessionId",
										"turn",
										"turnStartSeq",
										"turnEndSeq"
									],
									"additionalProperties": true
								},
								"task": { "type": "string" },
								"taskTruncated": { "type": "boolean" },
								"evidenceHash": { "type": "string" },
								"rubricVersion": { "type": "string" },
								"rulesHash": { "type": "string" },
								"patchHash": { "type": "string" },
								"lastEventSeq": { "type": "number" },
								"publicationUncertain": {
									"type": "boolean",
									"enum": [false, true]
								},
								"retryable": {
									"type": "boolean",
									"enum": [false, true]
								},
								"judgments": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"stage": {
												"type": "string",
												"enum": ["assessment", "verification"]
											},
											"attempt": { "type": "number" },
											"model": { "type": "string" },
											"state": {
												"type": "string",
												"enum": [
													"failed",
													"started",
													"completed",
													"interrupted"
												]
											},
											"startedAt": { "type": "string" },
											"finishedAt": { "type": "string" },
											"durationMs": { "type": "number" },
											"disposition": {
												"type": "string",
												"enum": [
													"skipped",
													"deferred",
													"prepare",
													"publish"
												]
											},
											"reason": { "type": "string" }
										},
										"required": [
											"id",
											"stage",
											"attempt",
											"model",
											"state",
											"startedAt"
										],
										"additionalProperties": true
									}
								}
							},
							"required": [
								"jobId",
								"phase",
								"reason",
								"pages",
								"updatedAt",
								"historyCoverage",
								"origin",
								"task",
								"taskTruncated",
								"evidenceHash",
								"rubricVersion",
								"lastEventSeq",
								"judgments"
							],
							"additionalProperties": true
						},
						"events": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"seq": { "type": "number" },
									"at": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": [
											"legacy_snapshot",
											"registered",
											"phase_changed",
											"judgment_started",
											"judgment_finished",
											"judgment_failed",
											"judgment_interrupted",
											"recovery_started",
											"publication_finished",
											"publication_interrupted",
											"operation_failed"
										]
									},
									"phase": {
										"type": "string",
										"enum": [
											"queued",
											"judging",
											"preparing",
											"verifying",
											"publishing",
											"ingested",
											"skipped",
											"deferred",
											"failed",
											"needs_attention"
										]
									},
									"reason": { "type": "string" },
									"judgmentId": { "type": "string" },
									"stage": {
										"type": "string",
										"enum": [
											"queued",
											"judging",
											"preparing",
											"verifying",
											"publishing",
											"ingested",
											"skipped",
											"deferred",
											"failed",
											"needs_attention"
										]
									},
									"error": {
										"type": "object",
										"properties": {
											"category": { "type": "string" },
											"message": { "type": "string" }
										},
										"required": ["category", "message"],
										"additionalProperties": true
									},
									"durationMs": { "type": "number" }
								},
								"required": [
									"seq",
									"at",
									"kind"
								],
								"additionalProperties": true
							}
						},
						"judgments": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"stage": {
										"type": "string",
										"enum": ["assessment", "verification"]
									},
									"attempt": { "type": "number" },
									"model": { "type": "string" },
									"state": {
										"type": "string",
										"enum": [
											"failed",
											"started",
											"completed",
											"interrupted"
										]
									},
									"startedAt": { "type": "string" },
									"finishedAt": { "type": "string" },
									"durationMs": { "type": "number" },
									"disposition": {
										"type": "string",
										"enum": [
											"skipped",
											"deferred",
											"prepare",
											"publish"
										]
									},
									"reason": { "type": "string" }
								},
								"required": [
									"id",
									"stage",
									"attempt",
									"model",
									"state",
									"startedAt"
								],
								"additionalProperties": true
							}
						},
						"nextEventSeq": { "type": "number" },
						"evidence": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"seq": { "type": "number" },
									"kind": { "type": "string" },
									"text": { "type": "string" },
									"truncated": { "type": "boolean" }
								},
								"required": [
									"seq",
									"kind",
									"text",
									"truncated"
								],
								"additionalProperties": true
							}
						},
						"evidenceTruncated": { "type": "boolean" },
						"limitations": {
							"type": "array",
							"items": { "type": "string" }
						},
						"changes": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"path": { "type": "string" },
									"beforeHash": { "type": "string" },
									"afterHash": { "type": "string" }
								},
								"required": ["path", "afterHash"],
								"additionalProperties": true
							}
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [
						"events",
						"judgments",
						"evidence",
						"evidenceTruncated",
						"limitations",
						"changes"
					],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 172,
				"column": 9
			}
		},
		"memoryWiki/captureStatus": {
			service: "memoryWiki",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureStatusInput",
					create: dsh_memory_wiki_memoryWiki_captureStatus_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": { "sessionId": { "type": "string" } },
						"required": [],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#CaptureStatusInput",
					create: dsh_memory_wiki_memoryWiki_captureStatus_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": { "sessionId": { "type": "string" } },
						"required": [],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#CaptureStatusResult",
				create: dsh_memory_wiki_memoryWiki_captureStatus_result$schema,
				jsonSchema: {
					"type": "object",
					"properties": {
						"collector": {
							"type": "string",
							"enum": [
								"disabled",
								"starting",
								"ready",
								"blocked"
							]
						},
						"history": {
							"type": "string",
							"enum": [
								"readable",
								"degraded",
								"unavailable"
							]
						},
						"reasonCode": { "type": "string" },
						"reason": { "type": "string" },
						"lastIssue": {
							"type": "object",
							"properties": {
								"at": { "type": "string" },
								"stage": {
									"type": "string",
									"enum": [
										"collecting",
										"worker_lock",
										"journal_write"
									]
								},
								"code": { "type": "string" },
								"message": { "type": "string" },
								"persisted": { "type": "boolean" },
								"turnEndSeq": { "type": "number" },
								"jobId": { "type": "string" }
							},
							"required": [
								"at",
								"stage",
								"code",
								"message",
								"persisted"
							],
							"additionalProperties": true
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [
						"collector",
						"history",
						"reasonCode",
						"reason"
					],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 162,
				"column": 9
			}
		},
		"memoryWiki/clearOverride": {
			service: "memoryWiki",
			description: "Drop a still-unconsumed prepared override and return to automatic selection.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				description: "session and expected revision.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#ClearOverrideInput",
					create: dsh_memory_wiki_memoryWiki_clearOverride_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"expectedRevision": { "type": "number" }
						},
						"required": ["sessionId", "expectedRevision"],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#ClearOverrideInput",
					create: dsh_memory_wiki_memoryWiki_clearOverride_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"expectedRevision": { "type": "number" }
						},
						"required": ["sessionId", "expectedRevision"],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#ClearResult",
				create: dsh_memory_wiki_memoryWiki_clearOverride_result$schema,
				description: "the automatic mode and the new revision.",
				jsonSchema: {
					"type": "object",
					"properties": {
						"revision": { "type": "number" },
						"mode": {
							"type": "string",
							"enum": [
								"automatic",
								"manual-ready",
								"manual-invalid"
							]
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": ["revision", "mode"],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 229,
				"column": 9
			}
		},
		"memoryWiki/graph": {
			service: "memoryWiki",
			description: "Read all library page metadata and resolved links without a session.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#GraphInput",
					create: dsh_memory_wiki_memoryWiki_graph_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {},
						"required": [],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#GraphInput",
					create: dsh_memory_wiki_memoryWiki_graph_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {},
						"required": [],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#GraphResult",
				create: dsh_memory_wiki_memoryWiki_graph_result$schema,
				jsonSchema: {
					"type": "object",
					"properties": {
						"libraryRevision": { "type": "string" },
						"pages": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"pageId": { "type": "string" },
									"title": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": [
											"source",
											"entity",
											"concept",
											"synthesis",
											"output"
										]
									},
									"contentHash": { "type": "string" },
									"asOf": { "type": "string" }
								},
								"required": [
									"pageId",
									"title",
									"kind",
									"contentHash"
								],
								"additionalProperties": true
							}
						},
						"edges": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"from": { "type": "string" },
									"to": { "type": "string" },
									"source": {
										"type": "string",
										"enum": ["body", "related"]
									},
									"line": {
										"type": "number",
										"description": "1-based file line for body edges; undefined for `related` edges."
									}
								},
								"required": [
									"from",
									"to",
									"source"
								],
								"additionalProperties": true
							}
						},
						"brokenLinks": { "type": "number" },
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [
						"libraryRevision",
						"pages",
						"edges",
						"brokenLinks"
					],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 179,
				"column": 9
			}
		},
		"memoryWiki/prepareOverride": {
			service: "memoryWiki",
			description: "Freeze the current draft into the snapshot the next human turn will carry.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				description: "session and expected revision.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#PrepareOverrideInput",
					create: dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"expectedRevision": { "type": "number" }
						},
						"required": ["sessionId", "expectedRevision"],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#PrepareOverrideInput",
					create: dsh_memory_wiki_memoryWiki_prepareOverride_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"expectedRevision": { "type": "number" }
						},
						"required": ["sessionId", "expectedRevision"],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#OverrideResult",
				create: dsh_memory_wiki_memoryWiki_prepareOverride_result$schema,
				description: "the prepared snapshot, or the reason it could not be prepared.",
				jsonSchema: {
					"type": "object",
					"properties": {
						"revision": { "type": "number" },
						"mode": {
							"type": "string",
							"enum": [
								"automatic",
								"manual-ready",
								"manual-invalid"
							]
						},
						"prepared": {
							"type": "object",
							"properties": {
								"snapshotId": { "type": "string" },
								"libraryRevision": { "type": "string" },
								"origin": {
									"type": "string",
									"enum": ["automatic", "manual"]
								},
								"budgetChars": {
									"type": "number",
									"description": "Production values are 4000 | 8000; tests may pass smaller numbers."
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"title": { "type": "string" },
											"segments": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"startLine": { "type": "number" },
														"endLine": { "type": "number" }
													},
													"required": ["startLine", "endLine"],
													"additionalProperties": true
												}
											},
											"pageId": { "type": "string" },
											"contentHash": { "type": "string" },
											"asOf": { "type": "string" }
										},
										"required": [
											"title",
											"segments",
											"pageId",
											"contentHash"
										],
										"additionalProperties": true
									}
								},
								"text": { "type": "string" },
								"payloadHash": { "type": "string" },
								"chars": { "type": "number" },
								"report": {
									"type": "object",
									"properties": {
										"libraryRevision": { "type": "string" },
										"query": { "type": "string" },
										"hops": {
											"type": "number",
											"enum": [0, 1]
										},
										"candidates": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"pageId": { "type": "string" },
													"title": { "type": "string" },
													"contentHash": { "type": "string" },
													"asOf": { "type": "string" },
													"match": {
														"type": "string",
														"enum": ["direct", "linked"]
													},
													"viaPageId": {
														"type": "string",
														"description": "For linked candidates: the direct hit that pulled this page in."
													},
													"selected": { "type": "boolean" },
													"excludedReason": {
														"type": "string",
														"enum": [
															"budget",
															"no-usable-block",
															"not-selected"
														]
													},
													"why": {
														"type": "array",
														"items": { "type": "string" },
														"description": "命中依据: the query terms that matched, most informative first."
													},
													"score": {
														"type": "number",
														"description": "BM25 score for direct hits; 0 for linked-only candidates."
													},
													"rank": {
														"type": "number",
														"description": "1-based ranking position among direct hits; 0 for linked candidates."
													},
													"segments": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"startLine": { "type": "number" },
																"endLine": { "type": "number" }
															},
															"required": ["startLine", "endLine"],
															"additionalProperties": true
														},
														"description": "Block line ranges the compiler actually used (filled in by the compiler)."
													}
												},
												"required": [
													"pageId",
													"title",
													"contentHash",
													"match",
													"selected",
													"why",
													"score",
													"rank"
												],
												"additionalProperties": true
											}
										},
										"edges": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"from": { "type": "string" },
													"to": { "type": "string" },
													"source": {
														"type": "string",
														"enum": ["body", "related"]
													}
												},
												"required": [
													"from",
													"to",
													"source"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"libraryRevision",
										"query",
										"hops",
										"candidates",
										"edges"
									],
									"additionalProperties": true
								}
							},
							"required": [
								"snapshotId",
								"libraryRevision",
								"origin",
								"budgetChars",
								"sources",
								"text",
								"payloadHash",
								"chars"
							],
							"additionalProperties": true
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": ["revision", "mode"],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 219,
				"column": 9
			}
		},
		"memoryWiki/readPage": {
			service: "memoryWiki",
			description: "Read one page of the current library, optionally pinned to a version.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				description: "page id and the content hash the client saw.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#ReadPageInput",
					create: dsh_memory_wiki_memoryWiki_readPage_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"pageId": { "type": "string" },
							"contentHash": {
								"type": "string",
								"description": "When present, a page whose content hash differs is rejected rather than shown."
							}
						},
						"required": ["pageId"],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#ReadPageInput",
					create: dsh_memory_wiki_memoryWiki_readPage_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"pageId": { "type": "string" },
							"contentHash": {
								"type": "string",
								"description": "When present, a page whose content hash differs is rejected rather than shown."
							}
						},
						"required": ["pageId"],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#ReadPageResult",
				create: dsh_memory_wiki_memoryWiki_readPage_result$schema,
				description: "the page, or a typed error when it is unknown or has changed.",
				jsonSchema: {
					"type": "object",
					"properties": {
						"page": {
							"type": "object",
							"properties": {
								"pageId": { "type": "string" },
								"title": { "type": "string" },
								"kind": {
									"type": "string",
									"enum": [
										"source",
										"entity",
										"concept",
										"synthesis",
										"output"
									]
								},
								"contentHash": { "type": "string" },
								"asOf": { "type": "string" },
								"body": {
									"type": "string",
									"description": "Markdown body (frontmatter removed). When `truncated` is true this is a prefix cut on a line boundary — never present it as the whole page."
								},
								"totalLines": { "type": "number" },
								"bodyStartLine": {
									"type": "number",
									"description": "1-based **file** line of the first body line (frontmatter lines included). The server parses frontmatter, so this offset is derived here exactly once (design §4.2); clients must never recompute it."
								},
								"bodyChars": {
									"type": "number",
									"description": "UTF-16 code units of `body` (the returned slice)."
								},
								"bodyBytes": {
									"type": "number",
									"description": "UTF-8 bytes of `body` (the returned slice)."
								},
								"fullChars": {
									"type": "number",
									"description": "UTF-16 code units of the FULL body, for a \"read the rest\" affordance."
								},
								"truncated": {
									"type": "boolean",
									"description": "True when the page body exceeded the server threshold and was cut."
								},
								"limitChars": {
									"type": "number",
									"description": "Server threshold that produced `truncated` (UTF-16 code units)."
								}
							},
							"required": [
								"pageId",
								"title",
								"kind",
								"contentHash",
								"body",
								"totalLines",
								"bodyStartLine",
								"bodyChars",
								"bodyBytes",
								"fullChars",
								"truncated",
								"limitChars"
							],
							"additionalProperties": true
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 199,
				"column": 9
			}
		},
		"memoryWiki/reviseDraft": {
			service: "memoryWiki",
			description: "Replace the server-owned draft with the user's page selection.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				description: "expected revision, query, selection, budget and hops.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#ReviseDraftInput",
					create: dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"expectedRevision": { "type": "number" },
							"query": { "type": "string" },
							"selectedPages": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"pageId": { "type": "string" },
										"contentHash": { "type": "string" }
									},
									"required": ["pageId", "contentHash"],
									"additionalProperties": true
								}
							},
							"budgetChars": {
								"type": "number",
								"enum": [4e3, 8e3]
							},
							"hops": {
								"type": "number",
								"enum": [0, 1]
							}
						},
						"required": [
							"sessionId",
							"expectedRevision",
							"query",
							"selectedPages",
							"budgetChars",
							"hops"
						],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#ReviseDraftInput",
					create: dsh_memory_wiki_memoryWiki_reviseDraft_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"expectedRevision": { "type": "number" },
							"query": { "type": "string" },
							"selectedPages": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"pageId": { "type": "string" },
										"contentHash": { "type": "string" }
									},
									"required": ["pageId", "contentHash"],
									"additionalProperties": false
								}
							},
							"budgetChars": {
								"type": "number",
								"enum": [4e3, 8e3]
							},
							"hops": {
								"type": "number",
								"enum": [0, 1]
							}
						},
						"required": [
							"sessionId",
							"expectedRevision",
							"query",
							"selectedPages",
							"budgetChars",
							"hops"
						],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#DraftResult",
				create: dsh_memory_wiki_memoryWiki_reviseDraft_result$schema,
				description: "the new draft, or the actionable reason it could not be compiled.",
				jsonSchema: {
					"type": "object",
					"properties": {
						"revision": { "type": "number" },
						"mode": {
							"type": "string",
							"enum": [
								"automatic",
								"manual-ready",
								"manual-invalid"
							]
						},
						"draft": {
							"type": "object",
							"properties": {
								"query": { "type": "string" },
								"libraryRevision": { "type": "string" },
								"selectedPages": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"pageId": { "type": "string" },
											"contentHash": { "type": "string" },
											"asOf": { "type": "string" }
										},
										"required": ["pageId", "contentHash"],
										"additionalProperties": true
									}
								},
								"budgetChars": {
									"type": "number",
									"enum": [4e3, 8e3]
								},
								"hops": {
									"type": "number",
									"enum": [0, 1]
								},
								"preview": {
									"type": "object",
									"properties": {
										"text": {
											"type": "string",
											"description": "The exact text the panel shows. `prepareOverride` freezes THIS string."
										},
										"chars": { "type": "number" },
										"payloadHash": {
											"type": "string",
											"description": "Hash of `text`; the prepared snapshot reuses it verbatim (design §5.2)."
										},
										"fits": { "type": "boolean" },
										"overBy": { "type": "number" },
										"sources": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"pageId": { "type": "string" },
													"title": { "type": "string" },
													"contentHash": { "type": "string" },
													"segments": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"startLine": { "type": "number" },
																"endLine": { "type": "number" }
															},
															"required": ["startLine", "endLine"],
															"additionalProperties": true
														}
													}
												},
												"required": [
													"pageId",
													"title",
													"contentHash",
													"segments"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"text",
										"chars",
										"payloadHash",
										"fits",
										"overBy",
										"sources"
									],
									"additionalProperties": true
								}
							},
							"required": [
								"query",
								"libraryRevision",
								"selectedPages",
								"budgetChars",
								"hops",
								"preview"
							],
							"additionalProperties": true
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": ["revision", "mode"],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 209,
				"column": 9
			}
		},
		"memoryWiki/search": {
			service: "memoryWiki",
			description: "Run page-level retrieval for one session without changing any state.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				description: "session, question and hop count.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#SearchInput",
					create: dsh_memory_wiki_memoryWiki_search_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"query": { "type": "string" },
							"hops": {
								"type": "number",
								"enum": [0, 1]
							}
						},
						"required": [
							"sessionId",
							"query",
							"hops"
						],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#SearchInput",
					create: dsh_memory_wiki_memoryWiki_search_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": { "type": "string" },
							"query": { "type": "string" },
							"hops": {
								"type": "number",
								"enum": [0, 1]
							}
						},
						"required": [
							"sessionId",
							"query",
							"hops"
						],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#SearchResult",
				create: dsh_memory_wiki_memoryWiki_search_result$schema,
				description: "candidates, edges and the library revision they were taken against.",
				jsonSchema: {
					"type": "object",
					"properties": {
						"revision": { "type": "number" },
						"libraryRevision": { "type": "string" },
						"query": { "type": "string" },
						"hops": {
							"type": "number",
							"enum": [0, 1]
						},
						"candidates": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"pageId": { "type": "string" },
									"title": { "type": "string" },
									"contentHash": { "type": "string" },
									"asOf": { "type": "string" },
									"match": {
										"type": "string",
										"enum": ["direct", "linked"]
									},
									"viaPageId": {
										"type": "string",
										"description": "For linked candidates: the direct hit that pulled this page in."
									},
									"selected": { "type": "boolean" },
									"excludedReason": {
										"type": "string",
										"enum": [
											"budget",
											"no-usable-block",
											"not-selected"
										]
									},
									"why": {
										"type": "array",
										"items": { "type": "string" },
										"description": "命中依据: the query terms that matched, most informative first."
									},
									"score": {
										"type": "number",
										"description": "BM25 score for direct hits; 0 for linked-only candidates."
									},
									"rank": {
										"type": "number",
										"description": "1-based ranking position among direct hits; 0 for linked candidates."
									},
									"segments": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"startLine": { "type": "number" },
												"endLine": { "type": "number" }
											},
											"required": ["startLine", "endLine"],
											"additionalProperties": true
										},
										"description": "Block line ranges the compiler actually used (filled in by the compiler)."
									}
								},
								"required": [
									"pageId",
									"title",
									"contentHash",
									"match",
									"selected",
									"why",
									"score",
									"rank"
								],
								"additionalProperties": true
							}
						},
						"edges": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"from": { "type": "string" },
									"to": { "type": "string" },
									"source": {
										"type": "string",
										"enum": ["body", "related"]
									}
								},
								"required": [
									"from",
									"to",
									"source"
								],
								"additionalProperties": true
							}
						},
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [
						"revision",
						"libraryRevision",
						"query",
						"hops",
						"candidates",
						"edges"
					],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 189,
				"column": 9
			}
		},
		"memoryWiki/view": {
			service: "memoryWiki",
			description: "Read the current panel view for one authorized session.",
			implementation: "getView",
			invocation: { kind: "direct" },
			parameters: [{
				name: "input",
				description: "session reference and the revision the client already shows.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#GetViewInput",
					create: dsh_memory_wiki_memoryWiki_view_parameter_0$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": {
								"type": "string",
								"description": "Client-visible session reference; the server re-resolves it (never trusted)."
							},
							"expectedRevision": {
								"type": "number",
								"description": "Revision the client already shows. Omit to read the current state."
							}
						},
						"required": ["sessionId"],
						"additionalProperties": true
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "dsh-memory-wiki/contracts#GetViewInput",
					create: dsh_memory_wiki_memoryWiki_view_parameter_0_strict$schema,
					jsonSchema: {
						"type": "object",
						"properties": {
							"sessionId": {
								"type": "string",
								"description": "Client-visible session reference; the server re-resolves it (never trusted)."
							},
							"expectedRevision": {
								"type": "number",
								"description": "Revision the client already shows. Omit to read the current state."
							}
						},
						"required": ["sessionId"],
						"additionalProperties": false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-memory-wiki/contracts#SessionView",
				create: dsh_memory_wiki_memoryWiki_view_result$schema,
				description: "mode, draft, prepared snapshot and the current turn record.",
				jsonSchema: {
					"type": "object",
					"properties": {
						"revision": { "type": "number" },
						"mode": {
							"type": "string",
							"enum": [
								"automatic",
								"manual-ready",
								"manual-invalid"
							]
						},
						"budgetChars": {
							"type": "number",
							"enum": [4e3, 8e3]
						},
						"hops": {
							"type": "number",
							"enum": [0, 1]
						},
						"draft": {
							"type": "object",
							"properties": {
								"query": { "type": "string" },
								"libraryRevision": { "type": "string" },
								"selectedPages": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"pageId": { "type": "string" },
											"contentHash": { "type": "string" },
											"asOf": { "type": "string" }
										},
										"required": ["pageId", "contentHash"],
										"additionalProperties": true
									}
								},
								"budgetChars": {
									"type": "number",
									"enum": [4e3, 8e3]
								},
								"hops": {
									"type": "number",
									"enum": [0, 1]
								},
								"preview": {
									"type": "object",
									"properties": {
										"text": {
											"type": "string",
											"description": "The exact text the panel shows. `prepareOverride` freezes THIS string."
										},
										"chars": { "type": "number" },
										"payloadHash": {
											"type": "string",
											"description": "Hash of `text`; the prepared snapshot reuses it verbatim (design §5.2)."
										},
										"fits": { "type": "boolean" },
										"overBy": { "type": "number" },
										"sources": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"pageId": { "type": "string" },
													"title": { "type": "string" },
													"contentHash": { "type": "string" },
													"segments": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"startLine": { "type": "number" },
																"endLine": { "type": "number" }
															},
															"required": ["startLine", "endLine"],
															"additionalProperties": true
														}
													}
												},
												"required": [
													"pageId",
													"title",
													"contentHash",
													"segments"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"text",
										"chars",
										"payloadHash",
										"fits",
										"overBy",
										"sources"
									],
									"additionalProperties": true
								}
							},
							"required": [
								"query",
								"libraryRevision",
								"selectedPages",
								"budgetChars",
								"hops",
								"preview"
							],
							"additionalProperties": true
						},
						"prepared": {
							"type": "object",
							"properties": {
								"snapshotId": { "type": "string" },
								"libraryRevision": { "type": "string" },
								"origin": {
									"type": "string",
									"enum": ["automatic", "manual"]
								},
								"budgetChars": {
									"type": "number",
									"description": "Production values are 4000 | 8000; tests may pass smaller numbers."
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"title": { "type": "string" },
											"segments": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"startLine": { "type": "number" },
														"endLine": { "type": "number" }
													},
													"required": ["startLine", "endLine"],
													"additionalProperties": true
												}
											},
											"pageId": { "type": "string" },
											"contentHash": { "type": "string" },
											"asOf": { "type": "string" }
										},
										"required": [
											"title",
											"segments",
											"pageId",
											"contentHash"
										],
										"additionalProperties": true
									}
								},
								"text": { "type": "string" },
								"payloadHash": { "type": "string" },
								"chars": { "type": "number" },
								"report": {
									"type": "object",
									"properties": {
										"libraryRevision": { "type": "string" },
										"query": { "type": "string" },
										"hops": {
											"type": "number",
											"enum": [0, 1]
										},
										"candidates": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"pageId": { "type": "string" },
													"title": { "type": "string" },
													"contentHash": { "type": "string" },
													"asOf": { "type": "string" },
													"match": {
														"type": "string",
														"enum": ["direct", "linked"]
													},
													"viaPageId": {
														"type": "string",
														"description": "For linked candidates: the direct hit that pulled this page in."
													},
													"selected": { "type": "boolean" },
													"excludedReason": {
														"type": "string",
														"enum": [
															"budget",
															"no-usable-block",
															"not-selected"
														]
													},
													"why": {
														"type": "array",
														"items": { "type": "string" },
														"description": "命中依据: the query terms that matched, most informative first."
													},
													"score": {
														"type": "number",
														"description": "BM25 score for direct hits; 0 for linked-only candidates."
													},
													"rank": {
														"type": "number",
														"description": "1-based ranking position among direct hits; 0 for linked candidates."
													},
													"segments": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"startLine": { "type": "number" },
																"endLine": { "type": "number" }
															},
															"required": ["startLine", "endLine"],
															"additionalProperties": true
														},
														"description": "Block line ranges the compiler actually used (filled in by the compiler)."
													}
												},
												"required": [
													"pageId",
													"title",
													"contentHash",
													"match",
													"selected",
													"why",
													"score",
													"rank"
												],
												"additionalProperties": true
											}
										},
										"edges": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"from": { "type": "string" },
													"to": { "type": "string" },
													"source": {
														"type": "string",
														"enum": ["body", "related"]
													}
												},
												"required": [
													"from",
													"to",
													"source"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"libraryRevision",
										"query",
										"hops",
										"candidates",
										"edges"
									],
									"additionalProperties": true
								}
							},
							"required": [
								"snapshotId",
								"libraryRevision",
								"origin",
								"budgetChars",
								"sources",
								"text",
								"payloadHash",
								"chars"
							],
							"additionalProperties": true
						},
						"currentTurn": {
							"type": "object",
							"properties": {
								"turn": { "type": "number" },
								"phase": { "type": "string" },
								"snapshotId": { "type": "string" },
								"payloadHash": { "type": "string" },
								"committedSeq": { "type": "number" },
								"reInjections": { "type": "number" }
							},
							"required": [
								"turn",
								"phase",
								"reInjections"
							],
							"additionalProperties": true
						},
						"capture": {
							"type": "object",
							"properties": {
								"jobId": { "type": "string" },
								"phase": {
									"type": "string",
									"enum": [
										"queued",
										"judging",
										"preparing",
										"verifying",
										"publishing",
										"ingested",
										"skipped",
										"deferred",
										"failed",
										"needs_attention"
									]
								},
								"reason": { "type": "string" },
								"pages": {
									"type": "array",
									"items": { "type": "string" }
								},
								"updatedAt": { "type": "string" },
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"seq": { "type": "number" },
											"kind": { "type": "string" },
											"text": { "type": "string" },
											"truncated": { "type": "boolean" }
										},
										"required": [
											"seq",
											"kind",
											"text",
											"truncated"
										],
										"additionalProperties": true
									}
								},
								"evidenceTruncated": {
									"type": "boolean",
									"enum": [false, true]
								},
								"changes": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"path": { "type": "string" },
											"beforeHash": { "type": "string" },
											"afterHash": { "type": "string" }
										},
										"required": ["path", "afterHash"],
										"additionalProperties": true
									}
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								}
							},
							"required": [
								"jobId",
								"phase",
								"reason",
								"pages",
								"updatedAt"
							],
							"additionalProperties": true
						},
						"skippedReason": { "type": "string" },
						"error": { "oneOf": [
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-session"
									},
									"sessionId": { "type": "string" }
								},
								"required": ["code", "sessionId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "stale-revision"
									},
									"expected": { "type": "number" },
									"actual": { "type": "number" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "nothing-selected"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "unknown-page"
									},
									"pageId": { "type": "string" }
								},
								"required": ["code", "pageId"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "library-changed"
									},
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "page-version-mismatch"
									},
									"pageId": { "type": "string" },
									"expected": { "type": "string" },
									"actual": { "type": "string" }
								},
								"required": [
									"code",
									"pageId",
									"expected",
									"actual"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "manual-over-budget"
									},
									"overBy": { "type": "number" },
									"budgetChars": { "type": "number" },
									"selectedChars": { "type": "number" }
								},
								"required": [
									"code",
									"overBy",
									"budgetChars",
									"selectedChars"
								],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "no-usable-block"
									},
									"pageIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["code", "pageIds"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "wiki-unavailable"
									},
									"reason": {
										"type": "string",
										"enum": ["not-configured", "read-failed"]
									}
								},
								"required": ["code", "reason"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": { "code": {
									"type": "string",
									"const": "capture-record-unavailable"
								} },
								"required": ["code"],
								"additionalProperties": true
							},
							{
								"type": "object",
								"properties": {
									"code": {
										"type": "string",
										"const": "capture-invalid-query"
									},
									"field": {
										"type": "string",
										"enum": [
											"limit",
											"cursor",
											"status",
											"event-seq"
										]
									}
								},
								"required": ["code", "field"],
								"additionalProperties": true
							}
						] }
					},
					"required": [
						"revision",
						"mode",
						"budgetChars",
						"hops"
					],
					"additionalProperties": true
				}
			},
			sourceLocation: {
				"file": "packages/dsh-memory-wiki/src/server/index.ts",
				"line": 154,
				"column": 9
			}
		}
	}
}, zod.z);
//#endregion
//#region src/client/remote-smoke.ts
/**
* The host's generated Typert contribution, mounted onto `remote`.
*
* Only two things live here now (P4 hardening, D6/D9/D13):
*   - `mountRemoteSmoke` — the REAL production mount of the generated client;
*   - `createLazyRemoteClient` — the seam's transport facade.
*
* The P3b probe (a page-global instrumentation object, one-shot view calls with
* a revision, strict-codec experiments) is gone: it recorded the user's session
* key into a page global, and none of it is product state.
*/
/**
* Mount the generated contribution and return a disposer bound to the fiber.
*
* A mount that resolves after the plugin has already unmounted is disposed
* immediately, otherwise the namespace would leak with no owner.
*/
function mountRemoteSmoke(remote) {
	let closed = false;
	let dispose;
	(async () => {
		try {
			const disposer = await remote.$mount(TYPERT_REMOTE);
			if (closed) {
				try {
					await disposer();
				} catch {}
				return;
			}
			dispose = disposer;
		} catch (cause) {
			console.error("dsh-memory-wiki: remote $mount failed", cause);
		}
	})();
	return () => {
		closed = true;
		if (dispose !== void 0) (async () => {
			try {
				await dispose?.();
			} catch (cause) {
				console.error("dsh-memory-wiki: remote dispose failed", cause);
			}
		})();
	};
}
function isNamespace(value) {
	return typeof value === "object" && value !== null;
}
/**
* Resolve the mounted namespace without the inject requirement.
*
* A plain `ctx.remote.memoryWiki` read throws "cannot get property
* remote.memoryWiki without inject" — Cordis resolves service properties
* through the dependency graph, and this facade deliberately does not declare
* `remote.memoryWiki` (the seam is the single transport entry). `ctx.get(name,
* false)` reads the store directly, exactly like the uiSession resolution.
*/
function readNamespace(ctx) {
	const c = ctx;
	for (const name of ["remote.memoryWiki", "memoryWiki"]) {
		try {
			const value = c.get?.(name, false);
			if (isNamespace(value)) return value;
		} catch {}
		try {
			const value = c.reflect?.get?.(name, false);
			if (isNamespace(value)) return value;
		} catch {}
	}
}
/**
* Lazy RemoteClient facade over the mounted namespace (for the seam).
*
* Read lazily on every call so a namespace that is mounted after the panel
* registers (or remounted after a reconnect) is picked up without restarting
* the plugin. The transport envelope is returned untouched; `unwrap()` in
* `source/remote-source.ts` is the only place that interprets it.
*/
function createLazyRemoteClient(ctx) {
	const call = (method) => async (input) => {
		const fn = readNamespace(ctx)?.[method];
		if (typeof fn !== "function") throw new Error("remote namespace has no " + method + " yet");
		return fn(input);
	};
	return {
		captureStatus: call("captureStatus"),
		captureHistory: call("captureHistory"),
		captureRecord: call("captureRecord"),
		captureJudgment: call("captureJudgment"),
		graph: call("graph"),
		getView: call("view"),
		search: call("search"),
		readPage: call("readPage"),
		reviseDraft: call("reviseDraft"),
		prepareOverride: call("prepareOverride"),
		clearOverride: call("clearOverride")
	};
}
//#endregion
//#region src/client/index.tsx
/**
* dsh-memory-wiki — client half entry.
*
* Loaded by the host module system as a classic script:
*   window.__ModuleLoader__.load({ id: 'dsh-memory-wiki', factory })
* and the factory's `require` resolves against the host PLATFORM_MODULES table,
* so `react` is the host instance, never a second copy.
*
* Mounted surfaces: `main` (the panel) and `sidebar.panellist` (its entry).
* Styles are one <style> element, scoped to .memory-wiki-panel, removed on
* dispose.
*
* P4 hardening (D6/D9/D13): the P0b/P3b probe is gone. No page global, no
* session key, no view-call log, no style audit — the only thing this entry
* publishes is the panel itself.
*/
const name = "memory-wiki";
/** Client-side Cordis services this surface needs. `uiSession` is resolved
* optionally: declaring it in `inject` would hang the fiber on any host that
* does not provide it, and the panel would never mount. */
const inject = ["slots"];
const PANEL_ID = "memory-wiki";
const STYLE_ID = "dsh-memory-wiki-styles";
/**
* Optional service read.
*
* A Cordis *service* read through the context proxy requires the dependency to
* be declared in `inject`; an unreduced read throws or waits, which would abort
* apply() before the panel ever registered. `ctx.get(name, strict)` reads the
* store without the inject requirement, and `strict: false` also accepts an
* implementation whose providing fiber is not active yet. All three paths are
* tried in turn.
*/
function resolveService(ctx, name) {
	const attempts = [
		() => ctx.get?.(name, true),
		() => ctx.get?.(name, false),
		() => ctx.reflect?.get?.(name, false),
		() => ctx[name]
	];
	for (const read of attempts) try {
		const value = read();
		if (value !== void 0 && value !== null) return value;
	} catch {}
}
function styles() {
	return "/* Scoped to the plugin. DSH owns the surrounding application navigation. */\n.memory-wiki-panel {\n  --mw-bg: #171f27;\n  --mw-panel: #212d39;\n  --mw-panel-2: #1c2733;\n  --mw-line: #344350;\n  --mw-text: #e8edf4;\n  --mw-muted: #a8b7c8;\n  --mw-blue: #8bc7f4;\n  --mw-edge: #6988a5;\n  --mw-gold: #efc366;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  min-width: 0;\n  background: var(--mw-bg);\n  color: var(--mw-text);\n  font: 13px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;\n  text-align: left;\n  color-scheme: dark;\n}\n.memory-wiki-panel *, .memory-wiki-panel *::before, .memory-wiki-panel *::after { box-sizing: border-box; }\n.memory-wiki-panel [hidden] { display: none !important; }\n.memory-wiki-panel ::selection { background: #355875; color: var(--mw-text); }\n.memory-wiki-panel button, .memory-wiki-panel input { font: inherit; color: inherit; }\n.memory-wiki-panel button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 7px 12px; border: 1px solid var(--mw-line); border-radius: 7px; background: transparent; cursor: pointer; }\n.memory-wiki-panel button:hover:not(:disabled) { background: #2a3948; }\n.memory-wiki-panel button:disabled { opacity: 0.48; cursor: default; }\n.memory-wiki-panel :focus-visible { outline: 2px solid var(--mw-blue); outline-offset: 3px; }\n.memory-wiki-panel input { min-width: 0; border: 1px solid var(--mw-line); border-radius: 6px; padding: 8px 10px; background: var(--mw-bg); caret-color: var(--mw-blue); }\n.memory-wiki-panel input::placeholder { color: var(--mw-muted); opacity: 1; }\n.memory-wiki-panel svg { flex: 0 0 auto; }\n.memory-wiki-panel__head { display: flex; align-items: center; gap: 24px; min-height: 72px; padding: 14px 24px; border-bottom: 1px solid var(--mw-line); z-index: 5; }\n.memory-wiki-panel__brand { display: flex; align-items: center; gap: 10px; white-space: nowrap; }\n.memory-wiki-panel__brand > svg { color: var(--mw-blue); }\n.memory-wiki-panel__brand h2 { margin: 0; font-size: 17px; font-weight: 600; }\n.memory-wiki-panel__brand > span { margin-left: 6px; padding-left: 16px; border-left: 1px solid var(--mw-line); font-size: 12px; color: var(--mw-muted); }\n.memory-wiki-panel__searchbox { position: relative; display: flex; align-items: center; gap: 10px; width: min(420px, 42%); padding: 7px 12px; border: 1px solid var(--mw-line); border-radius: 8px; background: var(--mw-panel-2); color: var(--mw-muted); }\n.memory-wiki-panel__searchbox > input { flex: 1; width: 100%; padding: 0; border: 0; border-radius: 0; background: transparent; color: var(--mw-text); height: 24px; }\n.memory-wiki-panel__searchbox > input:focus { outline: none; }\n.memory-wiki-panel__searchbox:focus-within { outline: 1px solid var(--mw-blue); }\n.memory-wiki-panel__searchbox > button { border: 0; padding: 2px; }\n.memory-wiki-panel__searchbox kbd { font: 11px inherit; white-space: nowrap; }\n.memory-wiki-panel__search-results { position: absolute; top: calc(100% + 10px); left: 0; width: max(100%, 340px); max-height: 400px; overflow: auto; background: var(--mw-panel); border-radius: 10px; box-shadow: 0 12px 40px #07101980; padding: 6px; z-index: 10; color: var(--mw-text); }\n.memory-wiki-panel__search-results > p { margin: 8px 10px; color: var(--mw-muted); font-size: 12px; }\n.memory-wiki-panel__search-results > button { border: 0; display: flex; width: 100%; justify-content: space-between; text-align: left; padding: 10px; }\n.memory-wiki-panel__search-results small { display: block; font-size: 11px; color: var(--mw-muted); overflow-wrap: anywhere; }\n.memory-wiki-panel__head-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; white-space: nowrap; }\n.memory-wiki-panel button.memory-wiki-panel__icon { border: 0; padding: 8px; }\n.memory-wiki-panel__head-actions button[aria-expanded=true] { background: #2b4053; color: var(--mw-blue); }\n.memory-wiki-panel__workspace { position: relative; flex: 1; min-height: 0; overflow: hidden; }\n.memory-wiki-panel__graph { position: absolute; inset: 0; }\n.memory-wiki-panel__sigma, .memory-wiki-panel__sigma-instance { position: absolute; inset: 0; }\n.memory-wiki-panel__sigma canvas { display: block; }\n.memory-wiki-panel__graph-fallback { position: absolute; inset: 0 0 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; background: var(--mw-bg); }\n.memory-wiki-panel__graph-fallback h3 { margin: 0 0 10px; font-size: 17px; font-weight: 500; }\n.memory-wiki-panel__graph-fallback p { max-width: 400px; margin: 0; color: var(--mw-muted); }\n.memory-wiki-panel__page-index { position: absolute; top: 18px; right: 22px; z-index: 2; max-width: min(360px, 50%); color: var(--mw-muted); }\n.memory-wiki-panel__page-index summary { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 5px 0; font-size: 11px; }\n.memory-wiki-panel__page-index summary span { color: var(--mw-text); font-variant-numeric: tabular-nums; }\n.memory-wiki-panel__page-index > div { max-height: 320px; overflow: auto; padding: 6px; border: 1px solid var(--mw-line); border-radius: 9px; background: var(--mw-panel); box-shadow: 0 10px 28px #070e175c; scrollbar-width: thin; }\n.memory-wiki-panel__page-index button { display: block; width: 100%; padding: 7px 9px; border: 0; text-align: left; font-size: 12px; }\n.memory-wiki-panel__page-index button.is-active { color: var(--mw-blue); }\n.memory-wiki-panel__zoom { min-width: 38px; margin: 0 !important; text-align: center; font-size: 11px !important; }\n.memory-wiki-panel__canvas-tools { position: absolute; left: 24px; bottom: 24px; display: flex; align-items: center; gap: 4px; padding: 4px 6px 4px 14px; border: 1px solid var(--mw-line); border-radius: 9px; background: var(--mw-panel-2); z-index: 2; }\n.memory-wiki-panel__canvas-tools > span { margin-right: 12px; font-size: 12px; color: var(--mw-muted); font-variant-numeric: tabular-nums; }\n.memory-wiki-panel__canvas-tools > button { border: 0; padding: 6px; }\n.memory-wiki-panel__graph-legend { position: absolute; left: 26px; bottom: 76px; display: flex; align-items: center; flex-wrap: wrap; gap: 14px; color: var(--mw-muted); font-size: 11px; pointer-events: none; }\n.memory-wiki-panel__graph-legend > span { display: inline-flex; align-items: center; gap: 6px; }\n.memory-wiki-panel__graph-legend i { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #829ab2; }\n.memory-wiki-panel__graph-legend i.is-hub { width: 9px; height: 9px; background: #c7e4fa; }\n.memory-wiki-panel__canvas-status { position: absolute; right: 24px; bottom: 32px; color: var(--mw-muted); font-size: 12px; pointer-events: none; }\n.memory-wiki-panel__empty { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 32px; text-align: center; background: var(--mw-bg); }\n.memory-wiki-panel__empty > svg { color: var(--mw-muted); width: 30px; height: 30px; }\n.memory-wiki-panel__empty h3 { margin: 4px 0 0; font-size: 17px; font-weight: 500; }\n.memory-wiki-panel__empty p { margin: 0; max-width: 440px; color: var(--mw-muted); }\n.memory-wiki-panel__updating { position: absolute; left: 24px; top: 16px; color: var(--mw-muted); font-size: 12px; }\n.memory-wiki-panel__drawer { position: absolute; right: 20px; top: 20px; bottom: 84px; display: flex; flex-direction: column; width: 400px; max-width: 42%; border-radius: 12px; background: var(--mw-panel); box-shadow: 0 10px 36px #070e175c; z-index: 3; overflow: hidden; animation: mw-drawer-in 180ms ease-out; }\n.memory-wiki-panel__drawer-head { display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0; gap: 16px; padding: 26px 26px 12px; }\n.memory-wiki-panel__drawer-head h3 { margin: 0; font-size: 23px; line-height: 1.4; font-weight: 600; overflow-wrap: anywhere; }\n.memory-wiki-panel__drawer-head p { margin: 6px 0 0; color: var(--mw-muted); font-size: 12px; }\n.memory-wiki-panel__drawer-head > button { margin: -4px -8px 0 0; color: var(--mw-muted); }\n.memory-wiki-panel__reader { overflow: auto; flex: 1; min-height: 0; padding: 0 26px 24px; scrollbar-width: thin; scrollbar-color: #536a80 transparent; }\n.memory-wiki-panel__page-meta { margin: 0 0 24px; color: var(--mw-muted); font-size: 12px; }\n.memory-wiki-panel__reader-footer { flex-shrink: 0; margin: 0 26px; padding: 18px 0; border-top: 1px solid var(--mw-line); }\n.memory-wiki-panel__reader-footer > button { width: 100%; background: #304253; }\n.memory-wiki-panel__reader-footer > p { margin: 8px 0 0; font-size: 11px; color: var(--mw-muted); }\n.memory-wiki-panel__relations { padding-top: 18px; margin-top: 24px; border-top: 1px solid var(--mw-line); }\n.memory-wiki-panel__relations h4 { margin: 0 0 10px; font-size: 13px; font-weight: 500; }\n.memory-wiki-panel__relations > p { font-size: 12px; color: var(--mw-muted); }\n.memory-wiki-panel__relations > button { display: flex; justify-content: space-between; width: 100%; padding: 10px 0; text-align: left; border: 0; border-radius: 0; color: var(--mw-blue); }\n.memory-wiki-panel__relations > button:hover:not(:disabled) { background: transparent; text-decoration: underline; text-underline-offset: 4px; }\n.memory-wiki-panel__page-info { margin-top: 24px; font-size: 11px; color: var(--mw-muted); overflow-wrap: anywhere; }\n.memory-wiki-panel summary { cursor: pointer; padding: 5px 0; }\n.memory-wiki-panel__drawer--context { width: 480px; max-width: 48%; bottom: 20px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #536a80 transparent; }\n.memory-wiki-panel__context-note { padding: 16px 26px; color: var(--mw-muted); }\n.memory-wiki-panel__context-note h4 { color: var(--mw-text); font-weight: 500; }\n.memory-wiki-panel__context-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; padding: 0 26px 12px; color: var(--mw-muted); font-size: 11px; overflow-wrap: anywhere; }\n.memory-wiki-panel__body { display: flex; flex-direction: column; min-width: 0; padding: 0 26px 24px; }\n.memory-wiki-panel__col { min-width: 0; }\n.memory-wiki-panel__section-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; padding: 18px 0 9px; font-weight: 500; }\n.memory-wiki-panel__section-head > span:last-child:not(:first-child) { margin-left: auto; font-size: 11px; font-weight: 400; color: var(--mw-muted); }\n.memory-wiki-panel__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }\n.memory-wiki-panel__query { flex: 1; width: 100px; }\n.memory-wiki-panel__candidate { padding: 12px 0; border-bottom: 1px solid var(--mw-line); }\n.memory-wiki-panel__candidate.is-active { background: #263747; }\n.memory-wiki-panel .memory-wiki-panel__pick-open { flex: 1; min-width: 80px; border: 0; padding: 3px; justify-content: flex-start; text-align: left; }\n.memory-wiki-panel .memory-wiki-panel__pick-toggle { padding: 3px 8px; font-size: 11px; }\n.memory-wiki-panel__pick-toggle[aria-pressed=true] { color: var(--mw-blue); border-color: var(--mw-blue); }\n.memory-wiki-panel__candidate-id, .memory-wiki-panel__via { display: block; margin-top: 5px; font-size: 11px; color: var(--mw-muted); overflow-wrap: anywhere; }\n.memory-wiki-panel__chips, .memory-wiki-panel__detail-meta { display: flex; flex-wrap: wrap; gap: 5px; margin: 8px 0; }\n.memory-wiki-panel__chip, .memory-wiki-panel__segment, .memory-wiki-panel__readonly { display: inline-block; padding: 1px 6px; background: #2c3c4c; border-radius: 4px; font-size: 11px; color: var(--mw-muted); overflow-wrap: anywhere; }\n.memory-wiki-panel__chip--why { color: var(--mw-blue); }\n.memory-wiki-panel__readonly { margin-left: 8px; }\n.memory-wiki-panel__over, .memory-wiki-panel__stale { color: var(--mw-gold); font-size: 12px; overflow-wrap: anywhere; }\n.memory-wiki-panel__stale { padding: 14px 0; }\n.memory-wiki-panel__stale p { margin: 8px 0; }\n.memory-wiki-panel__server { padding-bottom: 14px; border-bottom: 1px solid var(--mw-line); }\n.memory-wiki-panel__excerpt-note { margin: 10px 0; font-size: 12px; line-height: 1.7; color: var(--mw-muted); overflow-wrap: anywhere; }\n.memory-wiki-panel__pre { margin: 10px 0; padding: 12px; max-height: 260px; overflow: auto; border-radius: 6px; background: var(--mw-bg); color: var(--mw-text); font: 11px/1.7 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }\n.memory-wiki-panel__hist { padding-top: 4px; }\n.memory-wiki-panel__subhead { margin: 22px 0 8px; font-size: 13px; font-weight: 500; }\n.memory-wiki-panel__hist-row { padding: 10px 0; border-bottom: 1px solid var(--mw-line); font-size: 12px; overflow-wrap: anywhere; }\n.memory-wiki-panel__hist-facts { display: flex; flex-wrap: wrap; gap: 8px; color: var(--mw-muted); font-size: 11px; margin-top: 5px; }\n.memory-wiki-panel__hist-row > button { margin-top: 6px; padding: 3px 8px; font-size: 11px; }\n.memory-wiki-panel__evidence-detail { margin-top: 16px; font-size: 12px; }\n.memory-wiki-panel__detail-title { margin: 12px 0 0; font-size: 16px; }\n.memory-wiki-panel__detail-path { overflow-wrap: anywhere; font-size: 11px; color: var(--mw-muted); }\n.memory-wiki-panel__segments { display: flex; gap: 5px; flex-wrap: wrap; }\n.memory-wiki-panel__excerpt { font-size: 12px; }\n.memory-wiki-panel__md { font-size: 14px; line-height: 1.85; color: var(--mw-text); overflow-wrap: anywhere; }\n.memory-wiki-panel__md > :first-child { margin-top: 0; }\n.memory-wiki-panel__md h1, .memory-wiki-panel__md h2, .memory-wiki-panel__md h3, .memory-wiki-panel__md h4 { margin: 24px 0 10px; font-size: 16px; font-weight: 600; line-height: 1.5; }\n.memory-wiki-panel__md p { margin: 12px 0; }\n.memory-wiki-panel__md ul, .memory-wiki-panel__md ol { margin: 12px 0; padding-left: 22px; }\n.memory-wiki-panel__md li { margin: 5px 0; }\n.memory-wiki-panel__md a, .memory-wiki-panel__wikilink { color: var(--mw-blue); text-decoration: underline; text-underline-offset: 3px; }\n.memory-wiki-panel__md code { padding: 2px 4px; border-radius: 3px; background: var(--mw-bg); font: 12px/1.7 ui-monospace, SFMono-Regular, Menlo, monospace; }\n.memory-wiki-panel__md pre { margin: 14px 0; padding: 12px; background: var(--mw-bg); border-radius: 6px; overflow: auto; }\n.memory-wiki-panel__md pre code { padding: 0; white-space: pre; }\n.memory-wiki-panel__md table { display: block; max-width: 100%; overflow: auto; border-collapse: collapse; font-size: 12px; margin: 14px 0; }\n.memory-wiki-panel__md th, .memory-wiki-panel__md td { padding: 7px 10px; text-align: left; border-bottom: 1px solid var(--mw-line); }\n.memory-wiki-panel__md blockquote { margin: 16px 0; padding-left: 14px; border-left: 1px solid var(--mw-muted); color: var(--mw-muted); }\n.memory-wiki-panel__md hr { border: 0; border-top: 1px solid var(--mw-line); margin: 24px 0; }\n.memory-wiki-panel__md-fallback { white-space: pre-wrap; }\n@keyframes mw-drawer-in { from { transform: translateX(14px); } to { transform: translateX(0); } }\n@media (max-width: 1000px) {\n  .memory-wiki-panel__head { gap: 16px; padding: 12px 16px; min-height: 64px; }\n  .memory-wiki-panel__brand > span { display: none; }\n  .memory-wiki-panel__searchbox { flex: 1; width: auto; }\n  .memory-wiki-panel__drawer { max-width: 48%; right: 12px; }\n  .memory-wiki-panel__drawer--context { max-width: 55%; }\n  .memory-wiki-panel__drawer-head { padding: 22px 22px 12px; }\n  .memory-wiki-panel__reader { padding: 0 22px 20px; }\n}\n@media (max-width: 700px) {\n  .memory-wiki-panel__head { flex-wrap: wrap; gap: 10px; padding: 12px; }\n  .memory-wiki-panel__brand h2 { font-size: 15px; }\n  .memory-wiki-panel__searchbox { order: 3; width: 100%; flex-basis: 100%; }\n  .memory-wiki-panel__searchbox input { font-size: 16px; }\n  .memory-wiki-panel__search-results { width: 100%; max-width: 100%; }\n  .memory-wiki-panel__head-actions { gap: 4px; }\n  .memory-wiki-panel__drawer, .memory-wiki-panel__drawer--context { inset: 8px; width: auto; max-width: none; border-radius: 10px; }\n  .memory-wiki-panel__drawer-head h3 { font-size: 21px; }\n  .memory-wiki-panel__canvas-tools { left: 12px; bottom: 44px; padding-left: 10px; }\n  .memory-wiki-panel__canvas-tools > span { margin-right: 4px; }\n  .memory-wiki-panel__graph-legend { left: 14px; bottom: 94px; }\n  .memory-wiki-panel__canvas-status { right: 14px; bottom: 14px; font-size: 11px; }\n}\n@media (max-width: 700px) {\n  .memory-wiki-panel__page-index { top: 12px; right: 12px; }\n  .memory-wiki-panel__graph-legend { max-width: calc(100% - 28px); gap: 8px 12px; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .memory-wiki-panel__drawer { animation: none; }\n}\n\n/* History is a separate surface; the graph retains its dimensions and camera. */\n.memory-wiki-panel__surfaces { position: relative; flex: 1; min-height: 0; }\n.memory-wiki-panel__surfaces > .memory-wiki-panel__workspace { position: absolute; inset: 0; }\n.memory-wiki-panel__history { position: absolute; inset: 0; overflow-y: auto; padding: 24px 32px; background: var(--mw-bg); scrollbar-width: thin; }\n.memory-wiki-panel__history-head, .memory-wiki-panel__history-toolbar, .memory-wiki-panel__history-detail-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; }\n.memory-wiki-panel__history-head h2 { margin: 0; font-size: 22px; }\n.memory-wiki-panel__history-head p, .memory-wiki-panel__history-availability p { margin: 4px 0; color: var(--mw-muted); }\n.memory-wiki-panel__history-head button, .memory-wiki-panel__history-toolbar button, .memory-wiki-panel__history-detail-head button { flex-shrink: 0; }\n.memory-wiki-panel__history-availability { margin: 20px 0; padding: 16px 0; border-block: 1px solid var(--mw-line); }\n.memory-wiki-panel__history-toolbar { margin-bottom: 20px; flex-wrap: wrap; }\n.memory-wiki-panel__history-toolbar select { margin-left: 8px; padding: 7px 12px; border: 1px solid var(--mw-line); border-radius: 6px; background: var(--mw-panel); color: var(--mw-text); font: inherit; }\n.memory-wiki-panel__history-toolbar > span { flex: 1; overflow-wrap: anywhere; color: var(--mw-muted); }\n.memory-wiki-panel__history-layout { display: grid; grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.5fr); gap: 32px; }\n.memory-wiki-panel__history-list > button { display: flex; align-items: flex-start; flex-direction: column; gap: 6px; width: 100%; padding: 16px; margin-bottom: 8px; text-align: left; white-space: normal; height: auto; overflow-wrap: anywhere; border-radius: 8px; background: transparent; }\n.memory-wiki-panel__history-list > button[aria-pressed=\"true\"] { background: var(--mw-panel); }\n.memory-wiki-panel__history-list time, .memory-wiki-panel__history-list small, .memory-wiki-panel__timeline time { color: var(--mw-muted); font-size: 11px; }\n.memory-wiki-panel__history-list strong { font-size: 14px; font-weight: 500; }\n.memory-wiki-panel__history-placeholder { padding-top: 24px; color: var(--mw-muted); }\n.memory-wiki-panel__history-detail { min-width: 0; padding-bottom: 32px; overflow-wrap: anywhere; }\n.memory-wiki-panel__history-detail h3 { margin: 24px 0 8px; font-size: 20px; }\n.memory-wiki-panel__history-detail h4 { margin: 28px 0 12px; font-size: 15px; }\n.memory-wiki-panel__history-detail h5 { font-size: 13px; margin: 12px 0 4px; }\n.memory-wiki-panel__history-note { padding: 12px 16px; background: var(--mw-panel-2); border-radius: 8px; }\n.memory-wiki-panel__history-detail pre { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; background: var(--mw-panel-2); padding: 12px; border-radius: 6px; }\n.memory-wiki-panel__timeline { list-style: none; padding: 0; }\n.memory-wiki-panel__timeline > li { padding: 14px 0; border-bottom: 1px solid var(--mw-line); }\n.memory-wiki-panel__timeline time, .memory-wiki-panel__timeline > li > strong { display: block; }\n.memory-wiki-panel__timeline p { margin: 6px 0; }\n.memory-wiki-panel__judgment { margin-top: 12px; }\n.memory-wiki-panel__judgment > summary { color: var(--mw-blue); }\n.memory-wiki-panel__judgment > div { padding: 12px 0; }\n.memory-wiki-panel__question { padding: 12px 0; border-bottom: 1px solid var(--mw-line); }\n.memory-wiki-panel__history-hash { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }\n.memory-wiki-panel__history-hash details { width: 100%; }\n.memory-wiki-panel__history-pages button { display: block; margin: 8px 0; max-width: 100%; height: auto; white-space: normal; overflow-wrap: anywhere; }\n.memory-wiki-panel__history .is-pass, .memory-wiki-panel__history .is-ingested { color: #a8d5b6; }\n.memory-wiki-panel__history .is-deferred, .memory-wiki-panel__history .is-needs_attention { color: var(--mw-gold); }\n.memory-wiki-panel__history [role=\"alert\"], .memory-wiki-panel__history .is-failed { color: #f3b9ae; }\n@media (max-width: 699px) {\n  .memory-wiki-panel__history { padding: 20px 16px; }\n  .memory-wiki-panel__history-layout { grid-template-columns: minmax(0, 1fr); }\n  .memory-wiki-panel__history-layout.has-selection .memory-wiki-panel__history-list { display: none; }\n  .memory-wiki-panel__history-placeholder { display: none; }\n  .memory-wiki-panel__head-actions { flex-wrap: wrap; }\n}\n.memory-wiki-panel__history { display: flex; flex-direction: column; overflow: hidden; }\n.memory-wiki-panel__history-head, .memory-wiki-panel__history-availability, .memory-wiki-panel__history-toolbar { flex-shrink: 0; }\n.memory-wiki-panel__history-layout { flex: 1; min-height: 0; }\n.memory-wiki-panel__history-list, .memory-wiki-panel__history-detail { overflow-y: auto; scrollbar-width: thin; }\n.memory-wiki-panel__history-detail-head { position: sticky; top: 0; padding: 8px 0; background: var(--mw-bg); z-index: 1; }\n";
}
function installStyles() {
	document.getElementById(STYLE_ID)?.remove();
	const styleEl = document.createElement("style");
	styleEl.id = STYLE_ID;
	styleEl.dataset.memoryWiki = "client";
	styleEl.textContent = styles();
	document.head.appendChild(styleEl);
	return () => {
		styleEl.remove();
	};
}
const SidebarIcon = () => react.default.createElement("span", {
	title: "记忆 Wiki",
	style: {
		fontSize: 14,
		lineHeight: 1
	}
}, "◈");
function apply(ctx) {
	try {
		const getUiSession = () => resolveService(ctx, "uiSession");
		const source = createSource(void 0, createLazyRemoteClient(ctx));
		if (typeof ctx.inject === "function") ctx.inject(["remote"], (inner) => {
			const remote = resolveService(inner, "remote");
			if (remote === void 0) {
				console.error("dsh-memory-wiki: ctx.remote missing inside ctx.inject([remote])");
				return;
			}
			return mountRemoteSmoke(remote);
		});
		else console.error("dsh-memory-wiki: ctx.inject is not available; cannot bind $mount to the fiber");
		const install = () => {
			const disposeStyles = installStyles();
			const stopSlots = ctx.slots.inject("main", () => ctx.slots.inject("sidebar.panellist", () => {
				const stopMain = ctx.slots.register({
					name: "main",
					key: PANEL_ID,
					inject: () => {
						const uiSession = getUiSession();
						return {
							source,
							uiSession
						};
					}
				}, MemoryPanel);
				const stopIcon = ctx.slots.register({
					name: "sidebar.panellist",
					id: PANEL_ID,
					order: 44,
					label: () => "记忆 Wiki",
					locale: "memory-wiki"
				}, SidebarIcon);
				return () => {
					stopIcon?.();
					stopMain?.();
				};
			}));
			return () => {
				try {
					stopSlots?.();
				} finally {
					disposeStyles();
				}
			};
		};
		if (typeof ctx.effect === "function") ctx.effect(install);
		else install();
	} catch (error) {
		console.error("dsh-memory-wiki: apply failed", error);
		throw error;
	}
}
//#endregion
exports.MemoryPanel = MemoryPanel;
exports.STYLE_ID = STYLE_ID;
exports.apply = apply;
exports.inject = inject;
exports.name = name;

//# sourceMappingURL=client.js.map
		return module.exports;
	}
});
