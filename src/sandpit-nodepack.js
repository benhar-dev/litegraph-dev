// Example node ------------------------------------------------------------------------

function Node_Multiply() {};
function Node_Divide() {};
function Node_Sin() {};
function Node_Cos() {};
function Node_Concat() {};

// Example node registration -----------------------------------------------------------

var SandpitNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

             GraphFramework.registerNodeType("Numbers/Node_Multiply", Node_Multiply);
             GraphFramework.registerNodeType("Numbers/Node_Divide", Node_Divide);
             GraphFramework.registerNodeType("Numbers/Trigonometry/Node_Sin", Node_Sin);
             GraphFramework.registerNodeType("Numbers/Trigonometry/Node_Cos", Node_Cos);
             GraphFramework.registerNodeType("Strings/Concat", Node_Concat);
        
        }
    }
})();

