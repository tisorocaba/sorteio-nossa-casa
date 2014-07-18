var PagedCollection = require('paginator').pagedCollection,
	Config = require('config');

module.exports = PagedCollection.extend({

	initialize: function(models, options) {
		if(options.idSorteio) {
			this.url = Config.BASE_URL + '/api/sorteio/' + options.idSorteio + '/candidato';
		}

		if(options.idLista) {
			this.url = Config.BASE_URL + '/api/sorteio/lista/' + options.idLista + '/candidato';
		}

		PagedCollection.prototype.initialize.call(this);
	}
});