var Marionette = require('marionette'),
	Candidatos = require('collections/candidatos'),
	Gridder = require('gridder'),
	Paginator = require('paginator').paginator;

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/lista.tpl',

	initialize: function() {
		this.collection = new Candidatos(null, {idLista: this.model.get('id')});
	},

	onShow: function() {
		this.setGridder();
		this.setPaginator();
	},

	setGridder: function() {
		new Gridder({
			element: this.$('#gridderCandidatosLista'),
			collection: this.collection,
			cols: {
				'nome'                  : 'NOME',
				'cpf'                   : 'CPF',
				'quantidadeCriterios'   : 'CRITÉRIOS ATENDIDOS',
				'sequenciaContemplacao' : 'SEQUÊNCIA'
			},
			cssClasses: ['table-condensed table-hover table-fixed table-candidatos-lista']
		}).changeValues({
			'false' : '<strong class="text-danger">NÃO</strong>',
			'true'  : '<strong class="text-success">SIM</strong>'
		}).getRows(function(row, model) {
			if(model.get('dataContemplacao')) {
				$(row).addClass('success text-success');
			}
		});
	},

	setPaginator: function() {
		var paginator = new Paginator({
			el: this.$('#paginatorCandidatosLista'),
			collection: this.collection
		});
	}
});