var SCgEditMode = {
    SCgModeSelect: 0,
    SCgModeEdge: 1,
    SCgModeBus: 2,
    SCgModeContour: 3,
    SCgModalConstr: 4,

    /**
     * Check if specified mode is valid
     */
    isValid: function(mode) {
        return (mode >= this.SCgModeSelect) && (mode <= this.SCgModeContour);
    }
};

var SCgModalMode = {
    SCgModalNone: 0,
    SCgModalIdtf: 1,
    SCgModalType: 2
};

var procedure = "";
var user ;
var x_last;
var y_lats;

var KeyCode = {
    Escape: 27,
    Enter: 13
};

var actions = [];

SCg.Scene = function(options) {

    this.render = options.render;
    this.nodes = [];
    this.edges = [];
    this.contours = [];
    this.buses = [];

    this.deleteAction = false;
    this.boolDeleteAttributes = false;

    this.selected_attributes = [];
    this.arcs_for_attribute = [];
    this.nodes_for_attribute = [];
    this.scpObj = [];

    this.objects = {};
    this.edit_mode = SCgEditMode.SCgModeSelect;

    // object, that placed under mouse
    this.pointed_object = null;
    // object, that was mouse pressed
    this.focused_object = null;

    // list of selected objects
    this.selected_objects = [];

    // drag line points
    this.drag_line_points = [];
    // points of selected line object
    this.line_points = [];

    // mouse position
    this.mouse_pos = new SCg.Vector3(0, 0, 0);

    // edge source and target
    this.edge_data = {source: null, target: null};

    // bus source
    this.bus_data = {source: null, end: null};

    // callback for selection changed
    this.event_selection_changed = null;
    // callback for modal state changes
    this.event_modal_changed = null;

    /* Flag to lock any edit operations
     * If this flag is true, then we doesn't need to process any editor operatons, because
     * in that moment shows modal dialog
     */
    this.modal = SCgModalMode.SCgModalNone;

    user = new CommandManager.User(this);
    CommandManager.setUser(user);
};

