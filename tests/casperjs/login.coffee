settings = casper.settings

# Admin Login
casper.then ->
    #Attempt to login
    @fill "#account form", settings.users.admin, false
    @click "#account form input[value='Login']"

casper.then ->
    @test.assertSelectorHasText "#account span a", settings.users.admin.name, "login is good"
    #@test.assert @getHTML "#account span a" == "robbinsd", "login is good"

casper.then ->
    @click "a[href='#logout']"

casper.then ->
    #Ensure the login form is back in place.
    @test.assertSelectorExists "#account form", "logout is good"

casper.run ->
    @test.done()