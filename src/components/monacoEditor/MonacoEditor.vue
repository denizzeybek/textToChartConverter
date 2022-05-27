<template>
  <div>
    <div ref="editor" style="width: 100%; height: 90.9vh"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import * as monaco from "monaco-editor";
import { CodeTree, CodeTreeNode } from "../flowChart/CodeTree";
export default {
  props: {
    codeTree: {
      type: CodeTree,
    },
  },
  data() {
    return {
      trialText: "",
    };
  },
  watch: {
    codeTree: function () {
      // console.log("here");
      var model = monaco.editor.getModels()[0];
      this.trialText = this.codeTree.toText();
      // console.log(this.trialText)
      model.setValue(this.trialText);
    },
  },
  async mounted() {
    const el = this.$refs.editor;
    monaco.languages.register({
      id: "mySpecialLanguage",
    });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider("mySpecialLanguage", {
      tokenizer: {
        root: [
          [/\(([^)]+)\)/, "red"],
          //eslint-disable-next-line
          [/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, 'blue'],
          [/info/, "custom-info"],
          [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
        ],
      },
    });

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider("mySpecialLanguage", {
      provideCompletionItems: (model, position, token) => {
        // Helper function to return the monaco completion item type of a thing
        var suggestions = {
          "mailleri indir": {
            label: "mailleri indir",
            insertText: "Mailleri İndir (${1:today})",
            description: "description",
          },
          "web adresine git": {
            label: "web adresine git",
            insertText: " ${1:www.example.com} adresine git",
            description: "description",
          },
          "sekmeyi tabloya yükle": {
            label: "Sekmeyi tabloya yükle",
            insertText:
              "(${1:Sekme Adı}) sekmesini (${2:Tablo Adı}) tablosuna yükle",
            description: "description",
          },
          "Web nesnesine tıkla": {
            label: "Web nesnesine tıkla",
            insertText: "(${1:web nVarsaesnesi}) nesnesine tıkla",
            description: "description",
          },
          "Varsa": {
            label: "Varsa",
            insertText: "Varsa",
            description: "description",
          },
        };

        var results = [];
        var obj = {
          "tablo yukle": {
            text: "() sekmesini () tablosuna yükle",
            //eslint-disable-next-line
            pattern:
              "^\\(([^\\)]+)\\) sekmesini \\(([^\\)]+)\\) tablosuna yükle$",
            parameters: {
              sekmeAdi: [
                "Sorumluluklar",
                "Firmalar",
                "Markalar",
                "Dozlar",
                "Formlar",
              ],
              tabloAdi: [
                "CompanyTable",
                "ResponsibilityTable",
                "BrandTable",
                "DosageTable",
                "FormTable",
              ],
            },
            label: "Sekmeyi tabloya yükle",
            insertText:
              "(${1:Sekme Adı}) sekmesini (${1:Tablo Adı}) tablosuna yükle",
            properties: [
              {
                text: "() satir araligini kullan",
                //eslint-disable-next-line
                pattern: "^\\(([^\\)]+)\\)$ satir aralığını kullan",
                parameters: {
                  hucreAraligi: ["1", "2", "3", "4"],
                },
                properties: [],
                description: "description",
              },
              {
                text: "() kolon araligini kullan",
                //eslint-disable-next-line
                pattern: "^\\(([^\\)]+)\\)$ kolon aralığını kullan",
                parameters: {
                  hucreAraligi: ["A", "B", "C", "D"],
                },
                properties: [],
                description: "description",
              },
            ],
            description: "description",
          },
          "mailleri indir": {
            text: "Mailleri İndir ()",
            //eslint-disable-next-line
            pattern: "^Mailleri İndir \\(([^\\)]+)\\)$",
            parameters: {
              time: ["Today", "This Week", "This Month", "This Year"],
            },
            properties: [],
            description: "description",
          },
          "nesneye tıkla": {
            text: "() nesnesine tıkla",
            //eslint-disable-next-line
            pattern: "^\\(([^\\)]+)\\) nesnesine tıkla$",
            parameters: {
              time: ["Web nesnesi", "Uygulama nesnesi"],
            },
            properties: [],
            description: "description",
          },
        };

        function FindParentLine(position, model) {
          var active_line = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: 100,
          });
          var line = active_line.trim();
          var diff = active_line.length - line.length;

          for (var i = 1; i < parseInt(position.lineNumber); i++) {
            var previous_active_line = model.getValueInRange({
              startLineNumber: position.lineNumber - i,
              startColumn: 0,
              endLineNumber: position.lineNumber - i,
              endColumn: 100,
            });
            var previous_line = previous_active_line.trim();
            var previous_diff =
              previous_active_line.length - previous_line.length;
            if (diff > previous_diff) {
              return previous_active_line;
            }
          }
        }

        function ShowAutocompletion(model, position, obj) {
          var active_line = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: 100,
          });

          var line = active_line.trim();
          var diff = active_line.length - line.length;

          var previous_active_line = FindParentLine(position, model);
          if (previous_active_line != undefined) {
            var previous_line = previous_active_line.trim();
            var previous_diff =
              previous_active_line.length - previous_line.length;
          }
          //properties
          if (diff % 4 != 0) {
            //model.getValueInRange({startLineNumber: position.lineNumber, startColumn: 0, endLineNumber: position.lineNumber, endColumn: }).setValue("degistirildi")
          }
          if (diff - previous_diff >= 4) {
            for (const ruleName of Object.keys(obj)) {
              const rule = obj[ruleName];
              if (rule.properties.length == 0) {
                continue;
              }
              var exp_prop = new MultiRegExp(rule.pattern);
              var match_porp = exp_prop.exec(previous_line);
              var active_line_rule_prop = previous_line;

              if (
                !(
                  Object.keys(match_porp).length === 0 &&
                  Object.getPrototypeOf(match_porp) === Object.prototype
                )
              ) {
                Object.keys(match_porp).forEach((key) => {
                  active_line_rule_prop = active_line_rule_prop.replace(
                    match_porp[key].text,
                    ""
                  );
                });
              }

              if (rule.text != active_line_rule_prop) {
                continue;
              }
              if (match_porp == null) {
                continue;
              }

              for (const [key, value] of Object.entries(rule.properties)) {
                var to_push_prop = {
                  label: value.text,
                  kind: monaco.languages.CompletionItemKind.Property,
                  detail: value.description,
                  insertText: value.text,
                };
                if (!results.includes(to_push_prop)) {
                  results.push(to_push_prop);
                }
              }
            }
            if (results.length != 0) {
              return results;
            }
          }
          //variable
          for (const ruleName of Object.keys(obj)) {
            const rule = obj[ruleName];
            var exp = new MultiRegExp(rule.pattern);
            var match = exp.exec(line);
            var active_line_rule = line;

            if (
              !(
                Object.keys(match).length === 0 &&
                Object.getPrototypeOf(match) === Object.prototype
              )
            ) {
              Object.keys(match).forEach((key) => {
                active_line_rule = active_line_rule.replace(
                  match[key].text,
                  ""
                );
              });
            }

            if (rule.text != active_line_rule) {
              continue;
            }
            if (match == null) {
              continue;
            }

            for (const [key, value] of Object.entries(match)) {
              const start = value.index + diff + 1;
              const end = start + value.text.length;

              if (start <= position.column && position.column <= end) {
                var params =
                  obj[ruleName].parameters[
                    Object.keys(obj[ruleName].parameters)[key]
                  ];
                for (var i = 0; i < params.length; i++) {
                  var to_push = {
                    label: params[i],
                    kind: monaco.languages.CompletionItemKind.Event,
                    detail: value.description,
                    insertText: params[i],
                  };
                  if (!results.includes(to_push)) {
                    results.push(to_push);
                  }
                }
              }
            }
          }
          //suggestion
          if (results.length == 0) {
            for (const ruleName of Object.keys(suggestions)) {
              var to_push_suggestion = {
                label: suggestions[ruleName].label,
                kind: monaco.languages.CompletionItemKind.Event,
                detail: suggestions[ruleName].description,
                insertText: suggestions[ruleName].insertText,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              };
              if (!results.includes(to_push_suggestion)) {
                results.push(to_push_suggestion);
              }
            }
          }
        }
        ShowAutocompletion(model, position, obj);
        return {
          suggestions: results,
        };
      },
    });
    this.editor = monaco.editor.create(el, {
      glyphMargin: true,
      value: this.codeTree.toText(),
      theme: "myCoolTheme",
      language: "mySpecialLanguage",
      // theme: 'myCoolTheme',
      fontSize: 16,
      minimap: {
        enabled: false,
      },
      lineHeight: 54,
      ambiguousCharacters: false,
      allowedCharacters: "ı",
    });
    var vm = this;
    var breakpoint_info = [];

    function RemoveBreakpointInfo(lineNumber) {
      return breakpoint_info.filter(function (bp) {
        if (bp.lineNumber == lineNumber) {
          return false;
        }
        return true;
      });
    }
    var decorations;
    self.codeTree = this.codeTree;
    monaco.editor.getModels()[0].onDidChangeContent(function (e) {
      //self.codeTree.setSelected(e.selection.startLineNumber,e.selection.endLineNumber)
    });
    this.editor.onDidChangeCursorSelection(function (e) {
      self.codeTree.setSelected(
        e.selection.startLineNumber,
        e.selection.endLineNumber
      );
    });
    this.editor.onDidChangeCursorPosition(function (e) {
      self.codeTree.setPosition(e.position.lineNumber);
      //console.log(JSON.stringify(e.position))
      //e.position.lineNumber

      if (e.secondaryPositions.length == 0) {
        let data = {
          lineNumber: e.position.lineNumber,
        };
        vm.$store.dispatch("addLineAction", data);
      } else {
        var cursorPosition = [
          {
            lineNumber: e.position.lineNumber,
          },
        ];
        for (var i = 0; i < e.secondaryPositions.length; i++) {
          let data = {
            lineNumber: e.secondaryPositions[i].lineNumber,
          };
          cursorPosition.push(data);
        }
        vm.$store.dispatch("addLineAction", cursorPosition);
      }
    });
    this.editor.onMouseDown(function (e) {
      if (e.target.type == 2 && e.target.mouseColumn == 1) {
        if (
          !breakpoint_info.some(
            (item) => item.lineNumber === e.target.position.lineNumber
          )
        ) {
          var model = monaco.editor.getModels()[0];
          var active_line = model.getValueInRange({
            startLineNumber: e.target.position.lineNumber,
            startColumn: 0,
            endLineNumber: e.target.position.lineNumber,
            endColumn: e.target.range.endColumn,
          });
          var line = active_line.trim();
          var diff = active_line.length - line.length;
          // console.log();
          decorations = vm.editor.deltaDecorations(
            [],
            [
              {
                range: new monaco.Range(
                  e.target.position.lineNumber,
                  diff,
                  e.target.position.lineNumber,
                  e.target.range.endColumn
                ),
                options: {
                  inlineClassName: "myContentClassBreakpoint",
                  glyphMarginClassName: "myGlyphMarginClassBreakpoint",
                  glyphMarginHoverMessage: [
                    {
                      value: "**Baslik**",
                    },
                    {
                      value: "icerik",
                    },
                  ],
                },
              },
            ]
          );
          var info = {
            lineNumber: e.target.position.lineNumber,
            decorationsId: decorations,
          };
          breakpoint_info.push(info);
        } else {
          var targetId = breakpoint_info.find(
            (item) => item.lineNumber === e.target.position.lineNumber
          ).decorationsId;
          vm.editor.deltaDecorations(
            [targetId],
            [
              {
                range: new monaco.Range(
                  e.target.position.lineNumber,
                  diff,
                  e.target.position.lineNumber,
                  e.target.range.endColumn
                ),
                options: {},
              },
            ]
          );
          breakpoint_info = RemoveBreakpointInfo(e.target.position.lineNumber);
        }
      }
    });


    var lineNumber = 3;
    var column = 5 ;
    this.editor.onDidType((text) => {
      if (text === "\n") {
        var lines = [];
        var model = this.editor.getModel();
        for (let i = 0; i < this.editor.getModel().getLineCount(); i++) {
          lines.push(model.getLineContent(i + 1));
        }
        var position = this.editor.getPosition();
        lineNumber =position.lineNumber;
        column = position.column;
        self.codeTree.setText(lines);
        /*vm.editor.setPosition({lineNumber:lineNumber, column:column});
        vm.editor.focus();*/

      }
    });



    var dec = this.editor.deltaDecorations(
      [],
      [
        {
          range: new monaco.Range(4, 1, 4, 1),
          options: {
            isWholeLine: true,
            linesDecorationsClassName: "deneme",
          },
        },
      ]
    );

    //SetLineValue(this.editor, 3, "Degistirildi");
    document.addEventListener("keydown", logKey);
    var currentLine;
    var decorationsId;

    function logKey(e) {
      if (e.code == "ControlLeft") {
        let values = breakpoint_info.map(function (v) {
          return v.lineNumber;
        });
        var min = Math.min.apply(null, values);
        decorationsId = StartDebugging(vm.editor, min);
        currentLine = min;
      } else if (e.code == "ShiftLeft") {
        currentLine++;
        decorationsId = StepOverDebugging(
          vm.editor,
          currentLine,
          decorationsId
        );
      } else if (e.code == "F10") {
        var next_breakpoints = breakpoint_info.filter(
          (item) => item.lineNumber > currentLine
        );
        let values = next_breakpoints.map(function (v) {
          return v.lineNumber;
        });
        currentLine = Math.min.apply(null, values);
        decorationsId = ContiuneDebugging(
          vm.editor,
          currentLine,
          decorationsId
        );
      } else if (e.code == "Escape") {
        decorationsId = StopDebugging(vm.editor, currentLine, decorationsId);
      } else if (e.code == "Enter") {
        /*var lineNumber = vm.editor.getPosition().lineNumber;
                var line = GetLine(lineNumber);
                console.log(line)
                this.codeTree.insertChild("",{text: line});*/
        //ClearSpace(vm.editor,lineNumber);
      } 
    }
    monaco.editor.defineTheme("myTheme", {
      base: "vs",
      inherit: true,
      rules: [
        {
          background: "EDF9FA",
        },
        {
          token: "red",
          foreground: "f90000",
        },
        {
          token: "blue",
          foreground: "46b0f5",
        },
        {
          token: "light-brown",
          foreground: "da985c",
          fontStyle: "bold",
        },
        {
          token: "custom-notice",
          foreground: "FFA500",
        },
        {
          token: "custom-date",
          foreground: "008800",
        },
      ],
      colors: {
        "editor.foreground": "#8bc66f",
        "editor.background": "#282c34",
        "editorCursor.foreground": "#528afd",
        "editor.lineHighlightBackground": "#2c313c",
        "editorLineNumber.foreground": "#495162",
        "editorLineNumber.activeForeground": "#abb2bf",
        "editor.selectionBackground": "#333a46",
        "editor.inactiveSelectionBackground": "#000000",
      },
    });
    monaco.editor.setTheme("myTheme");
  },
};

