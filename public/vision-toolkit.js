// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

/*
MIT License
Copyright (c) 2020 Egor Nepomnyaschih
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const base64abc = [
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
];

const base64codes = [
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63,
	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
	255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255,
	255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];

function getBase64Code(charCode) {
    if (charCode >= base64codes.length) {
        throw new Error("Unable to parse base64 string.");
    }
    const code = base64codes[charCode];
    if (code === 255) {
        throw new Error("Unable to parse base64 string.");
    }
    return code;
}

function bytesToBase64(bytes) {
    let result = '', i, l = bytes.length;
    for (i = 2; i < l; i += 3) {
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
        result += base64abc[bytes[i] & 0x3F];
    }
    if (i === l + 1) { // 1 octet yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[(bytes[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) { // 2 octets yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[(bytes[i - 1] & 0x0F) << 2];
        result += "=";
    }
    return result;
}

function base64ToBytes(str) {
    if (str.length % 4 !== 0) {
        throw new Error("Unable to parse base64 string.");
    }
    const index = str.indexOf("=");
    if (index !== -1 && index < str.length - 2) {
        throw new Error("Unable to parse base64 string.");
    }
    let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0,
		n = str.length,
		result = new Uint8Array(3 * (n / 4)),
		buffer;
    for (let i = 0, j = 0; i < n; i += 4, j += 3) {
        buffer =
			getBase64Code(str.charCodeAt(i)) << 18 |
			getBase64Code(str.charCodeAt(i + 1)) << 12 |
			getBase64Code(str.charCodeAt(i + 2)) << 6 |
			getBase64Code(str.charCodeAt(i + 3));
        result[j] = buffer >> 16;
        result[j + 1] = (buffer >> 8) & 0xFF;
        result[j + 2] = buffer & 0xFF;
    }
    return result.subarray(0, result.length - missingOctets);
}

/**
 * jQuery json-viewer
 * @author: Alexandre Bodelot <alexandre.bodelot@gmail.com>
 * @link: https://github.com/abodelot/jquery.json-viewer
 */
