var keystone = require('keystone');

keystone.init({

    'name': 'SentiFine',
    'brand': 'Sentifine',
    'port': 3001,

    'favicon': 'public/favicon.ico',
    'less': 'public',
    'static': 'public',

    'views': 'templates/views',
    'view engine': 'pug',

    'auto update': true,
    //'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/sentifine',
    //'cloudinary config': 'cloudinary://911423321499375:cgH1jVf-b1qUnB3Xlwe_4Qylndg@ammiiamm/',
    'cloudinary config': 'cloudinary://911XXXXXXXXXXXX:XXXXXXX-XXXXXXXXXXX_XXXXXXX@ammiiamm/',

    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': process.env.COOKIE_SECRET || 'sentifine',

    //'ga property': process.env.GA_PROPERTY,
    //'ga domain': process.env.GA_DOMAIN,

    'chartbeat property': process.env.CHARTBEAT_PROPERTY,
    'chartbeat domain': process.env.CHARTBEAT_DOMAIN

});

keystone.import('models');

keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils
        //editable: keystone.content.editable,
        //ga_property: keystone.get('ga property'),
        //ga_domain: keystone.get('ga domain'),
        //chartbeat_property: keystone.get('chartbeat property'),
        //chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
    //'posts': ['posts', 'post-comments', 'post-categories'],
    //'galleries': 'galleries',
    'enquiries': 'enquiries',
    'users': 'users',
    'finnews': 'fin-news'
        //'field-tests': 'things'
});

keystone.start();