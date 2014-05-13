var UserGlob;
/**
 * Created by Egor on 17.04.14.
 */
CommandManager = {

    User : function (thisCommand) {
        var commands = []; // array of commands
        var scene = thisCommand;
        current = 0;       // number of current command
        currentInRedo = 0;

        //created by Gorbachik A.A.
        this.nodeCommand = function(obj) {
            var newCommand = new NodeCommand(scene,obj);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            current++;
            currentInRedo++;
            scene.selectionChanged();
        };

        //created by Makuta E.V.
        this.edgeCommand = function(obj) {
            var newCommand = new EdgeCommand(scene,obj);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Green A.S.
        this.busCommand = function(obj){
            var newCommand = new BusCommand(scene,obj);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Green A.S.
        this.changeIdtfCommand = function(obj,oldText, newText) {
            var newCommand = new ChangeIdtfCommand(obj,scene);
            newCommand.setInMas(oldText);
            newCommand.setInMas(newText);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Gorbachik A.A.
        this.changeTypeCommand = function(obj,oldType, newType) {
            var newCommand = new ChangeTypeCommand(obj,scene);
            newCommand.setInMas(oldType);
            newCommand.setInMas(newType);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Makuta E.V.
        this.deleteObjectCommand = function(obj) {
            var newCommand = new DeleteObjectCommand(obj,scene);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Green A.S.
        this.moveCommand = function(obj,x1,y1,x2,y2){
            var newCommand = new MoveCommand(obj,scene,x1,y1,x2,y2);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        }

        //created by Makuta E.V.
        this.scpCommand = function(obj){
            var newCommand = new ScpCommand(obj,scene);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Gorbachik A.A.
        this.paintSCpCommand = function(nodes_n,arcs_a,obj,x_x,y_y) {
            var newCommand = new PaintSCpCommand(nodes_n,arcs_a,scene,obj,x_x,y_y);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Green A.S.
        this.deleteAttributesOfSCpTemplate = function(mas){
            var newCommand = new DeleteAttributesOfSCpTemplate(scene);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Makuta E.V.
        this.downloadSCgCommand = function(mas){
            var newCommand = new DownloadSCgCommand(scene);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        //created by Gorbachik A.A.
        this.gridAlignmentCommand = function(){
            var newCommand = new GridAlignmentCommand(scene);
            if (current<commands.length-1) {
                commands.splice(current);
            }
            newCommand.execute();
            commands.push(newCommand);
            currentInRedo++;
            current++;
            scene.selectionChanged();
        };

        this.undo = function() {
                if (current > 0) {
                    commands[--current].unExecute();
                }
        };

        this.redo = function() {
                if (current < commands.length) {
                    commands[current++].execute();
                }
        };

        this.getSize = function() {
            return commands;
        };

        this.getCurrent = function() {
            return current;
        };

        this.getCurrentInRedo = function() {
            return currentInRedo;
        };

    },

    setUser: function(user) {
        UserGlob = user;
    },

    getUser: function() {
        return UserGlob;
    }
}