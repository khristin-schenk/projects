function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}import React from "https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18";

const AspectRatio = props => {
  const { ratio = 1 / 1, ...otherProps } = props;

  return /*#__PURE__*/(
    React.createElement("div", _extends({
      className: "aspect-ratio",
      style: { paddingTop: `${100 / ratio}%` } },
    otherProps)));


};

const Gradient = props => {
  const { angle = 0, from, to } = props;

  return /*#__PURE__*/(
    React.createElement("div", {
      style: {
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})` } }));



};

const Palette = props => {
  const { from, to } = props;

  return /*#__PURE__*/(
    React.createElement("figure", { className: "palette" }, /*#__PURE__*/
    React.createElement(AspectRatio, null, /*#__PURE__*/
    React.createElement(Gradient, _extends({ angle: 135 }, props))), /*#__PURE__*/

    React.createElement("figcaption", { className: "palette__caption" },
    from, " \u2013 ", to)));



};

const Palettes = props => {
  const { palettes } = props;

  return /*#__PURE__*/(
    React.createElement("div", { className: "palettes" },
    palettes.map((palette) => /*#__PURE__*/
    React.createElement(Palette, _extends({ key: palette.toString() }, palette)))));



};

const Grid = props => {
  return /*#__PURE__*/React.createElement("div", _extends({ className: "grid" }, props));
};

const App = () => {
  const palettes = [
  {
    from: "#f40076",
    to: "#df98fa" },

  {
    from: "#f06966",
    to: "#fad6a6" },

  {
    from: "#ff0076",
    to: "#590fb7" },

  {
    from: "#9055ff",
    to: "#13e2da" },

  {
    from: "#0b63f6",
    to: "#003cc5" },

  {
    from: "#d6ff7f",
    to: "#00b3cc" },

  {
    from: "#e233ff",
    to: "#ff6b00" },

  {
    from: "#df98fa",
    to: "#9055ff" },

  {
    from: "#ed7b84",
    to: "#9055ff" },

  {
    from: "#402565",
    to: "#30be96" },

  {
    from: "#402662",
    to: "#3900a6" },

  {
    from: "#f14658",
    to: "#dc2537" },

  {
    from: "#f40076",
    to: "#342711" },

  {
    from: "#000066",
    to: "#6699ff" },

  {
    from: "#cb5eee",
    to: "#4be1ec" },

  {
    from: "#fa7cbb",
    to: "#f14658" },

  {
    from: "#737dfe",
    to: "#ffcac9" },

  {
    from: "#2f80ed",
    to: "#b2ffda" }];



  return /*#__PURE__*/(
    React.createElement("div", { className: "app" }, /*#__PURE__*/
    React.createElement(Grid, null, /*#__PURE__*/
    React.createElement(Palettes, { palettes: palettes }))));



};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));