console.log('Loaded: TcHmi.js');
// add code here to mimic TcHmi if needed.

TcHmi = {};
TcHmi.Functions = {};
TcHmi.Functions.registerFunctionEx = function (name, project, callback) {
    console.log('TcHmi: Registered Function - ' + name);
}
Functions = TcHmi.Functions;