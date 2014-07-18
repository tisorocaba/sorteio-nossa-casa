var Marionette = require('marionette');

module.exports = Marionette.ItemView.extend({

	events: {
		'submit form'    : 'salvar',
		'focusout input' : 'validate',
		'change select'  : 'validate'
	},

	onShow: function() {
		var that = this;

		setTimeout(function() {
			that.$('input:first').focus();
		});
	},

	validate: function() {
		this.called = this.called || false;

		if(this.model.validationError || this.called) {
			this.populateModel();
			this.model.isValid();
			this.called = true;
		}
	}
});