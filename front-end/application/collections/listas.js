var Backbone = require('backbone'),
	Config= require('config');

module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {
		this.url = Config.BASE_URL + '/api/sorteio/' + options.idSorteio + '/lista';
		this.fetch({async: false});
	},

	parse: function(res) {
		return res.data;
	}
});