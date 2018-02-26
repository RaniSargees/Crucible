var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
	console.log(req.body.uname);
        var db_pool = req.app.get('db')
        db_pool.getConnection(function(err,db) {
                if (err) {throw err;db.release()}
                db.query("SELECT * FROM users WHERE name = ?", [req.body.uname], function(err,user,fields){
			req.app.get('bcrypt').compare(req.body.passwd, user[0].pass, function(err,login){
				console.log(user[0]);
				console.log(req.body.passwd);
				if(login){
					res.send("1");
				}
				else {
					res.send("0");
				}
			});
		});
	});
});

module.exports = router;
