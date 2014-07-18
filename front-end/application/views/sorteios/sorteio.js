var Marionette = require('marionette'),
	SorteioView = require('views/sorteios/inserir_atualizar'),
	CandidatosView = require('views/sorteios/candidatos'),
	ListasView = require('views/sorteios/listas');

module.exports = Marionette.LayoutView.extend({
	template: 'sorteios/sorteio.tpl',

	events: {
		'submit form'       : function(ev) { this.detalhes.currentView.salvar(ev); },
		'click .nav-tabs a' : 'setActiveForm'
	},

	regions: {
		detalhes : '.modal-body'
	},

	initialize: function(options) {
		var that = this;

		if(this.model.get('id')) {
			this.addRegion('detalhes', '#detalhes');
			this.addRegion('candidatos', '#candidatos');
			this.addRegion('listas', '#listas');
		}
	},

	onRender: function() {
		this.setViews();
	},

	setViews: function() {
		this.detalhes.show(new SorteioView({model: this.model}));

		if(this.model.get('id')) {
			this.listas.show(new ListasView({model: this.model}));
			this.candidatos.show(new CandidatosView({model: this.model, parentView: this}));
		}
	},

	setActiveForm: function(ev) {
		var tab = this.$(ev.currentTarget).attr('href');

		if(tab === '#detalhes') {
			this.$('.modal-footer').html('<button type="submit" class="btn btn-sm btn-success">Salvar</button>');
		} else {
			this.$('.modal-footer').empty();
		}
	}
});