var AuthController = require('controllers/auth'),
	Multimodal = require('multimodal'),
	Utils = require('utils');

module.exports = AuthController.extend({

	listar: function() {
		this.renderView('main', 'sorteios/listar');
	},

	inserir: function() {
		var sorteio = new (require('models/sorteio'));

		Multimodal.show(new (require('views/sorteios/sorteio'))({model: sorteio}), 'modalSorteio');
		Utils.goToLastRoute();
	},

	detalhar: function(id) {
		var sorteio = new (require('models/sorteio'))({id: id});

		sorteio.fetch().success(function(res) {
			Multimodal.show(new (require('views/sorteios/sorteio'))({model: sorteio}), 'modalSorteio');
			Utils.goToLastRoute();
		});
	},

	callAction: function(param) {
		if(isNaN(parseInt(param, 10))) {
			if(param === 'inserir') {
				this.inserir();
			} else {
				require('controllers/application').pagina404();
			}
		} else {
			this.detalhar(param);
		}
	}
});