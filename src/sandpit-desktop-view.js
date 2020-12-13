// this code mimics the typical setup of desktop view and would not typically be changed..

var graph = new LGraph();
var canvas = new LGraphCanvas("#mycanvas", graph);

canvas.render_canvas_border = false;

var configurePlc = function () {
    graph.uuid = generateUUID();
    var graphJson = JSON.stringify(graph.serialize());
    TcHmi.Server.writeSymbol('PLC1.MAIN.graphApi.receivedGraphJson', graphJson);
}

var updatePlc = function () {
    var graphJson = JSON.stringify(graph.serialize());
    TcHmi.Server.writeSymbol('PLC1.MAIN.graphApi.receivedGraphJson', graphJson);
}

GraphFrameworkCustomisation.Initialise(LiteGraph);
SandpitNodePack.RegisterWithGraph(LiteGraph);
DebugNodePack.RegisterWithGraph(LiteGraph);
VisionNodePack.RegisterWithGraph(LiteGraph);

graph.onNodeAdded = configurePlc;
graph.onNodeRemoved = configurePlc;
graph.onNodeConnectionChange = configurePlc;
graph.onSerialize = function (data) {
    data.uuid = graph.uuid;
}

canvas.resize();
window.addEventListener("resize", function () { canvas.resize(); });

graph.start();

// add nodes here if you need them to auto show (handy when working on a single node)

var node = LiteGraph.createNode('Sandpit/SandpitNode');
canvas.graph.add(node);