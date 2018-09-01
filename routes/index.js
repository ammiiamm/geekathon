const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);

var apiHandlers = require('./finnew');
var apiCatHandlers = require('./finnewbycat');
var apiSrcHandlers = require('./finnewbysource');
var apiDtHandlers = require('./finnewbydate');
var apiSentHandlers = require('./finnewbysent');
var apiCatAllHandlers = require('./finnewbycatall');
var apiSrcAllHandlers = require('./finnewbysourceall');
var apiSentAllHandlers = require('./finnewbysentall');
var apiSentEachDayHandlers = require('./finnewbysenteachday');

var csv = require('express-csv');
var express = require('express');
var mongoose = require('mongoose');
var FinNew = mongoose.model('FinNew');


keystone.pre('routes', function(req, res, next) {
    res.locals.navLinks = [
        { label: 'Home', key: 'home', href: '/' },
        { label: 'News', key: 'finnew', href: '/finnew' },
        { label: 'Daily Dashboard', key: 'board', href: '/board' },
        { label: 'Overall Dashboard', key: 'allboard', href: '/allboard' },
        //{ label: 'Blog', key: 'blog', href: '/blog' },
        //{ label: 'Gallery', key: 'gallery', href: '/gallery' },
        { label: 'Contact', key: 'contact', href: '/contact' },
    ];
    res.locals.user = req.user;
    next();
});

keystone.pre('render', middleware.theme);
keystone.pre('render', middleware.flashMessages);

keystone.set('404', function(req, res, next) {
    middleware.theme(req, res, next);
    res.status(404).render('errors/404');
});

//// Import Route Controllers
//var routes = {
//    views: importRoutes('./views'),
//};

// Load Routes
var routes = {
    download: importRoutes('./download'),
    views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function(app) {

    // Views
    app.get('/', routes.views.index);
    //app.get('/blog/:category?', routes.views.blog);
    //app.all('/blog/post/:post', routes.views.post);
    //app.get('/gallery', routes.views.gallery);
    app.get('/finnew/:category?', routes.views.finnew);
    app.all('/contact', routes.views.contact);
    app.get('/finnew', routes.views.finnew);
    app.get('/board', routes.views.board);
    app.get('/allboard', routes.views.allboard);

    // Downloads
    app.get('/download/users', routes.download.users);

    //API Routes
    app.get('/api/finnew', apiHandlers.getFinNews);
    app.get('/api/finnewbycat', apiCatHandlers.getFinNewsByCat);
    app.get('/api/finnewbysource', apiSrcHandlers.getFinNewsBySource);
    app.get('/api/finnewbydate', apiDtHandlers.getFinNewsByDt);
    app.get('/api/finnewbysent', apiSentHandlers.getFinNewsBySent);
    app.get('/api/finnewbycatall', apiCatAllHandlers.getFinNewsByCatAll);
    app.get('/api/finnewbysourceall', apiSrcAllHandlers.getFinNewsBySourceAll);
    app.get('/api/finnewbysentall', apiSentAllHandlers.getFinNewsBySentAll);
    app.get('/api/finnewbysenteachday', apiSentEachDayHandlers.getFinNewsBySentEachDay);

    //Export CSV
    app.get('/exporttocsv', function(req, res, next) {
        var filename = "finnew.csv";
        var dataArray;
        FinNew.find({}, { retrieved: 0 }).lean().exec({}, function(err, finnews) {
            if (err) res.send(err);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
            res.csv(finnews, true);
        });
    });


}