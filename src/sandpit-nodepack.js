// Example node ------------------------------------------------------------------------

function Node_Multiply() {};
function Node_Divide() {};
function Node_Sin() {};
function Node_Cos() {};
function Node_Concat() {};
function Node_Multiply1() {};
function Node_Divide1() {};
function Node_Sin1() {};
function Node_Cos1() {};
function Node_Concat1() {};
// Example node registration -----------------------------------------------------------

var SandpitNodePack = (function () {

    return {

        RegisterWithGraph: function (GraphFramework) {

             GraphFramework.registerNodeType("Numbers/Node_Multiply", Node_Multiply);
             GraphFramework.registerNodeType("Numbers/Node_Divide", Node_Divide);
             GraphFramework.registerNodeType("Numbers/Trigonometry/Numbers/Node_Sin", Node_Sin);
             GraphFramework.registerNodeType("Numbers/Trigonometry/Node_Cos", Node_Cos);
            //  GraphFramework.registerNodeType("Strings/Concat", Node_Concat);
            //  GraphFramework.registerNodeType("Laz/Node_Multiply", Node_Multiply1);
            //  GraphFramework.registerNodeType("Laz/Node_Divide", Node_Divide1);
            //  GraphFramework.registerNodeType("Laz/Laz/Node_Sin", Node_Sin1);
            //  GraphFramework.registerNodeType("Laz/Laz/Node_Cos", Node_Cos1);
        
        }
    }
})();

