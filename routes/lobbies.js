var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index',{
		title: 'Crucible - Free Video Streaming',
		navitems: [
			{
				name: 'Home',
				href: "/"
			},
			{
				name: 'Videos',
				href: '/v'
			},
			{
				name: 'Lobbies',
				active: 1,
				href: '/l'
			}
		],
	});
});

module.exports = router;
