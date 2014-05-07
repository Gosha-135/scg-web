/**
 * Created by Egor on 07.05.14.
 */

function Command() {
    this.execute = function() {};
    this.unExecute = function() {};
}

/**
 * Undo/Redo function for Node
 * @param {Object} obj
 * @param scene
 */
function NodeCommand(scene,obj) {
    var node = obj;
    var count = 0;

    this.execute = function() {
        if(count != 0){
            scene.appendNode(node);
            scene.updateRender();
        }
        count++;
        console.log("NodeRedo");

    };
    this.unExecute = function() {
        scene.removeObject(node);
        scene.updateRender();
        console.log("NodeUndo");
    };
}

NodeCommand.prototype = new Command();
NodeCommand.prototype.constructor = NodeCommand;

/**
 * Undo/Redo function for Edge
 * @param {Object} obj
 * @param scene
 */
function EdgeCommand(scene, obj) {

    var edge = obj;

    var count = 0;

    this.execute = function() {
        if(count != 0){
            scene.appendEdge(edge);
            edge.setSourceDot(edge.source_dot);
            edge.setTargetDot(edge.target_dot);
            scene.updateRender();
        }
        count++;
        console.log("EdgeRedo");
    };
    this.unExecute = function() {
        scene.removeObject(edge);
        scene.updateRender();
        console.log("EdgeUndo");
    };
}
EdgeCommand.prototype = new Command();
EdgeCommand.prototype.constructor = EdgeCommand;

/**
 * Undo/Redo function for Bus
 * @param {Object} obj
 * @param scene
 */
function BusCommand(scene, obj) {

    var bus = obj;
    var current = 0;

    this.execute = function() {
        if(current != 0){
            scene.appendBus(bus);
            bus.setSourceDot(bus.source_dot);
            bus.setTargetDot(0);
            scene.updateRender();
        }
        current++;
        console.log("BusRedo");
    };
    this.unExecute = function() {
        scene.removeObject(bus);
        scene.updateRender();
        console.log("BusUndo");
    };
}
BusCommand.prototype = new Command();
BusCommand.prototype.constructor = BusCommand;

/**
 * Undo/Redo function for change Idtf of object
 * @param {Object} obj
 * @param scene
 */
function ChangeIdtfCommand(obj,scene){

    var node = obj;
    var masOfIdtf = [];
    var count = 0;

    this.execute = function(){
        node.setText(masOfIdtf[count-1]);
        scene.updateRender();
        console.log("IdtfRedo");
    };

    this.unExecute = function(){
        node.setText(masOfIdtf[count-2]);
        scene.updateRender();
        console.log("IdtfUndo");
    };

    this.setInMas = function(text){
        masOfIdtf.push(text);
        count++;
    };
}
ChangeIdtfCommand.prototype = new Command();
ChangeIdtfCommand.prototype.constructor = ChangeIdtfCommand;

/**
 * Undo/Redo function for change type of object
 * @param {Object} obj
 * @param scene
 */
function ChangeTypeCommand(obj,scene){

    var node = obj;
    var masOfType = [];
    var count = 0;

    this.execute = function(){
        node.setScType(masOfType[count-1]);
        scene.updateRender();
        console.log("TypeRedo");
    };

    this.unExecute = function(){
        node.setScType(masOfType[count-2]);
        scene.updateRender();
        console.log("TypeUndo");
    };

    this.setInMas = function(type){
        masOfType.push(type);
        count++;
    };
}
ChangeTypeCommand.prototype = new Command();
ChangeTypeCommand.prototype.constructor = ChangeTypeCommand;

/**
 * Undo/Redo function for deleting objects
 * @param {Object} obj
 * @param scene
 */
