var click = 0;

function sendData(id, subject) {
    click = click + 1;
    if (click == 1) {
        var _id = id
        $(".option").html("<button onclick=addStudent('" + id + "','" + subject + "')>Them học sinh vào lớp</button><button onclick=removeStudent('" + id + "','" + subject + "')>Xóa học sinh trong lớp</button>")
        $.ajax({
            url: '/teacher/allClassStudent',
            method: 'get',
            dataType: 'json',
            data: { abc: _id },
            success: function(response) {
                if (response.msg == 'success') {
                    $(".taskrow").html("")

                    $.each(response.data, function(index, data) {
                        console.log(data.studentID)
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
                    $(".inner").fadeIn(2000);
                }
            },
            error: function(response) {
                alert('server error');
            }
        });
    }

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

function deleteProposal(id) {
    console.log(id)
    $.ajax({
        url: '/teacher/deleteProposal',
        method: 'delete',
        dataType: 'json',
        data: { id: id },
        success: function(response) {
            if (response.msg == 'success') {
                allActivityProposal()
            }
            $(".allActivityProposal").show()
        },
        error: function(response) {
            alert('server error');
        }
    })

}

function addStudent(classID, subject) {
    var infor4 = []
    $("#" + classID + " td").each(function() {
        infor4.push($(this).text())
    })
    var checkClassID = classID
    var checksubject = subject
    $.ajax({
        url: '/teacher/addStudentToClass',
        method: 'get',
        dataType: 'json',
        data: {
            routeName: infor4[1],
            stage: infor4[2],
        },
        success: function(response) {
            if (response.msg == 'success') {
                $('.taskrow111').html('');
                $('#studentTable').show();
                console.log(response.data)
                $.each(response.data, function(index, data) {
                    if (data.classID.includes(checkClassID) == true) {} else if ((data.classID.includes(checkClassID) == false) && (data.subject.includes(checksubject) == false)) {
                        $(".taskrow111").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.email + "</td><td>" + data.routeName + "</td><td>" + data.stage + "</td><td><input type='checkbox' class='hobby' value='" + data._id + "' /></td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
                    }
                });
                $(".taskrow111").append("<button onclick= doAddToClass('" + classID + "','" + subject + "')>Add to Class</button>");
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function doAddToClass(classID, subject) {
    var classID = classID

    var studentlist = [];
    $('.hobby').each(function() {
        if ($(this).is(":checked")) {
            studentlist.push({ 'ID': $(this).attr('value') });
        }
    });

    var studentlistcl = [];
    $('.hobby').each(function() {
        if ($(this).is(":checked")) {
            studentlistcl.push($(this).attr('value'));
        }
    });

    $.ajax({
        url: '/teacher/doaddStudentToClass',
        method: 'post',
        dataType: 'json',
        data: {
            studentlistcl: studentlistcl,
            studentlist: studentlist,
            classID: classID,
            subject: subject
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('add success ');
                closeStudentList();
                cancleTableAddTstudent();
                sendData(classID);
            }
            if (response.msg == 'error') {
                alert('add error ');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}


function removeStudent(classID, subject) {
    var classID = classID
    var studentlistcl = [];
    $('.removeFormClass').each(function() {
        if ($(this).is(":checked")) {
            studentlistcl.push($(this).attr('value'));
        }
    });
    $.ajax({
        url: '/teacher/doremoveStudentToClass',
        method: 'post',
        dataType: 'json',
        data: {
            studentlistcl: studentlistcl,
            classID: classID,
            subject: subject
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('remove success ');
                closeStudentList();
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

function studentAssessmentForm(classID, studentid, username, email) {
    $("#classID").html(classID);
    $("#studentID").html(studentid);
    $("#name").html(username);
    $("#email").html(email);
    $(".studentAssessment").fadeIn(2000);
}

function updateStudentAssessmentForm(classID, studentID, name, grade) {
    $("#updateclassID").html(classID);
    $("#updatestudentID").html(studentID);
    $("#updatename").html(name);
    $('#updategrade option:selected').removeAttr('selected');
    $("#updategrade option[value='" + grade + "']").attr('selected', 'selected');
    var content = '#' + studentID
    $("#updatecomment").val($(content).text())
    $(".studentAssessmentUpdate").fadeIn(2000);
}

function takeFeedBack() {
    var formData = {
        classID: $("#classID").text(),
        studentId: $("#studentID").text(),
        grade: $("#grade").val(),
        comment: $("#comment").val(),
    };
    $.ajax({
        url: '/teacher/studentAssessment',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                closeStudentList();
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
                closeStudentList();
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

function cancleTableAddTstudent() {
    $("#studentTable").hide();
}

function canclestudentAssessment() {
    $(".studentAssessment").hide();
}

function canclestudentAssessmentUpdate() {
    $(".studentAssessmentUpdate").hide();
}

function closeStudentList() {
    click = 0;
    $(".inner").hide();
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
                    console.log(data)
                    $.each(data.StudentIDoutdoor, function(index, StudentIDoutdoor) {
                        studentlistOutDoor.push(StudentIDoutdoor.ID._id)
                        $(".attendedOutDoorBody").append("<tr><th><img src='" + StudentIDoutdoor.ID.avatar + "' style='hieght:100px;width:100px'></br>" + StudentIDoutdoor.ID.username + "</th><th><input type='text' value='" + StudentIDoutdoor.attendComment + "' class='outDoorComment" + data._id + "'></th><th><select class='outDoorAttend" + data._id + "' id ='" + StudentIDoutdoor.ID._id + "'><option value='attended'>attended </option><option value='absent'>absent</option><option value='None'>none</option></select></th></tr>")
                        $('#' + StudentIDoutdoor.ID._id + ' option:selected').removeAttr('selected');
                        $('#' + StudentIDoutdoor.ID._id + ' option[value="' + StudentIDoutdoor.attend + '"]').attr('selected', 'selected');
                    });
                    $(".attendedOutDoorBody").append("<button onclick=takeAttendOutDoor('" + data._id + "')>Submit</button>")
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