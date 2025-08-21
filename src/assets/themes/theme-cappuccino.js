ace.define("ace/theme/cappuccino", ["require", "exports", "module", "ace/lib/dom"], function(require, exports, module) {

  exports.isDark = true;
  exports.cssClass = "ace-cappuccino";
  exports.cssText = "\
.ace-cappuccino .ace_gutter {\
background: #2f2a2a;\
color: #918787\
}\
.ace-cappuccino .ace_print-margin {\
width: 1px;\
background: #3e3838\
}\
.ace-cappuccino {\
background-color: #2f2a2a;\
color: #ede0d4\
}\
.ace-cappuccino .ace_cursor {\
color: #d9cab3\
}\
.ace-cappuccino .ace_marker-layer .ace_selection {\
background: #574b4b\
}\
.ace-cappuccino .ace_marker-layer .ace_active-line {\
background: #3e3838\
}\
.ace-cappuccino .ace_gutter-active-line {\
background-color: #3e3838\
}\
.ace-cappuccino .ace_keyword {\
color: #e5989b\
}\
.ace-cappuccino .ace_constant.ace_numeric {\
color: #ffb4a2\
}\
.ace-cappuccino .ace_string {\
color: #b5e48c\
}\
.ace-cappuccino .ace_variable {\
color: #99d98c\
}\
.ace-cappuccino .ace_comment {\
color: #a89f91;\
font-style: italic\
}\
.ace-cappuccino .ace_entity.ace_name.ace_function,\
.ace-cappuccino .ace_support.ace_function {\
color: #f4a261\
}\
.ace-cappuccino .ace_storage {\
color: #ffb4a2\
}\
.ace-cappuccino .ace_invalid {\
background-color: #e63946;\
color: #ede0d4\
}\
";

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});
(function() {
  ace.require(["ace/theme/cappuccino"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
