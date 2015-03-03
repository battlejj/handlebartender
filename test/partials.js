var expect = require('chai').expect;
var HBT = require('../index');

describe('Tests of partial inclusion', function(){

  it('Should include partials with .hbs extension from templates/partials directory when not given any options' +
  'other than templatePath', function(done)//noinspection BadExpressionStatementJS
  {

    var templates = HBT.compile({
      templatePath: __dirname + '/templates'
    });

    //No partials of any extension should be available via the templates variable
    expect(templates['partial1']).to.not.exist;
    expect(templates['partial2']).to.not.exist;
    expect(templates['partial3']).to.not.exist;
    expect(templates['partial4']).to.not.exist;

    var expectedResult = '<h1>I am the home template.</h1>' +
    '<h2>This is partial 1.</h2>' +
    '<h3>Hello world.</h3>';

    expect(templates.render('home', { name: 'world' })).to.eql(expectedResult);

    done();

  });

  it('Should include partials of the proper extension from templates/partials when only templatePath and extension' +
  'are provided', function(done){

    var expectedResult = 'I am an HTML page. I am partial4.';

    var templates = HBT.compile({
      templatePath: __dirname + '/templates',
      extension: 'html'
    });

    expect(templates.render('home', { name: 'partial4' })).to.eql(expectedResult);

    done();

  });

  it('Should properly use partials from other directories when partialPath argument is provided.', function(done){

    var expectedResult = 'This template includes an template from outside the root templatePath.' +
      'This partial is found outside of the root templates directory.';

    var templates = HBT.compile({
      templatePath: __dirname + '/templates',
      partialsPath: __dirname + '/otherPartials'
    });

    expect(templates.render('exterior', {})).to.eql(expectedResult);

    done();

  });

  it('Should properly use partials that are loaded via the internal Handlebars instance before' +
  'compile() method is called.', function(done){

    var expectedResult = 'This template loads your manually registered partial. ' +
      'This was manually loaded during the test.';

    HBT.Handlebars.registerPartial('manual', 'This was manually loaded during the test.');

    var templates = HBT.compile({
      templatePath: __dirname + '/templates'
    });

    expect(templates.render('internal', {})).to.eql(expectedResult);

    done();

  });

  it('Should throw an error when a non-existent partial is included.', function(done){

    var expectedResult = 'This template includes an template from outside the root templatePath.This partial is found ' +
      'outside of the root templates directory.';

    var templates = HBT.compile({
      templatePath: __dirname + '/templates'
    });


    console.log(templates.render('exterior', {}));

    expect(templates.render('exterior', {})).to.throw(Error);

    done();

  });

});
