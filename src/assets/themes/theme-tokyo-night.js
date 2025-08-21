ace.define("ace/theme/tokyo-night", ["require", "exports", "module", "ace/lib/dom"], function(require, exports, module) {

  exports.isDark = true;
  exports.cssClass = "ace-tokyo-night";
  exports.cssText = "\
.ace-tokyo-night .ace_gutter {\
background: #1a1b26;\
color: #565f89\
}\
.ace-tokyo-night .ace_print-margin {\
width: 1px;\
background: #44475a\
}\
.ace-tokyo-night {\
background-color: #1a1b26;\
color: #c0caf5\
}\
.ace-tokyo-night .ace_cursor {\
color: #c0caf5\
}\
.ace-tokyo-night .ace_marker-layer .ace_selection {\
background: #33467c\
}\
.ace-tokyo-night.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #1a1b26;\
border-radius: 2px\
}\
.ace-tokyo-night .ace_marker-layer .ace_active-line {\
background: #24283b\
}\
.ace-tokyo-night .ace_gutter-active-line {\
background-color: #24283b\
}\
.ace-tokyo-night .ace_keyword {\
color: #bb9af7\
}\
.ace-tokyo-night .ace_constant.ace_numeric {\
color: #ff9e64\
}\
.ace-tokyo-night .ace_string {\
color: #9ece6a\
}\
.ace-tokyo-night .ace_variable {\
color: #7dcfff\
}\
.ace-tokyo-night .ace_comment {\
color: #565f89;\
font-style: italic\
}\
.ace-tokyo-night .ace_entity.ace_name.ace_function,\
.ace-tokyo-night .ace_support.ace_function {\
color: #7aa2f7\
}\
.ace-tokyo-night .ace_storage {\
color: #bb9af7\
}\
.ace-tokyo-night .ace_invalid {\
background-color: #f7768e;\
color: #c0caf5\
}\
";

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});
(function() {
  ace.require(["ace/theme/tokyo-night"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
