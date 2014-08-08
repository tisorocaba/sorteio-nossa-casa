/**
 * Baltazzar Searcher
 * Versão: 0.2.2
 * Módulo para busca de registros.
 * Autor: BaltazZar Team
 */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.baltazzar||(f.baltazzar={})).searcher=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var $ = _dereq_('jquery'),
	_ = _dereq_('underscore'),
	Backbone = _dereq_('backbone');

Backbone.$ = $;

// Define o template do Searcher
var searcherTemplate = [
	'<div class="row">',
	'	<div class="col-md-4" style="padding-right:0;">',
	'		<select class="form-control input-sm search-attrs"></select>',
	'	</div>',
	'	<div class="col-md-8">',
	'		<form class="form-search" action="">',
	'			<div class="input-group input-group-sm">',
	'				<input type="text" class="form-control search-param" placeholder="Digite sua busca">',
	'				<span class="input-group-btn">',
	'					<button type="submit" class="btn btn-primary btn-search"><i class="glyphicon glyphicon-search"></i></button>',
	'				</span>',
	'			</div>',
	'		</form>',
	'	</div>',
	'</div>'
].join('');

// Retorna uma Backbone View
module.exports = Backbone.View.extend({
	template: searcherTemplate,

	// Define os eventos dos elementos do Searcher.
	events: {
		'submit .form-search': 'doSearch',
		'keyup .search-param'  : _.debounce(function(ev) {
			if(ev.currentTarget.value !== '' && this.options.live) {
				this.doSearch(ev);
			} else {
				this.resetCollection(ev);
			}
		}, 700),
		'change .search-attrs' : function() { this.$('.search-param').focus(); }
	},

	// Chama a renderização da view e prepara a collection para permitir buscas.
	initialize: function(options) {
		this.options = options;
		this.collection = this.options.collection;
		this.prepareCollection();
		this.render();
		this.setSearcherAttrs();
	},

	// Renderiza a view.
	render: function() {
		this.$el.html(this.template);
	},

	// Prepara a collection para permitir buscas.
	prepareCollection: function() {
		var that = this;

		// Cria o atributo queryObj na collection caso não exista.
		if(!this.collection.queryObj) {
			this.collection.queryObj = {};
		}

		// Cria a função callFetch na collection caso não exista.
		if(!this.collection.callFetch) {
			this.collection.callFetch = function(data) {

				if(data && data.itens_per_page) {
					that.collection.queryObj = _.extend({page: 1}, data);
				}

				that.collection.queryObj = _.extend(that.collection.queryObj, data);

				return that.collection.fetch({
					data: that.collection.queryObj
				});
			};
		}
	},

	// Define os atributos de busca.
	setSearcherAttrs: function() {
		var cmbSearchOptions = this.$('.search-attrs');

		_.each(this.options.searchAttrs, function(sa) {
			sa = sa.split(':');
			cmbSearchOptions.append('<option value="' + sa[0] + '">Buscar por ' + sa[1] + '</option>');
		});
	},

	// Define o texto a ser exibido no botão enquanto a busca é efetuada.
	setSearchingText: function(reset) {
		var searchingText = this.options.searchingText ? this.options.searchingText : 'Buscando...';

		if(reset) {
			this.$('.btn-search').html(this.prevState);
		} else {
			this.prevState = this.$('.btn-search').html();
			this.$('.btn-search').html(searchingText);
		}
	},

	// Realiza a busca de acordo com os parâmetros escolhidos.
	doSearch: function(ev) {
		ev.preventDefault();

		var searchAttr = this.$('.search-attrs').val(),
			searchParam = this.$('.search-param').val(),
			query = {filter_fields: searchAttr + '%' + searchParam},
			that = this;

		if(searchParam !== '') {
			this.setSearchingText();
			that.collection.callFetch(query).success(function() {
				setTimeout(function() {
					that.setSearchingText('reset');
				}, 500);
			});
		}
	},

	// Retorna a collection a seu estado inicial quando os parâmetros de busca são limpados.
	resetCollection: function(ev) {
		ev.preventDefault();

		var queryObj = {
			itens_per_page: this.collection.itens_per_page ? this.collection.itens_per_page : 10,
			page: 1
		},
		that = this;

		if(ev.currentTarget.value === '') {
			this.setSearchingText();
			this.collection.callFetch(queryObj).success(function() {
				setTimeout(function() {
					that.setSearchingText('reset');
				}, 500);
			});
		}
	}
});
},{}]},{},[1])
(1)
});;