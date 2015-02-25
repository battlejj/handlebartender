var HBT = require('../index.js');

/*
Want to register helpers the old fashions way? You can do that! HBT exposes it's Handlebars instance
for you to use it if you are more comfortable with that.
 */
HBT.Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});

/*
But we can also pass our helpers as an option to our compile() call.
Notice how we can still use the Handlebars helper functions Utils.escapeExpression and SafeString
in our helpers
 */
var linkHelper = function(text, url) {
  text = HBT.Handlebars.Utils.escapeExpression(text);
  url  = HBT.Handlebars.Utils.escapeExpression(url);

  var result = '<a href="' + url + '">' + text + '</a>';

  return new HBT.Handlebars.SafeString(result);
};

var jsonHelper = function(context) {
  return JSON.stringify(context);
};

/*
Now lets compile our templates, you can pass a few options:
templatePath, partialsPath, extension, helpers
Only templatePath is required. Partials path will default to the subdirectory "partials" in your templatePath directory
 */
var templates = HBT.compile({
  templatePath: __dirname + '/hbs',
  helpers: {
    json: jsonHelper, //your helper will be accessible by "json" in your handlebars templates, i.e. {{json myObject}}
    link: linkHelper //your helper will be accessible by "link" in your handlebars templates
  }
});

/*
We also have 2 methods for rendering templates, you can use the render method
*/
var template1 = templates.render('index', {
  title: 'I am the index page!',
  slogan: 'The magic happens here.'
});

/*
Or you can access the keys in templates directly
template 2 will contain the exact same content as template 1, just accessed a different way
*/
var template2 = templates['index']({
  title: 'I am the index page!',
  slogan: 'The magic happens here.'
});

/*
And you can nest your templates with ease
 */
var template3 = templates.render('email/forgotten-password', {
  title: 'Some Website',
  actions: [{
    text: 'unsubscribe',
    url: 'http://localhost/unsubscribe'
  }, {
    text: 'visit us',
    url: 'http://localhost/'
  }]
});

console.log('Template 1 - index.hbs with render method: %s\n', template1);
console.log('Template 2 - index.hbs with object key access: %s\n', template2);
console.log('Template 3 - email/forgotten-password.hbs nested templates: %s\n', template3);





