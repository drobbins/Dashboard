function(){
    var radios = ["#txsurg", "#txradonc", "#txmedonc", "#cltrial", "#refnav", "#appins", "#previns"],
        i,
        hidden_field,
        selected_clinic,
        $clinic;

    //if ($("#cltrial").val()){
    //    $("#cltrial-checkbox").attr("checked","checked");
    //    $("#cltrial").remove();
    //}

    for (i=0; i<radios.length; i+=1){
        hidden_field = $(radios[i]);
        if (hidden_field.val() === ""){
            hidden_field.val("ni");
        }
        id_of_correct_radio = radios[i]+"-"+hidden_field.val();
        $(id_of_correct_radio).attr("checked","checked");
        hidden_field.remove();
    }

    $clinic = $("#clinic");
    selected_clinic = $("#clinic_text").val();
    if(selected_clinic){
        $("[value='"+selected_clinic+"']", $clinic).attr("selected", "selected");
        $("[value='']", $clinic).removeAttr("selected");
        $("#clinic_text").remove;
    }
    $(".datepicker").datepicker();
    $(".autofill").autocomplete({
        source : function(request, response){
            var db = $$($("#main")).app.db,
                design_doc_name = $$($("#main")).app.ddoc._id.split("/")[1],
                field_name = $(this.element).attr("name"),
                term = $(this.element).val(),
                nonce = Math.random();
            $$($(this)).nonce = nonce;
            db.view(design_doc_name+"/autofill_"+field_name, {
                startkey : term,
                endkey : term+"\u9999", //I don't know why only \u9999 works, not \uFFFF
                limit : 10,
                group : true,
                success : function(results){
                    if($$($(this)).nonce = nonce){
                        response(results.rows.map(function(row){return row.key;}));
                    }
                }
            });
        }
    });
}