function ClearSpace(editor, lineNumber) {
  var model = monaco.editor.getModels()[0];
  var active_line = model.getValueInRange({
    startLineNumber: lineNumber,
    startColumn: 0,
    endLineNumber: lineNumber,
    endColumn: 100,
  });
  var line = active_line.trim();
  var diff = active_line.length - line.length;
  active_line = active_line.substring(diff % 4);

  var modelValue = editor.getValue();
  var modelArray = modelValue.split("\n");
  modelArray[lineNumber - 1] = active_line;
  var newModelValue = [];
  for (var i = 0; i < modelArray.length; i++) {
    newModelValue = newModelValue + modelArray[i] + "\n";
  }

  editor.setValue(newModelValue);
}

function GetLine(lineNumber) {
  var model = monaco.editor.getModels()[0];
  var active_line = model.getValueInRange({
    startLineNumber: lineNumber,
    startColumn: 0,
    endLineNumber: lineNumber,
    endColumn: 100,
  });
  return active_line;
}

function SetLineValue(editor, lineNumber, newLine) {
  var modelValue = editor.getValue();
  var modelArray = modelValue.split("\n");
  modelArray[lineNumber - 1] = newLine;
  var newModelValue = [];
  for (var i = 0; i < modelArray.length; i++) {
    newModelValue = newModelValue + modelArray[i] + "\n";
  }

  editor.setValue(newModelValue);
}

