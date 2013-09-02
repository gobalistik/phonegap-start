// Global variable that will tell us if PhoneGap is ready
var isPhoneGapReady = false;

// Default all phone types to false
var isAndroid = false;
var isBlackberry = false;
var isIphone = false;
var isWindows = false;

// Store the device's uuid
var deviceUUID;

// Store the current network status
var isConnected = false;
var isHighSpeed;
var internetInterval;

var currentUrl;

var isTeamsBound = false;
var isSelectionsBound = false;
var isResultsBound = false;

var teamsVM;

var pagezero;

function init(url) {
    if (typeof url != 'string') {
        currentUrl = location.href;
    } else {
        currentUrl = url;
    }

    if (isPhoneGapReady) {
        onDeviceReady();
    } else {
        // Add an event listener for deviceready
        document.addEventListener("deviceready", 
            onDeviceReady, false);
      }
}

function onDeviceReady() {
    //alert('ondeviceready');
    //window.clearInterval(intervalID);

    // set to true
    isPhoneGapReady = true;
    
    deviceUUID = device.uuid;
    
    // detect the device's platform
    deviceDetection();
    
    // detect for network access
    networkDetection();
    
    // execute any events at start up
    executeEvents();
    
    // execute a callback function
    executeCallback();

    alert('before GetTipster ' + deviceUUID);
    GetTipster(deviceUUID, function (data) {
        alert('data ' + data);
        if (data == null) {
            alert("writing new tipster")
            AddTipster(deviceUUID);
            SetNickname(deviceUUID, "gobalistik");
            SetSubscriptionExpiry(deviceUUID, "12/25/13");
            UpdateUsage(deviceUUID);

        } else {
            console.log("getting tipster")
        }
    });
    alert('after GetTipster ' + deviceUUID);
}

function executeEvents() {
    if (isPhoneGapReady) {
        // attach events for online and offline detection
        document.addEventListener("online", onOnline, false);
        document.addEventListener("offline", onOffline, false);
        
        // attach events for pause and resume detection
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        
        // set a timer to check the network status
        internetInterval = window.setInterval(function() {
              if (navigator.network.connection.type != Connection.NONE) {
                onOnline();
              } else {
                onOffline();
              }
          }, 5000);
    }
}

function executeCallback() {
    //alert('executecallback');
    if (isPhoneGapReady) {
        // get the name of the current html page
        var pages = currentUrl.split("/");
        var currentPage = pages[pages.length - 1].slice(0, pages[pages.length - 1].indexOf(".html"));

        // capitalize the first letter and execute the function
        currentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

       // alert('executeCallback ' + 'on' + currentPage + 'Load');
        if (typeof window['on' + currentPage + 'Load'] == 'function') {
            window['on' + currentPage + 'Load']();
        }
    }
}

function deviceDetection() {
    if (isPhoneGapReady) {
        switch (device.platform) {
            case "Android":
                isAndroid = true;
                break;
            case "Blackberry":
                isBlackberry = true;
                break;
            case "iPhone":
                isIphone = true;
                break;
            case "WinCE":
                isWindows = true;
                break;
        }
    }
}

function networkDetection() {
    if (isPhoneGapReady) {
        // as long as the connection type is not none, 
        // the device should have Internet access
        if (navigator.network.connection.type != Connection.NONE) {
            isConnected = true;
        }
        
        // determine if this connection is high speed or not
        switch (navigator.network.connection.type) {
            case Connection.UNKNOWN:
            case Connection.CELL_2G:
                isHighSpeed = false;
                break;
            default:
                isHighSpeed = true;
                break;
        }
    }
}

function onOnline() {
    isConnected = true;
}

function onOffline() {
    isConnected = false;
}

function onPause() {
    isPhoneGapReady = false;
    
    // clear the Internet check interval
    window.clearInterval(internetInterval);
}

function onResume() {
    // don't run if phonegap is already ready
    if (isPhoneGapReady == false) {
        alert('resuming');
        init(currentUrl);
    }
}

// This gets called by jQuery mobile when the page has loaded
//$(document).bind("pageload", function (event, data) {
//    init(data.url);
//});

function onSelectionsLoad() {
    //console.log('onSelectionsLoad');
    //if (!isSelectionsBound) {
    //    ko.applyBindings(SelectionsViewModel());
    //    isSelectionsBound = true;
    //    console.log('isSelectionsBound' + isSelectionsBound);
    //}
}

function onTeamsLoad() {
    //console.log('onTeamsLoad');

    $.ajax({
        type: "POST",
        url: "http://286b8657d1a24560a47a56602d0e55db.cloudapp.net/default.aspx/GetTeams",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data, status) {
            // parse it as object
            //console.log(data.d);

            // creating html string
            var listString = '<ul data-role="listview" id="customerList">';

            // running a loop
            $.each(data.d, function (index, value) {
                listString += '<li><a href="#" >' + this.name + '</a></li>';
            });
            listString += '</ul>';

            //appending to the div
            $('#teamlist').html(listString);

            // refreshing the list to apply styles
            $('#teamlist ul').listview();
            console.log($('#teamlist'));
            console.log($('#teamlist ul'));
        },
        failure: function (msg) {
            alert(msg);
        },
        error: function (msg) {
            alert(msg);
        }
    });
}



    ////load the footer.  this is done asyncronously, the second param is a callback when load is complete.
    //Works in the emulator but not on iphone, arrgh
    //$('#footer').load('footer.html', function ()
    //{
    //    console.log($('#footer'));
    //    console.log($('#footer ul'));

          //refresh the footer div containing the nav to apply styles
    //    $('#footer div').navbar();
    //});

function onResultsLoad() {
    //console.log('onResultsLoad');

    if (!isResultsBound) {
        ko.applyBindings(new ResultsViewModel());
        isResultsBound = true;
        //console.log('isResultsBound' + isResultsBound);
    }
}

$(document).bind("pagechange", function (event, data) {
    init(data.toPage[0].id + '.html');
});

$(document).bind("mobileinit", function () {
  $.mobile.page.prototype.options.addBackBtn = true;
});

// Set an onload handler to call the init function
window.onload = init;
