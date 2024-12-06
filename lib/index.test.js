import { deepEqual, equal } from "node:assert";
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { describe, it } from "node:test";
import { loadPartialConfig, transformAsync } from "@babel/core";
import { rollup } from "rollup";
import svgr from "./index.js";

const createTransformWithBabel = (options) => {
  const babelConfig = loadPartialConfig({
    babelrc: false,
    configFile: false,
    ...options,
  });
  return async (code) => {
    const result = await transformAsync(code, babelConfig.options);
    if (!result?.code) {
      throw new Error(
        `Error while transforming using Babel: ${String(result)}`,
      );
    }
    return result.code;
  };
};

const compile = (plugins = [svgr()]) =>
  rollup({
    input: "./lib/__fixtures__/dino.svg",
    plugins,
  });

const getCode = (bundler) =>
  bundler.cache?.modules?.find(
    ({ id }) =>
      id.includes("__fixtures__/dino.svg") ||
      id.includes("__fixtures__\\dino.svg"),
  )?.code;

describe("rollup loader", () => {
  it("should convert file without babel", async () => {
    const code = await compile([svgr({})]);
    equal(
      getCode(code),
      `
import * as React from "react";
const SvgDino = props => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 414.46" width={200} {...props}><title>{"dino"}</title><path d="M133.69 256.8h-58c7.61-20.46 25.64-28.78 35-45.75-17.41-7.91-35.29-2-52.37-3.91-4.76-.52-11.55 1.95-12.86-4.74-.6-3.09 2.89-7.59 5.51-10.6 8.34-9.57 17.15-18.74 30.93-33.63-22.73 0-39.29-.09-55.84 0-10.74.08-16.4-4.14-7.2-13C57.05 108.24 87 62.32 134.46 35.32c39-22.14 79.91-31.45 123.76-15.18a123.51 123.51 0 0 0 60.72 6.71c23.58-3.11 43.19 6.3 49.79 31 5.75 21.58 19.44 33.48 39.24 40.65 11.3 4.1 22.39 8.81 33.53 13.35 45.5 18.6 59.5 69.61 30.21 110.25-13.63 18.9-59.71 34.51-83.43 27.24-13.33-4.08-26.55-7-40.52-6.78-33.2.47-52.75 16.75-59.78 49-6.67 30.56-6.49 61.72-7.83 92.6-1 22.2-7.58 23.35-26.54 16.32-43.44-16.1-81.35-40.38-117-69.37-16.91-13.74-24.93-27-11.84-47.67 4.32-6.88 5.42-15.82 8.92-26.64z" fill="#0d0e0e" /></svg>;
export default SvgDino;
`.trim(),
    );
  });
  it("should convert file without babel, native: true", async () => {
    const code = await compile([svgr({ native: true })]);
    equal(
      getCode(code),
      `
import * as React from "react";
import Svg, { Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgDino = props => <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 414.46" width={200} {...props}><Path d="M133.69 256.8h-58c7.61-20.46 25.64-28.78 35-45.75-17.41-7.91-35.29-2-52.37-3.91-4.76-.52-11.55 1.95-12.86-4.74-.6-3.09 2.89-7.59 5.51-10.6 8.34-9.57 17.15-18.74 30.93-33.63-22.73 0-39.29-.09-55.84 0-10.74.08-16.4-4.14-7.2-13C57.05 108.24 87 62.32 134.46 35.32c39-22.14 79.91-31.45 123.76-15.18a123.51 123.51 0 0 0 60.72 6.71c23.58-3.11 43.19 6.3 49.79 31 5.75 21.58 19.44 33.48 39.24 40.65 11.3 4.1 22.39 8.81 33.53 13.35 45.5 18.6 59.5 69.61 30.21 110.25-13.63 18.9-59.71 34.51-83.43 27.24-13.33-4.08-26.55-7-40.52-6.78-33.2.47-52.75 16.75-59.78 49-6.67 30.56-6.49 61.72-7.83 92.6-1 22.2-7.58 23.35-26.54 16.32-43.44-16.1-81.35-40.38-117-69.37-16.91-13.74-24.93-27-11.84-47.67 4.32-6.88 5.42-15.82 8.92-26.64z" fill="#0d0e0e" /></Svg>;
export default SvgDino;
`.trim(),
    );
  });
  it('should convert file without babel, exportType: "named"', async () => {
    const code = await compile([svgr({ exportType: "named" })]);
    equal(
      getCode(code),
      `
import * as React from "react";
const SvgDino = props => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 414.46" width={200} {...props}><title>{"dino"}</title><path d="M133.69 256.8h-58c7.61-20.46 25.64-28.78 35-45.75-17.41-7.91-35.29-2-52.37-3.91-4.76-.52-11.55 1.95-12.86-4.74-.6-3.09 2.89-7.59 5.51-10.6 8.34-9.57 17.15-18.74 30.93-33.63-22.73 0-39.29-.09-55.84 0-10.74.08-16.4-4.14-7.2-13C57.05 108.24 87 62.32 134.46 35.32c39-22.14 79.91-31.45 123.76-15.18a123.51 123.51 0 0 0 60.72 6.71c23.58-3.11 43.19 6.3 49.79 31 5.75 21.58 19.44 33.48 39.24 40.65 11.3 4.1 22.39 8.81 33.53 13.35 45.5 18.6 59.5 69.61 30.21 110.25-13.63 18.9-59.71 34.51-83.43 27.24-13.33-4.08-26.55-7-40.52-6.78-33.2.47-52.75 16.75-59.78 49-6.67 30.56-6.49 61.72-7.83 92.6-1 22.2-7.58 23.35-26.54 16.32-43.44-16.1-81.35-40.38-117-69.37-16.91-13.74-24.93-27-11.84-47.67 4.32-6.88 5.42-15.82 8.92-26.64z" fill="#0d0e0e" /></svg>;
export { SvgDino as ReactComponent };
`.trim(),
    );
  });
  it("should convert file with babel", async () => {
    const code = await compile([
      svgr({
        transform: createTransformWithBabel({
          presets: ["@babel/preset-env", "@babel/preset-react"],
        }),
      }),
    ]);
    deepEqual(
      getCode(code),
      `
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var SvgDino = function SvgDino(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 500 414.46",
    width: 200
  }, props), /*#__PURE__*/React.createElement("title", null, "dino"), /*#__PURE__*/React.createElement("path", {
    d: "M133.69 256.8h-58c7.61-20.46 25.64-28.78 35-45.75-17.41-7.91-35.29-2-52.37-3.91-4.76-.52-11.55 1.95-12.86-4.74-.6-3.09 2.89-7.59 5.51-10.6 8.34-9.57 17.15-18.74 30.93-33.63-22.73 0-39.29-.09-55.84 0-10.74.08-16.4-4.14-7.2-13C57.05 108.24 87 62.32 134.46 35.32c39-22.14 79.91-31.45 123.76-15.18a123.51 123.51 0 0 0 60.72 6.71c23.58-3.11 43.19 6.3 49.79 31 5.75 21.58 19.44 33.48 39.24 40.65 11.3 4.1 22.39 8.81 33.53 13.35 45.5 18.6 59.5 69.61 30.21 110.25-13.63 18.9-59.71 34.51-83.43 27.24-13.33-4.08-26.55-7-40.52-6.78-33.2.47-52.75 16.75-59.78 49-6.67 30.56-6.49 61.72-7.83 92.6-1 22.2-7.58 23.35-26.54 16.32-43.44-16.1-81.35-40.38-117-69.37-16.91-13.74-24.93-27-11.84-47.67 4.32-6.88 5.42-15.82 8.92-26.64z",
    fill: "#0d0e0e"
  }));
};
var _default = exports["default"] = SvgDino;
`.trim(),
    );
  });
  it("should convert file with babel, with jsxRuntime", async () => {
    const code = await compile([
      svgr({
        jsxRuntime: "automatic",
        transform: createTransformWithBabel({
          presets: [
            "@babel/preset-env",
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
        }),
      }),
    ]);
    deepEqual(
      getCode(code),
      `
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsxRuntime = require("react/jsx-runtime");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SvgDino = function SvgDino(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", _objectSpread(_objectSpread({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 500 414.46",
    width: 200
  }, props), {}, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("title", {
      children: "dino"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: "M133.69 256.8h-58c7.61-20.46 25.64-28.78 35-45.75-17.41-7.91-35.29-2-52.37-3.91-4.76-.52-11.55 1.95-12.86-4.74-.6-3.09 2.89-7.59 5.51-10.6 8.34-9.57 17.15-18.74 30.93-33.63-22.73 0-39.29-.09-55.84 0-10.74.08-16.4-4.14-7.2-13C57.05 108.24 87 62.32 134.46 35.32c39-22.14 79.91-31.45 123.76-15.18a123.51 123.51 0 0 0 60.72 6.71c23.58-3.11 43.19 6.3 49.79 31 5.75 21.58 19.44 33.48 39.24 40.65 11.3 4.1 22.39 8.81 33.53 13.35 45.5 18.6 59.5 69.61 30.21 110.25-13.63 18.9-59.71 34.51-83.43 27.24-13.33-4.08-26.55-7-40.52-6.78-33.2.47-52.75 16.75-59.78 49-6.67 30.56-6.49 61.72-7.83 92.6-1 22.2-7.58 23.35-26.54 16.32-43.44-16.1-81.35-40.38-117-69.37-16.91-13.74-24.93-27-11.84-47.67 4.32-6.88 5.42-15.82 8.92-26.64z",
      fill: "#0d0e0e"
    })]
  }));
};
var _default = exports["default"] = SvgDino;
`.trim(),
    );
  });
});
