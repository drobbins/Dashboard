function(){
    var app = $$(this).app,
        data = $(this).data('dashboard_data'),
        view = $(this).data('view');

//    if (data.rows[0].value.labels.key_labels.indexOf("insurance status") >= 0){
//        app.dashboard.plot_insurance(data, view);
//    } else
    if (data.rows[0].value.labels.key_labels[0] === "clinic"){
        app.dashboard.plot_by_clinic(data, view);
    }
    else {
        app.dashboard.plot_all(data, view);
    }
}
