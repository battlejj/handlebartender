handlebartender
===============
Allows you to render Handlebar templates anywhere in your backend logic.

Installing
----------
```
npm i handlebartender
```

Basic Usage
-----------
```javascript
//require handlebartender
var HBT = require('handlebartender');

//tell handlebartender where the templates are to compile
var templates = HBT.compile({
  templatePath: __dirname + '/some/template/path/'
});

//you now have two ways to render your templates with data
var myData = { title: 'Hey!'}

//You should omit the extension name
templates.render('templateName', myData);

//the above is the equivalent to
templates['templateName'](myData);
```

Partials
--------
By default handlebartender will look in your templatePath under the subdirectory 'partials'. For this reason avoid
storing templates that are not intended to be partials in this directory. You also have the option to pass your
partialsPath to the compile method if you decide to store them somewhere else.

```javascript
var templates = HBT.compile({
  templatePath: __dirname + '/some/template/path/',
  partialsPath: __dirname + '/another/path/'
});
```

You can also register a partial the old fashioned way by accessing the handlebartenders internal Handlebars instance.
If you choose to do this, make sure you do it BEFORE you compile templates, otherwise the partial will not be available
for use in your templates and you will error out.

```javascript
var HBT = require('handlebartender');
HBT.Handlebars.registerPartial('header', '<h2>{{title}}</h2>');
```

Helpers
-------
Adding helpers to handlebartenders is also simple. You can pass a key value pair of a helper name and function as the
'helper' option to the compile method. For example:

```javascript
//make a helper we can use

var jsonHelper = function(context) {
  return JSON.stringify(context);
};

var templates = HBT.compile({
  templatePath: __dirname + '/some/template/path/',
  helpers: {
    json: jsonHelper
  }
});
```

As with partials, you can register a helper with handlebartenders internal Handlebars instance as well. When registering
a partial via the built in Handlebars instance, you need to do this before compiling templates otherwise you
will get an error when using it.

```javascript
HBT.Handlebars.registerHelper('link', function(text, url) {
  text = HBT.Handlebars.Utils.escapeExpression(text);
  url  = HBT.Handlebars.Utils.escapeExpression(url);

  var result = '<a href="' + url + '">' + text + '</a>';

  return new HBT.Handlebars.SafeString(result);
});
```

Optional Arguments
------------------
***partialsPath*** - defaults to templatePath + '/partials'

***helpers*** - defaults to {}

***extension*** - defaults to .hbs

Tests
-----
```
npm test
```
There aren't a ton of tests right now. But any contributions on this front are welcome.

On pre-1.0 version?
-------------------
I have created a 0.0.8x branch for anyone interested in the old usage
(https://github.com/battlejj/handlebartender/tree/v0.0.8), however, I will not be supporting it.

