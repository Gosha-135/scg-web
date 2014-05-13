var SCg = SCg || { version: "0.1.0" };

SCg.Editor = function() {

    this.render = null;
    this.scene = null;
};

SCg.Editor.prototype = {


    init: function(params)
    {
        this.typesMap = {
            'scg-type-node': sc_type_node,
            'scg-type-node-const': sc_type_node | sc_type_const,
            'scg-type-node-const-group': sc_type_node | sc_type_const | sc_type_node_class,
            'scg-type-node-const-abstract': sc_type_node | sc_type_const | sc_type_node_abstract,
            'scg-type-node-const-material': sc_type_node | sc_type_const | sc_type_node_material,
            'scg-type-node-const-norole': sc_type_node | sc_type_const | sc_type_node_norole,
            'scg-type-node-const-role': sc_type_node | sc_type_const | sc_type_node_role,
            'scg-type-node-const-struct': sc_type_node | sc_type_const | sc_type_node_struct,
            'scg-type-node-const-tuple': sc_type_node | sc_type_const | sc_type_node_tuple,
            'scg-type-node-var': sc_type_node | sc_type_var,
            'scg-type-node-var-group': sc_type_node | sc_type_var | sc_type_node_class,
            'scg-type-node-var-abstract': sc_type_node | sc_type_var | sc_type_node_abstract,
            'scg-type-node-var-material': sc_type_node | sc_type_var | sc_type_node_material,
            'scg-type-node-var-norole': sc_type_node | sc_type_var | sc_type_node_norole,
            'scg-type-node-var-role': sc_type_node | sc_type_var | sc_type_node_role,
            'scg-type-node-var-struct': sc_type_node | sc_type_var | sc_type_node_struct,
            'scg-type-node-var-tuple': sc_type_node | sc_type_var | sc_type_node_tuple,
            'scg-type-edge-common': sc_type_edge_common,
            'scg-type-arc-common': sc_type_arc_common,
            'scg-type-arc-common-access': sc_type_arc_access,
            'scg-type-edge-const': sc_type_edge_common | sc_type_const,
            'scg-type-arc-const': sc_type_arc_common | sc_type_const,
            'scg-type-arc-const-perm-pos-access': sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm,
            'scg-type-arc-const-perm-neg-access': sc_type_arc_access | sc_type_const | sc_type_arc_neg | sc_type_arc_perm,
            'scg-type-arc-const-perm-fuz-access': sc_type_arc_access | sc_type_const | sc_type_arc_fuz | sc_type_arc_perm,
            'scg-type-arc-const-temp-pos-access': sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_temp,
            'scg-type-arc-const-temp-neg-access': sc_type_arc_access | sc_type_const | sc_type_arc_neg | sc_type_arc_temp,
            'scg-type-arc-const-temp-fuz-access': sc_type_arc_access | sc_type_const | sc_type_arc_fuz | sc_type_arc_temp,
            'scg-type-edge-var': sc_type_edge_common | sc_type_var,
            'scg-type-arc-var': sc_type_arc_common | sc_type_var,
            'scg-type-arc-var-perm-pos-access': sc_type_arc_access | sc_type_var | sc_type_arc_pos | sc_type_arc_perm,
            'scg-type-arc-var-perm-neg-access': sc_type_arc_access | sc_type_var | sc_type_arc_neg | sc_type_arc_perm,
            'scg-type-arc-var-perm-fuz-access': sc_type_arc_access | sc_type_var | sc_type_arc_fuz | sc_type_arc_perm,
            'scg-type-arc-var-temp-pos-access': sc_type_arc_access | sc_type_var | sc_type_arc_pos | sc_type_arc_temp,
            'scg-type-arc-var-temp-neg-access': sc_type_arc_access | sc_type_var | sc_type_arc_neg | sc_type_arc_temp,
            'scg-type-arc-var-temp-fuz-access': sc_type_arc_access | sc_type_var | sc_type_arc_fuz | sc_type_arc_temp
        };

        this.typeProcedure = {
            'scg-type-procedure-printEl': "static/components/SCp-procedure-templates/printEl.gwf",
            'scg-type-procedure-print': "static/components/SCp-procedure-templates/print.gwf",
            'scg-type-procedure-genEl': "static/components/SCp-procedure-templates/genEl.gwf",
            'scg-type-procedure-genElStr3': "static/components/SCp-procedure-templates/genElStr3.gwf",
            'scg-type-procedure-genElStr5': "static/components/SCp-procedure-templates/GenElStr5.gwf",
            'scg-type-procedure-searchElStr3': "static/components/SCp-procedure-templates/SearchElStr3.gwf",
            'scg-type-procedure-searchElStr5': "static/components/SCp-procedure-templates/SearchElStr5.gwf",
            'scg-type-procedure-eraseEl': "static/components/SCp-procedure-templates/eraseEl.gwf",
            'scg-type-procedure-ifVarAssign': "static/components/SCp-procedure-templates/ifVarAssign.gwf",
            'scg-type-procedure-waitReturnSet': "static/components/SCp-procedure-templates/waitReturnSet.gwf",

            'scg-type-procedure-ifCoin': "static/components/SCp-procedure-templates/ifCoin.gwf",
            'scg-type-procedure-ifEq': "static/components/SCp-procedure-templates/ifEq.gwf",
            'scg-type-procedure-ifFormCont': "static/components/SCp-procedure-templates/ifFormCont.gwf",
            'scg-type-procedure-ifFormIdtf': "static/components/SCp-procedure-templates/ifFormIdtf.gwf",
            'scg-type-procedure-ifGr': "static/components/SCp-procedure-templates/ifGr.gwf",
            'scg-type-procedure-ifGrEq': "static/components/SCp-procedure-templates/ifGrEq.gwf",
            'scg-type-procedure-ifNumber': "static/components/SCp-procedure-templates/ifNumber.gwf",
            'scg-type-procedure-ifString': "static/components/SCp-procedure-templates/ifString.gwf",
            'scg-type-procedure-ifType': "static/components/SCp-procedure-templates/ifType.gwf"
            //'scg-type-procedure-constr': SCgEditMode.SCgModalConstr
        };

        this.render = new SCg.Render();
        this.scene = new SCg.Scene( {render: this.render } );
        this.scene.init();

        this.render.scene = this.scene;
        this.render.init(params);

        this.containerId = params.containerId;
        this.initUI();

    },

    /**
     * Initialize user interface
     */
    initUI: function() {
        var self = this;

        var container = '#' + this.containerId;
        $(container).prepend('<div id="tools-' + this.containerId + '"></div>');
        var tools_container = '#tools-' + this.containerId;
        $(tools_container).load('static/components/html/scg-tools-panel.html', function() {
            $.ajax({
                url: "static/components/html/scg-types-panel-nodes.html",
                dataType: 'html',
                success: function(response) {
                    self.node_types_panel_content = response;
                },
                error: function() {
                    SCgDebug.error("Error to get nodes type change panel");
                },
                complete: function() {
                    $.ajax({
                        url: "static/components/html/scg-types-panel-edges.html",
                        dataType: 'html',
                        success: function(response) {
                            self.edge_types_panel_content = response;
                        },
                        error: function() {
                            SCgDebug.error("Error to get edges type change panel");
                        },
                        complete: function() {
                            self.bindToolEvents();
                        },
                        complete: function() {
                            $.ajax({
                                url: "static/components/html/scg-types-panel-procedure.html",
                                dataType: 'html',
                                success: function(response) {
                                    self.procedure_types_panel_content = response;
                                },
                                error: function() {
                                    SCgDebug.error("Error to get procedures type change panel");
                                },
                                complete: function() {
                                    self.bindToolEvents();
                                }
                            });
                        }
                    });
                }

            });
        });

        var self = this;
        this.scene.event_selection_changed = function() {
            self.onSelectionChanged();
        }
        this.scene.event_modal_changed = function() {
            self.onModalChanged();
        }
    },

    /**
     * Bind events to panel tools
     */
    bindToolEvents: function() {

        var self = this;
        var container = '#' + this.containerId;
        var cont = $(container);

        cont.find('#scg-tool-select').button('toggle');

        // handle clicks on mode change
        cont.find('#scg-tool-select').click(function() {
            self.scene.setEditMode(SCgEditMode.SCgModeSelect);
        });
        cont.find('#scg-tool-edge').click(function() {
            self.scene.setEditMode(SCgEditMode.SCgModeEdge);
        });
        cont.find('#scg-tool-bus').click(function() {
            self.scene.setEditMode(SCgEditMode.SCgModeBus);
        });
        cont.find('#scg-tool-contour').click(function() {
            self.scene.setEditMode(SCgEditMode.SCgModeContour);
        });
        cont.find('#scg-tool-change-idtf').click(function() {
            ScgObjectBuilder.scp_objects = [];
            self.scene.scpObj = [];
            self.scene.setModal(SCgModalMode.SCgModalIdtf);
            $(this).popover({container: container});
            $(this).popover('show');

            var tool = $(this);

            function stop_modal() {
                self.scene.setModal(SCgModalMode.SCgModalNone);
                tool.popover('destroy');
                self.scene.updateObjectsVisual();
            }


            var input = $(container + ' #scg-change-idtf-input');
            // setup initial value
            input.focus().val(self.scene.selected_objects[0].text);
            input.keypress(function (e) {
                if (e.keyCode == KeyCode.Enter || e.keyCode == KeyCode.Escape) {

                    if (e.keyCode == KeyCode.Enter){
                        user.changeIdtfCommand(self.scene.selected_objects[0],self.scene.selected_objects[0].text,input.val());
                        self.scene.selected_objects[0].setText(input.val());
                    }
                    stop_modal();
                    e.preventDefault();
                }

            });

            // process controls
            $(container + ' #scg-change-idtf-apply').click(function() {
                user.changeIdtfCommand(self.scene.selected_objects[0],self.scene.selected_objects[0].text,input.val());
                self.scene.selected_objects[0].setText(input.val());
                stop_modal();
            });
            $(container + ' #scg-change-idtf-cancel').click(function() {
                stop_modal();
            });

        });

        cont.find('#scg-tool-change-type').click(function() {
            self.scene.setModal(SCgModalMode.SCgModalType);

            if (self.scene.selected_objects.length != 1) {
                SCgDebug.error('Something wrong with type selection');
                return;
            }

            var tool = $(this);

            function stop_modal() {
                self.scene.setModal(SCgModalMode.SCgModalNone);
                tool.popover('destroy');
                self.scene.updateObjectsVisual();
            }

            var obj = self.scene.selected_objects[0];

            el = $(this);
            el.popover({
                content: (obj instanceof SCg.ModelEdge) ? self.edge_types_panel_content : self.node_types_panel_content,
                container: container,
                title: 'Change type',
                html: true,
                delay: {show: 500, hide: 100}
            }).popover('show');

            cont.find('.popover-title').append('<button id="scg-type-close" type="button" class="close">&times;</button>');

            $(container + ' #scg-type-close').click(function() {
                stop_modal();
            });

            $(container + ' .popover .btn').click(function() {
                var obj = self.scene.selected_objects[0];
                user.changeTypeCommand(obj,obj.sc_type,self.typesMap[$(this).attr('id')]);
                obj.setScType(self.typesMap[$(this).attr('id')]);
                self.scene.updateObjectsVisual();
                stop_modal();
            });
        });

        cont.find('#scg-tool-delete').click(function() {
            user.deleteObjectCommand(self.scene.selected_objects[0]);
            //self.scene.deleteObjects(self.scene.selected_objects.slice(0, self.scene.selected_objects.length));
            self.scene.clearSelection();
        });


        //SCp-procedure mode
        cont.find('#scg-tool-choose-procedure').click(function() {
            self.scene.setEditMode(SCgEditMode.SCgModalConstr);

            var tool = $(this);

            function stop_modal() {
                tool.popover('destroy');
                self.scene.updateObjectsVisual();
            }

            el = $(this);
            el.popover({
                content: self.procedure_types_panel_content,
                container: container,
                title: 'Choose SCp-procedure',
                html: true,
                delay: {show: 500, hide: 100}
            }).popover('show');

            cont.find('.popover-title').append('<button id="scg-type-close" type="button" class="close">&times;</button>');

            $(container + ' #scg-type-close').click(function() {
                stop_modal();
            });

            $('#scg-tool-select').click(function() {
                stop_modal();
            });
            $('#scg-tool-edge').click(function() {
                stop_modal();
            });
            $('#scg-tool-bus').click(function() {
                stop_modal();
            });
            $('#scg-tool-contour').click(function() {
                stop_modal();
            });

            $(container + ' .popover .btn').click(function() {

                //getting a xml file from gwf's temlates
                procedure = self.typeProcedure[$(this).attr('id')];
                xmlhttp = new XMLHttpRequest();
                ScgObjectBuilder.scene = self.scene;

                xmlhttp.open("GET", procedure, false);
                xmlhttp.send();
                xmlDoc = xmlhttp.responseText;

                GwfFileLoader.loadSCp({
                    file: xmlDoc,
                    render : self.render});

                self.scene.updateObjectsVisual();
                stop_modal();
            });
        });

        //Undo operation
        cont.find('#scg-tool-undo').click(function(){
            // console.log("Undo Operation");
            var user = CommandManager.getUser();
            user.undo();
            self.onSelectionChanged();

        });

        //Alignment operation
        cont.find('#scg-tool-alignment').click(function(){
            // console.log("Undo Operation");
            var user = CommandManager.getUser();
            user.gridAlignmentCommand();
            self.onSelectionChanged();

        });

        //Redo operation
        cont.find('#scg-tool-redo').click(function(){
            // console.log("Redo Operation");
            var user = CommandManager.getUser();
            user.redo();
            self.onSelectionChanged();
        });


        //problem with opening the same doc twice
        cont.find('#scg-tool-open').click(function(){
            self.scene.setEditMode(SCgEditMode.SCgModeSelect);

            var document = $(this)[0].ownerDocument;
            var open_dialog = document.getElementById("scg-tool-open-dialog");

            open_dialog.onchange = function(){
                return GwfFileLoader.load({
                    file: open_dialog.files[0],
                    render : self.render});

            }
            ScgObjectBuilder.scene = self.scene;
            var result = open_dialog.click();
        });


        // initial update
        self.onModalChanged();
        self.onSelectionChanged();
    },

    /**
     * Function that process selection changes in scene
     * It updated UI to current selection
     */
    onSelectionChanged: function() {

        if (this.scene.selected_objects.length == 1) {
            this._enableTool('#scg-tool-change-idtf');
            this._enableTool('#scg-tool-change-type');
        } else {
            this._disableTool('#scg-tool-change-idtf');
            this._disableTool('#scg-tool-change-type');
        }

        var user = CommandManager.getUser();
        if(user.getCurrent() > 0){
            this._enableTool('#scg-tool-undo');
        }else {
            this._disableTool('#scg-tool-undo');
        }

        if(user.getCurrent() < user.getCurrentInRedo()){
            this._enableTool('#scg-tool-redo');
        }else {
            this._disableTool('#scg-tool-redo');
        }

        if (this.scene.selected_objects.length > 0) {
            this._enableTool('#scg-tool-delete');
        } else {
            this._disableTool('#scg-tool-delete');
        }
    },

    /**
     * Function, that process modal state changes of scene
     */
    onModalChanged: function() {
        var self = this;
        function update_tool(tool_id) {
            if (self.scene.modal != SCgModalMode.SCgModalNone)
                self._disableTool(tool_id);
            else
                self._enableTool(tool_id);
        }

        update_tool('#scg-tool-select');
        update_tool('#scg-tool-edge');
        update_tool('#scg-tool-bus');
        update_tool('#scg-tool-contour');
        update_tool('#scg-tool-choose-constr');

        update_tool('#scg-tool-change-idtf');
        update_tool('#scg-tool-change-type');
        update_tool('#scg-tool-delete');
        update_tool('#scg-tool-zoomin');
        update_tool('#scg-tool-zoomout');
        update_tool('#scg-tool-redo');
        update_tool('#scg-tool-undo');
    },

    // -------------------------------- Helpers ------------------
    /**
     * Change specified tool state to disabled
     */
    _disableTool: function(tool_id) {
        $('#' + this.containerId).find(tool_id).attr('disabled', 'disabled');
    },

    /**
     * Change specified tool state to enabled
     */
    _enableTool: function(tool_id) {
        $('#' + this.containerId).find(tool_id).removeAttr('disabled');
    }
};
