var getTeacherClick = 0;
var getStudentClick = 0;
var getGuardianClick = 0;
var fileData;
var myFile;
var fileDataUpdate;
var myFileUpdate;

getAccount('teacher')
$("#createAccount").slideUp();
$(document).ready(function() {
    $("#btnxx").click(function() {
        $(".createAccount").show();
        $("#createAccount").slideToggle();
    });

    $("#reset").click(function() {
        document.getElementById('myFile').value = ''
        document.getElementById('username').value = ''
        document.getElementById('password').value = ''
        document.getElementById('email').value = ''
        document.getElementById('levelS').value = ''
        document.getElementById('phone').value = ''
        document.getElementById('address').value = ''
        document.getElementById('gallery').innerHTML = ''
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

    $('#myFileUpdate').on('change', function() {
        imagesPreview(this, 'div.galleryUpdate');
        var filereaderUpdate = new FileReader();
        filereaderUpdate.onload = function(event) {
            fileDataUpdate = event.target.result;
        };
        myFileUpdate = $('#myFileUpdate').prop('files')[0];
        console.log('myfile', myFileUpdate)
        filereaderUpdate.readAsDataURL(myFileUpdate)
    });
});

function signUp() {
    alert($("#Aim").val())
    var formData = {
        filename: myFile.name,
        file: fileData,
        username: $("#username").val(),
        password: $("#password").val(),
        email: $("#email").val(),
        role: $("#role").val(),
        aim: $("#Aim").val(),
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

function getAccount(index) {
    var tableInfor
    if (index === 'teacher' || index === 'guardian') {
        tableInfor = "<tr><th><input id='myInput' type='text' placeholder='Search..'></th></tr><tr><th>avatar</th><th>username</th><th>email</th><th>role</th><th>sex</th><th>phone</th><th>address</th><th>birthday</th><th>More information</th></tr>"
        $("#tableInforType").html(tableInfor);
    } else {
        tableInfor = "<tr><th><input id='myInput' type='text' placeholder='Search..'></th></tr><tr><th>avatar</th><th>username</th><th>routeName</th><th>stage</th><th>Aim</th><th>More information</th></tr>"
        $("#tableInforType").html(tableInfor);
    }
    $(".taskrow").html("");
    $.ajax({
        url: '/admin/getAccount',
        method: 'get',
        dataType: 'json',
        data: { role: index },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) {
                    if (index === 'teacher' || index === 'guardian') {
                        $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></td><td>" + data.username + "</td><td>" + "</td><td>" + data.email + "</td><td>" + data.role + "</td><td>" + data.sex + "</td><td>" + data.phone + "</td><td>" + data.address + "</td><td>" + data.birthday + "</td><td><button onclick=updateForm('" + data._id + "')>Update " + data._id + "</button></td></tr>");
                    } else {
                        $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.routeName + "</td><td>" + data.stage + "</td><td>" + data.aim + "</td><td><button onclick=updateForm('" + data._id + "')>Update " + data._id + "</button></td></tr>");
                    }
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

$(document).ready(function() {
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".taskrow tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function routeType(action) {
    if (action === 'create') {
        var routeName = $('#routeTypeS').val();
    } else if (action === 'update') {
        var routeName = $('#routeTypeSUpdate').val();
    }
    $.ajax({
        url: '/admin/getStage',
        method: 'get',
        dataType: 'json',
        data: {
            abc: routeName
        },
        success: function(response) {
            if (response.msg == 'success') {
                if (action === 'create') {
                    $('#levelS').html('');
                    $("#Aim").html('');
                    $.each(response.data, function(index, data) {
                        $.each(data.routeSchedual, function(index, routeSchedual) {
                            var update = "<option value=" + routeSchedual.stage + ">" + routeSchedual.stage + "</option>"
                            $("#levelS").append(update);
                            $("#Aim").append(update);
                        });
                    });
                } else if (action === 'update') {
                    $('#levelSUpdate').html('');
                    $("#AimUpdate").html('');
                    $.each(response.data, function(index, data) {
                        $.each(data.routeSchedual, function(index, routeSchedual) {
                            var update = "<option value=" + routeSchedual.stage + ">" + routeSchedual.stage + "</option>"
                            $("#levelSUpdate").append(update);
                            $("#AimUpdate").append(update);

                        });
                    });
                }

            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function role(action) {
    if (action === 'create') {
        var accountRole = $('#role').val();
    } else if (action === 'update') {
        var accountRole = $('#roleUpdate').val();
    }
    if (accountRole === "guardian" || accountRole === "teacher") {
        $('.typeRole').slideUp()
    } else {
        $('.typeRole').slideDown()
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
                $.each(response.data, function(index, data) {
                    var update = "<h2>ACCOUNT update INFORMATION</h2><label>Old Avatar</label><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></img><br><label>Update Avatar</label> Select images: <input type='file' name='myFileUpdate' id='myFileUpdate'><div class='galleryUpdate' id='galleryUpdate'></div><br><label>Name</label><input type='text' value ='" + data.username + "' id='usernameUpdate'><br><label >Email</label><input type='email'  value ='" + data.email + "' id='emailUpdate' class='emailinput'><br><label >Password</label><input type='password' value ='" + data.password + "' id='passwordUpdate'><br>"
                    var roleroute = "<label >Role</label><select class='Role' id='roleUpdate' onchange=role('update')></select><br><div class='typeRole'><label>Chọn lộ trình học</label><select id='routeTypeSUpdate' onchange=routeType('update')></select><br>"
                    var stageAimOther = "<label>Level</label><select id='levelSUpdate'></select><br><label>Aim</label><select id='AimUpdate'></select></div><br><label >Birthday</label><input type='date'  value ='" + data.birthday + "' id='birthdayUpdate'><br><label >Phone</label><input type='text' value ='" + data.phone + "' id='phoneUpdate'><br><label >Address</label><input type='text' value ='" + data.address + "'id='addressUpdate'><br><button id='btn2' onclick=doUpdate('" + data._id + "')>tiến hành tạo tài khoản</button></div>"
                    $("#updateForm").append(update + roleroute + stageAimOther);
                    if (data.role === "teacher") {
                        $("#roleUpdate").append("<option value='" + data.role + "'>" + data.role + "</option><option value='student'>Student</option><option value='guardian'>Guardian</option>");
                    }
                    if (data.role === "student") {
                        $("#roleUpdate").append("<option value='" + data.role + "'>" + data.role + "</option><option value='teacher'>Teacher</option><option value='guardian'>Guardian</option>");
                    }
                    if (data.role === "guardian") {
                        $("#roleUpdate").append("<option value='" + data.role + "'>" + data.role + "</option><option value='teacher'>Teacher</option><option value='student'>Student</option>");
                    }
                    $.each(response.targetxxx, function(index, targetxxx) {
                        var routeOption = "<option value='" + targetxxx.routeName + "'>" + targetxxx.routeName + "</option>{{/each}}"
                        $("#routeTypeSUpdate").append(routeOption);
                    });
                });

            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}



function doUpdate(id) {
    var formData = {
        _id: id,
        username: $("#usernameUpdate").val(),
        password: $("#passwordUpdate").val(),
        email: $("#emailUpdate").val(),
        role: $("#roleUpdate").val(),
        routeName: $("#routeTypeSUpdate").val(),
        stage: $("#levelSUpdate").val(),
        phone: $("#phoneUpdate").val(),
        address: $("#addressUpdate").val(),
    };
    $.ajax({
        url: '/admin/doeditAccount',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('update success');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}