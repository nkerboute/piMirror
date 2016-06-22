function loadUserData() {

    console.log("checking login status")


    $.ajax({
        url: "http://localhost:8081/getLoginData",
        type: "GET",
        dataType: "json",
        success: function(data) {
            console.log("start")
            console.log(data.primaryKey)
            if (data.primaryKey !== null) {
                editSettings(data.primaryKey)
                console.log("Logged in")
                    //sleep(60)
                    //resetSettings();
                setTimeout(function() {
                    resetSettings();
                    loadUserData();
                }, 60000);
            } else {
                setTimeout(loadUserData, 1000);
            }
            console.log("end")
        },
        error: function(e) {
            console.log("There was an error communicating with the userServer service. Is it Running?");
            console.log(e.statusText);
            setTimeout(loadUserData, 3000);
        },
        timeout: 15000
    })



}

function editSettings(key) {
    console.log("/userSettings/" + key + ".json")
    $.getJSON("/userSettings/" + key + ".json", function(data) {
        console.log(data);
        console.log(data.settings);

        //console.log("Mor" + data.settings[0].compliments.morning)
        //console.log("Aftern" + data.settings[0].compliments.afternoon)
        //console.log("Even" + data.settings[0].compliments.evening)

        loadedSettings.userLoggedIn = 1;

        //handle compliments
        loadedSettings.compliments.morning = data.settings[0].compliments.morning.slice();
        loadedSettings.compliments.afternoon = data.settings[0].compliments.afternoon.slice();
        loadedSettings.compliments.evening = data.settings[0].compliments.evening.slice();

        //handle map and traffic stuff
        loadedSettings.destinations = {} // clean the object
        console.log(data.settings[1].destinations)
        for (var property in data.settings[1].destinations) {
            if (data.settings[1].destinations.hasOwnProperty(property)) {
                loadedSettings.destinations[property] = data.settings[1].destinations[property];
            }
        }
        loadedSettings.avoid = data.settings[1].avoid.slice();
        loadedSettings.method = data.settings[1].method;

        loadedSettings.googleCalendar = data.settings[2].googleCalendar.ical;
        calendar_init();
        //console.log("destinations after login ")
        //console.log(loadedSettings.destinations
        //compliment_init();

        /*$.each( data, function( key, val ) {
            console.log(key + "value:: " + val );
        });*/
    });
}

function resetSettings() {

    loadedSettings.compliments.evening = config.compliments.morning.slice();
    loadedSettings.compliments.afternoon = config.compliments.afternoon.slice();
    loadedSettings.compliments.evening = config.compliments.evening.slice();

    loadedSettings.destinations = jQuery.extend({}, config.maps.destinations);
    loadedSettings.avoid = config.maps.avoid.slice();
    loadedSettings.method = config.maps.method;
    loadedSettings.googleCalendar = config.googleCalendar.ical

    loadedSettings.userLoggedIn = 0;
    destroyCal();

}