function DeleteObjectCommand(obj,scene){

    var object = obj;

    this.execute = function(){
        if(object.edges.length != 0){
            for(var i=0;i<object.edges.length;i++){
                scene.removeObject(object.edges[i]);
            }
        }if(object instanceof SCg.ModelNode && object.bus){
            scene.removeObject(object.bus);
        }
        scene.removeObject(object);
        scene.updateRender();
        console.log("DeleteObjectRedo");
    };

    this.unExecute = function(){
        if(object instanceof SCg.ModelNode){
            scene.appendNode(object);
            scene.updateRender();
        }if(object instanceof SCg.ModelEdge){
            scene.appendEdge(object);
            object.setSourceDot(object.source_dot);
            object.setTargetDot(object.target_dot);
            scene.updateRender();
        }if(object instanceof SCg.ModelBus){
            scene.appendBus(object);
            object.setSourceDot(object.source_dot);
            object.setTargetDot(0);
            scene.updateRender();
        }if(object instanceof SCg.ModelContour){
            scene.appendContour(object);
            scene.updateRender();
        }

        for(var i=0;i<object.edges.length;i++){
            scene.appendEdge(object.edges[i]);
            object.edges[i].setSourceDot(object.edges[i].source_dot);
            object.edges[i].setTargetDot(object.edges[i].target_dot);
            scene.updateRender();
        }
        if(object instanceof SCg.ModelNode){
            if(object.bus){
                scene.appendBus(object.bus);
                object.bus.setSourceDot(object.bus.source_dot);
                object.bus.setTargetDot(0);
                scene.updateRender();
            }
        }
        scene.updateRender();
        console.log("DeleteObjectUndo");
    };
}
DeleteObjectCommand.prototype = new Command();
DeleteObjectCommand.prototype.constructor = DeleteObjectCommand;

/**
 * Undo/Redo function for Node
 *  @param {Object} obj
 *  @param scene
 *  @param {float} x1
 *  @param {float} y1
 *  @param {float} x2
 *  @param {float} y2
 */
function MoveCommand(obj,scene,x1,y1,x2,y2){

    var object = obj;
    var x_last = x1;
    var y_last = y1;
    var x_next = x2;
    var y_next = y2;

    var mas_of_edges = obj.edges;


    this.execute = function(){
        scene.updateRender();
        scene.updateObjectsVisual();
        console.log(x_last);
        console.log(y_last);
        console.log(x_next);
        console.log(y_next);
        object.setPosition(new SCg.Vector3(x_next, y_next, 0));
        scene.updateRender();
        scene.updateObjectsVisual();
        console.log("MoveObjectRedo");
    };

    this.unExecute = function(){
        console.log(object);

        object.setPosition(new SCg.Vector3(x_last, y_last, 0));
        scene.updateRender();
        scene.updateObjectsVisual();
        if(x_last != x_next && y_last!=y_next) {
        for(var i=0;i<mas_of_edges.length;i++){
            if(mas_of_edges[i] instanceof SCg.ModelEdge){
                mas_of_edges[i].setSourceDot(mas_of_edges[i].source_dot);
                mas_of_edges[i].setTargetDot(mas_of_edges[i].target_dot);
                scene.updateRender();
            }
        }
        }
        console.log("MoveObjectUndo");
    };
}
MoveCommand.prototype = new Command();
MoveCommand.prototype.constructor = MoveCommand;

/**
 * Undo/Redo function for download SCp Templates
 * @param objMas Array of downloads objects
 * @param scene
 */
function ScpCommand(objMas,scene){

    var objectsScp = [];
    objectsScp = objMas;
    var count = 0;

    this.execute = function(){
        if(count!=0){

            for(var i=0;i<objectsScp.length;i++){
                if(objectsScp[i] instanceof SCg.ModelNode){
                    scene.appendNode(objectsScp[i]);
                    scene.updateObjectsVisual();
                    scene.updateRender();
                }
            }
            for(var i=0;i<objectsScp.length;i++){
                if(objectsScp[i] instanceof SCg.ModelBus){
                    scene.appendBus(objectsScp[i]);
                    objectsScp[i].setSourceDot(objectsScp[i].source_dot);
                    objectsScp[i].setTargetDot(0);
                    scene.updateObjectsVisual();
                    scene.updateRender();
                }
            }
            for(var i=0;i<objectsScp.length;i++){
                if(objectsScp[i] instanceof SCg.ModelEdge){
                    scene.appendEdge(objectsScp[i]);
                    objectsScp[i].setSourceDot(objectsScp[i].source_dot);
                    objectsScp[i].setTargetDot(objectsScp[i].target_dot);
                    scene.updateRender();
                }
            }
            scene.updateObjectsVisual();
            scene.updateRender();
        }
        count++;
        console.log("ScpTemplateRedo");
    };

    this.unExecute = function(){
        for(var i=0;i<objectsScp.length;i++){
            scene.removeObject(objectsScp[i]);
        }
        scene.updateObjectsVisual();
        scene.updateRender();
        console.log("ScpTemplateUndo");
    };
}
ScpCommand.prototype = new Command();
ScpCommand.prototype.constructor = ScpCommand;

