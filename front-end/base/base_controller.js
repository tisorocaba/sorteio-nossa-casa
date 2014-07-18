var Dispatcher = require('dispatcher'),
	_ = require('underscore');

module.exports = {
	before: function() {},
	beforeSpecial: function() {},
	afterSpecial: function() {},
	after: function() {},
	_aborted: false,
	abort: function() {
		this._aborted = true;
	},
	execute: function(method, args, special) {

		if(special !== null) {
			if(special) {
				this.beforeSpecial(method, location.hash);
			} else {
				this.before(method, location.hash);
			}
		}

		if(!this._aborted) {
			this[method].apply(this, args);
			if(special !== null) {
				if(special) {
					this.afterSpecial(method, location.hash);
				} else {
					this.after(method, location.hash);
				}
			}
		}
	},
	renderView: function(region, view, viewOptions) {
		var viewPath = 'views/' + view;
		Dispatcher.renderView(region, viewPath, viewOptions);
	},
	extend: function(options) {
		var attrs = _.extend({}, this, options);
		return attrs;
	}
};