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
                $("#avatarProfile").attr("src", response.data.avatar);
                $("#usernameProfile").html(response.data.username);
                $("#emailProfile").html('<i class="fas fa-envelope-square"></i>' + response.data.email);
                $("#phoneProfile").html('<i class="fas fa-phone-square-alt"></i>' + response.data.phone);
                $("#birthdayProfile").html('<i class="fas fa-birthday-cake"></i>' + response.data.birthday);
                $("#addressProfile").html('<i class="fas fa-map-marker-alt"></i>' + response.data.address);
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


function proposalT(page) {
    $("#loading").show();
    $(".tr1").remove();
    $.ajax({
        url: '/teacher/allProposal',
        method: 'get',
        dataType: 'json',
        data: { page: page },
        success: function(response) {
            if (response.msg == 'success') {
                $.each(response.data, function(index, data) {
                    var content = "<div class='tr1' id='" + data._id + "'><div class='td' onclick=view('" + data.file + "')>" + data.proposalName + "</div><div class='td'>" + data.Content + "</div><div class='td'>" + data.proposalType + "</div><div class='td'>" + data.uploadDate + "</div><div class='td'>" + data.Status + "</div><div class='td'><button onclick=updateProposal('" + data._id + "')>update</button><button onclick=deleteProposal('" + data._id + "')>delete</button></div>"
                    $("#table").append(content);
                })
                $("#loading").hide();
                $('.proposal').slideDown(1000)
                $("#soTrang").html("")
                for (let i = 1; i < response.soTrang; i++) {
                    let u = i - 1
                    $("#soTrang").append("<button onclick=proposalT(" + u + ")>" + i + "</button>")
                }
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
        file: fileDataUpdate,
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



function uploadNewProposal() {
    var formData = {
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

function allEvent() {
    $.ajax({
        url: '/teacher/allEvent',
        method: 'get',
        dataType: 'json',
        success: function(response) {
            if (response.msg == 'success') {
                $("#table1").html('<div class="tr"><div class="td">eventName</div><div class="td">eventContent</div><div class="td">eventAddress</div><div class="td">eventAt</div><div class="td">eventProposal</div><div class="td">fileLink</div><div class="td">status</div><div class="td">comment</div><div class="td" onclick="closeAllEvent()"><i class="fas fa-window-close"></i></div></div>')
                var check = false;
                $.each(response.data, function(index, data) {
                    $.each(data.proposals, function(index, proposals) {
                        if (proposals.teacherID == response.decodeAccount._id) {
                            var content = '<div class="tr"><div class="td">' + data.eventName + '</div><div class="td">' + data.eventContent + '</div><div class="td">' + data.eventAddress + '</div><div class="td">' + data.eventAt + '</div><div class="td">' + data.eventProposal + '</div><div class="td"><a href="' + proposals.fileLink + '" target="_blank">Your Proposal</a></div><div class="td">' + proposals.status + '</div><div class="td">' + proposals.comment + '</div><div class="td"><button onclick = uploadProposalEvent("' + data._id + '")><i class="fas fa-edit"></i></button><button onclick = deleteProposalEvent("' + data._id + '","' + proposals.fileLink + '")><i class="fas fa-trash-alt"></i></button></div></div>'
                            $("#table1").append(content);
                            check = true;
                        }
                    })
                    if (check == false) {
                        var content = '<div class="tr"><div class="td">' + data.eventName + '</div><div class="td">' + data.eventContent + '</div><div class="td">' + data.eventAddress + '</div><div class="td">' + data.eventAt + '</div><div class="td">' + data.eventProposal + '</div><div class="td"></div><div class="td"></div><div class="td"></div><div class="td"><button onclick = uploadProposalEvent("' + data._id + '")><i class="fas fa-edit"></i></button><button onclick = deleteProposalEvent("' + data._id + '")><i class="fas fa-trash-alt"></i></button></div></div>'
                        $("#table1").append(content);
                    }
                })
                $(".allEvent").show()
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

function uploadProposalEvent(id) {
    $("#uploadEventProposalID").html(id)
    $(".uploadEventProposal").show()
}

function doUploadEventProposal() {
    console.log($("#uploadEventProposalID").text())
    var formData = {
        _id: $("#uploadEventProposalID").text(),
        filename: myFile.name,
        file: fileData,
    }
    $.ajax({
        url: '/teacher/updateProposalEvent',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('update proposal success');
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

function deleteProposalEvent(id, fileLink) {
    $.ajax({
        url: '/teacher/deleteProposalEvent',
        method: 'delete',
        dataType: 'json',
        data: { id: id, fileLink: fileLink },
        success: function(response) {
            if (response.msg == 'success') {
                alert('delete proposal success');
            }
            if (response.msg == 'error') {
                alert('delete proposal error');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })

}

function closeAllEvent() {
    $("#table1").html("")
    $(".allEvent").hide()
}

function closeuploadNewProposal() {
    $(".proposalUpdate").slideUp();
}

function view(base64) {
    $('#viewProposal').append('<button onclick="cancelProposal()"><i class="fas fa-window-close"></i></button><iframe  src="' + base64 + '" height="350px" width="100%"></iframe>');
}

function cancelProposal() {
    $('#viewProposal').html('')
}

function closeProposalTable() {
    $('.proposal').slideUp()
}