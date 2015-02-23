var handlebartender = require('../index.js')

  , templates = handlebartender({ templatePath: './hbs/' })
  , data = {
    title: 'Homepage',
    slogan: 'Something catchy to get the views'
  }
  ;

console.log('Our template index.hbs renders as: %s', templates['index'](data));
data.title = 'Page 2!!!';
console.log('Our template page2.hbs renders as: %s', templates['page2'](data));
