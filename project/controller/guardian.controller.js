class guardianController {
    guardianHome(req,res){
        res.json('Trang chủ guardian')
    }
    
    guardianProfile(req,res){
        res.json('Trang thông tin cá nhân của giáo viên')
    }

    allClass(req,res){
        res.json('Trang thông tin các khóa học con đã học + đánh giá')
    }

    learningProgress(req,res){
        res.json('Trang thông tin tiến độ học tập của con')
    }

    allextracurricularActivities(req,res){
        res.json('Trang xem tất cả các hoạt động ngoại khóa mà con đã tham gia + đánh giá')
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
module.exports = new guardianController