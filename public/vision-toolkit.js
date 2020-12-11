console.log('Loaded: TcHmi.js');

TcHmi = {};
TcHmi.Functions = {};
TcHmi.Functions.registerFunctionEx = function (name, project, callback) {
    // console.log('TcHmi: Registered Function');
    // console.log(name);
    // console.log(project);
    // console.log(callback);
}

TcHmi.Server = {};
TcHmi.Server.writeSymbol = function (symbolName, symbolValue) {
    // console.log('TcHmi: Write Symbol');
    // console.log(symbolName);
    // console.log(symbolValue);
}
console.log('Loaded: pre-graphframework.js');
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

/* How to add more handlers to the show edit property value - This would be needed if you wanted to override the default rightclick > properties... "

LGraphCanvas.prototype.originalShowEditPropertyValue = LGraphCanvas.prototype.showEditPropertyValue;

LGraphCanvas.prototype.showEditPropertyValue = function (node, property, options) {

    if (!node || node.properties[property] === undefined) {
        return;
    }

    var info = node.getPropertyInfo(property);
    var type = info.type;

    if (type != "thisIsMyPropertyType") {
        this.originalShowEditPropertyValue(node, property, options);
        return;
    }


    // custom code goes here...
};

*/

/*

// part of the framework for drawing widgets. add a draw function..
if (w.draw) {
    w.draw(ctx, node, widget_width, y, H);
}


// part of the framework for sending click events to the widget... add mouse function and return if something changes.
if (w.mouse) {
    this.dirty_canvas = w.mouse(event, [x, y], node);
}

*/

// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var vision_toolkit_hmi;
        (function (vision_toolkit_hmi) {
            function DebugString(InspectString) {
                console.log(InspectString);
            }
            vision_toolkit_hmi.DebugString = DebugString;
        })(vision_toolkit_hmi = Functions.vision_toolkit_hmi || (Functions.vision_toolkit_hmi = {}));
        Functions.registerFunctionEx('DebugString', 'TcHmi.Functions.vision_toolkit_hmi', vision_toolkit_hmi.DebugString);
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

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

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var GraphFrameworkCustomisation = (function () {

    return {

        Initialise: function (GraphFramework) {

            /**
            * Updates the graph status. 
            * @method updateStatus
            * @param {status} graph status object
            */
            GraphFramework.LGraph.prototype.updateStatus = function (status) {

                if (typeof status == 'undefined' && !status) {
                    return;
                }

                if (typeof status.nodes == 'undefined' && !status.nodes) {
                    return;
                }

                status.nodes.forEach(updateNodeStatus);

                function updateNodeStatus(value, index, array) {

                    let nodeId = value.id;
                    let node = graph.getNodeById(nodeId);

                    if (typeof node == 'undefined' && !node) {
                        return;
                    }

                    if (node.updateStatus) {
                        node.updateStatus(value.status);
                    }
                }

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

        }
    }
})();

//let value = status.find(element => element.name === 'HasError').value;
//if (value) {
//    this.bgcolor = "#00FFFF"
//} else {
//    this.bgcolor = "#FF00FF"

//}



// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var vision_toolkit_hmi;
        (function (vision_toolkit_hmi) {
            function UpdateNodeStatus(status) {
                let statusObject = JSON.parse(status);
                graph.updateStatus(statusObject);
            }
            vision_toolkit_hmi.UpdateNodeStatus = UpdateNodeStatus;
        })(vision_toolkit_hmi = Functions.vision_toolkit_hmi || (Functions.vision_toolkit_hmi = {}));
        Functions.registerFunctionEx('UpdateNodeStatus', 'TcHmi.Functions.vision_toolkit_hmi', vision_toolkit_hmi.UpdateNodeStatus);
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
console.log('Loaded: post-graphframework.js');
console.log('Loaded: pre-nodepack.js');
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var DebugNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

            GraphFramework.registerNodeType("Debug/Playground", Playground);

        }
    }
})();


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var VisionNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

            // TcHmi Views
            GraphFramework.registerNodeType("TcHMI/ViewITcVnImage", ViewITcVnImage);
            GraphFramework.registerNodeType("TcHMI/DragDropTcVnImage", DragDropTcVnImage);

            // Basic Image Operations
            GraphFramework.registerNodeType("Basic Image Operations/F_VN_CopyImage", F_VN_CopyImage);
            GraphFramework.registerNodeType("Basic Image Operations/F_VN_CopyIntoDisplayableImage", F_VN_CopyIntoDisplayableImage);

            // Code Reading
            GraphFramework.registerNodeType("Code Reading/F_VN_ReadDataMatrixCode", F_VN_ReadDataMatrixCode);
            GraphFramework.registerNodeType("Code Reading/F_VN_ReadQRCode", F_VN_ReadQRCode);

            // Drawing
            GraphFramework.registerNodeType("Drawing/F_VN_PutLabel", F_VN_PutLabel);
            GraphFramework.registerNodeType("Drawing/F_VN_DrawContours", F_VN_DrawContours);

            // Image Acquisition
            GraphFramework.registerNodeType("Image Acquisition/FB_VN_SimpleCameraControl", FB_VN_SimpleCameraControl);

            // Geometric and Coordinate Transformations
            GraphFramework.registerNodeType("Geometric and Coordinate Transformations/F_VN_FlipImage", F_VN_FlipImage);
            GraphFramework.registerNodeType("Geometric and Coordinate Transformations/TVG_Rotate", TVG_Rotate);

            // Image Segmentation
            GraphFramework.registerNodeType("Image Segmentation/F_VN_Threshold", F_VN_Threshold);

            // Image Filtering
            GraphFramework.registerNodeType("Image Filtering/F_VN_GaussianFilter", F_VN_GaussianFilter);
            GraphFramework.registerNodeType("Image Filtering/F_VN_MedianFilter", F_VN_MedianFilter);

            // Image Colour and Contrast Processing
            GraphFramework.registerNodeType("Image Colour and Contrast Processing/F_VN_InvertImageColor", F_VN_InvertImageColor);
            GraphFramework.registerNodeType("Image Colour and Contrast Processing/F_VN_GenerateColorMap", F_VN_GenerateColorMap);
            GraphFramework.registerNodeType("Image Colour and Contrast Processing/F_VN_ApplyColorMap", F_VN_ApplyColorMap);
            GraphFramework.registerNodeType("Image Colour and Contrast Processing/F_VN_NormalizeImage", F_VN_NormalizeImage);

            // Image Analysis - Object Detection
            GraphFramework.registerNodeType("Image Analysis - Object Detection/F_VN_DetectBlobs", F_VN_DetectBlobs);
            GraphFramework.registerNodeType("Image Analysis - Object Detection/TcVnParamsBlobDetection", TcVnParamsBlobDetection);
            

        }
    }
})();


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

                //selectedColor = 'rgb(' + imageData.data[0] + ', ' + imageData.data[1] + ', ' + imageData.data[2] + ')';

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

blobCombinationWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = "TCVN_BC_MEDIAN_THRESHOLD";
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
        "combo",
        "Blob Combination",
        initialValue,
        function (v) { },
        {
            property: propertyName,
            values: [
            "TCVN_BC_SMALLEST",
            "TCVN_BC_LARGEST",
            "TCVN_BC_MIN_THRESHOLD",
            "TCVN_BC_MAX_THRESHOLD",
            "TCVN_BC_MEDIAN_THRESHOLD"]
        }
    );
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

colorPickerWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = "#000000";
    }

    node.colorPickWidget = node.addWidget(
        "color",
        "Color",
        initialValue,
        function (v) { },
        {
            property: propertyName
        }
    );

    node.colorPickWidget.mouse = function (event, position, node) {

        if (event.type == "mousedown") {
            node.graph.list_of_graphcanvas[0].showColorPickerDialog(node, propertyName, { event: event });
        }

    };

    node.colorPickWidget.draw = function (ctx, node, widget_width, y, H) {

        var width = node.size[0];
        var posY = y;
        var show_text = true;
        //ctx.save();
        ctx.globalAlpha = this.editor_alpha;
        var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
        var background_color = LiteGraph.WIDGET_BGCOLOR;
        var text_color = LiteGraph.WIDGET_TEXT_COLOR;
        var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
        var margin = 15;


        if (node.colorPickWidget.disabled)
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
            if (node.colorPickWidget.name != null) {
                ctx.fillText(node.colorPickWidget.name, margin * 2, y + H * 0.7);
            }
            ctx.fillStyle = text_color;
            ctx.textAlign = "right";
            ctx.fillText(String(node.colorPickWidget.value).substr(0, 30), (widget_width - margin * 2) - H  , y + H * 0.7); //30 chars max
            ctx.restore();
        }
        ctx.fillStyle = node.colorPickWidget.value;
        ctx.fillRect((widget_width - margin * 2) - 10, posY+3, H-6, H-6);

    }

    return node.colorPickWidget
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

contourIndexWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = -1;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Contour Index",
            initialValue,
            function (v) { },
            { property: propertyName, min: -1, max: 2147483647 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

eTcVnFlipAxis = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = "TCVN_FA_X";
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
        "combo",
        "Flip Axis",
        initialValue,
        function (v) { },
        {
            property: propertyName,
            values: [
             "TCVN_FA_X",
             "TCVN_FA_Y",
             "TCVN_FA_XY"
            ]
        }
    );
}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

filterByAreaWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = true;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;
  
    return node.addWidget(
            "toggle",
            "Filter By Area",
            initialValue,
            function (v) { },
            { property: propertyName }
        );
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />


filterByCircularityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = false;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "toggle",
            "Filter By Circularity",
            initialValue,
            function (v) { },
            { property: propertyName }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

filterByConvexityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = false;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "toggle",
            "Filter By Convexity",
            initialValue,
            function (v) { },
            { property: propertyName }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

filterByEccentricityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = false;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "toggle",
            "Filter By Eccentricity",
            initialValue,
            function (v) { },
            { property: propertyName }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

filterByInertiaRatioWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = false;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "toggle",
            "Filter By Inertia Ratio",
            initialValue,
            function (v) { },
            { property: propertyName }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

maxAreaWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 100000000;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Max Area",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 100000000 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

maxCircularityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 1;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Max Circularity",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

maxConvexityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 1;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Max Convexity",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

maxEccentricityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 1;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Max Eccentricity",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

maxInertiaRatioWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 1;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Max Inertia Ratio",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

maxThresholdWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 255;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Max Threshold",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 255 }
        );

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minAreaWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Min Area",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 100000000 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minBlobDistanceWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 5;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Min Blob Distance",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1000 }
        );

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minCircularityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Min Circularity",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minConvexityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Min Convexity",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minEccentricityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Min Eccentricity",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minInertiaRatioWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Min Inertia Ratio",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 1 }
        );

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minRepeatabilityWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 2;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Min Repeatability",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 100 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

minThresholdWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 30;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Min Threshold",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 255 }
        );

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

numberWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Number",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 100 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

textPositionXWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 10;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "X",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 4294967295 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

textPositionYWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 10;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Y",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 4294967295 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

textScaleWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 1;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Scale",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 10 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

thicknessWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 5;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "number",
            "Thickness",
            initialValue,
            function (v) { },
            { property: propertyName, min: -1, max: 2147483647 }
        );

}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

thresholdStepWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = 0;
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
            "slider",
            "Threshold Step",
            initialValue,
            function (v) { },
            { property: propertyName, min: 0, max: 100 }
        );

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

