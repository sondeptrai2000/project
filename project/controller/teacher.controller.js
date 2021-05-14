class teacherController {
    teacherHome(req,res){
        res.json('Trang chủ teacher')
    }
    
    teacherProfile(req,res){
        res.json('Trang thông tin cá nhân của giáo viên')
    }

    allClass(req,res){
        res.json('Trang thông tin các khóa học đã,đang, cbi dạy')
    }

    viewClass(req,res){
        res.json('Trang thông tin lớp học')
    }

    takeAttended(req,res){
        res.json('Trang điểm danh')
    }


    editClass(req,res){
        res.json('Trang trỉnh sủa thông tin các lớp học')
    }

    addStudentToClass(req,res){
        res.json('Trang thêm học sinh vào lớp ')
    }

    studentAssessment(req,res){
        res.json('Trang đánh giá học sinh trong lớp ')
    }

    allextracurricularActivities(req,res){
        res.json('Trang xem tất cả các hoạt động ngoại khóa mà giáo viên đã thực hiện (góc nhìn: giáo viên)')
    }

    extracurricularActivities(req,res){
        res.json('Trang xem thông tin hoạt động ngoại khóa đã thực hiện và tiến hành đánh giá học sinh trong hoạt động ngoại khóa ')
    }

    proposeEtracurricularActivities(req,res){
        res.json('Gửi thông tin và bản kế hoạch về hoạt động ngoại khóa')
    }

    allChat(req,res){
        res.json('Tất cả những cuộc trò chuyện')
    }
    
    connectToChat(req,res){
        res.json('chọn người để trò chuyện')
    }

    chatConversation(req,res){
        res.json('Thực hiện cuộc trò chuyện')
    }

   
}
module.exports = new teacherController