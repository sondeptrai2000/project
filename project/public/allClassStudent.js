var teacherIn4 = 0;

function viewTeacherProfile(id) {
    teacherIn4 = teacherIn4 + 1;
    if (teacherIn4 === 1) {
        $("#teacherIn4").show();
        var _id = id
        $(".taskrow").html("");
        $.ajax({
            url: '/student/getTeacherProfile',
            method: 'get',
            dataType: 'json',
            data: { abc: _id },
            success: function(response) {
                if (response.msg == 'success') {
                    $.each(response.data, function(index, data) {
                        $(".taskrow").append("<tr><td><img style ='max-width:150px;max-height:200px' src='" + data.avatar + "'></td><td>" + data.username + "</td><td>" + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "<td><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + data._id + "'><input type='hidden' name='studentName' value='" + data.username + "'><button>Chat</button></form></td></td></tr>");
                    });
                }
            },
            error: function(response) {
                alert('server error');
            }
        });
    }

}

function teacherIn4Close() {
    teacherIn4 = 0;
    $("#teacherIn4").hide();
}