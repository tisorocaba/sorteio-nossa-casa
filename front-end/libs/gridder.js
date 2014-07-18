
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["jquery","backbone","underscore","marionette"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('backbone'), require('underscore'), require('marionette'));
  } else {
    root.Gridder = factory(root.jQuery, root.Backbone, root._, root.Backbone.Marionette);
  }
}(this, function($, Backbone, _, Marionette) {

/* Para pegar atributos aninhados do Backbone Model */
var getAttrs = function(model, path) {
	var attrs = path.split('.'),
		match;

	var _walker = function(obj) {
		if(_.isObject(obj)) {
			_(obj).each(function(value, key) {
				if( _.last(attrs) === key ) {
					match = value;
				} else {
					_walker(obj[key]);
				}
			});
		}
	};

	if(_.isObject(model.attributes[_.first(attrs)])) {
		_walker(model.attributes[_.first(attrs)]);
	} else {
		match = model.attributes[_.first(attrs)];
	}

	return match;
};

var template = [
	'	<table id="{{gridderId}}" class="table table-bordered">',
	'		<thead></thead>',
	'		<tbody></tbody>',
	'	</table>'
].join('');

var Gridder = Marionette.ItemView.extend({

	initialize: function(options) {

		this.gridderId     = 'gridder' + new Date().getTime();
		this.template      = function() { return template.replace('{{gridderId}}', this.gridderId); }.bind(this);
		this.calledMethods = [];
		this.$el           = $(options.element);
		this.colsKeys      = _.keys(options.cols);
		this.colsValues    = _.values(options.cols);
		this.cssClasses    = options.cssClasses ? options.cssClasses.join(' ') : [];
		this.emptyMessage  = options.emptyMessage ? emptyMessage : 'Sem registros para exibição!';

		this.listenTo(this.collection, 'remove destroy', this.removeRow);

		this.listenTo(this.collection, 'reset sync', function(collection, options) {
			this.renderBody();
			this.callMethods();
		});

		this.listenTo(this.collection, 'add', function(model) {
			this.renderRow(model);
			this.callMethods();
		});

		this.render();

		return this;
	},

	callMethods: function() {
		if(this.collection.length > 0) {
			_.each(this.calledMethods, function(method) {
				method.fn.call(this, method.options);
			}, this);
		}
	},

	onRender: function() {
		this.renderHeader();
		this.renderBody();
		if(this.cssClasses) {
			this.addCSSClasses();
		}
		return this;
	},

	renderHeader: function() {
		var template = [
			'<tr>',
			'	<th>' + this.colsValues.join('</th><th>') + '</th>',
			'</tr>'
		].join('');

		this.$('#' + this.gridderId + ' > thead').html(template);
	},

	renderBody: function() {
		var colspan = this.$('#' + this.gridderId + ' > thead > tr > th').length;

		this.$('#' + this.gridderId + ' > tbody').empty();

		if(this.collection.length > 0) {
			this.collection.each(this.renderRow, this);
		} else {
			var emptyMessage = [
				'<tr class="warning">',
				'	<td class="text-center" colspan="' + colspan + '">',
				'		<strong class="text-danger">' + this.emptyMessage + '</strong>',
				'	</td>',
				'</tr>'
			].join('');

			this.$('#' + this.gridderId + ' > tbody').html(emptyMessage);
		}
	},

	renderRow: function(model) {
		var cols = [],
			col,
			cssClass,
			template = [],
			attrs = _.map(this.colsKeys, function(key) {
				return getAttrs(model, key) !== undefined ? getAttrs(model, key) : '';
			});

		_.each(attrs, function(attr, key) {
			cssClass = this.colsKeys[key].replace(/\./g, '-');
			col = '<td class="col-{{class}}">' + attr + '</td>';
			cols.push(col.replace('{{class}}', cssClass));
		}, this);

		template = [
			'<tr id="{{id}}">',
				cols.join(''),
			'</tr>'
		].join('').replace('{{id}}', model.get('id'));

		if(this.collection.length <= 1) {
			this.$('#' + this.gridderId + ' > tbody').empty();
		}

		this.$('#' + this.gridderId + ' > tbody').append(template);
	},

	removeRow: function(model) {
		this.$('#' + this.gridderId + ' > tbody').find('tr#' + model.get('id')).remove();
	},

	addCSSClasses: function() {
		this.$('#' + this.gridderId).addClass(this.cssClasses);
	},

	changeValues: function(options) {
		var cols = this.$('#' + this.gridderId + ' > tbody > tr > td');

		_.each(options, function(value, key) {
			_.each(cols, function(col) {
				if($(col).html() == key) {
					$(col).html(value);
				}
			});
		});

		this.calledMethods.push({
			fn: this.changeValues,
			options: options
		});

		return this;
	},

	getCols: function(callback) {
		_.each(this.$('#' + this.gridderId + ' > tbody > tr > td'), function(col) {
			callback(col, this.collection.get($(col).parents('tr').attr('id')));
		}, this);

		this.calledMethods.push({
			fn: this.getCols,
			options: callback
		});

		return this;
	},

	getRows: function(callback) {
		_.each(this.$('#' + this.gridderId + ' > tbody > tr'), function(row) {
			callback(row, this.collection.get($(row).attr('id')));
		}, this);

		this.calledMethods.push({
			fn: this.getRows,
			options: callback
		});

		return this;
	},

	addCols: function(options) {
		var content = null,
				that = this;

		this.$('#' + this.gridderId + ' .gridder-col-inserted').remove();

		if(this.collection.length > 0) {
			_.each(options, function(option) {

				/* hack para atualizar o DOM antes de inserir novos elementos */
				// setTimeout(function() {
					var position = option.position,
						header = option.header ? option.header : '';

					if(position && position === 'first') {
						position = 0;
					} else if(position && position === 'last') {
						position = that.$('#' + that.gridderId + ' > thead > tr > th').length;
					} else if(position > that.$('#' + that.gridderId + ' > thead > tr > th').length) {
						position = that.$('#' + that.gridderId + ' > thead > tr > th').length;
					} else {
						position = position;
					}

					try {
						if(position === 0) {
							that.$('#' + that.gridderId + ' > thead > tr > th:first-child').before('<th class="gridder-col-inserted">' + header + '</th>');
						} else {
							that.$('#' + that.gridderId + ' > thead > tr > th:nth-child(' + position + ')').after('<th class="gridder-col-inserted">' + header + '</th>');
						}
					} catch(err) {
						position = that.$('#' + that.gridderId + ' > thead > tr > th').length;
						that.$('#' + that.gridderId + ' > thead > tr > th:nth-child(' + position + ')').after('<th class="gridder-col-inserted">' + header + '</th>');
					}

					_.each(that.$('#' + that.gridderId + ' > tbody > tr'), function(row) {
						var model = that.collection.get($(row).attr('id'));
						// model = new DeepModel(model.attributes);

						content = option.content.replace(/\{\{(\S*)\}\}/gi, function(test, match) {
							return getAttrs(model, match);
							// return model.get(match);
						});

						if(position === 0) {
							$(row).find('td:first-child').before('<td class="gridder-col-inserted">' + content + '</td>');
						} else {
							$(row).find('td:nth-child(' + position + ')').after('<td class="gridder-col-inserted">' + content + '</td>');
						}
					});
				// }, option.position);
			});
		}

		this.calledMethods.push({
			fn: this.addCols,
			options: options
		});

		return this;
	}
});
return Gridder;

}));