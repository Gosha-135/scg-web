SCpTemplatesCeateAttributes = {


    /**
     * Function to check what this
     * edge is directed? for node or arc
     */

    paintAttributes: function(forNodes,forEdges,thisAc,obj,x,y){

        var masForNodes = forNodes;
        var masForEdges = forEdges;
        var scene = thisAc;

        for(var i=0;i<masForEdges.length;i++){
            if(obj == masForEdges[i]) {
                this.paintAttributesForArcs(scene,obj,x,y);
            }
        }


        for(var i=0;i<masForNodes.length;i++){
            if(obj == masForNodes[i]) {
                this.paintAttributesForNodes(scene,obj,x,y);
            }
        }

    },

    /**
     * Creating attributes for arc
     */

    paintAttributesForArcs: function(thisAc,obj,x,y){

        var scene = thisAc;
        scene.selected_attributes = [];


        var node_role_fixed = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y-20,0), "fixed'");
        var edge_role_fixed = scene.createEdgeDot(node_role_fixed,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.05);
        scene.appendSelection(edge_role_fixed);
        scene.appendSelection(node_role_fixed);
        scene.selected_attributes.push(node_role_fixed);
        scene.selected_attributes.push(edge_role_fixed);

        var node_role_assign = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+10,0), "assign'");
        var edge_role_assign = scene.createEdgeDot(node_role_assign,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.25);
        scene.appendSelection(edge_role_assign);
        scene.appendSelection(node_role_assign);
        scene.selected_attributes.push(node_role_assign);
        scene.selected_attributes.push(edge_role_assign);

        var node_role_pos = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+40,0), "pos'");
        var edge_role_pos = scene.createEdgeDot(node_role_pos,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.45);
        scene.appendSelection(edge_role_pos);
        scene.appendSelection(node_role_pos);
        scene.selected_attributes.push(node_role_pos);
        scene.selected_attributes.push(edge_role_pos);

        var node_role_neg = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+70,0), "neg'");
        var edge_role_neg = scene.createEdgeDot(node_role_neg,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.65);
        scene.appendSelection(edge_role_neg);
        scene.appendSelection(node_role_neg);
        scene.selected_attributes.push(node_role_neg);
        scene.selected_attributes.push(edge_role_neg);

        var node_role_const = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+100,0), "const'");
        var edge_role_const = scene.createEdgeDot(node_role_const,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.85);
        scene.appendSelection(edge_role_const);
        scene.appendSelection(node_role_const);
        scene.selected_attributes.push(node_role_const);
        scene.selected_attributes.push(edge_role_const);

        var node_role_arc = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+130,0), "arc'");
        var edge_role_arc = scene.createEdgeDot(node_role_arc,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.99);
        scene.appendSelection(node_role_arc);
        scene.appendSelection(edge_role_arc);
        scene.selected_attributes.push(node_role_arc);
        scene.selected_attributes.push(edge_role_arc);

        scene.selected_attributes.update;
        scene.selected_attributes_for_command = scene.selected_attributes;

        //add attributes to the whole massive of template
        ScgObjectBuilder.scp_objects.push(scene.selected_attributes);



        scene.deleteAction = true;
        scene.updateObjectsVisual();
        scene.updateRender();

    },

    /**
     * Creating attributes for node
     */

    paintAttributesForNodes: function(thisAc,obj,x,y){

        var scene = thisAc;

        scene.selected_attributes = [];

        var node_role_fixed = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y-20,0), "fixed'");
        var edge_role_fixed = scene.createEdgeDot(node_role_fixed,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.3);
        scene.appendSelection(node_role_fixed);
        scene.appendSelection(edge_role_fixed);
        scene.selected_attributes.push(node_role_fixed);
        scene.selected_attributes.push(edge_role_fixed);

        var node_role_assign = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+10,0), "assign'");
        var edge_role_assign = scene.createEdgeDot(node_role_assign,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.5);
        scene.appendSelection(node_role_assign);
        scene.appendSelection(edge_role_assign);
        scene.selected_attributes.push(node_role_assign);
        scene.selected_attributes.push(edge_role_assign);

        var node_role_node = scene.createNode(sc_type_node | sc_type_const | sc_type_node_role, new SCg.Vector3(x+65,y+40,0), "node'");
        var edge_role_node = scene.createEdgeDot(node_role_node,obj, sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,0.0,0.7);
        scene.appendSelection(node_role_node);
        scene.appendSelection(edge_role_node);
        scene.selected_attributes.push(node_role_node);
        scene.selected_attributes.push(edge_role_node);

        scene.selected_attributes_for_command = scene.selected_attributes;

        //add attributes to the whole massive of template
        ScgObjectBuilder.scp_objects.push(scene.selected_attributes);


        scene.deleteAction = true;
        scene.updateObjectsVisual();
        scene.updateRender();

    }
}
