var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;

var handlers = {
    getFinNewsBySent: function(req, res) {

        var tmrDateTime = new Date()
        var currentDateTime = new Date()
        var viewData = [];
        // DateTime formatting
        tmrDateTime.setDate(tmrDateTime.getDate() + 1)
        currentDateTime.setHours(0, 0, 0, 0)
        tmrDateTime.setHours(0, 0, 0, 0)
        tmrDateTime = tmrDateTime.toISOString()
        currentDateTime = currentDateTime.toISOString()

        FinNew.aggregate([
            { $match: { published: { $gte: new Date(currentDateTime), $lt: new Date(tmrDateTime) } } },
            { $group: { _id: { sentiment: "$sentiment" }, count: { $sum: 1 } } }
        ]).exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            } else {
                console.log("API was called successfully.");
            }
            //convert json structure
            for (var i = 0; i < data.length; i++) {
                var jsonData = {};
                jsonData['sentiment'] = data[i]['_id']['sentiment'];
                jsonData['count'] = data[i]['count'];
                viewData.push(jsonData)
            }
            res.status(200).send(viewData);
        });
    }
}
module.exports = handlers;