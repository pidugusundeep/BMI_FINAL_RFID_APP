function login() {
    if ($('#login_Id').val() != "") {
        $.ajax('http://localhost:3000/api/Customer/' + $('#login_Id').val(),
            {
                dataType: 'json', // type of response data
                timeout: 500,     // timeout milliseconds
                type: 'GET',
                async: false,
                success: function (data, status, xhr) {
                    sessionStorage.setItem("userId", data.userId);
                    sessionStorage.setItem("age", data.age);
                    window.location = "passengerview.html"
                },
                error: function (jqXhr, textStatus, errorMessage) {
                    $.ajax('http://localhost:3000/api/Airlines/' + $('#login_Id').val(),
                        {
                            dataType: 'json', // type of response data
                            timeout: 500,     // timeout milliseconds
                            type: 'GET',
                            async: false,
                            success: function (data, status, xhr) {
                                window.location = "index.html"
                            },
                            error: function (jqXhr, textStatus, errorMessage) {
                                Materialize.toast('Invalid Login Details', 3000);
                                $('#login_Id').val("")
                                $('#login_Id').focus();
                            }
                        });
                }
            });
    }
    else{
        Materialize.toast('Id cannot be empty !', 3000);
        $('#login_Id').val("")
        $('#login_Id').focus();
    }
}
function register(a) {
    if (a != 1) {
        $('#modal1').modal('open')
    }
    else {
        $('#Loader').modal('open');
        $.get("http://localhost:3000/api/Account", function (data) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/api/Account",
                data: { "$class": "org.acme.sample.Account", "accountId": "A" + data.length + 1, "balance": 0 },
                dataType: 'json',
                success: function (data1) {
                    $.get("http://localhost:3000/api/Customer", function (customerData) {
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:3000/api/Customer",
                            data: { "$class": "org.acme.sample.Customer", "firstName": $('#fname').val(), "lastName": $('#lname').val(), "customerAccount": "resource:org.acme.sample.Account#" + data1.accountId, "userId": "P" + parseInt(customerData.length + 1), "age": $('#age').val(), "dateOfTravel": "-- ", "baggageId": "--", "airportName": "--", "airlineName": "--", "airlineDestinationTime": "--", "baggageDestinationTime": "--" },
                            dataType: 'json',
                            success: function (data) {
                                Materialize.toast('New Passenger added !', 3000);
                                sessionStorage.setItem("userId", data.userId);
                                sessionStorage.setItem(" age", data.age);
                                window.location = "passengerview.html"
                            }
                        });
                    });
                }
            });
        });
    }
}
$(document).ready(function () {
    $('.modal').modal({
        dismissible: false,
    });
    $('#loader').hide();
});
