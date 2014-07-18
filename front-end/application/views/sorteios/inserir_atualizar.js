var BaseView = require('views/base_view'),
	Backbone = require('backbone'),
	Events = require('events'),
	Multimodal = require('multimodal'),
	Moment = require('moment');

module.exports = BaseView.extend({
	template: 'sorteios/inserir_atualizar.tpl',

	populateModel: function() {
		var data = Moment(this.$('#data').val()).isValid() ? Moment(this.$('#data').val()).format('DD/MM/YYYY') : '';
		this.model.set('data', data);
		this.model.set('observacao', this.$('#observacao').val());
	},

	salvar: function(ev) {
		ev.preventDefault();
		var confirmMessage = 'Confirma o cadastro do Sorteio?',
			successMessage = 'Sorteio cadastrado com sucesso!',
			that = this;

		if(this.model.get('id')) {
			confirmMessage = 'Confirma a atualização dos dados do Sorteio?'
			successMessage = 'Dados do Sorteio atualizados com sucesso!';
		}

		this.populateModel();

		if(this.model.isValid()) {
			Multimodal.confirmInline(confirmMessage, function(resposta) {
				if(resposta) {
					that.populateModel();
					that.model.save().success(function(res) {
						if(res.status) {
							Multimodal.notify(successMessage, {type: 'success'});

							Events.trigger('reload_collection_sorteios');

							if(res.data && res.data.id) {
								Events.trigger('close_modal');
								Backbone.history.navigate('sorteios/' + res.data.id, true);
							}
						} else {
							Multimodal.notify(res.message, {type: 'danger'});
						}
					});
				}
			});
		}
	}
});