var Backbone = require('backbone'),
	_ = require('underscore'),
	Auth = require('auth'),
	Multimodal = require('multimodal'),
	Config = require('config');

// Exporta o jquery globalmente para compatibilidade com plugins.
jQuery = $ = require('jquery');

// Injeta o jquery.
Backbone.$ = $;

// Registra o eventos previamente cadastrados
require('events');

// Código a ser executado antes da inicialização da aplicação.
module.exports = function() {
	// Auth
	Auth.init({
		appSigla      : 'SORTEIO',
		appDescricao  : 'Aplicativo para sorteio de residências do programa Nossa Casa',
		loginUrl      : Config.BASE_URL + '/api/usuario/login',
		logoutUrl     : Config.BASE_URL + '/api/usuario/logout',
		loggedUserUrl : Config.BASE_URL + '/api/usuario'
	});

	// Multimodal
	Multimodal.initialize(require('application'), {
		alert: {
			title: '<span class="text-info">Mensagem</span>',
			btnOk: {
				label: 'OK',
				className: 'btn-primary btn-sm'
			}
		},
		confirm: {
			title: '<span class="text-info">Confirmação</span>',
			btnOk: {
				label: 'Sim',
				className: 'btn-success btn-sm'
			},
			btnCancel: {
				label: 'Não',
				className: 'btn-danger btn-sm'
			}
		},
		confirmInline: {
			message: 'Confirma?',
			btnOk: {
				label: 'Sim',
				className: 'btn-success btn-sm'
			},
			btnCancel: {
				label: 'Não',
				className: 'btn-danger btn-sm'
			}
		},
		notify: {
			width: 420,
			delay: 3000,
			allow_dismiss: true
		}
	});

	// Backbone Model Invalid
	Backbone.Model.prototype.on('invalid change', _.debounce(function(model, errors, options) {
		try {
			var $list = $('.validation-messages-list:last'),
				validationErrors = _.isArray(errors) ? errors : model.validationError,
				items = [];

			$('.form-group').removeClass('has-error');

			_.each(validationErrors, function(err) {
				items.push('<li><i class="glyphicon glyphicon-exclamation-sign"></i>&nbsp;&nbsp;' + err.message + '</li>');
				$(err.element).parents('.form-group').addClass('has-error');
			});

			$list.html(items);

			// $('.form-group.has-error > .form-control:first').focus();

			if(items.length > 0) {
				$list.parents('.alert').removeClass('hide');
			} else {
				$list.parents('.alert').addClass('hide');
			}
		} catch(err) {}
	}, 100));
};