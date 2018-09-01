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
    locals.section = 'allboard';

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


    // Load all finnews
    view.on('init', function(next) {

        var q_countAll = keystone.list('FinNew').model.find().count();

        q_countAll.exec(function(err, results) {
            locals.countAll = results;
            next(err);
        });
    });

    console.log(currentDateTime)
    console.log(tmrDateTime)

    view.on('init', function(next) {
        var q_countNeutral = keystone.list('FinNew').model.find({ sentiment: 'Neutral' }).count();

        q_countNeutral.exec(function(err, results) {
            locals.countNeutral = results;
            next(err);
        });
    });

    view.on('init', function(next) {
        var q_countPositive = keystone.list('FinNew').model.find({ sentiment: 'Positive' }).count();

        q_countPositive.exec(function(err, results) {
            locals.countPositive = results;
            next(err);
        });
    });

    view.on('init', function(next) {
        var q_countNegative = keystone.list('FinNew').model.find({ sentiment: 'Negative' }).count();

        q_countNegative.exec(function(err, results) {
            locals.countNegative = results;
            next(err);
        });
    });

    view.on('init', function(next) {
        var q_bySentiment = keystone.list('FinNew').model.aggregate([
            { $group: { _id: { sentiment: "$sentiment", }, count: { $sum: 1 } } }
        ]);

        q_bySentiment.exec(function(err, results) {
            locals.bySentiment = results;
            next(err);
        });
    });

    // Render the view
    view.render('allboard');

};