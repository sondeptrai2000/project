var fileData;
var myFile;
var fileDataUpdate;
var myFileUpdate;

$(document).ready(function() {
    //chạy hàm đếm số lượng giáo viên trong lớp và hiển thị số trang và giáo viên
    countAccount();

});

//thoát modal box bằng cách ấn ra ngàoi form
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

//tìm kiếm account
$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".taskrow div class='tr'").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


// làm trống thông tin tạo tài khoản
async function reset() {
    console.log(myFile)
    $("#createAccount input").val('');
    $("#output").attr('src', '');
    fileData = undefined
    myFile = undefined
    console.log(myFile)
}


//đếm số tk để hiển thị theo danh sachs trang
function countAccount() {
    console.log($("#accountFilter").val())
    $.ajax({
        url: '/admin/countAccount',
        method: 'get',
        dataType: 'json',
        data: { role: $("#accountFilter").val() },
        success: function(response) {
            if (response.msg == 'success') {
                console.log(response.soTrang)
                $("#soTrang").html("Page:<select onchange=getAccount()></select>");
                //hiển thị số trang vào thẻ select cho dễ chọn trang
                for (let i = 1; i < response.soTrang; i++) { $("#soTrang select").append("<option value='" + (i - 1) + "'>" + i + "</option>") }
                $("#number").html("Total: " + response.numberOfAccount)
                    //hiển thị thông tin các tài khoản theo role và số trang.
                getAccount();
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

//lấy danh sách theo role
function getAccount() {
    var role = $("#accountFilter").val()
    var page = $("#soTrang select").val()
    $(".tableInforType").html("");
    if (role === 'teacher') {
        var tableInfor = "<div class='tr'>\
        <div class='td'style='width:5%;'>avatar</div>\
        <div class='td'style='width:5%;'>username</div>\
        <div class='td'style='width:5%;'>sex</div>\
        <div class='td'style='width:20%;'>email</div>\
        <div class='td'style='display:none;'>role</div>\
        <div class='td'style='width:10%;'>phone</div>\
        <div class='td'style='width:10%;'>address</div>\
        <div class='td'style='width:10%;'>birthday</div>\
        <div class='td'style='width:10%;'>Action</div></div>"
    } else {
        var tableInfor = "<div class='tr'><div class='td' style='width:5%;'>avatar</div><div class='td'style='width:5%;'>username</div><div class='td'style='width:5%;'>sex</div><div class='td'>email</div><div class='td' style='display:none;'>role</div><div class='td'style='width:5%;'>phone</div><div class='td' style='display:none;'>address</div><div class='td' style='display:none;'>birthday</div><div class='td'style='width:5%;'>routeName</div><div class='td'style='width:5%;'>stage</div><div class='td'style='width:5%;'>Aim</div><div class='td'style='width:5%;'>Action</div></div >"
    }
    $(".tableAccount").html(tableInfor);
    $.ajax({
        url: '/admin/getAccount',
        method: 'get',
        dataType: 'json',
        data: { role: role, sotrang: page },
        success: function(response) {
            if (response.msg == 'success') {
                console.log(response.data)
                $.each(response.data, function(index, data) {
                    if (role == 'teacher') $(".tableAccount").append("<div class='tr' id ='" + data._id + "' onclick=search('" + data.email + "')><div class='td'><img  src='" + data.avatar + "'></div><div class='td'>" + data.username + "</div><div class='td'>" + data.sex + "</div><div class='td'>" + data.email + "</div><div class='td' style='display:none;'>" + data.role + "</div><div class='td'>" + data.phone + "</div><div class='td'>" + data.address + "</div><div class='td'>" + data.birthday + "</div><div class='td'><button onclick=updateForm('" + data._id + "')>Update</button></div></div >");
                    if (role == 'student') $(".tableAccount").append("<div class='tr' id ='" + data._id + "' onclick=search('" + data.email + "')><div class='td'><img  src='" + data.avatar + "'></div><div class='td'>" + data.username + "</div><div class='td'>" + data.sex + "</div><div class='td'>" + data.email + "</div><div class='td' style='display:none;'>" + data.role + "</div><div class='td'>" + data.phone + "</div><div class='td' style='display:none;'>" + data.address + "</div><div class='td' style='display:none;'>" + data.birthday + "</div><div class='td'>" + data.routeName + "</div><div class='td'>" + data.stage + "</div><div class='td'>" + data.aim + "</div><div class='td' style='display:none;'>" + data.relationship.username + "</div><div class='td' style='display:none;'>" + data.relationship.email + "</div><div class='td' style='display:none;'>" + data.relationship.phone + "</div><div class='td'><button onclick=updateForm('" + data._id + "')>Update</button></div></div >");
                });
                //hiển thị thông tin chi tiết trang form bên phải
                search(response.data[0].email)
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

//phân loại đăng ký khóa học dựa vào role cho cả create and update
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
                            var update = "<option value='" + routeSchedual.stage + "'>" + routeSchedual.stage + "</option>"
                            $("#levelS").append(update);
                            $("#Aim").append(update);
                        });
                    });
                } else if (action === 'update') {
                    $.each(response.data, function(index, data) {
                        if ($("#routeTypeSUpdate").val() == data.routeName) {
                            $.each(data.routeSchedual, function(index, routeSchedual) {
                                var update = "<option value='" + routeSchedual.stage + "'>" + routeSchedual.stage + "</option>"
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

//ấn hiển đăgn ký khóa học dựa theo role cho việc tạo tài khoản. Học sinh sẽ hiển ra còn giáo viên sẽ đóng lại vì không cần thiết
$("#role").change(async function() {
    var accountRole = $('#role').val();
    if (accountRole == "teacher") {
        $('.typeRole').slideUp();
        $('.typeRole').html('');
    }
    if (accountRole != "teacher") {
        $('.typeRole').html(" Chọn lộ trình học<select id='routeTypeS' onchange=routeType('create')></select>Level<select id='levelS'></select>Aim<select id='Aim'></select>Guardian name:<input type='text' name='guardianName'>Guardian phone: <input type='number' name='guardianPhone'>Guardian email:<input type='text' name='guardianEmail'>                              <div id='availbleTime' style='width:100%;padding:0;margin-top:10px;'><ul>Morning<input type='checkbox' class='checkTtime' value='Morning'></ul><ul>Afternoon<input type='checkbox' class='checkTtime' value='Afternoon'></ul><ul>Night<input type='checkbox' class='checkTtime' value='Night'></ul><ul>All<input type='checkbox' class='checkTtime' value='All'></ul></div>")
        getRoute('create')
        $('.typeRole').slideDown()
    }
});
//ấn hiển đăgn ký khóa học dựa theo role cho việc update tài khoản. Học sinh sẽ hiển ra còn giáo viên sẽ đóng lại vì không cần thiết 
$("#roleUpdate").change(async function() {
    var accountRole = $('#roleUpdate').val();
    if (accountRole == "teacher") {
        $('.typeRoleUpdate').slideUp();
        $('.typeRoleUpdate').html('');
    }
    if (accountRole != "teacher") {
        $('.typeRoleUpdate').html(" Chọn lộ trình học<select id='routeTypeSUpdate' onchange=routeType('update')></select>Level<select id='levelSUpdate'></select>Aim<select id='AimUpdate'></select>Guardian name:<input type='text' name='guardianNameUpdate'>Guardian phone: <input type='number' name='guardianPhoneUpdate'>Guardian email:<input type='text' name='guardianEmailUpdate'>")
        getRoute('update')
        $('.typeRoleUpdate').slideDown()
    }
});

//lấy cái lộ trình học để chọn trong cả 2 form tạo và update tài khoản
function getRoute(type) {
    var id
    if (type == 'create') id = "#routeTypeS";
    if (type == 'update') id = "#routeTypeSUpdate";
    $.ajax({
        url: '/admin/getRoute',
        method: 'get',
        dataType: 'json',
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) { $(id).append("<option value='" + data.routeName + "'>" + data.routeName + "</option>") });
            }
        }
    })
}




//chuyền thông tin cũ vào form cập nhật thông tin
function updateForm(id) {
    $('#levelSUpdate').html('');
    $("#AimUpdate").html('');
    $(".updateFormOut").fadeIn(2000);
    var selector = "#" + id + " .td"
    var infor4 = []
    $(selector).each(function() { infor4.push($(this).text()) })
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
    $("#roleUpdate").change()
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

//hiệu ứng chọn các buổi học sinh có thể học tập tại trung tâm
$(".checkTtime").on("change", function() {
    $("#availbleTime input").each(function() {
        if ($(this).is(':checked')) {
            if ($(this).val() == "All") {
                $("#availbleTime input").prop('checked', false);
                $(this).prop('checked', true);
            }
        }
    })
})

//thực hiện đăng ký và lưu tài khỏan vào đb
$("#myform").submit(function(event) {
    event.preventDefault();
    //lấy các thời gian học sinh có thể đi học tại trung tâm
    var availableTime = []
    $("#availbleTime input").each(function() {
        if ($(this).is(':checked')) {
            if ($(this).val() == "All") {
                availableTime.length = 0
                availableTime.push($(this).val())
                $("#availbleTime input").prop('checked', false);
                $(this).prop('checked', true);
            } else {
                availableTime.push($(this).val())
            }
        }
    })
    if (availableTime.length == 0) {
        alert("nhaajp vaof")
    } else {
        var role = $("#role").val()
            //thôn tin bắt buộc của giáo viên or học sinh
        var formData1 = {
            sex: $("#gender").val(),
            username: $("#username").val(),
            email: $("#email").val(),
            role: role,
            phone: $("#phone").val(),
            address: $("#address").val(),
            birthday: $("#birthday").val(),
        };
        var formData2
            //thông tin bổ sung dựa trên role
        if (role != "teacher") {
            formData1["stage"] = $("#levelS").val()
            formData1["routeName"] = $("#routeTypeS").val()
            formData1["aim"] = $("#Aim").val()
            formData1["startStage"] = $("#levelS").val()
            formData1["availableTime"] = availableTime
            formData2 = {
                role: "guardian",
                username: $("input[name='guardianName']").val(),
                phone: $("input[name='guardianPhone']").val(),
                email: $("input[name='guardianEmail']").val(),
            };
        }
        $.ajax({
            url: '/admin/doCreateAccount',
            method: 'post',
            dataType: 'json',
            data: { password: $("#password").val(), filename: myFile.name, file: fileData, student: formData1, phuhuynh: formData2 },
            success: function(response) {
                if (response.msg == 'success') {
                    reset();
                    getAccount();
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
});

//thực hiện cập nhật thông tin tài khỏan vào đb
//giống kha khá với tạo tài khoản
$("#myformUpdate").submit(function(event) {
    event.preventDefault();
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
    var formData2

    if (role != "teacher") {
        formData1["stage"] = $("#levelSUpdate").val()
        formData1["routeName"] = $("#routeTypeSUpdate").val()
        formData1["aim"] = $("#AimUpdate").val()
        formData2 = {
            role: "guardian",
            username: $("input[name='guardianNameUpdate']").val(),
            phone: $("input[name='guardianPhoneUpdate']").val(),
            email: $("input[name='guardianEmailUpdate']").val(),
        }
    }
    $.ajax({
        url: '/admin/doeditAccount',
        method: 'post',
        dataType: 'json',
        //Note: oldLink: là link avatar cũ
        data: { id: $("#PersonID").val(), oldLink: $('#oldAvatar').val(), password: $("#passwordUpdate").val(), formData1: formData1, formData2: formData2, file: fileDataUpdate, },
        success: function(response) {
            if (response.msg == 'success') {
                alert('update success');
                $('.updateFormOut').fadeOut(2000);
                getAccount();
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
})


//tìm kiếm thông tin qua email hoặc số điện thoại cho học sinh và hiển thị thông tin sang form bên phải
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
                $("#" + response.data._id).css("background-color", 'gray')
                $(".rightSide").html("")
                if (response.data.role == "teacher") {
                    $(".rightSide").append("<img src='" + response.data.avatar + "'><p>Name: " + response.data.username + "</p>Gender: " + response.data.sex + "</p>Email: " + response.data.email + "</p><p>Phone: " + response.data.phone + "</p><p>Role: " + response.data.role + "</p><p>BirthDay: " + response.data.birthday + "</p><p>Address: " + response.data.address + "</p>")
                } else {
                    if (response.data.role == "student") {
                        var data = response.data
                        var relationship = data.relationship
                    } else {
                        var relationship = response.data
                        var data = relationship.relationship
                    }
                    $(".rightSide").append("<img src='" + data.avatar + "'> <p>Name: " + data.username + "</p><p>Gender: " + data.sex + "</p><p>Email: " + data.email + "</p><p>Phone: " + data.phone + "</p><p>Role: " + data.role + "</p><p>BirthDay: " + data.birthday + "</p><p>Address: " + data.address + "</p>")
                    $(".rightSide").append("<h1>Tình trạng học tập</h1>")
                    $(".rightSide").append("<p>Route: " + data.routeName + " </p><p>Current level: " + data.stage + " </p><p>Aim : " + data.aim + "</p>")
                    $(".rightSide").append("<h2>Tiến độ học tập</h2>")
                    $(".rightSide").append("<a href='/admin/studentClass/" + data._id + "' target='_blank'>Click here to see more</a>");
                    //hiển thị lộ trình học của học sinh
                    var progress = data.progess
                    progress.forEach((e) => {
                        $(".rightSide").append("<h3>Stage: " + e.stage + "</h3>")
                        $(".rightSide").append("<div class='tr'><div class='td'>Subject</div><div class='td'>Status</div><div class='td'>ClassID</div></div>")
                        e.stageClass.forEach((e) => {
                            if (e.classID != "") $(".rightSide").append("<div class='tr'><div class='td'>" + e.name + " </div><div class='td'> " + e.status + " </div><div class='td'><button onclick=copyID('" + e.classID + "')>Get ClassID</button></div></div>")
                        })
                    })
                    $(".rightSide").append("<h1>Thông tin phụ huynh</h1>")
                    $(".rightSide").append("<p>Name: " + relationship.username + " </p><p>Phone: " + relationship.phone + " </p><p>Email : " + relationship.email + "</p>")
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


//copy classId
async function copyID(id) {
    await navigator.clipboard.writeText(id);
    alert("copied")
}