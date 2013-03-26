settings = casper.settings

casper.thenOpen settings.url

casper.d.login settings.users.gi

casper.then ->
    @click "a.navigation[href='#data-entry']"

casper.then ->
    @test.assertSelectorHasText "#top", "Data for a New Patient", "header is good"
    @test.assertExists "form.dmf", "dmf form is good"
    @test.assertExists "#sidebar form", "patient lookup form is good"

casper.then ->
    @fill "form.dmf", casper.ddata.gi1, false

casper.then ->
    vals = @getFormValues "form.dmf"
    @test.assert vals.ptfstnm == casper.ddata.gi1.ptfstnm, "first name is good, rest probably are too"
    @click "form.dmf input[value='Submit']"

casper.then ->
    @sendKeys "#patient_name_select", casper.ddata.gi1.ptfstnm.slice 0,3

casper.then ->
    @test.assertEval (->
        document.querySelector("#patient_name_select").value == "Aaa"
    ), "send keys is good"
    @test.assertEval (->
        numResults = document.querySelectorAll("#select_results tr").length
        numResults > 0
    ), "lookup is good"

# casper.reload

casper.then ->
    @d.logout()

casper.run ->
    @test.done()