SCg.Scene.prototype = {

    constructor: SCg.Scene,

    init: function() {
        this.layout_manager = new SCg.LayoutManager();
        this.layout_manager.init(this);
    },

    /**
     * Appends new sc.g-node to scene
     * @param {SCg.ModelNode} node Node to append
     */
    appendNode: function(node) {
        this.nodes.push(node);
        node.scene = this;
        if (node.sc_addr)
            this.objects[node.sc_addr] = node;
    },

    /**
     * Appends new sc.g-edge to scene
     * @param {SCg.ModelEdge} edge Edge to append
     */
    appendEdge: function(edge) {
        this.edges.push(edge);
        edge.scene = this;
        if (edge.sc_addr)
            this.objects[edge.sc_addr] = edge;
    },

    /**
     * Append new sc.g-contour to scene
     * @param {SCg.ModelContour} contour Contour to append
     */
    appendContour: function(contour) {
        this.contours.push(contour);
        contour.scene = this;
        if (contour.sc_addr)
            this.objects[contour.sc_addr] = contour;
    },

    /**
     * Append new sc.g-contour to scene
     * @param {SCg.ModelContour} contour Contour to append
     */
    appendBus: function(bus) {
        this.buses.push(bus);
        bus.scene = this;
    },

    /**
     * Remove object from scene.
     * @param {SCg.ModelObject} obj Object to remove
     */
    removeObject: function(obj) {
        function remove_from_list(obj, list) {
            var idx = list.indexOf(obj);
            if (idx < 0) {
                SCgDebug.error("Can't find object for remove");
                return;
            }

            list.splice(idx, 1);
        }

        if (obj instanceof SCg.ModelNode) {
            remove_from_list(obj, this.nodes);
        } else if (obj instanceof SCg.ModelEdge) {
            remove_from_list(obj, this.edges);
        } else if (obj instanceof SCg.ModelContour) {
            this.deleteObjects(obj.childs);
            remove_from_list(obj, this.contours);
        } else if (obj instanceof SCg.ModelBus) {
            remove_from_list(obj, this.buses);
        }

        if (obj.sc_addr)
            delete this.objects[obj.sc_addr];
    },

    // --------- objects create/destroy -------
    /**
     * Create new node
     * @param {Integer} sc_type Type of node
     * @param {SCg.Vector3} pos Position of node
     * @param {String} text Text assotiated with node
     *
     * @return Returns created node
     */
    createNode: function(sc_type, pos, text) {
        var node = new SCg.ModelNode({
            position: pos.clone(),
            scale: new SCg.Vector2(20, 20),
            sc_type: sc_type,
            text: text
        });
        this.appendNode(node);

        return node;
    },

    /**
     * Create edge between two specified objects
     * @param {SCg.ModelObject} source Edge source object
     * @param {SCg.ModelObject} target Edge target object
     * @param {Integer} sc_type SC-type of edge
     *
     * @return Returns created edge
     */
    createEdge: function(source, target, sc_type) {
        var edge = new SCg.ModelEdge({
            source: source,
            target: target,
            sc_type: sc_type ? sc_type : sc_type_edge_common
        });
        this.appendEdge(edge);

        return edge;
    },

    /**
     * Create edge between two specified objects
     * @param {SCg.ModelObject} source Edge source object
     * @param {SCg.ModelObject} target Edge target object
     * @param {Integer} sc_type SC-type of edge
     *
     * @return Returns created edge
     */
    createEdgeDot: function(source, target, sc_type, source_d, target_d) {
        var edge = new SCg.ModelEdge({
            source: source,
            target: target,
            sc_type: sc_type ? sc_type : sc_type_edge_common
        });

        edge.source_dot = parseFloat(source_d);
        edge.target_dot = parseFloat(target_d);

        this.appendEdge(edge);

        return edge;
    },

    createBus: function(source) {
        var bus = new SCg.ModelBus({
            source: source
        });
        this.appendBus(bus);

        return bus;
    },

    /**
     * Delete objects from scene
     * @param {Array} objects Array of sc.g-objects to delete
     */
    deleteObjects: function(objects) {
        function collect_objects(container, root) {
            if (container.indexOf(root) >= 0)
                return;

            container.push(root);
            for (idx in root.edges) {
                collect_objects(container, root.edges[idx]);
            }

            if (root.bus)
                collect_objects(container, root.bus);
        }

        // collect objects for remove
        var objs = [];

        // collect objects for deletion
        for (var idx in objects)
            collect_objects(objs, objects[idx]);

        // delete objects
        for (var idx in objs) {
            this.removeObject(objs[idx]);
            objs[idx].destroy();
        }

        this.updateRender();
    },

    /**
     * Updates render
     */
    updateRender: function() {
        this.render.update();
    },

    /**
     * Updates render objects state
     */
    updateObjectsVisual: function() {
        this.render.updateObjects();
    },

    // --------- layout --------
    layout: function() {
        this.layout_manager.doLayout();
        this.render.update();
    },

    onLayoutTick: function() {
    },

    /**
     * Returns size of container, where graph drawing
     */
    getContainerSize: function() {
        return this.render.getContainerSize();
    },

    /**
     * Return array that contains sc-addrs of all objects in scene
     */
    getScAddrs: function() {
        var keys = new Array();
        for (key in this.objects) {
            keys.push(key);
        }
        return keys;
    },

    /**
     * Return object by sc-addr
     * @param {String} addr sc-addr of object to find
     * @return If object founded, then return it; otherwise return null
     */
    getObjectByScAddr: function(addr) {
        if (this.objects.hasOwnProperty(addr))
            return this.objects[addr];

        return null;
    },

    /**
     * Append selection to object
     */
    appendSelection: function(obj) {
        if (obj.is_selected) {
            SCgDebug.error('Object trying to be selecting twice');
            return;
        }

        this.selected_objects.push(obj);
        obj._setSelected(true);

        this.selectionChanged();
    },

    /**
     * Remove selection from object
     */
    removeSelection: function(obj) {

        var idx = this.selected_objects.indexOf(obj);

        if (idx == -1 || !obj.is_selected) {
            SCgDebug.error('Trying to remove selection from unselected object');
            return;
        }

        this.selected_objects.splice(idx, 1);
        obj._setSelected(false);

        this.selectionChanged();
    },

    /**
     * Clear selection list
     */
    clearSelection: function() {

        var need_event = this.selected_objects.length > 0;

        for (idx in this.selected_objects) {
            this.selected_objects[idx]._setSelected(false);
        }

        this.selected_objects.splice(0, this.selected_objects.length);

        if (need_event) this.selectionChanged();
    },

    selectionChanged: function() {
        this._fireSelectionChanged();

        this.line_points.splice(0, this.line_points.length);
        // if selected any of line objects, then create controls to control it
        if (this.selected_objects.length == 1) {
            var obj = this.selected_objects[0];

            if (obj instanceof SCg.ModelEdge || obj instanceof SCg.ModelBus) { /* @todo add contour and bus */
                for (idx in obj.points) {
                    this.line_points.push({pos: obj.points[idx], idx: idx});
                }
            }
        }

        this.render.updateLinePoints();
        this.updateObjectsVisual();
    },

    // -------- input processing -----------
    onMouseMove: function(x, y) {

        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        this.mouse_pos.x = x;
        this.mouse_pos.y = y;

        if ((this.edit_mode == SCgEditMode.SCgModeSelect) && this.focused_object) {
            if (this.focused_object instanceof SCg.ModelBus) {
                this.focused_object.changePosition(new SCg.Vector3(x, y, 0));
            } else  if (this.focused_object.sc_type & sc_type_node) {
                this.focused_object.setPosition(new SCg.Vector3(x, y, 0));
            } else if (this.focused_object.sc_type & sc_type_contour) {
                this.focused_object.setNewPoint(new SCg.Vector3(x, y, 0));
            }

            this.updateObjectsVisual();
        }

        if(this.edit_mode == SCgEditMode.SCgModeSelect || this.edit_mode == SCgEditMode.SCgModalConstr){
            if(this.scpObj.length != 0){

                for(var i=0;i<this.scpObj.length;i++){
                    if(this.scpObj[i] instanceof SCg.ModelNode){
                        this.moveSCpMode(this.scpObj[i]);
                        break;
                    }
                }
            }
        }

        // Add or remove selection from arcs if we are in the SCp-procedure mode,
        // removing if not
        if (this.edit_mode == SCgEditMode.SCgModalConstr) {


            this.setSCpArcs();
            this.setSCpNodes();
            for(var i=0;i<this.arcs_for_attribute.length;i++){
                if(!this.arcs_for_attribute[i].is_selected){
                    this.appendSelection(this.arcs_for_attribute[i]);
                }
            }
            for(var i=0;i<this.nodes_for_attribute.length;i++){
                if(!this.nodes_for_attribute[i].is_selected){
                    this.appendSelection(this.nodes_for_attribute[i]);
                }
            }
            this.render.update();
            this.updateObjectsVisual();
        }
        else{
            this.setSCpArcs();
            this.setSCpNodes();
            for(var i=0;i<this.arcs_for_attribute.length;i++){
                if(this.arcs_for_attribute[i].is_selected){
                    this.removeSelection(this.arcs_for_attribute[i]);
                }
            }
            for(var i=0;i<this.nodes_for_attribute.length;i++){
                if(this.nodes_for_attribute[i].is_selected){
                    this.removeSelection(this.nodes_for_attribute[i]);
                }
            }
        }

        if (this.edit_mode == SCgEditMode.SCgModeEdge || this.edit_mode == SCgEditMode.SCgModeBus
            || this.edit_mode == SCgEditMode.SCgModeContour) {
            this.render.updateDragLine();
        }
    },


    /**
     * Moving the template when loaded  in SCp-procedure mode
     * * @param {Object} for moving templates relative to the object
     */
    moveSCpMode: function(obj){

        var posObj = obj.position;
        var raznX = this.mouse_pos.x - posObj.x;
        var raznY = this.mouse_pos.y - posObj.y;


        if(this.scpObj != 0){
            for(var i=0;i<this.scpObj.length;i++){

                if(this.scpObj[i] instanceof SCg.ModelNode){
                    var pos = this.scpObj[i].position;
                    var xres = pos.x + raznX;
                    var yres = pos.y + raznY;

                    this.scpObj[i].setPosition(new SCg.Vector3(xres, yres, 0));
                }

                if(this.scpObj[i] instanceof SCg.ModelBus){
                    ScgObjectBuilder.points_scp_node_bus[0] = ScgObjectBuilder.points_scp_node_bus[0] + raznX;
                    ScgObjectBuilder.points_scp_node_bus[1] = ScgObjectBuilder.points_scp_node_bus[1] + raznY;
                    this.scpObj[i].setPoints([{x: ScgObjectBuilder.points_scp_node_bus[0]+100, y: ScgObjectBuilder.points_scp_node_bus[1]}]);
                }
                this.scpObj[i].update();
            }
            this.updateRender();
        }
        this.updateRender();
    },

    onMouseDown: function(x, y) {

        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        // append new line point
        if (!this.pointed_object) {
            var isModeEdge = this.edit_mode == SCgEditMode.SCgModeEdge;
            var isModeContour = this.edit_mode == SCgEditMode.SCgModeContour;
            if (isModeContour || (isModeEdge && this.edge_data.source)) {
                this.drag_line_points.push({x: x, y: y, idx: this.drag_line_points.length});
            }
        }

        if (!this.pointed_object && this.edit_mode == SCgEditMode.SCgModeBus && this.bus_data.source) {
            this.drag_line_points.push({x: x, y: y, idx: this.drag_line_points.length});
            this.bus_data.end = {x: x, y: y, idx: this.drag_line_points.length};
        }
    },

    onMouseUp: function(x, y) {

        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        if (!this.pointed_object && this.edit_mode != SCgEditMode.SCgModalConstr)
            this.clearSelection();

        this.focused_object = null;
    },

    onMouseDoubleClick: function(x, y) {

        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        if (this.edit_mode == SCgEditMode.SCgModeSelect) {
            if (this.pointed_object)
                return; // do nothing

            var node = this.createNode(sc_type_node | sc_type_const, new SCg.Vector3(x, y, 0), '');

            user.nodeCommand(node);

            this.updateRender();
        }
    },

    /**
     * Function for deleting attributes from SCp-template
     */
    deleteAttributesConstrMode: function(){

        user.deleteAttributesOfSCpTemplate(this.selected_attributes);
        this.updateObjectsVisual();
        this.updateRender();
    },

    onMouseOverObject: function(obj) {
        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        this.pointed_object = obj;
    },

    onMouseOutObject: function(obj) {
        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        this.pointed_object = null;
    },

    onMouseDownObject: function(obj) {

        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        if (this.edit_mode == SCgEditMode.SCgModeSelect) {
            this.focused_object = obj;
            if (obj instanceof SCg.ModelContour || obj instanceof SCg.ModelBus) {
                obj.previousPoint = new SCg.Vector2(this.mouse_pos.x, this.mouse_pos.y);
            }
            x_last = obj.position.x;
            y_lats = obj.position.y;
        }

        if (this.edit_mode == SCgEditMode.SCgModalConstr){
            this.focused_object = obj;
        }

        if (this.edit_mode == SCgEditMode.SCgModeEdge) {

            // start new edge
            if (!this.edge_data.source) {
                this.edge_data.source = obj;
                this.drag_line_points.push({x: this.mouse_pos.x, y: this.mouse_pos.y, idx: this.drag_line_points.length});
            } else {
                // source and target must be not equal
                if (this.edge_data.source != obj) {
                    var edge = this.createEdge(this.edge_data.source, obj, sc_type_arc_pos_const_perm);

                    var mouse_pos = new SCg.Vector2(this.mouse_pos.x, this.mouse_pos.y);
                    edge.setSourceDot(this.edge_data.source.calculateDotPos(mouse_pos));
                    edge.setTargetDot(obj.calculateDotPos(mouse_pos));

                    if (this.drag_line_points.length > 1) {
                        edge.setPoints(this.drag_line_points.slice(1));
                    }
                    this.edge_data.source = this.edge_data.target = null;

                    this.drag_line_points.splice(0, this.drag_line_points.length);
                    this.edge_data.source = this.edge_data.target = null;

                    user.edgeCommand(edge);

                    this.updateRender();
                    this.render.updateDragLine();
                }
            }
        }
        if (this.edit_mode == SCgEditMode.SCgModeBus) {

            if (!this.bus_data.source && !obj.bus && !(obj instanceof SCg.ModelBus)) {
                this.bus_data.source = obj;
                this.drag_line_points.push({x: this.mouse_pos.x, y: this.mouse_pos.y, idx: this.drag_line_points.length});
            }
        }
    },

    onMouseUpObject: function(obj) {
        if (this.modal != SCgModalMode.SCgModalNone) return; // do nothing

        if (this.edit_mode == SCgEditMode.SCgModeSelect) {
            // case we moved object from contour
            if (obj.contour && !obj.contour.isNodeInPolygon(obj)) {
                obj.contour.removeChild(obj);
            }

            // case we moved object into the contour
            if (!obj.contour && obj instanceof SCg.ModelNode) {
                for (var i = 0; i < this.contours.length; i++) {
                    if (this.contours[i].isNodeInPolygon(obj)) {
                        this.contours[i].addChild(obj);
                    }
                }
            }

            if (obj == this.focused_object) {
                this.clearSelection();
                this.appendSelection(obj);
                if(this.scpObj.length == 0){
                    user.moveCommand(obj,x_last,y_lats,this.mouse_pos.x,this.mouse_pos.y);
                }
                this.updateObjectsVisual();
            }

            this.focused_object = null;
            this.scpObj = [];
        }

        if (this.edit_mode == SCgEditMode.SCgModalConstr){

            if(this.scpObj.length != 0 ){
                user.scpCommand(this.scpObj);
            }
            this.scpObj = [];
            if (this.deleteAction) {
                if(obj instanceof  SCg.ModelNode ){
                    for(idx in this.selected_attributes)
                    {
                        if(obj == this.selected_attributes[idx]) {
                            if(obj.is_selected){
                                this.removeSelection(obj);
                            }
                            else{
                                this.appendSelection(obj);
                            }
                        }
                    }

                }
                //calling function for deleting attributes
                if((obj instanceof  SCg.ModelEdge || obj instanceof  SCg.ModelBus) && this.selected_attributes.length!=0){
                    this.deleteAttributesConstrMode();
                }
                this.updateObjectsVisual();
                this.updateRender();
            }

            //calling function for building attributes for arc in SCp-template
            if (obj == this.focused_object && obj instanceof SCg.ModelEdge && obj.is_selected && !this.deleteAction) {
                this.setSCpArcs();
                this.setSCpNodes();
                //SCpTemplatesCeateAttributes.paintAttributes(this.nodes_for_attribute,this.arcs_for_attribute,this,obj,this.mouse_pos.x,this.mouse_pos.y);
                user.paintSCpCommand(this.nodes_for_attribute,this.arcs_for_attribute,obj,this.mouse_pos.x,this.mouse_pos.y)
                this.updateObjectsVisual();
                this.updateRender();
            }
            this.focused_object = null;
        }
    },

    onKeyDown: function(key_code) {

        if (this.modal != SCgModalMode.SCgModalNone) return false; // do nothing

        // revert changes on escape key
        if (key_code == KeyCode.Escape) {
            if (this.edit_mode == SCgEditMode.SCgModeEdge)
            {
                this.resetEdgeMode();
                return true;
            }
        }

        return false;
    },

    onKeyUp: function(key_code) {
        if (this.modal != SCgModalMode.SCgModalNone) return false; // do nothing

        return false;
    },

    // -------- edit --------------
    /**
     * Setup new edit mode for scene. Calls from user interface
     * @param {SCgEditMode} mode New edit mode
     */
    setEditMode: function(mode) {

        if (this.edit_mode == mode) return; // do nothing

        this.edit_mode = mode;

        this.focused_object = null;
        this.edge_data.source = null; this.edge_data.target = null;

        this.bus_data.source = null;

        this.resetEdgeMode();
    },

    /**
     * Changes modal state of scene. Just for internal usage
     */
    setModal: function(value) {
        this.modal = value;
        this._fireModalChanged();
    },

    /**
     * Reset edge creation mode state
     */
    resetEdgeMode: function() {
        this.drag_line_points.splice(0, this.drag_line_points.length);
        this.render.updateDragLine();

        this.edge_data.source = this.edge_data.target = null;
    },

    /**
     * Revert drag line to specified point. All drag point with index >= idx will be removed
     * @param {Integer} idx Index of drag point to revert.
     */
    revertDragPoint: function(idx) {

        if (this.edit_mode != SCgEditMode.SCgModeEdge && this.edit_mode != SCgEditMode.SCgModeBus && this.edit_mode != SCgEditMode.SCgModeContour) {
            SCgDebug.error('Work with drag point in incorrect edit mode');
            return;
        }

        this.drag_line_points.splice(idx, this.drag_line_points.length - idx);

        if (this.drag_line_points.length >= 2)
            this.bus_data.end = this.drag_line_points[this.drag_line_points.length - 1];
        else
            this.bus_data.end = null;

        if (this.drag_line_points.length == 0) {
            this.edge_data.source = this.edge_data.target = null;
            this.bus_data.source = null;
        }
        this.render.updateDragLine();
    },

    /**
     * Update selected line point position
     */
    setLinePointPos: function(idx, pos) {
        if (this.selected_objects.length != 1) {
            SCgDebug.error('Invalid state. Trying to update line point position, when there are no selected objects');
            return;
        }

        var edge = this.selected_objects[0];
        if (!(edge instanceof SCg.ModelEdge) && !(edge instanceof SCg.ModelBus)) {
            SCgDebug.error("Selected object isn't an edge");
            return;
        }

        if (edge.points.length <= idx) {
            SCgDebug.error('Invalid index of line point');
            return;
        }
        edge.points[idx].x = pos.x;
        edge.points[idx].y = pos.y;

        edge.requestUpdate();
        edge.need_update = true;
        edge.need_observer_sync = true;

        this.updateObjectsVisual();
        this.render.updateLinePoints();
    },

    finishBusCreation: function() {

        var bus = this.createBus(this.bus_data.source);

        if (this.drag_line_points.length > 1) {
            bus.setPoints(this.drag_line_points.slice(1));
        }
        var pos = new SCg.Vector2(this.drag_line_points[0].x, this.drag_line_points[0].y);

        bus.setSourceDot(this.bus_data.source.calculateDotPos(pos));
        bus.setTargetDot(0);

        this.bus_data.source = this.bus_data.end = null;

        this.drag_line_points.splice(0, this.drag_line_points.length);

        user.busCommand(bus);

        this.updateRender();
        this.render.updateDragLine();
    },

    createCurrentContour: function() {
        if (this.drag_line_points.length < 3) {
            SCgDebug.error('Set at least 3 points for contour');
            return;
        }

        var polygon =  $.map(this.drag_line_points, function (vertex) {
            return $.extend({}, vertex);
        });

        var contour = new SCg.ModelContour({
            verticies: polygon
        });

        contour.addNodesWhichAreInContourPolygon(this.nodes);
        this.appendContour(contour);
        this.pointed_object = contour;
        this.drag_line_points.splice(0, this.drag_line_points.length);
        this.updateRender();
        this.render.updateDragLine();
    },

    //getting elemnts for SCp-template
    setSCpArcs: function(){
        this.arcs_for_attribute = [];

        this.arcs_for_attribute = GwfObjectInfoReader.getArcsForTemplates();
    },

    setSCpNodes: function(){
        this.nodes_for_attribute = [];

        this.nodes_for_attribute = GwfObjectInfoReader.getNodesForTemplates();
    },

    setSCpObj: function(){
        this.scpObj = [];

        this.scpObj = ScgObjectBuilder.scp_objects;
    },

    // ------------- events -------------
    _fireSelectionChanged: function() {
        if (this.event_selection_changed)
            this.event_selection_changed();
    },

    _fireModalChanged: function() {
        if (this.event_modal_changed)
            this.event_modal_changed();
    }
};
