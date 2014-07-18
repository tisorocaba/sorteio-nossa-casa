var Marionette = require('marionette'),
	Candidatos = require('collections/candidatos'),
	Gridder = require('gridder'),
	Paginator = require('paginator').paginator,
	Multimodal = require('multimodal'),
	Config = require('config'),
	Events = require('events');

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
	},

	onShow: function() {
		this.setGridder();
		this.setPaginator();

		if(this.parentView.listas.currentView.collection.where({sorteada: true}).length > 0) {
			Events.trigger('hide_upload_controls');
		}
	},

	setGridder: function() {
		new Gridder({
			element: this.$('#gridderCandidatos'),
			collection: this.collection,
			cols: {
				'nome'                : 'NOME',
				'cpf'                 : 'CPF',
				'quantidadeCriterios' : 'CRITÉRIOS ATENDIDOS',
				'contemplado'         : 'CONTEMPLADO'
			},
			cssClasses: ['table-condensed table-hover table-fixed table-candidatos']
		}).changeValues({
			'false' : '<strong class="text-danger">NÃO</strong>',
			'true'  : '<strong class="text-success">SIM</strong>'
		});
	},

	setPaginator: function() {
		var paginator = new Paginator({
			el: this.$('#paginatorCandidatos'),
			collection: this.collection
		});
	},

	enviarArquivo: function(ev) {
		ev.preventDefault();
		var arquivo = this.$('#arquivo')[0].files[0],
			formData = new FormData(),
			that = this;

		formData.append('arquivo', arquivo);

		Multimodal.confirm('Confirma o envio do arquivo?', function(resposta) {
			if(resposta) {
				that.$('.btn-enviar-arquivo').html('Enviando...');
				$.ajax({
					url: Config.BASE_URL + '/api/sorteio/' + that.model.get('id') + '/importarCandidatos',
					type: 'POST',
					data: formData,
					async: false,
					cache: false,
					dataType: 'json',
					processData: false,
					contentType: false,
					success: function(res) {
						if(res.status) {
							Multimodal.notify('Importação realizada com sucesso!', {type: 'success'});
							that.collection.callFetch();
							Events.trigger('reload_collection_listas');
						} else {
							Multimodal.notify(res.message, {type: 'danger'});
						}
						that.$('#arquivo').val('');
						that.$('.btn-enviar-arquivo').html('Enviar Arquivo').attr('disabled', true);
					}
				});
			}
		});
	}
});