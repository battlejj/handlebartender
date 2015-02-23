handlebartender
===============
Allows you to render Handlebar templates anywhere in your backend logic.

Installing
==========
```
npm i handlebartender
```

What's it for?
==============
If you are using handlebars as a view engine for express you've probably run into the issue
where you want to render some content that isn't strictly a server view to be rendered, but
you still want to use a templating engine to render it and you want to only use one system

For me this was rendering e-mail templates before sending them off to users, but I'm sure
there are many other reasons to do this, perhaps PDF report generation or something.

How does it work?
=================
The usage is pretty simple. You provide at the minimum an absolute or relative path to a directory containing
handlebars templates. If you are using a relative path, it should be relative to the path of the executing script.

```javascript
//assume your location relative to this file is ./resources/templates
var templates = handlebartender({ templatePath: __dirname + '/resources/templates'});
````

handlebartender() is a ***BLOCKING*** call, so ***do not expect async behavior***, this operation is intended to only be done once
at app startup so once templates are compiled this code should be used in a way that it doesn't run again.

**templates** variable now contains a structure that uses the files structure relative to your templatePath as keys.

```javascript
//assume you have a template located at ./resources/templates/email/forgotten-password
//and you passed the *templatePath* of ./resources/templates to handlebartender
//you can now access it via:
templates['email/forgotten-password'](data);
```

These directories can be nested with a minor exception, the folder "partials" in that path
will always be reserved for holding partials. So if you are following the example from above the path:

```
./resources/templates/partials
```
would be registered as partials, not as standard templates. If you aren't sure what partials are or how to use them,
check the handlebars documentation. Customizing the partials path is on the roadmap but not in the current release.

You cannot normally nest folders in the partials directory. handlebartender will attempt to load partials in a nested
file structure but will do so by changing every subdirectory / to a \_. (hypens \[\-\] as wel as dots \[\.\] will also
be replaced with underscores \[\_\] because using those characters in a partial include is a syntax error for
handlebars. So for instance if you had:

```
templates/partials/email/headers/header1
```

you would then access the partial in your template with:

```
{{> email_headers_header1}}
```

Basic Usage
-----------
If you template path from the root of your site happens to be

```javascript
  var handlebartender = require('handlebartender');
  var templates = handlebartender({ templatePath: __dirname + '/resources/templates' });
  var data = {
      title: 'Forgotten Password Email',
      email: 'someone@somewhere.com',
      resetLink: 'https://yoursite.com/password-reset/some-uuid'
    }
    ;

  console.log(templates['email/forgotten-password'](data));
```

Optional Params
---------------
extension (defaults to .hbs)