thresholdTypeWidget = function (node, propertyName, initialValue) {

    if (initialValue === undefined) {
        initialValue = "TCVN_TT_BINARY";
    }

    node.properties = node.properties || {};
    node.properties[propertyName] = initialValue;

    return node.addWidget(
        "combo",
        "Threshold Type",
        initialValue,
        function (v) { },
        {
            property: propertyName,
            values: [
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
            "TCVN_TT_TRIANGLE_TOZERO_INV"]
        }
    );
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function Playground() {

    this.panel = {};

    this.updateStatus = function (status) {
        console.log(status);
    }

    var panel = document.createElement("div");
    panel.className = "graphdialog rounded";
    panel.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>";
   

  
    var graphcanvas = LGraphCanvas.active_canvas;
    var canvas = graphcanvas.canvas;

    var rect = canvas.getBoundingClientRect();
    var offsetx = -20;
    var offsety = -20;
    if (rect) {
        offsetx -= rect.left;
        offsety -= rect.top;
    }

    if (event) {
        panel.style.left = event.clientX + offsetx + "px";
        panel.style.top = event.clientY + offsety + "px";
    } else {
        panel.style.left = canvas.width * 0.5 + offsetx + "px";
        panel.style.top = canvas.height * 0.5 + offsety + "px";
    }

    canvas.parentNode.appendChild(panel);

    this.panel = panel;
    
}

Playground.prototype.onDrawForeground = function (ctx) {
    //console.log(LiteGraph.scale());

    //this.panel.style.visibility = "hidden";

    //this.panel.style.transform = "scale(" + LiteGraph.scale() + ")";


}


/*

Node port color
---------------

    Nodes have ports which can be rendered with different colors.  To do this you must inject the color via the "extra_info" parameter on creation. 

    This is the snippet of the code to capture extra info
    -----------------------------------------------------
    LGraphNode.prototype.addInput = function(name, type, extra_info) {
            type = type || 0;
            var o = { name: name, type: type, link: null };
            if (extra_info) {
                for (var i in extra_info) {
                    o[i] = extra_info[i];
                }
            }


    Possible use
    ------------
    inputs[0].color_on := 

    this.default_connection_color = {
            input_off: "#778",
            input_on: "#7F7",
            output_off: "#778",
            output_on: "#7F7"
        };

*/
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_CopyImage() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
}

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_CopyIntoDisplayableImage() {

    this.addInput("ipSrcImage", "ITcVnImage");

}
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_ReadDataMatrixCode() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("DMCode", "String");
}

F_VN_ReadDataMatrixCode.size = [220, 30];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_ReadQRCode() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("QRCode", "String");
}

F_VN_ReadQRCode.size = [200, 30];
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_DrawContours() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("Contours", "ITcVnContainer");
    this.addOutput("DestinationImage", "ITcVnImage");
    this.addProperty('aColor', '#000000', 'color');

    this.contourIndexWidget = contourIndexWidget(this, "nContourIndex");
    this.colorPickerWidget = colorPickerWidget(this, "aColor");
    this.thicknessWidget = thicknessWidget(this, "nThickness");
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_PutLabel() {

    this.onPropertyChanged = updatePlc;

    this.addInput("SourceImage", "ITcVnImage");
    this.addInput("Text", "STRING");
    this.addOutput("DestinationImage", "ITcVnImage");

    this.textPositionX = textPositionXWidget(this, "X_Pos");
    this.textPositionY = textPositionYWidget(this, "Y_Pos");
    this.textScale = textScaleWidget(this, "Scale");
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_FlipImage() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");

    this.flipAxis = eTcVnFlipAxis(this, "flipAxis");

}

F_VN_FlipImage.size = [220, 55];

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function TVG_Rotate() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    this.properties = { rotationInDegrees: 0 };

    this.number = this.addWidget(
        "number",
        "Rotation In Degrees",
        0,
        function (v) { },
        { property: "rotationInDegrees", min: 0, max: 360 }
    );

}

TVG_Rotate.size = [250, 55];


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function FB_VN_SimpleCameraControl() {

    this.addOutput("ipSrcImage", "ITcVnImage");

}

FB_VN_SimpleCameraControl.size = [240, 40];
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_ApplyColorMap() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("ipColorMap", "ITcVnContainer");
    this.addOutput("ipDestImage", "ITcVnImage");
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_GenerateColorMap() {

    this.onPropertyChanged = updatePlc;

    this.addOutput("ipColorMap", "ITcVnContainer");
    this.properties = { colorMapSelect: "TCVN_CM_JET", colorMapSize: "TCVN_CMS_256" };
    
    this.combo = this.addWidget(
        "combo",
        "Type",
        "TCVN_CM_JET",
        function (v) { },
        {
            property: "colorMapSelect",
            values: [

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
            "TCVN_CM_HOT"]
        }
    );

    this.combo = this.addWidget(
        "combo",
        "Type",
        "TCVN_CMS_256",
        function (v) { },
        {
            property: "colorMapSize",
            values: [

            "TCVN_CMS_256",
            "TCVN_CMS_65536"]
        }
    );
}