function MultiRegExp(par) {
  var regex;
  if (par.source !== undefined) {
    regex = par;
  } else {
    var exp = par;
    var opts = "";
    if (par.substring(0, 1) == "/") {
      var l = par.lastIndexOf("/");
      opts = par.substring(l + 1, par.length);
      exp = par.substring(1, l);
    }

    regex = new RegExp(exp, opts);
  }
  var expandSource = function (braces, indexer) {
    var ret = "";
    for (var i = 0; i < braces.length; i++) {
      if (braces[i].type == "raw") {
        ret += "(" + braces[i].text + ")";
        indexer.next();
      } else if (braces[i].type == "brace" && braces[i].containsCapture) {
        ret +=
          braces[i].pre +
          expandSource(braces[i].children, indexer) +
          braces[i].post;
      } else if (braces[i].type == "brace" && !braces[i].isCapture) {
        ret +=
          "(" +
          braces[i].text.substring(
            braces[i].pre.length,
            braces[i].text.length - braces[i].post.length
          ) +
          ")";
        indexer.next();
      } else if (braces[i].type == "brace") {
        ret += braces[i].text;
        indexer.next(true);
      } else {
        ret += braces[i].text;
      }
    }
    return ret;
  };

  var captureScan = function (braces, parent) {
    var containsCapture = false;
    for (var i = 0; i < braces.length; i++) {
      captureScan(braces[i].children, braces[i]);
      braces[i].isCapture = braces[i].text.indexOf("(?:") != 0;
      if (braces[i].isCapture) {
        containsCapture = true;
      }
      if (braces[i].isCapture && braces[i].containsCapture) {
        throw "nested captures not permitted, use (?:...) where capture is not intended";
      }
    }
    if (parent) {
      parent.containsCapture = containsCapture;
    }
  };

  var fillGaps = function (braces, text) {
    var pre = /^\((\?.)?/.exec(text);
    pre = pre == null ? "" : pre[0];
    var post = /\)$/.exec(text);
    post = post == null ? "" : post[0];
    var i = 0;
    if (braces.length > 0) {
      fillGaps(braces[0].children, braces[0].text);
    }
    if (braces.length > 0 && braces[0].pos > pre.length) {
      braces.splice(0, 0, {
        type: "raw",
        pos: pre.length,
        length: braces[0].pos,
        text: text.substring(pre.length, braces[0].pos),
      });
      i++;
    }
    for (i++; i < braces.length; i++) {
      fillGaps(braces[i].children, braces[i].text);
      if (braces[i].pos > braces[i - 1].pos + braces[i - 1].length) {
        braces.splice(i, 0, {
          type: "raw",
          pos: braces[i - 1].pos + braces[i - 1].length,
          length: braces[i].pos - (braces[i - 1].pos + braces[i - 1].length),
          text: text.substring(
            braces[i - 1].pos + braces[i - 1].length,
            braces[i].pos
          ),
        });
        i++;
      }
    }
    if (braces.length == 0) {
      braces.push({
        type: "raw",
        pos: pre.length,
        length: text.length - post.length - pre.length,
        text: text.substring(pre.length, text.length - post.length),
      });
    } else if (
      braces[braces.length - 1].pos + braces[braces.length - 1].length <
      text.length - post.length
    ) {
      var pos =
        braces[braces.length - 1].pos + braces[braces.length - 1].length;
      var txt = text.substring(pos, text.length - post.length);
      braces.push({
        type: "raw",
        pos: pos,
        length: txt.length,
        text: txt,
      });
    }
  };

  var GetBraces = function (text) {
    var ret = [];
    var shift = 0;
    do {
      var brace = GetBrace(text);
      if (brace == null) {
        break;
      } else {
        text = text.substring(brace.pos + brace.length);
        var del = brace.pos + brace.length;
        brace.pos += shift;
        shift += del;
        ret.push(brace);
      }
    } while (brace != null);
    return ret;
  };

  var GetBrace = function (text) {
    var ret = {
      pos: -1,
      length: 0,
      text: "",
      children: [],
      type: "brace",
    };
    // eslint-disable-next-line
    var openExp = /^(?:\\.|[^\)\\\(])*\(\?./;
    var pre = 3;
    var post = 1;
    var m = openExp.exec(text);
    if (m == null) {
      // eslint-disable-next-line
      m = /^(?:\\.|[^\)\\\(])*\(/.exec(text);
      pre = 1;
    }
    if (m != null) {
      ret.pos = m[0].length - pre;
      ret.children = GetBraces(text.substring(m[0].length));
      for (var i = 0; i < ret.children.length; i++) {
        ret.children[i].pos += pre;
      }
      // eslint-disable-next-line
      var closeExp = /^(?:\\.|[^\\\(\)])*\)/;
      // eslint-disable-next-line
      var closeExpAlt = /^(?:\\.|[^\\\(\)])*\)\?/;
      var from =
        ret.children.length <= 0
          ? ret.pos + pre
          : ret.children[ret.children.length - 1].pos +
            ret.children[ret.children.length - 1].length +
            m[0].length -
            pre;
      var m2 = closeExp.exec(text.substring(from));
      var m3 = closeExpAlt.exec(text.substring(from));
      if (m3 !== null && m3.length - 1 <= m2.length) {
        m2 = m3;
        post = 2;
      }
      if (m2 == null) {
        return null;
      } else {
        ret.length = m2[0].length + from - ret.pos;
        ret.text = text.substring(ret.pos, ret.pos + ret.length);
      }
    }
    // eslint-disable-next-line
    if (ret.text == "()" || /^\(\?.\)$/.test(ret.text)) {
      throw "empty braces not permitted";
    }
    if (ret.pos != -1) {
      ret.pre = ret.text.substring(0, pre);
      ret.post = ret.text.substring(ret.text.length - post, ret.text.length);
    }
    return ret.pos == -1 ? null : ret;
  };

  var fixOrs = function (braces_W_raw) {
    // eslint-disable-next-line
    var orFind = /^(\\.|[^\\|])*\|/;
    for (var i = 0; i < braces_W_raw.length; i++) {
      if (braces_W_raw[i].type == "raw") {
        var fullText = braces_W_raw[i].text;
        var m = orFind.exec(fullText);
        if (m != null) {
          var or = {
            type: "or",
            pos: m[0].length - 1 + braces_W_raw[i].pos,
            length: 1,
            text: "|",
          };
          var raw = {
            type: "raw",
            pos: m[0].length + braces_W_raw[i].pos,
            length: fullText.length - m[0].length,
            text: fullText.substring(m[0].length, fullText.length),
          };
          braces_W_raw[i].text = fullText.substring(0, m[0].length - 1);
          braces_W_raw[i].length = braces_W_raw[i].text.length;
          braces_W_raw.splice(i + 1, 0, or, raw);
          i += 1;
        }
      } else if (braces_W_raw[i].type == "brace") {
        fixOrs(braces_W_raw[i].children, braces_W_raw[i].text);
      }
    }
  };

  var source = regex.source;
  var braces = GetBraces(source);
  captureScan(braces);
  fillGaps(braces, source);
  fixOrs(braces);
  var indexer = {
    i: 1,
    next: function (realPoint) {
      if (realPoint) {
        this.points.push(this.i);
      }
      return this.i++;
    },
    points: [],
  };
  source = expandSource(braces, indexer);
  this.dataPoints = indexer.points;
  var options =
    (regex.ignoreCase ? "i" : "") +
    (regex.global ? "g" : "") +
    (regex.multiline ? "m" : "");
  this.regex = new RegExp(source, options);
  this.exec = function (text) {
    var m = this.regex.exec(text);
    if (m == null) {
      return {};
    }
    var ret = {};
    var ch = 0;
    for (var i = 1; i < m.length; i++) {
      if (m[i] !== null && m[i] !== undefined) {
        var pos = this.dataPoints.indexOf(i);
        if (pos != -1) {
          ret[pos] = {
            index: ch,
            text: m[i],
          };
        }
        ch += m[i].length;
      }
    }
    for (var j = 0; j < this.dataPoints.length; j++) {
      if (ret[j] === undefined) {
        ret[j] = null;
      }
    }
    return ret;
  };
}

