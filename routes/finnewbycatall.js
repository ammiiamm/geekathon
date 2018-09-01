var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;


var handlers = {
    getFinNewsByCatAll: function(req, res) {

        FinNew.aggregate([
            { $group: { _id: { category: "$category", sentiment: "$sentiment" }, count: { $sum: 1 } } }
        ]).exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            } else {
                console.log("API was called successfully.");
            }

            var lookup = {};
            var cat_list = [];
            var viewData = [];

            //Get unique cat name
            for (var i = 0; i < data.length; i++) {
                var cat = data[i]['_id']['category'];

                if (!(cat in lookup)) {
                    lookup[cat] = 1;
                    cat_list.push(cat);
                }
            }

            for (var j = 0; j < cat_list.length; j++) {
                var jsonData = {};
                jsonData['category'] = cat_list[j]
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['_id']['category'] === cat_list[j]) {
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