# Create the settings object
casper.settings =
    url : "http://localhost:5984/dashboard/_design/dashboard/index.html"
    users :
        admin :
            "name" : "myadmin"
            "password" : "fakepassword"
        gi :
            "name" : "gi"
            "password" : "gipassword"

# Error Handlers
casper.on 'http.status.404', (resource) -> @echo("404", resource.url)



# Initialize Casper
casper.start casper.settings.url



# Utility Functions
casper.d =

    login : (user) ->
        casper.then ->
            @fill "#account form", user, false
            @click "#account form input[value='Login']"

        casper.then ->
            @test.assertSelectorHasText "#account span a", user.name, "#{user.name} login is good"


    logout : ->
        casper.then ->
            @click "a[href='#logout']"

        casper.then ->
            @test.assertSelectorExists "#account form", "logout is good"




# Data
casper.ddata =
    gi1 :
        accptdt: "2013-03-09T06:00:00.000Z"
        actualdt: "2013-03-08T06:00:00.000Z"
        appins: "No"
        attmpdt: "2013-03-08T06:00:00.000Z"
        bmtdt: ""
        bmtloc: ""
        bmtmd: ""
        bmttm: ""
        clinic: "Gi"
        clinstg: "Chronic Phase"
        cltrial: "Ineligible"
        datadate: "2013-03-26T05:00:00.000Z"
        dentdt: ""
        dentloc: ""
        dentmd: ""
        denttm: ""
        dtltrfwd: ""
        dtrefer: "2013-03-07T06:00:00.000Z"
        icd9: "160.2, 190.1"
        mdaddy: "123 Fake Street"
        mdoncdt: ""
        mdoncloc: ""
        mdonctm: ""
        mdphone: "1231231234"
        medoncmd: ""
        medrec: "123123123"
        medrecdt: "2013-03-07T06:00:00.000Z"
        offerdt: "2013-03-09T06:00:00.000Z"
        othclnts: ""
        othdt: ""
        other: ""
        othloc: ""
        othmd: ""
        othtm: ""
        plsurdt: ""
        plsurgmd: ""
        plsurloc: ""
        plsurtm: ""
        previns: "Yes"
        ptaddy: "Birmingham, Al"
        ptfstnm: "Aaaron"
        pthowinf: "Friends"
        ptlstnm: "McDowel"
        radoncmd: ""
        radondt: ""
        radonloc: ""
        radontm: ""
        refermd: "Keeha Hosier"
        refnav: "Yes"
        refuabmd: "Barton Guthrie"
        selfrfer: "No"
        surgdt: ""
        surgloc: ""
        surgmd: ""
        surgtm: ""
        tdysdate: "2013-03-09T06:00:00.000Z"
        txelsewh: "Finland"
        txmedonc: "Elsewhere"
        txplan: ""
        txradonc: ""
        txsurg: "UAB"
        typeins: "BLUE ADVANTAGE HUMANA"
        typeinsapp: ""
        uabprtcl: "123123"