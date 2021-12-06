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

