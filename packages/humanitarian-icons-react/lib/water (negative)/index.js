/**
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Code generated by @un/icon-build-helpers. DO NOT EDIT.
 * @un/icon-build-helpers is a fork of @carbon/icon-build-helpers
 */
'use strict';

var Icon = require('../Icon-17378097.js');
var React = require('react');
require('@carbon/icon-helpers');
require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _mask, _g, _path;

var _excluded = ["children"];
var WaterNegative = /*#__PURE__*/React__default['default'].forwardRef(function WaterNegative(_ref, ref) {
  var children = _ref.children,
      rest = Icon._objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React__default['default'].createElement(Icon.Icon, Icon._extends({
    width: 56,
    height: 56,
    viewBox: "0 0 56 56",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    ref: ref
  }, rest), _mask || (_mask = /*#__PURE__*/React__default['default'].createElement("mask", {
    id: "a",
    width: "56",
    height: "56",
    x: "0",
    y: "0",
    maskUnits: "userSpaceOnUse"
  })), _g || (_g = /*#__PURE__*/React__default['default'].createElement("g", {
    mask: "url(#a)"
  })), _path || (_path = /*#__PURE__*/React__default['default'].createElement("path", {
    d: "M31.3109 41.6326C34.5127 41.6326 37.1132 38.6852 37.1132 35.057C37.1132 34.4145 36.5955 33.8967 35.952 33.8967C35.3104 33.8967 34.7927 34.4145 34.7927 35.057C34.7927 37.4011 33.2296 39.312 31.3109 39.312C30.6683 39.312 30.1506 39.8308 30.1506 40.4723C30.1506 41.1148 30.6683 41.6326 31.3109 41.6326Z",
    clipRule: "evenodd"
  })), children);
});

module.exports = WaterNegative;