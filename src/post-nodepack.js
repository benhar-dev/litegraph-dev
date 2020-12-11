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
