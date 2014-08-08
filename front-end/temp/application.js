require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"application":[function(require,module,exports){
module.exports=require('OW8hE8');
},{}],"OW8hE8":[function(require,module,exports){
var Marionette = require('marionette'),
	Handlebars = require('handlebars.runtime')['default'],
	Templates = require('templates')(Handlebars),
	Config = require('config'),
	Handlebars_Helpers = require('handlebars_helpers'),
	Application = new Marionette.Application();

Marionette.Renderer.render = function(template, data) {
	if(typeof template === 'function') {
		return template(data);
	} else {
		return Templates[template](data);
	}
};

Application.addRegions(Config.regions);

// Código a ser executado na inicialização da aplicação.
Application.addInitializer(function() {});

module.exports = Application;
},{"config":"4itQ50","handlebars_helpers":"RFtg35"}],"f1Ggxr":[function(require,module,exports){
var PagedCollection = require('paginator').pagedCollection,
	Config = require('config');

module.exports = PagedCollection.extend({

	initialize: function(models, options) {
		if(options.idSorteio) {
			this.url = Config.BASE_URL + '/api/sorteio/' + options.idSorteio + '/candidato';
		}

		if(options.idLista) {
			this.url = Config.BASE_URL + '/api/sorteio/lista/' + options.idLista + '/candidato';
		}

		PagedCollection.prototype.initialize.call(this);
	}
});
},{"config":"4itQ50"}],"collections/candidatos":[function(require,module,exports){
module.exports=require('f1Ggxr');
},{}],"hZhJtk":[function(require,module,exports){
var Backbone = require('backbone'),
	Config= require('config');

module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {
		this.url = Config.BASE_URL + '/api/sorteio/' + options.idSorteio + '/lista';
		this.fetch({async: false});
	},

	parse: function(res) {
		return res.data;
	}
});
},{"config":"4itQ50"}],"collections/listas":[function(require,module,exports){
module.exports=require('hZhJtk');
},{}],"collections/sorteios":[function(require,module,exports){
module.exports=require('mArXvI');
},{}],"mArXvI":[function(require,module,exports){
var Backbone = require('backbone'),
	Sorteio = require('models/sorteio'),
	Config= require('config');

module.exports = Backbone.Collection.extend({
	model: Sorteio,
	url: Config.BASE_URL + '/api/sorteio',

	initialize: function() {
		this.fetch({async: false});
	},

	comparator: function(modelA, modelB) {
		var dataA = modelA.get('data').split('/');
		var dataB = modelB.get('data').split('/');

		dataA = new Date(dataA[2], dataA[1] - 1, dataA[0]);
		dataB = new Date(dataB[2], dataB[1] - 1, dataB[0]);

		return dataA > dataB ? -1 : dataA < dataB ? 1 : 0;
	},

	parse: function(res) {
		return res.data;
	}
});
},{"config":"4itQ50","models/sorteio":"FshOTq"}],"controllers/application":[function(require,module,exports){
module.exports=require('ougQw1');
},{}],"ougQw1":[function(require,module,exports){
var AuthController = require('controllers/auth');

module.exports = AuthController.extend({

	pagina404: function() {
		// view menu renderizada explicitamente pois rotas 404 não executam filtros!
		this.renderView('menu', 'menu');
		this.renderView('main', 'pagina404');
	}
});
},{"controllers/auth":"T5JvWl"}],"T5JvWl":[function(require,module,exports){
var	Backbone = require('backbone'),
	BaseController = require('base_controller'),
	Application = require('application'),
	Utils = require('utils'),
	Auth = require('auth'),
	Multimodal = require('multimodal');

module.exports = BaseController.extend({

	before: function(method, route) {
		this.renderView('menu', 'menu');

		if(method !== 'login') {
			var that = this;
			Auth.isLogged().success(function(res) {
				if(!res.status) {
					Backbone.history.navigate('login', true);
					that.abort();
				}
			});
		}
	},

	login: function() {
		var loginView = new Auth.loginView({
			callbackdoLoginOK: function(res) {
				if(res.status) {
					Utils.goToLastRoute();
					location.reload(true);
				}
			}
		});

		Auth.isLogged().success(function(res) {
			if(!res.status) {
				Application.main.show(loginView);
			} else {
				Utils.goToLastRoute();
			}
		});
	},

	logout: function() {
		Multimodal.confirm('Deseja realmente sair do sistema?', function(resposta) {
			if(resposta) {
				Auth.logout().success(function() {
					Backbone.history.navigate('login', true);
				});
			} else {
				Utils.goToLastRoute();
			}
		});
	}
});
},{"application":"OW8hE8","base_controller":"YoNwvn","utils":"b10pPU"}],"controllers/auth":[function(require,module,exports){
module.exports=require('T5JvWl');
},{}],"controllers/sorteios":[function(require,module,exports){
module.exports=require('ORrPWY');
},{}],"ORrPWY":[function(require,module,exports){
var AuthController = require('controllers/auth'),
	Multimodal = require('multimodal'),
	Utils = require('utils');

module.exports = AuthController.extend({

	listar: function() {
		this.renderView('main', 'sorteios/listar');
	},

	inserir: function() {
		var sorteio = new (require('models/sorteio'));

		Multimodal.show(new (require('views/sorteios/sorteio'))({model: sorteio}), 'modalSorteio');
		Utils.goToLastRoute();
	},

	detalhar: function(id) {
		var sorteio = new (require('models/sorteio'))({id: id});

		sorteio.fetch().success(function(res) {
			Multimodal.show(new (require('views/sorteios/sorteio'))({model: sorteio}), 'modalSorteio', function() {
				location.reload();
			});
			Utils.goToLastRoute();
		});
	},

	callAction: function(param) {
		if(isNaN(parseInt(param, 10))) {
			if(param === 'inserir') {
				this.inserir();
			} else {
				require('controllers/application').pagina404();
			}
		} else {
			this.detalhar(param);
		}
	}
});
},{"controllers/application":"ougQw1","controllers/auth":"T5JvWl","models/sorteio":"FshOTq","utils":"b10pPU","views/sorteios/sorteio":"tmBJFK"}],"events":[function(require,module,exports){
module.exports=require('I+2i5t');
},{}],"I+2i5t":[function(require,module,exports){
var Backbone = require('backbone'),
	Events = Backbone.Events;

Events.on('reset_form', function(form) {
	$(form)[0].reset();
	$(form).find('.form-control:first').focus();
});

Events.on('close_modal', function() {
	$('.modal .close:last').trigger('click');
});

module.exports = Events;
},{}],"RFtg35":[function(require,module,exports){
var Handlebars = require('handlebars.runtime')['default'],
	Auth = require('auth'),
	Config = require('config'),
	Moment = require('moment');

Handlebars.registerHelper('CONFIG', function(attr) {
	if (attr === 'ENV') {
		return new Handlebars.SafeString('<span style="color:tomato;">' + Config[attr] + '</span>');
	} else {
		return Config[attr];
	}
});

Handlebars.registerHelper('isLogged', function(options) {
	var context = this;

	function isLogged() {
		var isLogged;

		Auth.isLogged().success(function(res) {
			isLogged = res.status ? options.fn(context) : options.inverse(context);
		});

		return isLogged;
	}
	return isLogged();
});

Handlebars.registerHelper('formatDate', function(data) {
	return Moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
});

Handlebars.registerHelper('VALIDATION_MESSAGES', function() {
	var template = [
		'<div class="row">',
		'	<div class="col-md-12">',
		'		<div class="alert alert-danger hide">',
		'			<ul class="validation-messages-list" style="list-style-type:none; padding-left:0;"></ul>',
		'		</div>',
		'	</div>',
		'</div>'
	].join('');

	return new Handlebars.SafeString(template);
});
},{"config":"4itQ50"}],"handlebars_helpers":[function(require,module,exports){
module.exports=require('RFtg35');
},{}],"initializer":[function(require,module,exports){
module.exports=require('OZTZYA');
},{}],"OZTZYA":[function(require,module,exports){
var Backbone = require('backbone'),
	_ = require('underscore'),
	Auth = require('auth'),
	Multimodal = require('multimodal'),
	Config = require('config');

// Exporta o jquery globalmente para compatibilidade com plugins.
jQuery = $ = require('jquery');

// Injeta o jquery.
Backbone.$ = $;

// Registra o eventos previamente cadastrados
require('events');

// Código a ser executado antes da inicialização da aplicação.
module.exports = function() {
	// Auth
	Auth.init({
		appSigla      : 'SORTEIO',
		appDescricao  : 'Aplicativo para sorteio de residências do programa Nossa Casa',
		loginUrl      : Config.BASE_URL + '/api/usuario/login',
		logoutUrl     : Config.BASE_URL + '/api/usuario/logout',
		loggedUserUrl : Config.BASE_URL + '/api/usuario'
	});

	// Multimodal
	Multimodal.initialize(require('application'), {
		alert: {
			title: '<span class="text-info">Mensagem</span>',
			btnOk: {
				label: 'OK',
				className: 'btn-primary btn-sm'
			}
		},
		confirm: {
			title: '<span class="text-info">Confirmação</span>',
			btnOk: {
				label: 'Sim',
				className: 'btn-success btn-sm'
			},
			btnCancel: {
				label: 'Não',
				className: 'btn-danger btn-sm'
			}
		},
		confirmInline: {
			message: 'Confirma?',
			btnOk: {
				label: 'Sim',
				className: 'btn-success btn-sm'
			},
			btnCancel: {
				label: 'Não',
				className: 'btn-danger btn-sm'
			}
		},
		notify: {
			width: 420,
			delay: 3000,
			allow_dismiss: true
		}
	});

	// Backbone Model Invalid
	Backbone.Model.prototype.on('invalid change', _.debounce(function(model, errors, options) {
		try {
			var $list = $('.validation-messages-list:last'),
				validationErrors = _.isArray(errors) ? errors : model.validationError,
				items = [];

			$('.form-group').removeClass('has-error');

			_.each(validationErrors, function(err) {
				items.push('<li><i class="glyphicon glyphicon-exclamation-sign"></i>&nbsp;&nbsp;' + err.message + '</li>');
				$(err.element).parents('.form-group').addClass('has-error');
			});

			$list.html(items);

			// $('.form-group.has-error > .form-control:first').focus();

			if(items.length > 0) {
				$list.parents('.alert').removeClass('hide');
			} else {
				$list.parents('.alert').addClass('hide');
			}
		} catch(err) {}
	}, 100));
};
},{"application":"OW8hE8","config":"4itQ50","events":"I+2i5t"}],"FshOTq":[function(require,module,exports){
var Backbone = require('backbone'),
	Config = require('config');

module.exports = Backbone.Model.extend({
	urlRoot: Config.BASE_URL + '/api/sorteio',

	defaults: {
		'data': ''
	},

	validate: function(attrs) {
		var errors = [];
		if(attrs.data === '') {
			errors.push({
				element: '#data',
				message: 'Data precisa ser informada'
			});
		}

		return errors.length > 0 ? errors : null;
	},

	parse: function(res) {
		if(res.status) {
			return res.data;
		} else {
			return res;
		}
	}
});
},{"config":"4itQ50"}],"models/sorteio":[function(require,module,exports){
module.exports=require('FshOTq');
},{}],"b10pPU":[function(require,module,exports){
var $ = require('jquery'),
	Backbone = require('backbone'),
	Auth = require('auth');

exports.activeMenuItensOnHover = function() {
	$('.navbar-nav > li').on('mouseover', function() {
		$(this).addClass('open').closest('.dropdown-menu').css('display', 'block');
	}).on('mouseout', function() {
		$(this).removeClass('open').closest('.dropdown-menu').css('display', 'none');
	});
};

exports.goToLastRoute = function() {
	Backbone.history.navigate(window.lastRoute);
};

exports.setLoggedUserEl = function(nome) {
	var element = [
		'<div class="pull-right">',
		'	<p class="navbar-text">loggedUser</p>',
		'	<button type="button" class="btn btn-xs btn-warning login-block-logout" style="margin-top:14px; margin-right:10px;">Sair</button>',
		'</div>'
	].join('').replace('loggedUser', nome);

	$('.logged-user-el').html(element);

	$('.login-block-logout').on('click', function(ev) {
		Backbone.history.navigate('logout', {trigger: true});
	});
};

},{}],"utils":[function(require,module,exports){
module.exports=require('b10pPU');
},{}],"views/base_view":[function(require,module,exports){
module.exports=require('PjPsJS');
},{}],"PjPsJS":[function(require,module,exports){
var Marionette = require('marionette');

module.exports = Marionette.ItemView.extend({

	events: {
		'submit form'    : 'salvar',
		'focusout input' : 'validate',
		'change select'  : 'validate'
	},

	onShow: function() {
		var that = this;

		setTimeout(function() {
			that.$('input:first').focus();
		});
	},

	validate: function() {
		this.called = this.called || false;

		if(this.model.validationError || this.called) {
			this.populateModel();
			this.model.isValid();
			this.called = true;
		}
	}
});
},{}],"hql2jn":[function(require,module,exports){
var Marionette = require('marionette'),
	Auth =  require('auth'),
	Utils = require('utils');

module.exports = Marionette.ItemView.extend({
	template: 'menu.tpl',

	onShow: function() {
		Auth.isLogged().success(function(res) {
			if(res.status) {
				Utils.setLoggedUserEl(res.data.nome);
			}
		});

		setTimeout(function() {
			Utils.activeMenuItensOnHover();
		}, 100);
	}
});
},{"utils":"b10pPU"}],"views/menu":[function(require,module,exports){
module.exports=require('hql2jn');
},{}],"views/pagina404":[function(require,module,exports){
module.exports=require('FxEZ/i');
},{}],"FxEZ/i":[function(require,module,exports){
var Marionette = require('marionette');

module.exports = Marionette.ItemView.extend({
	template: 'pagina404.tpl'
});
},{}],"Qq4B5r":[function(require,module,exports){
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
},{"collections/candidatos":"f1Ggxr","config":"4itQ50","events":"I+2i5t","views/sorteios/progressBar":"4NP08L"}],"views/sorteios/candidatos":[function(require,module,exports){
module.exports=require('Qq4B5r');
},{}],"views/sorteios/inserir_atualizar":[function(require,module,exports){
module.exports=require('YM0yLE');
},{}],"YM0yLE":[function(require,module,exports){
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
},{"events":"I+2i5t","views/base_view":"PjPsJS"}],"83B+V2":[function(require,module,exports){
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
},{"collections/candidatos":"f1Ggxr","config":"4itQ50"}],"views/sorteios/lista":[function(require,module,exports){
module.exports=require('83B+V2');
},{}],"views/sorteios/listar":[function(require,module,exports){
module.exports=require('ccojVN');
},{}],"ccojVN":[function(require,module,exports){
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
},{"collections/sorteios":"mArXvI","events":"I+2i5t"}],"ZSFvA1":[function(require,module,exports){
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
},{"collections/listas":"hZhJtk","config":"4itQ50","events":"I+2i5t","views/sorteios/lista":"83B+V2","views/sorteios/progressBar":"4NP08L"}],"views/sorteios/listas":[function(require,module,exports){
module.exports=require('ZSFvA1');
},{}],"views/sorteios/progressBar":[function(require,module,exports){
module.exports=require('4NP08L');
},{}],"4NP08L":[function(require,module,exports){
var Marionette = require('marionette');

module.exports = Marionette.ItemView.extend({
	template: 'sorteios/progress_bar.tpl',

	initialize: function(options) {
		this.message = options.message;
		this.oldModalEscape = $.fn.modal.Constructor.prototype.escape;
		$.fn.modal.Constructor.prototype.escape = function () {};
	},
	onRender: function() {
		this.$('#message').html(this.message);
	},
	onDestroy: function() {
		$.fn.modal.Constructor.prototype.escape = this.oldModalEscape;
	},
	onRemove: function() {
		console.log('removed');
	},
	update: function(value) {
		this.$('.progress-bar').css('width', value + '%').html(value + '%');
	}
});
},{}],"views/sorteios/sorteio":[function(require,module,exports){
module.exports=require('tmBJFK');
},{}],"tmBJFK":[function(require,module,exports){
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
},{"views/sorteios/candidatos":"Qq4B5r","views/sorteios/inserir_atualizar":"YM0yLE","views/sorteios/listas":"ZSFvA1"}],"base_controller":[function(require,module,exports){
module.exports=require('YoNwvn');
},{}],"YoNwvn":[function(require,module,exports){
var Dispatcher = require('dispatcher'),
	_ = require('underscore');

module.exports = {
	before: function() {},
	beforeSpecial: function() {},
	afterSpecial: function() {},
	after: function() {},
	_aborted: false,
	abort: function() {
		this._aborted = true;
	},
	execute: function(method, args, special) {

		if(special !== null) {
			if(special) {
				this.beforeSpecial(method, location.hash);
			} else {
				this.before(method, location.hash);
			}
		}

		if(!this._aborted) {
			this[method].apply(this, args);
			if(special !== null) {
				if(special) {
					this.afterSpecial(method, location.hash);
				} else {
					this.after(method, location.hash);
				}
			}
		}
	},
	renderView: function(region, view, viewOptions) {
		var viewPath = 'views/' + view;
		Dispatcher.renderView(region, viewPath, viewOptions);
	},
	extend: function(options) {
		var attrs = _.extend({}, this, options);
		return attrs;
	}
};
},{"dispatcher":"pHacTl"}],"dispatcher":[function(require,module,exports){
module.exports=require('pHacTl');
},{}],"pHacTl":[function(require,module,exports){
var Backbone = require('backbone'),
	_ = require('underscore'),
	Router = require('router'),
	Config = require('config');

exports.registerRoutes = function() {
	var routesArr = [],
		special = false;

	_.each(Config.routes, function(action, route) {

		if(_.contains(route, '@')) {
			special = true;
			route = _.rest(route).join('');
		} else if(_.contains(route, '*')) {
			special = null;
		} else {
			special = false;
		}

		routesArr.push({
			route      : route,
			controller : action.split('#')[0],
			method     : action.split('#')[1],
			special    : special
		});
	});

	new Router(routesArr);
	Backbone.history.start();
};

exports.renderView = function(region, view, options) {
	var Application = require('application'),
		View = require(view);

	Application[region].show(new View(options));
};
},{"application":"OW8hE8","config":"4itQ50","router":"YcPV55"}],"main":[function(require,module,exports){
module.exports=require('ZZhvdf');
},{}],"ZZhvdf":[function(require,module,exports){
var Initializer = require('initializer'),
	Dispatcher = require('dispatcher'),
	Application = require('application');

// Executa as rotinas contidas no arquivo application/initializer.js
Initializer();

// Registra as rotas da aplicação
Dispatcher.registerRoutes();

// Inicia a aplicação
Application.start();

},{"application":"OW8hE8","dispatcher":"pHacTl","initializer":"OZTZYA"}],"YcPV55":[function(require,module,exports){
var Backbone = require('backbone'),
	_ = require('underscore'),
	Config = require('config');

module.exports = Backbone.Router.extend({

	initialize: function(routes) {
		var router = this;

		_.each(routes, function(r) {
			var route = r.route,
				controller = require('controllers/' + r.controller),
				method = r.method,
				special = r.special;

			router.route(route, function() {
				var args = _.initial(arguments);

				if(!_.contains(Config.BLACKLIST_ROUTES, route)) {
					window.lastRoute = Backbone.history.fragment;
				}

				controller.execute(method, args, special);
			});
		});
	}
});
},{"config":"4itQ50"}],"router":[function(require,module,exports){
module.exports=require('YcPV55');
},{}],"4itQ50":[function(require,module,exports){
// Realiza um request para pegar as configurações do arquivo config.json
// e exporta como um módulo para ser consumido pela aplicação.
module.exports = (function() {

	var $ = require('jquery'),
		configJson = null;

	$.ajax({
		url: 'config.json',
		dataType: 'json',
		cache: false,
		async: false,
		success: function(response) {
			configJson = response;
		}
	});

	return configJson;
})();
},{}],"config":[function(require,module,exports){
module.exports=require('4itQ50');
},{}],55:[function(require,module,exports){

},{}]},{},["ZZhvdf"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxHaXQtUmVwb3NpdG9yaWVzXFxBVEktRFNcXE5PU1NBX0NBU0FcXGZyb250LWVuZFxcc29ydGVpb1xcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9hcHBsaWNhdGlvbi9jb2xsZWN0aW9ucy9jYW5kaWRhdG9zLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9hcHBsaWNhdGlvbi9jb2xsZWN0aW9ucy9saXN0YXMuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL2NvbGxlY3Rpb25zL3NvcnRlaW9zLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9hcHBsaWNhdGlvbi9jb250cm9sbGVycy9hcHBsaWNhdGlvbi5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vY29udHJvbGxlcnMvYXV0aC5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vY29udHJvbGxlcnMvc29ydGVpb3MuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL2V2ZW50cy5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vaGFuZGxlYmFyc19oZWxwZXJzLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9hcHBsaWNhdGlvbi9pbml0aWFsaXplci5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vbW9kZWxzL3NvcnRlaW8uanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL3V0aWxzLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9hcHBsaWNhdGlvbi92aWV3cy9iYXNlX3ZpZXcuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL3ZpZXdzL21lbnUuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL3ZpZXdzL3BhZ2luYTQwNC5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vdmlld3Mvc29ydGVpb3MvY2FuZGlkYXRvcy5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vdmlld3Mvc29ydGVpb3MvaW5zZXJpcl9hdHVhbGl6YXIuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL3ZpZXdzL3NvcnRlaW9zL2xpc3RhLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9hcHBsaWNhdGlvbi92aWV3cy9zb3J0ZWlvcy9saXN0YXIuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL3ZpZXdzL3NvcnRlaW9zL2xpc3Rhcy5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYXBwbGljYXRpb24vdmlld3Mvc29ydGVpb3MvcHJvZ3Jlc3NCYXIuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2FwcGxpY2F0aW9uL3ZpZXdzL3NvcnRlaW9zL3NvcnRlaW8uanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2Jhc2UvYmFzZV9jb250cm9sbGVyLmpzIiwiQzovR2l0LVJlcG9zaXRvcmllcy9BVEktRFMvTk9TU0FfQ0FTQS9mcm9udC1lbmQvc29ydGVpby9iYXNlL2Rpc3BhdGNoZXIuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2Jhc2UvbWFpbi5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vYmFzZS9yb3V0ZXIuanMiLCJDOi9HaXQtUmVwb3NpdG9yaWVzL0FUSS1EUy9OT1NTQV9DQVNBL2Zyb250LWVuZC9zb3J0ZWlvL2NvbmZpZy5qcyIsIkM6L0dpdC1SZXBvc2l0b3JpZXMvQVRJLURTL05PU1NBX0NBU0EvZnJvbnQtZW5kL3NvcnRlaW8vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTWFyaW9uZXR0ZSA9IHJlcXVpcmUoJ21hcmlvbmV0dGUnKSxcblx0SGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J10sXG5cdFRlbXBsYXRlcyA9IHJlcXVpcmUoJ3RlbXBsYXRlcycpKEhhbmRsZWJhcnMpLFxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKSxcblx0SGFuZGxlYmFyc19IZWxwZXJzID0gcmVxdWlyZSgnaGFuZGxlYmFyc19oZWxwZXJzJyksXG5cdEFwcGxpY2F0aW9uID0gbmV3IE1hcmlvbmV0dGUuQXBwbGljYXRpb24oKTtcblxuTWFyaW9uZXR0ZS5SZW5kZXJlci5yZW5kZXIgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgZGF0YSkge1xuXHRpZih0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gdGVtcGxhdGUoZGF0YSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFRlbXBsYXRlc1t0ZW1wbGF0ZV0oZGF0YSk7XG5cdH1cbn07XG5cbkFwcGxpY2F0aW9uLmFkZFJlZ2lvbnMoQ29uZmlnLnJlZ2lvbnMpO1xuXG4vLyBDw7NkaWdvIGEgc2VyIGV4ZWN1dGFkbyBuYSBpbmljaWFsaXphw6fDo28gZGEgYXBsaWNhw6fDo28uXG5BcHBsaWNhdGlvbi5hZGRJbml0aWFsaXplcihmdW5jdGlvbigpIHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbjsiLCJ2YXIgUGFnZWRDb2xsZWN0aW9uID0gcmVxdWlyZSgncGFnaW5hdG9yJykucGFnZWRDb2xsZWN0aW9uLFxyXG5cdENvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlZENvbGxlY3Rpb24uZXh0ZW5kKHtcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XHJcblx0XHRpZihvcHRpb25zLmlkU29ydGVpbykge1xyXG5cdFx0XHR0aGlzLnVybCA9IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3NvcnRlaW8vJyArIG9wdGlvbnMuaWRTb3J0ZWlvICsgJy9jYW5kaWRhdG8nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKG9wdGlvbnMuaWRMaXN0YSkge1xyXG5cdFx0XHR0aGlzLnVybCA9IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3NvcnRlaW8vbGlzdGEvJyArIG9wdGlvbnMuaWRMaXN0YSArICcvY2FuZGlkYXRvJztcclxuXHRcdH1cclxuXHJcblx0XHRQYWdlZENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzKTtcclxuXHR9XHJcbn0pOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0Q29uZmlnPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcclxuXHRcdHRoaXMudXJsID0gQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvc29ydGVpby8nICsgb3B0aW9ucy5pZFNvcnRlaW8gKyAnL2xpc3RhJztcclxuXHRcdHRoaXMuZmV0Y2goe2FzeW5jOiBmYWxzZX0pO1xyXG5cdH0sXHJcblxyXG5cdHBhcnNlOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdHJldHVybiByZXMuZGF0YTtcclxuXHR9XHJcbn0pOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0U29ydGVpbyA9IHJlcXVpcmUoJ21vZGVscy9zb3J0ZWlvJyksXHJcblx0Q29uZmlnPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xyXG5cdG1vZGVsOiBTb3J0ZWlvLFxyXG5cdHVybDogQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvc29ydGVpbycsXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5mZXRjaCh7YXN5bmM6IGZhbHNlfSk7XHJcblx0fSxcclxuXHJcblx0Y29tcGFyYXRvcjogZnVuY3Rpb24obW9kZWxBLCBtb2RlbEIpIHtcclxuXHRcdHZhciBkYXRhQSA9IG1vZGVsQS5nZXQoJ2RhdGEnKS5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIGRhdGFCID0gbW9kZWxCLmdldCgnZGF0YScpLnNwbGl0KCcvJyk7XHJcblxyXG5cdFx0ZGF0YUEgPSBuZXcgRGF0ZShkYXRhQVsyXSwgZGF0YUFbMV0gLSAxLCBkYXRhQVswXSk7XHJcblx0XHRkYXRhQiA9IG5ldyBEYXRlKGRhdGFCWzJdLCBkYXRhQlsxXSAtIDEsIGRhdGFCWzBdKTtcclxuXHJcblx0XHRyZXR1cm4gZGF0YUEgPiBkYXRhQiA/IC0xIDogZGF0YUEgPCBkYXRhQiA/IDEgOiAwO1xyXG5cdH0sXHJcblxyXG5cdHBhcnNlOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdHJldHVybiByZXMuZGF0YTtcclxuXHR9XHJcbn0pOyIsInZhciBBdXRoQ29udHJvbGxlciA9IHJlcXVpcmUoJ2NvbnRyb2xsZXJzL2F1dGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoQ29udHJvbGxlci5leHRlbmQoe1xuXG5cdHBhZ2luYTQwNDogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gdmlldyBtZW51IHJlbmRlcml6YWRhIGV4cGxpY2l0YW1lbnRlIHBvaXMgcm90YXMgNDA0IG7Do28gZXhlY3V0YW0gZmlsdHJvcyFcblx0XHR0aGlzLnJlbmRlclZpZXcoJ21lbnUnLCAnbWVudScpO1xuXHRcdHRoaXMucmVuZGVyVmlldygnbWFpbicsICdwYWdpbmE0MDQnKTtcblx0fVxufSk7IiwidmFyXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0QmFzZUNvbnRyb2xsZXIgPSByZXF1aXJlKCdiYXNlX2NvbnRyb2xsZXInKSxcclxuXHRBcHBsaWNhdGlvbiA9IHJlcXVpcmUoJ2FwcGxpY2F0aW9uJyksXHJcblx0VXRpbHMgPSByZXF1aXJlKCd1dGlscycpLFxyXG5cdEF1dGggPSByZXF1aXJlKCdhdXRoJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbnRyb2xsZXIuZXh0ZW5kKHtcclxuXHJcblx0YmVmb3JlOiBmdW5jdGlvbihtZXRob2QsIHJvdXRlKSB7XHJcblx0XHR0aGlzLnJlbmRlclZpZXcoJ21lbnUnLCAnbWVudScpO1xyXG5cclxuXHRcdGlmKG1ldGhvZCAhPT0gJ2xvZ2luJykge1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdEF1dGguaXNMb2dnZWQoKS5zdWNjZXNzKGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdGlmKCFyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCdsb2dpbicsIHRydWUpO1xyXG5cdFx0XHRcdFx0dGhhdC5hYm9ydCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bG9naW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxvZ2luVmlldyA9IG5ldyBBdXRoLmxvZ2luVmlldyh7XHJcblx0XHRcdGNhbGxiYWNrZG9Mb2dpbk9LOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRVdGlscy5nb1RvTGFzdFJvdXRlKCk7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRBdXRoLmlzTG9nZ2VkKCkuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0aWYoIXJlcy5zdGF0dXMpIHtcclxuXHRcdFx0XHRBcHBsaWNhdGlvbi5tYWluLnNob3cobG9naW5WaWV3KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRVdGlscy5nb1RvTGFzdFJvdXRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XHJcblx0XHRNdWx0aW1vZGFsLmNvbmZpcm0oJ0Rlc2VqYSByZWFsbWVudGUgc2FpciBkbyBzaXN0ZW1hPycsIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdGlmKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0QXV0aC5sb2dvdXQoKS5zdWNjZXNzKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0QmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnbG9naW4nLCB0cnVlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRVdGlscy5nb1RvTGFzdFJvdXRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSk7IiwidmFyIEF1dGhDb250cm9sbGVyID0gcmVxdWlyZSgnY29udHJvbGxlcnMvYXV0aCcpLFxyXG5cdE11bHRpbW9kYWwgPSByZXF1aXJlKCdtdWx0aW1vZGFsJyksXHJcblx0VXRpbHMgPSByZXF1aXJlKCd1dGlscycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoQ29udHJvbGxlci5leHRlbmQoe1xyXG5cclxuXHRsaXN0YXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5yZW5kZXJWaWV3KCdtYWluJywgJ3NvcnRlaW9zL2xpc3RhcicpO1xyXG5cdH0sXHJcblxyXG5cdGluc2VyaXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNvcnRlaW8gPSBuZXcgKHJlcXVpcmUoJ21vZGVscy9zb3J0ZWlvJykpO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuc2hvdyhuZXcgKHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL3NvcnRlaW8nKSkoe21vZGVsOiBzb3J0ZWlvfSksICdtb2RhbFNvcnRlaW8nKTtcclxuXHRcdFV0aWxzLmdvVG9MYXN0Um91dGUoKTtcclxuXHR9LFxyXG5cclxuXHRkZXRhbGhhcjogZnVuY3Rpb24oaWQpIHtcclxuXHRcdHZhciBzb3J0ZWlvID0gbmV3IChyZXF1aXJlKCdtb2RlbHMvc29ydGVpbycpKSh7aWQ6IGlkfSk7XHJcblxyXG5cdFx0c29ydGVpby5mZXRjaCgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdE11bHRpbW9kYWwuc2hvdyhuZXcgKHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL3NvcnRlaW8nKSkoe21vZGVsOiBzb3J0ZWlvfSksICdtb2RhbFNvcnRlaW8nLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFV0aWxzLmdvVG9MYXN0Um91dGUoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGNhbGxBY3Rpb246IGZ1bmN0aW9uKHBhcmFtKSB7XHJcblx0XHRpZihpc05hTihwYXJzZUludChwYXJhbSwgMTApKSkge1xyXG5cdFx0XHRpZihwYXJhbSA9PT0gJ2luc2VyaXInKSB7XHJcblx0XHRcdFx0dGhpcy5pbnNlcmlyKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVxdWlyZSgnY29udHJvbGxlcnMvYXBwbGljYXRpb24nKS5wYWdpbmE0MDQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5kZXRhbGhhcihwYXJhbSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxyXG5cdEV2ZW50cyA9IEJhY2tib25lLkV2ZW50cztcclxuXHJcbkV2ZW50cy5vbigncmVzZXRfZm9ybScsIGZ1bmN0aW9uKGZvcm0pIHtcclxuXHQkKGZvcm0pWzBdLnJlc2V0KCk7XHJcblx0JChmb3JtKS5maW5kKCcuZm9ybS1jb250cm9sOmZpcnN0JykuZm9jdXMoKTtcclxufSk7XHJcblxyXG5FdmVudHMub24oJ2Nsb3NlX21vZGFsJywgZnVuY3Rpb24oKSB7XHJcblx0JCgnLm1vZGFsIC5jbG9zZTpsYXN0JykudHJpZ2dlcignY2xpY2snKTtcclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50czsiLCJ2YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J10sXG5cdEF1dGggPSByZXF1aXJlKCdhdXRoJyksXG5cdENvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpLFxuXHRNb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignQ09ORklHJywgZnVuY3Rpb24oYXR0cikge1xuXHRpZiAoYXR0ciA9PT0gJ0VOVicpIHtcblx0XHRyZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZygnPHNwYW4gc3R5bGU9XCJjb2xvcjp0b21hdG87XCI+JyArIENvbmZpZ1thdHRyXSArICc8L3NwYW4+Jyk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIENvbmZpZ1thdHRyXTtcblx0fVxufSk7XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2lzTG9nZ2VkJywgZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgY29udGV4dCA9IHRoaXM7XG5cblx0ZnVuY3Rpb24gaXNMb2dnZWQoKSB7XG5cdFx0dmFyIGlzTG9nZ2VkO1xuXG5cdFx0QXV0aC5pc0xvZ2dlZCgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRpc0xvZ2dlZCA9IHJlcy5zdGF0dXMgPyBvcHRpb25zLmZuKGNvbnRleHQpIDogb3B0aW9ucy5pbnZlcnNlKGNvbnRleHQpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGlzTG9nZ2VkO1xuXHR9XG5cdHJldHVybiBpc0xvZ2dlZCgpO1xufSk7XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2Zvcm1hdERhdGUnLCBmdW5jdGlvbihkYXRhKSB7XG5cdHJldHVybiBNb21lbnQoZGF0YSwgJ0REL01NL1lZWVknKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbn0pO1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdWQUxJREFUSU9OX01FU1NBR0VTJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0ZW1wbGF0ZSA9IFtcblx0XHQnPGRpdiBjbGFzcz1cInJvd1wiPicsXG5cdFx0J1x0PGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPicsXG5cdFx0J1x0XHQ8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyIGhpZGVcIj4nLFxuXHRcdCdcdFx0XHQ8dWwgY2xhc3M9XCJ2YWxpZGF0aW9uLW1lc3NhZ2VzLWxpc3RcIiBzdHlsZT1cImxpc3Qtc3R5bGUtdHlwZTpub25lOyBwYWRkaW5nLWxlZnQ6MDtcIj48L3VsPicsXG5cdFx0J1x0XHQ8L2Rpdj4nLFxuXHRcdCdcdDwvZGl2PicsXG5cdFx0JzwvZGl2Pidcblx0XS5qb2luKCcnKTtcblxuXHRyZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyh0ZW1wbGF0ZSk7XG59KTsiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxuXHRfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRBdXRoID0gcmVxdWlyZSgnYXV0aCcpLFxuXHRNdWx0aW1vZGFsID0gcmVxdWlyZSgnbXVsdGltb2RhbCcpLFxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcblxuLy8gRXhwb3J0YSBvIGpxdWVyeSBnbG9iYWxtZW50ZSBwYXJhIGNvbXBhdGliaWxpZGFkZSBjb20gcGx1Z2lucy5cbmpRdWVyeSA9ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuLy8gSW5qZXRhIG8ganF1ZXJ5LlxuQmFja2JvbmUuJCA9ICQ7XG5cbi8vIFJlZ2lzdHJhIG8gZXZlbnRvcyBwcmV2aWFtZW50ZSBjYWRhc3RyYWRvc1xucmVxdWlyZSgnZXZlbnRzJyk7XG5cbi8vIEPDs2RpZ28gYSBzZXIgZXhlY3V0YWRvIGFudGVzIGRhIGluaWNpYWxpemHDp8OjbyBkYSBhcGxpY2HDp8Ojby5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdC8vIEF1dGhcblx0QXV0aC5pbml0KHtcblx0XHRhcHBTaWdsYSAgICAgIDogJ1NPUlRFSU8nLFxuXHRcdGFwcERlc2NyaWNhbyAgOiAnQXBsaWNhdGl2byBwYXJhIHNvcnRlaW8gZGUgcmVzaWTDqm5jaWFzIGRvIHByb2dyYW1hIE5vc3NhIENhc2EnLFxuXHRcdGxvZ2luVXJsICAgICAgOiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS91c3VhcmlvL2xvZ2luJyxcblx0XHRsb2dvdXRVcmwgICAgIDogQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvdXN1YXJpby9sb2dvdXQnLFxuXHRcdGxvZ2dlZFVzZXJVcmwgOiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS91c3VhcmlvJ1xuXHR9KTtcblxuXHQvLyBNdWx0aW1vZGFsXG5cdE11bHRpbW9kYWwuaW5pdGlhbGl6ZShyZXF1aXJlKCdhcHBsaWNhdGlvbicpLCB7XG5cdFx0YWxlcnQ6IHtcblx0XHRcdHRpdGxlOiAnPHNwYW4gY2xhc3M9XCJ0ZXh0LWluZm9cIj5NZW5zYWdlbTwvc3Bhbj4nLFxuXHRcdFx0YnRuT2s6IHtcblx0XHRcdFx0bGFiZWw6ICdPSycsXG5cdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1wcmltYXJ5IGJ0bi1zbSdcblx0XHRcdH1cblx0XHR9LFxuXHRcdGNvbmZpcm06IHtcblx0XHRcdHRpdGxlOiAnPHNwYW4gY2xhc3M9XCJ0ZXh0LWluZm9cIj5Db25maXJtYcOnw6NvPC9zcGFuPicsXG5cdFx0XHRidG5Pazoge1xuXHRcdFx0XHRsYWJlbDogJ1NpbScsXG5cdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1zdWNjZXNzIGJ0bi1zbSdcblx0XHRcdH0sXG5cdFx0XHRidG5DYW5jZWw6IHtcblx0XHRcdFx0bGFiZWw6ICdOw6NvJyxcblx0XHRcdFx0Y2xhc3NOYW1lOiAnYnRuLWRhbmdlciBidG4tc20nXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb25maXJtSW5saW5lOiB7XG5cdFx0XHRtZXNzYWdlOiAnQ29uZmlybWE/Jyxcblx0XHRcdGJ0bk9rOiB7XG5cdFx0XHRcdGxhYmVsOiAnU2ltJyxcblx0XHRcdFx0Y2xhc3NOYW1lOiAnYnRuLXN1Y2Nlc3MgYnRuLXNtJ1xuXHRcdFx0fSxcblx0XHRcdGJ0bkNhbmNlbDoge1xuXHRcdFx0XHRsYWJlbDogJ07Do28nLFxuXHRcdFx0XHRjbGFzc05hbWU6ICdidG4tZGFuZ2VyIGJ0bi1zbSdcblx0XHRcdH1cblx0XHR9LFxuXHRcdG5vdGlmeToge1xuXHRcdFx0d2lkdGg6IDQyMCxcblx0XHRcdGRlbGF5OiAzMDAwLFxuXHRcdFx0YWxsb3dfZGlzbWlzczogdHJ1ZVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gQmFja2JvbmUgTW9kZWwgSW52YWxpZFxuXHRCYWNrYm9uZS5Nb2RlbC5wcm90b3R5cGUub24oJ2ludmFsaWQgY2hhbmdlJywgXy5kZWJvdW5jZShmdW5jdGlvbihtb2RlbCwgZXJyb3JzLCBvcHRpb25zKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHZhciAkbGlzdCA9ICQoJy52YWxpZGF0aW9uLW1lc3NhZ2VzLWxpc3Q6bGFzdCcpLFxuXHRcdFx0XHR2YWxpZGF0aW9uRXJyb3JzID0gXy5pc0FycmF5KGVycm9ycykgPyBlcnJvcnMgOiBtb2RlbC52YWxpZGF0aW9uRXJyb3IsXG5cdFx0XHRcdGl0ZW1zID0gW107XG5cblx0XHRcdCQoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuXG5cdFx0XHRfLmVhY2godmFsaWRhdGlvbkVycm9ycywgZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdGl0ZW1zLnB1c2goJzxsaT48aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiPjwvaT4mbmJzcDsmbmJzcDsnICsgZXJyLm1lc3NhZ2UgKyAnPC9saT4nKTtcblx0XHRcdFx0JChlcnIuZWxlbWVudCkucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JGxpc3QuaHRtbChpdGVtcyk7XG5cblx0XHRcdC8vICQoJy5mb3JtLWdyb3VwLmhhcy1lcnJvciA+IC5mb3JtLWNvbnRyb2w6Zmlyc3QnKS5mb2N1cygpO1xuXG5cdFx0XHRpZihpdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdCRsaXN0LnBhcmVudHMoJy5hbGVydCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbGlzdC5wYXJlbnRzKCcuYWxlcnQnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2goZXJyKSB7fVxuXHR9LCAxMDApKTtcbn07IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuXHR1cmxSb290OiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS9zb3J0ZWlvJyxcclxuXHJcblx0ZGVmYXVsdHM6IHtcclxuXHRcdCdkYXRhJzogJydcclxuXHR9LFxyXG5cclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMpIHtcclxuXHRcdHZhciBlcnJvcnMgPSBbXTtcclxuXHRcdGlmKGF0dHJzLmRhdGEgPT09ICcnKSB7XHJcblx0XHRcdGVycm9ycy5wdXNoKHtcclxuXHRcdFx0XHRlbGVtZW50OiAnI2RhdGEnLFxyXG5cdFx0XHRcdG1lc3NhZ2U6ICdEYXRhIHByZWNpc2Egc2VyIGluZm9ybWFkYSdcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXJyb3JzIDogbnVsbDtcclxuXHR9LFxyXG5cclxuXHRwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdHJldHVybiByZXMuZGF0YTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiByZXM7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG5cdEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRBdXRoID0gcmVxdWlyZSgnYXV0aCcpO1xyXG5cclxuZXhwb3J0cy5hY3RpdmVNZW51SXRlbnNPbkhvdmVyID0gZnVuY3Rpb24oKSB7XHJcblx0JCgnLm5hdmJhci1uYXYgPiBsaScpLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKS5jbG9zZXN0KCcuZHJvcGRvd24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdH0pLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpLmNsb3Nlc3QoJy5kcm9wZG93bi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHR9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ29Ub0xhc3RSb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUod2luZG93Lmxhc3RSb3V0ZSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNldExvZ2dlZFVzZXJFbCA9IGZ1bmN0aW9uKG5vbWUpIHtcclxuXHR2YXIgZWxlbWVudCA9IFtcclxuXHRcdCc8ZGl2IGNsYXNzPVwicHVsbC1yaWdodFwiPicsXHJcblx0XHQnXHQ8cCBjbGFzcz1cIm5hdmJhci10ZXh0XCI+bG9nZ2VkVXNlcjwvcD4nLFxyXG5cdFx0J1x0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXhzIGJ0bi13YXJuaW5nIGxvZ2luLWJsb2NrLWxvZ291dFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxNHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIj5TYWlyPC9idXR0b24+JyxcclxuXHRcdCc8L2Rpdj4nXHJcblx0XS5qb2luKCcnKS5yZXBsYWNlKCdsb2dnZWRVc2VyJywgbm9tZSk7XHJcblxyXG5cdCQoJy5sb2dnZWQtdXNlci1lbCcpLmh0bWwoZWxlbWVudCk7XHJcblxyXG5cdCQoJy5sb2dpbi1ibG9jay1sb2dvdXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihldikge1xyXG5cdFx0QmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnbG9nb3V0Jywge3RyaWdnZXI6IHRydWV9KTtcclxuXHR9KTtcclxufTtcclxuIiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHJcblx0ZXZlbnRzOiB7XHJcblx0XHQnc3VibWl0IGZvcm0nICAgIDogJ3NhbHZhcicsXHJcblx0XHQnZm9jdXNvdXQgaW5wdXQnIDogJ3ZhbGlkYXRlJyxcclxuXHRcdCdjaGFuZ2Ugc2VsZWN0JyAgOiAndmFsaWRhdGUnXHJcblx0fSxcclxuXHJcblx0b25TaG93OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGF0LiQoJ2lucHV0OmZpcnN0JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuY2FsbGVkID0gdGhpcy5jYWxsZWQgfHwgZmFsc2U7XHJcblxyXG5cdFx0aWYodGhpcy5tb2RlbC52YWxpZGF0aW9uRXJyb3IgfHwgdGhpcy5jYWxsZWQpIHtcclxuXHRcdFx0dGhpcy5wb3B1bGF0ZU1vZGVsKCk7XHJcblx0XHRcdHRoaXMubW9kZWwuaXNWYWxpZCgpO1xyXG5cdFx0XHR0aGlzLmNhbGxlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgTWFyaW9uZXR0ZSA9IHJlcXVpcmUoJ21hcmlvbmV0dGUnKSxcblx0QXV0aCA9ICByZXF1aXJlKCdhdXRoJyksXG5cdFV0aWxzID0gcmVxdWlyZSgndXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG5cdHRlbXBsYXRlOiAnbWVudS50cGwnLFxuXG5cdG9uU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0QXV0aC5pc0xvZ2dlZCgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRpZihyZXMuc3RhdHVzKSB7XG5cdFx0XHRcdFV0aWxzLnNldExvZ2dlZFVzZXJFbChyZXMuZGF0YS5ub21lKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRVdGlscy5hY3RpdmVNZW51SXRlbnNPbkhvdmVyKCk7XG5cdFx0fSwgMTAwKTtcblx0fVxufSk7IiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogJ3BhZ2luYTQwNC50cGwnXG59KTsiLCJ2YXIgTWFyaW9uZXR0ZSA9IHJlcXVpcmUoJ21hcmlvbmV0dGUnKSxcclxuXHRIYW5kbGViYXJzID0gcmVxdWlyZSgnaGFuZGxlYmFycy5ydW50aW1lJylbJ2RlZmF1bHQnXSxcclxuXHRDYW5kaWRhdG9zID0gcmVxdWlyZSgnY29sbGVjdGlvbnMvY2FuZGlkYXRvcycpLFxyXG5cdFByb2dyZXNzQmFyVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL3Byb2dyZXNzQmFyJyksXHJcblx0UGFnaW5hdG9yID0gcmVxdWlyZSgncGFnaW5hdG9yJykucGFnaW5hdG9yLFxyXG5cdE11bHRpbW9kYWwgPSByZXF1aXJlKCdtdWx0aW1vZGFsJyksXHJcblx0Q29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyksXHJcblx0RXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyksXHJcblx0U2VhcmNoZXIgPSByZXF1aXJlKCdzZWFyY2hlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XHJcblx0dGVtcGxhdGU6ICdzb3J0ZWlvcy9jYW5kaWRhdG9zLnRwbCcsXHJcblxyXG5cdGV2ZW50czoge1xyXG5cdFx0J2NoYW5nZSAjYXJxdWl2bycgICAgICAgICAgIDogZnVuY3Rpb24oZXYpIHsgdGhpcy4kKCcuYnRuLWVudmlhci1hcnF1aXZvJykuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7IH0sXHJcblx0XHQnY2xpY2sgLmJ0bi1lbnZpYXItYXJxdWl2bycgOiAnZW52aWFyQXJxdWl2bydcclxuXHR9LFxyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLnBhcmVudFZpZXcgPSBvcHRpb25zLnBhcmVudFZpZXc7XHJcblxyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuY29sbGVjdGlvbiA9IG5ldyBDYW5kaWRhdG9zKG51bGwsIHtpZFNvcnRlaW86IHRoaXMubW9kZWwuZ2V0KCdpZCcpfSk7XHJcblxyXG5cdFx0RXZlbnRzLm9uKCdoaWRlX3VwbG9hZF9jb250cm9scycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGF0LiQoJy51cGxvYWQtY29udHJvbHMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0RXZlbnRzLm9uKCdyZWxvYWRfY29sbGVjdGlvbl9jYW5kaWRhdG9zJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoYXQuY29sbGVjdGlvbiA9IG5ldyBDYW5kaWRhdG9zKG51bGwsIHtpZFNvcnRlaW86IHRoYXQubW9kZWwuZ2V0KCdpZCcpfSk7XHJcblx0XHRcdHRoYXQucmVuZGVyKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRvblJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3JlcXVlc3QnLCB0aGlzLnNldEdyaWRkZXIpO1xyXG5cdFx0dGhpcy5zZXRHcmlkZGVyKCk7XHJcblx0XHR0aGlzLnNldFBhZ2luYXRvcigpO1xyXG5cdFx0dGhpcy5zZXRTZWFyY2hlcigpO1xyXG5cclxuXHRcdGlmKHRoaXMucGFyZW50Vmlldy5saXN0YXMuY3VycmVudFZpZXcuY29sbGVjdGlvbi53aGVyZSh7c29ydGVhZGE6IHRydWV9KS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdEV2ZW50cy50cmlnZ2VyKCdoaWRlX3VwbG9hZF9jb250cm9scycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldEdyaWRkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHBhcnRpYWwgPSBIYW5kbGViYXJzLnBhcnRpYWxzWydzb3J0ZWlvcy9fZ3JpZGRlckNhbmRpZGF0b3MudHBsJ10oe2NhbmRpZGF0b3M6IHRoaXMuY29sbGVjdGlvbi50b0pTT04oKX0pO1xyXG5cdFx0dGhpcy4kKCcjZ3JpZGRlckNhbmRpZGF0b3MnKS5odG1sKCBwYXJ0aWFsICk7XHJcblx0fSxcclxuXHJcblx0c2V0UGFnaW5hdG9yOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHZhciBwYWdpbmF0b3IgPSBuZXcgUGFnaW5hdG9yKHtcclxuXHRcdFx0XHRlbDogdGhpcy4kKCcjcGFnaW5hdG9yQ2FuZGlkYXRvcycpLFxyXG5cdFx0XHRcdGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvblxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuJCgnI3BhZ2luYXRvckNhbmRpZGF0b3MnKS5wYXJlbnRzKCcucm93JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzZXRTZWFyY2hlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRpZih0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFNlYXJjaGVyKHtcclxuXHRcdFx0XHRlbDogdGhpcy4kKCcjc2VhcmNoZXJDYW5kaWRhdG9zJyksXHJcblx0XHRcdFx0Y29sbGVjdGlvbjogdGhpcy5jb2xsZWN0aW9uLFxyXG5cdFx0XHRcdHNlYXJjaEF0dHJzOiBbXHJcblx0XHRcdFx0XHQnbm9tZTpOT01FJyxcclxuXHRcdFx0XHRcdCdjcGY6Q1BGJ1xyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bGl2ZTogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRlbnZpYXJBcnF1aXZvOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBhcnF1aXZvID0gdGhpcy4kKCcjYXJxdWl2bycpWzBdLmZpbGVzWzBdLFxyXG5cdFx0XHRmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpLFxyXG5cdFx0XHR0aGF0ID0gdGhpcztcclxuXHJcblx0XHRmb3JtRGF0YS5hcHBlbmQoJ2FycXVpdm8nLCBhcnF1aXZvKTtcclxuXHJcblx0XHRNdWx0aW1vZGFsLmNvbmZpcm0oJ0NvbmZpcm1hIG8gZW52aW8gZG8gYXJxdWl2bz8nLCBmdW5jdGlvbihyZXNwb3N0YSkge1xyXG5cdFx0XHRpZihyZXNwb3N0YSkge1xyXG5cdFx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0XHR1cmw6IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3NvcnRlaW8vJyArIHRoYXQubW9kZWwuZ2V0KCdpZCcpICsgJy9pbXBvcnRhckNhbmRpZGF0b3MnLFxyXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdFx0XHRkYXRhOiBmb3JtRGF0YSxcclxuXHRcdFx0XHRcdGNhY2hlOiBmYWxzZSxcclxuXHRcdFx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhocikge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ0ZlY2hhciBhIGphbmVsYSBpcsOhIGNhbmNlbGFyIGEgaW1wb3J0YcOnw6NvLic7XHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHRoYXQuc2hvd1Byb2dyZXNzQmFyKCdJbXBvcnRhw6fDo28gZW0gYW5kYW1lbnRvISBQb3IgZmF2b3IgYWd1YXJkZS4nKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR4aHJGaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0b25wcm9ncmVzczogZnVuY3Rpb24oZXYpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LnByb2dyZXNzVmlldy51cGRhdGUoZXYubG9hZGVkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmRvbmUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR0aGF0LnByb2dyZXNzVmlldy5kZXN0cm95KCk7XHJcblxyXG5cdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ0ltcG9ydGHDp8OjbyByZWFsaXphZGEgY29tIHN1Y2Vzc28hJywge3R5cGU6ICdzdWNjZXNzJ30pO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ3JlbG9hZF9jb2xsZWN0aW9uX2xpc3RhcycpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ3JlbG9hZF9jb2xsZWN0aW9uX2NhbmRpZGF0b3MnKTtcclxuXHRcdFx0XHRcdHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IG51bGw7XHJcblx0XHRcdFx0fSkuZXJyb3IoZnVuY3Rpb24oZXJyKSB7XHJcblx0XHRcdFx0XHRNdWx0aW1vZGFsLm5vdGlmeSgnT2NvcnJldSB1bSBlcnJvIG5hIGltcG9ydGHDp8OjbyBkb3MgY2FuZGlkYXRvcyEnLCB7dHlwZTogJ2Rhbmdlcid9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0c2hvd1Byb2dyZXNzQmFyOiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcblx0XHR0aGlzLnByb2dyZXNzVmlldyA9IG5ldyBQcm9ncmVzc0JhclZpZXcoe21lc3NhZ2U6IG1lc3NhZ2V9KTtcclxuXHJcblx0XHRNdWx0aW1vZGFsLnNob3codGhpcy5wcm9ncmVzc1ZpZXcsICdtb2RhbFByb2dyZXNzQ2FuZGlkYXRvcycpO1xyXG5cdH1cclxufSk7IiwidmFyIEJhc2VWaWV3ID0gcmVxdWlyZSgndmlld3MvYmFzZV92aWV3JyksXHJcblx0QmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxyXG5cdEV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpLFxyXG5cdE11bHRpbW9kYWwgPSByZXF1aXJlKCdtdWx0aW1vZGFsJyksXHJcblx0TW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VWaWV3LmV4dGVuZCh7XHJcblx0dGVtcGxhdGU6ICdzb3J0ZWlvcy9pbnNlcmlyX2F0dWFsaXphci50cGwnLFxyXG5cclxuXHRwb3B1bGF0ZU1vZGVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXRhID0gTW9tZW50KHRoaXMuJCgnI2RhdGEnKS52YWwoKSkuaXNWYWxpZCgpID8gTW9tZW50KHRoaXMuJCgnI2RhdGEnKS52YWwoKSkuZm9ybWF0KCdERC9NTS9ZWVlZJykgOiAnJztcclxuXHRcdHRoaXMubW9kZWwuc2V0KCdkYXRhJywgZGF0YSk7XHJcblx0XHR0aGlzLm1vZGVsLnNldCgnb2JzZXJ2YWNhbycsIHRoaXMuJCgnI29ic2VydmFjYW8nKS52YWwoKSk7XHJcblx0fSxcclxuXHJcblx0c2FsdmFyOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBjb25maXJtTWVzc2FnZSA9ICdDb25maXJtYSBvIGNhZGFzdHJvIGRvIFNvcnRlaW8/JyxcclxuXHRcdFx0c3VjY2Vzc01lc3NhZ2UgPSAnU29ydGVpbyBjYWRhc3RyYWRvIGNvbSBzdWNlc3NvIScsXHJcblx0XHRcdHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdGlmKHRoaXMubW9kZWwuZ2V0KCdpZCcpKSB7XHJcblx0XHRcdGNvbmZpcm1NZXNzYWdlID0gJ0NvbmZpcm1hIGEgYXR1YWxpemHDp8OjbyBkb3MgZGFkb3MgZG8gU29ydGVpbz8nXHJcblx0XHRcdHN1Y2Nlc3NNZXNzYWdlID0gJ0RhZG9zIGRvIFNvcnRlaW8gYXR1YWxpemFkb3MgY29tIHN1Y2Vzc28hJztcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBvcHVsYXRlTW9kZWwoKTtcclxuXHJcblx0XHRpZih0aGlzLm1vZGVsLmlzVmFsaWQoKSkge1xyXG5cdFx0XHRNdWx0aW1vZGFsLmNvbmZpcm1JbmxpbmUoY29uZmlybU1lc3NhZ2UsIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0aWYocmVzcG9zdGEpIHtcclxuXHRcdFx0XHRcdHRoYXQucG9wdWxhdGVNb2RlbCgpO1xyXG5cdFx0XHRcdFx0dGhhdC5tb2RlbC5zYXZlKCkuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYocmVzLnN0YXR1cykge1xyXG5cdFx0XHRcdFx0XHRcdE11bHRpbW9kYWwubm90aWZ5KHN1Y2Nlc3NNZXNzYWdlLCB7dHlwZTogJ3N1Y2Nlc3MnfSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdEV2ZW50cy50cmlnZ2VyKCdyZWxvYWRfY29sbGVjdGlvbl9zb3J0ZWlvcycpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZihyZXMuZGF0YSAmJiByZXMuZGF0YS5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ2Nsb3NlX21vZGFsJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCdzb3J0ZWlvcy8nICsgcmVzLmRhdGEuaWQsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRNdWx0aW1vZGFsLm5vdGlmeShyZXMubWVzc2FnZSwge3R5cGU6ICdkYW5nZXInfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgTWFyaW9uZXR0ZSA9IHJlcXVpcmUoJ21hcmlvbmV0dGUnKSxcclxuXHRIYW5kbGViYXJzID0gcmVxdWlyZSgnaGFuZGxlYmFycy5ydW50aW1lJylbJ2RlZmF1bHQnXSxcclxuXHRDYW5kaWRhdG9zID0gcmVxdWlyZSgnY29sbGVjdGlvbnMvY2FuZGlkYXRvcycpLFxyXG5cdFBhZ2luYXRvciA9IHJlcXVpcmUoJ3BhZ2luYXRvcicpLnBhZ2luYXRvcixcclxuXHRNdWx0aW1vZGFsID0gcmVxdWlyZSgnbXVsdGltb2RhbCcpLFxyXG5cdENvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XHJcblx0dGVtcGxhdGU6ICdzb3J0ZWlvcy9saXN0YS50cGwnLFxyXG5cclxuXHRldmVudHM6IHtcclxuXHRcdCdjbGljayAuYnRuLXB1YmxpY2FyLWxpc3RhJyA6ICdwdWJsaWNhckxpc3RhJ1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gbmV3IENhbmRpZGF0b3MobnVsbCwge2lkTGlzdGE6IHRoaXMubW9kZWwuZ2V0KCdpZCcpfSk7XHJcblx0fSxcclxuXHJcblx0b25SZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdyZXF1ZXN0JywgdGhpcy5zZXRHcmlkZGVyKTtcclxuXHRcdHRoaXMuc2V0R3JpZGRlcigpO1xyXG5cdFx0dGhpcy5zZXRQYWdpbmF0b3IoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRHcmlkZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwYXJ0aWFsID0gSGFuZGxlYmFycy5wYXJ0aWFsc1snc29ydGVpb3MvX2dyaWRkZXJDYW5kaWRhdG9zTGlzdGEudHBsJ10oe2NhbmRpZGF0b3M6IHRoaXMuY29sbGVjdGlvbi50b0pTT04oKX0pO1xyXG5cdFx0dGhpcy4kKCcjZ3JpZGRlckNhbmRpZGF0b3NMaXN0YScpLmh0bWwoIHBhcnRpYWwgKTtcclxuXHR9LFxyXG5cclxuXHRzZXRQYWdpbmF0b3I6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHBhZ2luYXRvciA9IG5ldyBQYWdpbmF0b3Ioe1xyXG5cdFx0XHRlbDogdGhpcy4kKCcjcGFnaW5hdG9yQ2FuZGlkYXRvc0xpc3RhJyksXHJcblx0XHRcdGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvblxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0cHVibGljYXJMaXN0YTogZnVuY3Rpb24oZXYpIHtcclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0JC5hamF4KHtcclxuXHRcdFx0dXJsOiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS9wdWJsaWNhY2FvL2xpc3RhLycgKyB0aGF0Lm1vZGVsLmdldCgnaWQnKSArICcvcHVibGljYXInLFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0Y2FjaGU6IGZhbHNlXHJcblx0XHR9KS5kb25lKGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1B1YmxpY2HDp8OjbyBkYSBsaXN0YSByZWFsaXphZGEgY29tIHN1Y2Vzc28hJywge3R5cGU6ICdzdWNjZXNzJ30pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE11bHRpbW9kYWwubm90aWZ5KCdPY29ycmV1IHVtIGVycm8gbmEgcHVibGljYcOnw6NvIGRhIGxpc3RhIScsIHt0eXBlOiAnZGFuZ2VyJ30pO1xyXG5cdFx0XHR9XHJcblx0XHR9KS5lcnJvcihmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ09jb3JyZXUgdW0gZXJybyBuYSBwdWJsaWNhw6fDo28gZGEgbGlzdGEhJywge3R5cGU6ICdkYW5nZXInfSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0pOyIsInZhciBNYXJpb25ldHRlID0gcmVxdWlyZSgnbWFyaW9uZXR0ZScpLFxyXG5cdEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLnJ1bnRpbWUnKVsnZGVmYXVsdCddLFxyXG5cdEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRTb3J0ZWlvcyA9IHJlcXVpcmUoJ2NvbGxlY3Rpb25zL3NvcnRlaW9zJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRFdmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xyXG5cdHRlbXBsYXRlOiAnc29ydGVpb3MvbGlzdGFyLnRwbCcsXHJcblxyXG5cdGV2ZW50czoge1xyXG5cdFx0J2NsaWNrIC50YWJsZS1zb3J0ZWlvcyAuY2xpY2thYmxlJyA6ICdzaG93U29ydGVpbycsXHJcblx0XHQnY2xpY2sgLmJ0bi1leGNsdWlyLXNvcnRlaW8nICAgICAgIDogJ2V4Y2x1aXJTb3J0ZWlvJ1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuY29sbGVjdGlvbiA9IG5ldyBTb3J0ZWlvcygpO1xyXG5cclxuXHRcdEV2ZW50cy5vbigncmVsb2FkX2NvbGxlY3Rpb25fc29ydGVpb3MnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhhdC5jb2xsZWN0aW9uID0gbmV3IFNvcnRlaW9zKCk7XHJcblx0XHRcdHRoYXQucmVuZGVyKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRvblJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldEdyaWRkZXIoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRHcmlkZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwYXJ0aWFsID0gSGFuZGxlYmFycy5wYXJ0aWFsc1snc29ydGVpb3MvX2dyaWRkZXJTb3J0ZWlvcy50cGwnXSh7c29ydGVpb3M6IHRoaXMuY29sbGVjdGlvbi50b0pTT04oKX0pO1xyXG5cdFx0dGhpcy4kKCcjZ3JpZGRlclNvcnRlaW9zJykuaHRtbCggcGFydGlhbCApO1xyXG5cdH0sXHJcblxyXG5cdHNob3dTb3J0ZWlvOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIGlkU29ydGVpbyA9IHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJyk7XHJcblx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCdzb3J0ZWlvcy8nICsgaWRTb3J0ZWlvLCB0cnVlKTtcclxuXHR9LFxyXG5cclxuXHRleGNsdWlyU29ydGVpbzogZnVuY3Rpb24oZXYpIHtcclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIGlkU29ydGVpbyA9IHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJyksXHJcblx0XHRcdHNvcnRlaW8gPSB0aGlzLmNvbGxlY3Rpb24uZ2V0KGlkU29ydGVpbyksXHJcblx0XHRcdG1zZyA9ICdFeGNsdWlyIFNvcnRlaW8gZG8gZGlhIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBzb3J0ZWlvLmdldCgnZGF0YScpICsgJzwvc3Ryb25nPj8nO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybShtc2csIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdGlmKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0c29ydGVpby5kZXN0cm95KCkuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdGlmKHJlcy5zdGF0dXMpIHtcclxuXHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1NvcnRlaW8gZXhjbHXDrWRvIGNvbSBzdWNlc3NvJywge3R5cGU6ICdzdWNjZXNzJ30pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkocmVzLm1lc3NhZ2UsIHt0eXBlOiAnZGFuZ2VyJ30pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ3JlbG9hZF9jb2xsZWN0aW9uX3NvcnRlaW9zJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSk7IiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyksXHJcblx0SGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J10sXHJcblx0XyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcclxuXHRMaXN0YXMgPSByZXF1aXJlKCdjb2xsZWN0aW9ucy9saXN0YXMnKSxcclxuXHRMaXN0YVZpZXcgPSByZXF1aXJlKCd2aWV3cy9zb3J0ZWlvcy9saXN0YScpLFxyXG5cdFByb2dyZXNzQmFyVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL3Byb2dyZXNzQmFyJyksXHJcblx0RXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xyXG5cdHRlbXBsYXRlOiAnc29ydGVpb3MvbGlzdGFzLnRwbCcsXHJcblxyXG5cdGV2ZW50czoge1xyXG5cdFx0J2NsaWNrIC5idG4tc29ydGVhci1wcm94aW1hLWxpc3RhJyA6ICdzb3J0ZWFyUHJveGltYUxpc3RhJyxcclxuXHRcdCdjbGljayAuYnRuLWFsdGVyYXItcXVhbnRpZGFkZScgICAgOiAnYWx0ZXJhclF1YW50aWRhZGVDYXNhcycsXHJcblx0XHQnY2xpY2sgLnRhYmxlLWxpc3RhcyAuY2xpY2thYmxlJyAgIDogJ3Nob3dMaXN0YScsXHJcblx0XHQna2V5dXAgLnR4dC1zZW1lbnRlJyAgICAgICAgICAgICAgIDogJ3N0b3JlU2VtZW50ZXMnXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gbmV3IExpc3RhcyhudWxsLCB7aWRTb3J0ZWlvOiB0aGlzLm1vZGVsLmdldCgnaWQnKX0pO1xyXG5cclxuXHRcdEV2ZW50cy5vbigncmVsb2FkX2NvbGxlY3Rpb25fbGlzdGFzJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoYXQuY29sbGVjdGlvbiA9IG5ldyBMaXN0YXMobnVsbCwge2lkU29ydGVpbzogdGhhdC5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHRcdFx0dGhhdC5yZW5kZXIoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0R3JpZGRlcigpO1xyXG5cdFx0dGhpcy50b2dnbGVCdG5Tb3J0ZWlvKCk7XHJcblx0XHR0aGlzLnRvZ2dsZUFsdGVyYWNhb1F1YW50aWRhZGVDYXNhcygpO1xyXG5cdFx0dGhpcy5zZXRTZW1lbnRlRmllbGRzKCk7XHJcblx0fSxcclxuXHJcblx0c2V0R3JpZGRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcGFydGlhbCA9IEhhbmRsZWJhcnMucGFydGlhbHNbJ3NvcnRlaW9zL19ncmlkZGVyTGlzdGFzLnRwbCddKHtsaXN0YXM6IHRoaXMuY29sbGVjdGlvbi50b0pTT04oKX0pO1xyXG5cdFx0dGhpcy4kKCcjZ3JpZGRlckxpc3RhcycpLmh0bWwoIHBhcnRpYWwgKTtcclxuXHR9LFxyXG5cclxuXHR0b2dnbGVCdG5Tb3J0ZWlvOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMuY29sbGVjdGlvbi53aGVyZSh7c29ydGVhZGE6IGZhbHNlfSkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR0aGlzLiQoJy5idG4tc29ydGVhci1wcm94aW1hLWxpc3RhJykuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLiQoJy5idG4tc29ydGVhci1wcm94aW1hLWxpc3RhJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0b2dnbGVBbHRlcmFjYW9RdWFudGlkYWRlQ2FzYXM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdGlmKHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPT09IDAgfHwgdGhpcy5jb2xsZWN0aW9uLndoZXJlKHtzb3J0ZWFkYTogdHJ1ZX0pLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGF0LiQoJy5idG4tYWx0ZXJhci1xdWFudGlkYWRlJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcclxuXHRcdFx0XHR0aGF0LiQoJy50eHQtcXVhbnRpZGFkZScpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcblx0XHRcdH0sIDUwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoYXQuJCgnLmJ0bi1hbHRlcmFyLXF1YW50aWRhZGUnKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRhbHRlcmFyUXVhbnRpZGFkZUNhc2FzOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgYXJyUXVhbnRpZGFkZXMgPSBbXSxcclxuXHRcdFx0dGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy4kKCcudHh0LXF1YW50aWRhZGUnKS5lYWNoKGZ1bmN0aW9uKGtleSwgZmllbGQpIHtcclxuXHRcdFx0YXJyUXVhbnRpZGFkZXMucHVzaCh7XHJcblx0XHRcdFx0aWQ6ICQoZmllbGQpLmRhdGEoJ2lkJyksXHJcblx0XHRcdFx0cXVhbnRpZGFkZTogcGFyc2VJbnQoJChmaWVsZCkudmFsKCksIDEwKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybSgnQWx0ZXJhciBhIHF1YW50aWRhZGUgZGUgY2FzYXM/JywgZnVuY3Rpb24ocmVzcG9zdGEpIHtcclxuXHRcdFx0aWYocmVzcG9zdGEpIHtcclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdFx0dXJsOiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS9zb3J0ZWlvLycgKyB0aGF0Lm1vZGVsLmdldCgnaWQnKSArICcvbGlzdGEvYWx0ZXJhclF1YW50aWRhZGVzJyxcclxuXHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHRcdGFzeW5jOiBmYWxzZSxcclxuXHRcdFx0XHRcdGNhY2hlOiBmYWxzZSxcclxuXHRcdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyclF1YW50aWRhZGVzKSxcclxuXHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1F1YW50aWRhZGUgZGUgY2FzYXMgYWx0ZXJhZGEgY29tIHN1Y2Vzc28hJywge3R5cGU6ICdzdWNjZXNzJ30pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdE11bHRpbW9kYWwubm90aWZ5KHJlcy5tZXNzYWdlLCB7dHlwZTogJ2Rhbmdlcid9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRzb3J0ZWFyUHJveGltYUxpc3RhOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgcHJveGltYUxpc3RhID0gXy5maXJzdCggdGhpcy5jb2xsZWN0aW9uLndoZXJlKHtzb3J0ZWFkYTogZmFsc2V9KSApLFxyXG5cdFx0XHRzZW1lbnRlID0gdGhpcy4kKCcudHh0LXNlbWVudGVbZGF0YS1pZD0nICsgcHJveGltYUxpc3RhLmdldCgnaWQnKSArICddJykudmFsKCksXHJcblx0XHRcdG1zZyA9ICcnLFxyXG5cdFx0XHR0aGF0ID0gdGhpcztcclxuXHJcblx0XHRpZihzZW1lbnRlKSB7XHJcblx0XHRcdG1zZyA9ICdTb3J0ZWFyIGxpc3RhIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBwcm94aW1hTGlzdGEuZ2V0KCdub21lJykgKyAnPC9zdHJvbmc+IHV0aWxpemFuZG8gYSBzZW1lbnRlIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBzZW1lbnRlICsgJzwvc3Ryb25nPiA/JztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1zZyA9ICdTb3J0ZWFyIGxpc3RhIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBwcm94aW1hTGlzdGEuZ2V0KCdub21lJykgKyAgJz8nO1xyXG5cdFx0fVxyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybShtc2csIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdGlmKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvc29ydGVpby8nICsgdGhhdC5tb2RlbC5nZXQoJ2lkJykgKyAnL3NvcnRlYXJQcm94aW1hTGlzdGE/c2VtZW50ZT0nICsgc2VtZW50ZSxcclxuXHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyKSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnRmVjaGFyIGEgamFuZWxhIGlyw6EgY2FuY2VsYXIgbyBzb3J0ZWlvLic7XHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHRoYXQuc2hvd1Byb2dyZXNzQmFyKCdTb3J0ZWlvIGVtIGFuZGFtZW50byEgUG9yIGZhdm9yIGFndWFyZGUuJyk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0eGhyRmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdG9ucHJvZ3Jlc3M6IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5wcm9ncmVzc1ZpZXcudXBkYXRlKGV2LmxvYWRlZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dGhhdC5wcm9ncmVzc1ZpZXcuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1NvcnRlaW8gcmVhbGl6YWRvIGNvbSBzdWNlc3NvIScsIHt0eXBlOiAnc3VjY2Vzcyd9KTtcclxuXHRcdFx0XHRcdEV2ZW50cy50cmlnZ2VyKCdyZWxvYWRfY29sbGVjdGlvbl9saXN0YXMnKTtcclxuXHRcdFx0XHRcdEV2ZW50cy50cmlnZ2VyKCdyZWxvYWRfY29sbGVjdGlvbl9zb3J0ZWlvcycpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ2hpZGVfdXBsb2FkX2NvbnRyb2xzJyk7XHJcblx0XHRcdFx0XHR0aGF0LnNob3dMaXN0YVNvcnRlYWRhKHByb3hpbWFMaXN0YSk7XHJcblx0XHRcdFx0XHR3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBudWxsO1xyXG5cdFx0XHRcdH0pLmVycm9yKGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ09jb3JyZXUgdW0gZXJybyBuYSBleGVjdcOnw6NvIGRvIHNvcnRlaW8hJywge3R5cGU6ICdkYW5nZXInfSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHNob3dQcm9ncmVzc0JhcjogZnVuY3Rpb24obWVzc2FnZSkge1xyXG5cdFx0dGhpcy5wcm9ncmVzc1ZpZXcgPSBuZXcgUHJvZ3Jlc3NCYXJWaWV3KHttZXNzYWdlOiBtZXNzYWdlfSk7XHJcblxyXG5cdFx0TXVsdGltb2RhbC5zaG93KHRoaXMucHJvZ3Jlc3NWaWV3LCAnbW9kYWxQcm9ncmVzcycpO1xyXG5cdH0sXHJcblxyXG5cdHNob3dMaXN0YVNvcnRlYWRhOiBmdW5jdGlvbihsaXN0YSkge1xyXG5cdFx0dGhpcy4kKCcudGFibGUtbGlzdGFzJykuZmluZCgndHIjJyArIGxpc3RhLmdldCgnaWQnKSkuZmluZCgndGQ6Zmlyc3QnKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cdH0sXHJcblxyXG5cdHNob3dMaXN0YTogZnVuY3Rpb24oZXYpIHtcclxuXHRcdHRoaXMuY29sbGVjdGlvbiA9IG5ldyBMaXN0YXMobnVsbCwge2lkU29ydGVpbzogdGhpcy5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHJcblx0XHR2YXIgbGlzdGEgPSB0aGlzLmNvbGxlY3Rpb24uZ2V0KHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJykpO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuc2hvdyhuZXcgTGlzdGFWaWV3KHttb2RlbDogbGlzdGF9KSwgJ21vZGFsTGlzdGEnKTtcclxuXHR9LFxyXG5cclxuXHRzdG9yZVNlbWVudGVzOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIGZpZWxkID0gdGhpcy4kKGV2LmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndHh0LXNlbWVudGUtJyArIGZpZWxkLmRhdGEoJ2lkJyksIGZpZWxkLnZhbCgpKTtcclxuXHR9LFxyXG5cclxuXHRzZXRTZW1lbnRlRmllbGRzOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dGhpcy4kKCcudHh0LXNlbWVudGUnKS5lYWNoKGZ1bmN0aW9uKGtleSwgZmllbGQpIHtcclxuXHRcdFx0dmFyIHNlbWVudGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd0eHQtc2VtZW50ZS0nICsgdGhhdC4kKGZpZWxkKS5kYXRhKCdpZCcpKTtcclxuXHRcdFx0dGhhdC4kKGZpZWxkKS52YWwoc2VtZW50ZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0pOyIsInZhciBNYXJpb25ldHRlID0gcmVxdWlyZSgnbWFyaW9uZXR0ZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XHJcblx0dGVtcGxhdGU6ICdzb3J0ZWlvcy9wcm9ncmVzc19iYXIudHBsJyxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0dGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xyXG5cdFx0dGhpcy5vbGRNb2RhbEVzY2FwZSA9ICQuZm4ubW9kYWwuQ29uc3RydWN0b3IucHJvdG90eXBlLmVzY2FwZTtcclxuXHRcdCQuZm4ubW9kYWwuQ29uc3RydWN0b3IucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cdH0sXHJcblx0b25SZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy4kKCcjbWVzc2FnZScpLmh0bWwodGhpcy5tZXNzYWdlKTtcclxuXHR9LFxyXG5cdG9uRGVzdHJveTogZnVuY3Rpb24oKSB7XHJcblx0XHQkLmZuLm1vZGFsLkNvbnN0cnVjdG9yLnByb3RvdHlwZS5lc2NhcGUgPSB0aGlzLm9sZE1vZGFsRXNjYXBlO1xyXG5cdH0sXHJcblx0b25SZW1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ3JlbW92ZWQnKTtcclxuXHR9LFxyXG5cdHVwZGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHRoaXMuJCgnLnByb2dyZXNzLWJhcicpLmNzcygnd2lkdGgnLCB2YWx1ZSArICclJykuaHRtbCh2YWx1ZSArICclJyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgTWFyaW9uZXR0ZSA9IHJlcXVpcmUoJ21hcmlvbmV0dGUnKSxcclxuXHRTb3J0ZWlvVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL2luc2VyaXJfYXR1YWxpemFyJyksXHJcblx0Q2FuZGlkYXRvc1ZpZXcgPSByZXF1aXJlKCd2aWV3cy9zb3J0ZWlvcy9jYW5kaWRhdG9zJyksXHJcblx0TGlzdGFzVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL2xpc3RhcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ3NvcnRlaW9zL3NvcnRlaW8udHBsJyxcclxuXHJcblx0ZXZlbnRzOiB7XHJcblx0XHQnc3VibWl0IGZvcm0nICAgICAgIDogZnVuY3Rpb24oZXYpIHsgdGhpcy5kZXRhbGhlcy5jdXJyZW50Vmlldy5zYWx2YXIoZXYpOyB9LFxyXG5cdFx0J2NsaWNrIC5uYXYtdGFicyBhJyA6ICdzZXRBY3RpdmVGb3JtJ1xyXG5cdH0sXHJcblxyXG5cdHJlZ2lvbnM6IHtcclxuXHRcdGRldGFsaGVzIDogJy5tb2RhbC1ib2R5J1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHRpZih0aGlzLm1vZGVsLmdldCgnaWQnKSkge1xyXG5cdFx0XHR0aGlzLmFkZFJlZ2lvbignZGV0YWxoZXMnLCAnI2RldGFsaGVzJyk7XHJcblx0XHRcdHRoaXMuYWRkUmVnaW9uKCdjYW5kaWRhdG9zJywgJyNjYW5kaWRhdG9zJyk7XHJcblx0XHRcdHRoaXMuYWRkUmVnaW9uKCdsaXN0YXMnLCAnI2xpc3RhcycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0Vmlld3MoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRWaWV3czogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRldGFsaGVzLnNob3cobmV3IFNvcnRlaW9WaWV3KHttb2RlbDogdGhpcy5tb2RlbH0pKTtcclxuXHJcblx0XHRpZih0aGlzLm1vZGVsLmdldCgnaWQnKSkge1xyXG5cdFx0XHR0aGlzLmxpc3Rhcy5zaG93KG5ldyBMaXN0YXNWaWV3KHttb2RlbDogdGhpcy5tb2RlbH0pKTtcclxuXHRcdFx0dGhpcy5jYW5kaWRhdG9zLnNob3cobmV3IENhbmRpZGF0b3NWaWV3KHttb2RlbDogdGhpcy5tb2RlbCwgcGFyZW50VmlldzogdGhpc30pKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzZXRBY3RpdmVGb3JtOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIHRhYiA9IHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XHJcblxyXG5cdFx0aWYodGFiID09PSAnI2RldGFsaGVzJykge1xyXG5cdFx0XHR0aGlzLiQoJy5tb2RhbC1mb290ZXInKS5odG1sKCc8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLXN1Y2Nlc3NcIj5TYWx2YXI8L2J1dHRvbj4nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuJCgnLm1vZGFsLWZvb3RlcicpLmVtcHR5KCk7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2Rpc3BhdGNoZXInKSxcblx0XyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGJlZm9yZTogZnVuY3Rpb24oKSB7fSxcblx0YmVmb3JlU3BlY2lhbDogZnVuY3Rpb24oKSB7fSxcblx0YWZ0ZXJTcGVjaWFsOiBmdW5jdGlvbigpIHt9LFxuXHRhZnRlcjogZnVuY3Rpb24oKSB7fSxcblx0X2Fib3J0ZWQ6IGZhbHNlLFxuXHRhYm9ydDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYWJvcnRlZCA9IHRydWU7XG5cdH0sXG5cdGV4ZWN1dGU6IGZ1bmN0aW9uKG1ldGhvZCwgYXJncywgc3BlY2lhbCkge1xuXG5cdFx0aWYoc3BlY2lhbCAhPT0gbnVsbCkge1xuXHRcdFx0aWYoc3BlY2lhbCkge1xuXHRcdFx0XHR0aGlzLmJlZm9yZVNwZWNpYWwobWV0aG9kLCBsb2NhdGlvbi5oYXNoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuYmVmb3JlKG1ldGhvZCwgbG9jYXRpb24uaGFzaCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoIXRoaXMuX2Fib3J0ZWQpIHtcblx0XHRcdHRoaXNbbWV0aG9kXS5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdGlmKHNwZWNpYWwgIT09IG51bGwpIHtcblx0XHRcdFx0aWYoc3BlY2lhbCkge1xuXHRcdFx0XHRcdHRoaXMuYWZ0ZXJTcGVjaWFsKG1ldGhvZCwgbG9jYXRpb24uaGFzaCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5hZnRlcihtZXRob2QsIGxvY2F0aW9uLmhhc2gpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJWaWV3OiBmdW5jdGlvbihyZWdpb24sIHZpZXcsIHZpZXdPcHRpb25zKSB7XG5cdFx0dmFyIHZpZXdQYXRoID0gJ3ZpZXdzLycgKyB2aWV3O1xuXHRcdERpc3BhdGNoZXIucmVuZGVyVmlldyhyZWdpb24sIHZpZXdQYXRoLCB2aWV3T3B0aW9ucyk7XG5cdH0sXG5cdGV4dGVuZDogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHZhciBhdHRycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gYXR0cnM7XG5cdH1cbn07IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcblx0XyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblx0Um91dGVyID0gcmVxdWlyZSgncm91dGVyJyksXG5cdENvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuXG5leHBvcnRzLnJlZ2lzdGVyUm91dGVzID0gZnVuY3Rpb24oKSB7XG5cdHZhciByb3V0ZXNBcnIgPSBbXSxcblx0XHRzcGVjaWFsID0gZmFsc2U7XG5cblx0Xy5lYWNoKENvbmZpZy5yb3V0ZXMsIGZ1bmN0aW9uKGFjdGlvbiwgcm91dGUpIHtcblxuXHRcdGlmKF8uY29udGFpbnMocm91dGUsICdAJykpIHtcblx0XHRcdHNwZWNpYWwgPSB0cnVlO1xuXHRcdFx0cm91dGUgPSBfLnJlc3Qocm91dGUpLmpvaW4oJycpO1xuXHRcdH0gZWxzZSBpZihfLmNvbnRhaW5zKHJvdXRlLCAnKicpKSB7XG5cdFx0XHRzcGVjaWFsID0gbnVsbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3BlY2lhbCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHJvdXRlc0Fyci5wdXNoKHtcblx0XHRcdHJvdXRlICAgICAgOiByb3V0ZSxcblx0XHRcdGNvbnRyb2xsZXIgOiBhY3Rpb24uc3BsaXQoJyMnKVswXSxcblx0XHRcdG1ldGhvZCAgICAgOiBhY3Rpb24uc3BsaXQoJyMnKVsxXSxcblx0XHRcdHNwZWNpYWwgICAgOiBzcGVjaWFsXG5cdFx0fSk7XG5cdH0pO1xuXG5cdG5ldyBSb3V0ZXIocm91dGVzQXJyKTtcblx0QmFja2JvbmUuaGlzdG9yeS5zdGFydCgpO1xufTtcblxuZXhwb3J0cy5yZW5kZXJWaWV3ID0gZnVuY3Rpb24ocmVnaW9uLCB2aWV3LCBvcHRpb25zKSB7XG5cdHZhciBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoJ2FwcGxpY2F0aW9uJyksXG5cdFx0VmlldyA9IHJlcXVpcmUodmlldyk7XG5cblx0QXBwbGljYXRpb25bcmVnaW9uXS5zaG93KG5ldyBWaWV3KG9wdGlvbnMpKTtcbn07IiwidmFyIEluaXRpYWxpemVyID0gcmVxdWlyZSgnaW5pdGlhbGl6ZXInKSxcblx0RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2Rpc3BhdGNoZXInKSxcblx0QXBwbGljYXRpb24gPSByZXF1aXJlKCdhcHBsaWNhdGlvbicpO1xuXG4vLyBFeGVjdXRhIGFzIHJvdGluYXMgY29udGlkYXMgbm8gYXJxdWl2byBhcHBsaWNhdGlvbi9pbml0aWFsaXplci5qc1xuSW5pdGlhbGl6ZXIoKTtcblxuLy8gUmVnaXN0cmEgYXMgcm90YXMgZGEgYXBsaWNhw6fDo29cbkRpc3BhdGNoZXIucmVnaXN0ZXJSb3V0ZXMoKTtcblxuLy8gSW5pY2lhIGEgYXBsaWNhw6fDo29cbkFwcGxpY2F0aW9uLnN0YXJ0KCk7XG4iLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxuXHRfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihyb3V0ZXMpIHtcblx0XHR2YXIgcm91dGVyID0gdGhpcztcblxuXHRcdF8uZWFjaChyb3V0ZXMsIGZ1bmN0aW9uKHIpIHtcblx0XHRcdHZhciByb3V0ZSA9IHIucm91dGUsXG5cdFx0XHRcdGNvbnRyb2xsZXIgPSByZXF1aXJlKCdjb250cm9sbGVycy8nICsgci5jb250cm9sbGVyKSxcblx0XHRcdFx0bWV0aG9kID0gci5tZXRob2QsXG5cdFx0XHRcdHNwZWNpYWwgPSByLnNwZWNpYWw7XG5cblx0XHRcdHJvdXRlci5yb3V0ZShyb3V0ZSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBhcmdzID0gXy5pbml0aWFsKGFyZ3VtZW50cyk7XG5cblx0XHRcdFx0aWYoIV8uY29udGFpbnMoQ29uZmlnLkJMQUNLTElTVF9ST1VURVMsIHJvdXRlKSkge1xuXHRcdFx0XHRcdHdpbmRvdy5sYXN0Um91dGUgPSBCYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29udHJvbGxlci5leGVjdXRlKG1ldGhvZCwgYXJncywgc3BlY2lhbCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufSk7IiwiLy8gUmVhbGl6YSB1bSByZXF1ZXN0IHBhcmEgcGVnYXIgYXMgY29uZmlndXJhw6fDtWVzIGRvIGFycXVpdm8gY29uZmlnLmpzb25cbi8vIGUgZXhwb3J0YSBjb21vIHVtIG3Ds2R1bG8gcGFyYSBzZXIgY29uc3VtaWRvIHBlbGEgYXBsaWNhw6fDo28uXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuXHRcdGNvbmZpZ0pzb24gPSBudWxsO1xuXG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnY29uZmlnLmpzb24nLFxuXHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdGFzeW5jOiBmYWxzZSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0Y29uZmlnSnNvbiA9IHJlc3BvbnNlO1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIGNvbmZpZ0pzb247XG59KSgpOyIsbnVsbF19
