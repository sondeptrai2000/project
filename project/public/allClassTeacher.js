var click = 0;

function sendData(id, routeName, stage, subject, teacherID, teacherName) {
    click = click + 1;
    if (click == 1) {
        $(".inner").show();
        var _id = id
        const studentList = "<th>avatar</th><th>username</th><th>stage</th><th>Aim</th><th>email</th><th>grade</th><th>feedBackContent</th><th>Select</th><th>Chat</th><th>đánh giá</th><th onclick='closeStudentList()'>X</th>"
        $(".taskrow").html("<button onclick=addStudent('" + id + "','" + routeName + "','" + stage + "','" + subject + "')>Them học sinh vào lớp</button><button onclick=removeStudent('" + id + "')>Xóa học sinh trong lớp</button>" + studentList)
        $.ajax({
            url: '/messenger/getMessenger',
            method: 'get',
            dataType: 'json',
            data: { abc: _id },
            success: function(response) {
                if (response.msg == 'success') {
                    $.each(response.data, function(index, data) {
                        $.each(data.studentID, function(index, studentID) {
                            if (studentID.grade === "Has not been commented yet") {
                                $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.stage + "</td><td>" + studentID.ID.aim + "</td><td>" + studentID.ID.email + "</td><td>" + studentID.grade + "</td><td id = '" + studentID.ID._id + "'>" + studentID.feedBackContent + "</td><td><input type='checkbox' class='removeFormClass' value='" + studentID.ID._id + "' /></td><td>" + "<button onclick =studentAssessmentForm('" + _id + "','" + studentID.ID._id + "','" + studentID.ID.username + "','" + studentID.ID.email + "')> Đánh giá học sinh</button>" + "</td><td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + studentID.ID._id + "'><input type='hidden' name='studentName' value='" + studentID.ID.username + "'><button>Chat</button></form></td></tr>");
                            } else {
                                $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.stage + "</td><td>" + studentID.ID.aim + "</td><td>" + studentID.ID.email + "</td><td>" + studentID.grade + "</td><td id = '" + studentID.ID._id + "'>" + studentID.feedBackContent + "</td><td><input type='checkbox' class='removeFormClass' value='" + studentID.ID._id + "' /></td><td>" + "<button onclick =updateStudentAssessmentForm('" + _id + "','" + studentID.ID._id + "','" + studentID.ID.username + "','" + studentID.grade + "')> Chinh sua danh gia</button>" + "</td><td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + studentID.ID._id + "'><input type='hidden' name='studentName' value='" + studentID.ID.username + "'><button>Chat</button></form></td></tr>");
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

}

function studentAssessmentForm(classID, studentid, username, email) {
    $("#classID").html(classID);
    $("#studentID").html(studentid);
    $("#name").html("<p>Name :" + username + "</p>");
    $("#email").html("<p>Email :" + email + "</p>");
    $(".studentAssessment").show();
}

function updateStudentAssessmentForm(classID, studentID, name, grade) {
    var content = '#' + studentID
    $("#updateclassID").html(classID);
    $("#updatestudentID").html(studentID);
    $("#updatename").html("<p>Name :" + name + "</p>");
    $("#updategrade").html("<option value=" + grade + ">" + grade + " </option>");
    $("#updatecomment").val($(content).text())
    $(".studentAssessmentUpdate").show();

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
                accountInformation = response.data;
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
                accountInformation = response.data;
                alert("update feedback success")
            }
        },
        error: function(response) {
            alert('server error');
        }
    });

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


function addStudent(classID, routeName, stage, subject) {
    var checkClassID = classID
    $.ajax({
        url: '/teacher/addStudentToClass',
        method: 'get',
        dataType: 'json',
        data: {
            routeName: routeName,
            stage: stage,
        },
        success: function(response) {
            if (response.msg == 'success') {
                $('.taskrow111').html('');
                $('#studentTable').show();
                $.each(response.data, function(index, data) {
                    if (data.classID.includes(checkClassID) == true) {} else if (data.classID.includes(checkClassID) == false) {
                        $(".taskrow111").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.routeName + "</td><td>" + data.stage + "</td><td><input type='checkbox' class='hobby' value='" + data._id + "' /></td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
                    }
                });
                $(".taskrow111").append("<button onclick= doAddToClass('" + classID + "')>Add to Class</button>");

            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function doAddToClass(classID) {
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
            classID: classID
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('add success ');
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


function removeStudent(classID) {
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
            classID: classID
        },
        success: function(response) {
            if (response.msg == 'success') {
                alert('remove success ');
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