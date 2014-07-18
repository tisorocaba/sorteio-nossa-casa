var Marionette = require('marionette'),
	Auth =  require('auth'),
	Utils = require('utils');

module.exports = Marionette.ItemView.extend({
	template: 'menu.tpl',

	onShow: function() {
		Auth.isLogged().success(function(res) {
			if(res.status) {
				Utils.setLoggedUserEl(res.data.nome);
			}
		});

		setTimeout(function() {
			Utils.activeMenuItensOnHover();
		}, 100);
	}
});