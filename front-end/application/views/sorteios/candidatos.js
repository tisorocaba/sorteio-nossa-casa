var Marionette = require('marionette'),
	Handlebars = require('handlebars.runtime')['default'],
	Candidatos = require('collections/candidatos'),
	ProgressBarView = require('views/sorteios/progressBar'),
	Paginator = require('paginator').paginator,
	Multimodal = require('multimodal'),
	Config = require('config'),
	Events = require('events'),
	Searcher = require('searcher');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/candidatos.tpl',

	events: {
		'change #arquivo'           : function(ev) { this.$('.btn-enviar-arquivo').attr('disabled', false); },
		'click .btn-enviar-arquivo' : 'enviarArquivo'
	},

	initialize: function(options) {
		this.parentView = options.parentView;

		var that = this;

		this.collection = new Candidatos(null, {idSorteio: this.model.get('id')});

		Events.on('hide_upload_controls', function() {
			that.$('.upload-controls').addClass('hide');
		});

		Events.on('reload_collection_candidatos', function() {
			that.collection = new Candidatos(null, {idSorteio: that.model.get('id')});
			that.render();
		});
	},

	onRender: function() {
		this.listenTo(this.collection, 'request', this.setGridder);
		this.setGridder();
		this.setPaginator();
		this.setSearcher();

		if(this.parentView.listas.currentView.collection.where({sorteada: true}).length > 0) {
			Events.trigger('hide_upload_controls');
		}
	},

	setGridder: function() {
		var partial = Handlebars.partials['sorteios/_gridderCandidatos.tpl']({candidatos: this.collection.toJSON()});
		this.$('#gridderCandidatos').html( partial );
	},

	setPaginator: function() {
		if(this.collection.length > 0) {
			var paginator = new Paginator({
				el: this.$('#paginatorCandidatos'),
				collection: this.collection
			});
		} else {
			this.$('#paginatorCandidatos').parents('.row').addClass('hide');
		}
	},

	setSearcher: function() {
		if(this.collection.length > 0) {
			return new Searcher({
				el: this.$('#searcherCandidatos'),
				collection: this.collection,
				searchAttrs: [
					'nome:NOME',
					'cpf:CPF'
				],
				live: true
			});
		}
	},

	enviarArquivo: function(ev) {
		ev.preventDefault();
		var arquivo = this.$('#arquivo')[0].files[0],
			formData = new FormData(),
			that = this;

		formData.append('arquivo', arquivo);

		Multimodal.confirm('Confirma o envio do arquivo?', function(resposta) {
			if(resposta) {
				$.ajax({
					url: Config.BASE_URL + '/api/sorteio/' + that.model.get('id') + '/importarCandidatos',
					method: 'POST',
					data: formData,
					cache: false,
					processData: false,
					contentType: false,
					beforeSend: function(xhr) {
						window.onbeforeunload = function (event) {
							return 'Fechar a janela irá cancelar a importação.';
						};
						that.showProgressBar('Importação em andamento! Por favor aguarde.');
					},
					xhrFields: {
						onprogress: function(ev) {
							that.progressView.update(ev.loaded);
						}
					}
				}).done(function() {
					that.progressView.destroy();

					Multimodal.notify('Importação realizada com sucesso!', {type: 'success'});
					Events.trigger('reload_collection_listas');
					Events.trigger('reload_collection_candidatos');
					window.onbeforeunload = null;
				}).error(function(err) {
					Multimodal.notify('Ocorreu um erro na importação dos candidatos!', {type: 'danger'});
				});
			}
		});
	},

	showProgressBar: function(message) {
		this.progressView = new ProgressBarView({message: message});

		Multimodal.show(this.progressView, 'modalProgressCandidatos');
	}
});