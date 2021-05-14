class indexController {
    home(req,res){
        res.render('index/login')
        // res.json('Trang chủ của trung tâm')
    }

    courseinformation(req,res){
        res.json('Trang thông tin khóa học')
    }

    aboutus(req,res){
        res.json('Trang thông tin trung tâm')
    }
}
module.exports = new indexController