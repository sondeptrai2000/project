$(document).ready(function() {
    getAllRoute()
    $(window).on('click', function(e) {
        if ($(e.target).is('.createRouteOut')) $('.createRouteOut').fadeOut(1500);
        if ($(e.target).is('.updateRouteOut')) $('.updateRouteOut').fadeOut(1500);
    });

    //hiệu ứng menu
    $('header li').hover(function() {
        $(this).find("div").slideDown()
    }, function() {
        $(this).find("div").hide(500)
    });
});

function getAllRoute() {
    $.ajax({
        url: '/admin/getAllRoute',
        method: 'get',
        dataType: 'json',
        data: {},
        success: function(response) {
            if (response.msg == 'success') {
                $(".tableRoute").html(" <div class='tr'><div class='td'>Tên lộ trình</div><div class='td'>Miêu tả</div><div class='td'>action</div></div>")
                var data = response.data
                data.forEach(function(data) {
                    var add = "<div class='tr' id='" + data._id + "' onclick=viewSchedule('" + data._id + "')><div class='td'>" + data.routeName + "</div><div class='td'>" + data.description + "</div><div class='td'><button onclick=updateRoute('" + data._id + "')>Update</button><button onclick=deleteRoute('" + data._id + "')>Remove</button></div></div>"
                    $(".tableRoute").append(add)
                })
                viewSchedule(data[0]._id)
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}


function addStage(type) {
    if (type == "create") {
        var add = "<div>Stage: <input type='text' name='stageTest'required/><button onclick =$(this).parent().remove()><i class='fas fa-trash-alt'></i></button><button onclick =$(this).parent().appendTo('#addStage') > <i class='fas fa-angle-double-down'></i> </button><button onclick=addClass($(this).parent(),'create')><i class='fas fa-plus-square'></i></button></div>"
        $('#addStage').append(add)
    } else {
        var add = "<div>Stage: <input type='text' name='stageTestUpdate'required/><button onclick =$(this).parent().remove()><i class='fas fa-trash-alt'></i></button><button onclick =$(this).parent().appendTo('#addStageUpdate') ><i class='fas fa-angle-double-down'></i> </button><button onclick=addClass($(this).parent(),'update')><i class='fas fa-plus-square'></i></button></div>"
        $('#addStageUpdate').append(add)
    }
}

function addClass(test, type) {
    if (type == "create") {
        var add = "<div class='route'>Route: <input type='text' name='classIn' required/><button onclick=$(this).parent().remove();><i class='fas fa-trash-alt'></i></button></div>"
        test.append(add)
    } else {
        var add = "<div class='route'>Route: <input type='text' name='classInUpdate'required/><button onclick=$(this).parent().remove();><i class='fas fa-trash-alt'></i></button></div>"
        test.append(add)
    }
}

function viewSchedule(id) {
    $(".viewRouteOut").fadeIn(500)
    console.log("vào")
    var _id = id
    $.ajax({
        url: '/admin/lol',
        method: 'get',
        dataType: 'json',
        data: { _id: _id },
        success: function(response) {
            if (response.msg == 'success') {
                $(".tableRoute .tr").css("background-color", '')
                $("#" + _id).css("background-color", 'gray')
                var data = response.data
                console.log(data)
                $(".viewRoute").html("<h1>Route Name: " + data[0].routeName + "</h1>")
                $(".viewRoute").append("<h2>Description: " + data[0].description + "</h2>")
                data[0].routeSchedual.forEach(function(e, indexBIG) {
                    $(".viewRoute").append("<h3> Stage " + (indexBIG + 1) + ": " + e.stage + "</h3>")
                    e.routeabcd.forEach(function(e, index) {
                        $(".viewRoute").append("<li>" + e + "</li>")
                    })
                })
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function search() {
    var name = "/" + $("#searchRoute").val() + "/i"
    $.ajax({
        url: '/admin/searchRoute',
        method: 'get',
        dataType: 'json',
        data: { name: name },
        success: function(response) {
            if (response.msg == 'success') {
                console.log(response.data)
            }

        },
        error: function(response) {
            alert('server error');
        }
    })
}

$("#doCreateRoute").submit(async function(event) {
    event.preventDefault();
    var schedule = []
    $("input[name='stageTest']").each(function(index, e) {
        var routeabcd = []
        $(this).parent().find('input[name="classIn"]').each(function(index, e) {
            routeabcd.push($(e).val())
        })
        schedule.push({ stage: $(this).val(), routeabcd: routeabcd })
    })
    var formData = {
        schedule: schedule,
        routeName: $("#routeName").val(),
        description: $("#description").val(),
    };
    $.ajax({
        url: '/admin/docreateRoute',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('Sign Up success');
            }
            if (response.msg == 'Account already exists') {
                alert('Account already exists');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
})

$("#doUpdateRoute").submit(async function(event) {
    event.preventDefault();
    var schedule = []
    var stageMoney = [];
    $("input[name='stageMoneyUpdate']").each(function(index, e) {
        stageMoney.push($(this).val())
    });
    $("input[name='stageTestUpdate']").each(function(index, e) {
        var routeabcd = []
        $(this).parent().find('input[name="classInUpdate"]').each(function(index, e) {
            routeabcd.push($(e).val())
        })
        schedule.push({ stage: $(this).val(), price: stageMoney[index], routeabcd: routeabcd })
    })
    var formData = {
        id: $("#routeIDUpdate").val(),
        schedule: schedule,
        routeName: $("#routeNameUpdate").val(),
        description: $("#descriptionUpdate").val(),
    };
    $.ajax({
        url: '/admin/doUpdateRoute',
        method: 'post',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.msg == 'success') {
                alert('Sign Up success');
            }
        },
        error: function(response) {
            alert('server error');
        }
    })
})

async function updateRoute(id) {
    $("#routeIDUpdate").val(id)
    $(".updateRouteOut").fadeIn(500)
    var _id = id
    $.ajax({
        url: '/admin/lol',
        method: 'get',
        dataType: 'json',
        data: { _id: _id },
        success: function(response) {
            if (response.msg == 'success') {
                $("#addStageUpdate").html("")
                var data = response.data
                $("#routeNameUpdate").val(data[0].routeName)
                $("#descriptionUpdate").val(data[0].description)
                data[0].routeSchedual.forEach(function(e, indexBIG) {
                    $("#addStageUpdate").append("<div id='updateStage" + indexBIG + "'>Stage: <input type='text' name='stageTestUpdate' value='" + e.stage + "'><button onclick =$(this).parent().remove() > <i class='fas fa-trash-alt'></i> </button><button onclick =$(this).parent().appendTo('#addStageUpdate') > <i class='fas fa-angle-double-down'></i> </button><button onclick=addClass($(this).parent(),'update')><i class='fas fa-plus-square'></i></button></div>")
                    e.routeabcd.forEach(function(e) {
                        $("#updateStage" + indexBIG).append("<div class='route'>Route: <input type='text' name='classInUpdate' value='" + e + "'><button onclick=$(this).parent().remove();><i class='fas fa-trash-alt'></i></button></div>")
                    })
                })
            }
        },
        error: function(response) {
            alert('server error');
        }
    });
}

function deleteRoute(id) {
    if (confirm("Are you sure you want to delete this?")) {
        $.ajax({
            url: '/admin/deleteRoute',
            method: 'delete',
            dataType: 'json',
            data: { id: id },
            success: function(response) {
                if (response.msg == 'success') {
                    alert('success');
                }
                if (response.msg == 'error') {
                    alert('error');
                }
            },
            error: function(response) {
                alert('server error');
            }
        })
    }

}