function StartDebugging(editor, lineNumber) {
  var model = monaco.editor.getModels()[0];
  var active_line = model.getValueInRange({
    startLineNumber: lineNumber,
    startColumn: 0,
    endLineNumber: lineNumber,
    endColumn: 100,
  });
  var line = active_line.trim();
  var diff = active_line.length - line.length;
  var decorations = editor.deltaDecorations(
    [],
    [
      {
        range: new monaco.Range(
          lineNumber,
          diff,
          lineNumber,
          active_line.length
        ),
        options: {
          inlineClassName: "myContentClassArrow",
          glyphMarginClassName: "myGlyphMarginClassArrow",
        },
      },
    ]
  );
  return decorations;
}

function StepOverDebugging(editor, lineNumber, decorationsId) {
  var model = monaco.editor.getModels()[0];
  var active_line = model.getValueInRange({
    startLineNumber: lineNumber,
    startColumn: 0,
    endLineNumber: lineNumber,
    endColumn: 100,
  });
  var line = active_line.trim();
  var diff = active_line.length - line.length;
  var decorations = editor.deltaDecorations(
    [],
    [
      {
        range: new monaco.Range(
          lineNumber,
          diff,
          lineNumber,
          active_line.length
        ),
        options: {
          inlineClassName: "myContentClassArrow",
          glyphMarginClassName: "myGlyphMarginClassArrow",
        },
      },
    ]
  );
  editor.deltaDecorations(
    [decorationsId],
    [
      {
        range: new monaco.Range(
          lineNumber - 1,
          diff,
          lineNumber - 1,
          active_line.length
        ),
        options: {
          inlineClassName: "",
          glyphMarginClassName: "",
        },
      },
    ]
  );
  return decorations;
}