F_VN_GenerateColorMap.size = [240, 80];


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_InvertImageColor() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_NormalizeImage() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_GaussianFilter() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    this.properties = { filterWidth: 3, filterHeight: 3 };

    this.number = this.addWidget(
        "number",
        "Filter Width",
        3,
        function (v) { },
        { property: "filterWidth", min: 0, max: 1000 }
    );

    this.number = this.addWidget(
        "number",
        "Filter Height",
        3,
        function (v) { },
        { property: "filterHeight", min: 0, max: 1000 }
    );
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_MedianFilter() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    this.properties = { filterSize: 3 };

    this.number = this.addWidget(
        "number",
        "Filter Size",
        3,
        function (v) { },
        { property: "filterSize", min: 0, max: 1000 }
    );

}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_Threshold() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    this.properties = { thresholdAmount: 100.0, maximumWhiteValue: 100.0, thresholdType: "TCVN_TT_BINARY" };
    
    this.thresholdSlider = this.addWidget(
        "slider",
        "Threshold",
        250,
        function (v) { console.log(v) },
        { property: "thresholdAmount", min: 0, max: 255 }
    );

    this.maximumWhiteValueSlider = this.addWidget(
        "slider",
        "Max White Value",
        250,
        function (v) { },
        { property: "maximumWhiteValue", min: 0, max: 255 }
    );

    this.combo = this.addWidget(
        "combo",
        "Type",
        "TCVN_TT_BINARY",
        function (v) { },
        {
            property: "thresholdType",
            values: [

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
            "TCVN_TT_TRIANGLE_TOZERO_INV"]
        }
    );
}

F_VN_Threshold.size = [320, 110];
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function DragDropTcVnImage() {
    this.addOutput("frame", "image");
    this.properties = { url: "" };
}

DragDropTcVnImage.title = "Image";
DragDropTcVnImage.desc = "Image loader";
DragDropTcVnImage.widgets = [{ name: "load", text: "Load", type: "button" }];

DragDropTcVnImage.supported_extensions = ["jpg", "jpeg", "png", "gif"];

DragDropTcVnImage.prototype.onAdded = function () {
    if (this.properties["url"] != "" && this.img == null) {
        this.loadImage(this.properties["url"]);
    }
};

DragDropTcVnImage.prototype.onDrawBackground = function (ctx) {
    if (this.flags.collapsed) {
        return;
    }
    if (this.img && this.size[0] > 5 && this.size[1] > 5 && this.img.width) {
        ctx.drawImage(this.img, 0, 0, this.size[0], this.size[1]);
    }
};

DragDropTcVnImage.prototype.onExecute = function () {
    if (!this.img) {
        this.boxcolor = "#000";
    }
    if (this.img && this.img.width) {
        this.setOutputData(0, this.img);
    } else {
        this.setOutputData(0, null);
    }
    if (this.img && this.img.dirty) {
        this.img.dirty = false;
    }
};

DragDropTcVnImage.prototype.onPropertyChanged = function (name, value) {
    this.properties[name] = value;
    if (name == "url" && value != "") {
        this.loadImage(value);
    }

    return true;
};

DragDropTcVnImage.prototype.loadImage = function (url, callback) {
    if (url == "") {
        this.img = null;
        return;
    }

    this.img = document.createElement("img");

    if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
        url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
    }

    this.img.src = url;
    this.boxcolor = "#F95";
    var that = this;
    this.img.onload = function () {
        if (callback) {
            callback(this);
        }
        console.log("Image loaded, size: " + that.img.width + "x" + that.img.height);
        this.dirty = true;
        that.boxcolor = "#9F9";
        that.setDirtyCanvas(true);
    };
    this.img.onerror = function () {
        console.log("error loading the image:" + url);
    }
};

