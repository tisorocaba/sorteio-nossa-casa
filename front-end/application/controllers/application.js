var AuthController = require('controllers/auth');

module.exports = AuthController.extend({

	pagina404: function() {
		// view menu renderizada explicitamente pois rotas 404 não executam filtros!
		this.renderView('menu', 'menu');
		this.renderView('main', 'pagina404');
	}
});