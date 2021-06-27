var fileData;
var myFile;
var fileDataUpdate;
var myFileUpdate;



$(document).ready(function() {
    $('.proposal').slideUp()
    $(".uploadFile").slideUp();
    $('.proposalUpdate').slideUp()
    $('#myUploadProposal').on('change', function() {
        var filereader = new FileReader();
        filereader.onload = function(event) {
            fileData = event.target.result;
            var dataURL = filereader.result;
        };
        myFile = $('#myUploadProposal').prop('files')[0];
        console.log('myUploadProposal', myFile)
        filereader.readAsDataURL(myFile)
    });

    $('#updateProposal').on('change', function() {
        var filereaderUpdate = new FileReader();
        filereaderUpdate.onload = function(event) {
            fileDataUpdate = event.target.result;
            var dataURL = filereaderUpdate.result;
        };
        myFileUpdate = $('#updateProposal').prop('files')[0];
        console.log('updateProposal', myFileUpdate)
        filereaderUpdate.readAsDataURL(myFileUpdate)
    });

});

function createNewProposal() {
    $(".uploadFile").slideToggle();
}

function teacherProfile() {
    $.ajax({
        url: '/teacher/teacherProfile',
        method: 'get',
        dataType: 'json',
        data: {},
        success: function(response) {
            if (response.msg == 'success') {
                $(".content").show();
                $("#usernameProfile").html(response.data.username);
                $("#emailProfile").html(response.data.email);
                $("#classIDProfile").html(response.data.classID);
                $("#phoneProfile").html(response.data.phone);
                $("#birthdayProfile").html(response.data.birthday);
                $("#addressProfile").html(response.data.address);
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function closeProfile() {
    $(".content").hide();
}


function proposalT() {
    $("#loading").show();
    $(".tr1").remove();
    $.ajax({
        url: '/teacher/allProposal',
        method: 'get',
        dataType: 'json',
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) {
                    var content = "<div class='tr1' id='" + data._id + "'><div class='td' onclick=view('" + data.file + "')>" + data.proposalName + "</div><div class='td'>" + data.Content + "</div><div class='td'>" + data.proposalType + "</div><div class='td'>" + data.uploadDate + "</div><div class='td'>" + data.Status + "</div><div class='td'><button onclick=updateProposal('" + data._id + "')>update</button><button onclick=deleteProposal('" + data._id + "')>delete</button></div>"
                    console.log("sdf")
                    console.log(data.file)
                    $("#table").append(content);
                })
                $("#loading").hide();
                $('.proposal').slideDown(1000)
            }
            if (response.msg == 'error') {
                alert(' error');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}

function updateProposal(id) {
    $(".proposalUpdate").slideDown();
    var address = "#" + id + " .td"
    var value = []
    $(address).each(function(e) {
        value.push($(this).text())
    });
    $("#IDproposalNameUpdate").val(id)
    $("#proposalNameUpdate").val(value[0])
    $("#proposalContentUpdate").val(value[1])
    $('#updateProposalType option:selected').removeAttr('selected');
    $("#updateProposalType option[value='" + value[2] + "']").attr('selected', true);;
}

function lol() {
    return ($("#updateProposalType").val())
}

function doUpdateProposal() {
    if (!fileDataUpdate) {
        fileDataUpdate = "none"
    }
    var formData = {
        _id: $("#IDproposalNameUpdate").val(),
        proposalName: $("#proposalNameUpdate").val(),
        Content: $("#proposalContentUpdate").val(),
        proposalType: lol(),
        file: fileDataUpdate.split("data:application/pdf;base64,")[1],
    }
    $.ajax({
        url: '/teacher/updateProposal',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('update proposal success');
                closeuploadNewProposal()
                proposalT()
            }
            if (response.msg == 'error') {
                alert('update proposal error');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })

}

function closeuploadNewProposal() {
    $(".proposalUpdate").slideUp();
}

function view(base64) {
    $('#viewProposal').append('<button onclick="cancelProposal()">&times;</button><iframe  src="data:application/pdf;base64,' + base64 + '" height="350px" width="100%"></iframe>');
}

function cancelProposal() {
    $('#viewProposal').html('')
}

function closeProposal() {
    $('.proposal').slideUp()
}

function uploadNewProposal() {
    var formData = {
        filename: myFile.name,
        file: fileData,
        proposalName: $("#proposalName").val(),
        proposalContent: $("#proposalContent").val(),
        proposalType: $("#proposalType").val(),
    };
    $.ajax({
        url: '/teacher/uploadNewProposal',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('Upload proposal success');
                proposalT()
            }
            if (response.msg == 'error') {
                alert('Upload proposal error');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
}
$("#proposalFilter").on("change", function() {
    var value = $(this).val().toLowerCase();
    if (value == "all") {
        $("#table .tr1").slideDown()
    } else {
        $("#table .tr1").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    }
});


function deleteProposal(id) {
    var _id = id
    var confirmDelete = confirm("Delete this proposal");
    if (confirmDelete == true) {
        $.ajax({
            url: '/teacher/deleteProposal',
            method: 'post',
            dataType: 'json',
            data: { abc: _id },
            success: function(response) {
                if (response.msg == 'success') {
                    proposalT();
                    alert(' success');
                }
                if (response.msg == 'error') {
                    alert(' error');
                }
            },
            error: function(response) {
                alert('server error');
            }
        })
    }
}