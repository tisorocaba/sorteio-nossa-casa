/**
 * Baltazzar Auth
 * Versão: 1.0.4
 * Componente de autenticacao da PMS para o novo boiler plate
 * Autor: BaltazZar Team
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.baltazzar||(f.baltazzar={})).auth=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var $ = _dereq_('jquery'),
	_ = _dereq_('underscore'),
	Backbone = _dereq_('backbone'),
	AUTH = this;

Backbone.$ = $;

exports.init = function(options) {
	AUTH.loginUrl = options.loginUrl || '';
	AUTH.logoutUrl = options.logoutUrl || '';
	AUTH.loggedUserUrl = options.loggedUserUrl || '';
	AUTH.loginShowMessageTimer = options.loginShowMessageTimer || 3000;
	AUTH.appSigla = options.appSigla || 'Sigla';
	AUTH.appDescricao = options.appDescricao || 'Descrição';
	AUTH.appBotao = options.appBotao || 'Confirmar';
};

exports.loginView = Backbone.View.extend({

	events: {
		'submit .login-block-form': 'doLogin'
	},

	initialize: function(options) {
		// Template default de loginView
		var loginTemplate = [
		'<div class="login-block">',
		'	<div class="panel panel-default">',
		'		<div class="panel-heading">&nbsp;</div>',
		'		<div class="panel-body">',
		'			<form class="login-block-form">',
		'				<div class="col-md-12 login-block-sigla text-center">' + AUTH.appSigla + '</div>',
		'				<div class="col-md-12 login-block-descricao">' + AUTH.appDescricao + '</div>',
		'				<div class="col-md-12">',
		'					<div class="alert alert-danger login-block-message hide"></div>',
		'				</div>',
		'				<div class="col-md-12">',
		'					<div class="form-group">',
		'						<input type="text" class="form-control input-sm login-block-username" placeholder="Usuário">',
		'					</div>',
		'				</div>',
		'				<div class="col-md-12">',
		'					<div class="form-group">',
		'						<input type="password" class="form-control input-sm login-block-password" placeholder="Senha">',
		'					</div>',
		'				</div>',
		'				<div class="col-md-12">',
		'					<button type="SUBMIT" class="btn btn-success btn-block pull-right login-block-confirm">' + AUTH.appBotao + '</button>',
		'				</div>',
		'			</form>',
		'		</div>',
		'	</div>',
		'</div>'].join('');

		this.template = options._template || loginTemplate;
		this.events = _.extend({}, this.events, options._events);

		this.callbackdoLoginOK = options.callbackdoLoginOK || '';
		this.callbackdoLoginNOK = options.callbackdoLoginNOK || '';

		this.render();
	},

	render: function() {
		var that = this;

		this.$el.html(this.template);

		setTimeout(function() {
			that.setaFoco();
		}, 100);
	},

	setaFoco: function() {
		this.$('input:first').focus();
	},

	login: function(username, password) {
		return $.ajax({
						method: 'POST',
						url: AUTH.loginUrl,
						async: false,
						cache: false,
						data: {
							login: username,
							senha: password
						}
		});
	},

	doLogin: function(ev) {
		ev.preventDefault();

		var loginBlockMessage = $('.login-block-message'),
			loginBlockConfirm = $('.login-block-confirm'),
			user = this.$('.login-block-username').val(),
			pass = this.$('.login-block-password').val(),
			timer = AUTH.loginShowMessageTimer,
			fRet = false,
			that = this;

		// Desabilita botao Confirmar para execucao do processo de login
		loginBlockConfirm.prop('disabled', true);

		// Procedimento de login
		var retCall = this.login(user, pass).success(this.callbackdoLoginOK).error(this.callbackdoLoginNOK);

		if(retCall) {
			retJSON = retCall.responseJSON || null;

			if(retJSON) {
				if(!retJSON.status || !retJSON.data) {
					// Exibe mensagem de erro caso ocorra e reabilita botao Confirmar
					loginBlockMessage.html(retJSON.message).removeClass('hide').fadeIn().delay(timer).fadeOut(function() { loginBlockConfirm.prop('disabled', false); that.setaFoco(); });
				} else {
					fRet = true;
				}
			} else {
				// Exibe mensagem de erro caso ocorra e reabilita botao Confirmar
				loginBlockMessage.html(retCall.statusText).removeClass('hide').fadeIn().delay(timer).fadeOut(function() { loginBlockConfirm.prop('disabled', false); that.setaFoco(); });
			}
		} else {
			// Reabilita botao Confirmar
			loginBlockConfirm.prop('disabled', false);
			this.setaFoco();
		}

		return fRet;
	}
});

exports.logout = function() {
	return $.ajax({
					method: 'POST',
					url: AUTH.logoutUrl,
					async: false,
					cache: false
	});
};

exports.isLogged = function() {
	return $.ajax({
					method: 'GET',
					url: AUTH.loggedUserUrl,
					async: false,
					cache: false
	});
};
},{}]},{},[1])
(1)
});