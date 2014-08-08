var Marionette = require('marionette'),
	Handlebars = require('handlebars.runtime')['default'],
	Candidatos = require('collections/candidatos'),
	Paginator = require('paginator').paginator,
	Multimodal = require('multimodal'),
	Config = require('config');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/lista.tpl',

	events: {
		'click .btn-publicar-lista' : 'publicarLista'
	},

	initialize: function() {
		this.collection = new Candidatos(null, {idLista: this.model.get('id')});
	},

	onRender: function() {
		this.listenTo(this.collection, 'request', this.setGridder);
		this.setGridder();
		this.setPaginator();
	},

	setGridder: function() {
		var partial = Handlebars.partials['sorteios/_gridderCandidatosLista.tpl']({candidatos: this.collection.toJSON()});
		this.$('#gridderCandidatosLista').html( partial );
	},

	setPaginator: function() {
		var paginator = new Paginator({
			el: this.$('#paginatorCandidatosLista'),
			collection: this.collection
		});
	},

	publicarLista: function(ev) {
		ev.preventDefault();
		var that = this;

		$.ajax({
			url: Config.BASE_URL + '/api/publicacao/lista/' + that.model.get('id') + '/publicar',
			method: 'POST',
			cache: false
		}).done(function(res) {
			console.log(res);
			if(res.status) {
				Multimodal.notify('Publicação da lista realizada com sucesso!', {type: 'success'});
			} else {
				Multimodal.notify('Ocorreu um erro na publicação da lista!', {type: 'danger'});
			}
		}).error(function(err) {
			console.log(err);
			Multimodal.notify('Ocorreu um erro na publicação da lista!', {type: 'danger'});
		});
	}
});