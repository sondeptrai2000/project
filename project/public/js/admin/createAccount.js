var fileData;
var myFile;
var fileDataUpdate;
var myFileUpdate;

$(document).ready(function() {
    getAccount('teacher', 0)
    $(window).on('click', function(e) {
        if ($(e.target).is('.createAccountOut')) $('.createAccountOut').fadeOut(1500);
        if ($(e.target).is('.updateFormOut')) $('.updateFormOut').fadeOut(1500);
    });
    //hiệu ứng menu
    $('header li').hover(function() {
        $(this).find("div").slideDown()
    }, function() {
        $(this).find("div").hide(500)
    });

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
            $("#currentAvatar").attr("src", dataURLUpdate);
        };
        myFileUpdate = $('#myFileUpdate').prop('files')[0];
        console.log('myfileUpdate', myFileUpdate)
        filereaderUpdate.readAsDataURL(myFileUpdate)
    });
});
//tìm kiếm account
$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".taskrow div class='tr'").filter(function() {
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
//lấy danh sách theo role (index)
function getAccount(index, page) {
    var role = index
    var page = page
    $(".tableInforType").html("");
    if (index === 'teacher') {
        var tableInfor = "<div class='tr'>\
        <div class='td'>avatar</div>\
        <div class='td'>username</div>\
        <div class='td'>sex</div>\
        <div class='td'>email</div>\
        <div class='td' style='display:none;'>role</div>\
        <div class='td'>phone</div>\
        <div class='td'>address</div>\
        <div class='td'>birthday</div>\
        <div class='td'>Action</div></div>"
    } else {
        var tableInfor = "<div class='tr'><div class='td'>avatar</div><div class='td'>username</div><div class='td'>sex</div><div class='td'>email</div><div class='td' style='display:none;'>role</div><div class='td'>phone</div><div class='td' style='display:none;'>address</div><div class='td' style='display:none;'>birthday</div><div class='td'>routeName</div><div class='td'>stage</div><div class='td'>Aim</div><div class='td'>Action</div></div >"
    }
    $(".tableAccount").html(tableInfor);
    $.ajax({
        url: '/admin/getAccount',
        method: 'get',
        dataType: 'json',
        data: { role: index, sotrang: page },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) {
                    if (role == 'teacher') $(".tableAccount").append("<div class='tr' id ='" + data._id + "' onclick=search('" + data.email + "')><div class='td'><img style ='max-width:100px;max-height:100px' src='" + data.avatar + "'></div><div class='td'>" + data.username + "</div><div class='td'>" + data.sex + "</div><div class='td'>" + data.email + "</div><div class='td' style='display:none;'>" + data.role + "</div><div class='td'>" + data.phone + "</div><div class='td'>" + data.address + "</div><div class='td'>" + data.birthday + "</div><div class='td'><button onclick=updateForm('" + data._id + "')>Update</button></div></div >");
                    if (role == 'student') $(".tableAccount").append("<div class='tr' id ='" + data._id + "' onclick=search('" + data.email + "')><div class='td'><img style ='max-width:100px;max-height:100px' src='" + data.avatar + "'></div><div class='td'>" + data.username + "</div><div class='td'>" + data.sex + "</div><div class='td'>" + data.email + "</div><div class='td' style='display:none;'>" + data.role + "</div><div class='td'>" + data.phone + "</div><div class='td' style='display:none;'>" + data.address + "</div><div class='td' style='display:none;'>" + data.birthday + "</div><div class='td'>" + data.routeName + "</div><div class='td'>" + data.stage + "</div><div class='td'>" + data.aim + "</div><div class='td' style='display:none;'>" + data.relationship.username + "</div><div class='td' style='display:none;'>" + data.relationship.email + "</div><div class='td' style='display:none;'>" + data.relationship.phone + "</div><div class='td'><button onclick=updateForm('" + data._id + "')>Update</button></div></div >");
                });
                $("#soTrang").html("")
                for (let i = 1; i < response.soTrang; i++) {
                    let u = i - 1
                    $("#soTrang").append("<button onclick=getAccount('" + role + "','" + u + "')>" + i + "</button>")
                }
                search(response.data[0].email)
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
        data: { abc: routeName },
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
    if (action === 'create') var accountRole = $('#role').val();
    if (action === 'update') {
        var accountRole = $('#roleUpdate').val();
        var currentRole = $("#currentRole").val()
        if ((currentRole == "techer") != accountRole) {
            $('.typeRole').slideDown()
            $("#routeTypeSUpdate").html("")
            $.ajax({
                url: '/admin/getRoute',
                method: 'get',
                dataType: 'json',
                success: function(response) {
                    if (response.msg == 'success') {
                        console.log(response.data)
                        $.each(response.data, function(index, data) {
                            var update = "<option value=" + data.routeName + ">" + data.routeName + "</option>"
                            $("#routeTypeSUpdate").append(update)
                        });
                    }
                }
            })
        }
    }
    if (accountRole === "teacher") $('.typeRole').slideUp()
    if (accountRole !== "teacher") $('.typeRole').slideDown()

}

//chuyền thông tin cũ vào form cập nhật thông tin
function updateForm(id) {
    $('#levelSUpdate').html('');
    $("#AimUpdate").html('');
    $(".updateFormOut").fadeIn(2000);
    var selector = "#" + id + " .td"
    var infor4 = []
    $(selector).each(function() {
        infor4.push($(this).text())
    })
    $("#PersonID").val(id)
    $("#currentAvatar").attr("src", $("#" + id + " img").attr('src'));
    $("#oldAvatar").val($("#" + id + " img").attr('src'));
    $("#usernameUpdate").val(infor4[1])
    $('#genderUpdate option:selected').removeAttr('selected');
    $("#genderUpdate option[value='" + infor4[2] + "']").attr('selected', 'selected');
    $("#emailUpdate").val(infor4[3])
    $("#currentRole").val(infor4[4])
    $('#roleUpdate option:selected').removeAttr('selected');
    $("#roleUpdate option[value='" + infor4[4] + "']").attr('selected', 'selected');
    $("#phoneUpdate").val(infor4[5])
    $("#addressUpdate").val(infor4[6])
    $("#birthdayUpdate").val(infor4[7])
    $("input[name='guardianNameUpdate']").val(infor4[11])
    $("input[name='guardianPhoneUpdate']").val(infor4[13])
    $("input[name='guardianEmailUpdate']").val(infor4[12])
    role('update');
    $.ajax({
        url: '/admin/editAccount',
        method: 'get',
        dataType: 'json',
        data: { updateid: id },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.targetxxx, function(index, targetxxx) {
                    if (targetxxx.routeName == infor4[8]) {
                        var routeOption = "<option value='" + targetxxx.routeName + "'>" + targetxxx.routeName + "</option>"
                        $("#routeTypeSUpdate").append(routeOption);
                        $("#routeTypeSUpdate option[value='" + infor4[8] + "']").attr('selected', 'selected');
                        $.each(targetxxx.routeSchedual, function(index, routeSchedual) {
                            var Schudelstage = "<option value='" + routeSchedual.stage + "'>" + routeSchedual.stage + "</option>"
                            $("#levelSUpdate").append(Schudelstage);
                            $('#levelSUpdate option:selected').removeAttr('selected');
                            $("#levelSUpdate option[value='" + infor4[9] + "']").attr('selected', 'selected');
                            $("#AimUpdate").append(Schudelstage);
                            $('#AimUpdate option:selected').removeAttr('selected');
                            $("#AimUpdate option[value='" + infor4[10] + "']").attr('selected', 'selected');
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

//thực hiện đăng ký và lưu tài khỏan vào đb
function signUp() {
    var role = $("#role").val()
    var formData1 = {
        sex: $("#gender").val(),
        username: $("#username").val(),
        email: $("#email").val(),
        role: role,
        phone: $("#phone").val(),
        address: $("#address").val(),
        birthday: $("#birthday").val(),
    };
    if (role != "teacher") {
        formData1["stage"] = $("#levelS").val()
        formData1["routeName"] = $("#routeTypeS").val()
        formData1["aim"] = $("#Aim").val()
        formData1["startStage"] = $("#levelS").val()
    }
    var formData2 = {
        role: "guardian",
        username: $("input[name='guardianName']").val(),
        phone: $("input[name='guardianPhone']").val(),
        email: $("input[name='guardianEmail']").val(),
    };
    $.ajax({
        url: '/admin/doCreateAccount',
        method: 'post',
        dataType: 'json',
        data: {
            password: $("#password").val(),
            filename: myFile.name,
            file: fileData,
            student: formData1,
            phuhuynh: formData2,
        },
        success: function(response) {
            if (response.msg == 'success') {
                reset();
                getAccount(role, 0);
                $(".createAccountOut").slideUp();
                alert('Sign Up success');
            }
            if (response.msg == 'Account already exists') alert('Account already exists');
            if (response.msg == 'Phone already exists') alert('Phone already exists');
            if (response.msg == 'error') alert('error');
        },
        error: function(response) {
            alert('server error');
        }
    })
}
//cập nhạta thông tin tk
function doUpdate() {
    if (!fileDataUpdate) {
        fileDataUpdate = "none"
    }
    var role = $("#roleUpdate").val()
    var formData1 = {
        sex: $("#gender").val(),
        username: $("#usernameUpdate").val(),
        email: $("#emailUpdate").val(),
        role: role,
        phone: $("#phoneUpdate").val(),
        address: $("#addressUpdate").val(),
        birthday: $("#birthdayUpdate").val(),
    };
    if (role === "teacher") {
        formData1["stage"] = "none"
        formData1["routeName"] = "none"
        formData1["aim"] = "none"
    } else {
        formData1["stage"] = $("#levelSUpdate").val()
        formData1["routeName"] = $("#routeTypeSUpdate").val()
        formData1["aim"] = $("#AimUpdate").val()
    }

    var formData2 = {
        role: "guardian",
        username: $("input[name='guardianNameUpdate']").val(),
        phone: $("input[name='guardianPhoneUpdate']").val(),
        email: $("input[name='guardianEmailUpdate']").val(),
    };

    $.ajax({
        url: '/admin/doeditAccount',
        method: 'post',
        dataType: 'json',
        data: {
            id: $("#PersonID").val(),
            oldLink: $('#oldAvatar').val(),
            password: $("#passwordUpdate").val(),
            formData1: formData1,
            formData2: formData2,
            file: fileDataUpdate,
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('update success');
                $('.updateFormOut').fadeOut(2000);
                getAccount($("#roleUpdate").val(), 0);
                // $("#routeTypeSUpdate option[value='" + response.data.routeName + "']").attr('selected', 'selected');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}


//tìm kiếm thông tin qua email hoặc số điện thoại cho học sinh
function search(email) {
    var condition = {}
    if (email != "") {
        condition["email"] = email
    } else {
        var search = $("#search").val().toString().trim()
        if (isNaN(search) == true) condition["email"] = search
        if (isNaN(search) == false) condition["phone"] = search
    }
    $.ajax({
        url: '/admin/search',
        method: 'get',
        dataType: 'json',
        data: { condition: condition },
        success: function(response) {
            if (response.msg == 'success') {
                $(".tableAccount .tr").css("background-color", '')
                $("#" + response.data._id).css("background-color", 'red')
                $(".rightSide").html("")
                console.log(response.data)
                if (response.data.role == "teacher") {
                    $(".rightSide").append("<img src='" + response.data.avatar + "'><br> Name: " + response.data.username + "<br> Gender: " + response.data.sex + "<br> Email: " + response.data.email + "<br> Phone: " + response.data.phone + "<br> Role: " + response.data.role + "<br> BirthDay: " + response.data.birthday + "<br> Address: " + response.data.address)
                } else {
                    if (response.data.role == "student") {
                        var data = response.data
                        var relationship = data.relationship
                    } else {
                        var relationship = response.data
                        var data = relationship.relationship
                    }
                    var currentClass = response.data.classID
                    $(".rightSide").append("<h1>Thông tin học sinh</h1>")
                    $(".rightSide").append("<img src='" + data.avatar + "'style='height:300px; width:auto'><br> Name: " + data.username + "<br> Gender: " + data.sex + "<br> Email: " + data.email + "<br> Phone: " + data.phone + "<br> Role: " + data.role + "<br> BirthDay: " + data.birthday + "<br> Address: " + data.address)
                    $(".rightSide").append("<h1>Tình trạng học tập</h1>")
                    $(".rightSide").append("<br> Route: " + data.routeName + "<br> Current level: " + data.stage + "<br> Aim : " + data.aim)
                    $(".rightSide").append("<h2>Tiến độ học tập</h2>")
                    var progress = data.progess
                    progress.forEach((e) => {
                        $(".rightSide").append("<h3>Stage: " + e.stage + "</h3><br>")
                        e.stageClass.forEach((e) => { if (e.classID != "") $(".rightSide").append(" Name: " + e.name + " Status: " + e.status + " <button onclick=copyID('" + e.classID + "')> Lấy ClassID</button><br>") })
                    })
                    $(".rightSide").append("<h1>Thông tin phụ huynh</h1>")
                    $(".rightSide").append("<br> Name: " + relationship.username + "<br> Phone: " + relationship.phone + "<br> Email : " + relationship.email)
                }
                $(".seacherInforOut").fadeIn(500)
            }
            if (response.msg == 'err') alert(' err');
            if (response.msg == 'none') alert('không tim thấy user');
        },
        error: function(response) {
            alert('server error');
        }
    })
}

async function copyID(id) {
    await navigator.clipboard.writeText(id);
    alert("copied")
}