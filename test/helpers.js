var expect = require('chai').expect;
var HBT = require('../index');

describe('Tests of helper inclusion', function(){

  it('Should include helpers passed via the helpers argument', function(done)//noinspection BadExpressionStatementJS
  {

    var templates = HBT.compile({
      templatePath: __dirname + '/templates',
      helpers: {
        json: function(obj){
          return JSON.stringify(obj);
        }
      }
    });

    var expectedResult = '<h2>JSON Helper Test</h2><p>{&quot;key&quot;:&quot;pair&quot;}</p>';

    expect(templates.render('jsonHelperTestTemplate', { test: { key: 'pair' } })).to.eql(expectedResult);

    HBT.Handlebars.unregisterHelper('json');

    done();

  });

  it('Should include helpers loaded via the internal Handlebars instance before' +
  'compile() method is called.', function(done)//noinspection BadExpressionStatementJS
  {

    HBT.Handlebars.registerHelper('link', function(text, url) {
      text = HBT.Handlebars.Utils.escapeExpression(text);
      url  = HBT.Handlebars.Utils.escapeExpression(url);

      var result = '<a href="' + url + '">' + text + '</a>';

      return new HBT.Handlebars.SafeString(result);
    });

    var templates = HBT.compile({
      templatePath: __dirname + '/templates'
    });

    var expectedResult = '<h2>Link Helper Test</h2><p><a href="https://www.google.com">Google Link</a></p>';

    expect(templates.render('linkHelperTestTemplate', {})).to.eql(expectedResult);

    HBT.Handlebars.unregisterHelper('link');

    done();

  });



});
