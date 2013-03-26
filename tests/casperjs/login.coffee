settings = casper.settings

# Test a user by logging them in, checking for their name in the logged in
# field, and logging them back out.
testLogin = (user) ->
    casper.d.login user
    casper.d.logout()

casper.thenOpen settings.url

# Test Logins
testLogin settings.users.admin
testLogin settings.users.gi

casper.run ->
    @test.done()