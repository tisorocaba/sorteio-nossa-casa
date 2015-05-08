require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"application":[function(require,module,exports){
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
},{"config":undefined,"handlebars.runtime":"handlebars.runtime","handlebars_helpers":undefined,"marionette":"marionette","templates":"templates"}],"base_controller":[function(require,module,exports){
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
},{"dispatcher":undefined,"underscore":"underscore"}],"collections/candidatos":[function(require,module,exports){
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
},{"config":undefined,"paginator":"paginator"}],"collections/listas":[function(require,module,exports){
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
},{"backbone":"backbone","config":undefined}],"collections/sorteios":[function(require,module,exports){
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
},{"backbone":"backbone","config":undefined,"models/sorteio":undefined}],"config":[function(require,module,exports){
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
},{"jquery":"jquery"}],"controllers/application":[function(require,module,exports){
var AuthController = require('controllers/auth');

module.exports = AuthController.extend({

	pagina404: function() {
		// view menu renderizada explicitamente pois rotas 404 não executam filtros!
		this.renderView('menu', 'menu');
		this.renderView('main', 'pagina404');
	}
});
},{"controllers/auth":undefined}],"controllers/auth":[function(require,module,exports){
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
},{"application":undefined,"auth":"auth","backbone":"backbone","base_controller":undefined,"multimodal":"multimodal","utils":undefined}],"controllers/sorteios":[function(require,module,exports){
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
},{"controllers/application":undefined,"controllers/auth":undefined,"models/sorteio":undefined,"multimodal":"multimodal","utils":undefined,"views/sorteios/sorteio":undefined}],"dispatcher":[function(require,module,exports){
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
},{"application":undefined,"backbone":"backbone","config":undefined,"router":undefined,"underscore":"underscore"}],"events":[function(require,module,exports){
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
},{"backbone":"backbone"}],"handlebars_helpers":[function(require,module,exports){
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

Handlebars.registerHelper('log', function(value) {
	console.log(value);
});
},{"auth":"auth","config":undefined,"handlebars.runtime":"handlebars.runtime","moment":"moment"}],"initializer":[function(require,module,exports){
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
},{"application":undefined,"auth":"auth","backbone":"backbone","config":undefined,"events":undefined,"jquery":"jquery","multimodal":"multimodal","underscore":"underscore"}],"main":[function(require,module,exports){
var Initializer = require('initializer'),
	Dispatcher = require('dispatcher'),
	Application = require('application');

// Executa as rotinas contidas no arquivo application/initializer.js
Initializer();

// Registra as rotas da aplicação
Dispatcher.registerRoutes();

// Inicia a aplicação
Application.start();
},{"application":undefined,"dispatcher":undefined,"initializer":undefined}],"models/sorteio":[function(require,module,exports){
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

		if(attrs.empreendimentos.length === 0) {
			errors.push({
				element: '.empreendimento:first',
				message: 'Ao menos um empreendimento precisa ser informado'
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
},{"backbone":"backbone","config":undefined}],"router":[function(require,module,exports){
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
},{"backbone":"backbone","config":undefined,"underscore":"underscore"}],"utils":[function(require,module,exports){
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

},{"auth":"auth","backbone":"backbone","jquery":"jquery"}],"views/base_view":[function(require,module,exports){
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
},{"marionette":"marionette"}],"views/menu":[function(require,module,exports){
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
},{"auth":"auth","marionette":"marionette","utils":undefined}],"views/pagina404":[function(require,module,exports){
var Marionette = require('marionette');

module.exports = Marionette.ItemView.extend({
	template: 'pagina404.tpl'
});
},{"marionette":"marionette"}],"views/sorteios/candidatos":[function(require,module,exports){
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
},{"collections/candidatos":undefined,"config":undefined,"events":undefined,"handlebars.runtime":"handlebars.runtime","marionette":"marionette","multimodal":"multimodal","paginator":"paginator","searcher":"searcher","views/sorteios/progressBar":undefined}],"views/sorteios/inserir_atualizar":[function(require,module,exports){
var BaseView = require('views/base_view'),
	Backbone = require('backbone'),
	Events = require('events'),
	Multimodal = require('multimodal'),
	Moment = require('moment');

module.exports = BaseView.extend({
	template: 'sorteios/inserir_atualizar.tpl',

	populateModel: function() {
		var data = Moment(this.$('#data').val()).isValid() ? Moment(this.$('#data').val()).format('DD/MM/YYYY') : '',
			empreendimentos = [];

		this.model.set('data', data);
		this.model.set('observacao', this.$('#observacao').val());

		this.$('.empreendimento').each(function() {
			if($(this).val()) {
				empreendimentos.push({
					nome: $(this).val()
				})
			}
		});

		this.model.set('empreendimentos', empreendimentos);
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
},{"backbone":"backbone","events":undefined,"moment":"moment","multimodal":"multimodal","views/base_view":undefined}],"views/sorteios/listar":[function(require,module,exports){
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
},{"backbone":"backbone","collections/sorteios":undefined,"events":undefined,"handlebars.runtime":"handlebars.runtime","marionette":"marionette","multimodal":"multimodal"}],"views/sorteios/listas":[function(require,module,exports){
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
},{"collections/listas":undefined,"config":undefined,"events":undefined,"handlebars.runtime":"handlebars.runtime","marionette":"marionette","multimodal":"multimodal","underscore":"underscore","views/sorteios/lista":undefined,"views/sorteios/progressBar":undefined}],"views/sorteios/lista":[function(require,module,exports){
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
},{"collections/candidatos":undefined,"config":undefined,"handlebars.runtime":"handlebars.runtime","marionette":"marionette","multimodal":"multimodal","paginator":"paginator"}],"views/sorteios/progressBar":[function(require,module,exports){
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
},{"marionette":"marionette"}],"views/sorteios/sorteio":[function(require,module,exports){
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
},{"marionette":"marionette","views/sorteios/candidatos":undefined,"views/sorteios/inserir_atualizar":undefined,"views/sorteios/listas":undefined}]},{},["main"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYXBwbGljYXRpb25cXGFwcGxpY2F0aW9uLmpzIiwiYmFzZVxcYmFzZV9jb250cm9sbGVyLmpzIiwiYXBwbGljYXRpb25cXGNvbGxlY3Rpb25zXFxjYW5kaWRhdG9zLmpzIiwiYXBwbGljYXRpb25cXGNvbGxlY3Rpb25zXFxsaXN0YXMuanMiLCJhcHBsaWNhdGlvblxcY29sbGVjdGlvbnNcXHNvcnRlaW9zLmpzIiwiY29uZmlnLmpzIiwiYXBwbGljYXRpb25cXGNvbnRyb2xsZXJzXFxhcHBsaWNhdGlvbi5qcyIsImFwcGxpY2F0aW9uXFxjb250cm9sbGVyc1xcYXV0aC5qcyIsImFwcGxpY2F0aW9uXFxjb250cm9sbGVyc1xcc29ydGVpb3MuanMiLCJiYXNlXFxkaXNwYXRjaGVyLmpzIiwiYXBwbGljYXRpb25cXGV2ZW50cy5qcyIsImFwcGxpY2F0aW9uXFxoYW5kbGViYXJzX2hlbHBlcnMuanMiLCJhcHBsaWNhdGlvblxcaW5pdGlhbGl6ZXIuanMiLCJiYXNlXFxtYWluLmpzIiwiYXBwbGljYXRpb25cXG1vZGVsc1xcc29ydGVpby5qcyIsImJhc2VcXHJvdXRlci5qcyIsImFwcGxpY2F0aW9uXFx1dGlscy5qcyIsImFwcGxpY2F0aW9uXFx2aWV3c1xcYmFzZV92aWV3LmpzIiwiYXBwbGljYXRpb25cXHZpZXdzXFxtZW51LmpzIiwiYXBwbGljYXRpb25cXHZpZXdzXFxwYWdpbmE0MDQuanMiLCJhcHBsaWNhdGlvblxcdmlld3NcXHNvcnRlaW9zXFxjYW5kaWRhdG9zLmpzIiwiYXBwbGljYXRpb25cXHZpZXdzXFxzb3J0ZWlvc1xcaW5zZXJpcl9hdHVhbGl6YXIuanMiLCJhcHBsaWNhdGlvblxcdmlld3NcXHNvcnRlaW9zXFxsaXN0YXIuanMiLCJhcHBsaWNhdGlvblxcdmlld3NcXHNvcnRlaW9zXFxsaXN0YXMuanMiLCJhcHBsaWNhdGlvblxcdmlld3NcXHNvcnRlaW9zXFxsaXN0YS5qcyIsImFwcGxpY2F0aW9uXFx2aWV3c1xcc29ydGVpb3NcXHByb2dyZXNzQmFyLmpzIiwiYXBwbGljYXRpb25cXHZpZXdzXFxzb3J0ZWlvc1xcc29ydGVpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyksXHJcblx0SGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J10sXHJcblx0VGVtcGxhdGVzID0gcmVxdWlyZSgndGVtcGxhdGVzJykoSGFuZGxlYmFycyksXHJcblx0Q29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyksXHJcblx0SGFuZGxlYmFyc19IZWxwZXJzID0gcmVxdWlyZSgnaGFuZGxlYmFyc19oZWxwZXJzJyksXHJcblx0QXBwbGljYXRpb24gPSBuZXcgTWFyaW9uZXR0ZS5BcHBsaWNhdGlvbigpO1xyXG5cclxuTWFyaW9uZXR0ZS5SZW5kZXJlci5yZW5kZXIgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgZGF0YSkge1xyXG5cdGlmKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0cmV0dXJuIHRlbXBsYXRlKGRhdGEpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gVGVtcGxhdGVzW3RlbXBsYXRlXShkYXRhKTtcclxuXHR9XHJcbn07XHJcblxyXG5BcHBsaWNhdGlvbi5hZGRSZWdpb25zKENvbmZpZy5yZWdpb25zKTtcclxuXHJcbi8vIEPDs2RpZ28gYSBzZXIgZXhlY3V0YWRvIG5hIGluaWNpYWxpemHDp8OjbyBkYSBhcGxpY2HDp8Ojby5cclxuQXBwbGljYXRpb24uYWRkSW5pdGlhbGl6ZXIoZnVuY3Rpb24oKSB7fSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uOyIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZGlzcGF0Y2hlcicpLFxyXG5cdF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRiZWZvcmU6IGZ1bmN0aW9uKCkge30sXHJcblx0YmVmb3JlU3BlY2lhbDogZnVuY3Rpb24oKSB7fSxcclxuXHRhZnRlclNwZWNpYWw6IGZ1bmN0aW9uKCkge30sXHJcblx0YWZ0ZXI6IGZ1bmN0aW9uKCkge30sXHJcblx0X2Fib3J0ZWQ6IGZhbHNlLFxyXG5cdGFib3J0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuX2Fib3J0ZWQgPSB0cnVlO1xyXG5cdH0sXHJcblx0ZXhlY3V0ZTogZnVuY3Rpb24obWV0aG9kLCBhcmdzLCBzcGVjaWFsKSB7XHJcblxyXG5cdFx0aWYoc3BlY2lhbCAhPT0gbnVsbCkge1xyXG5cdFx0XHRpZihzcGVjaWFsKSB7XHJcblx0XHRcdFx0dGhpcy5iZWZvcmVTcGVjaWFsKG1ldGhvZCwgbG9jYXRpb24uaGFzaCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5iZWZvcmUobWV0aG9kLCBsb2NhdGlvbi5oYXNoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCF0aGlzLl9hYm9ydGVkKSB7XHJcblx0XHRcdHRoaXNbbWV0aG9kXS5hcHBseSh0aGlzLCBhcmdzKTtcclxuXHRcdFx0aWYoc3BlY2lhbCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmKHNwZWNpYWwpIHtcclxuXHRcdFx0XHRcdHRoaXMuYWZ0ZXJTcGVjaWFsKG1ldGhvZCwgbG9jYXRpb24uaGFzaCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuYWZ0ZXIobWV0aG9kLCBsb2NhdGlvbi5oYXNoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlbmRlclZpZXc6IGZ1bmN0aW9uKHJlZ2lvbiwgdmlldywgdmlld09wdGlvbnMpIHtcclxuXHRcdHZhciB2aWV3UGF0aCA9ICd2aWV3cy8nICsgdmlldztcclxuXHRcdERpc3BhdGNoZXIucmVuZGVyVmlldyhyZWdpb24sIHZpZXdQYXRoLCB2aWV3T3B0aW9ucyk7XHJcblx0fSxcclxuXHRleHRlbmQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdHZhciBhdHRycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLCBvcHRpb25zKTtcclxuXHRcdHJldHVybiBhdHRycztcclxuXHR9XHJcbn07IiwidmFyIFBhZ2VkQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ3BhZ2luYXRvcicpLnBhZ2VkQ29sbGVjdGlvbixcclxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFnZWRDb2xsZWN0aW9uLmV4dGVuZCh7XHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xyXG5cdFx0aWYob3B0aW9ucy5pZFNvcnRlaW8pIHtcclxuXHRcdFx0dGhpcy51cmwgPSBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS9zb3J0ZWlvLycgKyBvcHRpb25zLmlkU29ydGVpbyArICcvY2FuZGlkYXRvJztcclxuXHRcdH1cclxuXHJcblx0XHRpZihvcHRpb25zLmlkTGlzdGEpIHtcclxuXHRcdFx0dGhpcy51cmwgPSBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS9zb3J0ZWlvL2xpc3RhLycgKyBvcHRpb25zLmlkTGlzdGEgKyAnL2NhbmRpZGF0byc7XHJcblx0XHR9XHJcblxyXG5cdFx0UGFnZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxyXG5cdENvbmZpZz0gcmVxdWlyZSgnY29uZmlnJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XHJcblx0XHR0aGlzLnVybCA9IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3NvcnRlaW8vJyArIG9wdGlvbnMuaWRTb3J0ZWlvICsgJy9saXN0YSc7XHJcblx0XHR0aGlzLmZldGNoKHthc3luYzogZmFsc2V9KTtcclxuXHR9LFxyXG5cclxuXHRwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRyZXR1cm4gcmVzLmRhdGE7XHJcblx0fVxyXG59KTsiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxyXG5cdFNvcnRlaW8gPSByZXF1aXJlKCdtb2RlbHMvc29ydGVpbycpLFxyXG5cdENvbmZpZz0gcmVxdWlyZSgnY29uZmlnJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcclxuXHRtb2RlbDogU29ydGVpbyxcclxuXHR1cmw6IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3NvcnRlaW8nLFxyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZmV0Y2goe2FzeW5jOiBmYWxzZX0pO1xyXG5cdH0sXHJcblxyXG5cdGNvbXBhcmF0b3I6IGZ1bmN0aW9uKG1vZGVsQSwgbW9kZWxCKSB7XHJcblx0XHR2YXIgZGF0YUEgPSBtb2RlbEEuZ2V0KCdkYXRhJykuc3BsaXQoJy8nKTtcclxuXHRcdHZhciBkYXRhQiA9IG1vZGVsQi5nZXQoJ2RhdGEnKS5zcGxpdCgnLycpO1xyXG5cclxuXHRcdGRhdGFBID0gbmV3IERhdGUoZGF0YUFbMl0sIGRhdGFBWzFdIC0gMSwgZGF0YUFbMF0pO1xyXG5cdFx0ZGF0YUIgPSBuZXcgRGF0ZShkYXRhQlsyXSwgZGF0YUJbMV0gLSAxLCBkYXRhQlswXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFBID4gZGF0YUIgPyAtMSA6IGRhdGFBIDwgZGF0YUIgPyAxIDogMDtcclxuXHR9LFxyXG5cclxuXHRwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRyZXR1cm4gcmVzLmRhdGE7XHJcblx0fVxyXG59KTsiLCIvLyBSZWFsaXphIHVtIHJlcXVlc3QgcGFyYSBwZWdhciBhcyBjb25maWd1cmHDp8O1ZXMgZG8gYXJxdWl2byBjb25maWcuanNvblxyXG4vLyBlIGV4cG9ydGEgY29tbyB1bSBtw7NkdWxvIHBhcmEgc2VyIGNvbnN1bWlkbyBwZWxhIGFwbGljYcOnw6NvLlxyXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuXHRcdGNvbmZpZ0pzb24gPSBudWxsO1xyXG5cclxuXHQkLmFqYXgoe1xyXG5cdFx0dXJsOiAnY29uZmlnLmpzb24nLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdGNhY2hlOiBmYWxzZSxcclxuXHRcdGFzeW5jOiBmYWxzZSxcclxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGNvbmZpZ0pzb24gPSByZXNwb25zZTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIGNvbmZpZ0pzb247XHJcbn0pKCk7IiwidmFyIEF1dGhDb250cm9sbGVyID0gcmVxdWlyZSgnY29udHJvbGxlcnMvYXV0aCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoQ29udHJvbGxlci5leHRlbmQoe1xyXG5cclxuXHRwYWdpbmE0MDQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gdmlldyBtZW51IHJlbmRlcml6YWRhIGV4cGxpY2l0YW1lbnRlIHBvaXMgcm90YXMgNDA0IG7Do28gZXhlY3V0YW0gZmlsdHJvcyFcclxuXHRcdHRoaXMucmVuZGVyVmlldygnbWVudScsICdtZW51Jyk7XHJcblx0XHR0aGlzLnJlbmRlclZpZXcoJ21haW4nLCAncGFnaW5hNDA0Jyk7XHJcblx0fVxyXG59KTsiLCJ2YXJcdEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRCYXNlQ29udHJvbGxlciA9IHJlcXVpcmUoJ2Jhc2VfY29udHJvbGxlcicpLFxyXG5cdEFwcGxpY2F0aW9uID0gcmVxdWlyZSgnYXBwbGljYXRpb24nKSxcclxuXHRVdGlscyA9IHJlcXVpcmUoJ3V0aWxzJyksXHJcblx0QXV0aCA9IHJlcXVpcmUoJ2F1dGgnKSxcclxuXHRNdWx0aW1vZGFsID0gcmVxdWlyZSgnbXVsdGltb2RhbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29udHJvbGxlci5leHRlbmQoe1xyXG5cclxuXHRiZWZvcmU6IGZ1bmN0aW9uKG1ldGhvZCwgcm91dGUpIHtcclxuXHRcdHRoaXMucmVuZGVyVmlldygnbWVudScsICdtZW51Jyk7XHJcblxyXG5cdFx0aWYobWV0aG9kICE9PSAnbG9naW4nKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0QXV0aC5pc0xvZ2dlZCgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0aWYoIXJlcy5zdGF0dXMpIHtcclxuXHRcdFx0XHRcdEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoJ2xvZ2luJywgdHJ1ZSk7XHJcblx0XHRcdFx0XHR0aGF0LmFib3J0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRsb2dpbjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbG9naW5WaWV3ID0gbmV3IEF1dGgubG9naW5WaWV3KHtcclxuXHRcdFx0Y2FsbGJhY2tkb0xvZ2luT0s6IGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdGlmKHJlcy5zdGF0dXMpIHtcclxuXHRcdFx0XHRcdFV0aWxzLmdvVG9MYXN0Um91dGUoKTtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdEF1dGguaXNMb2dnZWQoKS5zdWNjZXNzKGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRpZighcmVzLnN0YXR1cykge1xyXG5cdFx0XHRcdEFwcGxpY2F0aW9uLm1haW4uc2hvdyhsb2dpblZpZXcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFV0aWxzLmdvVG9MYXN0Um91dGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0bG9nb3V0OiBmdW5jdGlvbigpIHtcclxuXHRcdE11bHRpbW9kYWwuY29uZmlybSgnRGVzZWphIHJlYWxtZW50ZSBzYWlyIGRvIHNpc3RlbWE/JywgZnVuY3Rpb24ocmVzcG9zdGEpIHtcclxuXHRcdFx0aWYocmVzcG9zdGEpIHtcclxuXHRcdFx0XHRBdXRoLmxvZ291dCgpLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCdsb2dpbicsIHRydWUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFV0aWxzLmdvVG9MYXN0Um91dGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59KTsiLCJ2YXIgQXV0aENvbnRyb2xsZXIgPSByZXF1aXJlKCdjb250cm9sbGVycy9hdXRoJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRVdGlscyA9IHJlcXVpcmUoJ3V0aWxzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhDb250cm9sbGVyLmV4dGVuZCh7XHJcblxyXG5cdGxpc3RhcjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnJlbmRlclZpZXcoJ21haW4nLCAnc29ydGVpb3MvbGlzdGFyJyk7XHJcblx0fSxcclxuXHJcblx0aW5zZXJpcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc29ydGVpbyA9IG5ldyAocmVxdWlyZSgnbW9kZWxzL3NvcnRlaW8nKSk7XHJcblxyXG5cdFx0TXVsdGltb2RhbC5zaG93KG5ldyAocmVxdWlyZSgndmlld3Mvc29ydGVpb3Mvc29ydGVpbycpKSh7bW9kZWw6IHNvcnRlaW99KSwgJ21vZGFsU29ydGVpbycpO1xyXG5cdFx0VXRpbHMuZ29Ub0xhc3RSb3V0ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGRldGFsaGFyOiBmdW5jdGlvbihpZCkge1xyXG5cdFx0dmFyIHNvcnRlaW8gPSBuZXcgKHJlcXVpcmUoJ21vZGVscy9zb3J0ZWlvJykpKHtpZDogaWR9KTtcclxuXHJcblx0XHRzb3J0ZWlvLmZldGNoKCkuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0TXVsdGltb2RhbC5zaG93KG5ldyAocmVxdWlyZSgndmlld3Mvc29ydGVpb3Mvc29ydGVpbycpKSh7bW9kZWw6IHNvcnRlaW99KSwgJ21vZGFsU29ydGVpbycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0VXRpbHMuZ29Ub0xhc3RSb3V0ZSgpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Y2FsbEFjdGlvbjogZnVuY3Rpb24ocGFyYW0pIHtcclxuXHRcdGlmKGlzTmFOKHBhcnNlSW50KHBhcmFtLCAxMCkpKSB7XHJcblx0XHRcdGlmKHBhcmFtID09PSAnaW5zZXJpcicpIHtcclxuXHRcdFx0XHR0aGlzLmluc2VyaXIoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXF1aXJlKCdjb250cm9sbGVycy9hcHBsaWNhdGlvbicpLnBhZ2luYTQwNCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmRldGFsaGFyKHBhcmFtKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0XyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcclxuXHRSb3V0ZXIgPSByZXF1aXJlKCdyb3V0ZXInKSxcclxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbmV4cG9ydHMucmVnaXN0ZXJSb3V0ZXMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcm91dGVzQXJyID0gW10sXHJcblx0XHRzcGVjaWFsID0gZmFsc2U7XHJcblxyXG5cdF8uZWFjaChDb25maWcucm91dGVzLCBmdW5jdGlvbihhY3Rpb24sIHJvdXRlKSB7XHJcblxyXG5cdFx0aWYoXy5jb250YWlucyhyb3V0ZSwgJ0AnKSkge1xyXG5cdFx0XHRzcGVjaWFsID0gdHJ1ZTtcclxuXHRcdFx0cm91dGUgPSBfLnJlc3Qocm91dGUpLmpvaW4oJycpO1xyXG5cdFx0fSBlbHNlIGlmKF8uY29udGFpbnMocm91dGUsICcqJykpIHtcclxuXHRcdFx0c3BlY2lhbCA9IG51bGw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzcGVjaWFsID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cm91dGVzQXJyLnB1c2goe1xyXG5cdFx0XHRyb3V0ZSAgICAgIDogcm91dGUsXHJcblx0XHRcdGNvbnRyb2xsZXIgOiBhY3Rpb24uc3BsaXQoJyMnKVswXSxcclxuXHRcdFx0bWV0aG9kICAgICA6IGFjdGlvbi5zcGxpdCgnIycpWzFdLFxyXG5cdFx0XHRzcGVjaWFsICAgIDogc3BlY2lhbFxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdG5ldyBSb3V0ZXIocm91dGVzQXJyKTtcclxuXHRCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XHJcbn07XHJcblxyXG5leHBvcnRzLnJlbmRlclZpZXcgPSBmdW5jdGlvbihyZWdpb24sIHZpZXcsIG9wdGlvbnMpIHtcclxuXHR2YXIgQXBwbGljYXRpb24gPSByZXF1aXJlKCdhcHBsaWNhdGlvbicpLFxyXG5cdFx0VmlldyA9IHJlcXVpcmUodmlldyk7XHJcblxyXG5cdEFwcGxpY2F0aW9uW3JlZ2lvbl0uc2hvdyhuZXcgVmlldyhvcHRpb25zKSk7XHJcbn07IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRFdmVudHMgPSBCYWNrYm9uZS5FdmVudHM7XHJcblxyXG5FdmVudHMub24oJ3Jlc2V0X2Zvcm0nLCBmdW5jdGlvbihmb3JtKSB7XHJcblx0JChmb3JtKVswXS5yZXNldCgpO1xyXG5cdCQoZm9ybSkuZmluZCgnLmZvcm0tY29udHJvbDpmaXJzdCcpLmZvY3VzKCk7XHJcbn0pO1xyXG5cclxuRXZlbnRzLm9uKCdjbG9zZV9tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG5cdCQoJy5tb2RhbCAuY2xvc2U6bGFzdCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudHM7IiwidmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLnJ1bnRpbWUnKVsnZGVmYXVsdCddLFxyXG5cdEF1dGggPSByZXF1aXJlKCdhdXRoJyksXHJcblx0Q29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyksXHJcblx0TW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdDT05GSUcnLCBmdW5jdGlvbihhdHRyKSB7XHJcblx0aWYgKGF0dHIgPT09ICdFTlYnKSB7XHJcblx0XHRyZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZygnPHNwYW4gc3R5bGU9XCJjb2xvcjp0b21hdG87XCI+JyArIENvbmZpZ1thdHRyXSArICc8L3NwYW4+Jyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBDb25maWdbYXR0cl07XHJcblx0fVxyXG59KTtcclxuXHJcbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2lzTG9nZ2VkJywgZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjb250ZXh0ID0gdGhpcztcclxuXHJcblx0ZnVuY3Rpb24gaXNMb2dnZWQoKSB7XHJcblx0XHR2YXIgaXNMb2dnZWQ7XHJcblxyXG5cdFx0QXV0aC5pc0xvZ2dlZCgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdGlzTG9nZ2VkID0gcmVzLnN0YXR1cyA/IG9wdGlvbnMuZm4oY29udGV4dCkgOiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gaXNMb2dnZWQ7XHJcblx0fVxyXG5cdHJldHVybiBpc0xvZ2dlZCgpO1xyXG59KTtcclxuXHJcbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2Zvcm1hdERhdGUnLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0cmV0dXJuIE1vbWVudChkYXRhLCAnREQvTU0vWVlZWScpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG59KTtcclxuXHJcbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ1ZBTElEQVRJT05fTUVTU0FHRVMnLCBmdW5jdGlvbigpIHtcclxuXHR2YXIgdGVtcGxhdGUgPSBbXHJcblx0XHQnPGRpdiBjbGFzcz1cInJvd1wiPicsXHJcblx0XHQnXHQ8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+JyxcclxuXHRcdCdcdFx0PGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlciBoaWRlXCI+JyxcclxuXHRcdCdcdFx0XHQ8dWwgY2xhc3M9XCJ2YWxpZGF0aW9uLW1lc3NhZ2VzLWxpc3RcIiBzdHlsZT1cImxpc3Qtc3R5bGUtdHlwZTpub25lOyBwYWRkaW5nLWxlZnQ6MDtcIj48L3VsPicsXHJcblx0XHQnXHRcdDwvZGl2PicsXHJcblx0XHQnXHQ8L2Rpdj4nLFxyXG5cdFx0JzwvZGl2PidcclxuXHRdLmpvaW4oJycpO1xyXG5cclxuXHRyZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyh0ZW1wbGF0ZSk7XHJcbn0pO1xyXG5cclxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRjb25zb2xlLmxvZyh2YWx1ZSk7XHJcbn0pOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0XyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcclxuXHRBdXRoID0gcmVxdWlyZSgnYXV0aCcpLFxyXG5cdE11bHRpbW9kYWwgPSByZXF1aXJlKCdtdWx0aW1vZGFsJyksXHJcblx0Q29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcblxyXG4vLyBFeHBvcnRhIG8ganF1ZXJ5IGdsb2JhbG1lbnRlIHBhcmEgY29tcGF0aWJpbGlkYWRlIGNvbSBwbHVnaW5zLlxyXG5qUXVlcnkgPSAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcblxyXG4vLyBJbmpldGEgbyBqcXVlcnkuXHJcbkJhY2tib25lLiQgPSAkO1xyXG5cclxuLy8gUmVnaXN0cmEgbyBldmVudG9zIHByZXZpYW1lbnRlIGNhZGFzdHJhZG9zXHJcbnJlcXVpcmUoJ2V2ZW50cycpO1xyXG5cclxuLy8gQ8OzZGlnbyBhIHNlciBleGVjdXRhZG8gYW50ZXMgZGEgaW5pY2lhbGl6YcOnw6NvIGRhIGFwbGljYcOnw6NvLlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdC8vIEF1dGhcclxuXHRBdXRoLmluaXQoe1xyXG5cdFx0YXBwU2lnbGEgICAgICA6ICdTT1JURUlPJyxcclxuXHRcdGFwcERlc2NyaWNhbyAgOiAnQXBsaWNhdGl2byBwYXJhIHNvcnRlaW8gZGUgcmVzaWTDqm5jaWFzIGRvIHByb2dyYW1hIE5vc3NhIENhc2EnLFxyXG5cdFx0bG9naW5VcmwgICAgICA6IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3VzdWFyaW8vbG9naW4nLFxyXG5cdFx0bG9nb3V0VXJsICAgICA6IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3VzdWFyaW8vbG9nb3V0JyxcclxuXHRcdGxvZ2dlZFVzZXJVcmwgOiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS91c3VhcmlvJ1xyXG5cdH0pO1xyXG5cclxuXHQvLyBNdWx0aW1vZGFsXHJcblx0TXVsdGltb2RhbC5pbml0aWFsaXplKHJlcXVpcmUoJ2FwcGxpY2F0aW9uJyksIHtcclxuXHRcdGFsZXJ0OiB7XHJcblx0XHRcdHRpdGxlOiAnPHNwYW4gY2xhc3M9XCJ0ZXh0LWluZm9cIj5NZW5zYWdlbTwvc3Bhbj4nLFxyXG5cdFx0XHRidG5Pazoge1xyXG5cdFx0XHRcdGxhYmVsOiAnT0snLFxyXG5cdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1wcmltYXJ5IGJ0bi1zbSdcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGNvbmZpcm06IHtcclxuXHRcdFx0dGl0bGU6ICc8c3BhbiBjbGFzcz1cInRleHQtaW5mb1wiPkNvbmZpcm1hw6fDo288L3NwYW4+JyxcclxuXHRcdFx0YnRuT2s6IHtcclxuXHRcdFx0XHRsYWJlbDogJ1NpbScsXHJcblx0XHRcdFx0Y2xhc3NOYW1lOiAnYnRuLXN1Y2Nlc3MgYnRuLXNtJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRidG5DYW5jZWw6IHtcclxuXHRcdFx0XHRsYWJlbDogJ07Do28nLFxyXG5cdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1kYW5nZXIgYnRuLXNtJ1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Y29uZmlybUlubGluZToge1xyXG5cdFx0XHRtZXNzYWdlOiAnQ29uZmlybWE/JyxcclxuXHRcdFx0YnRuT2s6IHtcclxuXHRcdFx0XHRsYWJlbDogJ1NpbScsXHJcblx0XHRcdFx0Y2xhc3NOYW1lOiAnYnRuLXN1Y2Nlc3MgYnRuLXNtJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRidG5DYW5jZWw6IHtcclxuXHRcdFx0XHRsYWJlbDogJ07Do28nLFxyXG5cdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1kYW5nZXIgYnRuLXNtJ1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0bm90aWZ5OiB7XHJcblx0XHRcdHdpZHRoOiA0MjAsXHJcblx0XHRcdGRlbGF5OiAzMDAwLFxyXG5cdFx0XHRhbGxvd19kaXNtaXNzOiB0cnVlXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIEJhY2tib25lIE1vZGVsIEludmFsaWRcclxuXHRCYWNrYm9uZS5Nb2RlbC5wcm90b3R5cGUub24oJ2ludmFsaWQgY2hhbmdlJywgXy5kZWJvdW5jZShmdW5jdGlvbihtb2RlbCwgZXJyb3JzLCBvcHRpb25zKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgJGxpc3QgPSAkKCcudmFsaWRhdGlvbi1tZXNzYWdlcy1saXN0Omxhc3QnKSxcclxuXHRcdFx0XHR2YWxpZGF0aW9uRXJyb3JzID0gXy5pc0FycmF5KGVycm9ycykgPyBlcnJvcnMgOiBtb2RlbC52YWxpZGF0aW9uRXJyb3IsXHJcblx0XHRcdFx0aXRlbXMgPSBbXTtcclxuXHJcblx0XHRcdCQoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cclxuXHRcdFx0Xy5lYWNoKHZhbGlkYXRpb25FcnJvcnMsIGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdGl0ZW1zLnB1c2goJzxsaT48aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiPjwvaT4mbmJzcDsmbmJzcDsnICsgZXJyLm1lc3NhZ2UgKyAnPC9saT4nKTtcclxuXHRcdFx0XHQkKGVyci5lbGVtZW50KS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkbGlzdC5odG1sKGl0ZW1zKTtcclxuXHJcblx0XHRcdC8vICQoJy5mb3JtLWdyb3VwLmhhcy1lcnJvciA+IC5mb3JtLWNvbnRyb2w6Zmlyc3QnKS5mb2N1cygpO1xyXG5cclxuXHRcdFx0aWYoaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdCRsaXN0LnBhcmVudHMoJy5hbGVydCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JGxpc3QucGFyZW50cygnLmFsZXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBjYXRjaChlcnIpIHt9XHJcblx0fSwgMTAwKSk7XHJcbn07IiwidmFyIEluaXRpYWxpemVyID0gcmVxdWlyZSgnaW5pdGlhbGl6ZXInKSxcclxuXHREaXNwYXRjaGVyID0gcmVxdWlyZSgnZGlzcGF0Y2hlcicpLFxyXG5cdEFwcGxpY2F0aW9uID0gcmVxdWlyZSgnYXBwbGljYXRpb24nKTtcclxuXHJcbi8vIEV4ZWN1dGEgYXMgcm90aW5hcyBjb250aWRhcyBubyBhcnF1aXZvIGFwcGxpY2F0aW9uL2luaXRpYWxpemVyLmpzXHJcbkluaXRpYWxpemVyKCk7XHJcblxyXG4vLyBSZWdpc3RyYSBhcyByb3RhcyBkYSBhcGxpY2HDp8Ojb1xyXG5EaXNwYXRjaGVyLnJlZ2lzdGVyUm91dGVzKCk7XHJcblxyXG4vLyBJbmljaWEgYSBhcGxpY2HDp8Ojb1xyXG5BcHBsaWNhdGlvbi5zdGFydCgpOyIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0Q29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcblx0dXJsUm9vdDogQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvc29ydGVpbycsXHJcblxyXG5cdGRlZmF1bHRzOiB7XHJcblx0XHQnZGF0YSc6ICcnXHJcblx0fSxcclxuXHJcblx0dmFsaWRhdGU6IGZ1bmN0aW9uKGF0dHJzKSB7XHJcblx0XHR2YXIgZXJyb3JzID0gW107XHJcblx0XHRpZihhdHRycy5kYXRhID09PSAnJykge1xyXG5cdFx0XHRlcnJvcnMucHVzaCh7XHJcblx0XHRcdFx0ZWxlbWVudDogJyNkYXRhJyxcclxuXHRcdFx0XHRtZXNzYWdlOiAnRGF0YSBwcmVjaXNhIHNlciBpbmZvcm1hZGEnXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKGF0dHJzLmVtcHJlZW5kaW1lbnRvcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0ZXJyb3JzLnB1c2goe1xyXG5cdFx0XHRcdGVsZW1lbnQ6ICcuZW1wcmVlbmRpbWVudG86Zmlyc3QnLFxyXG5cdFx0XHRcdG1lc3NhZ2U6ICdBbyBtZW5vcyB1bSBlbXByZWVuZGltZW50byBwcmVjaXNhIHNlciBpbmZvcm1hZG8nXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGVycm9ycyA6IG51bGw7XHJcblx0fSxcclxuXHJcblx0cGFyc2U6IGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0aWYocmVzLnN0YXR1cykge1xyXG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxyXG5cdENvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ocm91dGVzKSB7XHJcblx0XHR2YXIgcm91dGVyID0gdGhpcztcclxuXHJcblx0XHRfLmVhY2gocm91dGVzLCBmdW5jdGlvbihyKSB7XHJcblx0XHRcdHZhciByb3V0ZSA9IHIucm91dGUsXHJcblx0XHRcdFx0Y29udHJvbGxlciA9IHJlcXVpcmUoJ2NvbnRyb2xsZXJzLycgKyByLmNvbnRyb2xsZXIpLFxyXG5cdFx0XHRcdG1ldGhvZCA9IHIubWV0aG9kLFxyXG5cdFx0XHRcdHNwZWNpYWwgPSByLnNwZWNpYWw7XHJcblxyXG5cdFx0XHRyb3V0ZXIucm91dGUocm91dGUsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gXy5pbml0aWFsKGFyZ3VtZW50cyk7XHJcblxyXG5cdFx0XHRcdGlmKCFfLmNvbnRhaW5zKENvbmZpZy5CTEFDS0xJU1RfUk9VVEVTLCByb3V0ZSkpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5sYXN0Um91dGUgPSBCYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29udHJvbGxlci5leGVjdXRlKG1ldGhvZCwgYXJncywgc3BlY2lhbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG5cdEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRBdXRoID0gcmVxdWlyZSgnYXV0aCcpO1xyXG5cclxuZXhwb3J0cy5hY3RpdmVNZW51SXRlbnNPbkhvdmVyID0gZnVuY3Rpb24oKSB7XHJcblx0JCgnLm5hdmJhci1uYXYgPiBsaScpLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKS5jbG9zZXN0KCcuZHJvcGRvd24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdH0pLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpLmNsb3Nlc3QoJy5kcm9wZG93bi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHR9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ29Ub0xhc3RSb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUod2luZG93Lmxhc3RSb3V0ZSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNldExvZ2dlZFVzZXJFbCA9IGZ1bmN0aW9uKG5vbWUpIHtcclxuXHR2YXIgZWxlbWVudCA9IFtcclxuXHRcdCc8ZGl2IGNsYXNzPVwicHVsbC1yaWdodFwiPicsXHJcblx0XHQnXHQ8cCBjbGFzcz1cIm5hdmJhci10ZXh0XCI+bG9nZ2VkVXNlcjwvcD4nLFxyXG5cdFx0J1x0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXhzIGJ0bi13YXJuaW5nIGxvZ2luLWJsb2NrLWxvZ291dFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxNHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIj5TYWlyPC9idXR0b24+JyxcclxuXHRcdCc8L2Rpdj4nXHJcblx0XS5qb2luKCcnKS5yZXBsYWNlKCdsb2dnZWRVc2VyJywgbm9tZSk7XHJcblxyXG5cdCQoJy5sb2dnZWQtdXNlci1lbCcpLmh0bWwoZWxlbWVudCk7XHJcblxyXG5cdCQoJy5sb2dpbi1ibG9jay1sb2dvdXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihldikge1xyXG5cdFx0QmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnbG9nb3V0Jywge3RyaWdnZXI6IHRydWV9KTtcclxuXHR9KTtcclxufTtcclxuIiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHJcblx0ZXZlbnRzOiB7XHJcblx0XHQnc3VibWl0IGZvcm0nICAgIDogJ3NhbHZhcicsXHJcblx0XHQnZm9jdXNvdXQgaW5wdXQnIDogJ3ZhbGlkYXRlJyxcclxuXHRcdCdjaGFuZ2Ugc2VsZWN0JyAgOiAndmFsaWRhdGUnXHJcblx0fSxcclxuXHJcblx0b25TaG93OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGF0LiQoJ2lucHV0OmZpcnN0JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuY2FsbGVkID0gdGhpcy5jYWxsZWQgfHwgZmFsc2U7XHJcblxyXG5cdFx0aWYodGhpcy5tb2RlbC52YWxpZGF0aW9uRXJyb3IgfHwgdGhpcy5jYWxsZWQpIHtcclxuXHRcdFx0dGhpcy5wb3B1bGF0ZU1vZGVsKCk7XHJcblx0XHRcdHRoaXMubW9kZWwuaXNWYWxpZCgpO1xyXG5cdFx0XHR0aGlzLmNhbGxlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgTWFyaW9uZXR0ZSA9IHJlcXVpcmUoJ21hcmlvbmV0dGUnKSxcclxuXHRBdXRoID0gIHJlcXVpcmUoJ2F1dGgnKSxcclxuXHRVdGlscyA9IHJlcXVpcmUoJ3V0aWxzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ21lbnUudHBsJyxcclxuXHJcblx0b25TaG93OiBmdW5jdGlvbigpIHtcclxuXHRcdEF1dGguaXNMb2dnZWQoKS5zdWNjZXNzKGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0VXRpbHMuc2V0TG9nZ2VkVXNlckVsKHJlcy5kYXRhLm5vbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRVdGlscy5hY3RpdmVNZW51SXRlbnNPbkhvdmVyKCk7XHJcblx0XHR9LCAxMDApO1xyXG5cdH1cclxufSk7IiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ3BhZ2luYTQwNC50cGwnXHJcbn0pOyIsInZhciBNYXJpb25ldHRlID0gcmVxdWlyZSgnbWFyaW9uZXR0ZScpLFxyXG5cdEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLnJ1bnRpbWUnKVsnZGVmYXVsdCddLFxyXG5cdENhbmRpZGF0b3MgPSByZXF1aXJlKCdjb2xsZWN0aW9ucy9jYW5kaWRhdG9zJyksXHJcblx0UHJvZ3Jlc3NCYXJWaWV3ID0gcmVxdWlyZSgndmlld3Mvc29ydGVpb3MvcHJvZ3Jlc3NCYXInKSxcclxuXHRQYWdpbmF0b3IgPSByZXF1aXJlKCdwYWdpbmF0b3InKS5wYWdpbmF0b3IsXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKSxcclxuXHRFdmVudHMgPSByZXF1aXJlKCdldmVudHMnKSxcclxuXHRTZWFyY2hlciA9IHJlcXVpcmUoJ3NlYXJjaGVyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ3NvcnRlaW9zL2NhbmRpZGF0b3MudHBsJyxcclxuXHJcblx0ZXZlbnRzOiB7XHJcblx0XHQnY2hhbmdlICNhcnF1aXZvJyAgICAgICAgICAgOiBmdW5jdGlvbihldikgeyB0aGlzLiQoJy5idG4tZW52aWFyLWFycXVpdm8nKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTsgfSxcclxuXHRcdCdjbGljayAuYnRuLWVudmlhci1hcnF1aXZvJyA6ICdlbnZpYXJBcnF1aXZvJ1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdHRoaXMucGFyZW50VmlldyA9IG9wdGlvbnMucGFyZW50VmlldztcclxuXHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gbmV3IENhbmRpZGF0b3MobnVsbCwge2lkU29ydGVpbzogdGhpcy5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHJcblx0XHRFdmVudHMub24oJ2hpZGVfdXBsb2FkX2NvbnRyb2xzJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoYXQuJCgnLnVwbG9hZC1jb250cm9scycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRFdmVudHMub24oJ3JlbG9hZF9jb2xsZWN0aW9uX2NhbmRpZGF0b3MnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhhdC5jb2xsZWN0aW9uID0gbmV3IENhbmRpZGF0b3MobnVsbCwge2lkU29ydGVpbzogdGhhdC5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHRcdFx0dGhhdC5yZW5kZXIoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAncmVxdWVzdCcsIHRoaXMuc2V0R3JpZGRlcik7XHJcblx0XHR0aGlzLnNldEdyaWRkZXIoKTtcclxuXHRcdHRoaXMuc2V0UGFnaW5hdG9yKCk7XHJcblx0XHR0aGlzLnNldFNlYXJjaGVyKCk7XHJcblxyXG5cdFx0aWYodGhpcy5wYXJlbnRWaWV3Lmxpc3Rhcy5jdXJyZW50Vmlldy5jb2xsZWN0aW9uLndoZXJlKHtzb3J0ZWFkYTogdHJ1ZX0pLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0RXZlbnRzLnRyaWdnZXIoJ2hpZGVfdXBsb2FkX2NvbnRyb2xzJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0R3JpZGRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcGFydGlhbCA9IEhhbmRsZWJhcnMucGFydGlhbHNbJ3NvcnRlaW9zL19ncmlkZGVyQ2FuZGlkYXRvcy50cGwnXSh7Y2FuZGlkYXRvczogdGhpcy5jb2xsZWN0aW9uLnRvSlNPTigpfSk7XHJcblx0XHR0aGlzLiQoJyNncmlkZGVyQ2FuZGlkYXRvcycpLmh0bWwoIHBhcnRpYWwgKTtcclxuXHR9LFxyXG5cclxuXHRzZXRQYWdpbmF0b3I6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYodGhpcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dmFyIHBhZ2luYXRvciA9IG5ldyBQYWdpbmF0b3Ioe1xyXG5cdFx0XHRcdGVsOiB0aGlzLiQoJyNwYWdpbmF0b3JDYW5kaWRhdG9zJyksXHJcblx0XHRcdFx0Y29sbGVjdGlvbjogdGhpcy5jb2xsZWN0aW9uXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy4kKCcjcGFnaW5hdG9yQ2FuZGlkYXRvcycpLnBhcmVudHMoJy5yb3cnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldFNlYXJjaGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBuZXcgU2VhcmNoZXIoe1xyXG5cdFx0XHRcdGVsOiB0aGlzLiQoJyNzZWFyY2hlckNhbmRpZGF0b3MnKSxcclxuXHRcdFx0XHRjb2xsZWN0aW9uOiB0aGlzLmNvbGxlY3Rpb24sXHJcblx0XHRcdFx0c2VhcmNoQXR0cnM6IFtcclxuXHRcdFx0XHRcdCdub21lOk5PTUUnLFxyXG5cdFx0XHRcdFx0J2NwZjpDUEYnXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRsaXZlOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGVudmlhckFycXVpdm86IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGFycXVpdm8gPSB0aGlzLiQoJyNhcnF1aXZvJylbMF0uZmlsZXNbMF0sXHJcblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCksXHJcblx0XHRcdHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdGZvcm1EYXRhLmFwcGVuZCgnYXJxdWl2bycsIGFycXVpdm8pO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybSgnQ29uZmlybWEgbyBlbnZpbyBkbyBhcnF1aXZvPycsIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdGlmKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvc29ydGVpby8nICsgdGhhdC5tb2RlbC5nZXQoJ2lkJykgKyAnL2ltcG9ydGFyQ2FuZGlkYXRvcycsXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxyXG5cdFx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyKSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnRmVjaGFyIGEgamFuZWxhIGlyw6EgY2FuY2VsYXIgYSBpbXBvcnRhw6fDo28uJztcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0dGhhdC5zaG93UHJvZ3Jlc3NCYXIoJ0ltcG9ydGHDp8OjbyBlbSBhbmRhbWVudG8hIFBvciBmYXZvciBhZ3VhcmRlLicpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHhockZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRvbnByb2dyZXNzOiBmdW5jdGlvbihldikge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQucHJvZ3Jlc3NWaWV3LnVwZGF0ZShldi5sb2FkZWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZG9uZShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHRoYXQucHJvZ3Jlc3NWaWV3LmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdFx0XHRNdWx0aW1vZGFsLm5vdGlmeSgnSW1wb3J0YcOnw6NvIHJlYWxpemFkYSBjb20gc3VjZXNzbyEnLCB7dHlwZTogJ3N1Y2Nlc3MnfSk7XHJcblx0XHRcdFx0XHRFdmVudHMudHJpZ2dlcigncmVsb2FkX2NvbGxlY3Rpb25fbGlzdGFzJyk7XHJcblx0XHRcdFx0XHRFdmVudHMudHJpZ2dlcigncmVsb2FkX2NvbGxlY3Rpb25fY2FuZGlkYXRvcycpO1xyXG5cdFx0XHRcdFx0d2luZG93Lm9uYmVmb3JldW5sb2FkID0gbnVsbDtcclxuXHRcdFx0XHR9KS5lcnJvcihmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHRcdE11bHRpbW9kYWwubm90aWZ5KCdPY29ycmV1IHVtIGVycm8gbmEgaW1wb3J0YcOnw6NvIGRvcyBjYW5kaWRhdG9zIScsIHt0eXBlOiAnZGFuZ2VyJ30pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRzaG93UHJvZ3Jlc3NCYXI6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuXHRcdHRoaXMucHJvZ3Jlc3NWaWV3ID0gbmV3IFByb2dyZXNzQmFyVmlldyh7bWVzc2FnZTogbWVzc2FnZX0pO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuc2hvdyh0aGlzLnByb2dyZXNzVmlldywgJ21vZGFsUHJvZ3Jlc3NDYW5kaWRhdG9zJyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgQmFzZVZpZXcgPSByZXF1aXJlKCd2aWV3cy9iYXNlX3ZpZXcnKSxcclxuXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXHJcblx0RXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRNb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZVZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ3NvcnRlaW9zL2luc2VyaXJfYXR1YWxpemFyLnRwbCcsXHJcblxyXG5cdHBvcHVsYXRlTW9kZWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhdGEgPSBNb21lbnQodGhpcy4kKCcjZGF0YScpLnZhbCgpKS5pc1ZhbGlkKCkgPyBNb21lbnQodGhpcy4kKCcjZGF0YScpLnZhbCgpKS5mb3JtYXQoJ0REL01NL1lZWVknKSA6ICcnLFxyXG5cdFx0XHRlbXByZWVuZGltZW50b3MgPSBbXTtcclxuXHJcblx0XHR0aGlzLm1vZGVsLnNldCgnZGF0YScsIGRhdGEpO1xyXG5cdFx0dGhpcy5tb2RlbC5zZXQoJ29ic2VydmFjYW8nLCB0aGlzLiQoJyNvYnNlcnZhY2FvJykudmFsKCkpO1xyXG5cclxuXHRcdHRoaXMuJCgnLmVtcHJlZW5kaW1lbnRvJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoJCh0aGlzKS52YWwoKSkge1xyXG5cdFx0XHRcdGVtcHJlZW5kaW1lbnRvcy5wdXNoKHtcclxuXHRcdFx0XHRcdG5vbWU6ICQodGhpcykudmFsKClcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLm1vZGVsLnNldCgnZW1wcmVlbmRpbWVudG9zJywgZW1wcmVlbmRpbWVudG9zKTtcclxuXHR9LFxyXG5cclxuXHRzYWx2YXI6IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGNvbmZpcm1NZXNzYWdlID0gJ0NvbmZpcm1hIG8gY2FkYXN0cm8gZG8gU29ydGVpbz8nLFxyXG5cdFx0XHRzdWNjZXNzTWVzc2FnZSA9ICdTb3J0ZWlvIGNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hJyxcclxuXHRcdFx0dGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0aWYodGhpcy5tb2RlbC5nZXQoJ2lkJykpIHtcclxuXHRcdFx0Y29uZmlybU1lc3NhZ2UgPSAnQ29uZmlybWEgYSBhdHVhbGl6YcOnw6NvIGRvcyBkYWRvcyBkbyBTb3J0ZWlvPydcclxuXHRcdFx0c3VjY2Vzc01lc3NhZ2UgPSAnRGFkb3MgZG8gU29ydGVpbyBhdHVhbGl6YWRvcyBjb20gc3VjZXNzbyEnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucG9wdWxhdGVNb2RlbCgpO1xyXG5cclxuXHRcdGlmKHRoaXMubW9kZWwuaXNWYWxpZCgpKSB7XHJcblx0XHRcdE11bHRpbW9kYWwuY29uZmlybUlubGluZShjb25maXJtTWVzc2FnZSwgZnVuY3Rpb24ocmVzcG9zdGEpIHtcclxuXHRcdFx0XHRpZihyZXNwb3N0YSkge1xyXG5cdFx0XHRcdFx0dGhhdC5wb3B1bGF0ZU1vZGVsKCk7XHJcblx0XHRcdFx0XHR0aGF0Lm1vZGVsLnNhdmUoKS5zdWNjZXNzKGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoc3VjY2Vzc01lc3NhZ2UsIHt0eXBlOiAnc3VjY2Vzcyd9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ3JlbG9hZF9jb2xsZWN0aW9uX3NvcnRlaW9zJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmKHJlcy5kYXRhICYmIHJlcy5kYXRhLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRFdmVudHMudHJpZ2dlcignY2xvc2VfbW9kYWwnKTtcclxuXHRcdFx0XHRcdFx0XHRcdEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoJ3NvcnRlaW9zLycgKyByZXMuZGF0YS5pZCwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdE11bHRpbW9kYWwubm90aWZ5KHJlcy5tZXNzYWdlLCB7dHlwZTogJ2Rhbmdlcid9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn0pOyIsInZhciBNYXJpb25ldHRlID0gcmVxdWlyZSgnbWFyaW9uZXR0ZScpLFxyXG5cdEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLnJ1bnRpbWUnKVsnZGVmYXVsdCddLFxyXG5cdEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKSxcclxuXHRTb3J0ZWlvcyA9IHJlcXVpcmUoJ2NvbGxlY3Rpb25zL3NvcnRlaW9zJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRFdmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xyXG5cdHRlbXBsYXRlOiAnc29ydGVpb3MvbGlzdGFyLnRwbCcsXHJcblxyXG5cdGV2ZW50czoge1xyXG5cdFx0J2NsaWNrIC50YWJsZS1zb3J0ZWlvcyAuY2xpY2thYmxlJyA6ICdzaG93U29ydGVpbycsXHJcblx0XHQnY2xpY2sgLmJ0bi1leGNsdWlyLXNvcnRlaW8nICAgICAgIDogJ2V4Y2x1aXJTb3J0ZWlvJ1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuY29sbGVjdGlvbiA9IG5ldyBTb3J0ZWlvcygpO1xyXG5cclxuXHRcdEV2ZW50cy5vbigncmVsb2FkX2NvbGxlY3Rpb25fc29ydGVpb3MnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhhdC5jb2xsZWN0aW9uID0gbmV3IFNvcnRlaW9zKCk7XHJcblx0XHRcdHRoYXQucmVuZGVyKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRvblJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldEdyaWRkZXIoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRHcmlkZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwYXJ0aWFsID0gSGFuZGxlYmFycy5wYXJ0aWFsc1snc29ydGVpb3MvX2dyaWRkZXJTb3J0ZWlvcy50cGwnXSh7c29ydGVpb3M6IHRoaXMuY29sbGVjdGlvbi50b0pTT04oKX0pO1xyXG5cdFx0dGhpcy4kKCcjZ3JpZGRlclNvcnRlaW9zJykuaHRtbCggcGFydGlhbCApO1xyXG5cdH0sXHJcblxyXG5cdHNob3dTb3J0ZWlvOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIGlkU29ydGVpbyA9IHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJyk7XHJcblx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCdzb3J0ZWlvcy8nICsgaWRTb3J0ZWlvLCB0cnVlKTtcclxuXHR9LFxyXG5cclxuXHRleGNsdWlyU29ydGVpbzogZnVuY3Rpb24oZXYpIHtcclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIGlkU29ydGVpbyA9IHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJyksXHJcblx0XHRcdHNvcnRlaW8gPSB0aGlzLmNvbGxlY3Rpb24uZ2V0KGlkU29ydGVpbyksXHJcblx0XHRcdG1zZyA9ICdFeGNsdWlyIFNvcnRlaW8gZG8gZGlhIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBzb3J0ZWlvLmdldCgnZGF0YScpICsgJzwvc3Ryb25nPj8nO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybShtc2csIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdGlmKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0c29ydGVpby5kZXN0cm95KCkuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdGlmKHJlcy5zdGF0dXMpIHtcclxuXHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1NvcnRlaW8gZXhjbHXDrWRvIGNvbSBzdWNlc3NvJywge3R5cGU6ICdzdWNjZXNzJ30pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkocmVzLm1lc3NhZ2UsIHt0eXBlOiAnZGFuZ2VyJ30pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ3JlbG9hZF9jb2xsZWN0aW9uX3NvcnRlaW9zJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSk7IiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyksXHJcblx0SGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J10sXHJcblx0XyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcclxuXHRMaXN0YXMgPSByZXF1aXJlKCdjb2xsZWN0aW9ucy9saXN0YXMnKSxcclxuXHRMaXN0YVZpZXcgPSByZXF1aXJlKCd2aWV3cy9zb3J0ZWlvcy9saXN0YScpLFxyXG5cdFByb2dyZXNzQmFyVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL3Byb2dyZXNzQmFyJyksXHJcblx0RXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyksXHJcblx0TXVsdGltb2RhbCA9IHJlcXVpcmUoJ211bHRpbW9kYWwnKSxcclxuXHRDb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xyXG5cdHRlbXBsYXRlOiAnc29ydGVpb3MvbGlzdGFzLnRwbCcsXHJcblxyXG5cdGV2ZW50czoge1xyXG5cdFx0J2NsaWNrIC5idG4tc29ydGVhci1wcm94aW1hLWxpc3RhJyA6ICdzb3J0ZWFyUHJveGltYUxpc3RhJyxcclxuXHRcdCdjbGljayAuYnRuLWFsdGVyYXItcXVhbnRpZGFkZScgICAgOiAnYWx0ZXJhclF1YW50aWRhZGVDYXNhcycsXHJcblx0XHQnY2xpY2sgLnRhYmxlLWxpc3RhcyAuY2xpY2thYmxlJyAgIDogJ3Nob3dMaXN0YScsXHJcblx0XHQna2V5dXAgLnR4dC1zZW1lbnRlJyAgICAgICAgICAgICAgIDogJ3N0b3JlU2VtZW50ZXMnXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gbmV3IExpc3RhcyhudWxsLCB7aWRTb3J0ZWlvOiB0aGlzLm1vZGVsLmdldCgnaWQnKX0pO1xyXG5cclxuXHRcdEV2ZW50cy5vbigncmVsb2FkX2NvbGxlY3Rpb25fbGlzdGFzJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoYXQuY29sbGVjdGlvbiA9IG5ldyBMaXN0YXMobnVsbCwge2lkU29ydGVpbzogdGhhdC5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHRcdFx0dGhhdC5yZW5kZXIoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0R3JpZGRlcigpO1xyXG5cdFx0dGhpcy50b2dnbGVCdG5Tb3J0ZWlvKCk7XHJcblx0XHR0aGlzLnRvZ2dsZUFsdGVyYWNhb1F1YW50aWRhZGVDYXNhcygpO1xyXG5cdFx0dGhpcy5zZXRTZW1lbnRlRmllbGRzKCk7XHJcblx0fSxcclxuXHJcblx0c2V0R3JpZGRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcGFydGlhbCA9IEhhbmRsZWJhcnMucGFydGlhbHNbJ3NvcnRlaW9zL19ncmlkZGVyTGlzdGFzLnRwbCddKHtsaXN0YXM6IHRoaXMuY29sbGVjdGlvbi50b0pTT04oKX0pO1xyXG5cdFx0dGhpcy4kKCcjZ3JpZGRlckxpc3RhcycpLmh0bWwoIHBhcnRpYWwgKTtcclxuXHR9LFxyXG5cclxuXHR0b2dnbGVCdG5Tb3J0ZWlvOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMuY29sbGVjdGlvbi53aGVyZSh7c29ydGVhZGE6IGZhbHNlfSkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR0aGlzLiQoJy5idG4tc29ydGVhci1wcm94aW1hLWxpc3RhJykuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLiQoJy5idG4tc29ydGVhci1wcm94aW1hLWxpc3RhJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0b2dnbGVBbHRlcmFjYW9RdWFudGlkYWRlQ2FzYXM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdGlmKHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPT09IDAgfHwgdGhpcy5jb2xsZWN0aW9uLndoZXJlKHtzb3J0ZWFkYTogdHJ1ZX0pLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGF0LiQoJy5idG4tYWx0ZXJhci1xdWFudGlkYWRlJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcclxuXHRcdFx0XHR0aGF0LiQoJy50eHQtcXVhbnRpZGFkZScpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcblx0XHRcdH0sIDUwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoYXQuJCgnLmJ0bi1hbHRlcmFyLXF1YW50aWRhZGUnKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRhbHRlcmFyUXVhbnRpZGFkZUNhc2FzOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgYXJyUXVhbnRpZGFkZXMgPSBbXSxcclxuXHRcdFx0dGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy4kKCcudHh0LXF1YW50aWRhZGUnKS5lYWNoKGZ1bmN0aW9uKGtleSwgZmllbGQpIHtcclxuXHRcdFx0YXJyUXVhbnRpZGFkZXMucHVzaCh7XHJcblx0XHRcdFx0aWQ6ICQoZmllbGQpLmRhdGEoJ2lkJyksXHJcblx0XHRcdFx0cXVhbnRpZGFkZTogcGFyc2VJbnQoJChmaWVsZCkudmFsKCksIDEwKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybSgnQWx0ZXJhciBhIHF1YW50aWRhZGUgZGUgY2FzYXM/JywgZnVuY3Rpb24ocmVzcG9zdGEpIHtcclxuXHRcdFx0aWYocmVzcG9zdGEpIHtcclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdFx0dXJsOiBDb25maWcuQkFTRV9VUkwgKyAnL2FwaS9zb3J0ZWlvLycgKyB0aGF0Lm1vZGVsLmdldCgnaWQnKSArICcvbGlzdGEvYWx0ZXJhclF1YW50aWRhZGVzJyxcclxuXHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHRcdGFzeW5jOiBmYWxzZSxcclxuXHRcdFx0XHRcdGNhY2hlOiBmYWxzZSxcclxuXHRcdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyclF1YW50aWRhZGVzKSxcclxuXHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZihyZXMuc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1F1YW50aWRhZGUgZGUgY2FzYXMgYWx0ZXJhZGEgY29tIHN1Y2Vzc28hJywge3R5cGU6ICdzdWNjZXNzJ30pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdE11bHRpbW9kYWwubm90aWZ5KHJlcy5tZXNzYWdlLCB7dHlwZTogJ2Rhbmdlcid9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRzb3J0ZWFyUHJveGltYUxpc3RhOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgcHJveGltYUxpc3RhID0gXy5maXJzdCggdGhpcy5jb2xsZWN0aW9uLndoZXJlKHtzb3J0ZWFkYTogZmFsc2V9KSApLFxyXG5cdFx0XHRzZW1lbnRlID0gdGhpcy4kKCcudHh0LXNlbWVudGVbZGF0YS1pZD0nICsgcHJveGltYUxpc3RhLmdldCgnaWQnKSArICddJykudmFsKCksXHJcblx0XHRcdG1zZyA9ICcnLFxyXG5cdFx0XHR0aGF0ID0gdGhpcztcclxuXHJcblx0XHRpZihzZW1lbnRlKSB7XHJcblx0XHRcdG1zZyA9ICdTb3J0ZWFyIGxpc3RhIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBwcm94aW1hTGlzdGEuZ2V0KCdub21lJykgKyAnPC9zdHJvbmc+IHV0aWxpemFuZG8gYSBzZW1lbnRlIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBzZW1lbnRlICsgJzwvc3Ryb25nPiA/JztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1zZyA9ICdTb3J0ZWFyIGxpc3RhIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBwcm94aW1hTGlzdGEuZ2V0KCdub21lJykgKyAgJz8nO1xyXG5cdFx0fVxyXG5cclxuXHRcdE11bHRpbW9kYWwuY29uZmlybShtc2csIGZ1bmN0aW9uKHJlc3Bvc3RhKSB7XHJcblx0XHRcdGlmKHJlc3Bvc3RhKSB7XHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogQ29uZmlnLkJBU0VfVVJMICsgJy9hcGkvc29ydGVpby8nICsgdGhhdC5tb2RlbC5nZXQoJ2lkJykgKyAnL3NvcnRlYXJQcm94aW1hTGlzdGE/c2VtZW50ZT0nICsgc2VtZW50ZSxcclxuXHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyKSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnRmVjaGFyIGEgamFuZWxhIGlyw6EgY2FuY2VsYXIgbyBzb3J0ZWlvLic7XHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHRoYXQuc2hvd1Byb2dyZXNzQmFyKCdTb3J0ZWlvIGVtIGFuZGFtZW50byEgUG9yIGZhdm9yIGFndWFyZGUuJyk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0eGhyRmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdG9ucHJvZ3Jlc3M6IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5wcm9ncmVzc1ZpZXcudXBkYXRlKGV2LmxvYWRlZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dGhhdC5wcm9ncmVzc1ZpZXcuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ1NvcnRlaW8gcmVhbGl6YWRvIGNvbSBzdWNlc3NvIScsIHt0eXBlOiAnc3VjY2Vzcyd9KTtcclxuXHRcdFx0XHRcdEV2ZW50cy50cmlnZ2VyKCdyZWxvYWRfY29sbGVjdGlvbl9saXN0YXMnKTtcclxuXHRcdFx0XHRcdEV2ZW50cy50cmlnZ2VyKCdyZWxvYWRfY29sbGVjdGlvbl9zb3J0ZWlvcycpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnRyaWdnZXIoJ2hpZGVfdXBsb2FkX2NvbnRyb2xzJyk7XHJcblx0XHRcdFx0XHR0aGF0LnNob3dMaXN0YVNvcnRlYWRhKHByb3hpbWFMaXN0YSk7XHJcblx0XHRcdFx0XHR3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBudWxsO1xyXG5cdFx0XHRcdH0pLmVycm9yKGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ09jb3JyZXUgdW0gZXJybyBuYSBleGVjdcOnw6NvIGRvIHNvcnRlaW8hJywge3R5cGU6ICdkYW5nZXInfSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHNob3dQcm9ncmVzc0JhcjogZnVuY3Rpb24obWVzc2FnZSkge1xyXG5cdFx0dGhpcy5wcm9ncmVzc1ZpZXcgPSBuZXcgUHJvZ3Jlc3NCYXJWaWV3KHttZXNzYWdlOiBtZXNzYWdlfSk7XHJcblxyXG5cdFx0TXVsdGltb2RhbC5zaG93KHRoaXMucHJvZ3Jlc3NWaWV3LCAnbW9kYWxQcm9ncmVzcycpO1xyXG5cdH0sXHJcblxyXG5cdHNob3dMaXN0YVNvcnRlYWRhOiBmdW5jdGlvbihsaXN0YSkge1xyXG5cdFx0dGhpcy4kKCcudGFibGUtbGlzdGFzJykuZmluZCgndHIjJyArIGxpc3RhLmdldCgnaWQnKSkuZmluZCgndGQ6Zmlyc3QnKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cdH0sXHJcblxyXG5cdHNob3dMaXN0YTogZnVuY3Rpb24oZXYpIHtcclxuXHRcdHRoaXMuY29sbGVjdGlvbiA9IG5ldyBMaXN0YXMobnVsbCwge2lkU29ydGVpbzogdGhpcy5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHJcblx0XHR2YXIgbGlzdGEgPSB0aGlzLmNvbGxlY3Rpb24uZ2V0KHRoaXMuJChldi5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJykpO1xyXG5cclxuXHRcdE11bHRpbW9kYWwuc2hvdyhuZXcgTGlzdGFWaWV3KHttb2RlbDogbGlzdGF9KSwgJ21vZGFsTGlzdGEnKTtcclxuXHR9LFxyXG5cclxuXHRzdG9yZVNlbWVudGVzOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIGZpZWxkID0gdGhpcy4kKGV2LmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndHh0LXNlbWVudGUtJyArIGZpZWxkLmRhdGEoJ2lkJyksIGZpZWxkLnZhbCgpKTtcclxuXHR9LFxyXG5cclxuXHRzZXRTZW1lbnRlRmllbGRzOiBmdW5jdGlvbihldikge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dGhpcy4kKCcudHh0LXNlbWVudGUnKS5lYWNoKGZ1bmN0aW9uKGtleSwgZmllbGQpIHtcclxuXHRcdFx0dmFyIHNlbWVudGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd0eHQtc2VtZW50ZS0nICsgdGhhdC4kKGZpZWxkKS5kYXRhKCdpZCcpKTtcclxuXHRcdFx0dGhhdC4kKGZpZWxkKS52YWwoc2VtZW50ZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0pOyIsInZhciBNYXJpb25ldHRlID0gcmVxdWlyZSgnbWFyaW9uZXR0ZScpLFxyXG5cdEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLnJ1bnRpbWUnKVsnZGVmYXVsdCddLFxyXG5cdENhbmRpZGF0b3MgPSByZXF1aXJlKCdjb2xsZWN0aW9ucy9jYW5kaWRhdG9zJyksXHJcblx0UGFnaW5hdG9yID0gcmVxdWlyZSgncGFnaW5hdG9yJykucGFnaW5hdG9yLFxyXG5cdE11bHRpbW9kYWwgPSByZXF1aXJlKCdtdWx0aW1vZGFsJyksXHJcblx0Q29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ3NvcnRlaW9zL2xpc3RhLnRwbCcsXHJcblxyXG5cdGV2ZW50czoge1xyXG5cdFx0J2NsaWNrIC5idG4tcHVibGljYXItbGlzdGEnIDogJ3B1YmxpY2FyTGlzdGEnXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmNvbGxlY3Rpb24gPSBuZXcgQ2FuZGlkYXRvcyhudWxsLCB7aWRMaXN0YTogdGhpcy5tb2RlbC5nZXQoJ2lkJyl9KTtcclxuXHR9LFxyXG5cclxuXHRvblJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3JlcXVlc3QnLCB0aGlzLnNldEdyaWRkZXIpO1xyXG5cdFx0dGhpcy5zZXRHcmlkZGVyKCk7XHJcblx0XHR0aGlzLnNldFBhZ2luYXRvcigpO1xyXG5cdH0sXHJcblxyXG5cdHNldEdyaWRkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHBhcnRpYWwgPSBIYW5kbGViYXJzLnBhcnRpYWxzWydzb3J0ZWlvcy9fZ3JpZGRlckNhbmRpZGF0b3NMaXN0YS50cGwnXSh7Y2FuZGlkYXRvczogdGhpcy5jb2xsZWN0aW9uLnRvSlNPTigpfSk7XHJcblx0XHR0aGlzLiQoJyNncmlkZGVyQ2FuZGlkYXRvc0xpc3RhJykuaHRtbCggcGFydGlhbCApO1xyXG5cdH0sXHJcblxyXG5cdHNldFBhZ2luYXRvcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcGFnaW5hdG9yID0gbmV3IFBhZ2luYXRvcih7XHJcblx0XHRcdGVsOiB0aGlzLiQoJyNwYWdpbmF0b3JDYW5kaWRhdG9zTGlzdGEnKSxcclxuXHRcdFx0Y29sbGVjdGlvbjogdGhpcy5jb2xsZWN0aW9uXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwdWJsaWNhckxpc3RhOiBmdW5jdGlvbihldikge1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHQkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IENvbmZpZy5CQVNFX1VSTCArICcvYXBpL3B1YmxpY2FjYW8vbGlzdGEvJyArIHRoYXQubW9kZWwuZ2V0KCdpZCcpICsgJy9wdWJsaWNhcicsXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRjYWNoZTogZmFsc2VcclxuXHRcdH0pLmRvbmUoZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdGlmKHJlcy5zdGF0dXMpIHtcclxuXHRcdFx0XHRNdWx0aW1vZGFsLm5vdGlmeSgnUHVibGljYcOnw6NvIGRhIGxpc3RhIHJlYWxpemFkYSBjb20gc3VjZXNzbyEnLCB7dHlwZTogJ3N1Y2Nlc3MnfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0TXVsdGltb2RhbC5ub3RpZnkoJ09jb3JyZXUgdW0gZXJybyBuYSBwdWJsaWNhw6fDo28gZGEgbGlzdGEhJywge3R5cGU6ICdkYW5nZXInfSk7XHJcblx0XHRcdH1cclxuXHRcdH0pLmVycm9yKGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRNdWx0aW1vZGFsLm5vdGlmeSgnT2NvcnJldSB1bSBlcnJvIG5hIHB1YmxpY2HDp8OjbyBkYSBsaXN0YSEnLCB7dHlwZTogJ2Rhbmdlcid9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSk7IiwidmFyIE1hcmlvbmV0dGUgPSByZXF1aXJlKCdtYXJpb25ldHRlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcclxuXHR0ZW1wbGF0ZTogJ3NvcnRlaW9zL3Byb2dyZXNzX2Jhci50cGwnLFxyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XHJcblx0XHR0aGlzLm9sZE1vZGFsRXNjYXBlID0gJC5mbi5tb2RhbC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUuZXNjYXBlO1xyXG5cdFx0JC5mbi5tb2RhbC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUuZXNjYXBlID0gZnVuY3Rpb24gKCkge307XHJcblx0fSxcclxuXHRvblJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLiQoJyNtZXNzYWdlJykuaHRtbCh0aGlzLm1lc3NhZ2UpO1xyXG5cdH0sXHJcblx0b25EZXN0cm95OiBmdW5jdGlvbigpIHtcclxuXHRcdCQuZm4ubW9kYWwuQ29uc3RydWN0b3IucHJvdG90eXBlLmVzY2FwZSA9IHRoaXMub2xkTW9kYWxFc2NhcGU7XHJcblx0fSxcclxuXHRvblJlbW92ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zb2xlLmxvZygncmVtb3ZlZCcpO1xyXG5cdH0sXHJcblx0dXBkYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dGhpcy4kKCcucHJvZ3Jlc3MtYmFyJykuY3NzKCd3aWR0aCcsIHZhbHVlICsgJyUnKS5odG1sKHZhbHVlICsgJyUnKTtcclxuXHR9XHJcbn0pOyIsInZhciBNYXJpb25ldHRlID0gcmVxdWlyZSgnbWFyaW9uZXR0ZScpLFxyXG5cdFNvcnRlaW9WaWV3ID0gcmVxdWlyZSgndmlld3Mvc29ydGVpb3MvaW5zZXJpcl9hdHVhbGl6YXInKSxcclxuXHRDYW5kaWRhdG9zVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3NvcnRlaW9zL2NhbmRpZGF0b3MnKSxcclxuXHRMaXN0YXNWaWV3ID0gcmVxdWlyZSgndmlld3Mvc29ydGVpb3MvbGlzdGFzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xyXG5cdHRlbXBsYXRlOiAnc29ydGVpb3Mvc29ydGVpby50cGwnLFxyXG5cclxuXHRldmVudHM6IHtcclxuXHRcdCdzdWJtaXQgZm9ybScgICAgICAgOiBmdW5jdGlvbihldikgeyB0aGlzLmRldGFsaGVzLmN1cnJlbnRWaWV3LnNhbHZhcihldik7IH0sXHJcblx0XHQnY2xpY2sgLm5hdi10YWJzIGEnIDogJ3NldEFjdGl2ZUZvcm0nXHJcblx0fSxcclxuXHJcblx0cmVnaW9uczoge1xyXG5cdFx0ZGV0YWxoZXMgOiAnLm1vZGFsLWJvZHknXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdGlmKHRoaXMubW9kZWwuZ2V0KCdpZCcpKSB7XHJcblx0XHRcdHRoaXMuYWRkUmVnaW9uKCdkZXRhbGhlcycsICcjZGV0YWxoZXMnKTtcclxuXHRcdFx0dGhpcy5hZGRSZWdpb24oJ2NhbmRpZGF0b3MnLCAnI2NhbmRpZGF0b3MnKTtcclxuXHRcdFx0dGhpcy5hZGRSZWdpb24oJ2xpc3RhcycsICcjbGlzdGFzJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0b25SZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRWaWV3cygpO1xyXG5cdH0sXHJcblxyXG5cdHNldFZpZXdzOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGV0YWxoZXMuc2hvdyhuZXcgU29ydGVpb1ZpZXcoe21vZGVsOiB0aGlzLm1vZGVsfSkpO1xyXG5cclxuXHRcdGlmKHRoaXMubW9kZWwuZ2V0KCdpZCcpKSB7XHJcblx0XHRcdHRoaXMubGlzdGFzLnNob3cobmV3IExpc3Rhc1ZpZXcoe21vZGVsOiB0aGlzLm1vZGVsfSkpO1xyXG5cdFx0XHR0aGlzLmNhbmRpZGF0b3Muc2hvdyhuZXcgQ2FuZGlkYXRvc1ZpZXcoe21vZGVsOiB0aGlzLm1vZGVsLCBwYXJlbnRWaWV3OiB0aGlzfSkpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldEFjdGl2ZUZvcm06IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHR2YXIgdGFiID0gdGhpcy4kKGV2LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRpZih0YWIgPT09ICcjZGV0YWxoZXMnKSB7XHJcblx0XHRcdHRoaXMuJCgnLm1vZGFsLWZvb3RlcicpLmh0bWwoJzxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4tc3VjY2Vzc1wiPlNhbHZhcjwvYnV0dG9uPicpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy4kKCcubW9kYWwtZm9vdGVyJykuZW1wdHkoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pOyJdfQ==
