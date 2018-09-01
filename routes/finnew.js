var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;

var handlers = {
    getFinNews: function(req, res) {
        FinNew.find({}, { title_detail: 0, url_link: 0, summary: 0, retrieved: 0, title: 0 }).exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            } else {
                console.log("API was called successfully.");
            }

            res.status(200).send(data);
        });
    }
}
module.exports = handlers;