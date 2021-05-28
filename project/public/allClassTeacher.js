var click = 0;

function sendData(id) {
    click = click + 1;
    if (click == 1) {
        $(".inner").show();
        var _id = id
        const studentList = "<th>avatar</th><th>username</th><th>level</th><th>email</th><th onclick='closeStudentList()'>X</th>"
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
                            $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='data:image/jpeg;base64," + studentID.avatar + "'></td><td>" + studentID.username + "</td><td>" + studentID.level + "</td><td>" + studentID.email + "</td><td>" + "<button onclick =studentAssessmentForm('" + _id + "','" + studentID._id + "','" + studentID.username + "','" + studentID.email + "')> Đánh giá học sinh</button>" + "</td></tr>");
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
    $("#name").html(name);
    $("#email").html(email);
    $(".studentAssessment").show();
}

function takeFeedBack() {
    var formData = {
        classID: $("#classID").text(),
        studentId: $("#studentID").text(),
        grade: $("#grade").val(),
        comment: $("#comment").text(),
    };
    var classID = $("#classID").text()
    var studentId = $("#studentID").text()
    alert(classID)

    alert(studentId)
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