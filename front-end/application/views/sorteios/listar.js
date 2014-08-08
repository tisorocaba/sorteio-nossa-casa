var Marionette = require('marionette'),
	Handlebars = require('handlebars.runtime')['default'],
	Backbone = require('backbone'),
	Sorteios = require('collections/sorteios'),
	Multimodal = require('multimodal'),
	Events = require('events');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/listar.tpl',

	events: {
		'click .table-sorteios .clickable' : 'showSorteio',
		'click .btn-excluir-sorteio'       : 'excluirSorteio'
	},

	initialize: function() {
		var that = this;

		this.collection = new Sorteios();

		Events.on('reload_collection_sorteios', function() {
			that.collection = new Sorteios();
			that.render();
		});
	},

	onRender: function() {
		this.setGridder();
	},

	setGridder: function() {
		var partial = Handlebars.partials['sorteios/_gridderSorteios.tpl']({sorteios: this.collection.toJSON()});
		this.$('#gridderSorteios').html( partial );
	},

	showSorteio: function(ev) {
		var idSorteio = this.$(ev.currentTarget).parents('tr').attr('id');
		Backbone.history.navigate('sorteios/' + idSorteio, true);
	},

	excluirSorteio: function(ev) {
		ev.preventDefault();

		var idSorteio = this.$(ev.currentTarget).parents('tr').attr('id'),
			sorteio = this.collection.get(idSorteio),
			msg = 'Excluir Sorteio do dia <strong class="text-danger">' + sorteio.get('data') + '</strong>?';

		Multimodal.confirm(msg, function(resposta) {
			if(resposta) {
				sorteio.destroy().success(function(res) {
					if(res.status) {
						Multimodal.notify('Sorteio excluído com sucesso', {type: 'success'});
					} else {
						Multimodal.notify(res.message, {type: 'danger'});
					}
					Events.trigger('reload_collection_sorteios');
				});
			}
		});
	}
});