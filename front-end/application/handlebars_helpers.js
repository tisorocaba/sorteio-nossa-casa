var Handlebars = require('handlebars.runtime')['default'],
	Auth = require('auth'),
	Config = require('config'),
	Moment = require('moment');

Handlebars.registerHelper('CONFIG', function(attr) {
	if (attr === 'ENV') {
		return new Handlebars.SafeString('<span style="color:tomato;">' + Config[attr] + '</span>');
	} else {
		return Config[attr];
	}
});

Handlebars.registerHelper('isLogged', function(options) {
	var context = this;

	function isLogged() {
		var isLogged;

		Auth.isLogged().success(function(res) {
			isLogged = res.status ? options.fn(context) : options.inverse(context);
		});

		return isLogged;
	}
	return isLogged();
});

Handlebars.registerHelper('formatDate', function(data) {
	return Moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
});

Handlebars.registerHelper('VALIDATION_MESSAGES', function() {
	var template = [
		'<div class="row">',
		'	<div class="col-md-12">',
		'		<div class="alert alert-danger hide">',
		'			<ul class="validation-messages-list" style="list-style-type:none; padding-left:0;"></ul>',
		'		</div>',
		'	</div>',
		'</div>'
	].join('');

	return new Handlebars.SafeString(template);
});