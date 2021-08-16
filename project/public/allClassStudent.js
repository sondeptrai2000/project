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
                $.each(response.data, function(index, data) {
                    $(".teacherIn4Body").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "<td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + data._id + "'><input type='hidden' name='studentName' value='" + data.username + "'><button>Chat</button></form></td></td></tr>");
                });
                $(".teacherIn4Out").fadeIn(500);
            }
        },
        error: function(response) {
            alert('server error');
        }
    });

}



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