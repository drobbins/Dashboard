function(){
	$(this).trigger("get_user", {"user":$(this).attr('href').slice(1)});
}