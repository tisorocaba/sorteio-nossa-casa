var	Backbone = require('backbone'),
	BaseController = require('base_controller'),
	Application = require('application'),
	Utils = require('utils'),
	Auth = require('auth'),
	Multimodal = require('multimodal');

module.exports = BaseController.extend({

	before: function(method, route) {
		this.renderView('menu', 'menu');

		if(method !== 'login') {
			var that = this;
			Auth.isLogged().success(function(res) {
				if(!res.status) {
					Backbone.history.navigate('login', true);
					that.abort();
				}
			});
		}
	},

	login: function() {
		var loginView = new Auth.loginView({
			callbackdoLoginOK: function(res) {
				if(res.status) {
					Utils.goToLastRoute();
					location.reload(true);
				}
			}
		});

		Auth.isLogged().success(function(res) {
			if(!res.status) {
				Application.main.show(loginView);
			} else {
				Utils.goToLastRoute();
			}
		});
	},

	logout: function() {
		Multimodal.confirm('Deseja realmente sair do sistema?', function(resposta) {
			if(resposta) {
				Auth.logout().success(function() {
					Backbone.history.navigate('login', true);
				});
			} else {
				Utils.goToLastRoute();
			}
		});
	}
});