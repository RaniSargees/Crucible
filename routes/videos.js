var express = require('express');
var router = express.Router();

router.get('/:genre/:subgenre/:show/:season/:episode', function(req, res, next) {
	console.log(req.params);
});

/*
router.get('/:genre/:subgenre/:show/:season', function(req, res, next) {
	console.log(req.params);
});
*/

router.get('/:genre/:subgenre/:show', function(req, res, next) {
	console.log(req.params);
	var db = req.app.get('db')
	db.query("SELECT * FROM shows WHERE name = ?", [req.params.show], function(err, show, fields) {
		if (err) throw err;
		show = show[0];
		if (!show) {
			res.status(404);
			res.render('error', {
				message:"Not Found",
				error: {
					status:"404",
					stack:req.url,
				},
				navitems: [
					{
						name: 'Home',
						href: "/"
					},
					{
						name: 'Videos',
						active: 1,
						href: '/v'
					},
					{
						name: 'Lobbies',
						href: '/l'
					}
				],
			});
			console.log("nonexistant");
			return
		}
		db.query("SELECT * FROM episodes WHERE name = ?", [req.params.show], function(err, episodes, fields) {
			var numseasons  = [];
			var numepisodes = [];
			for (var x=0; x<episodes.length; x++) {
				numseasons  = numseasons. concat(episodes[x].season );
				numepisodes = numepisodes.concat(episodes[x].episode);
			}

			numseasons  = (Math.max.apply(Math, numseasons )+[]);
			numepisodes = (Math.max.apply(Math, numepisodes)+[]);
			for (var x=0; x<episodes.length; x++) {
				episodes[x].key = ("0".repeat(numseasons.length) + episodes[x].season).slice(-numseasons.length);
				if (episodes[x].ismovie) {
					episodes[x].key += ("0".repeat(numepisodes.length+1) + (parseInt(numepisodes)+1) ).slice(-numepisodes.length-1);
				} else {
					episodes[x].key += ("0".repeat(numepisodes.length+1) + episodes[x].episode).slice(-numepisodes.length-1);
				}
			}
			episodes.sort(function(obj1, obj2) {return obj1.key - obj2.key;});
			res.render('show',{
				params: req.params,
				title: show.nickname,
				episodes: episodes,
				navitems: [
					{
						name: 'Home',
						href: "/"
					},
					{
						name: 'Videos',
						active: 1,
						href: '/v'
					},
					{
						name: 'Lobbies',
						href: '/l'
					}
				],
			});
		});
	});
});

router.get('/:genre/:subgenre', function(req, res, next) {
	console.log(req.params);
	res.render('index',{
		title: req.params.genre+" > "+req.params.subgenre,
		navitems: [
			{
				name: 'Home',
				href: "/"
			},
			{
				name: 'Videos',
				active: 1,
				href: '/v'
			},
			{
				name: 'Lobbies',
				href: '/l'
			}
		],
	});
});

router.get('/:genre', function(req, res, next) {
	console.log(req.params);
	var db = req.app.get('db')
	db.query("SELECT * FROM shows WHERE genre = ?", [req.params.genre], function(err, shows, fields) {
		if (err) throw err;
		console.log(shows);
		db.query("SELECT * FROM subgenres WHERE subof = ?", [req.params.genre], function(err, subgenres, fields) {
			if (err) throw err;
			console.log(subgenres)
			res.render('index',{
				title: req.params.genre,
				shows: shows,
				subgenres: subgenres,
				navitems: [
					{
						name: 'Home',
						href: "/"
					},
					{
						name: 'Videos',
						active: 1,
						href: '/v'
					},
					{
						name: 'Lobbies',
						href: '/l'
					}
				],
			});
		});
	});
});

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
				active: 1,
				href: '/v'
			},
			{
				name: 'Lobbies',
				href: '/l'
			}
		],
	});
});

module.exports = router;
