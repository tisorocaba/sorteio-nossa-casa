var Backbone = require('backbone'),
	Sorteio = require('models/sorteio'),
	Config= require('config');

module.exports = Backbone.Collection.extend({
	model: Sorteio,
	url: Config.BASE_URL + '/api/sorteio',

	initialize: function() {
		this.fetch({async: false});
	},

	comparator: function(modelA, modelB) {
		var dataA = modelA.get('data').split('/');
		var dataB = modelB.get('data').split('/');

		dataA = new Date(dataA[2], dataA[1] - 1, dataA[0]);
		dataB = new Date(dataB[2], dataB[1] - 1, dataB[0]);

		return dataA > dataB ? -1 : dataA < dataB ? 1 : 0;
	},

	parse: function(res) {
		return res.data;
	}
});