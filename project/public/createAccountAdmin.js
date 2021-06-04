var getTeacherClick = 0;
var getStudentClick = 0;
var getGuardianClick = 0;
var fileData;
var myFile;

getTeacher();
$("#createAccount").slideUp();
$(document).ready(function() {
    $("#btnxx").click(function() {
        $(".createAccount").show();
        $("#createAccount").slideToggle();
    });

    $("#reset").click(function() {
        alert('okokoko')
        document.getElementById('myFile').value = ''
        document.getElementById('username').value = ''
        document.getElementById('password').value = ''
        document.getElementById('email').value = ''
        document.getElementById('classID').value = ''
        document.getElementById('level').value = ''
        document.getElementById('phone').value = ''
        document.getElementById('address').value = ''
        document.getElementByName('div.gallery').value = ''
    });
});

$(function() {
    var imagesPreview = function(input, placeToInsertImagePreview) {
        if (input.files) {
            var reader = new FileReader();
            reader.onload = function(event) {
                $($.parseHTML('<img style ="max-width:150px;max-height:200px">')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    $('#myFile').on('change', function() {
        imagesPreview(this, 'div.gallery');

        var filereader = new FileReader();
        filereader.onload = function(event) {
            fileData = event.target.result;
        };
        myFile = $('#myFile').prop('files')[0];
        console.log('myfile', myFile)
        filereader.readAsDataURL(myFile)
    });
});

function signUp() {
    var formData = {
        filename: myFile.name,
        file: fileData,
        username: $("#username").val(),
        password: $("#password").val(),
        email: $("#email").val(),
        role: $("#role").val(),
        routeName: $("#routeTypeS").val(),
        stage: $("#levelS").val(),
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
                    a
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
                    $.each(response.data, function(index, data) {
                        $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></td><td>" + data.username + "</td><td>" + "</td><td>" + data.email + "</td><td>" + "<button class='del' onclick=updateForm('" + data._id + "')>Update</button>" + "</td></tr>");
                    });
                }
            },
            error: function(response) {
                alert('server error');
            }
        });
    }

}

function updateForm(id) {
    $("#updateForm").html("");
    $.ajax({
        url: '/admin/editAccount',
        method: 'get',
        dataType: 'json',
        data: { updateid: id },
        success: function(response) {
            if (response.msg == 'success') {
                alert("lay thong tin ok")
                $.each(response.data, function(index, data) {
                    var update = "<h2>Update ACCOUNT INFORMATION</h2><label for='facultyname'>Avatar</label>Select images: <input type='file' name='myFile1' id='myFile1'><div class='gallery1'></div><br><label>Name</label><input type='text' id='username1' value='" + data.username + "'><br><label for='topic'>Email</label><input type='email' id='email1' value='" + data.email + "'><br><label for='topic'>Password</label><input type='password' id='password1'><br><label for='topic'>Role</label><select class='Role1' id='role1'><option value='student'>Student</option><option value='guardian'>Guardian</option><option value='teacher'>Teacher</option></select><br><label for='level'>Level</label><select class='level1' id='level1'><option value='beginner'>Beginner </option><option value='highBeginner'>High Beginner</option><option value='lowIntermediate'>Low Intermediate</option><option value='intermediate'>Intermediate</option><option value='highAdvanced'>High Advanced </option><option value='advanced'>Advanced</option></select><label for='topic'>Class ID</label><select id='classID1'>{{#each classInfor}}<option value='{{_id}}' id='classID1'>{{className}}</option>{{/each}}<option value='None' id='classID1'>None</option></select><br><label for='topic'>Birthday</label><input type='date' id='birthday1'><br><label for='topic'>Phone</label><input type='text' id='phone1'><br><label for='topic'>Address</label><input type='text' id='address1'><br><button id='btn2' onclick='updateAccount()'>tiến hành cập nhật thông tin tài khoản</button>"
                    $("#updateForm").append(update);
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
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
                    $.each(response.data, function(index, data) {
                        $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.routeName + "</td><td>" + data.stage + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
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
                        $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></td><td>" + data.username + "</td><td>" + "</td><td>" + data.email + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
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
        $(".taskrow tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function routeType() {
    var routeName = $('#routeTypeS').val();
    $.ajax({
        url: '/admin/getStage',
        method: 'get',
        dataType: 'json',
        data: {
            abc: routeName
        },
        success: function(response) {
            if (response.msg == 'success') {
                $('#levelS').html('');
                $.each(response.data, function(index, data) {
                    $.each(data.routeSchedual, function(index, routeSchedual) {
                        var update = "<option value=" + routeSchedual.stage + ">" + routeSchedual.stage + "</option>"
                        $("#levelS").append(update);
                    });
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}