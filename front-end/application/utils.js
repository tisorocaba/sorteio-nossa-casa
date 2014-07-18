var $ = require('jquery'),
	Backbone = require('backbone'),
	Auth = require('auth');

exports.activeMenuItensOnHover = function() {
	$('.navbar-nav > li').on('mouseover', function() {
		$(this).addClass('open').closest('.dropdown-menu').css('display', 'block');
	}).on('mouseout', function() {
		$(this).removeClass('open').closest('.dropdown-menu').css('display', 'none');
	});
};

exports.goToLastRoute = function() {
	Backbone.history.navigate(window.lastRoute);
};

exports.setLoggedUserEl = function(nome) {
	var element = [
		'<div class="pull-right">',
		'	<p class="navbar-text">loggedUser</p>',
		'	<button type="button" class="btn btn-xs btn-warning login-block-logout" style="margin-top:14px; margin-right:10px;">Sair</button>',
		'</div>'
	].join('').replace('loggedUser', nome);

	$('.logged-user-el').html(element);

	$('.login-block-logout').on('click', function(ev) {
		Backbone.history.navigate('logout', {trigger: true});
	});
};
