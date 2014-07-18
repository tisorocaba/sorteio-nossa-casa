var Marionette = require('marionette'),
	Backbone = require('backbone'),
	Sorteios = require('collections/sorteios'),
	Gridder = require('gridder'),
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
			that.setGridder();
		});
	},

	onShow: function() {
		this.setGridder();
	},

	setGridder: function() {
		var that = this;

		new Gridder({
			element: this.$('#gridderSorteios'),
			collection: this.collection,
			cols: {
				'data'       : 'DATA DO SORTEIO',
				'observacao' : 'OBSERVAÇÃO',
				'finalizado' : 'FINALIZADO?'
			},
			cssClasses: ['table-condensed table-hover table-fixed table-sorteios']
		}).changeValues({
			'false' : '<strong class="text-danger">NÃO</strong>',
			'true'  : '<strong class="text-success">SIM</strong>'
		}).getCols(function(col, model) {
			that.$(col).addClass('clickable');
		}).addCols([{
			'content': '<button type="button" class="btn btn-xs btn-danger btn-excluir-sorteio">Excluir</button>'
		}]);
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