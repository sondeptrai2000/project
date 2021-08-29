$(document).ready(function() {
    getClass()
});


//lấy thông tin các lớp đã và đang học
function getClass() {
    $.ajax({
        url: '/student/getClass',
        method: 'get',
        dataType: 'json',
        data: { check: "0" },
        success: function(response) {
            if (response.msg == 'success') {
                console.log(response.classInfor)
                $("#tableClass").html("<th>Class name</th><th>routeName</th><th>stage</th><th>subject</th><th>Description</th><th>Teacher Name</th><th>Start date</th><th>End date</th><th>Student List</th>")
                response.classInfor.forEach((e) => {
                    e.classID.forEach((e) => {
                        $("#tableClass").append(" <tr id=" + e._id + "><td>" + e.className + "</td><td>" + e.routeName + "</td><td>" + e.stage + "</td><td>" + e.subject + "</td><td>" + e.description + "</td><td onclick=viewTeacherProfile('" + e.teacherID._id + "')>" + e.teacherID.username + "</td><td>" + e.startDate + "</td><td>" + e.endDate + "</td><td><button onclick=sendData('" + e._id + "','" + e.subject + "')>List of student</button></td></tr>")
                    })
                })
                var getClassID = $("#getClassID").val()
                if (getClassID) {
                    $("#" + getClassID).css("background-color", 'red')
                    setTimeout(function() {
                        $("#" + getClassID).css("background-color", 'white')
                    }, 5000)
                }
            }
            if (response.msg == 'abc') {
                alert("học sinh đã chuyển sang giai đoạn cao hơn")
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}


//xem 1 số thông tin của giáo viên
function viewTeacherProfile(id) {
    var _id = id
    $(".teacherIn4Body").html("");
    $.ajax({
        url: '/student/getTeacherProfile',
        method: 'get',
        dataType: 'json',
        data: { abc: _id },
        success: function(response) {
            if (response.msg == 'success') {
                $("#teacherIn4").html("<tr><th>avatar</th><th>username</th><th>email</th><th onclick=$('.teacherIn4Out').fadeOut(500);>X</th></tr>")
                $.each(response.data, function(index, data) {
                    $("#teacherIn4").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + data.email + "</td><td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + data._id + "'><input type='hidden' name='studentName' value='" + data.username + "'><button>Chat</button></form></td></td></tr>");
                });
                $(".teacherIn4Out").fadeIn(500);
            }
        },
        error: function(response) {
            alert('server error');
        }
    });

}


//lấy danh sáhc học sinh trong lớp
function sendData(id) {
    var _id = id
    $.ajax({
        url: '/student/allClassStudent',
        method: 'get',
        dataType: 'json',
        data: { abc: _id },
        success: function(response) {
            if (response.msg == 'success') {
                $(".studentListBody").html("")
                $.each(response.data, function(index, data) {
                    $.each(data.studentID, function(index, studentID) {
                        $(".studentListBody").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + studentID.ID.avatar + "'></td><td>" + studentID.ID.username + "</td><td>" + studentID.ID.email + "</td><td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + studentID.ID._id + "'><input type='hidden' name='studentName' value='" + studentID.ID.username + "'><button>Chat</button></form></td></tr>");
                    });
                });
                $(".studentListOut").fadeIn(2000);
            }
        },
        error: function(response) {
            alert('server error');
        }
    });


}