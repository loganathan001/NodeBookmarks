var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookmarks');

var Bookmark = mongoose.model('Bookmark', { name: String, url: String });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to 'bookmarks' database.");
});

exports.load = function(app) {

	app.get('/bookmarks', function(req, res){
		Bookmark.find(function (err, bookmarks) {
		if (err) {
			console.log(err);
		}
		console.log(bookmarks);
		res.send(bookmarks);
		});
	});

	app.post('/bookmark', function(req, res){
		console.log("Request to add bookmark: " + req);
		if(req.body && req.body.name && req.body.url) {		
			var name = req.body.name;
			var url = req.body.url;
			console.log("Adding bookmark: " + name + "-" + url);
			var bookmark = new Bookmark({ name:  name, url: url });
			bookmark.save(function (err) {
				if (err) {
					console.log('Cannot add bookmark..');
				}
			});
			res.send('Added Bookmark: '+ bookmark);

		}
	});
	
	app.get('/bookmark/:id', function(req, res){
		Bookmark.find({_id: req.params.id}, function (err, bookmarks) {
			if (err) {
				console.log(err);
			}
			console.log(bookmarks);
			res.send(bookmarks);
			});
	});
	
	app.put('/bookmark/:id', function(req, res){
		if(req.body && ( req.body.name || req.body.url)) {	
			Bookmark.find({_id: req.params.id}, function (err, bookmarks) {
				if (err) {
					console.log(err);
				}
				console.log(bookmarks);
				if(bookmarks.length > 0) {
					var bookmark = bookmarks[0];
					if(req.body.name) {
						bookmark.name = req.body.name;
					}
					if(req.body.url) {
						bookmark.url = req.body.url;
					}
					bookmark.save(function (err) {
						if (err) {
							console.log('Cannot update bookmark..');
						}
					});
					res.send('Updated Bookmark: '+ bookmark);
				}
			});
		}
	});
	
	app.delete('/bookmark/:id', function(req, res){
		Bookmark.find({_id: req.params.id}, function (err, bookmarks) {
			if (err) {
				console.log(err);
			}
			console.log(bookmarks);
			if(bookmarks.length > 0) {
				var bookmark = bookmarks[0];
				bookmark.remove();
				res.send("Deleted: "+ bookmark);
			}
		});
	});
	
	console.log("'bookmarks' module loaded.");
}