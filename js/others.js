
function delayfunction() {
    if (delaytime.value == "") {
        alert('Invalid delay time');
    }
    else {
        d = new Date()
        var mon = parseInt(d.getMonth()) + 1;
        var mon1 = mon.toString();
        if (mon1.length < 2)
            mon1 = "0" + mon1;
        // timestamp = d.getFullYear()+"-"+mon1+"-"+d.getDate()+"T"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds()+"Z";
        // data =   { "$class": "org.acme.sample.BaggageDelay", "delayTimeInMinutes": parseInt(delaytime.value) , "from": "resource:org.acme.sample.Airlines#AIR01", "to": "resource:org.acme.sample.Customer#"+sessionStorage.getItem("userId") };
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/BaggageDelay",
            data: { "$class": "org.acme.sample.BaggageDelay", "delayTimeInMinutes": parseInt(delaytime.value), "from": "resource:org.acme.sample.Airlines#AIR01", "to": "resource:org.acme.sample.Customer#" + sessionStorage.getItem("userId") },
            dataType: 'text',
            success: function (data) {
                $('#account-balance').empty()
                $('#passenger-details').empty()
                displayUser();
                Materialize.toast('Claimed successfully balance updated !', 3000);
            },
            error: function (jqXhr, textStatus, errorMessage) { // error callback 
                alert(errorMessage);
            }
        });
        console.log(delaytime.value + ' hours');
    }
}
$(document).ready(function () {
    $('select').material_select();
    $('.tabs').tabs();
    $('.modal').modal({
        dismissible: false,
    });
    displayUser();

});
function getFateAmount() {
    var x = ["Chennai", "Visakhapatanam", "Hyderabad"];
    if (($('#AirLine').val() != null) && ($('#date_selected').val() != "")) {
     for (i = 0; i<x.length; i++) {
        data1 = { airline: $('#AirLine').val(), destAirport:x[i], month: $('#date_selected').val().split('-')[1], age: sessionStorage.getItem("age") };
        console.log(data1);
        
        $.ajax('http://localhost:5000/predict',
            {
                type: 'POST',
                CacheControl: "no-cache",
                data: JSON.stringify(data1),
                contentType: "application/json; charset=utf-8",
                traditional: true,
                async: false,
                success: function (data) {
                    console.log(">>>>");
                    data = JSON.parse(data)
                    console.log(data)
                    $('#' + x[i])[0].innerHTML = data.premium + "₹";
                 },
                error: function (errorMessage) {
                    
                }
            });
        }
    }
}
function logout() {
    sessionStorage.clear();
    window.location = "login.html"
}
function displayUser() {
    $.ajax('http://localhost:3000/api/Customer/' + sessionStorage.getItem("userId"),
        {
            dataType: 'json', // type of response data
            timeout: 500,     // timeout milliseconds
            type: 'GET',
            async: false,
            success: function (data, status, xhr) {
                $('#passenger-details').append('' + data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1) + ' ' + data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1) + '');
                $.ajax('http://localhost:3000/api/Account/' + data.customerAccount.split('#')[1],
                    {
                        async: false,
                        dataType: 'json', // type of response data
                        timeout: 500,     // timeout milliseconds
                        type: 'GET',
                        success: function (data1, status, xhr) {
                            $('#account-balance').append('Wallet Balance: ' + data1.balance);
                        },
                        error: function (jqXhr, textStatus, errorMessage) { // error callback 
                            alert(errorMessage);
                        }
                    });
            }
        });
}