var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;


var handlers = {
    getFinNewsBySourceAll: function(req, res) {

        FinNew.aggregate([
            { $group: { _id: { source: "$source", sentiment: "$sentiment" }, count: { $sum: 1 } } }
        ]).exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            } else {
                console.log("API was called successfully.");
            }

            var lookup = {};
            var source_list = [];
            var viewData = [];

            //Get unique source name
            for (var i = 0; i < data.length; i++) {
                var source = data[i]['_id']['source'];

                if (!(source in lookup)) {
                    lookup[source] = 1;
                    source_list.push(source);
                }
            }

            for (var j = 0; j < source_list.length; j++) {
                var jsonData = {};
                jsonData['source'] = source_list[j]
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['_id']['source'] === source_list[j]) {
                        if (data[i]['_id']['sentiment'] === 'Neutral') {
                            jsonData['Neutral'] = data[i]['count'];
                        } else if (data[i]['_id']['sentiment'] === 'Positive') {
                            jsonData['Positive'] = data[i]['count'];
                        } else {
                            jsonData['Negative'] = data[i]['count'];
                        }
                    }
                }
                viewData.push(jsonData)
            }

            res.status(200).send(viewData);


        });
    }
}
module.exports = handlers;