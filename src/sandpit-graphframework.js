// this file is inserted just after the javascript files found in the vision-toolkit-hmi\Graphframework directory.  
// use this file to add or manipulate the core litegraph before it is used in desktop.view.

LGraphCanvas.onMenuAdd = function(node, options, e, prev_menu, callback) {
    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();
    var graph = canvas.graph;
    if(!graph)
        return;

    var values = LiteGraph.getNodeTypesCategories( canvas.filter || graph.filter );
    var entries = [];
    for (var i=0; i < values.length; i++) {
        if (values[i]) {
            var name = values[i];
            if(name.indexOf("::") != -1) //in case it has a namespace like "shader::math/rand" it hides the namespace
                name = name.split("::")[1];
            if(name.indexOf("/") != -1) 
                name = name.split("/")[0];
            console.log(name);
            entries.push({ value: values[i], content: name, has_submenu: true });
        }
    }

    //show categories
    var menu = new LiteGraph.ContextMenu( entries, { event: e, callback: inner_clicked, parentMenu: prev_menu }, ref_window );

    function inner_clicked(v, option, e) {
        console.log(v);
        var category = v.value;
        var node_types = LiteGraph.getNodeTypesInCategory( category, canvas.filter || graph.filter );
        var values = [];
        for (var i=0; i < node_types.length; i++) {
            if (!node_types[i].skip_list) {
                values.push({
                    content: node_types[i].title,
                    value: node_types[i].type
                });
            }
        }

        new LiteGraph.ContextMenu( values, { event: e, callback: inner_create, parentMenu: menu }, ref_window );
        return false;
    }

    function inner_create(v, e) {
        var first_event = prev_menu.getFirstEvent();
        canvas.graph.beforeChange();
        var node = LiteGraph.createNode(v.value);
        if (node) {
            node.pos = canvas.convertEventToCanvasOffset(first_event);
            canvas.graph.add(node);
        }
        if(callback)
            callback(node);
        canvas.graph.afterChange();
    }

    return false;
};