DragDropTcVnImage.prototype.onWidget = function (e, widget) {
    if (widget.name == "load") {
        this.loadImage(this.properties["url"]);
    }
};

DragDropTcVnImage.prototype.onDropFile = function (file) {
    var that = this;
    if (this._url) {
        URL.revokeObjectURL(this._url);
    }
    this._url = URL.createObjectURL(file);
    this.properties.url = this._url;
    this.loadImage(this._url, function (img) {
        that.size[1] = (img.height / img.width) * that.size[0];
    });
};

// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function ViewITcVnImage() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.image = new Image();

}

ViewITcVnImage.prototype.onDrawForeground = function (ctx) {

    if (!this.flags.collapsed) {
        if (this.image.hasAttribute("src")) {
            ctx.drawImage(this.image, 5, 30, this.size[0] - 8, this.size[1] - 35);
        }
    }
};

ViewITcVnImage.prototype.onStatusUpdate = function (status) {

    if (typeof status == 'undefined' && !status) {
        return;
    }

    let image = status.find(element => element.name === 'Image');
    if (image.data && image.mime) {
        this.image.src = 'data:' + image.mime + ';base64,' + image.data;
    }

    this.setDirtyCanvas(true, false);
};

ViewITcVnImage.size = [330, 200];
// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function F_VN_DetectBlobs() {

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addInput("stParams", "TcVnParamsBlobDetection");
    this.addOutput("ipBlobContours", "ITcVnContainer");
    
}


// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function TcVnParamsBlobDetection() {

    this.onPropertyChanged = updatePlc;

    this.addOutput("stParams", "TcVnParamsBlobDetection");

    this.filterByArea = filterByAreaWidget(this,"filterByArea");
    this.filterByCircularity = filterByCircularityWidget(this,"filterByCircularity")
    this.filterByConvexity = filterByConvexityWidget(this, "filterByConvexity");
    this.filterByEccentricity = filterByEccentricityWidget(this,"filterByEccentricity");
    this.filterByInertiaRatio = filterByInertiaRatioWidget(this, "filterByInertiaRatio");
    this.minArea = minAreaWidget(this, "minArea");
    this.maxArea = maxAreaWidget(this, "maxArea");
    this.minCircularity = minCircularityWidget(this, "minCircularity");
    this.maxCircularity = maxCircularityWidget(this, "maxCircularity");
    this.minConvexity = minConvexityWidget(this, "minConvexity");
    this.maxConvexity = maxConvexityWidget(this, "maxConvexity");
    this.minEccentricity = minEccentricityWidget(this, "minEccentricity");
    this.maxEccentricity = maxEccentricityWidget(this, "maxEccentricity");
    this.minInertiaRatio = minInertiaRatioWidget(this, "minInertiaRatio");
    this.maxInertiaRatio = maxInertiaRatioWidget(this, "maxInertiaRatio");
    this.thresholdType = thresholdTypeWidget(this, "thresholdType");
    this.minThreshold = minThresholdWidget(this, "minThreshold");
    this.maxThreshold = maxThresholdWidget(this, "maxThreshold");
    this.thresholdStep = thresholdStepWidget(this, "thresholdStep");
    this.minBlobDistance = minBlobDistanceWidget(this, "minBlobDistance");
    this.minRepeatability = minRepeatabilityWidget(this, "minRepeatability");
    this.blobCombination = blobCombinationWidget(this, "blobCombination");

}

TcVnParamsBlobDetection.size = [400, 565];
console.log('Loaded: litegraph-dev-nodepack.js');

var LitegraphDev = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

             GraphFramework.registerNodeType("Demo/DemoNode", DemoNode);
        
            }
    }
})();


console.log('Loaded: post-nodepack.js');

function DemoNode() {

    this.onPropertyChanged = updatePlc;

    this.addInput("ipSrcImage", "ITcVnImage");
    this.addOutput("ipDestImage", "ITcVnImage");
    this.properties = { demoValue: 3};

    this.number = this.addWidget(
        "number",
        "Demo Value",
        3,
        function (v) { },
        { property: "demoValue", min: 0, max: 1000 }
    );

}
