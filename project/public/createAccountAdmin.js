var getTeacherClick = 0;
var getStudentClick = 0;
var getGuardianClick = 0;
var accountInformation;
getTeacher();
$("#createAccount").slideUp();
$(document).ready(function() {
    $("#btnxx").click(function() {
        $(".createAccount").show();
        $("#createAccount").slideToggle();
    });
});

function signUp() {
    var formData = {
        username: $("#username").val(),
        password: $("#password").val(),
        email: $("#email").val(),
        classID: $("#classID").val(),
        role: $("#role").val(),
        level: $("#level").val(),
        phone: $("#phone").val(),
        address: $("#address").val(),
    };
    $.ajax({
        url: '/admin/doCreateAccount',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                if (formData.role == "student") {
                    getStudent();
                } else if (formData.role == "teacher") {
                    getTeacher();
                } else if (formData.role == "guardian") {
                    getGuardian();
                }
                alert('Sign Up success');
            }
            if (response.msg == 'Account already exists') {
                alert('Account already exists');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function getTeacher() {
    getTeacherClick = getTeacherClick + 1;
    getStudentClick = 0;
    getGuardianClick = 0;

    if (getTeacherClick == 1) {
        $(".taskrow").html("");
        $.ajax({
            url: '/admin/allTeacher',
            method: 'get',
            dataType: 'json',
            data: {},
            success: function(response) {
                if (response.msg == 'success') {
                    accountInformation = response.data;
                    $.each(response.data, function(index, data) {
                        $(".taskrow").append("<tr id='myList'><td>" + data.username + "</td><td>" + data.level + "</td><td>" + data.email + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
                    });
                }
            },
            error: function(response) {
                alert('server error');
            }
        });
    }

}

function getStudent() {
    getStudentClick = getStudentClick + 1;
    getTeacherClick = 0;
    getGuardianClick = 0;
    if (getStudentClick == 1) {
        $(".taskrow").html("");
        $.ajax({
            url: '/admin/allStudent',
            method: 'get',
            dataType: 'json',
            data: {},
            success: function(response) {
                if (response.msg == 'success') {
                    accountInformation = response.data;
                    $.each(response.data, function(index, data) {
                        $(".taskrow").append("<tr id='myList'><td>" + data.username + "</td><td>" + data.level + "</td><td>" + data.email + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
                    });
                }
            },
            error: function(response) {
                alert('server error');
            }
        });
    }
}


function getGuardian() {
    getGuardianClick = getGuardianClick + 1;
    getTeacherClick = 0;
    getStudentClick = 0;
    if (getGuardianClick == 1) {
        $(".taskrow").html("");
        $.ajax({
            url: '/admin/allGuardian',
            method: 'get',
            dataType: 'json',
            data: {},
            success: function(response) {
                if (response.msg == 'success') {
                    accountInformation = response.data;
                    $.each(response.data, function(index, data) {
                        $(".taskrow").append("<tr id='myList'><td>" + data.username + "</td><td>" + data.level + "</td><td>" + data.email + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
                    });
                }
            },
            error: function(response) {
                alert('server error');
            }
        });
    }
}

$(document).ready(function() {
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myList td").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});