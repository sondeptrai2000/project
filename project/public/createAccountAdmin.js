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
    getAccount('teacher', 0)
    $("#createAccount").slideUp();
    //xử lý file khi tạo tài khoản
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
    //xử lý file khi câpj nhật thông tin tài khoản
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
//tìm kiếm account
$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".taskrow tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


// làm trống thông tin tạo tài khoản
function reset() {
    document.getElementById('myFile').value = ''
    document.getElementById('username').value = ''
    document.getElementById('password').value = ''
    document.getElementById('email').value = ''
    document.getElementById('levelS').value = ''
    document.getElementById('phone').value = ''
    document.getElementById('address').value = ''
    document.getElementById('output').src = ''
}
//thực hiện đăng ký và lưu tài khỏan vào đb
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
                getAccount(role, 0);
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
//lấy danh sách theo role (index)
function getAccount(index, page) {
    var role = index
    var page = page
    $("#loading").show();
    $(".taskrow").html("");
    $(".tableInforType").html("");
    if (index === 'teacher' || index === 'guardian') {
        var tableInfor = "<tr></tr><tr><th>avatar</th><th>username</th><th>sex</th><th>email</th><th>role</th><th>phone</th><th>address</th><th>birthday</th><th>More information</th></tr>"
    } else {
        var tableInfor = "<tr></tr><tr><th>avatar</th><th>username</th><th>sex</th><th>email</th><th>role</th><th>phone</th><th>address</th><th>birthday</th><th>Guardian</th><th>routeName</th><th>stage</th><th>Aim</th><th>More information</th></tr>"
    }
    $("#tableInforType").html(tableInfor);
    $.ajax({
        url: '/admin/getAccount',
        method: 'get',
        dataType: 'json',
        data: { role: index, sotrang: page },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) {
                    if (role == 'teacher' || role == 'guardian') {
                        $(".taskrow").append("<tr id ='" + data._id + "'><td><img style ='max-width:100px;max-height:100px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.sex + "</td><td>" + data.email + "</td><td>" + data.role + "</td><td>" + data.phone + "</td><td>" + data.address + "</td><td>" + data.birthday + "</td><td><button onclick=updateForm('" + data._id + "')>Update</button></td></tr>");
                    } else {
                        if (data.guardian) {
                            $(".taskrow").append("<tr id ='" + data._id + "'><td><img style ='max-width:100px;max-height:100px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.sex + "</td><td>" + data.email + "</td><td>" + data.role + "</td><td>" + data.phone + "</td><td>" + data.address + "</td><td>" + data.birthday + "</td><td><img style ='max-width:100px;max-height:100px' src='" + data.guardian.avatar + "'><br>" + data.guardian.username + "</td><td>" + data.routeName + "</td><td>" + data.stage + "</td><td>" + data.aim + "</td><td><button onclick=updateForm('" + data._id + "')>Update</button></td></tr>");
                        } else {
                            $(".taskrow").append("<tr id ='" + data._id + "'><td><img style ='max-width:100px;max-height:100px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.sex + "</td><td>" + data.email + "</td><td>" + data.role + "</td><td>" + data.phone + "</td><td>" + data.address + "</td><td>" + data.birthday + "</td><td>None</td><td>" + data.routeName + "</td><td>" + data.stage + "</td><td>" + data.aim + "</td><td><button onclick=updateForm('" + data._id + "')>Update</button></td></tr>");
                        }
                    }
                });
                $("#soTrang").html("")
                for (let i = 1; i < response.soTrang; i++) {
                    let u = i - 1
                    $("#soTrang").append("<button onclick=getAccount('" + role + "','" + u + "')>" + i + "</button>")
                }
                $("#loading").hide();
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

//phân loại đăng ký khóa học dựa vào role, teacher và guardian không cần cho cả create and update
function routeType(action) {
    if (action === 'create') {
        var routeName = $('#routeTypeS').val();
        $('#levelS').html('');
        $("#Aim").html('');
    } else if (action === 'update') {
        var routeName = $('#routeTypeSUpdate').val();
        $('#levelSUpdate').html('');
        $("#AimUpdate").html('');
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
                    $.each(response.data, function(index, data) {
                        $.each(data.routeSchedual, function(index, routeSchedual) {
                            var update = "<option value=" + routeSchedual.stage + ">" + routeSchedual.stage + "</option>"
                            $("#levelS").append(update);
                            $("#Aim").append(update);
                        });
                    });
                } else if (action === 'update') {
                    $.each(response.data, function(index, data) {
                        if ($("#routeTypeSUpdate").val() == data.routeName) {
                            $.each(data.routeSchedual, function(index, routeSchedual) {
                                var update = "<option value=" + routeSchedual.stage + ">" + routeSchedual.stage + "</option>"
                                $("#levelSUpdate").append(update);
                                $("#AimUpdate").append(update);
                            });
                        }
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
        var currentRole = $("#currentRole").val()
        if ((currentRole == "techer" || currentRole == "guardian") != accountRole) {
            $('.typeRole').slideDown()
            $("#routeTypeSUpdate").html("")
            $.ajax({
                url: '/admin/getRoute',
                method: 'get',
                dataType: 'json',
                success: function(response) {
                    if (response.msg == 'success') {
                        $.each(response.data, function(index, data) {
                            var update = "<option value=" + data.routeName + ">" + data.routeName + "</option>"
                            $("#routeTypeSUpdate").append(update)
                        });
                    }
                }
            })
        }
    }
    if (accountRole === "guardian" || accountRole === "teacher") {
        $('.typeRole').slideUp()
    } else {
        $('.typeRole').slideDown()
    }
}
//ghi ra thông tin cũ trong form update
var changeType = false;

function updateForm(id) {
    $('#levelSUpdate').html('');
    $("#AimUpdate").html('');
    $("#updateForm").fadeIn(2000);
    var selector = "#" + id + " td"
    var infor4 = []
    $(selector).each(function() {
        infor4.push($(this).text())
    })
    $("#PersonID").val(id)
    $("#oldAvatar").attr("src", $("#" + id + " img").attr('src'));
    $("#usernameUpdate").val(infor4[1])
    $('#genderUpdate option:selected').removeAttr('selected');
    $("#genderUpdate option[value='" + infor4[2] + "']").attr('selected', 'selected');
    $("#emailUpdate").val(infor4[3])
    $("#currentRole").val(infor4[4])
    $('#roleUpdate option:selected').removeAttr('selected');
    $("#roleUpdate option[value='" + infor4[4] + "']").attr('selected', 'selected');
    $("#phoneUpdate").val(infor4[6])
    $("#addressUpdate").val(infor4[7])
    $("#birthdayUpdate").val(infor4[8])
    role('update');
    console.log(infor4)
    $.ajax({
        url: '/admin/editAccount',
        method: 'get',
        dataType: 'json',
        data: { updateid: id },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.targetxxx, function(index, targetxxx) {
                    if (targetxxx.routeName == infor4[9]) {
                        var routeOption = "<option value='" + targetxxx.routeName + "'>" + targetxxx.routeName + "</option>"
                        $("#routeTypeSUpdate").append(routeOption);
                        $("#routeTypeSUpdate option[value='" + infor4[9] + "']").attr('selected', 'selected');
                        $.each(targetxxx.routeSchedual, function(index, routeSchedual) {
                            var Schudelstage = "<option value='" + routeSchedual.stage + "'>" + routeSchedual.stage + "</option>"
                            $("#levelSUpdate").append(Schudelstage);
                            $('#levelSUpdate option:selected').removeAttr('selected');
                            $("#levelSUpdate option[value='" + infor4[10] + "']").attr('selected', 'selected');
                            $("#AimUpdate").append(Schudelstage);
                            $('#AimUpdate option:selected').removeAttr('selected');
                            $("#AimUpdate option[value='" + infor4[11] + "']").attr('selected', 'selected');
                        });
                    }
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
//cập nhạta thông tin tk
function doUpdate() {
    if (!fileDataUpdate) {
        fileDataUpdate = "none"
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
        aim: $("#AimUpdate").val(),
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
                $('#updateForm').fadeOut(2000);
                getAccount($("#roleUpdate").val(), 0);
                $("#routeTypeSUpdate option[value='" + response.data.routeName + "']").attr('selected', 'selected');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}