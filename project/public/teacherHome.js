var fileData;
var myFile;

$(document).ready(function() {

    teacherProfile()


    $('#myFile').on('change', function() {
        var filereader = new FileReader();
        filereader.onload = function(event) {
            fileData = event.target.result;
            var dataURL = filereader.result;
            $("#output").attr("src", dataURL);
        };
        myFile = $('#myFile').prop('files')[0];
        console.log('myfile', myFile)
        filereader.readAsDataURL(myFile)
    });
});


function teacherProfile() {
    $.ajax({
        url: '/teacher/teacherProfile',
        method: 'get',
        dataType: 'json',
        data: {},
        success: function(response) {
            if (response.msg == 'success') {
                $("#avatarProfile").attr("src", response.data.avatar);
                $("#idProfile").html(response.data._id);
                $("#usernameProfile").html("Full Name: " + response.data.username);
                $("#genderProfile").html("Gender: " + response.data.sex);
                $("#emailProfile").html("Email: " + response.data.email);
                $("#phoneProfile").html("Phone: " + response.data.phone);
                $("#birthdayProfile").html("BirthDay: " + response.data.birthday);
                $("#addressProfile").html("Address: " + response.data.address);
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function updateProfile() {
    $("#avatarOldProfile").attr("src", $('#avatarProfile').attr('src'));
    $("#idProfileUpdate").html($("#idProfile").text());
    $("#usernameUpdate").val($("#usernameProfile").text().split("Full Name: ")[1]);
    $("#genderUpdate").val($("#genderProfile").text().split("Gender: ")[1]);
    $("#emailUpdate").val($("#emailProfile").text().split("Email: ")[1]);
    $("#phoneUpdate").val($("#phoneProfile").text().split("Phone: ")[1]);
    $("#birthdayUpdate").val($("#birthdayProfile").text().split("BirthDay: ")[1]);
    $("#addressUpdate").val($("#addressProfile").text().split("Address: ")[1]);
    $(".content1").toggle(2000);
}


function doUpdateProfile() {
    if (!fileData) {
        fileData = "none"
    }
    var password = $("#newPassWord").val()
    var formData1 = {
        sex: $("#genderUpdate").val(),
        username: $("#usernameUpdate").val(),
        email: $("#emailUpdate").val(),
        phone: $("#phoneUpdate").val(),
        address: $("#addressUpdate").val(),
        birthday: $("#birthdayUpdate").val(),
        avatar: $('#avatarOldProfile').attr('src'),
    };

    $.ajax({
        url: '/teacher/doeditAccount',
        method: 'post',
        dataType: 'json',
        data: {
            id: $("#idProfileUpdate").text(),
            password: password,
            formData1: formData1,
            file: fileData,
            oldLink: $('#avatarOldProfile').attr('src'),
        },
        success: function(response) {
            if (response.msg == 'success') {
                teacherProfile();
            }
            if (response.msg == 'Account already exists') {
                alert("Account already exists")
            }
            if (response.msg == 'Phone already exists') {
                alert("Phone already exists")
            }
            if (response.msg == 'error') {
                alert("error")
            }
        },
        error: function(response) {
            alert('server error');
        }
    })


}