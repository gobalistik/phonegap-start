var TeamsViewModel = function () {
    //teamArray = ko.observableArray([{ "Name": "Liverpool" }, { "Name": "Man U" }]);
    teamArray = ko.observableArray([]);

    $.ajax({
        type: "POST",
        url: "http://286b8657d1a24560a47a56602d0e55db.cloudapp.net/default.aspx/GetTeams",
        //url: "http://localhost:2326/Default.aspx/GetTeams",
        //data: "{'value':'314314'}",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            //alert(response.d[0]["name"]);

            var mappedData = $.map(response.d, function (item) {
                var fromJs = ko.mapping.fromJS(item);

                fromJs['name'] = ko.observable(item['name']);
                return fromJs;
            });

            //alert('mappedData=' + mappedData[0]["name"]);

            teamArray(mappedData);
        },
        failure: function (msg) {
            alert(msg);
        },
        error: function (msg) {
            alert(msg);
        }
    });

    //GoHome = function () {
    //    PageStateManager.changePage('index.html', new TeamsViewModel());
    //};

    //GoSelections = function () {
    //    PageStateManager.changePage('selections.html', new SelectionsViewModel());
    //};

    //GoResults = function () {
    //    PageStateManager.changePage('results.html', new ResultsViewModel());
    //};
};