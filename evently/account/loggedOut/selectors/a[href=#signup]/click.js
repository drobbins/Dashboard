function(e) {
  var name = $('input[name=name]', this.parentElement).val(),
    pass = $('input[name=password]', this.parentElement).val();
  $(this.parentElement).trigger('doSignup', [name, pass]);
  return false;
}