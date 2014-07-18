var Marionette = require('marionette'),
	Handlebars = require('handlebars.runtime')['default'],
	Templates = require('templates')(Handlebars),
	Config = require('config'),
	Handlebars_Helpers = require('handlebars_helpers'),
	Application = new Marionette.Application();

Marionette.Renderer.render = function(template, data) {
	if(typeof template === 'function') {
		return template(data);
	} else {
		return Templates[template](data);
	}
};

Application.addRegions(Config.regions);

// Código a ser executado na inicialização da aplicação.
Application.addInitializer(function() {});

module.exports = Application;