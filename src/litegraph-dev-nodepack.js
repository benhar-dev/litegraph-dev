console.log('Loaded: litegraph-dev-nodepack.js');

var LitegraphDev = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

             GraphFramework.registerNodeType("Demo/DemoNode", DemoNode);
        
            }
    }
})();

