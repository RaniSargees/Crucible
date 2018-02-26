var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
	console.log(req.body.uname);
        var db_pool = req.app.get('db')
        db_pool.getConnection(function(err,db) {
                if (err) {throw err;db.release()}
                db.query("SELECT * FROM users WHERE name = ?", [req.body.uname], function(err,user,fields){
			if (user.length){
				req.app.get('bcrypt').compare(req.body.passwd, user[0].pass, function(err,login){
					console.log(user[0]);
					if(login){
						res.send("1");
					}
					else {
						req.flash("diag", "login");
						req.flash("Password incorrect");
						res.redirect(req.body.redir);
					}
				});
			}
			else {
				req.flash("diag", "login");
				req.flash("User not found");
				res.redirect(req.body.redir);
			}
		});
	});
});

module.exports = router;
