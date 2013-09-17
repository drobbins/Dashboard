function (head, req){
    var rows = [],
        row,
        response,
        user = req.userCtx,
        has_permission = function(row){
            var clinic = row.value && row.value.clinic;
            if (user.roles.indexOf("_admin") >= 0 || user.roles.indexOf("dashboard") >= 0) {
                return true;
            }
            if (clinic && (user.roles.indexOf(clinic) >= 0)){
                return true;
            }
            return false;
        };

    provides('json', function(){
        if (!req.userCtx.name) {
            start({
                "code" : 401
            });
            send(JSON.stringify({
                "error" : "unauthorized",
                "reason" : "You are not authorized to perform that action."
            }));
        } else {
            response = {
                total_rows: head.total_rows,
                rows: rows
            }
            while (row = getRow()) {
                if (has_permission(row)) {
                    rows.push(row);
                }
            }
            send(toJSON(response));
        }
    });
}
