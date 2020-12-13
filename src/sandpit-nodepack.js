// Example node ------------------------------------------------------------------------

function SandpitNode() {

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

};

// Example node registration -----------------------------------------------------------

var SandpitNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

             GraphFramework.registerNodeType("Sandpit/SandpitNode", SandpitNode);
        
            }
    }
})();

