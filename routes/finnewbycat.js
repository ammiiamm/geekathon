var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;


var handlers = {
    getFinNewsByCat: function(req, res) {

        // DateTime formatting
        var tmrDateTime = new Date()
        var currentDateTime = new Date()
        tmrDateTime.setDate(tmrDateTime.getDate() + 1)
        currentDateTime.setHours(0, 0, 0, 0)
        tmrDateTime.setHours(0, 0, 0, 0)
        tmrDateTime = tmrDateTime.toISOString()
        currentDateTime = currentDateTime.toISOString()

        FinNew.aggregate([
            { $match: { published: { $gte: new Date(currentDateTime), $lt: new Date(tmrDateTime) } } },
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


            //convert json structure
            // for (var i = 0; i < data.length; i++) {
            //     var jsonData = {};
            //     //Pattern: { "category": "Property", "sentiment": "Neutral", "count": 19 }
            //     jsonData['category'] = data[i]['_id']['category'];
            //     jsonData['sentiment'] = data[i]['_id']['sentiment'];
            //     jsonData['count'] = data[i]['count'];
            //     viewData.push(jsonData)
            // }
            // res.status(200).send(viewData);

            //convert json structure
            // for (var i = 0; i < data.length; i++) {
            //     if (i === 0) {
            //         var viewData = [];
            //         var jsonFin = {};
            //         var jsonBus = {};
            //         var jsonEco = {};
            //         var jsonPro = {};
            //     }
            //     if (data[i]['_id']['category'] === 'Finance') {
            //         if (data[i]['_id']['sentiment'] === 'Neutral') {
            //             jsonFin['Neutral'] = data[i]['count'];
            //         } else if (data[i]['_id']['sentiment'] === 'Positive') {
            //             jsonFin['Positive'] = data[i]['count'];
            //         } else {
            //             jsonFin['Negative'] = data[i]['count'];
            //         }
            //     }
            //     if (data[i]['_id']['category'] === 'Business') {
            //         if (data[i]['_id']['sentiment'] === 'Neutral') {
            //             jsonBus['Neutral'] = data[i]['count'];
            //         } else if (data[i]['_id']['sentiment'] === 'Positive') {
            //             jsonBus['Positive'] = data[i]['count'];
            //         } else {
            //             jsonBus['Negative'] = data[i]['count'];
            //         }
            //     }
            //     if (data[i]['_id']['category'] === 'Economy') {
            //         if (data[i]['_id']['sentiment'] === 'Neutral') {
            //             jsonEco['Neutral'] = data[i]['count'];
            //         } else if (data[i]['_id']['sentiment'] === 'Positive') {
            //             jsonEco['Positive'] = data[i]['count'];
            //         } else {
            //             jsonEco['Negative'] = data[i]['count'];
            //         }
            //     }
            //     if (data[i]['_id']['category'] === 'Property') {
            //         if (data[i]['_id']['sentiment'] === 'Neutral') {
            //             jsonPro['Neutral'] = data[i]['count'];
            //         } else if (data[i]['_id']['sentiment'] === 'Positive') {
            //             jsonPro['Positive'] = data[i]['count'];
            //         } else {
            //             jsonPro['Negative'] = data[i]['count'];
            //         }
            //     }
            // }
            // jsonFin['category'] = 'Finance';
            // jsonBus['category'] = 'Business';
            // jsonEco['category'] = 'Economy';
            // jsonPro['category'] = 'Property';

            // viewData.push(jsonFin)
            // viewData.push(jsonBus)
            // viewData.push(jsonEco)
            // viewData.push(jsonPro)

            // res.status(200).send(viewData);

        });
    }
}
module.exports = handlers;