settings = casper.settings

casper.thenOpen settings.url

casper.then ->
    @test.assertTitle "Dashboard", "title is good"

casper.run ->
    @test.done()