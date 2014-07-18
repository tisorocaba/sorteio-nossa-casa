var Backbone = require('backbone'),
	Config = require('config');

module.exports = Backbone.Model.extend({
	urlRoot: Config.BASE_URL + '/api/sorteio',

	defaults: {
		'data': ''
	},

	validate: function(attrs) {
		var errors = [];
		if(attrs.data === '') {
			errors.push({
				element: '#data',
				message: 'Data precisa ser informada'
			});
		}

		return errors.length > 0 ? errors : null;
	},

	parse: function(res) {
		if(res.status) {
			return res.data;
		} else {
			return res;
		}
	}
});