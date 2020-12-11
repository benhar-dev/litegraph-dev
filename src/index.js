TcHmi = {};
TcHmi.Functions = {};
TcHmi.Functions.registerFunctionEx = function (name, project, callback) {
    console.log('TcHmi: Registered Function - ' + name);
}
Functions = TcHmi.Functions;



// adds all of the graphframework
var req = require.context("../vision-toolkit/vision-toolkit-hmi/GraphFramework/", true, /^(.*\.(js$))[^.]*$/im);
req.keys().forEach(function(key){
    context(key);
});

// adds all of the nodepacks
var req = require.context("../vision-toolkit/vision-toolkit-hmi/Nodepacks/", true, /^(.*\.(js$))[^.]*$/im);
req.keys().forEach(function(key){
    req(key);
});

