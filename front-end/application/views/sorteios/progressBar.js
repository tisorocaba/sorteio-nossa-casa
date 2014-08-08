var Marionette = require('marionette');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/progress_bar.tpl',

	initialize: function(options) {
		this.message = options.message;
		this.oldModalEscape = $.fn.modal.Constructor.prototype.escape;
		$.fn.modal.Constructor.prototype.escape = function () {};
	},
	onRender: function() {
		this.$('#message').html(this.message);
	},
	onDestroy: function() {
		$.fn.modal.Constructor.prototype.escape = this.oldModalEscape;
	},
	onRemove: function() {
		console.log('removed');
	},
	update: function(value) {
		this.$('.progress-bar').css('width', value + '%').html(value + '%');
	}
});