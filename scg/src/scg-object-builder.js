ScgObjectBuilder = {
    scg_objects: {},
    gwf_objects: {},
    scp_objects: [],
    points_scp_node_bus: [],

    scene: null,
    SCpBool: null,

    buildObjects: function (gwf_objects) {

        this.points_scp_node_bus = [];
        this.gwf_objects = gwf_objects;
        this.scg_objects = {};

        //massive for elements of template
        this.scp_objects = [];
        console.log(this.scp_objects.length);
        var a = 0;
        for (var gwf_object_id  in gwf_objects) {

            var gwf_object = gwf_objects[gwf_object_id];
            if (gwf_object.attributes.id in this.scg_objects == false) {

                var scg_object = gwf_object.buildObject({
                    scene: this.scene,
                    builder: this
                });

                this.scg_objects[gwf_object.attributes.id] = scg_object;

                //add in massive all elements of template
                // if(this.scene.edit_mode == SCgEditMode.SCgModalConstr){
                this.scp_objects.push(scg_object);
                // }
            }
        }
        this.scene.setSCpObj(this.scp_objects);

    },

    getOrCreate: function (gwf_object_id) {
        var scg_object;
        if (gwf_object_id in this.scg_objects == false) {
            var gwf_object = this.gwf_objects[gwf_object_id];
            this.scg_objects[gwf_object_id] = gwf_object.buildObject({
                scene: this.scene,
                builder: this
            });
            //if(this.scene.edit_mode == SCgEditMode.SCgModalConstr){

            this.scp_objects.push(this.scg_objects[gwf_object_id]);
            // }

        }

        return this.scg_objects[gwf_object_id];
    },

    setSCpBool: function(bool){
        this.SCpBool = bool;
    }
}