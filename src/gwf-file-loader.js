GwfFileLoader = {

    load: function (args) {


        var reader = new FileReader();

        var is_file_correct;
        reader.onload = function (e) {
            var text = e.target.result;
//            console.log(text);
//            text = text.replace("windows-1251","utf-8");
            is_file_correct = GwfObjectInfoReader.read(text.replace(
                "<?xml version=\"1.0\" encoding=\"windows-1251\"?>",
                "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            ));

        }

        reader.onloadend = function (e) {
            console.log(is_file_correct);
            if (is_file_correct != false) {
                ScgObjectBuilder.buildObjects(GwfObjectInfoReader.objects_info);
                var current_user = CommandManager.getUser();
                current_user.downloadSCgCommand();
                args["render"].update();
                GwfObjectInfoReader.objects_info= {};
            } else
                GwfObjectInfoReader.printErrors();

        }
        reader.readAsText(args["file"], "CP1251");
//        reader.readAsText(args["file"]);
        return true;
    },

    //function of receiving and sending the file to parse and build a template
    loadSCp: function (args) {

        var is_file_correct = GwfObjectInfoReader.read(args["file"]);

        if (is_file_correct != false) {
            ScgObjectBuilder.buildObjects(GwfObjectInfoReader.objects_info);
            args["render"].update();
            GwfObjectInfoReader.objects_info= {};
        } else
            GwfObjectInfoReader.printErrors();

        return true;
    }
}