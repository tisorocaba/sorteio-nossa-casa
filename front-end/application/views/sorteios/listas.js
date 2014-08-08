var Marionette = require('marionette'),
	Handlebars = require('handlebars.runtime')['default'],
	_ = require('underscore'),
	Listas = require('collections/listas'),
	ListaView = require('views/sorteios/lista'),
	ProgressBarView = require('views/sorteios/progressBar'),
	Events = require('events'),
	Multimodal = require('multimodal'),
	Config = require('config');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/listas.tpl',

	events: {
		'click .btn-sortear-proxima-lista' : 'sortearProximaLista',
		'click .btn-alterar-quantidade'    : 'alterarQuantidadeCasas',
		'click .table-listas .clickable'   : 'showLista',
		'keyup .txt-semente'               : 'storeSementes'
	},

	initialize: function() {
		var that = this;

		this.collection = new Listas(null, {idSorteio: this.model.get('id')});

		Events.on('reload_collection_listas', function() {
			that.collection = new Listas(null, {idSorteio: that.model.get('id')});
			that.render();
		});
	},

	onRender: function() {
		this.setGridder();
		this.toggleBtnSorteio();
		this.toggleAlteracaoQuantidadeCasas();
		this.setSementeFields();
	},

	setGridder: function() {
		var partial = Handlebars.partials['sorteios/_gridderListas.tpl']({listas: this.collection.toJSON()});
		this.$('#gridderListas').html( partial );
	},

	toggleBtnSorteio: function() {
		if(this.collection.where({sorteada: false}).length > 0) {
			this.$('.btn-sortear-proxima-lista').attr('disabled', false);
		} else {
			this.$('.btn-sortear-proxima-lista').attr('disabled', true);
		}
	},

	toggleAlteracaoQuantidadeCasas: function() {
		var that = this;

		if(this.collection.length === 0 || this.collection.where({sorteada: true}).length > 0) {
			setTimeout(function() {
				that.$('.btn-alterar-quantidade').attr('disabled', true);
				that.$('.txt-quantidade').attr('disabled', true);
			}, 500);
		} else {
			setTimeout(function() {
				that.$('.btn-alterar-quantidade').attr('disabled', false);
			}, 500);
		}
	},

	alterarQuantidadeCasas: function(ev) {
		ev.preventDefault();

		var arrQuantidades = [],
			that = this;

		this.$('.txt-quantidade').each(function(key, field) {
			arrQuantidades.push({
				id: $(field).data('id'),
				quantidade: parseInt($(field).val(), 10)
			});
		});

		Multimodal.confirm('Alterar a quantidade de casas?', function(resposta) {
			if(resposta) {
				$.ajax({
					url: Config.BASE_URL + '/api/sorteio/' + that.model.get('id') + '/lista/alterarQuantidades',
					method: 'POST',
					contentType: 'application/json',
					async: false,
					cache: false,
					data: JSON.stringify(arrQuantidades),
					success: function(res) {
						if(res.status) {
							Multimodal.notify('Quantidade de casas alterada com sucesso!', {type: 'success'});
						} else {
							Multimodal.notify(res.message, {type: 'danger'});
						}
					}
				});
			}
		});
	},

	sortearProximaLista: function(ev) {
		ev.preventDefault();

		var proximaLista = _.first( this.collection.where({sorteada: false}) ),
			semente = this.$('.txt-semente[data-id=' + proximaLista.get('id') + ']').val(),
			msg = '',
			that = this;

		if(semente) {
			msg = 'Sortear lista <strong class="text-danger">' + proximaLista.get('nome') + '</strong> utilizando a semente <strong class="text-danger">' + semente + '</strong> ?';
		} else {
			msg = 'Sortear lista <strong class="text-danger">' + proximaLista.get('nome') +  '?';
		}

		Multimodal.confirm(msg, function(resposta) {
			if(resposta) {
				$.ajax({
					url: Config.BASE_URL + '/api/sorteio/' + that.model.get('id') + '/sortearProximaLista?semente=' + semente,
					method: 'POST',
					cache: false,
					beforeSend: function(xhr) {
						window.onbeforeunload = function (event) {
							return 'Fechar a janela irá cancelar o sorteio.';
						};
						that.showProgressBar('Sorteio em andamento! Por favor aguarde.');
					},
					xhrFields: {
						onprogress: function(ev) {
							that.progressView.update(ev.loaded);
						}
					}
				}).done(function() {
					that.progressView.destroy();
					Multimodal.notify('Sorteio realizado com sucesso!', {type: 'success'});
					Events.trigger('reload_collection_listas');
					Events.trigger('reload_collection_sorteios');
					Events.trigger('hide_upload_controls');
					that.showListaSorteada(proximaLista);
					window.onbeforeunload = null;
				}).error(function(err) {
					Multimodal.notify('Ocorreu um erro na execução do sorteio!', {type: 'danger'});
				});
			}
		});
	},

	showProgressBar: function(message) {
		this.progressView = new ProgressBarView({message: message});

		Multimodal.show(this.progressView, 'modalProgress');
	},

	showListaSorteada: function(lista) {
		this.$('.table-listas').find('tr#' + lista.get('id')).find('td:first').trigger('click');
	},

	showLista: function(ev) {
		this.collection = new Listas(null, {idSorteio: this.model.get('id')});

		var lista = this.collection.get(this.$(ev.currentTarget).parents('tr').attr('id'));

		Multimodal.show(new ListaView({model: lista}), 'modalLista');
	},

	storeSementes: function(ev) {
		var field = this.$(ev.currentTarget);
		sessionStorage.setItem('txt-semente-' + field.data('id'), field.val());
	},

	setSementeFields: function(ev) {
		var that = this;
		this.$('.txt-semente').each(function(key, field) {
			var semente = sessionStorage.getItem('txt-semente-' + that.$(field).data('id'));
			that.$(field).val(semente);
		});
	}
});