function ContiuneDebugging(editor, lineNumber, decorationsId) {
  var model = monaco.editor.getModels()[0];
  var active_line = model.getValueInRange({
    startLineNumber: lineNumber,
    startColumn: 0,
    endLineNumber: lineNumber,
    endColumn: 100,
  });
  var line = active_line.trim();
  var diff = active_line.length - line.length;
  var decorations = editor.deltaDecorations(
    [],
    [
      {
        range: new monaco.Range(
          lineNumber,
          diff,
          lineNumber,
          active_line.length
        ),
        options: {
          inlineClassName: "myContentClassArrow",
          glyphMarginClassName: "myGlyphMarginClassArrow",
        },
      },
    ]
  );
  editor.deltaDecorations(
    [decorationsId],
    [
      {
        range: new monaco.Range(
          lineNumber - 1,
          diff,
          lineNumber - 1,
          active_line.length
        ),
        options: {
          className: "",
          glyphMarginClassName: "",
        },
      },
    ]
  );
  return decorations;
}

function StopDebugging(editor, lineNumber, decorationsId) {
  var model = monaco.editor.getModels()[0];
  var active_line = model.getValueInRange({
    startLineNumber: lineNumber,
    startColumn: 0,
    endLineNumber: lineNumber,
    endColumn: 100,
  });
  var line = active_line.trim();
  var diff = active_line.length - line.length;

  var decorations = editor.deltaDecorations(
    [decorationsId],
    [
      {
        range: new monaco.Range(
          lineNumber - 1,
          diff,
          lineNumber - 1,
          active_line.length
        ),
        options: {
          inlineClassName: "",
          glyphMarginClassName: "",
        },
      },
    ]
  );
  return decorations;
}
</script>

<style>
.deneme {
  background: green;
  width: 20px !important;
  height: 20px !important;
}

.myGlyphMarginClassBreakpoint {
  background: rgb(181, 0, 0);
  border-radius: 50%;
  width: 20px !important;
  height: 20px !important;
  margin-top: 18px;
  margin-left: 30px;
}

.myContentClassBreakpoint {
  background: rgb(54, 18, 19);
}

.myGlyphMarginClassArrow {
  width: 0 !important;
  height: 0 !important;
  border: 1px;
  border-top: 10px solid transparent;
  border-left: 20px solid rgb(193, 193, 0);
  border-bottom: 10px solid transparent;
  margin-top: 20px;
  margin-left: 30px;
}

.myContentClassArrow {
  background: rgb(59, 66, 47);
}
</style>