(function ($) {

    /**
     * Check if arg is either an array with at least 1 element, or a dict with at least 1 key
     * @return boolean
     */
    function isCollapsable(arg) {
        return arg instanceof Object && Object.keys(arg).length > 0;
    }

    /**
     * Check if a string represents a valid url
     * @return boolean
     */
    function isUrl(string) {
        var urlRegexp = /^(https?:\/\/|ftps?:\/\/)?([a-z0-9%-]+\.){1,}([a-z0-9-]+)?(:(\d{1,5}))?(\/([a-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)?)?$/i;
        return urlRegexp.test(string);
    }

    /**
     * Transform a json object into html representation
     * @return string
     */
    function json2html(json, options, parent) {
        var html = '';
        var locator = parent;
        if (typeof json === 'string') {
            // Escape tags and quotes
            json = json
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/'/g, '&apos;')
              .replace(/"/g, '&quot;');

            if (options.withLinks && isUrl(json)) {
                html += '<a href="' + json + '" class="json-string" target="_blank">' + json + '</a>';
            } else {
                // Escape double quotes in the rendered non-URL string.
                json = json.replace(/&quot;/g, '\\&quot;');
                if (json.length > 50) {
                    json = json.substring(0, 50);
                    json += '...';
                }
                html += '<span class="json-string">"' + json + '"</span>';
            }
        } else if (typeof json === 'number') {
            html += '<span class="json-literal">' + json + '</span>';
        } else if (typeof json === 'boolean') {
            html += '<span class="json-literal">' + json + '</span>';
        } else if (json === null) {
            html += '<span class="json-literal">null</span>';
        } else if (json instanceof Array) {
            if (json.length > 0) {
                html += '[<ol class="json-array">';
                for (var i = 0; i < json.length; ++i) {
                    html += '<li>';
                    // Add toggle button if item is collapsable
                    if (isCollapsable(json[i])) {
                        html += '<a href data-locator="' + locator + i + '"class="json-toggle"></a>';
                    }
                    html += json2html(json[i], options, locator + i);
                    // Add comma if item is not last
                    if (i < json.length - 1) {
                        html += ',';
                    }
                    html += '</li>';
                }
                html += '</ol>]';
            } else {
                html += '[]';
            }
        } else if (typeof json === 'object') {
            var keyCount = Object.keys(json).length;
            if (keyCount > 0) {
                html += '{<ul class="json-dict">';
                for (var key in json) {
                    if (Object.prototype.hasOwnProperty.call(json, key)) {
                        html += '<li>';
                        var keyRepr = options.withQuotes ?
                          '<span class="json-string">"' + key + '"</span>' : key;
                        // Add toggle button if item is collapsable
                        if (isCollapsable(json[key])) {
                            html += '<a href data-locator="' + locator + keyRepr + '" class="json-toggle">' + keyRepr + '</a>';
                        } else {
                            html += keyRepr;
                        }
                        html += ': ' + json2html(json[key], options, locator + keyRepr);
                        // Add comma if item is not last
                        if (--keyCount > 0) {
                            html += ',';
                        }
                        html += '</li>';
                    }
                }
                html += '</ul>}';
            } else {
                html += '{}';
            }
        }
        return html;
    }

    /**
     * jQuery plugin method
     * @param json: a javascript object
     * @param options: an optional options hash
     */
    $.fn.jsonViewer = function (json, options, previous) {
        // Merge user options with default options
        options = Object.assign({}, {
            collapsed: false,
            rootCollapsable: true,
            withQuotes: false,
            withLinks: true
        }, options);

        // jQuery chaining
        return this.each(function () {

            var initialView = previous;

            // Transform to HTML
            var html = json2html(json, options, 'root');
            if (options.rootCollapsable && isCollapsable(json)) {
                html = '<a href data-locator="root" class="json-toggle"></a>' + html;
            }

            // Insert HTML in target DOM element
            $(this).html(html);
            $(this).addClass('json-document');

            // Bind click on toggle buttons
            $(this).off('click');
            $(this).on('click', 'a.json-toggle', function () {
                var target = $(this).toggleClass('collapsed').siblings('ul.json-dict, ol.json-array');
                target.toggle();
                if (target.is(':visible')) {
                    target.siblings('.json-placeholder').remove();
                } else {
                    var count = target.children('li').length;
                    var placeholder = count + (count > 1 ? ' items' : ' item');
                    target.after('<a href class="json-placeholder">' + placeholder + '</a>');
                }
                return false;
            });

            // Simulate click on toggle button when placeholder is clicked
            $(this).on('click', 'a.json-placeholder', function () {
                $(this).siblings('a.json-toggle').click();
                return false;
            });

            if (options.collapsed == true) {
                // Trigger click to collapse all nodes
                $(this).find('a.json-toggle').click();
            }

            var allLocators = $(this).find('a[data-locator]').each(function () {

                var currentItem = $(this);
                var currentLocator = $(this).data('locator');
                var initialViewItem = initialView.find('a[data-locator="' + currentLocator + '"]');

                if (initialViewItem.length != 0) {

                    if (currentItem.hasClass('collapsed') != initialViewItem.hasClass('collapsed')) {
                        currentItem.click();
                    }

                };
            });

        });
    };


})(jQuery);

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

TcHmi = {};
TcHmi.Functions = {};
TcHmi.Functions.registerFunctionEx = function (name, project, callback) {
    // console.log('TcHmi: Registered Function');
    // console.log(name);
    // console.log(project);
    // console.log(callback);
};

TcHmi.Server = {};
TcHmi.Server.writeSymbol = function (symbolName, symbolValue) {
    // console.log('TcHmi: Write Symbol');
    // console.log(symbolName);
    // console.log(symbolValue);
};

TcHmi.Server.isWebsocketReady = function () {
    // console.log('TcHmi: isWebsocketReady');
    return true;
}


TcHmi.Server.subscribeEx = function(commands, interval, options, callback){
    // console.log('TcHmi: subscribeEx');
    // console.log(commands);
    // console.log(interval);
    // console.log(options);
    // console.log(callback);
};
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var GraphFrameworkCustomisation = (function () {

    return {

        Initialise: function (GraphFramework) {

            // used to prevent duplication of the title field.  
            GraphFramework._registerNodeType = GraphFramework.registerNodeType;
            GraphFramework.registerNodeType = function (type, base_class) {

                var pos = type.lastIndexOf("/");
                if (pos > -1) {
                    base_class.title = type.substr(pos + 1, type.length);
                }

                this._registerNodeType(type, base_class);
            }

            // used to correct litegraph size issues
            GraphFramework.LGraphNode.prototype._computeSize = GraphFramework.LGraphNode.prototype.computeSize;
            GraphFramework.LGraphNode.prototype.computeSize = function (out) {

                var size = this._computeSize(out);

                var font_size = LiteGraph.NODE_TEXT_SIZE;

                var title_width = compute_text_size(this.title) + 40; // corrects small error with long titles in the standard code
                size[0] = Math.max(size[0], title_width);

                var widgets_maximum_width = 0;
                if (this.widgets && this.widgets.length) {
                    for (var i = 0, l = this.widgets.length; i < l; ++i) { // correctly sizes the node to the maximum widget combo size if the largest part

                        var w = this.widgets[i];
                        var widget_width = 0;

                        switch (w.type) {

                            case "combo":

                                widget_width += compute_text_size(w.name);

                                var max_combo_value_size = 0;

                                if (w.options && w.options.values && w.options.values.length) {
                                    for (var j = 0, k = w.options.values.length; j < k; ++j) {

                                        var combo_value_size = compute_text_size(w.options.values[j]);
                                        max_combo_value_size = Math.max(max_combo_value_size, combo_value_size);

                                    }
                                }

                                widget_width += max_combo_value_size;
                                break;

                            default:
                                break;
                        }
                        widget_width += 50;
                        widgets_maximum_width = Math.max(widgets_maximum_width, widget_width);
                    }                
                }

                function compute_text_size(text) {
                    if (!text) {
                        return 0;
                    }
                    return font_size * text.length * 0.6;
                }

                size[0] = Math.max(size[0], widgets_maximum_width);

                if (this.onComputeSize) {
                    var custom_size = this.onComputeSize(size);
                    size[0] = Math.max(size[0], custom_size[0]);
                    size[1] = Math.max(size[1], custom_size[1]);
                }
               
                return size;
            }
   
            GraphFramework.LGraph.prototype.block_configure_events = false;

            // used to stop onNodeAdded, etc... from incorrectly triggering a configuration change. 
            GraphFramework.LGraph.prototype._configure = LGraph.prototype.configure;
            GraphFramework.LGraph.prototype.configure = function (data, keep_old) {
                this.block_configure_events = true;
                this._configure(data, keep_old);
            }

            GraphFramework.LGraph.prototype._clear = GraphFramework.LGraph.prototype.clear;
            GraphFramework.LGraph.prototype.clear = function () {
                this._clear();
                if (!this.block_configure_events) {
                    this.configurationHasChanged();
                }
            }

            LGraph.prototype._start = LGraph.prototype.start;
            LGraph.prototype.start = function (interval) {

                this.process = this.debounce(this.triggerOnPropertyHasChanged);

                this._start(interval);
                this.configurationHasChanged();
            }

            // used to indicate a structure change has happened in the graph. 
            GraphFramework.LGraph.prototype.configurationHasChanged = function () {

                this.uuid = generateUUID();

                if (this.onConfigurationHasChanged) {
                    this.onConfigurationHasChanged();
                }
               
                this.generateUndoPoint();

            };
           
            // used to allow further customization of the on... Event, but added the undo function as an extra
            Object.defineProperty(GraphFramework.LGraph.prototype, 'onConfigure', {

                get: function () {
                    return function (data) {

                        this.block_configure_events = false;

                        if (this.onConfigureExtended) {
                            this.onConfigureExtended(data);
                        }

                        this.configurationHasChanged();
                    }
                },

                set: function (newFunction) {
                    this.onConfigureExtended = newFunction;
                }

            });

            GraphFramework.LGraph.prototype.debounce = function (func,context) {
                let timeout = 500;
                let timer;
                return (node, name, value, context) => {
                    clearTimeout(timer);
                    timer = setTimeout(() => { func(node, name, value, context); }, timeout);
                };
            }

            GraphFramework.LGraph.prototype.triggerOnPropertyHasChanged = function (node, name, value, context) {

                if (context.onPropertyHasChanged) {
                    context.onPropertyHasChanged(node, name, value);
                }
                context.generateUndoPoint();
            }

            // used to indicate property data change has happened in the graph. 
            GraphFramework.LGraph.prototype.propertyHasChanged = function (node, name, value) {
                this.process(node, name, value, this);
            };
            
            // used to overide onPropertyChanged
            GraphFramework.LGraphNode.prototype.onPropertyChanged = function (name, value, prev_value) {

                var result;

                if (this.onPropertyChangedExtended) {
                    result = this.onPropertyChangedExtended(name, value, prev_value);

                    if (result === false)
                        return result;
                }

                var currentNode = this;

                if (currentNode.graph && !currentNode.graph.block_configure_events) {
                    currentNode.graph.propertyHasChanged(currentNode, name, value);
                }
                
            }
   
            // used to allow further customization of the on... Event, but added the undo function as an extra
            Object.defineProperty(GraphFramework.LGraph.prototype, 'onSerialize', {

                get: function () {
                    return function (data) {

                        data.uuid = this.uuid;

                        if (this.onSerializeExtended) {
                            data = this.onSerializeExtended(data);
                        }

                        return data;
                    }
                },

                set: function (newFunction) {
                    this.onSerializeExtended = newFunction;
                }

            });

            // used to allow further customization of the on... Event, but added the undo function as an extra
            Object.defineProperty(GraphFramework.LGraph.prototype, 'onNodeAdded', {

                get: function () {
                    return function (node) {
                        if (this.onNodeAddedExtended) {
                            this.onNodeAddedExtended(node);
                        }

                        if (!this.block_configure_events) {
                            this.configurationHasChanged();
                        }
                       
                    }
                },

                set: function (newFunction) {
                    this.onNodeAddedExtended = newFunction;
                }   

            });

            // used to allow further customization of the on... Event, but added the undo function as an extra
            Object.defineProperty(GraphFramework.LGraph.prototype, 'onNodeRemoved', {

                get: function () {
                    return function (node) {
                        if (this.onNodeRemovedExtended) {
                            this.onNodeRemovedExtended(node);
                        }
                        if (!this.block_configure_events) {
                            this.configurationHasChanged();
                        }
                    }
                },

                set: function (newFunction) {
                    this.onNodeRemovedExtended = newFunction;
                }

            });

            // used to allow further customization of the on... Event, but added the undo function as an extra
            Object.defineProperty(GraphFramework.LGraph.prototype, 'onNodeConnectionChange', {

                get: function () {
                    return function (a,b,c,d,e) {
                        if (this.onNodeConnectionChangeExtended) {
                            this.onNodeConnectionChangeExtended(a, b, c, d, e);
                        }
                        if (!this.block_configure_events) {
                            this.configurationHasChanged();
                        }
                    }
                },

                set: function (newFunction) {
                    this.onNodeConnectionChangeExtended = newFunction;
                }

            });

            // undo / redo 

            GraphFramework.LGraph.prototype.undo = function () {

                if (this.undoData.end - this.undoData.begin <= 0) {
                    return;
                }

                if (this.undoData.current_position <= this.undoData.begin) {
                    this.undoData.current_position = this.undoData.begin;
                    return;
                }

                this.undoData.disable = true;
                this.undoData.current_position--;
                this.configure(JSON.parse(this.undoData['undoPoint_' + this.undoData.current_position]));
                this.undoData.disable = false;

            };

            GraphFramework.LGraph.prototype.redo = function () {

                if (this.undoData.current_position >= this.undoData.end) {
                    this.undoData.current_position = this.undoData.end;
                    return;
                }

                this.undoData.disable = true;
                this.undoData.current_position++;
                this.configure(JSON.parse(this.undoData['undoPoint_' + this.undoData.current_position]));
                this.undoData.disable = false;
            
            };

            GraphFramework.LGraph.prototype.MAXIMUM_UNDO = 20;
            GraphFramework.LGraph.prototype.undoData = { begin: 1, end: 1, current_position: 0, disable: false };

            GraphFramework.LGraph.prototype.generateUndoPoint = function () {

                if (this.undoData.disable == true) {
                    return;
                }

                if (this.undoData.current_position < this.undoData.end) {
                    for (i = this.undoData.current_position + 1; i <= this.undoData.end; i++) {
                        delete this.undoData['undoPoint_' + i];
                    }
                    this.undoData.end = this.undoData.current_position;
                }

                if (this.undoData.end - this.undoData.begin == this.MAXIMUM_UNDO) {

                    delete this.undoData['undoPoint_' + this.undoData.begin];
                    this.undoData.begin++;
                }

                this.undoData.end++;
                this.undoData.current_position++;
                this.undoData['undoPoint_' + this.undoData.current_position] = JSON.stringify(this.serialize());

            };

            GraphFramework.LGraph.prototype.save = function () {

                var data = JSON.stringify(this.serialize());
                var file = new Blob([data]);
                var url = URL.createObjectURL(file);
                var element = document.createElement("a");
                element.setAttribute('href', url);
                element.setAttribute('download', "untitled.tcgraph");
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                setTimeout(function () { URL.revokeObjectURL(url); }, 1000 * 60); 

            }

            GraphFramework.LGraph.prototype.load = function () {

                var this_graph = this;

                if (typeof FileReader === 'undefined') {
                    console.log('File loading not supported by your browser');
                    return;
                }

                var inputElement = document.createElement('input');

                inputElement.type = 'file';
                inputElement.accept = '.tcgraph';
                inputElement.multiple = false;

                inputElement.addEventListener('change', function (data) {

                    if (inputElement.files) {

                        var file = inputElement.files[0];
                        var reader = new FileReader();

                        reader.addEventListener('loadend', function (load_data) {

                            if (reader.result)
                                this_graph.configure(JSON.parse(reader.result));

                        });
                        reader.addEventListener('error', function (load_data) {
                            console.log('File load error');
                        });

                        reader.readAsText(file);

                    }
                });

                inputElement.click();
                return;

            }

            /**
            * Updates the graph status. 
            * @method updateStatus
            * @param {status} graph status object
            */
            GraphFramework.LGraph.prototype.updateStatus = function (status) {

                var graph = this;

                if (!status) {
                    return;
                }


                // graph content -------------------

                if (status.content) {
                 
                    // router memory content -------------------

                    let routerMemoryContent = status.content.find(element => element.name === 'RouterMemory');

                    if (routerMemoryContent.data) {
                        
                        let data = routerMemoryContent.data;

                        let result1 = get_text(data.startMemory, data.currentMemory, data.memoryDifference);
                        let result2 = get_text(data.tcStartMemory, data.currentMemory, data.tcStartMemoryDifference);
                        
                        let tb1 = TcHmi.Controls.get(`tbRouterMemory`);
                        let tb2 = TcHmi.Controls.get(`tbTcRouterMemory`);
                        
                        if (tb1 !== undefined)
                            set_text(tb1, result1);
                   
                        if (tb2 !== undefined)
                            set_text(tb2, result2);
                  
                        function get_text(start, current, difference) {

                            let result = { text: '', colour: null };
                                                       
                            result.text = result.text.concat(start, ' | ', current, ' (', difference, ')');
                            result.colour = (difference < 0) ? { color: "rgba(193,18,18,1)" } : null;

                            return result;
                        }

                        function set_text(textBox, result) {

                            textBox.setText(result.text);
                            textBox.setTextColor(result.colour)
                        }
                    }
                }


                // node status -------------------

                if (status.nodes) {

                   status.nodes.forEach(updateNodeStatus);

                   var nodePanel = document.querySelector("#node-panel");

                   if (nodePanel)
                       nodePanel.refreshPanel();

                   function updateNodeStatus(nodeStatus, index, array) {

                       let nodeId = nodeStatus.id;
                       let node = graph.getNodeById(nodeId);

                       if (!node) {
                           return;
                       }

                       if (node.hasErrors === undefined) {
                           node.hasErrors = false;
                       }

                       if (node.updateStatus) {
                           node.updateStatus(nodeStatus);
                       }

                       node.currentStatus = nodeStatus;

                       // error reaction -------------------

                       var statusReportsError = typeof nodeStatus.error != 'undefined';

                       if (statusReportsError != node.hasErrors) {

                           node.hasErrors = statusReportsError;
                           if (node.hasErrors) {
                               node.color = "#750000";
                               node.bgcolor = "#96000c";
                           }
                           else {
                               delete node.color;
                               delete node.bgcolor;
                           }

                           graph.setDirtyCanvas(false, true);
                       }

                       // watchdog reaction -------------------

                       var statusReportsWatchdog;
                       var functionsMonitored = getWatchDogFunctionsMonitored();
                       var fractionProcessed = getWatchDogFractionProcessed();

                       if (functionsMonitored != 0 && fractionProcessed != 100) {
                           statusReportsWatchdog = true;
                       } else {
                           statusReportsWatchdog = false;
                       }

                       if (statusReportsWatchdog != node.hasWatchdogTimeout) {

                           node.hasWatchdogTimeout = statusReportsWatchdog;
                           if (node.hasWatchdogTimeout) {
                               node.color = "#432";
                               node.bgcolor = "#653";
                           }
                           else {
                               if (!node.hasErrors) {
                                   delete node.color;
                                   delete node.bgcolor;
                               }
                           }

                           graph.setDirtyCanvas(false, true);
                       }

                       function getWatchDogPeriod() {

                           var content = nodeStatus.content;

                           if (!content) {
                               return 0;
                           }

                           let watchdogContent = content.find(element => element.name === 'WatchdogResults');

                           if (!watchdogContent) {
                               return 0;
                           }

                           return watchdogContent.data.period;

                       }

                       function getWatchDogRest() {

                           var content = nodeStatus.content;

                           if (!content) {
                               return 0;
                           }

                           let watchdogContent = content.find(element => element.name === 'WatchdogResults');

                           if (!watchdogContent) {
                               return 0;
                           }

                           return watchdogContent.data.rest;

                       }

                       function getWatchDogFunctionsMonitored() {

                           var content = nodeStatus.content;

                           if (!content) {
                               return 0;
                           }

                           let watchdogContent = content.find(element => element.name === 'WatchdogResults');

                           if (!watchdogContent) {
                               return 0;
                           }

                           return watchdogContent.data.functionsMonitored;

                       }

                       function getWatchDogFractionProcessed() {

                           var content = nodeStatus.content;

                           if (!content) {
                               return 0;
                           }

                           let watchdogContent = content.find(element => element.name === 'WatchdogResults');

                           if (!watchdogContent) {
                               return 0;
                           }

                           return watchdogContent.data.fractionProcessed;

                       }

                   }

                }

            };

            GraphFramework.LGraphCanvas.onMenuNodeMode = function (value, options, e, menu, node) {

                var menuItems = ["Cyclic", "On Trigger", "On Port Change", "Never"];

                var removeItems = function (menuItem, menuItems) {

                    var index = menuItems.indexOf(menuItem);
                    if (index !== -1) {
                        menuItems.splice(index, 1);
                    }

                    return menuItems;

                }

                if (!node.inputs) {

                    menuItems = removeItems("On Port Change",menuItems);
                    menuItems = removeItems("On Trigger", menuItems);
                    
                } else {

                    if (node.inputs.filter(function (e) { return e.type === LiteGraph.ACTION; }).length == 0) {
                        menuItems = removeItems("On Trigger", menuItems);
                    }
                    
                }
                              
                new LiteGraph.ContextMenu(
                    menuItems,
                    { event: e, callback: inner_clicked, parentMenu: menu, node: node }
                );

               
                function inner_clicked(v) {
                    if (!node) {
                        return;
                    }
                    switch (v) {
                        case "On Port Change":
                            node.mode = LiteGraph.ON_EVENT;
                            break;
                        case "On Trigger":
                            node.mode = LiteGraph.ON_TRIGGER;
                            break;
                        case "Never":
                            node.mode = LiteGraph.NEVER;
                            break;
                        case "Cyclic":
                        default:
                            node.mode = LiteGraph.ALWAYS;
                            break;
                    }
                    node.graph.configurationHasChanged();
                }

                return false;
            };

            /**
            * Updates the node status.  This also allows nodes to implement onStatusUpdate(status);
            * @method updateStatus
            * @param {status} array of status
            */
            GraphFramework.LGraphNode.prototype.updateStatus = function (status) {

                if (this.onStatusUpdate) {
                    this.onStatusUpdate(status);

                }

            };

            /**
           * Configures a new onDrawTitleBox which supports modes;
           * @method onDrawTitleBox
           */
            GraphFramework.LGraphNode.prototype.onDrawTitleBox = function (ctx, title_height) {

                let box_size = 10;
                let fillStyle = 'white';
                let letter = '';

                switch (this.mode) {
                    case 0:
                        fillStyle = '#7FFF7F';
                        letter = 'C';
                        box_size = 20;
                        break;
                    case 1:
                        fillStyle = 'orange';
                        letter = 'E';
                        box_size = 20;
                        break;
                    case 2:
                        fillStyle = 'grey';
                        letter = 'X';
                        box_size = 20;
                        break;
                    case 3:
                        fillStyle = 'orange';
                        letter = 'T';
                        box_size = 20;
                        break;
                    default:
                        box_size = 10;
                        fillStyle = 'white';
                        letter = '';
                }

                ctx.fillStyle = this.boxcolor || LiteGraph.NODE_DEFAULT_BOXCOLOR;
                ctx.beginPath();
                ctx.arc(
                    title_height * 0.5,
                    title_height * -0.5,
                    box_size * 0.5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.font = '12pt Calibri';
                ctx.fillStyle = fillStyle;
                ctx.textAlign = 'center';
                ctx.fillText(letter, title_height * 0.5, title_height * -0.5 + 5);
                
            }

            /**
            * Changes the default node context menu to have a reduced option set, plus auto disables the properties
            */
            GraphFramework.LGraphNode.prototype.getMenuOptions = function (graph) {

                var options = [                      
                        {
                            content: "Properties",
                            has_submenu: true,
                            callback: LGraphCanvas.onShowMenuNodeProperties,
                            disabled: true
                        },
                        null,
                        {
                            content: "Title",
                            callback: LGraphCanvas.onShowPropertyEditor
                        },
                        {
                            content: "Mode",
                            has_submenu: true,
                            callback: LGraphCanvas.onMenuNodeMode
                        }                 
                ];

                var node = this;

                var hasPropertiesWithoutWidgets = function () {

                    var propertyCount = Object.keys(node.properties).length;

                    if (propertyCount == 0) {
                        return false;
                    }

                    if (!node.widgets) {
                        return true;
                    }

                    var widgetCount = node.widgets.filter(widget => (typeof widget.options !== 'undefined') ? (typeof widget.options.property !== 'undefined') : false).length

                    if (propertyCount == widgetCount) {
                        return false;
                    }

                    return true;
                }


                if (hasPropertiesWithoutWidgets()) {
                    options[0].disabled = false;
                }

                return options;

               }


            /**
            * add helper for adding properties with string widgets automatically.  
            */
            GraphFramework.LGraphNode.prototype.addPropertyWithStringWidget = function (label, propertyName, initialValue, onChangeCallback) {

                var node = this;

                if (initialValue === undefined) {
                    initialValue = '';
                }

                if (onChangeCallback === undefined) {
                    onChangeCallback = function (v) { };
                }

                node.properties = node.properties || {};
                node.properties[propertyName] = initialValue;

                var widget = node.addWidget(
                    "text",
                    label,
                    initialValue,
                    onChangeCallback,
                    { property: propertyName }
                );

                return widget

            };

            /**
            * add helper for adding properties with number widgets automatically.  
            */
            GraphFramework.LGraphNode.prototype.addPropertyWithNumberWidget = function (label, propertyName, initialValue, min, max, precision, step, onChangeCallback) {

                var node = this;

                if (initialValue === undefined) {
                    initialValue = 0;
                }

                if (onChangeCallback === undefined) {
                    onChangeCallback = function (v) { };
                }

                node.properties = node.properties || {};
                node.properties[propertyName] = initialValue;

                var widget = node.addWidget(
                    "number",
                    label,
                    initialValue,
                    onChangeCallback,
                    { property: propertyName, min: min, max: max, precision: precision, step: step * 10 }
                );

                return widget

            };

            /**
            * add helper for adding properties with slider widgets automatically.  
            */
            GraphFramework.LGraphNode.prototype.addPropertyWithSliderWidget = function (label, propertyName, initialValue, min, max, precision, step, onChangeCallback) {

                var node = this;

                if (initialValue === undefined) {
                    initialValue = 0;
                }

                if (onChangeCallback === undefined) {
                    onChangeCallback = function (v) { };
                }

                node.properties = node.properties || {};
                node.properties[propertyName] = initialValue;

                var widget = node.addWidget(
                    "slider",
                    label,
                    initialValue,
                    onChangeCallback,
                    { property: propertyName, min: min, max: max, precision: precision, step: step * 10 }
                );

                return widget

            };

            /**
            * add helper for adding properties with combo widgets automatically.  
            */
            GraphFramework.LGraphNode.prototype.addPropertyWithComboboxWidget = function (label, propertyName, values, initialValue, onChangeCallback) {

                var node = this;

                if (initialValue === undefined) {
                    initialValue = values[0];
                }

                if (onChangeCallback === undefined) {
                    onChangeCallback = function (v) { };
                }

                node.properties = node.properties || {};
                node.properties[propertyName] = initialValue;

                var widget = node.addWidget(
                    "combo",
                    label,
                    initialValue,
                    onChangeCallback,
                    { property: propertyName, values: values }
                );

                return widget

            };

            /**
            * add helper for adding properties with toggle widgets automatically.  
            */
            GraphFramework.LGraphNode.prototype.addPropertyWithToggleWidget = function (label, propertyName, initialValue, onChangeCallback) {

                var node = this;

                if (initialValue === undefined) {
                    initialValue = false;
                }

                if (onChangeCallback === undefined) {
                    onChangeCallback = function (v) { };
                }

                node.properties = node.properties || {};
                node.properties[propertyName] = initialValue;

                var widget = node.addWidget(
                    "toggle",
                    label,
                    initialValue,
                    onChangeCallback,
                    { property: propertyName }
                );

                return widget

            };

            /**
            * custom side panel.  
            */
            GraphFramework.LGraphCanvas.prototype.onShowNodePanel = function (n) {

                var node = n;
            
                window.SELECTED_NODE = node;

                var panel = document.querySelector("#node-panel");
                if (panel)
                    panel.close();

                var ref_window = this.getCanvasWindow();
                panel = this.createPanel(node.title || "", { closable: true, window: ref_window });
                panel.id = "node-panel";
                panel.node = node;
                panel.classList.add("settings");
                panel.style.zIndex = "10";

                var graphcanvas = this;

                panel.refreshPanel = function () {

                    panel.previousJsonView = $('#json-renderer', $(panel.content.innerHTML).context);

                    panel.content.innerHTML = ""; 

                    panel.addHTML("<span class='node_type'>" + panel.node.type + "</span><span class='node_desc'>" + (panel.node.constructor.desc || "") + "</span><span class='separator'></span>");

                    panel.addHTML("<h3>Errors</h3>");
                    if (panel.node && panel.node.currentStatus && panel.node.currentStatus.error) {

                        var tableData = '';
                        panel.node.currentStatus.error.map(function (e) { tableData += ('<tr><td>' + e.message + '</td><td>' + e.reason + '</td></tr>') });
                        panel.addHTML('<table><tbody id="tbody">'+tableData+'</tbody></table>');

                    }
                    panel.addSeparator();

                    panel.addHTML('<h3>Json</h3><div><pre id="json-renderer"></pre></div>');
    
                    $('#json-renderer').jsonViewer(panel.node.currentStatus, {}, panel.previousJsonView);

                    panel.addSeparator();

                    if (panel.node.onShowCustomPanelInfo)
                        panel.node.onShowCustomPanelInfo(panel);
     
                }

                this.canvas.parentNode.appendChild(panel);
                panel.refreshPanel();
               
            }


            // full override of the draw node function.  
            // this was needed in order to add a conditional check on drawing the trigger port. 
            // if the node is in any other mode then this port shall be greyed out.
            GraphFramework.LGraphCanvas.prototype.drawNode = function (node, ctx) {

                var temp_vec2 = new Float32Array(2); // <--- different from original
               
                var glow = false;
                this.current_node = node;

                var color = node.color || node.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
                var bgcolor = node.bgcolor || node.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;

                //shadow and glow
                if (node.mouseOver) {
                    glow = true;
                }

                var low_quality = this.ds.scale < 0.6; //zoomed out

                //only render if it forces it to do it
                if (this.live_mode) {
                    if (!node.flags.collapsed) {
                        ctx.shadowColor = "transparent";
                        if (node.onDrawForeground) {
                            node.onDrawForeground(ctx, this, this.canvas);
                        }
                    }
                    return;
                }

                var editor_alpha = this.editor_alpha;
                ctx.globalAlpha = editor_alpha;

                if (this.render_shadows && !low_quality) {
                    ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
                    ctx.shadowOffsetX = 2 * this.ds.scale;
                    ctx.shadowOffsetY = 2 * this.ds.scale;
                    ctx.shadowBlur = 3 * this.ds.scale;
                } else {
                    ctx.shadowColor = "transparent";
                }

                //custom draw collapsed method (draw after shadows because they are affected)
                if (
                    node.flags.collapsed &&
                    node.onDrawCollapsed &&
                    node.onDrawCollapsed(ctx, this) == true
                ) {
                    return;
                }

                //clip if required (mask)
                var shape = node._shape || LiteGraph.BOX_SHAPE;
                var size = temp_vec2;
                temp_vec2.set(node.size);
                var horizontal = node.horizontal; // || node.flags.horizontal;

                if (node.flags.collapsed) {
                    ctx.font = this.inner_text_font;
                    var title = node.getTitle ? node.getTitle() : node.title;
                    if (title != null) {
                        node._collapsed_width = Math.min(
                            node.size[0],
                            ctx.measureText(title).width +
                                LiteGraph.NODE_TITLE_HEIGHT * 2
                        ); //LiteGraph.NODE_COLLAPSED_WIDTH;
                        size[0] = node._collapsed_width;
                        size[1] = 0;
                    }
                }

                if (node.clip_area) {
                    //Start clipping
                    ctx.save();
                    ctx.beginPath();
                    if (shape == LiteGraph.BOX_SHAPE) {
                        ctx.rect(0, 0, size[0], size[1]);
                    } else if (shape == LiteGraph.ROUND_SHAPE) {
                        ctx.roundRect(0, 0, size[0], size[1], 10);
                    } else if (shape == LiteGraph.CIRCLE_SHAPE) {
                        ctx.arc(
                            size[0] * 0.5,
                            size[1] * 0.5,
                            size[0] * 0.5,
                            0,
                            Math.PI * 2
                        );
                    }
                    ctx.clip();
                }

                //draw shape
                if (node.has_errors) {
                    bgcolor = "red";
                }
                this.drawNodeShape(
                    node,
                    ctx,
                    size,
                    color,
                    bgcolor,
                    node.is_selected,
                    node.mouseOver
                );
                ctx.shadowColor = "transparent";

                //draw foreground
                if (node.onDrawForeground) {
                    node.onDrawForeground(ctx, this, this.canvas);
                }

                //connection slots
                ctx.textAlign = horizontal ? "center" : "left";
                ctx.font = this.inner_text_font;

                var render_text = !low_quality;

                var out_slot = this.connecting_output;
                ctx.lineWidth = 1;

                var max_y = 0;
                var slot_pos = new Float32Array(2); //to reuse

                //render inputs and outputs
                if (!node.flags.collapsed) {
                    //input connection slots
                    if (node.inputs) {
                        for (var i = 0; i < node.inputs.length; i++) {
                            var slot = node.inputs[i];
                            if (slot.linked_to_property) {continue;};

                            ctx.globalAlpha = editor_alpha;
                            //change opacity of incompatible slots when dragging a connection
                            if ( this.connecting_node && !LiteGraph.isValidConnection( slot.type , out_slot.type) ) {
                                ctx.globalAlpha = 0.4 * editor_alpha;
                            }

                            ctx.fillStyle =
                                slot.link != null
                                    ? slot.color_on ||
                                      this.default_connection_color.input_on
                                    : slot.color_off ||
                                      this.default_connection_color.input_off;

                            var pos = node.getConnectionPos(true, i, slot_pos);
                            pos[0] -= node.pos[0];
                            pos[1] -= node.pos[1];
                            if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                                max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                            }

                            ctx.beginPath();

                            var ctx_saved = false;

                            if (
                                slot.type === LiteGraph.EVENT ||
                                slot.shape === LiteGraph.BOX_SHAPE
                            ) {
                                if (horizontal) {
                                    ctx.rect(
                                        pos[0] - 5 + 0.5,
                                        pos[1] - 8 + 0.5,
                                        10,
                                        14
                                    );
                                } else {

                                    // <--- different from original -- start

                                    ctx.save();
                                    ctx_saved = true;
                                    
                                    if (node.mode != LiteGraph.ON_TRIGGER && slot.type === LiteGraph.EVENT) { 
                                        ctx.globalAlpha = 0.4 * editor_alpha; 
                                    }

                                    // <--- different from original -- end
                                    ctx.rect(
                                        pos[0] - 6 + 0.5,
                                        pos[1] - 5 + 0.5,
                                        14,
                                        10
                                    );

                                }
                            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                                ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                                ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                                ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                                ctx.closePath();
                            } else {
						        if(low_quality)
	                                ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 ); //faster
						        else
	                                ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                            }
                            ctx.fill();

                            //render name
                            if (render_text) {
                                var text = slot.label != null ? slot.label : slot.name;
                                if (text) {
                                    ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                                    if (horizontal || slot.dir == LiteGraph.UP) {
                                        ctx.fillText(text, pos[0], pos[1] - 10);
                                    } else {
                                        ctx.fillText(text, pos[0] + 10, pos[1] + 5);
                                    }
                                }
                            }

                            // <--- different from original -- start
                            if (ctx_saved)
                                ctx.restore(); 
                            // <--- different from original -- end
                        }
                    }

                    //output connection slots
                    if (this.connecting_node) {
                        ctx.globalAlpha = 0.4 * editor_alpha;
                    }

                    ctx.textAlign = horizontal ? "center" : "right";
                    ctx.strokeStyle = "black";
                    if (node.outputs) {
                        for (var i = 0; i < node.outputs.length; i++) {
                            var slot = node.outputs[i];

                            var pos = node.getConnectionPos(false, i, slot_pos);
                            pos[0] -= node.pos[0];
                            pos[1] -= node.pos[1];
                            if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                                max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                            }

                            ctx.fillStyle =
                                slot.links && slot.links.length
                                    ? slot.color_on ||
                                      this.default_connection_color.output_on
                                    : slot.color_off ||
                                      this.default_connection_color.output_off;
                            ctx.beginPath();
                            //ctx.rect( node.size[0] - 14,i*14,10,10);

                            if (
                                slot.type === LiteGraph.EVENT ||
                                slot.shape === LiteGraph.BOX_SHAPE
                            ) {
                                if (horizontal) {
                                    ctx.rect(
                                        pos[0] - 5 + 0.5,
                                        pos[1] - 8 + 0.5,
                                        10,
                                        14
                                    );
                                } else {
                                    ctx.rect(
                                        pos[0] - 6 + 0.5,
                                        pos[1] - 5 + 0.5,
                                        14,
                                        10
                                    );
                                }
                            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                                ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                                ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                                ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                                ctx.closePath();
                            } else {
						        if(low_quality)
	                                ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 );
						        else
	                                ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                            }

                            //trigger
                            //if(slot.node_id != null && slot.slot == -1)
                            //	ctx.fillStyle = "#F85";

                            //if(slot.links != null && slot.links.length)
                            ctx.fill();
					        if(!low_quality)
	                            ctx.stroke();

                            //render output name
                            if (render_text) {
                                var text = slot.label != null ? slot.label : slot.name;
                                if (text) {
                                    ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                                    if (horizontal || slot.dir == LiteGraph.DOWN) {
                                        ctx.fillText(text, pos[0], pos[1] - 8);
                                    } else {
                                        ctx.fillText(text, pos[0] - 10, pos[1] + 5);
                                    }
                                }
                            }
                        }
                    }

                    ctx.textAlign = "left";
                    ctx.globalAlpha = 1;

                    if (node.widgets) {
				        var widgets_y = max_y;
                        if (horizontal || node.widgets_up) {
                            widgets_y = 2;
                        }
				        if( node.widgets_start_y != null )
                            widgets_y = node.widgets_start_y;
                        this.drawNodeWidgets(
                            node,
                            widgets_y,
                            ctx,
                            this.node_widget && this.node_widget[0] == node
                                ? this.node_widget[1]
                                : null
                        );
                    }

                    if (node.inputs) {
                        for (var i = 0; i < node.inputs.length; i++) {
                            var slot = node.inputs[i];
                            if (!slot.linked_to_property) {continue;};

                            ctx.globalAlpha = editor_alpha;
                            //change opacity of incompatible slots when dragging a connection
                            if ( this.connecting_node && !LiteGraph.isValidConnection( slot.type , out_slot.type) ) {
                                ctx.globalAlpha = 0.4 * editor_alpha;
                            }

                            ctx.fillStyle =
                                slot.link != null
                                    ? slot.color_on ||
                                      this.default_connection_color.input_on
                                    : slot.color_off ||
                                      this.default_connection_color.input_off;

                            var pos = node.getConnectionPos(true, i, slot_pos);
                            pos[0] -= node.pos[0];
                            pos[1] -= node.pos[1];
                            if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                                max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                            }

                            ctx.beginPath();

                            var ctx_saved = false;

                            if (
                                slot.type === LiteGraph.EVENT ||
                                slot.shape === LiteGraph.BOX_SHAPE
                            ) {
                                if (horizontal) {
                                    ctx.rect(
                                        pos[0] - 5 + 0.5,
                                        pos[1] - 8 + 0.5,
                                        10,
                                        14
                                    );
                                } else {

                                    // <--- different from original -- start

                                    ctx.save();
                                    ctx_saved = true;
                                    
                                    if (node.mode != LiteGraph.ON_TRIGGER && slot.type === LiteGraph.EVENT) { 
                                        ctx.globalAlpha = 0.4 * editor_alpha; 
                                    }

                                    // <--- different from original -- end
                                    ctx.rect(
                                        pos[0] - 6 + 0.5,
                                        pos[1] - 5 + 0.5,
                                        14,
                                        10
                                    );

                                }
                            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                                ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                                ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                                ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                                ctx.closePath();
                            } else {
						        if(low_quality)
	                                ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 ); //faster
						        else
	                                ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                            }
                            ctx.fill();

                            //render name
                            if (render_text) {
                                var text = slot.label != null ? slot.label : slot.name;
                                if (text) {
                                    ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                                    if (horizontal || slot.dir == LiteGraph.UP) {
                                        ctx.fillText(text, pos[0], pos[1] - 10);
                                    } else {
                                        ctx.fillText(text, pos[0] + 10, pos[1] + 5);
                                    }
                                }
                            }

                            // <--- different from original -- start
                            if (ctx_saved)
                                ctx.restore(); 
                            // <--- different from original -- end
                        }
                    }

                } else if (this.render_collapsed_slots) {
                    //if collapsed
                    var input_slot = null;
                    var output_slot = null;

                    //get first connected slot to render
                    if (node.inputs) {
                        for (var i = 0; i < node.inputs.length; i++) {
                            var slot = node.inputs[i];
                            if (slot.link == null) {
                                continue;
                            }
                            input_slot = slot;
                            break;
                        }
                    }
                    if (node.outputs) {
                        for (var i = 0; i < node.outputs.length; i++) {
                            var slot = node.outputs[i];
                            if (!slot.links || !slot.links.length) {
                                continue;
                            }
                            output_slot = slot;
                        }
                    }

                    if (input_slot) {
                        var x = 0;
                        var y = LiteGraph.NODE_TITLE_HEIGHT * -0.5; //center
                        if (horizontal) {
                            x = node._collapsed_width * 0.5;
                            y = -LiteGraph.NODE_TITLE_HEIGHT;
                        }
                        ctx.fillStyle = "#686";
                        ctx.beginPath();
                        if (
                            slot.type === LiteGraph.EVENT ||
                            slot.shape === LiteGraph.BOX_SHAPE
                        ) {
                            ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
                        } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                            ctx.moveTo(x + 8, y);
                            ctx.lineTo(x + -4, y - 4);
                            ctx.lineTo(x + -4, y + 4);
                            ctx.closePath();
                        } else {
                            ctx.arc(x, y, 4, 0, Math.PI * 2);
                        }
                        ctx.fill();
                    }

                    if (output_slot) {
                        var x = node._collapsed_width;
                        var y = LiteGraph.NODE_TITLE_HEIGHT * -0.5; //center
                        if (horizontal) {
                            x = node._collapsed_width * 0.5;
                            y = 0;
                        }
                        ctx.fillStyle = "#686";
                        ctx.strokeStyle = "black";
                        ctx.beginPath();
                        if (
                            slot.type === LiteGraph.EVENT ||
                            slot.shape === LiteGraph.BOX_SHAPE
                        ) {
                            ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
                        } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                            ctx.moveTo(x + 6, y);
                            ctx.lineTo(x - 6, y - 4);
                            ctx.lineTo(x - 6, y + 4);
                            ctx.closePath();
                        } else {
                            ctx.arc(x, y, 4, 0, Math.PI * 2);
                        }
                        ctx.fill();
                        //ctx.stroke();
                    }
                }

                if (node.clip_area) {
                    ctx.restore();
                }

                ctx.globalAlpha = 1.0;
            };
        }
    }
})();




// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.746.3/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var PlcApi = (function (symbol, graph) {

    var api = {

        loadGraph: function () {
        
            var graphJson = JSON.stringify(graph.serialize());

            console.log('Configuration Change');
            console.log(graphJson);

            TcHmi.Server.writeSymbol(symbol + '.receivedGraphJson', graphJson);

        },

        updateNodeProperty: function () {

            var graphJson = JSON.stringify(graph.serialize());

            console.log('Property Change');
            console.log(graphJson);

            TcHmi.Server.writeSymbol(symbol + '.receivedGraphJson', graphJson);

        },

        setupIncomingRoutes: function () {

            if (TcHmi.Server.isWebsocketReady()) {

                var commands = [{ 'symbol': symbol + '.graphStatus' }];

                var requestId = TcHmi.Server.subscribeEx(commands, 500, { timeout: 2000 }, function (data) {
                    if (data.error !== TcHmi.Errors.NONE) { return; }

                    var response = data.response;
                    if (!response || response.error !== undefined) { return; }
                        
                    var commands = response.commands;
                    if (commands === undefined) { return; }
                       
                    for (var i = 0, ii = commands.length; i < ii; i++) {

                        var command = commands[i];
                        if (command === undefined) { return; }                          
                        if (command.error !== undefined) { return; }        

                        let statusObject = JSON.parse(command.readValue);
                        graph.updateStatus(statusObject);

                    }
                });
            }
        }
    }

    api.setupIncomingRoutes();

    graph.onConfigurationHasChanged = function () {
        api.loadGraph();
    }

    graph.onPropertyHasChanged = function (node, name, value) {
        api.updateNodeProperty(); 
    }

    return api;

});

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var PlcBasicNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {
            

            // Display
            GraphFramework.registerNodeType("PLC Basic/Display/Bool Display", Node_BoolDisplay);
            GraphFramework.registerNodeType("PLC Basic/Display/String Display", Node_StringDisplay);
            GraphFramework.registerNodeType("PLC Basic/Display/Dint Display", Node_DintDisplay);
            GraphFramework.registerNodeType("PLC Basic/Display/Udint Display", Node_UdintDisplay);
            GraphFramework.registerNodeType("PLC Basic/Display/Ulint Display", Node_UlintDisplay);

            // Literals
            GraphFramework.registerNodeType("PLC Basic/Literals/Bool Literal", Node_BoolLiteral);
            GraphFramework.registerNodeType("PLC Basic/Literals/String Literal", Node_StringLiteral);
            GraphFramework.registerNodeType("PLC Basic/Literals/Dint Literal", Node_DintLiteral);
            GraphFramework.registerNodeType("PLC Basic/Literals/Udint Literal", Node_UdintLiteral);
            GraphFramework.registerNodeType("PLC Basic/Literals/Ulint Literal", Node_UlintLiteral);
           
            // StringFunctions
            GraphFramework.registerNodeType("PLC Basic/String Functions/Concat", Node_Concat);

            // Timer
            GraphFramework.registerNodeType("PLC Basic/Timer/Timer Pulse", Node_TimerPulse);

            // TypeConversion
            GraphFramework.registerNodeType("PLC Basic/Type Conversion/ULINT_TO_STRING", Node_ULINT_TO_STRING);

            // IO
            GraphFramework.registerNodeType("PLC Basic/IO/Digital Input", Node_DigitalInput);
            GraphFramework.registerNodeType("PLC Basic/IO/Digital Output", Node_DigitalOutput);
            GraphFramework.registerNodeType("PLC Basic/IO/Analogue Input", Node_AnalogueInput);
            GraphFramework.registerNodeType("PLC Basic/IO/Analogue Output", Node_AnalogueOutput);

        }
    }
})();

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var TcUnitNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

            GraphFramework.registerNodeType("Test/Test Start", Node_TestStart);
            GraphFramework.registerNodeType("Test/Test Finished", Node_TestFinished);
            GraphFramework.registerNodeType("Test/Asserts/Assert False", Node_AssertFalse);
            GraphFramework.registerNodeType("Test/Asserts/Assert True", Node_AssertTrue);
            GraphFramework.registerNodeType("Test/Asserts/Assert Equal DINT", Node_AssertEqual_DINT);
            GraphFramework.registerNodeType("Test/Asserts/Assert Equal UDINT", Node_AssertEqual_UDINT);
            GraphFramework.registerNodeType("Test/Asserts/Assert Equal STRING", Node_AssertEqual_STRING);

        }
    }
})();


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var TcVisionNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {    

            // Algebraic Image Operations
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_AddImages", Node_F_VN_AddImages);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_BitwiseAndImages", Node_F_VN_BitwiseAndImages);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_BitwiseNotImage", Node_F_VN_BitwiseNotImage);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_BitwiseOrImages", Node_F_VN_BitwiseOrImages);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_BitwiseXorImages", Node_F_VN_BitwiseXorImages);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_DivideImages", Node_F_VN_DivideImages);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_MaxImage", Node_F_VN_MaxImage);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_MinImage", Node_F_VN_MinImage);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_MultiplyImages", Node_F_VN_MultiplyImages);
            GraphFramework.registerNodeType("Vision/Algebraic Image Operations/F_VN_SubtractImages", Node_F_VN_SubtractImages);

            // Basic Container Operations
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_DINT", Node_F_VN_GetAt_DINT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_INT", Node_F_VN_GetAt_INT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_ITcVnContainer", Node_F_VN_GetAt_ITcVnContainer);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_LREAL", Node_F_VN_GetAt_LREAL);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_REAL", Node_F_VN_GetAt_REAL);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_SINT", Node_F_VN_GetAt_SINT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_UDINT", Node_F_VN_GetAt_UDINT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_UINT", Node_F_VN_GetAt_UINT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_ULINT", Node_F_VN_GetAt_ULINT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_GetAt/F_VN_GetAt_USINT", Node_F_VN_GetAt_USINT);
            GraphFramework.registerNodeType("Vision/Basic Container Operations/F_VN_ExportContainerSize", Node_F_VN_ExportContainerSize);

            // Basic Image Operations
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_ConvertElementType", Node_F_VN_ConvertElementType);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_CopyImage", Node_F_VN_CopyImage);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_CopyIntoDisplayableImage", Node_F_VN_CopyIntoDisplayableImage);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_GetImageChannel", Node_F_VN_GetImageChannel);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_GetRoi", Node_F_VN_GetRoi);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_ResetRoi", Node_F_VN_ResetRoi);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_SetRoi", Node_F_VN_SetRoi);
            GraphFramework.registerNodeType("Vision/Basic Image Operations/F_VN_SetRoi_TcVnRectangle_UDINT", Node_F_VN_SetRoi_TcVnRectangle_UDINT);     

            // Code Reading
            GraphFramework.registerNodeType("Vision/Code Reading/F_VN_ReadDataMatrixCode", Node_F_VN_ReadDataMatrixCode);
            GraphFramework.registerNodeType("Vision/Code Reading/F_VN_ReadQRCode", Node_F_VN_ReadQRCode);
            GraphFramework.registerNodeType("Vision/Code Reading/F_VN_ReadQRCodeExp", Node_F_VN_ReadQRCodeExp);

            // Contour Analysis
            GraphFramework.registerNodeType("Vision/Contour Analysis/F_VN_ContourCenterOfMass", Node_F_VN_ContourCenterOfMass);
            GraphFramework.registerNodeType("Vision/Contour Analysis/F_VN_FitEllipse", Node_F_VN_FitEllipse);
            GraphFramework.registerNodeType("Vision/Contour Analysis/F_VN_FitLine", Node_F_VN_FitLine);
            GraphFramework.registerNodeType("Vision/Contour Analysis/F_VN_MatchContours1vsN", Node_F_VN_MatchContours1vsN);

            // Drawing
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawContours", Node_F_VN_DrawContours);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawLine", Node_F_VN_DrawLine);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawEllipse", Node_F_VN_DrawEllipse);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawPoint", Node_F_VN_DrawPoint);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawPoints", Node_F_VN_DrawPoints);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawPointsExp", Node_F_VN_DrawPointsExp);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawRectangle", Node_F_VN_DrawRectangle);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_DrawRectangle_TcVnRectangle_UDINT", Node_F_VN_DrawRectangle_TcVnRectangle_UDINT);
            GraphFramework.registerNodeType("Vision/Drawing/F_VN_PutLabel", Node_F_VN_PutLabel);

            // Geometric and Coordinate Transformations
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ApplyRotationToAffineTransformation", Node_F_VN_ApplyRotationToAffineTransformation);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ApplyRotationToAffineTransformationExp", Node_F_VN_ApplyRotationToAffineTransformationExp);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ApplyScalingToAffineTransformation", Node_F_VN_ApplyScalingToAffineTransformation);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ApplyScalingToAffineTransformationExp", Node_F_VN_ApplyScalingToAffineTransformationExp);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ApplyTranslationToAffineTransformation", Node_F_VN_ApplyTranslationToAffineTransformation);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ApplyYAxisInversionToAffineTransformation", Node_F_VN_ApplyYAxisInversionToAffineTransformation);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_FlipImage", Node_F_VN_FlipImage);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_GenerateAffineTransformationUnitMatrix2D", Node_F_VN_GenerateAffineTransformationUnitMatrix2D);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_PyramidDown", Node_F_VN_PyramidDown);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_PyramidUp", Node_F_VN_PyramidUp);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_ResizeImage", Node_F_VN_ResizeImage);
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/F_VN_WarpAffine", Node_F_VN_WarpAffine);
            
            // Image Segmentation
            GraphFramework.registerNodeType("Vision/Image Segmentation/F_VN_AdaptiveThreshold", Node_F_VN_AdaptiveThreshold);
            GraphFramework.registerNodeType("Vision/Image Segmentation/F_VN_CheckColorRange", Node_F_VN_CheckColorRange);
            GraphFramework.registerNodeType("Vision/Image Segmentation/F_VN_Threshold", Node_F_VN_Threshold);

            // Image Filtering
            GraphFramework.registerNodeType("Vision/Image Filtering/F_VN_FillHoles", Node_F_VN_FillHoles);
            GraphFramework.registerNodeType("Vision/Image Filtering/F_VN_GaussianFilter", Node_F_VN_GaussianFilter);
            GraphFramework.registerNodeType("Vision/Image Filtering/F_VN_LaplacianFilter", Node_F_VN_LaplacianFilter);
            GraphFramework.registerNodeType("Vision/Image Filtering/F_VN_LocalMaxima", Node_F_VN_LocalMaxima);
            GraphFramework.registerNodeType("Vision/Image Filtering/F_VN_LocalMinima", Node_F_VN_LocalMinima);
            GraphFramework.registerNodeType("Vision/Image Filtering/F_VN_MedianFilter", Node_F_VN_MedianFilter);

            // Image Colour and Contrast Processing
            GraphFramework.registerNodeType("Vision/Image Colour and Contrast Processing/F_VN_ConvertColorSpace", Node_F_VN_ConvertColorSpace);
            GraphFramework.registerNodeType("Vision/Image Colour and Contrast Processing/F_VN_InvertImageColor", Node_F_VN_InvertImageColor);
            GraphFramework.registerNodeType("Vision/Image Colour and Contrast Processing/F_VN_GenerateColorMap", Node_F_VN_GenerateColorMap);
            GraphFramework.registerNodeType("Vision/Image Colour and Contrast Processing/F_VN_ApplyColorMap", Node_F_VN_ApplyColorMap);
            GraphFramework.registerNodeType("Vision/Image Colour and Contrast Processing/F_VN_NormalizeImage", Node_F_VN_NormalizeImage);

            // Image Analysis - Object Detection
            GraphFramework.registerNodeType("Vision/Image Analysis/F_VN_CountNonZeroPixels", Node_F_VN_CountNonZeroPixels);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_DetectBlobs", Node_F_VN_DetectBlobs);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_FindContours", Node_F_VN_FindContours);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_FindContoursExp", Node_F_VN_FindContoursExp);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_MatchTemplate", Node_F_VN_MatchTemplate);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_MatchTemplateExp", Node_F_VN_MatchTemplateExp);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_MatchTemplateAndEvaluate", Node_F_VN_MatchTemplateAndEvaluate);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/F_VN_MatchTemplateAndEvaluateExp", Node_F_VN_MatchTemplateAndEvaluateExp);
            GraphFramework.registerNodeType("Vision/Image Analysis/Object Detection/TcVnParamsBlobDetection", Node_TcVnParamsBlobDetection);

            // Measurement
            GraphFramework.registerNodeType("Vision/Measurement/F_VN_LocateEdge", Node_F_VN_LocateEdge);
            GraphFramework.registerNodeType("Vision/Measurement/F_VN_LocateEdgeExp", Node_F_VN_LocateEdgeExp);

        }
    }
})();


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var TvgNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

            // Checks
            GraphFramework.registerNodeType("Vision/Checks/TVG_ImageCompare", Node_TVG_ImageCompare);

            // HMI
            GraphFramework.registerNodeType("Vision/HMI/TVG_ViewITcVnImage", Node_TVG_ViewITcVnImage);
            GraphFramework.registerNodeType("Vision/HMI/TVG_DragDropLocalTcVnImage", Node_TVG_DragDropLocalTcVnImage);
            GraphFramework.registerNodeType("Vision/HMI/TVG_LoadImage", Node_TVG_LoadImage);

            // Code Reading
            GraphFramework.registerNodeType("Vision/Code Reading/TVG_ReadQRCode", Node_TVG_ReadQRCode);

            // Geometric and Coordinate Transformations   
            GraphFramework.registerNodeType("Vision/Geometric and Coordinate Transformations/TVG_Rotate", Node_TVG_Rotate);

            // Image Analysis - Object Detection
            GraphFramework.registerNodeType('Vision/Image Analysis/TVG_GoldenTemplate', Node_TVG_GoldenTemplate);

        }
    }
})();


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function NodeProtectionAbility(node) {

    node.addProperty('protection', true, 'boolean');
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function NodeTriggerAbility(node) {

    node.addInput("trigger", LiteGraph.ACTION);
    node.addOutput("result", LiteGraph.EVENT);
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVn2dCodeSearchStrategy = [
    "TCVN_CSS_DEFAULT",
    "TCVN_CSS_ONLY_NOT_INVERTED",
    "TCVN_CSS_FIRST_NOT_INVERTED",
    "TCVN_CSS_ONLY_INVERTED",
    "TCVN_CSS_FIRST_INVERTED",
    "TCVN_CSS_ONLY_NOT_FLIPPED",
    "TCVN_CSS_FIRST_NOT_FLIPPED",
    "TCVN_CSS_ONLY_FLIPPED",
    "TCVN_CSS_FIRST_FLIPPED"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnBlobCombination = [
    "TCVN_BC_SMALLEST",
    "TCVN_BC_LARGEST",
    "TCVN_BC_MIN_THRESHOLD",
    "TCVN_BC_MAX_THRESHOLD",
    "TCVN_BC_MEDIAN_THRESHOLD"
];


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnColorMap = [
    "TCVN_CM_AUTUMN",
    "TCVN_CM_BONE",
    "TCVN_CM_JET",
    "TCVN_CM_WINTER",
    "TCVN_CM_RAINBOW",
    "TCVN_CM_OCEAN",
    "TCVN_CM_SUMMER",
    "TCVN_CM_SPRING",
    "TCVN_CM_COOL",
    "TCVN_CM_HSV",
    "TCVN_CM_HOT"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnColorMapSize = [
    "TCVN_CMS_256",
    "TCVN_CMS_65536"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnColorSpaceTransform = [
    "TCVN_CST_BGR_TO_BGRA",
    "TCVN_CST_RGB_TO_RGBA",
    "TCVN_CST_BGRA_TO_BGR",
    "TCVN_CST_RGBA_TO_RGB",
    "TCVN_CST_BGR_TO_RGBA",
    "TCVN_CST_RGB_TO_BGRA",
    "TCVN_CST_BGRA_TO_RGB",
    "TCVN_CST_RGBA_TO_BGR",
    "TCVN_CST_BGR_TO_RGB",
    "TCVN_CST_RGB_TO_BGR",
    "TCVN_CST_BGRA_TO_RGBA",
    "TCVN_CST_RGBA_TO_BGRA",
    "TCVN_CST_BGR_TO_GRAY",
    "TCVN_CST_RGB_TO_GRAY",
    "TCVN_CST_GRAY_TO_BGR",
    "TCVN_CST_GRAY_TO_RGB",
    "TCVN_CST_GRAY_TO_BGRA",
    "TCVN_CST_GRAY_TO_RGBA",
    "TCVN_CST_BGRA_TO_GRAY",
    "TCVN_CST_RGBA_TO_GRAY",
    "TCVN_CST_RGB_TO_BGR_565",
    "TCVN_CST_BGR_TO_BGR_565",
    "TCVN_CST_BGR_565_TO_RGB",
    "TCVN_CST_BGR_565_TO_BGR",
    "TCVN_CST_RGBA_TO_BGR_565",
    "TCVN_CST_BGRA_TO_BGR_565",
    "TCVN_CST_BGR_565_TO_RGBA",
    "TCVN_CST_BGR_565_TO_BGRA",
    "TCVN_CST_GRAY_TO_BGR_565",
    "TCVN_CST_BGR_565_TO_GRAY",
    "TCVN_CST_RGB_TO_BGR_555",
    "TCVN_CST_BGR_TO_BGR_555",
    "TCVN_CST_BGR_555_TO_RGB",
    "TCVN_CST_BGR_555_TO_BGR",
    "TCVN_CST_RGBA_TO_BGR_555",
    "TCVN_CST_BGRA_TO_BGR_555",
    "TCVN_CST_BGR_555_TO_RGBA",
    "TCVN_CST_BGR_555_TO_BGRA",
    "TCVN_CST_GRAY_TO_BGR_555",
    "TCVN_CST_BGR_555_TO_GRAY",
    "TCVN_CST_BGR_TO_XYZ",
    "TCVN_CST_RGB_TO_XYZ",
    "TCVN_CST_XYZ_TO_BGR",
    "TCVN_CST_XYZ_TO_RGB",
    "TCVN_CST_BGR_TO_YCRCB",
    "TCVN_CST_RGB_TO_YCRCB",
    "TCVN_CST_YCRCB_TO_BGR",
    "TCVN_CST_YCRCB_TO_RGB",
    "TCVN_CST_BGR_TO_HSV",
    "TCVN_CST_RGB_TO_HSV",
    "TCVN_CST_BGR_TO_LAB",
    "TCVN_CST_RGB_TO_LAB",
    "TCVN_CST_BAYER_RG_TO_BGR",
    "TCVN_CST_BAYER_BG_TO_RGB",
    "TCVN_CST_BAYER_GR_TO_BGR",
    "TCVN_CST_BAYER_GB_TO_RGB",
    "TCVN_CST_BAYER_BG_TO_BGR",
    "TCVN_CST_BAYER_RG_TO_RGB",
    "TCVN_CST_BAYER_GB_TO_BGR",
    "TCVN_CST_BAYER_GR_TO_RGB",
    "TCVN_CST_BGR_TO_LUV",
    "TCVN_CST_RGB_TO_LUV",
    "TCVN_CST_BGR_TO_HLS",
    "TCVN_CST_RGB_TO_HLS",
    "TCVN_CST_HSV_TO_BGR",
    "TCVN_CST_HSV_TO_RGB",
    "TCVN_CST_LAB_TO_BGR",
    "TCVN_CST_LAB_TO_RGB",
    "TCVN_CST_LUV_TO_BGR",
    "TCVN_CST_LUV_TO_RGB",
    "TCVN_CST_HLS_TO_BGR",
    "TCVN_CST_HLS_TO_RGB",
    "TCVN_CST_BAYER_RG_TO_BGR_VNG",
    "TCVN_CST_BAYER_GR_TO_BGR_VNG",
    "TCVN_CST_BAYER_BG_TO_BGR_VNG",
    "TCVN_CST_BAYER_GB_TO_BGR_VNG",
    "TCVN_CST_BAYER_RG_TO_RGB_VNG",
    "TCVN_CST_BAYER_GR_TO_RGB_VNG",
    "TCVN_CST_BAYER_BG_TO_RGB_VNG",
    "TCVN_CST_BAYER_GB_TO_RGB_VNG",
    "TCVN_CST_BGR_TO_HSV_FULL",
    "TCVN_CST_RGB_TO_HSV_FULL",
    "TCVN_CST_BGR_TO_HLS_FULL",
    "TCVN_CST_RGB_TO_HLS_FULL",
    "TCVN_CST_HSV_TO_BGR_FULL",
    "TCVN_CST_HSV_TO_RGB_FULL",
    "TCVN_CST_HLS_TO_BGR_FULL",
    "TCVN_CST_HLS_TO_RGB_FULL",
    "TCVN_CST_LBGR_TO_LAB",
    "TCVN_CST_LRGB_TO_LAB",
    "TCVN_CST_LBGR_TO_LUV",
    "TCVN_CST_LRGB_TO_LUV",
    "TCVN_CST_LAB_TO_LBGR",
    "TCVN_CST_LAB_TO_LRGB",
    "TCVN_CST_LUV_TO_LBGR",
    "TCVN_CST_LUV_TO_LRGB",
    "TCVN_CST_BGR_TO_YUV",
    "TCVN_CST_RGB_TO_YUV",
    "TCVN_CST_YUV_TO_BGR",
    "TCVN_CST_YUV_TO_RGB",
    "TCVN_CST_BAYER_RG_TO_GRAY",
    "TCVN_CST_BAYER_GR_TO_GRAY",
    "TCVN_CST_BAYER_BG_TO_GRAY",
    "TCVN_CST_BAYER_GB_TO_GRAY",
    "TCVN_CST_YUV_420_NV12_TO_RGB",
    "TCVN_CST_YUV_420_NV12_TO_BGR",
    "TCVN_CST_YUV_420_NV21_TO_RGB",
    "TCVN_CST_YUV_420_NV21_TO_BGR",
    "TCVN_CST_YUV_420_SP_TO_RGB",
    "TCVN_CST_YUV_420_SP_TO_BGR",
    "TCVN_CST_YUV_420_NV12_TO_RGBA",
    "TCVN_CST_YUV_420_NV12_TO_BGRA",
    "TCVN_CST_YUV_420_NV21_TO_RGBA",
    "TCVN_CST_YUV_420_NV21_TO_BGRA",
    "TCVN_CST_YUV_420_SP_TO_RGBA",
    "TCVN_CST_YUV_420_SP_TO_BGRA",
    "TCVN_CST_YUV_420_YV12_TO_RGB",
    "TCVN_CST_YUV_420_YV12_TO_BGR",
    "TCVN_CST_YUV_420_IYUV_TO_RGB",
    "TCVN_CST_YUV_420_IYUV_TO_BGR",
    "TCVN_CST_YUV_420_I420_TO_RGB",
    "TCVN_CST_YUV_420_I420_TO_BGR",
    "TCVN_CST_YUV_420_P_TO_RGB",
    "TCVN_CST_YUV_420_P_TO_BGR",
    "TCVN_CST_YUV_420_YV12_TO_RGBA",
    "TCVN_CST_YUV_420_YV12_TO_BGRA",
    "TCVN_CST_YUV_420_IYUV_TO_RGBA",
    "TCVN_CST_YUV_420_IYUV_TO_BGRA",
    "TCVN_CST_YUV_420_I420_TO_RGBA",
    "TCVN_CST_YUV_420_I420_TO_BGRA",
    "TCVN_CST_YUV_420_P_TO_RGBA",
    "TCVN_CST_YUV_420_P_TO_BGRA",
    "TCVN_CST_YUV_420_TO_GRAY",
    "TCVN_CST_YUV_420_NV21_TO_GRAY",
    "TCVN_CST_YUV_420_NV12_TO_GRAY",
    "TCVN_CST_YUV_420_YV12_TO_GRAY",
    "TCVN_CST_YUV_420_IYUV_TO_GRAY",
    "TCVN_CST_YUV_420_I420_TO_GRAY",
    "TCVN_CST_YUV_420_SP_TO_GRAY",
    "TCVN_CST_YUV_420_P_TO_GRAY",
    "TCVN_CST_YUV_422_UYVY_TO_RGB",
    "TCVN_CST_YUV_422_UYVY_TO_BGR",
    "TCVN_CST_YUV_422_Y422_TO_RGB",
    "TCVN_CST_YUV_422_Y422_TO_BGR",
    "TCVN_CST_YUV_422_UYNV_TO_RGB",
    "TCVN_CST_YUV_422_UYNV_TO_BGR",
    "TCVN_CST_YUV_422_UYVY_TO_RGBA",
    "TCVN_CST_YUV_422_UYVY_TO_BGRA",
    "TCVN_CST_YUV_422_Y422_TO_RGBA",
    "TCVN_CST_YUV_422_Y422_TO_BGRA",
    "TCVN_CST_YUV_422_UYNV_TO_RGBA",
    "TCVN_CST_YUV_422_UYNV_TO_BGRA",
    "TCVN_CST_YUV_422_YUY2_TO_RGB",
    "TCVN_CST_YUV_422_YUY2_TO_BGR",
    "TCVN_CST_YUV_422_YVYU_TO_RGB",
    "TCVN_CST_YUV_422_YVYU_TO_BGR",
    "TCVN_CST_YUV_422_YUYV_TO_RGB",
    "TCVN_CST_YUV_422_YUYV_TO_BGR",
    "TCVN_CST_YUV_422_YUNV_TO_RGB",
    "TCVN_CST_YUV_422_YUNV_TO_BGR",
    "TCVN_CST_YUV_422_YUY2_TO_RGBA",
    "TCVN_CST_YUV_422_YUY2_TO_BGRA",
    "TCVN_CST_YUV_422_YVYU_TO_RGBA",
    "TCVN_CST_YUV_422_YVYU_TO_BGRA",
    "TCVN_CST_YUV_422_YUYV_TO_RGBA",
    "TCVN_CST_YUV_422_YUYV_TO_BGRA",
    "TCVN_CST_YUV_422_YUNV_TO_RGBA",
    "TCVN_CST_YUV_422_YUNV_TO_BGRA",
    "TCVN_CST_YUV_422_UYVY_TO_GRAY",
    "TCVN_CST_YUV_422_YUY2_TO_GRAY",
    "TCVN_CST_YUV_422_Y422_TO_GRAY",
    "TCVN_CST_YUV_422_UYNV_TO_GRAY",
    "TCVN_CST_YUV_422_YVYU_TO_GRAY",
    "TCVN_CST_YUV_422_YUYV_TO_GRAY",
    "TCVN_CST_YUV_422_YUNV_TO_GRAY",
    "TCVN_CST_RGBA_TO_PREMULTIPLICATED_RGBA",
    "TCVN_CST_PREMULTIPLICATED_RGBA_TO_RGBA",
    "TCVN_CST_RGB_TO_YUV_420_I420",
    "TCVN_CST_BGR_TO_YUV_420_I420",
    "TCVN_CST_RGB_TO_YUV_420_IYUV",
    "TCVN_CST_BGR_TO_YUV_420_IYUV",
    "TCVN_CST_RGBA_TO_YUV_420_I420",
    "TCVN_CST_BGRA_TO_YUV_420_I420",
    "TCVN_CST_RGBA_TO_YUV_420_IYUV",
    "TCVN_CST_BGRA_TO_YUV_420_IYUV",
    "TCVN_CST_RGB_TO_YUV_420_YV12",
    "TCVN_CST_BGR_TO_YUV_420_YV12",
    "TCVN_CST_RGBA_TO_YUV_420_YV12",
    "TCVN_CST_BGRA_TO_YUV_420_YV12",
    "TCVN_CST_BAYER_RG_TO_BGR_EA",
    "TCVN_CST_BAYER_GR_TO_BGR_EA",
    "TCVN_CST_BAYER_BG_TO_BGR_EA",
    "TCVN_CST_BAYER_GB_TO_BGR_EA",
    "TCVN_CST_BAYER_RG_TO_RGB_EA",
    "TCVN_CST_BAYER_GR_TO_RGB_EA",
    "TCVN_CST_BAYER_BG_TO_RGB_EA",
    "TCVN_CST_BAYER_GB_TO_RGB_EA",
    "TCVN_CST_BAYER_RG_TO_BGRA",
    "TCVN_CST_BAYER_GR_TO_BGRA",
    "TCVN_CST_BAYER_BG_TO_BGRA",
    "TCVN_CST_BAYER_GB_TO_BGRA",
    "TCVN_CST_BAYER_RG_TO_RGBA",
    "TCVN_CST_BAYER_GR_TO_RGBA",
    "TCVN_CST_BAYER_BG_TO_RGBA",
    "TCVN_CST_BAYER_GB_TO_RGBA",
    "TCVN_CST_MAX"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnContourApproximationMethod = [
    "TCVN_CAM_NONE",
    "TCVN_CAM_SIMPLE",
    "TCVN_CAM_TC89_L1",
    "TCVN_CAM_TC89_KCOS"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnContourRetrievalMode = [
    "TCVN_CRM_EXTERNAL",
    "TCVN_CRM_LIST",
    "TCVN_CRM_CONNECTED_COMPONENTS",
    "TCVN_CRM_TREE",
    "TCVN_CRM_FLOODFILL"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnContoursMatchComparisonMethod = [
    "TCVN_CMCM_CONTOURS_MATCH_I1",
    "TCVN_CMCM_CONTOURS_MATCH_I2",
    "TCVN_CMCM_CONTOURS_MATCH_I3"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnDrawShape = [
    "TCVN_DS_RANDOM",
    "TCVN_DS_CIRCLE",
    "TCVN_DS_SQUARE",
    "TCVN_DS_PLUS",
    "TCVN_DS_X",
    "TCVN_DS_DIAMOND",
    "TCVN_DS_MAX"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnEdgeDetectionAlgorithm = [
    "TCVN_EDA_INTERPOLATION",
    "TCVN_EDA_APPROX_ERF",
    "TCVN_EDA_APPROX_GAUSSIAN"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnEdgeDirection = [
    "TCVN_ED_DARK_TO_LIGHT",
    "TCVN_ED_LIGHT_TO_DARK"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnElementType = [
    "TCVN_ET_SAME_AS_SOURCE",
    "TCVN_ET_USINT",
    "TCVN_ET_SINT",
    "TCVN_ET_UINT",
    "TCVN_ET_INT",
    "TCVN_ET_DINT",
    "TCVN_ET_REAL",
    "TCVN_ET_LREAL"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnFlipAxis = [
    "TCVN_FA_X",
    "TCVN_FA_Y",
    "TCVN_FA_XY"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnInterpolationType = [
    "TCVN_IT_NEAREST_NEIGHBOR",
    "TCVN_IT_BILINEAR",
    "TCVN_IT_BICUBIC",
    "TCVN_IT_AREA_BASED",
    "TCVN_IT_LANCZOS4"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnLineType = [
    "TCVN_LT_4_CONNECTED",
    "TCVN_LT_8_CONNECTED",
    "TCVN_LT_ANTIALIASED"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnTemplateMatchMethod = [
    "TCVN_TMM_SQDIFF",
    "TCVN_TMM_SQDIFF_NORMED",
    "TCVN_TMM_CCORR",
    "TCVN_TMM_CCORR_NORMED",
    "TCVN_TMM_CCOEFF",
    "TCVN_TMM_CCOEFF_NORMED"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

ETcVnThresholdType = [
    "TCVN_TT_BINARY",
    "TCVN_TT_BINARY_INV",
    "TCVN_TT_TRUNC",
    "TCVN_TT_TOZERO",
    "TCVN_TT_TOZERO_INV",
    "TCVN_TT_OTSU_BINARY",
    "TCVN_TT_OTSU_BINARY_INV",
    "TCVN_TT_OTSU_TRUNC",
    "TCVN_TT_OTSU_TOZERO",
    "TCVN_TT_OTSU_TOZERO_INV",
    "TCVN_TT_TRIANGLE_BINARY",
    "TCVN_TT_TRIANGLE_BINARY_INV",
    "TCVN_TT_TRIANGLE_TRUNC",
    "TCVN_TT_TRIANGLE_TOZERO",
    "TCVN_TT_TRIANGLE_TOZERO_INV"
];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

LGraphCanvas.prototype.showColorPickerDialog = function (node, property, options) {

        if (!node || node.properties[property] === undefined) {
            return;
        }

        options = options || {};
        var that = this;
        var info = node.getPropertyInfo(property);
		var type = info.type;

        var input_html = "";

        if (type != "color") {
            console.warn("incorrect property type given to .showColorPicker: " + type);
            return;
        }

        var dialog = this.createDialog(
            "<canvas class='color-palette' width='284' height='155'></canvas>",
            options
        );

        dialog.addEventListener("mouseleave", function (e) {
            dialog.close();
        });

        var colorPicker = createColorPicker('canvas.color-palette', setValue);

        function createColorPicker(canvasSelector, onSelectedColor) {

            var selectedColor = "";
            var imageData = {};

            var colorPalette = $(canvasSelector);
            var colorctx = colorPalette[0].getContext('2d');

            var colorGradient = colorctx.createLinearGradient(0, 0, colorPalette.width(), 0);
            colorGradient.addColorStop(0, "rgb(255,0,0)");
            colorGradient.addColorStop(0.15, "rgb(255,0,255)");
            colorGradient.addColorStop(0.33, "rgb(0,0,255)");
            colorGradient.addColorStop(0.49, "rgb(0,255,255)");
            colorGradient.addColorStop(0.67, "rgb(0,255,0)");
            colorGradient.addColorStop(0.84, "rgb(255,255,0)");
            colorGradient.addColorStop(1, "rgb(255,0,0)");
            colorctx.fillStyle = colorGradient;
            colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height);

            var semiTransparentGradient = colorctx.createLinearGradient(0, 0, 0, colorPalette.height());
            semiTransparentGradient.addColorStop(0, "rgba(255,255,255,1)");
            semiTransparentGradient.addColorStop(0.5, "rgba(255,255,255,0)");
            semiTransparentGradient.addColorStop(0.5, "rgba(0,0,0,0)");
            semiTransparentGradient.addColorStop(1, "rgba(0,0,0,1)");
            colorctx.fillStyle = semiTransparentGradient;
            colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height);

            colorPalette.mousedown(function (e) {

                colorEventX = e.pageX - colorPalette.offset().left;
                colorEventY = e.pageY - colorPalette.offset().top;

                $(document).mousemove(function (e) {
                    colorEventX = e.pageX - colorPalette.offset().left;
                    colorEventY = e.pageY - colorPalette.offset().top;
                });

                colorTimer = setInterval(getColor, 50);

                colorPalette.mouseleave(function (e) {
                    clearInterval(colorTimer);
                    $(document).unbind('mousemove');
                })

                colorPalette.mouseup(function (e) {
                    clearInterval(colorTimer);

                    if (onSelectedColor) {
                        onSelectedColor(selectedColor);
                    }

                    $(document).unbind('mousemove');
                })

            })

            getColor = function (e) {

                imageData = colorctx.getImageData(colorEventX, colorEventY, 1, 1);

                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                }

                selectedColor = rgbToHex(imageData.data[0],imageData.data[1],imageData.data[2]);


            };

            return colorPalette;

        }

        function setValue(value) {

            node.setProperty(property, value);

            if (node.graph) {
                node.graph._version++;
            }

            if (node.onPropertyChanged) {
                node.onPropertyChanged(property, value);
            }

            dialog.close();

            node.setDirtyCanvas(true, true);
        }

		return dialog;
    };

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

addPropertyWithColorPickerWidget = function (node, title, propertyName, initialValue) {

    var colorPickWidget = {};

    if (initialValue === undefined) {
        initialValue = "#000000";
    }

    if (title === undefined) {
        title = "Color";
    }

    node.addProperty(propertyName, initialValue, 'color');

    colorPickWidget = node.addWidget(
        "color",
        title,
        initialValue,
        function (v) { },
        {
            property: propertyName
        }
    );

    colorPickWidget.mouse = function (event, position, node) {

        if (event.type == "mousedown") {
            node.graph.list_of_graphcanvas[0].showColorPickerDialog(node, propertyName, { event: event });
        }
    };

    colorPickWidget.draw = function (ctx, node, widget_width, y, H) {

        var width = node.size[0];
        var posY = y;
        var show_text = true;

        ctx.globalAlpha = this.editor_alpha;
        var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
        var background_color = LiteGraph.WIDGET_BGCOLOR;
        var text_color = LiteGraph.WIDGET_TEXT_COLOR;
        var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
        var margin = 15;


        if (colorPickWidget.disabled)
           ctx.globalAlpha *= 0.5;

        ctx.textAlign = "left";
        ctx.strokeStyle = outline_color;
        ctx.fillStyle = background_color;
        ctx.beginPath();
        if (show_text)
            ctx.roundRect(margin, posY, widget_width - margin * 2, H, H * 0.5);
        else
            ctx.rect( margin, posY, widget_width - margin * 2, H );
            ctx.fill();
        if (show_text) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(margin, posY, widget_width - margin * 2, H);
            ctx.clip();

            ctx.stroke();
            ctx.fillStyle = secondary_text_color;
            if (colorPickWidget.name != null) {
                ctx.fillText(colorPickWidget.name, margin * 2, y + H * 0.7);
            }
            ctx.fillStyle = text_color;
            ctx.textAlign = "right";
            ctx.fillText(String(colorPickWidget.value).substr(0, 30), (widget_width - margin * 2) - H, y + H * 0.7); //30 chars max
            ctx.restore();
        }
        ctx.fillStyle = colorPickWidget.value;
        ctx.fillRect((widget_width - margin * 2) - 10, posY+3, H-6, H-6);

    }

    return colorPickWidget
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function NodeBase(node) {

    NodeProtectionAbility(node);
    NodeTriggerAbility(node);
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TestFinished() {

    NodeBase(this);

    this.title = "TestFinished";

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TestStart() {

    NodeBase(this);

    this.title = "TestStart";

    this.addPropertyWithStringWidget("STRING", "TestName");
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function VisionNodeBase(node) {

    NodeBase(node);

    //...

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_BoolDisplay() {

    NodeBase(this);

    this.title = "BoolDisplay";

    this.addInput("BoolDisplay", "BOOL");

}

Node_BoolDisplay.prototype.onDrawForeground = function (ctx) {

    if (!this.flags.collapsed) {

        if (this.displayContent) {
            ctx.font = "24px Arial";
            ctx.textAlign = "end";
            ctx.fillStyle = (this.displayContent.data) ? "#7FFF7F" : "#FF7F7F";
            ctx.fillText(this.displayContent.data, this.size[0] - 15, this.size[1] - 15);
        }
    }
};

Node_BoolDisplay.prototype.onComputeSize = function (size) {

    let maxText = 'false';
    let textWidth = getTextWidth(maxText, this.contentFont) + 30;
    size[0] = Math.max(textWidth, 170);
    size[1] = 90;

    function getTextWidth(text, font) {
        let context = this.canvas.ctx;
        context.font = font;
        let metrics = context.measureText(text);

        return metrics.width;
    }

    return size;
};

Node_BoolDisplay.prototype.onStatusUpdate = function (status) {

    var content = status.content;

    if (typeof content == 'undefined' && !content) {
        return;
    }

    this.displayContent = content.find(element => element.name === 'BoolDisplay');

    this.setDirtyCanvas(true, false);
};
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_DintDisplay() {

    NodeBase(this);

    this.title = "DintDisplay";
    this.contentFont = "24px Arial";
    this.addInput("DintDisplay", "DINT");
}

Node_DintDisplay.prototype.onDrawForeground = function (ctx) {
    if (!this.flags.collapsed) {
        if (this.displayContent) {
            ctx.font = this.contentFont;
            ctx.textAlign = "end";
            ctx.fillStyle = "#7FFF7F"; // green
            ctx.fillText(this.displayContent.data, this.size[0] - 15, this.size[1] - 15);
        }
    }
};

Node_DintDisplay.prototype.onComputeSize = function (size) {

    let maxText = '-2147483648';
    let textWidth = getTextWidth(maxText, this.contentFont) + 30;
    size[0] = Math.max(textWidth, 170);
    size[1] = 90;

    function getTextWidth(text, font) {
        let context = this.canvas.ctx;
        context.font = font;
        let metrics = context.measureText(text);

        return metrics.width;
    }

    return size;
};

Node_DintDisplay.prototype.onStatusUpdate = function (status) {

    var content = status.content;

    if (typeof content == 'undefined' && !content) {
        return;
    }

    this.displayContent = content.find(element => element.name === 'DintDisplay');

    this.setDirtyCanvas(true, false);

};

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_StringDisplay() {

    NodeBase(this);

    this.title = "StringDisplay";

    this.addInput("StringDisplay", "STRING");

}

Node_StringDisplay.prototype.onDrawForeground = function (ctx) {

    if (!this.flags.collapsed) {

        if (this.displayContent) {
            ctx.font = "24px Arial";
            ctx.textAlign = "end";
            ctx.fillStyle = "#7FFF7F"; // green
            ctx.fillText(this.displayContent.data, this.size[0] - 15, this.size[1] - 15);
        }
    }
};

Node_StringDisplay.prototype.onComputeSize = function (size) {

    //TODO

    //let maxText = '4294967295';
    //let textWidth = getTextWidth(maxText, this.contentFont) + 30;
    //size[0] = Math.max(textWidth, 170);
    size[1] = 90;

    function getTextWidth(text, font) {
        let context = this.canvas.ctx;
        context.font = font;
        let metrics = context.measureText(text);

        return metrics.width;
    }

    return size;
};

Node_StringDisplay.prototype.onStatusUpdate = function (status) {

    var content = status.content;

    if (typeof content == 'undefined' && !content) {
        return;
    }

    this.displayContent = content.find(element => element.name === 'StringDisplay');

    this.setDirtyCanvas(true, false);
};

Node_StringDisplay.size = [180, 70];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_UdintDisplay() {

    NodeBase(this);

    this.title = "UdintDisplay";
    this.contentFont = "24px Arial";
    this.addInput("UdintDisplay", "UDINT");
}

Node_UdintDisplay.prototype.onDrawForeground = function (ctx) {
    if (!this.flags.collapsed) {
        if (this.displayContent) {
            ctx.font = this.contentFont;
            ctx.textAlign = "end";
            ctx.fillStyle = "#7FFF7F"; // green
            ctx.fillText(this.displayContent.data, this.size[0] - 15, this.size[1] - 15);
        }
    }
};

Node_UdintDisplay.prototype.onComputeSize = function (size) {

    let maxText = '4294967295';
    let textWidth = getTextWidth(maxText, this.contentFont) + 30;
    size[0] = Math.max(textWidth, 170);
    size[1] = 90;

    function getTextWidth(text, font) {
        let context = this.canvas.ctx;
        context.font = font;
        let metrics = context.measureText(text);

        return metrics.width;
    }

    return size;
};

Node_UdintDisplay.prototype.onStatusUpdate = function (status) {

    var content = status.content;

    if (typeof content == 'undefined' && !content) {
        return;
    }

    this.displayContent = content.find(element => element.name === 'UdintDisplay');

    this.setDirtyCanvas(true, false);

};

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_UlintDisplay() {

    NodeBase(this);

    this.title = "UlintDisplay";

    this.addInput("UlintDisplay", "ULINT");

}

Node_UlintDisplay.prototype.onDrawForeground = function (ctx) {

    if (!this.flags.collapsed) {

        if (this.displayContent) {
            ctx.font = "24px Arial";
            ctx.textAlign = "end";
            ctx.fillStyle = "#7FFF7F"; // green
            ctx.fillText(this.displayContent.data, this.size[0] - 15, this.size[1] - 15);
        }
    }
};

Node_UlintDisplay.prototype.onComputeSize = function (size) {

    //TODO

    //let maxText = '4294967295';
    //let textWidth = getTextWidth(maxText, this.contentFont) + 30;
    //size[0] = Math.max(textWidth, 170);
    size[1] = 90;

    function getTextWidth(text, font) {
        let context = this.canvas.ctx;
        context.font = font;
        let metrics = context.measureText(text);

        return metrics.width;
    }

    return size;
};

Node_UlintDisplay.prototype.onStatusUpdate = function (status) {

    var content = status.content;

    if (typeof content == 'undefined' && !content) {
        return;
    }

    this.displayContent = content.find(element => element.name === 'UlintDisplay');

    this.setDirtyCanvas(true, false);
};

Node_UlintDisplay.size = [180, 70];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TimerPulse() {

    NodeBase(this);

    this.title = "TimerPulse";

    this.addPropertyWithNumberWidget("Seconds", "Seconds", 1, 1, 60);

    this.addOutput("Q", "BOOL");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AnalogueInput() {

    NodeBase(this);

    this.title = "AnalogueInput";

    this.addOutput("AI", "DINT");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AnalogueOutput() {

    NodeBase(this);

    this.title = "AnalogueOutput";

    this.addInput("AO", "DINT");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_DigitalInput() {

    NodeBase(this);

    this.title = "DigitalInput";

    this.addOutput("DI", "BOOL");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_DigitalOutput() {

    NodeBase(this);

    this.title = "DigitalOutput";

    this.addInput("DO", "BOOL");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_BoolLiteral() {

    NodeBase(this);

    this.title = "BoolLiteral";
 
    this.addPropertyWithToggleWidget("BOOL", "BoolLiteral", false);
    
    this.addOutput("BoolLiteral", "BOOL");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_DintLiteral() {

    NodeBase(this);

    this.title = "DintLiteral";

    this.addPropertyWithNumberWidget("DINT", "DintLiteral", 0, -2147483648, 2147483647, 0, 1);

    this.addOutput("DintLiteral", "DINT");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_StringLiteral() {

    NodeBase(this);

    this.title = "StringLiteral";

    this.addPropertyWithStringWidget("STRING", "StringLiteral");

    this.addOutput("StringLiteral", "STRING");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_UdintLiteral() {

    NodeBase(this);

    this.title = "UdintLiteral";

    this.addPropertyWithNumberWidget("UDINT", "UdintLiteral", 0, 0, 4294967295, 0, 1);

    this.addOutput("UdintLiteral", "UDINT");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_UlintLiteral() {

    NodeBase(this);

    this.title = "UlintLiteral";

    this.addPropertyWithNumberWidget("ULINT", "UlintLiteral", 0, 0, 18446744073709551615, 0, 1);

    this.addOutput("UlintLiteral", "ULINT");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_Concat() {

    NodeBase(this);

    this.title = "Concat";

    this.addInput("Str1", "STRING");
    this.addInput("Str2", "STRING");
    this.addOutput("Concat", "STRING");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_ULINT_TO_STRING() {

    NodeBase(this);

    this.title = "ULINT_TO_STRING";

    this.addInput("In", "ULINT");
    this.addOutput("Out", "STRING");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AssertEqual_DINT() {

    NodeBase(this);

    this.title = "AssertEqual_DINT";

    this.addInput("Actual", "DINT");
    this.addPropertyWithNumberWidget("Expected", "Expected", 0, -2147483648, 2147483647, 0, 1);
    this.addPropertyWithStringWidget("STRING", "Message");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AssertEqual_STRING() {

    NodeBase(this);

    this.title = "AssertEqual_STRING";

    this.addInput("Actual", "STRING");
    this.addPropertyWithStringWidget("Expected", "Expected");
    this.addPropertyWithStringWidget("STRING", "Message");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AssertEqual_UDINT() {

    NodeBase(this);

    this.title = "AssertEqual_UDINT";

    this.addInput("Actual", "UDINT");
    this.addPropertyWithNumberWidget("Expected", "Expected", 0, 0, 4294967295, 0, 1);
    this.addPropertyWithStringWidget("STRING", "Message");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AssertFalse() {

    NodeBase(this);

    this.title = "AssertFalse";

    this.addInput("Condition", "BOOL");
    this.addPropertyWithStringWidget("STRING", "Message");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_AssertTrue() {

    NodeBase(this);

    this.title = "AssertTrue";

    this.addInput("Condition", "BOOL");
    this.addPropertyWithStringWidget("STRING", "Message");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

Node_F_VN_AddImages = function () {

    VisionNodeBase(this);

    this.title = "F_VN_AddImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_BitwiseAndImages() {

    VisionNodeBase(this);

    this.title = "F_VN_BitwiseAndImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_BitwiseNotImage() {

    VisionNodeBase(this);

    this.title = "F_VN_BitwiseNotImage";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_BitwiseOrImages() {

    VisionNodeBase(this);

    this.title = "F_VN_BitwiseOrImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_BitwiseXorImages() {

    VisionNodeBase(this);

    this.title = "F_VN_BitwiseXorImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DivideImages() {

    VisionNodeBase(this);

    this.title = "F_VN_DivideImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MaxImage() {

    VisionNodeBase(this);

    this.title = "F_VN_MaxImage";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MinImage() {

    VisionNodeBase(this);

    this.title = "F_VN_MinImage";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MultiplyImages() {

    VisionNodeBase(this);

    this.title = "F_VN_MultiplyImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_SubtractImages() {

    VisionNodeBase(this);

    this.title = "F_VN_SubtractImages";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ExportContainerSize() {

    VisionNodeBase(this);

    this.title = "F_VN_ExportContainerSize";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nBufferSize", "ULINT");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_DINT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_DINT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "DINT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_INT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_INT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "INT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_ITcVnContainer() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_ITcVnContainer";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "ITcVnContainer");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_LREAL() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_LREAL";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "LREAL");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_REAL() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_REAL";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "REAL");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_SINT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_SINT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "SINT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_UDINT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_UDINT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "UDINT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_UINT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_UINT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "UINT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_ULINT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_ULINT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "ULINT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetAt_USINT() {

    VisionNodeBase(this);

    this.title = "F_VN_GetAt_USINT";

    this.addInput("ipContainer", "ITcVnContainer");
    this.addOutput("nElement", "USINT");

    this.addPropertyWithNumberWidget("nIndex", "nIndex", 0, 0, 1000000, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ConvertElementType() {

    VisionNodeBase(this);

    this.title = "F_VN_ConvertElementType";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("Element Type", "eElementType", ETcVnElementType);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_CopyImage() {

    VisionNodeBase(this);

    this.title = "F_VN_CopyImage";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_CopyIntoDisplayableImage() {

    VisionNodeBase(this);

    this.title = "F_VN_CopyIntoDisplayableImage";

    this.addInput("ipSrcImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetImageChannel() {

    VisionNodeBase(this);

    this.title = "F_VN_GetImageChannel";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("nChannelIndex", "nChannelIndex", 0, 0, 65535, 0, 1);
   

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GetRoi() {

    VisionNodeBase(this);

    this.title = "F_VN_GetRoi";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("stRoi", "TcVnRectangle_UDINT");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ResetRoi() {

    VisionNodeBase(this);

    this.title = "F_VN_ResetRoi";

    this.addInput("ipImage", "ITcVnImage");
    this.addOutput("ipImage", "ITcVnImage");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_SetRoi_TcVnRectangle_UDINT() {

    VisionNodeBase(this);

    this.title = "F_VN_SetRoi_TcVnRectangle_UDINT";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("stRoi", "TcVnRectangle_UDINT");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_SetRoi() {

    VisionNodeBase(this);

    this.title = "F_VN_SetRoi";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("X", "nX", 0, 0, 4294967295, 0, 1);
    this.addPropertyWithNumberWidget("Y", "nY", 0, 0, 4294967295, 0, 1);
    this.addPropertyWithNumberWidget("Width", "nWidth", 1, 1, 4294967295, 0, 1);
    this.addPropertyWithNumberWidget("Height", "nHeight", 1, 1, 4294967295, 0, 1);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ReadDataMatrixCode() {

    VisionNodeBase(this);

    this.title = "F_VN_ReadDataMatrixCode";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDecodedData", "ITcVnContainer");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ReadQRCode() {

    VisionNodeBase(this);

    this.title = "F_VN_ReadQRCode";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDecodedData", "ITcVnContainer");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ReadQRCodeExp() {

    VisionNodeBase(this);

    this.title = "F_VN_ReadQRCodeExp";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDecodedData", "ITcVnContainer");
    this.addOutput("ipContours", "ITcVnContainer");
 
    this.addPropertyWithNumberWidget("nCodeNumber", "nCodeNumber", 1, 1, 1, 0, 1);
    this.addPropertyWithComboboxWidget("eSearchStrategy", "eSearchStrategy", ETcVn2dCodeSearchStrategy);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ContourCenterOfMass() {

    VisionNodeBase(this);

    this.title = "F_VN_ContourCenterOfMass";

    this.addInput("ipContour", "ITcVnContainer");
    this.addOutput("aCenterOfMass", "TcVnPoint2_LREAL");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_FitEllipse() {

    VisionNodeBase(this);

    this.title = "F_VN_FitEllipse";

    this.addInput("ipPointSet", "ITcVnContainer");
    this.addOutput("stEllipse", "TcVnRotatedRectangle");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_FitLine() {

    VisionNodeBase(this);

    this.title = "F_VN_FitLine";

    this.addInput("ipPointSet", "ITcVnContainer");
    this.addOutput("aFitLine", "TcVnVector4_LREAL");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MatchContours1vsN() {

    VisionNodeBase(this);

    this.title = "F_VN_MatchContours1vsN";

    this.addInput("ipRefContour", "ITcVnContainer");
    this.addInput("ipContours", "ITcVnContainer");
    this.addPropertyWithNumberWidget("Dissimilarity Threshold", "fDissimilarityThreshold", 0, 0);
    this.addPropertyWithComboboxWidget("Comparison Method", "eComparisonMethod", ETcVnContoursMatchComparisonMethod, "TCVN_CMCM_CONTOURS_MATCH_I1");
    this.addOutput("ipMatchIndexes", "ITcVnContainer");
    this.addOutput("ipDissimilarities", "ITcVnContainer");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawContours() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawContours";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("ipContours", "ITcVnContainer");
    this.addOutput("ipDestImage", "ITcVnImage");

    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000" );

    this.addPropertyWithNumberWidget("nContourIndex", "nContourIndex", -1, -1, 2147483647, 0, 1);
    this.addPropertyWithNumberWidget("nThickness", "nThickness", 5, -1, 2147483647, 0, 1);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawEllipse() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawEllipse";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("stEllipse", "TcVnRotatedRectangle");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("nThickness", "nThickness", 5, -1, 2147483647, 0, 1);
    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawLine() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawLine";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("nX1", "UDINT");
    this.addInput("nY1", "UDINT");
    this.addInput("nX2", "UDINT");
    this.addInput("nY2", "UDINT");
    this.addOutput("ipDestImage", "ITcVnImage");

    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");
    this.addPropertyWithNumberWidget("nThickness", "nThickness", 5, -1, 2147483647, 0, 1);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawPoint() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawPoint";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("nX", "UDINT");
    this.addInput("nY", "UDINT");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("eShape", "eShape", ETcVnDrawShape);
    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawPoints() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawPoints";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("ipPoints", "ITcVnContainer");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("eShape", "eShape", ETcVnDrawShape);
    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawPointsExp() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawPointsExp";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("ipPoints", "ITcVnContainer");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("eShape", "eShape", ETcVnDrawShape);
    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");
    this.addPropertyWithNumberWidget("nSize", "nSize", 5, 0, 4294967295, 0, 1);
    this.addPropertyWithNumberWidget("nThickness", "nThickness", 5, 0, 2147483647, 0, 1);
    this.addPropertyWithComboboxWidget("eLineType", "eLineType", ETcVnLineType);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawRectangle_TcVnRectangle_UDINT() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawRectangle_TcVnRectangle_UDINT";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("stRectangle", "TcVnRectangle_UDINT");
    this.addOutput("ipDestImage", "ITcVnImage");

    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");
    this.addPropertyWithNumberWidget("nThickness", "nThickness", 5, -1, 2147483647, 0, 1);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DrawRectangle() {

    VisionNodeBase(this);

    this.title = "F_VN_DrawRectangle";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("nTopLeftX", "UDINT");
    this.addInput("nTopLeftY", "UDINT");
    this.addInput("nBottomRightX", "UDINT");
    this.addInput("nBottomRightY", "UDINT");
    this.addOutput("ipDestImage", "ITcVnImage");

    addPropertyWithColorPickerWidget(this, "aColor", "aColor", "#000000");
    this.addPropertyWithNumberWidget("nThickness", "nThickness", 5, -1, 2147483647, 0, 1);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_PutLabel() {

    VisionNodeBase(this);

    this.title = "F_VN_PutLabel";

    this.addInput("ipDestImage", "ITcVnImage");
    this.addInput("sText", "STRING");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("nX", "nX", 10, 0, 4294967295, 0, 1);
    this.addPropertyWithNumberWidget("nY", "nY", 10, 0, 4294967295, 0, 1);
    this.addPropertyWithNumberWidget("fFontScale", "fFontScale", 1, 0, 4294967295);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyRotationToAffineTransformation() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyRotationToAffineTransformation";

    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

    this.addPropertyWithNumberWidget("fAngle", "fAngle", 0, -6.28319, 6.28319);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyRotationToAffineTransformationExp() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyRotationToAffineTransformationExp";

    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

    this.addPropertyWithNumberWidget("fAngle", "fAngle", 0, -6.28319, 6.28319);
    this.addPropertyWithToggleWidget("bUsePreMultiplication", "bUsePreMultiplication", false);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyScalingToAffineTransformation() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyScalingToAffineTransformation";

    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

    this.addPropertyWithNumberWidget("fScaleX", "fScaleX", 1, 0.001, 100);
    this.addPropertyWithNumberWidget("fScaleY", "fScaleY", 1, 0.001, 100);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyScalingToAffineTransformationExp() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyScalingToAffineTransformationExp";

    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

    this.addPropertyWithNumberWidget("fScaleX", "fScaleX", 1, 0.001, 100);
    this.addPropertyWithNumberWidget("fScaleY", "fScaleY", 1, 0.001, 100);
    this.addPropertyWithToggleWidget("bUsePreMultiplication", "bUsePreMultiplication", false);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyTranslationToAffineTransformation() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyTranslationToAffineTransformation";

    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

    this.addPropertyWithNumberWidget("fDeltaX", "fDeltaX", 0, -32768, 32768);
    this.addPropertyWithNumberWidget("fDeltaY", "fDeltaY", 0, -32768, 32768);
  
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyYAxisInversionToAffineTransformation() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyYAxisInversionToAffineTransformation";

    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_FlipImage() {

    VisionNodeBase(this);

    this.title = "F_VN_FlipImage";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("eFlipAxis", "eFlipAxis", ETcVnFlipAxis);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GenerateAffineTransformationUnitMatrix2D() {

    VisionNodeBase(this);

    this.title = "F_VN_GenerateAffineTransformationUnitMatrix2D";

    this.addOutput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_PyramidDown() {

    VisionNodeBase(this);

    this.title = "F_VN_PyramidDown";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_PyramidUp() {

    VisionNodeBase(this);

    this.title = "F_VN_PyramidUp";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ResizeImage() {

    VisionNodeBase(this);

    this.title = "F_VN_ResizeImage";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("nWidth", "nWidth", 1, 1, 1024, 0, 1);
    this.addPropertyWithNumberWidget("nHeight", "nHeight", 1, 1, 1024, 0, 1);
    this.addPropertyWithComboboxWidget("eInterpolationType", "eInterpolationType", ETcVnInterpolationType);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_WarpAffine() {

    VisionNodeBase(this);

    this.title = "F_VN_WarpAffine";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("aTransformationMatrix", "TcVnMatrix2x3_LREAL");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_CountNonZeroPixels() {

    VisionNodeBase(this);

    this.title = "F_VN_CountNonZeroPixels";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("nNonZero", "ULINT");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ApplyColorMap() {

    VisionNodeBase(this);

    this.title = "F_VN_ApplyColorMap";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("ipColorMap", "ITcVnContainer");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_ConvertColorSpace() {

    VisionNodeBase(this);

    this.title = "F_VN_ConvertColorSpace";

    var currentNode = this;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    const foramttedList = ETcVnColorSpaceTransform.map(function (value) {

        return value.replace("TCVN_CST_", "").split('_TO')[0].replace("_", " ");
        
    });

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    this.combo = this.addWidget(
        "combo",
        "From",
        "ANY",
        function (v) { currentNode.ColorSpaceTransformWidget.options.values = ETcVnColorSpaceTransform.filter(function (e) { return e.includes("TCVN_CST_" + v.replace(" ", "_") + '_TO') }) },
        {
            values: foramttedList.filter(onlyUnique)
        }
    );

    this.ColorSpaceTransformWidget = this.addPropertyWithComboboxWidget("eTransform", "eTransform", ETcVnColorSpaceTransform);
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GenerateColorMap() {

    VisionNodeBase(this);

    this.title = "F_VN_GenerateColorMap";

    this.addOutput("ipColorMap", "ITcVnContainer");

    this.addPropertyWithComboboxWidget("eColorMap", "eColorMap", ETcVnColorMap);
    this.addPropertyWithComboboxWidget("eColorMapSize", "eColorMapSize", ETcVnColorMapSize);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_InvertImageColor() {

    VisionNodeBase(this);

    this.title = "F_VN_InvertImageColor";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_NormalizeImage() {

    VisionNodeBase(this);

    this.title = "F_VN_NormalizeImage";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_FillHoles() {

    VisionNodeBase(this);

    this.title = "F_VN_FillHoles";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_GaussianFilter() {

    VisionNodeBase(this);

    this.title = "F_VN_GaussianFilter";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
 
    this.addPropertyWithNumberWidget("nFilterWidth", "nFilterWidth", 3, 1, 999, 0, 2);
    this.addPropertyWithNumberWidget("nFilterHeight", "nFilterHeight", 3, 1, 999, 0, 2);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_LaplacianFilter() {

    VisionNodeBase(this);

    this.title = "F_VN_LaplacianFilter";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("eDestDepth", "eDestDepth", ETcVnElementType);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_LocalMaxima() {

    VisionNodeBase(this);

    this.title = "F_VN_LocalMaxima";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_LocalMinima() {

    VisionNodeBase(this);

    this.title = "F_VN_LocalMinima";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MedianFilter() {

    VisionNodeBase(this);

    this.title = "F_VN_MedianFilter";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("nFilterSize", "nFilterSize", 3, 3, 999, 0, 2);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_AdaptiveThreshold() {

    VisionNodeBase(this);

    this.title = "F_VN_AdaptiveThreshold";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("fMaxValue", "fMaxValue", 255, 0, 255);
   
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_CheckColorRange() {

    VisionNodeBase(this);

    this.title = "F_VN_CheckColorRange";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    addPropertyWithColorPickerWidget(this, "aLowerBounds", "aLowerBounds", "#000000");
    addPropertyWithColorPickerWidget(this, "aUpperBounds", "aUpperBounds", "#FFFFFF");
  
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_Threshold() {

    VisionNodeBase(this);

    this.title = "F_VN_Threshold";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("fThreshold", "fThreshold", 100, 0, 255);
    this.addPropertyWithNumberWidget("fMaxValue", "fMaxValue", 255, 0, 255);
    this.addPropertyWithComboboxWidget("eThresholdType", "eThresholdType", ETcVnThresholdType);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_LocateEdge() {

    VisionNodeBase(this);

    this.title = "F_VN_LocateEdge";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("aStartPoint", "TcVnPoint2_REAL");
    this.addInput("aEndPoint", "TcVnPoint2_REAL");

    this.addOutput("ipEdgePoints", "ITcVnContainer");
    this.addOutput("fAvgStrength", "REAL");

    this.addPropertyWithComboboxWidget("eEdgeDirection", "eEdgeDirection", ETcVnEdgeDirection);
    this.addPropertyWithNumberWidget("fMinStrength", "fMinStrength", 100, 0, 255);
    this.addPropertyWithNumberWidget("nSearchLines", "nSearchLines", 1, 1, 99, 0, 2);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_LocateEdgeExp() {

    VisionNodeBase(this);

    this.title = "F_VN_LocateEdgeExp";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("aStartPoint", "TcVnPoint2_REAL");
    this.addInput("aEndPoint", "TcVnPoint2_REAL");

    this.addOutput("ipEdgePoints", "ITcVnContainer");
    this.addOutput("fAvgStrength", "REAL");

    this.addPropertyWithComboboxWidget("eEdgeDirection", "eEdgeDirection", ETcVnEdgeDirection);
    this.addPropertyWithNumberWidget("fMinStrength", "fMinStrength", 100, 0, 255);
    this.addPropertyWithNumberWidget("nSearchLines", "nSearchLines", 1, 1, 99, 0, 2);
    this.addPropertyWithNumberWidget("nSearchLineDist", "nSearchLineDist", 1, 1, 999, 1, 0.1);
    this.addPropertyWithNumberWidget("nMaxThickness", "nMaxThickness", 1, 1, 999, 0, 1);
    this.addPropertyWithNumberWidget("nSubpixelsIterations", "nSubpixelsIterations", 10, 1, 100, 0, 1);
    this.addPropertyWithNumberWidget("fApproxPrecision", "fApproxPrecision", 0.0001, 0, 1, 4, 0.0001);
    this.addPropertyWithComboboxWidget("eAlgorithm", "eAlgorithm", ETcVnEdgeDetectionAlgorithm);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

Node_TVG_ImageCompare = function () {

    VisionNodeBase(this);

    this.title = "TVG_ImageCompare";

    this.addInput("ipSrcImage1", "ITcVnImage");
    this.addInput("ipSrcImage2", "ITcVnImage");
    this.addOutput("isSame", "BOOL");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TVG_ReadQRCode() {

    VisionNodeBase(this);

    this.title = "TVG_ReadQRCode";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("code", "STRING");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TVG_Rotate() {

    VisionNodeBase(this);

    this.title = "TVG_Rotate";

    var currentNode = this;
    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithNumberWidget("Rotation In Degrees", "RotationInDegrees", 0, -360, 360);
    this.addPropertyWithComboboxWidget("Interpolation Type", "InterpolationType", ETcVnInterpolationType, "TCVN_IT_BILINEAR");

    addPropertyWithColorPickerWidget(this, "Back Fill Color", "BackFillColor", "#000000");

    this.addPropertyWithToggleWidget("Auto Grow", "AutoGrow", true, function (v) {
        currentNode.rotateAboutCenterWidget.disabled = v;
        currentNode.rotateXWidget.disabled = (v ? true : currentNode.properties['RotateAboutCenter']);
        currentNode.rotateYWidget.disabled = (v ? true : currentNode.properties['RotateAboutCenter']);
    });

    this.rotateAboutCenterWidget = this.addPropertyWithToggleWidget("Rotate About Center", "RotateAboutCenter", false, function (v) {
        currentNode.rotateXWidget.disabled = v;
        currentNode.rotateYWidget.disabled = v;
    });
    this.rotateAboutCenterWidget.disabled = true;

    this.rotateXWidget = this.addPropertyWithNumberWidget("Rotation Point X", "RotationPointX", 0, 0, 4095);
    this.rotateXWidget.disabled = true;

    this.rotateYWidget = this.addPropertyWithNumberWidget("Rotation Point Y", "RotationPointY", 0, 0, 4095);
    this.rotateYWidget.disabled = true;

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TVG_DragDropLocalTcVnImage() {

    VisionNodeBase(this);

    this.title = "Image";

    this.addOutput("ITcVnImage", "ITcVnImage");
    this.properties = { image: { filename: "", lastModified: "", url: "", height: 0, width: 0, sizeInBytes: 0, data: "" } };

}

Node_TVG_DragDropLocalTcVnImage.desc = "Image loader";
Node_TVG_DragDropLocalTcVnImage.supported_extensions = ["jpg", "jpeg", "png", "gif", "bmp"];

Node_TVG_DragDropLocalTcVnImage.prototype.onAdded = function () {

    if (this.properties["image"].data) {
        return;
    }

    if (this.properties["image"].url) {
        this.loadImage(this.properties["image"].url);
    }

};

Node_TVG_DragDropLocalTcVnImage.prototype.onDrawBackground = function (ctx) {

    if (this.flags.collapsed) {
        return;
    }

    if (this.thumbnail) {
        ctx.drawImage(this.thumbnail, 5, 50, this.size[0] - 9, this.size[1] - 54);
        return;
    }

    if (this.properties["image"].data) {

        var imageRawData = base64ToBytes(this.properties["image"].data);

        var w = this.properties["image"].width;
        var h = this.properties["image"].height;

        var imageData = ctx.createImageData(w, h);

        if (imageData.data.set) {
            imageData.data.set(imageRawData);
        } else {
            imageRawData.forEach(function (pixelData, i) {
                imageData.data[i] = pixelData;
            });
        }

        this.thumbnail = document.createElement('canvas');
        this.thumbnail.width = w;
        this.thumbnail.height = h;
        this.thumbnail.getContext('2d').putImageData(imageData, 0, 0);

        this.dirty = true;
        this.setDirtyCanvas(true);

        return;
    }

};

Node_TVG_DragDropLocalTcVnImage.prototype.loadImage = function (url, callback) {

    if (url == "") {
        return;
    }

    if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
        url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
    }

    var currentNode = this;

    var img = document.createElement("img");
    img.src = url;

    img.onload = function () {

        currentNode.size[1] = ((img.height / img.width) * currentNode.size[0]) + 30;

        var canvas = new OffscreenCanvas(img.width, img.height)
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var imageData = ctx.getImageData(0, 0, img.width, img.height).data;

        var imageProperty = currentNode.properties["image"];
        imageProperty.channels = 4;
        imageProperty.pixelType = "TCVN_ET_USINT";
        imageProperty.sizeInBytes = imageData.length;
        imageProperty.data = bytesToBase64(imageData);
        imageProperty.width = img.width;
        imageProperty.height = img.height;

        currentNode.setProperty("image", imageProperty);
       
        if (callback) {
            callback(currentNode);
        }

        currentNode.dirty = true;
        currentNode.setDirtyCanvas(true);
    };

    img.onerror = function () {
        console.log("error loading the image:" + url);
    }

    
};

Node_TVG_DragDropLocalTcVnImage.prototype.onWidget = function (e, widget) {

    if (widget.name == "load") {
        this.loadImage(this.properties["image"].url);
    }

};

Node_TVG_DragDropLocalTcVnImage.prototype.onDropFile = function (file) {

    if (this._url) {
        URL.revokeObjectURL(this._url);
    }

    this._url = URL.createObjectURL(file);
    this.properties["image"].filename = file.name;
    this.properties["image"].lastModified = file.lastModified.toString();
    this.properties["image"].url = this._url;
    this.loadImage(this._url);

};

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TVG_LoadImage() {

    VisionNodeBase(this);

    this.title = "TVG_LoadImage";

    this.addInput("Path", "STRING");
    this.addOutput("ITcVnImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TVG_ViewITcVnImage() {

    VisionNodeBase(this);

    this.title = "ViewITcVnImage";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.image = new Image();

}

Node_TVG_ViewITcVnImage.prototype.onDrawForeground = function (ctx) {

    if (!this.flags.collapsed) {
        if (this.image.hasAttribute("src")) {
            ctx.drawImage(this.image, 5, 50, this.size[0] - 9, this.size[1] - 54);
        }
    }
};

Node_TVG_ViewITcVnImage.prototype.onStatusUpdate = function (status) {

    var content = status.content;

    if (typeof content == 'undefined' && !content) {
        return;
    }

    let imageContent = content.find(element => element.name === 'Image');
    if (imageContent.data && imageContent.mime) {
        this.image.src = 'data:' + imageContent.mime + ';base64,' + imageContent.data;
    }

    this.setDirtyCanvas(true, false);

};

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TVG_GoldenTemplate() {

    VisionNodeBase(this);

    this.title = "TVG_GoldenTemplate";

    this.addInput("ipTestImage", "ITcVnImage");
    this.addInput("ipTemplateImage", "ITcVnImage");
    this.addOutput("ipDisplayImage", "ITcVnImage");
    this.addOutput("nScore", "ULINT");

    this.addPropertyWithNumberWidget("nPositiveThreshold", "nPositiveThreshold", 10, 0, 255);
    this.addPropertyWithNumberWidget("nNegativeThreshold", "nNegativeThreshold", -10, -255, 0);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_DetectBlobs() {

    VisionNodeBase(this);

    this.title = "F_VN_DetectBlobs";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("stParams", "TcVnParamsBlobDetection");
    this.addOutput("ipBlobContours", "ITcVnContainer");
    
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_FindContours() {

    VisionNodeBase(this);

    this.title = "F_VN_FindContours";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipContours", "ITcVnContainer");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_FindContoursExp() {

    VisionNodeBase(this);

    this.title = "F_VN_FindContours";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addPropertyWithComboboxWidget("Retrieval Mode", "eRetrievalMode", ETcVnContourRetrievalMode, "TCVN_CRM_EXTERNAL");
    this.addPropertyWithComboboxWidget("Approximation Method", "eApproximationMethod", ETcVnContourApproximationMethod, "TCVN_CAM_NONE");
    this.addOutput("ipContours", "ITcVnContainer");

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MatchTemplate() {

    VisionNodeBase(this);

    this.title = "F_VN_MatchTemplate";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("ipTemplateImage", "ITcVnImage");
    this.addOutput("ipResultImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MatchTemplateAndEvaluate() {

    VisionNodeBase(this);

    this.title = "F_VN_MatchTemplateAndEvaluate";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("ipTemplateImage", "ITcVnImage");
    this.addOutput("ipMatches", "ITcVnContainer");

    this.addPropertyWithSliderWidget("fMatchThreshold", "fMatchThreshold", 0.5, 0, 1);

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MatchTemplateAndEvaluateExp() {

    VisionNodeBase(this);

    this.title = "F_VN_MatchTemplateAndEvaluateExp";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("ipTemplateImage", "ITcVnImage");
    this.addInput("ipTemplateMask", "ITcVnImage");
    this.addOutput("ipMatches", "ITcVnContainer");
    this.addOutput("ipMatchValues", "ITcVnContainer");

    this.addPropertyWithSliderWidget("fMatchThreshold", "fMatchThreshold", 1, 0, 1);
    this.addPropertyWithComboboxWidget("eMatchMethod", "eMatchMethod", ETcVnTemplateMatchMethod);
    this.addPropertyWithSliderWidget("fScaleFactor", "fScaleFactor", 1, 0, 1);
    this.addPropertyWithComboboxWidget("eInterpolationType", "eInterpolationType", ETcVnInterpolationType);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_F_VN_MatchTemplateExp() {

    VisionNodeBase(this);

    this.title = "F_VN_MatchTemplateExp";

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("ipTemplateImage", "ITcVnImage");
    this.addInput("ipTemplateMask", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.addPropertyWithComboboxWidget("eMatchMethod", "eMatchMethod", ETcVnTemplateMatchMethod);

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Node_TcVnParamsBlobDetection() {

    VisionNodeBase(this);

    this.title = "TcVnParamsBlobDetection";

    this.addOutput("stParams", "TcVnParamsBlobDetection");

    this.addPropertyWithToggleWidget("Filter By Area", "filterByArea", true);
    this.addPropertyWithToggleWidget("Filter By Circularity", "filterByCircularity", false);
    this.addPropertyWithToggleWidget("Filter By Convexity", "filterByConvexity", false);
    this.addPropertyWithToggleWidget("Filter By Eccentricity", "filterByEccentricity", false);
    this.addPropertyWithToggleWidget("Filter By Inertia Ratio", "filterByInertiaRatio", false);
    this.addPropertyWithNumberWidget("Min Area", "minArea", 0, 0, 100000000);
    this.addPropertyWithNumberWidget("Max Area", "maxArea", 100000000, 0, 100000000);
    this.addPropertyWithSliderWidget("Min Circularity", "minCircularity", 0, 0, 1);
    this.addPropertyWithSliderWidget("Max Circularity", "maxCircularity", 1, 0, 1);
    this.addPropertyWithSliderWidget("Min Convexity", "minConvexity", 0, 0, 1);
    this.addPropertyWithSliderWidget("Max Convexity", "maxConvexity", 1, 0, 1);
    this.addPropertyWithSliderWidget("Min Eccentricity", "minEccentricity", 0, 0, 1);
    this.addPropertyWithSliderWidget("Max Eccentricity", "maxEccentricity", 1, 0, 1);
    this.addPropertyWithSliderWidget("Min Inertia Ratio", "minInertiaRatio", 0, 0, 1);
    this.addPropertyWithSliderWidget("Max Inertia Ratio", "maxInertiaRatio", 1, 0, 1);
    this.addPropertyWithComboboxWidget("Threshold Type", "thresholdType", ETcVnThresholdType);
    this.addPropertyWithSliderWidget("Min Threshold", "minThreshold", 30, 0, 255);
    this.addPropertyWithSliderWidget("Max Threshold", "maxThreshold", 255, 0, 255);
    this.addPropertyWithSliderWidget("Threshold Step", "thresholdStep", 0, 0, 100);
    this.addPropertyWithNumberWidget("Min Blob Distance", "minBlobDistance", 5, 0, 1000);
    this.addPropertyWithSliderWidget("Min Repeatability", "minRepeatability", 2, 0, 100, 0, 1);
    this.addPropertyWithComboboxWidget("Blob Combination", "blobCombination", ETcVnBlobCombination, "TCVN_BC_MEDIAN_THRESHOLD");

}
// this file is inserted just after the javascript files found in the vision-toolkit-hmi\Graphframework directory.  
// use this file to add or manipulate the core litegraph before it is used in desktop.view.

LGraphCanvas.foobar = function() {
    // modify litegraph
};
// Example node ------------------------------------------------------------------------

function SandpitNode() {

    this.addInput("myInput1", "BOOL");
    this.addInput("myInput2", "BOOL");
    this.addInput("myInput3", "BOOL");
    this.addOutput("myOutput", "BOOL");

    this.addPropertyWithNumberWidget("myInt1", "nFilterWidth", 3, 1, 999, 0, 2);
    this.addPropertyWithNumberWidget("myInt2", "nFilterHeight", 3, 1, 999, 0, 2);

};

// Example node registration -----------------------------------------------------------

var SandpitNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

             GraphFramework.registerNodeType("Sandpit/SandpitNode", SandpitNode);
        
            }
    }
})();