/**
 * Undo/Redo function for Paint attributes in SCp Templates
 * @param nodes_n Array of need nodes
 * @param arcs_a Array of need arcs
 * @param {Object} obj
 * @param scene
 * @param x_x
 * @param y_y
 */
function PaintSCpCommand(nodes_n,arcs_a,scene,obj,x_x,y_y){

    var object = obj;
    var arcs = arcs_a;
    var nodes = nodes_n;
    var x = x_x;
    var y = y_y;
    var scene = scene;

    var count = 0;

    this.execute = function(){
        if(count == 0){
            SCpTemplatesCeateAttributes.paintAttributes(nodes,arcs,scene,object,x,y);
            scene.updateRender();
            count++;
        }else{
            for(var i=0;i<scene.selected_attributes.length;i++){
                if(scene.selected_attributes[i] instanceof SCg.ModelNode){
                    scene.appendNode(scene.selected_attributes[i]);
                    scene.updateRender();
                }
                if(scene.selected_attributes[i] instanceof SCg.ModelEdge){
                    scene.appendEdge(scene.selected_attributes[i]);
                    scene.selected_attributes[i].setSourceDot(scene.selected_attributes[i].source_dot);
                    scene.selected_attributes[i].setTargetDot(scene.selected_attributes[i].target_dot);
                    scene.updateRender();
                }
            }
        }
        console.log("PaintAttributesRedo");
    };

    this.unExecute = function(){
        if(scene.selected_attributes.length != null){
            for(var i=0;i<scene.selected_attributes.length;i++){
                scene.removeObject(scene.selected_attributes[i]);

            }
            scene.selected_attributes = [];
            scene.deleteAction = false;
        }
        scene.updateRender();
        console.log("PaintAttributesUndo");
    };
}
PaintSCpCommand.prototype = new Command();
PaintSCpCommand.prototype.constructor = PaintSCpCommand;

/**
 * Undo/Redo function for deleting attributes of SCp templates
 * @param scene
 */
function DeleteAttributesOfSCpTemplate(scene){
    var mas_current = scene.selected_attributes;
    var mas_unselected = [];
    var count = 0;

    this.execute = function(){
        // var mas_current = mas;
        if(count ==0){
            for(var i=0;i<mas_current.length;i++){

                if(!mas_current[i].is_selected){
                    scene.removeSelection(mas_current[i+1]);
                    ++i;
                }
            }
            for(var i=0;i<mas_current.length;i++){
                if(mas_current[i].is_selected){
                    scene.removeObject(mas_current[i]);
                }else{
                    mas_unselected.push(mas_current[i]);
                }
            }

            scene.selected_attributes = mas_current;

            scene.deleteAction = false;
            scene.updateObjectsVisual();
            scene.updateRender();
            count++;
        } else{
            for(var i=0;i<mas_current.length;i++){
                scene.removeObject(mas_current[i]);
                scene.updateObjectsVisual();
                scene.updateRender();
            }
            for(var i=0;i<mas_unselected.length;i++){
                if(mas_unselected[i] instanceof SCg.ModelNode){
                    scene.appendNode(mas_unselected[i]);
                    scene.updateRender();
                }
                if(mas_unselected[i] instanceof SCg.ModelEdge){
                    scene.appendEdge(mas_unselected[i]);
                    mas_unselected[i].setSourceDot(mas_unselected[i].source_dot);
                    mas_unselected[i].setTargetDot(mas_unselected[i].target_dot);
                    scene.updateRender();
                }
            }
        }
        console.log("DeleteAttributesRedo");
    };

    this.unExecute = function(){
        for(var i=0;i<mas_current.length;i++){
            scene.removeObject(mas_current[i]);

        }
        scene.selected_attributes = mas_current;
        scene.updateObjectsVisual();
        scene.updateRender();
        console.log("DeleteAttributesUndo");
    };
}
DeleteAttributesOfSCpTemplate.prototype = new Command();
DeleteAttributesOfSCpTemplate.prototype.constructor = DeleteAttributesOfSCpTemplate;

