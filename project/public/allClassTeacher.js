function sendData(id, subject) {
    var _id = id
    $.ajax({
        url: '/teacher/allClassStudent',
        method: 'get',
        dataType: 'json',
        data: { abc: _id },
        success: function(response) {
            if (response.msg == 'success') {
                $(".taskrow").html("")
                $.each(response.data, function(index, data) {
                    if (data.studentID.length == 0) {
                        alert('không có học sinh trong lớp')
                    } else {
                        $.each(data.studentID, function(index, studentID) {
                            if (studentID.grade === "Has not been commented yet") {
                                $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.aim + "</td><td>" + studentID.ID.email + "</td><td>" + studentID.grade + "</td><td id = '" + studentID.ID._id + "'>" + studentID.feedBackContent + "</td><td><input type='checkbox' class='removeFormClass' value='" + studentID.ID._id + "' /></td><td>" + "<button onclick =studentAssessmentForm('" + _id + "','" + studentID.ID._id + "','" + studentID.ID.username + "','" + studentID.ID.email + "')> Đánh giá học sinh</button>" + "</td><td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + studentID.ID._id + "'><input type='hidden' name='studentName' value='" + studentID.ID.username + "'><button>Chat</button></form></td></tr>");
                            } else {
                                $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.aim + "</td><td>" + studentID.ID.email + "</td><td>" + studentID.grade + "</td><td id = '" + studentID.ID._id + "'>" + studentID.feedBackContent + "</td><td><input type='checkbox' class='removeFormClass' value='" + studentID.ID._id + "' /></td><td>" + "<button onclick =updateStudentAssessmentForm('" + _id + "','" + studentID.ID._id + "','" + studentID.ID.username + "','" + studentID.grade + "')> Chinh sua danh gia</button>" + "</td><td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + studentID.ID._id + "'><input type='hidden' name='studentName' value='" + studentID.ID.username + "'><button>Chat</button></form></td></tr>");
                            }
                        });
                    }
                });
                $(".innerOut").fadeIn(500);
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function openSubmitProposal(id) {
    $("." + id).toggle(200);
}
var fileData;
var myFile;
$('.uploadProposal').on('change', function() {
    var filereader = new FileReader();
    filereader.onload = function(event) {
        fileData = event.target.result;
        var dataURL = filereader.result;
    };
    myFile = $('.uploadProposal').prop('files')[0];
    console.log('uploadProposal', myFile)
    filereader.readAsDataURL(myFile)
});



function uploadProposal(id) {
    $.ajax({
        url: '/teacher/uploadNewProposal',
        method: 'post',
        dataType: 'json',
        data: {
            classID: id,
            content: $(".contentProposal").val(),
            file: fileData,
            filename: myFile.name,
        },
        success: function(response) {
            if (response.msg == 'success') {
                $("." + id).fadeOut(2000);
                alert("upload successed")
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function studentAssessmentForm(classID, studentid, username, email) {
    $("#classID").html(classID);
    $("#studentID").html(studentid);
    $("#name").html(username);
    $("#email").html(email);
    $(".studentAssessmentOut").fadeIn(2000);
}

function updateStudentAssessmentForm(classID, studentID, name, grade) {
    $("#updateclassID").html(classID);
    $("#updatestudentID").html(studentID);
    $("#updatename").html(name);
    $('#updategrade option:selected').removeAttr('selected');
    $("#updategrade option[value='" + grade + "']").attr('selected', 'selected');
    var content = '#' + studentID
    $("#updatecomment").val($(content).text())
    $(".studentAssessmentUpdateOut").fadeIn(2000);
}

function takeFeedBack() {
    var formData = {
        classID: $("#classID").text(),
        studentId: $("#studentID").text(),
        grade: $("#grade").val(),
        comment: $("#comment").val(),
    };
    console.log(formData)
    $.ajax({
        url: '/teacher/studentAssessment',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                $(".innerOut").hide();
                var infor = response.data
                var infor = response.data
                sendData($("#classID").text());
                alert("take feedback success")
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function updateFeekBack() {
    var formData = {
        classID: $("#updateclassID").text(),
        studentId: $("#updatestudentID").text(),
        grade: $("#updategrade").val(),
        comment: $("#updatecomment").val(),
    };
    $.ajax({
        url: '/teacher/studentAssessment',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                $(".innerOut").hide();
                var infor = response.data
                sendData($("#updateclassID").text());
                alert("update feedback success")
            }
        },
        error: function(response) {
            alert('server error');
        }
    });

}

var studentlistOutDoor = []

function attendedOutDoor(id) {
    $.ajax({
        url: '/teacher/attendedOutDoor',
        method: 'get',
        dataType: 'json',
        data: { id: id },
        success: function(response) {
            if (response.msg == 'success') {
                $(".attendedOutDoorBody").html("")
                $.each(response.data, function(index, data) {
                    $.each(data.StudentIDoutdoor, function(index, StudentIDoutdoor) {
                        studentlistOutDoor.push(StudentIDoutdoor.ID._id)
                        $(".attendedOutDoorBody").append("<tr><th><img src='" + StudentIDoutdoor.ID.avatar + "' style='height:100px;width:100px'></br>" + StudentIDoutdoor.ID.username + "</th><th><input type='text' value='" + StudentIDoutdoor.attendComment + "' class='outDoorComment" + data._id + "'></th><th><select class='outDoorAttend" + data._id + "' id ='" + StudentIDoutdoor.ID._id + "'><option value='attended'>attended </option><option value='absent'>absent</option><option value='None'>none</option></select></th></tr>")
                        $('#' + StudentIDoutdoor.ID._id + ' option:selected').removeAttr('selected');
                        $('#' + StudentIDoutdoor.ID._id + ' option[value="' + StudentIDoutdoor.attend + '"]').attr('selected', 'selected');
                    });
                    $(".attendedOutDoorBody").append("<button onclick=takeAttendOutDoor('" + data._id + "')>Submit</button>")
                    $(".attendedOutDoorOut").fadeIn(500)
                });
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}


function takeAttendOutDoor(id) {
    var outDoorAttend = []
    var outDoorComment = []
    $(".outDoorAttend" + id).each(function() {
        outDoorAttend.push($(this).val())
    })
    $(".outDoorComment" + id).each(function() {
        outDoorComment.push($(this).val())
    })
    var atended = []
    for (let a = 0; a < studentlistOutDoor.length; a++) {
        atended.push({ "ID": studentlistOutDoor[a], "attend": outDoorAttend[a], "attendComment": outDoorComment[a] })
    }
    var formData = {
        id: id,
        atended: atended,
    }
    $.ajax({
        url: '/teacher/takeAttendOutDoor',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('ok');
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}
var room = []
var day = []
var time = []

function attendedList(id) {
    var idClass = id
    $.ajax({
        url: '/teacher/attendedList',
        method: 'get',
        dataType: 'json',
        data: { id: id },
        success: function(response) {
            if (response.msg == 'success') {
                $("#attendedList").html($("#attendedList tr:first-child"))
                $("#loladate4").val(response.data[0].schedule[response.data[0].schedule.length - 1].date)
                console.log(response.data[0].schedule[response.data[0].schedule.length - 1].room)
                console.log(response.data[0].schedule[response.data[0].schedule.length - 1].day)
                console.log(response.data[0].schedule[response.data[0].schedule.length - 1].time)
                $.each(response.data[0].schedule, function(index, data) {
                    if (!room.includes(data.room)) {
                        room.push(data.room)
                    }
                    if (!day.includes(data.day)) {
                        day.push(data.day)

                    }
                    if (!time.includes(data.time)) {
                        time.push(data.time)

                    }
                    $("#attendedList").append('<tr><td>' + data.date.split("T00:00:00.000Z")[0] + '</td><td>' + data.day + '</td><td><button onclick=takeAttend("' + data._id + '","' + idClass + '")>Take attend </button><input id ="' + data._id + '"type="hidden" value="' + data + '"></td></tr>    ')
                });
                $(".attendedListOut").fadeIn(500)
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function takeAttend(idattend, idClass) {
    var formData = {
        idattend: idattend,
        idClass: idClass,
    }
    $.ajax({
        url: '/teacher/attendedListStudent',
        method: 'get',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                $("#lola").html($("#lola tr:first-child"))
                $.each(response.data[0].schedule, function(index, data) {
                    if (data._id == idattend) {
                        $.each(data.attend, function(index, attend) {
                            $("#loladate").val(data.date.split("T00:00:00.000Z")[0])
                            $("#loladate1").val(data._id)
                            $("#loladate3").val(idClass)
                            $("#scheduleStatus").val(data.status)
                            $("#scheduleTime").val(data.time)
                            $("#scheduleRoom").val(data.room)
                            $("#scheduleDay").val(data.day)
                            $("#lola").append('<tr><td><input class ="attendStudentID" type="hidden" value="' + attend.studentID._id + '">' + attend.studentID.username + '</td><td><select class ="attendStudentStatus" id="' + attend.studentID._id + '"><option value="attended">attended </option><option value="absent">absent</option><option value="None">none</option></select></td></tr>')
                            $('#' + attend.studentID._id + ' option:selected').removeAttr('selected');
                            $('#' + attend.studentID._id + ' option[value="' + attend.attended + '"]').attr('selected', 'selected');
                        });
                    }
                });
                $(".lolaOut").fadeIn(500)
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function submitTakeAttend() {
    var studentID = []
    $(".attendStudentID").each(function() {
        studentID.push($(this).val())
    })
    var attended = []
    $(".attendStudentStatus").each(function() {
        attended.push($(this).val())
    })
    var attend = []
    for (var i = 0; i < attended.length; i++) {
        attend.push({ "studentID": studentID[i], "attended": attended[i] })
    }
    var formData = {
        attend: attend,
        idClass: $("#loladate3").val(),
        schedule: $("#loladate1").val(),
        lastDate: $("#loladate4").val(),
        room: room,
        day: day,
        time: time,
        scheduleStatus: $("#scheduleStatus").val(),
        scheduleTime: $("#scheduleTime").val(),
        scheduleRoom: $("#scheduleRoom").val(),
        scheduleDay: $("#scheduleDay").val(),
    }
    $.ajax({
        url: '/teacher/doTakeAttended',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('success');
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}