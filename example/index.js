var handlebartender = require('../index.js'),
  jsonHelper = function(context) {
    return JSON.stringify(context);
  },
  templates = handlebartender({
    templatePath: __dirname + '/hbs/',
    helpers: { json: jsonHelper }
  }),
  data = {
    title: 'Homepage',
    slogan: 'Something catchy to get the views'
  };

console.log('Our template index.hbs renders as: %s', templates['index'](data));
data.title = 'Page 2!!!';
data.myObject = { key: 'pair' };
console.log('Our template page2.hbs renders as: %s', templates['page2'](data));
