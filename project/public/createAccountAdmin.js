var fileData;
var myFile;
var fileDataUpdate;
var myFileUpdate;



$("#btnxx").click(function() {
    $("#createAccount").slideToggle();
});
// load for all ajax
// $(document).ajaxStart(function() {
//     $("#loading").show();
// });
// $(document).ajaxStop(function() {
//     $("#loading").hide();
// });
$(document).ready(function() {
    getAccount('teacher')
    $("#createAccount").slideUp();


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

    $('#myFileUpdate').on('change', function() {
        var filereaderUpdate = new FileReader();
        filereaderUpdate.onload = function(event) {
            fileDataUpdate = event.target.result;
            var dataURLUpdate = filereaderUpdate.result;
            $("#outputUpdate").attr("src", dataURLUpdate);
        };
        myFileUpdate = $('#myFileUpdate').prop('files')[0];
        console.log('myfileUpdate', myFileUpdate)
        filereaderUpdate.readAsDataURL(myFileUpdate)
    });
});

$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    console.log(value)

    $(".taskrow tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});



function reset() {
    document.getElementById('myFile').value = ''
    document.getElementById('username').value = ''
        // document.getElementById('password').value = ''
    document.getElementById('email').value = ''
    document.getElementById('levelS').value = ''
    document.getElementById('phone').value = ''
    document.getElementById('address').value = ''
    document.getElementById('output').src = ''
}

function signUp() {
    var role = $("#role").val()
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
                reset();
                getAccount(role);
                $("#createAccount").slideUp();
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
    $("#loading").show();
    $(".taskrow").html("");
    $(".tableInforType").html("");
    var tableInfor
    if (index === 'teacher' || index === 'guardian') {
        tableInfor = "<tr></tr><tr><th>avatar</th><th>username</th><th>email</th><th>role</th><th>sex</th><th>phone</th><th>address</th><th>birthday</th><th>More information</th></tr>"
    } else {
        tableInfor = "<tr></tr><tr><th>avatar</th><th>username</th><th>routeName</th><th>stage</th><th>Aim</th><th>More information</th></tr>"
    }
    $("#tableInforType").html(tableInfor);

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
                $("#loading").hide();
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}


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
    $("#updateForm").fadeIn(2000);
    $.ajax({
        url: '/admin/editAccount',
        method: 'get',
        dataType: 'json',
        data: { updateid: id },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) {
                    $("#PersonID").val(data._id)
                    var oldAva = "data:image/jpeg;base64," + data.avatar
                    $("#oldAvatar").attr("src", oldAva);
                    $("#usernameUpdate").val(data.username)
                    $("#emailUpdate").val(data.email)
                    $("#passwordUpdate").val(data.password)
                    $("#phoneUpdate").val(data.phone)
                    $("#addressUpdate").val(data.address)
                    var routeName = data.routeName
                    var stage = data.stage
                    var aim = data.aim
                    $('#roleUpdate option:selected').removeAttr('selected');
                    $("#roleUpdate option[value='" + data.role + "']").attr('selected', 'selected');
                    role('update');
                    $.each(response.targetxxx, function(index, targetxxx) {
                        if (targetxxx.routeName == routeName) {
                            var routeOption = "<option value='" + targetxxx.routeName + "'>" + targetxxx.routeName + "</option>"
                            $("#routeTypeSUpdate").append(routeOption);
                            $("#routeTypeSUpdate option[value='" + routeName + "']").attr('selected', 'selected');
                            $.each(targetxxx.routeSchedual, function(index, routeSchedual) {
                                var Schudelstage = "<option value='" + routeSchedual.stage + "'>" + routeSchedual.stage + "</option>"
                                $("#levelSUpdate").append(Schudelstage);
                                $('#levelSUpdate option:selected').removeAttr('selected');
                                $("#levelSUpdate option[value='" + stage + "']").attr('selected', 'selected');
                                $("#AimUpdate").append(Schudelstage);
                                $('#AimUpdate option:selected').removeAttr('selected');
                                $("#AimUpdate option[value='" + aim + "']").attr('selected', 'selected');
                            });
                        }
                    });
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

$("#closeUpdateForm").click(function() {
    $('#updateForm').fadeOut(2000);
});

function doUpdate() {
    if (!fileDataUpdate) {
        fileDataUpdate = "none"
    } else {
        fileDataUpdate.split("data:image/jpeg;base64,")[1]
    }
    var formData = {
        _id: $("#PersonID").val(),
        file: fileDataUpdate,
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