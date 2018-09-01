var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;
var handlers = {
  getFinNews: function(req, res) {
    FinNew.find().exec(function(err, data) {
      if(err) {
        console.log(err);
        res.status(500).send('DB Error');
      }
res.status(200).send(data);
    });
  }
}
module.exports = handlers;
