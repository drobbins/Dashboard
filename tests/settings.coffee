# Create the settings object
casper.settings =
    url : "http://localhost:5984/dashboard/_design/dashboard/index.html"
    users :
        admin :
            "name" : "robbinsd"
            "password" : "password"

# Error Handlers
casper.on 'http.status.404', (resource) -> @echo("404", resource.url)

# Initialize Casper
casper.start casper.settings.url