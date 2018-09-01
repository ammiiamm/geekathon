var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FinNew Model
 * ==========
 */

var FinNew = new keystone.List('FinNew', {
    map: { name: '_id' }
});

FinNew.add({
    url_link: { type: Types.Text, initial: true, required: true },
    published: {
        type: Types.Datetime,
        default: Date.now,
        initial: true,
        required: true
    },
    source: { type: Types.Text, initial: true, required: true },
    title_detail: { type: Types.Text, initial: true, required: true },
    title: { type: Types.Text, initial: true, required: true },
    summary: { type: Types.Text, initial: true, required: true },
    retrieved: {
        type: Types.Datetime,
        default: Date.now,
        initial: true,
        required: true
    },
    sentiment: { type: Types.Text, initial: true, required: true },
    fetch_dt: { type: Types.Datetime, default: Date.now, initial: true, required: true },
    category: { type: Types.Text, initial: true, required: true },
    filter_BOT: { type: Types.Text, initial: true, required: true }
});


FinNew.defaultColumns = '_id|20%, title, category, published|20%, sentiment'
FinNew.register();