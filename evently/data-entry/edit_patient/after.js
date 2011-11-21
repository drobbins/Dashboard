function(){
    var radios = ["#txsurg", "#txradonc", "#txmedonc", "#cltrial1"],
        i,
        hidden_field,
        selected_clinic,
        $clinic;

    if ($("#cltrial").val()){
        $("#cltrial-checkbox").attr("checked","checked");
        $("#cltrial").remove();
    }

    for (i=0; i<radios.length; i+=1){
        //debugger;
        hidden_field = $(radios[i]);
        if (hidden_field.val() === ""){
            hidden_field.val("ni");
        }
        id_of_correct_radio = radios[i]+"-"+hidden_field.val();
        $(id_of_correct_radio).attr("checked","checked");
        //hidden_field.remove();
    }

    $clinic = $("#clinic");
    selected_clinic = $("#clinic_text").val();
    if(selected_clinic){
        $("[value='"+selected_clinic+"']", $clinic).attr("selected", "selected");
        $("[value='']", $clinic).removeAttr("selected");
        $("#clinic_text").remove;
    }
}