/**
 * Undo/Redo function for download gwf files
 * @param scene
 */
function DownloadSCgCommand(scene){
    var masReadySCgElements = scene.scpObj;
    var count = 0;

    this.execute = function(){
        if(count!=0){

            for(var i=0;i<masReadySCgElements.length;i++){
                if(masReadySCgElements[i] instanceof SCg.ModelNode){
                    scene.appendNode(masReadySCgElements[i]);
                    scene.updateObjectsVisual();
                    scene.updateRender();
                }
            }
            for(var i=0;i<masReadySCgElements.length;i++){
                if(masReadySCgElements[i] instanceof SCg.ModelBus){
                    scene.appendBus(masReadySCgElements[i]);
                    masReadySCgElements[i].setSourceDot(masReadySCgElements[i].source_dot);
                    masReadySCgElements[i].setTargetDot(0);
                    scene.updateObjectsVisual();
                    scene.updateRender();
                }
            }
            for(var i=0;i<masReadySCgElements.length;i++){
                if(masReadySCgElements[i] instanceof SCg.ModelEdge){
                    scene.appendEdge(masReadySCgElements[i]);
                    masReadySCgElements[i].setSourceDot(masReadySCgElements[i].source_dot);
                    masReadySCgElements[i].setTargetDot(masReadySCgElements[i].target_dot);
                    scene.updateRender();
                }
            }
            scene.updateObjectsVisual();
            scene.updateRender();
        }
        count++;
        console.log("DownloadSCgRedo");
    };

    this.unExecute = function(){
        for(var i=0;i<masReadySCgElements.length;i++){
            scene.removeObject(masReadySCgElements[i]);
        }
        scene.updateObjectsVisual();
        scene.updateRender();
        console.log("DownloadSCgUndo");
    };
}
DownloadSCgCommand.prototype = new Command();
DownloadSCgCommand.prototype.constructor = DownloadSCgCommand;

/**
 * Undo/Redo function for grid alignment
 * @param scene
 */
function GridAlignmentCommand(scene){
    var masOfNodes = scene.nodes;
    var masOfOldPosition = [];

    this.execute = function(){

        for(var i =0;i<masOfNodes.length;i++){
            masOfOldPosition.push(masOfNodes[i].position);
            masOfNodes[i].position.x = Math.round(masOfNodes[i].position.x);
            masOfNodes[i].position.y = Math.round(masOfNodes[i].position.y);
            var x = this.roundingPosition(masOfNodes[i].position.x);
            var y = this.roundingPosition(masOfNodes[i].position.y);
            masOfNodes[i].setPosition(new SCg.Vector3(x, y, 0));
            scene.updateRender();
        }

        scene.updateObjectsVisual();
        scene.updateRender();
        console.log("GridAlignmentRedo");
    };

    this.unExecute = function(){

        for(var i =0;i<masOfNodes.length;i++){
            masOfNodes[i].setPosition(new SCg.Vector3(masOfOldPosition[i].x,masOfOldPosition[i].y,0));
            scene.updateRender();
        }
        scene.updateObjectsVisual();
        scene.updateRender();
        console.log("GridAlignmentUndo");
    };

    this.roundingPosition = function(number){
        return Math.round(number/75)*75;
    };
}
GridAlignmentCommand.prototype = new Command();
GridAlignmentCommand.prototype.constructor = GridAlignmentCommand;
