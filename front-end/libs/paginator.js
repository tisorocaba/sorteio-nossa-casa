/**
 * Baltazzar Paginator
 * Versão: 0.2.3
 * Módulo para paginação de registros.
 * Autor: BaltazZar Team
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.baltazzar||(f.baltazzar={})).paginator=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var $ = _dereq_('jquery'),
	_ = _dereq_('underscore'),
	Backbone = _dereq_('backbone');

Backbone.$ = $;

// Define o template do Paginator
var paginatorTemplate = [
	'<div class="pull-right">',
	'	<label>',
	'		<select class="form-control input-sm per-page"></select>',
	'	</label>',
	'	<button type="button" class="btn btn-sm btn-info btn-first"><i class="glyphicon glyphicon-fast-backward"></i>&nbsp;</button>',
	'	<button type="button" class="btn btn-sm btn-info btn-previous"><i class="glyphicon glyphicon-backward"></i>&nbsp;</button>',
	'	<label>',
	'		<span>Página <input type="text" class="form-control input-sm current-page"></span>',
	'	</label>',
	'	<label>',
	'		<span>de <strong class="total-pages"></strong></span>',
	'	</label>',
	'	<button type="button" class="btn btn-sm btn-info btn-next">&nbsp;<i class="glyphicon glyphicon-forward"></i></button>',
	'	<button type="button" class="btn btn-sm btn-info btn-last"><i class="glyphicon glyphicon-fast-forward"></i>&nbsp;</button>',
	'	<span>Exibindo <strong class="shown-items-de"></strong> à <strong class="shown-items-a"></strong> de <strong class="total-items"></strong> registros</span>',
	'</div>'
].join('');

// Retorna uma Backbone View
exports.paginator = Backbone.View.extend({
	template: paginatorTemplate,

	// Define os eventos dos elementos do Paginator.
	events: {
		'click .btn-first'    : 'goToFirstPage',
		'click .btn-last'     : 'goToLastPage',
		'click .btn-previous' : 'goToPrevPage',
		'click .btn-next'     : 'goToNextPage',
		'change .per-page'    : 'perPage',
		'keyup .current-page' : 'goToPage'
	},

	// Chama a renderização da view e inicia os observers para os métodos.
	initialize: function(options) {

		this.options = options;
		this.template = this.options.template ? this.options.template : this.template;
		this.render();
		this.updatePaginatorEls();

		this.listenTo(this.options.collection, 'all', _.debounce(this.updatePaginatorEls, 300));
	},

	// Renderiza a view.
	render: function() {
		this.$el.html(this.template);

		this.setStyles();
		this.setPerPageOptions();
	},

	// Vai para a primeira página da collection.
	goToFirstPage: function(ev) {
		ev.preventDefault();
		this.collection.firstPage();
	},

	// Vai para a última página da collection.
	goToLastPage: function(ev) {
		ev.preventDefault();
		this.collection.lastPage();
	},

	// Vai para a página anterior da collection.
	goToPrevPage: function(ev) {
		ev.preventDefault();
		this.collection.prevPage();
	},

	// Vai para a próxima página da collection.
	goToNextPage: function(ev) {
		ev.preventDefault();
		this.collection.nextPage();
	},

	// Vai para a página da collection informada.
	goToPage: function(ev) {
		ev.preventDefault();
		if(ev.keyCode === 13) {
			this.collection.toPage(ev.currentTarget.value);
		}
	},

	// Altera a quantidade de registros exibidos por página.
	perPage: function(ev) {
		ev.preventDefault();
		var itens = this.$('.per-page').val();
		this.collection.perPage(itens);
	},

	// Atualiza as informações do Paginator.
	updatePaginatorEls: function() {

		// Calcula o offset de registros.
		var offsetDe = this.collection.itemOffset,
		offsetA = (this.collection.length + this.collection.itemOffset) - 1;

		if(this.collection.length === 0) {
			offsetA = 0;
		}

		// Atualiza os elementos do paginador com os valores recebidos da collection.
		this.$('.current-page').val(this.collection.currentPage);
		this.$('.total-pages').html(this.collection.pageCount);
		this.$('.shown-items-de').html(offsetDe);
		this.$('.shown-items-a').html(offsetA);
		this.$('.total-items').html(this.collection.itemCount);

		// Se currentPage for igual a 1 desabilita os botões de voltar e primeira página.
		if(this.collection.currentPage == 1) {
			this.$('.btn-first').prop('disabled', true);
			this.$('.btn-previous').prop('disabled', true);
		} else {
			this.$('.btn-first').prop('disabled', false);
			this.$('.btn-previous').prop('disabled', false);
		}

		// Se currentPage for igual a pageCount desabilita os botões de avançar e última página.
		if(this.collection.currentPage == this.collection.pageCount) {
			this.$('.btn-last').prop('disabled', true);
			this.$('.btn-next').prop('disabled', true);
		} else {
			this.$('.btn-last').prop('disabled', false);
			this.$('.btn-next').prop('disabled', false);
		}

		// Se pageCount for igual a 1 desabilita todos os elementos.
		if(this.collection.pageCount == 1) {
			this.$('.current-page').prop('disabled', true);
		} else {
			this.$('.current-page').prop('disabled', false);
		}
	},

	// Altera as opções do combo de páginas.
	setPerPageOptions: function() {
		var cmbPerPage = this.$('select').empty(),
			perPageOptions = this.options.perPageOptions ? this.options.perPageOptions : ['10', '20', '30', '40', '50'];

		_.each(perPageOptions, function(option) {
			cmbPerPage.append('<option value="' + option + '">' + option + ' por página</option>');
		});
	},

	// Define os estilos dos elementos do Paginator.
	setStyles: function() {

		this.$('button').css({
			'line-height': 1,
			'font-size': 10
		});

		this.$('select').css({
			'height': 24,
			'padding': 0
		});

		this.$('input').css({
			'display': 'inline-block',
			'width': 50,
			'height': 24,
			'padding': '0 5px',
			'margin-bottom': 1
		});

		this.$('label').css({
			'font-weight': 'normal'
		});

		this.$('span').css({
			'font-size': 12
		});
	}
});

// Expõe uma Collection Paginável que deve ser extendida nas collections que utilizarão
// o Paginator. Ex.:
//
// `var PagedCollection = require('paginator').pagedCollection;`
//
// `var Pessoas = PagedCollection.extend({...});`
exports.pagedCollection = Backbone.Collection.extend({

	initialize: function(options) {
		this.queryObj = {itens_per_page: 10};
		this.callFetch({page: 1});
	},

	callFetch: function(data) {
		if(data && data.itens_per_page) {
			this.queryObj = _.extend({page: 1}, data);
		}

		this.queryObj = _.extend(this.queryObj, data);

		return this.fetch({
			async: false,
			data: this.queryObj
		});
	},

	perPage: function(itens_per_page) {
		this.queryObj.itens_per_page = itens_per_page;
		this.callFetch({page: 1});
	},

	toPage: function(page) {
		page = page <= this.pageCount ? page : this.pageCount;
		this.callFetch({page: page});
	},

	firstPage: function() {
		this.callFetch({page: 1});
	},

	lastPage: function() {
		this.callFetch({page: this.pageCount});
	},

	nextPage: function() {
		if(this.currentPage < this.pageCount) {
			this.callFetch({page: this.currentPage + 1});
		}
	},

	prevPage: function() {
		if(this.currentPage > 1) {
			this.callFetch({page: this.currentPage - 1});
		}
	},

	parse: function(res) {
		if(res.data) {
			this.currentPage = res.data.currentPage;
			this.pageCount = res.data.pageCount;
			this.itemCount = res.data.itemCount;
			this.itemOffset = res.data.itemOffset;

			return res.data.itemList;
		}
	}
});
},{}]},{},[1])
(1)
});;