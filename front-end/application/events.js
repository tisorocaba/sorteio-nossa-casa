var Backbone = require('backbone'),
	Events = Backbone.Events;

Events.on('reset_form', function(form) {
	$(form)[0].reset();
	$(form).find('.form-control:first').focus();
});

Events.on('close_modal', function() {
	$('.modal .close:last').trigger('click');
});

module.exports = Events;