$(document).ready(function() {
    getClass()
        //hiệu ứng menu
    $('header li').hover(function() {
        $(this).find("div").slideDown()
    }, function() {
        $(this).find("div").hide(500)
    });


    $(window).on('click', function(e) {
        if ($(e.target).is('.studentListOut')) $('.studentListOut').slideUp(1500);
        if ($(e.target).is('.teacherIn4Out')) $('.teacherIn4Out').slideUp(1500);
    });
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
                $("#tableClass").html("<div class='tr'><div class='td'>Class name</div><div class='td'>routeName</div><div class='td'>stage</div><div class='td'>subject</div><div class='td'>Description</div><div class='td'>Teacher Name</div><div class='td'>Start date</div><div class='td'>End date</div class='td'><div class='td'>Student List</div></div>")
                response.classInfor.forEach((e) => {
                    e.classID.forEach((e) => {
                        $("#tableClass").append("<div class='tr' id=" + e._id + "><div class='td'>" + e.className + "</div><div class='td'>" + e.routeName + "</div><div class='td'>" + e.stage + "</div><div class='td'>" + e.subject + "</div><div class='td'>" + e.description + "</div><div class='td' onclick=viewTeacherProfile('" + e.teacherID._id + "')>" + e.teacherID.username + "</div><div class='td'>" + e.startDate + "</div><div class='td'>" + e.endDate + "</div><div class='td'><button onclick=sendData('" + e._id + "','" + e.subject + "')>List of student</button></div></div>")
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
                $.each(response.data, function(index, data) {
                    $(".teacherIn4").html("<div class='tr'><img style ='max-width:150px;max-height:200px' src='" + data.avatar + "'><label>" + data.username + "</label></div><div class='tr'>" + data.email + "</div><div class='tr'><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + data._id + "'><input type='hidden' name='studentName' value='" + data.username + "'><button>Chat</button></form></div>");
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
                $(".studentList").html('<div class="tr"><div class="td">avatar</div><div class="td">username</div><div class="td">email</div><div class="td">Chat</div></div>')
                $.each(response.data, function(index, data) {
                    $.each(data.studentID, function(index, studentID) {
                        $(".studentList").append("<div class='tr'><div class='td'><img style ='max-width:150px;max-height:200px' src='" + studentID.ID.avatar + "'></div><div class='td'>" + studentID.ID.username + "</div><div class='td'>" + studentID.ID.email + "</div><div class='td'><form action='/messenger/makeConnection' method='post'><input type='hidden' name='studentID' value='" + studentID.ID._id + "'><input type='hidden' name='studentName' value='" + studentID.ID.username + "'><button>Chat</button></form></div></div>");
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