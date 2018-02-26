var express = require('express');
var router = express.Router();

function genKey(episodes) {
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
	return episodes;
}

router.get('/:genre/:subgenre/:show/:season/:episode', function(req, res, next){
	console.log(req.params);
	var db_pool = req.app.get('db')
	db_pool.getConnection(function(err,db) {
		if (err) {throw err;db.release()}
		db.query("SELECT * FROM episodes WHERE name = ?", [req.params.show], function(err, episodes, fields) {
			if (err) throw err;
			episodes = genKey(episodes);
			episode = episodes.find(function(x){
				return x.episode==req.params.episode && x.season==req.params.season
			});
			if (!episode) {
				res.status(404);
				res.render('error', {
					message:"Not Found",
					error: {
						status:"404",
						stack:req.url,
					},
					page: req.originalUrl,
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
				return
			}
			res.render('watch',{
				params: req.params,
				page: req.originalUrl,
				episode: episode,
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
		db.release()
	});
});

router.get('/:genre/:subgenre/:show', function(req, res, next) {
	console.log(req.params);
	var db_pool = req.app.get('db')
	db_pool.getConnection(function(err,db) {
		if (err) {throw err;db.release()}
		db.query("SELECT * FROM shows WHERE name = ?", [req.params.show], function(err, show, fields) {
			if (err) throw err;
			show = show[0];
			if (!show) {
				res.status(404);
				res.render('error', {
					page: req.originalUrl,
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
				//console.log("nonexistant");
				return
			}
			db.query("SELECT * FROM episodes WHERE name = ?", [req.params.show], function(err, episodes, fields) {
				episodes = genKey(episodes);
				//console.log(episodes);
				res.render('show',{
					page: req.originalUrl,
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
		db.release()
	});
});

router.get('/:genre/:subgenre', function(req, res, next) {
	console.log(req.params);
	var db_pool = req.app.get('db')
	db_pool.getConnection(function(err,db) {
		if (err) {throw err;db.release()}
		db.query("SELECT * FROM shows WHERE subgenre = ? AND genre = ?", [req.params.subgenre, req.params.genre], function(err, shows, fields) {
			res.render('list',{
				page: req.originalUrl,
				title: req.params.genre+" > "+req.params.subgenre,
				params: req.params,
				shows: shows,
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
		db.release()
	});
});

router.get('/:genre', function(req, res, next) {
	console.log(req.params);
	var db_pool = req.app.get('db')
	db_pool.getConnection(function(err,db) {
		if (err) {throw err;db.release()}
		db.query("SELECT * FROM shows WHERE genre = ? ORDER BY RAND()", [req.params.genre], function(err, shows, fields) {
			if (err) throw err;
			//console.log(shows);
			db.query("SELECT * FROM subgenres WHERE subof = ?", [req.params.genre], function(err, subgenres, fields) {
				if (err) throw err;
				//console.log(subgenres)
				res.render('list',{
					page: req.originalUrl,
					title: req.params.genre,
					params: req.params,
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
		db.release()
	});
});

router.get('/', function(req, res, next) {
	var db_pool = req.app.get('db')
	db_pool.getConnection(function(err,db) {
		if (err) {throw err;db.release()}
		db.query("SELECT * FROM genres", [req.params.genre], function(err, genres, fields) {
			if (err) throw err;
			//console.log(genres);
			res.render('list',{
				page: req.originalUrl,
				title: 'Videos',
				genres: genres,
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
		db.release()
	});
});

module.exports = router;
