var minimatch = require('minimatch')
  , readSync = require('recursive-readdir-sync')
  , path = require('path')
  , fs = require('fs')
  , Handlebars = require('handlebars')
  ;

if(!path.isAbsolute){
  path.isAbsolute = function(p){
    return path.resolve(p) === path.normalize(p)
  };
}

module.exports = function(options){

  var templatePath
    , partialsPath
    , templates = {}
    , extension = options.extension || '.hbs'
    , templatesPattern
    , partialsPattern
    , helpers = options.helpers || {}
    ;

  if(extension.indexOf('.') < 0){
    //can't think of a use case where an extension would not contain a ., so add one if the person didn't pass it
    extension = '.' + extension;
  }

  //Load any helpers if they exist, helpers should be an array of key/value pairs. Key will be helper name, value will
  //be the function associated with it

  for(var key in helpers){
    if(helpers.hasOwnProperty(key)){
      Handlebars.registerHelper(key, helpers[key]);
    }
  }

  if (!options.templatePath) {
    throw new Error('handlebartender: templatePath is a required argument so we know where to look.');
  }

  if (path.isAbsolute(options.templatePath)) {
    templatePath = options.templatePath;
  } else {
    templatePath = path.resolve(options.templatePath);
  }

  partialsPath = templatePath + '/partials';
  templatesPattern = templatePath + '/{!(partials),/**/}*' + extension;
  partialsPattern = partialsPath + '/**/*' + extension;

  try {
    var partials = readSync(partialsPath);
  } catch(err){
    if(err.errno === 34){
      console.error('handlebartender: partialPath of %s does not exist. Attempting to continue ' +
      'without use of partials.', partialsPath);
      partials = [];
    } else {
      err.message = 'handlebartender: An error occurred while trying to read partialsPath directory with package ' +
      'recursive-readdir: ' + err.message;
      throw err;
    }
  }

  for(var i = 0, len = partials.length, partial = null, partialName; i < len; i++){
    partial = partials[i];

    if(minimatch(partial, partialsPattern)){
      partialName = path.basename(partial, extension);
      partialName = partialName
        .replace('-', '_')
        .replace('.', '_')
        .replace('/', '_')
      ;

      Handlebars.registerPartial(partialName, fs.readFileSync(partial).toString());
    } else {
      //console.log('File %s does not match partialPattern of: %s. Skipping file.', file, partialsPattern);
    }

  }

  try {
    var hbsTemplates = readSync(templatePath);
  } catch(err){
    if(err.errno === 34){
      throw new Error('handlebartender: templatePath of ' + templatePath + ' does not exist. We cannot continue.');
    } else {
      err.message = 'handlebartender: An error occurred while trying to read ' + templatePath + ' directory as' +
      'templatePath with package recursive-readdir: ' + err.message;
      throw err;
    }
  }

  for(var x = 0, l = hbsTemplates.length, file = null, templateName; x < l; x++){
    file = hbsTemplates[x];

    if(!minimatch(file, partialsPattern) && minimatch(file, templatesPattern)) {
      templateName = file.replace(templatePath, '');

      //remove leading / from templateName if its there
      if(templateName.slice(0, 1) === '/'){
        templateName = templateName.slice(1, templateName.length - 1)
      }

      templateName = templateName.replace(path.extname(templateName), '');
      templates[templateName] = Handlebars.compile(fs.readFileSync(file).toString());
    } else {
      //console.log('File %s does not match templatesPattern of: %s. Skipping file.', file, templatesPattern);
    }
  }

  return templates;
};
