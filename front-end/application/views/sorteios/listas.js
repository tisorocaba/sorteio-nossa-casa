var Marionette = require('marionette'),
	_ = require('underscore'),
	Listas = require('collections/listas'),
	ListaView = require('views/sorteios/lista'),
	Events = require('events'),
	Gridder = require('gridder'),
	Multimodal = require('multimodal'),
	Config = require('config');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/listas.tpl',

	events: {
		'click .btn-sortear-proxima-lista' : 'sortearProximaLista',
		'click .btn-alterar-quantidade'    : 'alterarQuantidadeCasas',
		'click .table-listas .clickable'   : 'showLista',
	},

	initialize: function() {
		var that = this;

		this.collection = new Listas(null, {idSorteio: this.model.get('id')});

		Events.on('reload_collection_listas', function() {
			that.collection = new Listas(null, {idSorteio: that.model.get('id')});
			that.setGridder();
			that.toggleAlteracaoQuantidadeCasas();
			that.toggleBtnSorteio();
		});
	},

	onShow: function() {
		this.setGridder();
		this.toggleBtnSorteio();
		this.toggleAlteracaoQuantidadeCasas();
	},

	setGridder: function() {
		new Gridder({
			element: this.$('#gridderListas'),
			collection: this.collection,
			cols: {
				'nome'         : 'NOME',
				'quantidade'   : 'TITULARES / RESERVA',
				'ordemSorteio' : 'ORDEM DE SORTEIO',
				'sorteada'     : 'SORTEADA?'
			},
			cssClasses: ['table-condensed table-hover table-fixed table-listas']
		}).changeValues({
			'false' : '<strong class="text-danger">NÃO</strong>',
			'true'  : '<strong class="text-success">SIM</strong>'
		}).getCols(function(col, model) {
			if($(col).hasClass('col-quantidade')) {
				var field = '<input type="text" class="form-control input-xs txt-quantidade" data-id="{{id}}" value="{{quantidade}}">';
				field = field.replace('{{id}}', model.get('id')).replace('{{quantidade}}', model.get('quantidade'));
				$(col).html(field);
			} else {
				if(model) {
					$(col).addClass('clickable');
				}
			}
		}).getRows(function(row, model) {
			try {
				if(model.get('sorteada')) {
					$(row).addClass('success text-success').find('td:last').html('<strong class="text-success">SIM</strong>');
				}
			} catch(err) {}
		});
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
			msg = 'Sortear lista <strong class="text-danger">' + proximaLista.get('nome') + '</strong>?',
			that = this;

		Multimodal.confirm(msg, function(resposta) {
			if(resposta) {
				$.ajax({
					url: Config.BASE_URL + '/api/sorteio/' + that.model.get('id') + '/sortearProximaLista',
					method: 'POST',
					cache: false,
					beforeSend: function(xhr) {
						window.onbeforeunload = function (event) {
							return 'Fechar a janela irá cancelar o sorteio.';
						}
						that.showProgressBar();
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
					that.toggleBtnSorteio();
					that.showListaSorteada(proximaLista);
					window.onbeforeunload = null;
				}).error(function(err) {
					Multimodal.notify('Ocorreu um erro na execução do sorteio!', {type: 'danger'});
				});
			}
		});
	},

	showProgressBar: function() {
		var ProgressView = Marionette.ItemView.extend({
			template: 'sorteios/progress_bar.tpl',

			initialize: function() {
				this.oldModalEscape = $.fn.modal.Constructor.prototype.escape;
				$.fn.modal.Constructor.prototype.escape = function () {};
			},
			onDestroy: function() {
				$.fn.modal.Constructor.prototype.escape = this.oldModalEscape;
			},
			update: function(value) {
				this.$('.progress-bar').css('width', value + '%').html(value + '%');
			}
		});

		this.progressView = new ProgressView();

		Multimodal.show(this.progressView, 'modalProgress');
	},

	showListaSorteada: function(lista) {
		this.$('.table-listas').find('tr#' + lista.get('id')).find('td:first').trigger('click');
	},

	showLista: function(ev) {
		var listas = new Listas(null, {idSorteio: this.model.get('id')}),
			lista = listas.get(this.$(ev.currentTarget).parents('tr').attr('id'));
		Multimodal.show(new ListaView({model: lista}), 'modalLista');
	}
});