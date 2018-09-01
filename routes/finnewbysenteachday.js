var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;

var handlers = {
    getFinNewsBySentEachDay: function(req, res) {

        // DateTime formatting
        var lastFiveDateTime = new Date()
        var tmrDateTime = new Date()
        tmrDateTime.setDate(tmrDateTime.getDate() + 1)
        lastFiveDateTime.setDate(lastFiveDateTime.getDate() - 4)
        tmrDateTime.setHours(0, 0, 0, 0)
        lastFiveDateTime.setHours(0, 0, 0, 0)
        lastFiveDateTime = lastFiveDateTime.toISOString()
        tmrDateTime = tmrDateTime.toISOString()

        FinNew.aggregate([
            { $match: { published: { $gte: new Date(lastFiveDateTime), $lt: new Date(tmrDateTime) } } },
            { $group: { _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$published" } }, sentiment: "$sentiment" }, count: { $sum: 1 } } },
            { $sort: { '_id.date': -1, '_id.sentiment': 1 } }
        ]).exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            } else {
                console.log("API was called successfully.");
            }

            var viewData = [];
            var lookup = {};
            var date_list = [];


            //Get unique date name
            for (var i = 0; i < data.length; i++) {
                var date = data[i]['_id']['date'];
                console.log(date);
                if (!(date in lookup)) {
                    lookup[date] = 1;
                    date_list.push(date);

                }
            }
            // date_list.sort(function(a, b) {
            //     a = new Date(a.date);
            //     b = new Date(b.date);
            //     return a > b ? -1 : a < b ? 1 : 0;
            // });


            // for Negative
            var jsonData = {};
            var ndate;
            var nprice = 0;
            var jsonValue = [];
            jsonData['name'] = "Negative";
            for (var j = 0; j < date_list.length; j++) {
                var jsonInside = {};
                nprice = 0;
                for (var i = 0; i < data.length; i++) {
                    if ((data[i]['_id']['date'] === date_list[j]) && (data[i]['_id']['sentiment'] === 'Negative')) {
                        nprice = data[i]['count'];
                    }
                }
                jsonInside['date'] = date_list[j];
                jsonInside['price'] = nprice;
                jsonValue.push(jsonInside);
            }
            jsonData['values'] = jsonValue;
            viewData.push(jsonData)

            // // for Neutral
            var jsonData = {};
            var ndate;
            var nprice = 0;
            var jsonValue = [];
            jsonData['name'] = "Neutral";
            for (var j = 0; j < date_list.length; j++) {
                var jsonInside = {};
                nprice = 0;
                for (var i = 0; i < data.length; i++) {
                    if ((data[i]['_id']['date'] === date_list[j]) && (data[i]['_id']['sentiment'] === 'Neutral')) {
                        nprice = data[i]['count'];
                    }
                }
                jsonInside['date'] = date_list[j];
                jsonInside['price'] = nprice;
                jsonValue.push(jsonInside);
            }
            jsonData['values'] = jsonValue;
            viewData.push(jsonData)

            // // for Positive
            var jsonData = {};
            var ndate;
            var nprice = 0;
            var jsonValue = [];
            jsonData['name'] = "Positive";
            for (var j = 0; j < date_list.length; j++) {
                var jsonInside = {};
                nprice = 0;
                for (var i = 0; i < data.length; i++) {
                    if ((data[i]['_id']['date'] === date_list[j]) && (data[i]['_id']['sentiment'] === 'Positive')) {
                        nprice = data[i]['count'];
                    }
                }
                jsonInside['date'] = date_list[j];
                jsonInside['price'] = nprice;
                jsonValue.push(jsonInside);
            }
            jsonData['values'] = jsonValue;
            viewData.push(jsonData)

            // for (var j = 0; j < date_list.length; j++) {
            //     var jsonData = {};
            //     jsonData['date'] = date_list[j];
            //     jsonData['total'] = 0;
            //     for (var i = 0; i < data.length; i++) {
            //         if (data[i]['_id']['date'] === date_list[j]) {
            //             if (data[i]['_id']['sentiment'] === 'Neutral') {
            //                 jsonData['total'] = jsonData['total'] + data[i]['count'];
            //                 //jsonData['sense'] = 'Neutral';
            //                 jsonData['Neutral'] = data[i]['count'];
            //             } else if (data[i]['_id']['sentiment'] === 'Positive') {
            //                 jsonData['total'] = jsonData['total'] + data[i]['count'];
            //                 //jsonData['sense'] = 'Positive';
            //                 jsonData['Positive'] = data[i]['count'];
            //             } else {
            //                 jsonData['total'] = jsonData['total'] + data[i]['count'];
            //                 //jsonData['sense'] = 'Negative';
            //                 jsonData['Negative'] = data[i]['count'];
            //             }
            //         }
            //     }

            //     // //in case that some date has no news sentiment
            //     // if (jsonData['Neutral'] == null) {
            //     //     jsonData['Neutral'] = 0;
            //     // }
            //     // if (jsonData['Negative'] == null) {
            //     //     jsonData['Negative'] = 0;
            //     // }
            //     // if (jsonData['Positive'] == null) {
            //     //     jsonData['Positive'] = 0;
            //     // }

            //     // viewData.push(jsonData)
            // }

            // viewData.sort(function(a, b) {
            //     a = new Date(a.values.date);
            //     b = new Date(b.values.date);
            //     return a > b ? -1 : a < b ? 1 : 0;
            // });


            res.status(200).send(viewData);


        });
    }
}
module.exports = handlers;