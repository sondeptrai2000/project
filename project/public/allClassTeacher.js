var click = 0;

function sendData(id) {
    click = click + 1;
    if (click == 1) {
        $(".inner").show();
        var _id = id
        const studentList = "<th>avatar</th><th>username</th><th>stage</th><th>Aim</th><th>email</th><th>grade</th><th>feedBackContent</th><th onclick='closeStudentList()'>X</th>"
        $(".taskrow").html(studentList)
        $.ajax({
            url: '/teacher/allClassStudent',
            method: 'get',
            dataType: 'json',
            data: { abc: _id },
            success: function(response) {
                if (response.msg == 'success') {
                    $.each(response.data, function(index, data) {
                        $.each(data.studentID, function(index, studentID) {
                            if (studentID.grade === "Has not been commented yet") {
                                $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.stage + "</td><td>" + studentID.ID.aim + "</td><td>" + studentID.ID.email + "</td><td>" + studentID.grade + "</td><td>" + studentID.feedBackContent + "</td><td>" + "<button onclick =studentAssessmentForm('" + _id + "','" + studentID.ID._id + "','" + studentID.ID.username + "','" + studentID.ID.email + "')> Đánh giá học sinh</button>" + "</td></tr>");
                            } else {
                                $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.stage + "</td><td>" + studentID.ID.aim + "</td><td>" + studentID.ID.email + "</td><td>" + studentID.grade + "</td><td>" + studentID.feedBackContent + "</td><td>" + "<button onclick =updateStudentAssessmentForm('" + _id + "','" + studentID.ID._id + "','" + studentID.ID.username + "','" + studentID.grade + "')> Chinh sua danh gia</button>" + "</td></tr>");
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

function studentAssessmentForm(classID, studentID, name, email) {
    $("#classID").html(classID);
    $("#studentID").html(studentID);
    $("#name").html("<p>Name :" + name + "</p>");
    $("#email").html("<p>Email :" + email + "</p>");
    $(".studentAssessment").show();
}
// "," + studentID.grade + "," + studentID.feedBackContent + "
function updateStudentAssessmentForm(classID, studentID, name, grade) {
    alert(classID)
    $("#updateclassID").html(classID);
    $("#updatestudentID").html(studentID);
    $("#updatename").html("<p>Name :" + name + "</p>");
    $("#updateemail").html("<p>Email :" + email + "</p>");
    $("#updategrade").html("<p>Email :" + grade + "</p>");
    // $("#updatecomment").val(comment)
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

function cancle() {
    $(".studentAssessment").hide();
}

function closeStudentList() {
    click = 0;
    $(".inner").hide();
}