var keystone = require('keystone');
var tmrDateTime = new Date()
var currentDateTime = new Date()

// DateTime formatting
tmrDateTime.setDate(tmrDateTime.getDate() + 1)
currentDateTime.setHours(0, 0, 0, 0)
tmrDateTime.setHours(0, 0, 0, 0)
tmrDateTime = tmrDateTime.toISOString()
currentDateTime = currentDateTime.toISOString()

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'board';

    locals.data = {
        finnews: [],

    };

    locals.countAll = 0;
    locals.countPositive = 0;
    locals.countNeutral = 0;
    locals.countNegative = 0;

    locals.bySentiment = [];
    locals.bySource = [];
    locals.byCat = [];
    //locals.byTime = [];


    // Load all finnews
    view.on('init', function(next) {

        // var q = keystone.list('FinNew').model.find();

        // q.exec(function(err, results) {
        //     locals.data.finnews = results;
        //     next(err);
        // });
        var q_countAll = keystone.list('FinNew').model.find({ published: { $gte: currentDateTime, $lt: tmrDateTime } }).count();
        console.log(currentDateTime);
        q_countAll.exec(function(err, results) {
            locals.countAll = results;
            next(err);
        });
    });

    console.log(currentDateTime)
    console.log(tmrDateTime)

    view.on('init', function(next) {
        var q_countNeutral = keystone.list('FinNew').model.find({ sentiment: 'Neutral', published: { $gte: currentDateTime, $lt: tmrDateTime } }).count();

        q_countNeutral.exec(function(err, results) {
            locals.countNeutral = results;
            if (results > 0) {
                locals.countNeutral = (((results / locals.countAll) * 100).toFixed(2));
            } else {
                locals.countNeutral = results;
            }
            next(err);
        });
    });

    view.on('init', function(next) {
        var q_countPositive = keystone.list('FinNew').model.find({ sentiment: 'Positive', published: { $gte: currentDateTime, $lt: tmrDateTime } }).count();

        q_countPositive.exec(function(err, results) {
            if (results > 0) {
                locals.countPositive = (((results / locals.countAll) * 100).toFixed(2));
            } else {
                locals.countPositive = results;
            }
            next(err);
        });
    });

    view.on('init', function(next) {
        var q_countNegative = keystone.list('FinNew').model.find({ sentiment: 'Negative', published: { $gte: currentDateTime, $lt: tmrDateTime } }).count();

        q_countNegative.exec(function(err, results) {
            if (results > 0) {
                locals.countNegative = (((results / locals.countAll) * 100).toFixed(2));
            } else {
                locals.countNegative = results;
            }
            next(err);
        });
    });

    view.on('init', function(next) {
        var q_bySentiment = keystone.list('FinNew').model.aggregate([
            { $match: { published: { $gte: currentDateTime, $lt: tmrDateTime } } },
            { $group: { _id: { sentiment: "$sentiment", }, count: { $sum: 1 } } }
        ]);

        q_bySentiment.exec(function(err, results) {
            locals.bySentiment = results;
            next(err);
        });
    });

    // Render the view
    view.render('board');

};