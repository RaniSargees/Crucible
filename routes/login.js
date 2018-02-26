var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
        var db_pool = req.app.get('db')
        db_pool.getConnection(function(err,db) {
                if (err) {throw err;db.release()}
                db.query("SELECT * FROM users WHERE name = ?", [req.body.uname.toLowerCase()], function(err,user,fields){
			if (user.length){
				req.app.get('bcrypt').compare(req.body.passwd, user[0].pass, function(err,login){
					if(login){
						req.flash("success", "Successfully logged in");
						req.session.user=user[0]
						res.redirect(req.body.redir);
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
router.post("/out", function(req, res){
	if (req.session.user) {
		delete req.session.user;
		req.flash("success", "Successfully logged out");
		res.redirect(req.body.redir);
	}
});

module.exports = router;
