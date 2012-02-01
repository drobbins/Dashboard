function(response){
	var names = [];
	response.rows.forEach(function(row){
		if(row.id.charAt(0) !== "_"){
			names.push(row.id.split(":")[1]);
		}
	});
	return { names : names };
}
