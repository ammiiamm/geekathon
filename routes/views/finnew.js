var keystone = require('keystone');
var FinNew = keystone.list('FinNew');
var filterBOT = 'Y';

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'finnews';
    locals.filters = {
        category: req.params.category,
    };
    locals.finnews = [];
    locals.data = {
        finnews: [],
    };

    locals.categories = [];

    //console.log(locals.filters)
    //console.log(locals.category)
    //console.log(req.params.category)
    //console.log(locals.filters.category)
    //console.log(req)

    // Load all finnews
    view.on('init', function(next) {

        var q = keystone.list('FinNew').model.find();

        q.exec(function(err, results) {
            //locals.data.finnews = results;
            locals.finnews = results;
            next(err);
        });

    });


    //console.log(req.params.category)

    // Load FinNew for each page
    view.on('init', function(next) {

        var q = FinNew.paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 5,
            })
            .sort('-published');

        if (req.params.category) {
            if ((req.params.category === 'Negative') || (req.params.category === 'Neutral') || (req.params.category === 'Positive')) {
                q.where('sentiment').in([req.params.category]);
            } else if (req.params.category === 'BOT') {
                q.where('filter_BOT').in([filterBOT]);
            } else {
                q.where('category').in([req.params.category]);
            }
        }

        q.exec(function(err, results) {
            locals.finnews = results;
            next(err);
        });

    });

    // Render the view
    view.render('finnew');

};