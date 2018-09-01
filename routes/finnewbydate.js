var keystone = require('keystone');
var FinNew = keystone.list('FinNew').model;

var handlers = {
    getFinNewsByDt: function(req, res) {

        // DateTime formatting
        var tmrDateTime = new Date()
        var currentDateTime = new Date()
        tmrDateTime.setDate(tmrDateTime.getDate() + 1)
        currentDateTime.setHours(0, 0, 0, 0)
        tmrDateTime.setHours(0, 0, 0, 0)
        tmrDateTime = tmrDateTime.toISOString()
        currentDateTime = currentDateTime.toISOString()

        FinNew.aggregate([
            //{ $match: { published: { $gte: new Date(currentDateTime), $lt: new Date(tmrDateTime) } } },
            { $group: { _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$published" } }, sentiment: "$sentiment" }, count: { $sum: 1 } } }
        ]).exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            } else {
                console.log("API was called successfully.");
            }

            var viewData = [];

            //convert json structure
            // for (var i = 0; i < data.length; i++) {
            //     var jsonData = {};
            //     jsonData['date'] = data[i]['_id']['date'];
            //     jsonData['group'] = data[i]['_id']['sentiment'];
            //     jsonData['value'] = data[i]['count'];
            //     viewData.push(jsonData)
            // }
            // res.status(200).send(viewData);


            var lookup = {};
            var date_list = [];


            //Get unique date name
            for (var i = 0; i < data.length; i++) {
                var date = data[i]['_id']['date'];

                if (!(date in lookup)) {
                    lookup[date] = 1;
                    date_list.push(date);
                }
            }

            for (var j = 0; j < date_list.length; j++) {
                var jsonData = {};
                jsonData['date'] = date_list[j]
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['_id']['date'] === date_list[j]) {
                        if (data[i]['_id']['sentiment'] === 'Neutral') {
                            jsonData['Neutral'] = data[i]['count'];
                        } else if (data[i]['_id']['sentiment'] === 'Positive') {
                            jsonData['Positive'] = data[i]['count'];
                        } else {
                            jsonData['Negative'] = data[i]['count'];
                        }
                    }
                }

                //in case that some date has no news sentiment
                if (jsonData['Neutral'] == null) {
                    jsonData['Neutral'] = 0;
                }
                if (jsonData['Negative'] == null) {
                    jsonData['Negative'] = 0;
                }
                if (jsonData['Positive'] == null) {
                    jsonData['Positive'] = 0;
                }

                viewData.push(jsonData)
            }

            res.status(200).send(viewData);


            // //Get unique date name
            // for (var i = 0; i < data.length; i++) {
            //     var date = data[i]['_id']['date'];

            //     if (!(date in lookup)) {
            //         lookup[date] = 1;
            //         date_list.push(date);
            //     }
            // }

            // var sentiment_list = ['Negative', 'Neutral', 'Positive'];

            // for (var j = 0; j < sentiment_list.length; j++) {

            //     var jsonData = {};
            //     jsonData['name'] = sentiment_list[j]; //sentiment 

            //     //first loop for adding data
            //     for (var i = 0; i < data.length; i++) {
            //         console.log(date_list[i])
            //             //console.log(date_list[i])

            //         if (date_list[i] === data[i]['_id']['date']) {

            //             if (data[i]['_id']['sentiment'] === sentiment_list[j]) {
            //                 jsonData['values']['date'] = date_list[i];
            //                 jsonData['values']['price'] = data[i]['count'];
            //             }
            //         }

            //         viewData.push(jsonData)
            //     }

            //     res.status(200).send(viewData);
            // }

        });
    }
}
module.exports = handlers;