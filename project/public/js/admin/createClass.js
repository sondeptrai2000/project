getAllClass();
//hiệu ứng menu
$('header li').hover(function() {
    $(this).find("div").slideDown()
}, function() {
    $(this).find("div").hide(500)
});
$(window).on('click', function(e) {
    if ($(e.target).is('.studentListOut')) $('.studentListOut').fadeOut(1500);
    if ($(e.target).is('.studentTableAddOut')) $('.studentTableAddOut').fadeOut(1500);
    if ($(e.target).is('.attendedListOut')) $('.attendedListOut').fadeOut(1500);
    if ($(e.target).is('.updateScheduleFormOut')) $('.updateScheduleFormOut').fadeOut(1500);
    if ($(e.target).is('.createClassOut')) $('.createClassOut').fadeOut(1500);
});

//lọc phân loại tìm kiếm (lớp đang dạy hay đã dạy và khoảng thời gian)
function typeClass() {
    var type = $("#typeClass").val()
    if (type == "processing") {
        $("#formSearchEndClass").hide(500)
        getAllClass();
    }
    if (type == "finished") $("#formSearchEndClass").slideDown(1200)
}


//tiến hành tìm kiếm và trả về kết quả
function searchEndClass() {
    var time = $("#monthClass").val() + "-01"
    $.ajax({
        url: '/admin/getClass',
        method: 'get',
        dataType: 'json',
        data: { check: "1", time: time },
        success: function(response) {
            if (response.msg == 'success') {
                $(".tableClass").html("")
                $.each(response.classInfor, function(index, data) {
                    $(".tableClass").append("<div class='tr' id='" + data._id + "'><div class='td'>" + data.className + "</div><div class='td'>" + data.routeName + "</div><div class='td'>" + data.stage + "</div><div class='td'>" + data.subject + "</div><div class='td'>" + data.description + "</div><div class='td'>" + data.startDate + "</div><div class='td'>" + data.endDate + "</div><div class='td'><button onclick=sendData('" + data._id + "','" + data.subject + "')>View Student List</button></div><div class='td'><button onclick=upDateSchedule('" + data._id + "')>upDate schedule </button><button onclick=deleteClass('" + data._id + "')>delete</button></div><div class='td'>" + data.classStatus + "</div></div>")
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}


function search() {
    if ($("#search").val() == "") alert("Input class name")
    $.ajax({
        url: '/admin/searchClass',
        method: 'get',
        dataType: 'json',
        data: { className: $("#search").val() },
        success: function(response) {
            if (response.msg == 'success') {
                $(".tableClass").html("")
                $.each(response.classInfor, function(index, data) {
                    $(".tableClass").append("<div class='tr' id='" + data._id + "'><div class='td'>" + data.className + "</div><div class='td'>" + data.routeName + "</div><div class='td'>" + data.stage + "</div><div class='td'>" + data.subject + "</div><div class='td'>" + data.description + "</div><div class='td'>" + data.startDate + "</div><div class='td'>" + data.endDate + "</div><div class='td'><button onclick=sendData('" + data._id + "','" + data.subject + "')><i class='fas fa-clipboard-list'></i></button></div><div class='td'><button onclick=upDateSchedule('" + data._id + "')>upDate schedule </button><button onclick=deleteClass('" + data._id + "')>delete</button></div><div class='td'>" + data.classStatus + "</div></div>")
                });
            }
            if (response.msg == 'notFound') alert("Can't found class")
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function selectedTeacher(email, avatar, id) {
    $("#teacherID").html('<img src="' + avatar + '" style="height: 200px;width: 200px;" onclick=$("#span2").toggle(500)><figcaption>' + email + '</figcaption><input type="hidden" value="' + id + '">')
    $("#span2").fadeOut(500)
}

function getAllClass() {
    $.ajax({
        url: '/admin/getAllClass',
        method: 'get',
        dataType: 'json',
        data: {},
        success: function(response) {
            if (response.msg == 'success') {
                $(".tableClass").html("<div class='tr'><div class='td'>Class name</div><div class='td'>routeName</div><div class='td'>stage</div><div class='td'>subject</div><div class='td'>Description</div><div class='td'>Start date</div><div class='td'>End date</div><div class='td'>Action</div><div class='td'>Status</div></div>")
                $.each(response.classInfor, function(index, data) {
                    $(".tableClass").append("<div class='tr' id='" + data._id + "'><div class='td'>" + data.className + "</div><div class='td'>" + data.routeName + "</div><div class='td'>" + data.stage + "</div><div class='td'>" + data.subject + "</div><div class='td'>" + data.description + "</div><div class='td'>" + data.startDate.replace("T00:00:00.000Z", "") + "</div><div class='td'>" + data.endDate.replace("T00:00:00.000Z", "") + "</div><div class='td'><button onclick=sendData('" + data._id + "')>Student list</button><button onclick=upDateSchedule('" + data._id + "')>List Schedule </button><button onclick=deleteClass('" + data._id + "')>Delete</button></div><div class='td'>" + data.classStatus + "</div></div>")
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}
//hiển thị danh sách lịch giảng dạy để admin chọn vào thay đổi lịch làm việc 1 ngày nào đó trong list
function upDateSchedule(id) {
    var idClass = id
    $.ajax({
        url: '/teacher/attendedList',
        method: 'get',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(response) {
            if (response.msg == 'success') {
                $("#attendedList").html("<div class='tr'><div class='td' style='width:20%'>Date</div><div class='td'style='width:20%'>Day of week</div><div class='td'style='width:20%' >Room</div><div class='td'style='width:30%'>Time</div><div class='td'style='width:10%'>Action</div></div>")
                $.each(response.data[0].schedule, function(index, data) {
                    $("#attendedList").append('<div class="tr" id="infor' + data._id + '"><div class="td">' + data.date.split("T00:00:00.000Z")[0] + '</div><div class="td">' + data.day + '</div><div class="td">' + data.room + '</div><div class="td">' + data.time + '</div><div class="td"><button  onclick=updateScheduleForm("' + data._id + '","' + idClass + '")>Update</button><input id ="' + data._id + '"type="hidden" value="' + data + '"></div></div>    ')
                });
                $(".attendedListOut").fadeIn(500)
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}
//hiển thị form update lịch cho giáo viên
function updateScheduleForm(scheduleID, classID) {
    $("input[name='updateScheduleID']").val(scheduleID)
    $("input[name='updateScheduleClassID']").val(classID)
    $("#oldSchudule").html('<div class="td">Old</div>')
    $("#oldSchudule").append($("#infor" + scheduleID + " .td:not(:last-child)").clone())
    $(".updateScheduleFormOut").fadeIn(500)
}

//hiênr thị các phòng trống để giáo viên giảng dạy khi cập nhật, chuyển lịch giảng dạy
$("#cahocUpdate").change(async function() {
    var date = new Date($("input[name='dateScheduleUpdate']").val())
    var dayOfWeek = (date.getDay() + 1)
    if (dayOfWeek == '1') {
        dayOfWeek = "8"
    }
    $("#dayOfWeekUpdate").html("0" + dayOfWeek)
    $.ajax({
        url: '/admin/getThu',
        method: 'get',
        dataType: 'json',
        data: {
            dayOfWeek: dayOfWeek,
            time: $('#cahocUpdate').val()
        },
        success: function(response) {
            if (response.msg == 'success') {
                $("#roomUpdate").html("")
                $.each(response.data, function(index, data) {
                    $.each(data.room, function(index, room) {
                        if (room.time == $('#cahocUpdate').val() && room.status == "None") {
                            $("#roomUpdate").append('<option value = "' + room.room + '" > ' + room.room + ' </option>')
                        }
                    });
                });
            }
            if (response.msg == 'error') {}
        },
        error: function(response) {
            alert('server error');
        }
    })
});


//thực hiện cập nhật, chuyển đổ lịch giảng dạy cho giáo viên
$("#SubmitupdateScheduleForm").submit(async function(event) {
    event.preventDefault();
    var date = new Date($("input[name='dateScheduleUpdate']").val())
    var dayOfWeek = '0' + (date.getDay() + 1)
    if (dayOfWeek == '01') dayOfWeek = "08"
    var old = []
    var scheduleID = $("input[name='updateScheduleID']").val()

    $("#infor" + scheduleID + " .td:not(:last-child)").each(function() {
        old.push($(this).text().trim())
    })
    var update = {
        "schedule.$.time": $('#cahocUpdate').val(),
        "schedule.$.room": $('#roomUpdate').val(),
        "schedule.$.day": dayOfWeek,
        "schedule.$.status": "update"
    }
    $.ajax({
        url: '/admin/doupdateSchedule',
        method: 'post',
        dataType: 'json',
        data: {
            update,
            classID: $("input[name='updateScheduleClassID']").val(),
            date: $("input[name='dateScheduleUpdate']").val(),
            scheduleID: $("input[name='updateScheduleID']").val(),
            old: old
        },
        success: function(response) {
            if (response.msg == 'success') alert("success")
            if (response.msg == 'error') alert("error")
        },
        error: function(response) {
            alert('server error');
        }
    });
})

function deleteClass(id) {
    if (confirm("Are you sure you want to delete this?")) {
        $.ajax({
            url: '/admin/deleteClass',
            method: 'get',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(response) {
                if (response.msg == 'success') alert('success ');
                if (response.msg == 'error') alert('error ');
            },
            error: function(response) {
                alert('server error');
            }
        });
    }
}

//lấy danh sách các học sinh trong lớp
function sendData(id) {
    var _id = id
    $.ajax({
        url: '/teacher/allClassStudent',
        method: 'get',
        dataType: 'json',
        data: { abc: _id },
        success: function(response) {
            if (response.msg == 'success') {
                $(".studentListContent").html("<button onclick=addStudent('" + id + "')>Them học sinh vào lớp</button><button onclick=removeStudent('" + id + "')>Xóa học sinh trong lớp</button>")
                $(".studentListContent").append('<div class="tr"><div class="td" style="width:20%;">avatar</div><div class="td"style="width:20%;">username</div><div class="td" style="width:15%;">Aim</div><div class="td" style="width:35%;">email</div><div class="td"style="width:10%;">Select</div></div>')
                $.each(response.data, function(index, data) {
                    if (data.studentID.length == 0) {
                        alert('không có học sinh trong lớp')
                    } else {
                        $.each(data.studentID, function(index, studentID) {
                            $(".studentListContent").append("<div class='tr'><div class='td'><img src='" + studentID.ID.avatar + "'></div><div class='td'>" + studentID.ID.username + "</div><div class='td'>" + studentID.ID.aim + "</div><div class='td'>" + studentID.ID.email + "</div><div class='td'><input type='checkbox' class='removeFormClass' value='" + studentID.ID._id + "' /></div></div>");
                        });
                    }
                });
                $(".studentListOut").fadeIn(500);
            }
            if (response.msg == 'error') alert("error")
        },
        error: function(response) {
            alert('server error');
        }
    });
}

//hiển thị các học sinh có mức độ tương ứng với lớp đã chọn để xem xét thêm vào lớp
function addStudent(classID) {
    var infor4 = []
    $("#" + classID + " .td").each(function() {
        infor4.push($(this).text())
    })
    console.log(infor4)
    console.log(infor4[3])
    var condition = {
        role: 'student',
        routeName: infor4[1].trim(),
        stage: infor4[2].trim(),
    }
    $.ajax({
        url: '/teacher/addStudentToClass',
        method: 'get',
        dataType: 'json',
        data: { condition },
        success: function(response) {
            if (response.msg == 'success') {
                console.log(response.data)
                $('#studentTableAdd').html("<div class='tr'><div class='td'>avatar</div><div class='td'>username</div><div class='td'>email</div><div class='td'>routeName</div><div class='td'>stage</div><div class='td'>Chose</div></div>");
                $.each(response.data, function(index, student) {
                    var check = false
                    $.each(student.progess, function(index, progess) {
                        if (progess.stage == student.stage) {
                            $.each(progess.stageClass, function(index, stageClass) {
                                if (stageClass.classID == classID || stageClass.subject == infor4[3]) check = true
                            });
                        }
                    });
                    if (check == false) $("#studentTableAdd").append("<div class='tr'><div class='td'><img style ='max-width:100px;max-height:100px' src='" + student.avatar + "'></div><div class='td'>" + student.username + "</div><div class='td'>" + student.email + "</div><div class='td'>" + student.routeName + "</div><div class='td'>" + student.stage + "</div><div class='td'><input type='checkbox' name='hobby1' value='" + student._id + "' /></div></div>");
                });
                $("#studentTableAdd").append("<button onclick= doAddToClass('" + classID + "')>Add to Class</button>");
                $('.studentTableAddOut').show();
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}


//thêm học sinh vaof 1 lớp
function doAddToClass(classID) {
    var classID = classID
    var studentlistcl = [];
    var studentlistAttend = [];
    var studentlist = [];
    $('input[name="hobby1"]').each(function() {
        if ($(this).is(":checked")) {
            studentlist.push({ 'ID': $(this).attr('value') });
            studentlistAttend.push({ 'studentID': $(this).attr('value'), 'attended': '' });
            studentlistcl.push($(this).attr('value'));
        }
    });
    console.log(studentlistAttend)
    $.ajax({
        url: '/teacher/doaddStudentToClass',
        method: 'post',
        dataType: 'json',
        data: {
            studentlistAttend: studentlistAttend,
            studentlistcl: studentlistcl,
            studentlist: studentlist,
            classID: classID,
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('add success');
                $(".studentListOut").hide();
                $(".studentTableAddOut").hide();
                sendData(classID);
            }
            if (response.msg == 'error') alert('add error ');
        },
        error: function(response) {
            alert('server error');
        }
    })
}


//xóa học sinh khỏi 1 lớp
function removeStudent(classID, subject) {
    var classID = classID
    var studentlistcl = [];
    studentlistAttend = [];
    $('.removeFormClass').each(function() {
        if ($(this).is(":checked")) {
            studentlistcl.push($(this).attr('value'));
            studentlistAttend.push({ 'studentID': $(this).attr('value') });

        }
    });
    $.ajax({
        url: '/teacher/doremoveStudentToClass',
        method: 'post',
        dataType: 'json',
        data: {
            studentlistcl: studentlistcl,
            studentlistAttend: studentlistAttend,
            classID: classID,
            subject: subject
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('remove success ');
                $(".studentListOut").hide();
                sendData(classID);
            }
            if (response.msg == 'error') {
                alert('remove error ');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

//lấy các ngày trong khoảng thời gian học
var getDaysArray = function(start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
};
//thêm form điền thông tin cho các tuần
function tuan() {
    $("#datlich").html("")
    for (var i = 0; i < $("#Schedule").val(); i++) {
        $("#datlich").append('<h4>Day ' + (i + 1) + ':</h4><input type="number" placeholder="Enter day of week" class ="buoihocthu" name="Schedule' + i + '" min=2 max=8 onchange=getTime("' + i + '") required/>Time: <select class= "cahoc" id="cahoc' + i + '" onchange="getThu(' + i + ')"></select>Room:<select class="Room" id="Room' + i + '"></select>')
    }
}
//lấy các ca làm của giáo viên trong ngày đã chọn (tránh trường hợp 1 giáo viên dạy chung 1 ca làm và ở 2 phòng khác nhau )
function getTime(i) {
    $('#cahoc' + i).html('<option value="7:30 to 9:30">7:30 to 9:30</option><option value="9:45 to 11:45">9:45 to 11:45</option><option value="13:30 to 15:30">13:30 to 15:30</option><option value="15:45 to 17:45">15:45 to 17:45</option><option value="18:15 to 20:15">18:15 to 20:15</option>')
    $.ajax({
        url: '/admin/getTime',
        method: 'get',
        dataType: 'json',
        data: {
            dayOfWeek: $("input[name='Schedule" + i + "']").val(),
            teacherID: $("#teacherID input").val(),
        },
        success: function(response) {
            if (response.msg == 'success') {
                console.log(response.data)
                $.each(response.data, function(index, data) {
                    $.each(data.schedule, function(index, schedule) {
                        console.log(schedule.time)
                        $('#cahoc' + i + ' option[value="' + schedule.time + '"]').remove()
                    });
                });
            }
            if (response.msg == 'error') {}
        },
        error: function(response) {
            alert('server error');
        }
    })
}
//chọn các phòng trống để dạy
function getThu(i) {
    var dayOfWeek = $("input[name='Schedule" + i + "']").val()
    var time = $("#cahoc" + i + "").val()
    $.ajax({
        url: '/admin/getThu',
        method: 'get',
        dataType: 'json',
        data: {
            dayOfWeek: dayOfWeek,
            time: time
        },
        success: function(response) {
            if (response.msg == 'success') {
                $("#Room" + i + "").html("")
                $.each(response.data, function(index, data) {
                    $.each(data.room, function(index, room) {
                        if (room.time == time && room.status == "None") {
                            $("#Room" + i + "").append('<option value = "' + room.room + '" > ' + room.room + ' </option>')
                        }
                    });
                });
            }
            if (response.msg == 'error') {}
        },
        error: function(response) {
            alert('server error');
        }
    })
}

//thực hiện đăng ký và lưu tài khỏan vào đb
$("#myform").submit(async function(event) {
    event.preventDefault();

    var studentID = []
    var listStudent = []
    var attend = []
    $("input[name='hobby']").each(function(data) {
        if ($(this).is(':checked')) {
            studentID.push($(this).val())
            listStudent.push({
                'ID': $(this).val()
            });
            attend.push({
                "studentID": $(this).val(),
                "attended": ""
            })
        }
    })

    //lấy các thứ trong tuần
    var buoihoc = []
    $(".buoihocthu").each(function(data) {
        buoihoc.push($(this).val())
    })

    var time = []
    $(".cahoc").each(function() {
        time.push($(this).val())
    })

    var room = []
    $(".Room").each(function() {
        room.push($(this).val())
    })
    var schedual = []

    var range = getDaysArray(new Date($("#startDate").val()), new Date($("#endDate").val()));
    //lấy các buổi học trong khoảng thời gian
    for (var i = 0; i < range.length; i++) {
        for (var u = 0; u < buoihoc.length; u++) {
            if (range[i].getDay() == (buoihoc[u] - 1)) {
                var date = range[i].getFullYear() + "-" + (range[i].getMonth() + 1).toString().padStart(2, "0") + "-" + range[i].getDate().toString().padStart(2, "0")
                var day = (range[i].getDay() + 1).toString().padStart(2, "0")
                schedual.push({
                    "time": time[u],
                    "room": room[u],
                    "date": date,
                    "day": day,
                    "attend": attend
                })
                break;
            }
        }
    }
    var formData = {
        className: $(".className").val(),
        subject: $(".subject").val(),
        routeName: $(".routeName").val(),
        stage: $(".stage").val(),
        description: $(".description").val(),
        teacherID: $("#teacherID input").val(),
        endDate: $(".endDate").val(),
        startDate: $(".startDate").val(),
        studentID: studentID,
        listStudent: listStudent,
        schedual: schedual,
        time: time,
        room: room,
        buoihoc: buoihoc
    }
    console.log(formData)
    $.ajax({
        url: '/admin/createClass',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert("OK")
            }
            if (response.msg == 'error') {
                alert("error")
            }
        },
        error: function(response) {
            alert('server error');
        }
    })

})

//lấy thông tin của lộ trình học
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
                $("#routeTuyBien").html("<div class='tr'></div><div class='tr'></div>");
                $('#levelS').html('');
                $.each(response.data, function(index, data) {
                    $.each(data.routeSchedual, function(index, routeSchedual) {
                        var update = "<option value='" + routeSchedual.stage + "'>" + routeSchedual.stage + "</option>"
                        $("#levelS").append(update);
                    });
                });
                $.each(response.targetxxx, function(index, targetxxx) {
                    $.each(targetxxx.routeSchedual, function(indexBIG, routeSchedual) {
                        $("#routeTuyBien .tr:nth-child(1)").append("<div class='td' style='font-size:20px;'>Stage " + (indexBIG + 1) + ": " + routeSchedual.stage + "</div>");
                        $("#routeTuyBien .tr:nth-child(2)").append("<div class='td'></div>");
                        $.each(routeSchedual.routeabcd, function(index, routeabcd) {
                            $("#routeTuyBien .tr:nth-child(2) .td:nth-child(" + (indexBIG + 1) + ")").append("<li>" + routeabcd + "</li>");
                        });
                    });

                });

            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}
//lấy thông tin level, mốc của lộ trình đã chọn
function level() {
    var routeName = $('#routeTypeS').val();
    var levelS = $('#levelS').val();
    console.log(levelS)
    $.ajax({
        url: '/admin/getStage',
        method: 'get',
        dataType: 'json',
        data: {
            abc: routeName,
            levelS: levelS,
        },
        success: function(response) {
            if (response.msg == 'success') {
                $('#subject').html('');
                $('.taskrow').html('');
                $('#studentTableAddOut').show();
                console.log(response.data)
                $.each(response.data, function(index, data) {
                    $.each(data.routeSchedual, function(index, routeSchedual) {
                        if (routeSchedual.stage == levelS) {
                            $.each(routeSchedual.routeabcd, function(index, routeabcd) {
                                var update = "<option value='" + routeabcd + "'>" + routeabcd + "</option>"
                                $("#subject").append(update);
                            });
                        }
                    });
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

//lấy các học sinh đang học tình trạng học tập tại mức độ đã chọn để thêm vào lớp
function getStudent() {
    var routeName = $('#routeTypeS').val();
    var levelS = $('#levelS').val();
    $.ajax({
        url: '/admin/getStudent',
        method: 'get',
        dataType: 'json',
        data: {
            abc: routeName,
            levelS: levelS,
        },
        success: function(response) {
            if (response.msg == 'success') {
                if (response.student.length == 0) {
                    alert("không có học sinh học tập tại giai đoạn này")
                } else {
                    $('#studentTable').slideDown(1500);
                    $('#createClassOut,#createClass').animate({ scrollTop: ($('#studentTable').offset().top) }, 500)
                    $('#studentTable').html("<div class='tr'></div><div class='tr'><div class='td'>Avatar</div><div class='td'>Username</div><div class='td' style='display:none;'>Email</div><div class='td'>stage</div><div class='td'>Chose</div><div class='td'>More information</div></div>")
                    console.log(response.student)
                    $.each(response.student, function(index, student) {
                        var check = false
                        $.each(student.progess, function(index, progess) {
                            if (progess.stage == levelS) {
                                $.each(progess.stageClass, function(index, stageClass) {
                                    if (stageClass.name == $("#subject").val()) check = true
                                });
                            }
                        });
                        if (check == false) $('#studentTable').append("<div class='tr'><div class='td'><img style ='max-width:200;max-height:200px' src='" + student.avatar + "'></div><div class='td'>" + student.username + "</div><div class='td' style='display:none;'>" + student.email + "</div><div class='td'>" + student.stage + "</div><div class='td'><input type='checkbox' name='hobby' value='" + student._id + "' /></div><div class='td'>" + "<button class='del' value='" + student._id + "'>View</button>" + "</div></div>");
                    });
                    $('#studentTable').show();
                }
                getAllClass();
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}