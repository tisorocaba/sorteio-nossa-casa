var Backbone = require('backbone'),
	_ = require('underscore'),
	Config = require('config');

module.exports = Backbone.Router.extend({

	initialize: function(routes) {
		var router = this;

		_.each(routes, function(r) {
			var route = r.route,
				controller = require('controllers/' + r.controller),
				method = r.method,
				special = r.special;

			router.route(route, function() {
				var args = _.initial(arguments);

				if(!_.contains(Config.BLACKLIST_ROUTES, route)) {
					window.lastRoute = Backbone.history.fragment;
				}

				controller.execute(method, args, special);
			});
		});
	}
});