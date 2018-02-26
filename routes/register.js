var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
	console.log(req.body.uname);
        var db_pool = req.app.get('db')
        db_pool.getConnection(function(err,db) {
                if (err) {throw err;db.release()}
                db.query("SELECT * FROM users WHERE name = ?", [req.body.uname], function(err,user,fields){
			if (user.length){
				req.flash("diag", "register");
				req.flash("Username Taken");
				res.redirect(req.body.redir);
			}
			else {
				req.app.get('bcrypt').hash(req.body.passwd, 10, function(err,hash){
					console.log(hash);
					db.query("INSERT INTO `users` (`name`, `pass`, `id`) VALUES (?,?,NULL)", [req.body.uname, hash], function(err,result){
						if (err) {throw err}
						req.flash("success", "Successfully registered");
						res.redirect(req.body.redir);
					});
				});
			}
		});
	});
});

module.exports = router;
