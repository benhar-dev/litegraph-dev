// this code mimics the typical setup of desktop view and would not typically be changed..
GraphFrameworkCustomisation.Initialise(LiteGraph);
TcUnitNodePack.RegisterWithGraph(LiteGraph);
PlcBasicNodePack.RegisterWithGraph(LiteGraph);
TcVisionNodePack.RegisterWithGraph(LiteGraph);
TvgNodePack.RegisterWithGraph(LiteGraph);
SandpitNodePack.RegisterWithGraph(LiteGraph);

var graph = new LGraph();
var canvas = new LGraphCanvas("#mycanvas", graph);
canvas.render_canvas_border = false;
canvas.resize();
window.addEventListener("resize", function () { canvas.resize(); });

var plcApi = PlcApi('PLC1.MAIN.graphApi', graph);

graph.start();

var node = LiteGraph.createNode('Sandpit/SandpitNode');
canvas.graph.add(node);