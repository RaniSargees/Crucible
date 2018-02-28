var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
	req.flash("menu", "1");
	res.redirect(req.body.redir);
});
module.exports = router;
