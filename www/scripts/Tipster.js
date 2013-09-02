var server = "http://286b8657d1a24560a47a56602d0e55db.cloudapp.net/Default.aspx/";
//var server = "http://localhost:2326/Default.aspx/";

//Global ajax error handler
function ErrorHandler(xhr, textStatus, ex) {
    var response = xhr.responseText;
    if (response.length > 11 && response.substr(0, 11) === '{"Message":' &&
        response.charAt(response.length - 1) === '}') {

        var exInfo = JSON.parse(response);
        var text = exInfo.Message //+ "\r\n" +
        //"Exception: " + exInfo.ExceptionType;
        // + exInfo.StackTrace;
        alert(text);
    } else {
        console.log(xhr.responseText);
        alert("thiserror");
    }
}

function GetTipster(UUID, success) {
    alert('getting tipster ' + UUID);

    AjaxHelper(UUID, "GetTipster", "'UUID':'" + UUID + "'", function (data) {
        if (typeof success == "function") success(data)
    })
}

function AddTipster(UUID) {
    AjaxHelper(UUID, "AddTipster", "'UUID':'" + UUID + "'")
}

function SetNickname(UUID, nickname) {
    AjaxHelper(UUID, "SetNickname", "'UUID':'" + UUID + "', 'Nickname':'" + nickname + "'")
}

function SetSubscriptionExpiry(UUID, expirydate) {
    AjaxHelper(UUID, "SetSubscriptionExpiry", "'UUID':'" + UUID + "', 'SubscriptionExpiry':'" + expirydate + "'")
}

function UpdateUsage(UUID) {
    AjaxHelper(UUID, "UpdateUsage", "'UUID':'" + UUID + "'")
}

function AjaxHelper(UUID, action, data, success) {
    $.ajax({
        type: "POST",
        url: server + action,
        data: "{" + data + "}",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data, status) {
            if (typeof success == "function") {
                if (data.d != null) {
                    success(data.d);
                } else {
                    success(null);
                }
            }
        },
        failure: function (msg) {
            console.log(msg);
        },
        error: ErrorHandler
    });
}