var click = 0;

function sendData(id) {
    click = click + 1;
    if (click == 1) {
        $(".inner").show();
        var _id = id
        const studentList = "<th>username</th><th>level</th><th>email</th><th onclick='closeStudentList()'>X</th>"
        $(".taskrow").html(studentList)
        $.ajax({
            url: '/admin/allClassStudent',
            method: 'get',
            dataType: 'json',
            data: { abc: _id },
            success: function(response) {
                if (response.msg == 'success') {
                    $.each(response.data, function(index, data) {
                        $.each(data.studentID, function(index, studentID) {
                            $(".taskrow").append("<tr><td>" + studentID.username + "</td><td>" + studentID.level + "</td><td>" + studentID.email + "</td><td>" + "<button class='del' value='" + data._id + "'>View</button>" + "</td></tr>");
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

function closeStudentList() {
    click = 0;
    $(".inner").hide();
}