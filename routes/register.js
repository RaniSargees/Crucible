var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
        var db_pool = req.app.get('db')
        db_pool.getConnection(function(err,db) {
                if (err) {throw err;db.release()}
                db.query("SELECT * FROM users WHERE LOWER(name) = ?", [req.body.uname.toLowerCase()], function(err,user,fields){
			if (user.length){
				req.flash("diag", "register");
				req.flash("Username Taken");
				res.redirect(req.body.redir);
			}
			else {
				if (/[^!-~]/.test(req.body.uname)) {
					req.flash("diag", "register");
					req.flash("Invalid username");
					res.redirect(req.body.redir);
				}
				else if (req.body.uname.length > 24){
					req.flash("diag", "register");
					req.flash("Username too long");
					res.redirect(req.body.redir);
				}
				else if (req.body.dname.length > 96) {
					req.flash("diag", "register");
					req.flash("Display name too long");
					res.redirect(req.body.redir);
				}
				else {
					if (!req.body.dname.length) {
						req.body.dname = req.body.uname;
					}
					req.app.get('bcrypt').hash(req.body.passwd, 10, function(err,hash){
						db.query("INSERT INTO `users` (`name`, `nick`, `pass`) VALUES (?,?,?)", [req.body.uname, req.body.dname, hash], function(err,result){
							if (err) {throw err}
							req.flash("success", "Successfully registered");
							req.flash("menu", "1");
							req.flash("closediag", "register");
							res.redirect(req.body.redir);
						});
					});
				}
			}
		});
	});
});

module.exports = router;
