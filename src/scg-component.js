SCgComponent = {
    ext_lang: 'scg_code',
    formats: ['hypermedia_format_scg_json'],
    factory: function(sandbox) {
        return new scgViewerWindow(sandbox);
    }
};


/**
 * scgViewerWindow
 * @param config
 * @constructor
 */
var scgViewerWindow = function(sandbox){
    this._initWindow(sandbox);
};

scgViewerWindow.prototype = {

    /**
     * scgViewer Window init
     * @param config
     * @private
     */
    _initWindow : function(sandbox){

        /**
         * Container for render graph
         * @type {String}
         */
        this.domContainer = sandbox.container;
        this.sandbox = sandbox;

        this.editor = new SCg.Editor();
        this.editor.init({containerId: sandbox.container});

        // delegate event handlers
        this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
        this.sandbox.eventGetObjectsToTranslate = $.proxy(this.getObjectsToTranslate, this);
        this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);
    },

    /**
     * Set new data in viewer
     * @param {Object} data
     */
    receiveData : function(data){

        this._buildGraph(data);
    },

    /**
     * Build scGraph from JSON
     * @param {Object} data
     * @return {scGraph}
     * @private
     */
    _buildGraph : function(data){

        var elements = {};
        var edges = new Array();
        for (var i = 0; i < data.length; i++) {
            var el = data[i];

            if (elements.hasOwnProperty(el.id))
                continue;

            if (this.editor.scene.objects.hasOwnProperty(el.id)) {
                elements[el.id] = this.editor.scene.objects[el.id];
                continue;
            }

            if (el.el_type & sc_type_node || el.el_type & sc_type_link) {
                var model_node = this.editor.scene.createNode(el.el_type, new SCg.Vector3(10 * Math.random(), 10 * Math.random(), 0), '');
                model_node.setScAddr(el.id);

                elements[el.id] = model_node;
            } else if (el.el_type & sc_type_arc_mask) {
                edges.push(el);
            }
        }

        // create edges
        var founded = true;
        while (edges.length > 0 && founded) {
            founded = false;
            for (idx in edges) {
                var obj = edges[idx];
                var beginId = obj.begin;
                var endId = obj.end;
                // try to get begin and end object for arc
                if (elements.hasOwnProperty(beginId) && elements.hasOwnProperty(endId)) {
                    var beginNode = elements[beginId];
                    var endNode = elements[endId];

                    founded = true;
                    edges.splice(idx, 1);

                    var model_edge = this.editor.scene.createEdge(beginNode, endNode, obj.el_type);
                    model_edge.setScAddr(obj.id);

                    elements[obj.id] = model_edge;
                }
            }
        }

        if (edges.length > 0)
            alert("error");

        this.editor.render.update();
        this.editor.scene.layout();
    },

    /**
     * Destroy window
     * @return {Boolean}
     */
    destroy : function(){
        delete this.editor;
        return true;
    },

    getObjectsToTranslate : function(){
        return this.editor.scene.getScAddrs();
    },

    applyTranslation: function(namesMap){
        for (addr in namesMap) {
            var obj = this.editor.scene.getObjectByScAddr(addr);
            if (obj) {
                obj.text = namesMap[addr];
            }
        }

        this.editor.render.updateTexts();
    }

};


SCWeb.core.ComponentManager.appendComponentInitialize(SCgComponent);
