/**
 * Baltazzar multimodal
 * Versão: 1.1.2
 * A flexible modal component for Bootstrap & Backbone
 * Autor: BaltazZar Team
 */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.baltazzar||(f.baltazzar={})).multimodal=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = {
	alert: {
		message: 'Mensagem',
		title: 'Aviso',
		btnOk: {
			label: 'OK',
			className: 'btn-primary'
		},
		callbackReturnOk: function () {
			return true;
		},
		className: '',
		type: 'alert'
	},
	confirm: {
		message: 'Mensagem',
		title: 'Importante',
		btnOk: {
			label: 'OK',
			className: 'btn-primary'
		},
		callbackReturnOk: function () {
			return true;
		},
		btnCancel: {
			label: 'Cancelar',
			className: 'btn-default'
		},
		callbackReturnCancel: function () {
			return false;
		},
		className: '',
		type: 'confirm'
	},
	confirmInline: {
		message: 'Confirm Action?',
		btnOk: {
			label: 'OK',
			className: 'btn-primary'
		},
		callbackReturnOk: function () {
			return true;
		},
		btnCancel: {
			label: 'Cancelar',
			className: 'btn-default'
		},
		callbackReturnCancel: function () {
			return false;
		},
		className: '',
		type: 'confirmInline'
	},
	prompt: {
		message: 'Mensagem',
		title: '',
		customEl: '',
		btnOk: {
			label: 'OK',
			className: 'btn-primary'
		},
		callbackReturnOk: function (msg) {
			return msg;
		},
		btnCancel: {
			label: 'Cancelar',
			className: 'btn-default'
		},
		callbackReturnCancel: function () {
			return null;
		},
		className: '',
		type: 'prompt'
	},
	notify: {
		ele: "body",
		type: "info",
		offset: {
			from: "top",
			amount: 20
		},
		align: "right",
		width: 250,
		delay: 4000,
		allow_dismiss: true,
		stackup_spacing: 10
	}
};
},{}],2:[function(_dereq_,module,exports){
var _ = _dereq_('underscore'),
	Backbone = _dereq_('backbone'),
    Marionette = _dereq_('marionette');

jQuery = $ = _dereq_('jquery');

_dereq_('bootstrap');

// Deep extend for underscore
_.merge = _.merge || function(target, source) {
	_.each(source, function(v, prop) {
		if(_.contains(_.keys(target), prop) && _.isObject(target[prop]) && _.isObject(source[prop])) {
			_.merge(target[prop], source[prop]);
		} else {
			target[prop] = source[prop];
		}
	});
	return target;
};

var Multimodal = (function () {
	function Multimodal() {
		this.App = null;
		this.Template = _dereq_('./template');
		this.Defaults = _dereq_('./defaults');

		$.fn.modal.Constructor.prototype.enforceFocus = function () {};

	}

	Multimodal.prototype.initialize = function (app, options) {
		this.App = app;
		_.merge(this.Defaults, options);
	};

	Multimodal.prototype.createModalEl = function (elementId) {

		elementId = elementId || 'modal';

		if ($('body #' + elementId).length === 0) {
			var modalHTML = '<div class="modal" id="' + elementId + '" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">';
			$('body').append(modalHTML);
		}
	};

	Multimodal.prototype.box = function (msg, callback, type) {
		var tpl,
			ret = null,
			elementId = type + '-' + new Date().getTime();

		if (typeof msg === 'string') {
			msg = {
				message: msg
			};
		}

		_.defaults(msg, this.Defaults[type]);

		this.createModalEl(elementId);

		var zindex = parseInt($('.modal.in:last').css('z-index'), 10);


		var $el = $('body #' + elementId);
		$el.html(this.Template(msg));
		$el.modal({
			backdrop: 'static'
		});

		$('.modal-backdrop:gt(0)').remove();
		var bg = $('.modal-backdrop');

		if (zindex) {
			$el.css('z-index', zindex + 10);
			if (bg.length > 0) {
				bg.css('z-index', parseInt($el.css('z-index'), 10) - 1);
			}
		}

		var callbackClosure = function (ev) {
			callback(ret, ev);
			$el.unbind('hidden.bs.modal', callbackClosure);
		};

		var btnOkClosure = function (ev) {
			ret = msg.callbackReturnOk($el.find('#txtPrompt').val());
			$el.find('#btnOk').unbind('click', btnOkClosure);
		};

		var btnCancelClosure = function (ev) {
			ret = msg.callbackReturnCancel();
			$el.find('#btnCancel').unbind('click', btnCancelClosure);
		};

		var onRender = function (ev) {
			$el.find('#txtPrompt').focus();
			$el.unbind('shown.bs.modal', onRender);
		};

		$el.find('#btnOk').bind('click', btnOkClosure);
		$el.find('#btnCancel').bind('click', btnCancelClosure);

		$el.bind('shown.bs.modal', onRender);

		$el.bind('hidden.bs.modal', function() {
			$el.remove();
			var zindex = parseInt( $('.modal.in:last').css('z-index') );
			var bg = $('.modal-backdrop');
			bg.css('z-index', zindex - 1 );
		});

		if (callback) {
			$el.bind('hidden.bs.modal', callbackClosure);
		}
	};

	Multimodal.prototype.alert = function (msg, callback) {
		this.box(msg, callback, 'alert');
	};

	Multimodal.prototype.confirm = function (msg, callback) {
		this.box(msg, callback, 'confirm');
	};

	Multimodal.prototype.prompt = function (msg, callback) {
		this.box(msg, callback, 'prompt');
	};

	Multimodal.prototype.notify = function (message, options) {
		var $alert, css, offsetAmount;

		options = options || {};

		_.defaults(options, this.Defaults.notify);

		$alert = $("<div>");
		$alert.attr("class", "bootstrap-growl alert");
		if (options.type) {
			$alert.addClass("alert-" + options.type);
		}
		if (options.allow_dismiss) {
			$alert.append("<span class=\"close\" data-dismiss=\"alert\">&times;</span>");
		}
		$alert.append(message);
		if (options.top_offset) {
			options.offset = {
				from: "top",
				amount: options.top_offset
			};
		}
		offsetAmount = options.offset.amount;
		$(".bootstrap-growl").each(function () {
			offsetAmount = Math.max(offsetAmount, parseInt($(this).css(options.offset.from), 10) + $(this).outerHeight() + options.stackup_spacing);
			return offsetAmount;
		});
		css = {
			"position": (options.ele === "body" ? "fixed" : "absolute"),
			"margin": 0,
			"z-index": "9999",
			"display": "none"
		};
		css[options.offset.from] = offsetAmount + "px";
		$alert.css(css);
		if (options.width !== "auto") {
			$alert.css("width", options.width + "px");
		}
		$(options.ele).append($alert);
		switch (options.align) {
		case "center":
			$alert.css({
				"left": "50%",
				"margin-left": "-" + ($alert.outerWidth() / 2) + "px"
			});
			break;
		case "left":
			$alert.css("left", "20px");
			break;
		default:
			$alert.css("right", "20px");
		}
		$alert.fadeIn();
		if (options.delay > 0) {
			$alert.delay(options.delay).fadeOut(function () {
				return $(this).alert("close");
			});
		}
		return $alert;
	};

	Multimodal.prototype.show = function (modalView, elementId, callback) {
		if (this.App === null) {
			console.error('Please use initialize function to add marionette application to multimodal');
			return false;
		}

		elementId = elementId || 'modal';

		this.createModalEl(elementId);

		var ModalRegion = Marionette.Region.extend({
			el: "#" + elementId,
			prevIndex: null,

			initialize: function () {
				this.on('show', this.showModal, this);
			},

			getEl: function (selector) {
				var $el = $(selector),
					that = this;

				// o nome do evento mudou na versão 3 do Bootstrap
				$el.on('hidden.bs.modal', function () {
					// TODO: corrigir
					// that.close();
					that.currentView.destroy();
					$el.remove(); // remove o modal do DOM
				});

				return $el;
			},

			showModal: function (view) {
				var zindex = parseInt($('.modal.in:last').css('z-index'), 10);

				// TODO: corrigir
				// view.on('close', this.hideModal, this);
				view.on('destroy', this.hideModal, this);
				this.$el.modal({
					backdrop: 'static'
				});

				$('.modal-backdrop:gt(0)').remove();
				var bg = $('.modal-backdrop');

				if (zindex) {
					this.$el.css('z-index', zindex + 10);
					bg.css('z-index', parseInt(this.$el.css('z-index'), 10) - 1);
				}
			},

			hideModal: function () {
				this.$el.modal('hide');

				var zindex = parseInt($('.modal.in:last').css('z-index'), 10);
				var bg = $('.modal-backdrop');
				bg.css('z-index', zindex - 1);

				if (callback) {
					callback(modalView.modalReturn);
				}
			}
		});

		this.App.addRegions({
			modal: ModalRegion
		});

		this.App.modal.show(modalView);
	};

	Multimodal.prototype.confirmInline = function(msg, callback) {
		var oldElement = $('.modal:last').find('.modal-footer').html(),
			defaults = this.Defaults['confirmInline'],
			message = msg ? msg : this.Defaults['confirmInline']['message'];

		var template = [
			'<div class="row">',
			'	<div class="col-md-8">',
			'		<div class="text-info text-left" style="padding:5px;"><strong>' + message + '</strong></div>',
			'	</div>',
			'	<div class="col-md-4">',
			'		<button class="btn btn-sm btn-success btn-confirmAction" id="true">' + defaults.btnOk.label + '</button>',
			'		<button class="btn btn-sm btn-danger btn-confirmAction" id="false">' + defaults.btnCancel.label + '</button>',
			'	</div>',
			'</div>'
		];

		$('.modal:last').find('.modal-footer').html(template.join(' '));
		$('.modal:last').find('.modal-footer .btn-success').focus();

		$('.btn-confirmAction').on('click', function(ev) {
			var response = ev.currentTarget.id === 'true' ? true : false;
			$('.modal:last').find('.modal-footer').html(oldElement);
			callback(response);
		});
	};

	return Multimodal;
})();

var multimodal = new Multimodal();
module.exports = multimodal;
},{"./defaults":1,"./template":3}],3:[function(_dereq_,module,exports){
var $ = _dereq_('jquery');

module.exports = function (options) {
	var modalDialog = $('<div class="modal-dialog">');

	var modalContent = $('<div class="modal-content">').appendTo(modalDialog);

	var modalHeader = $('<div class="modal-header">').appendTo(modalContent);

	$('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>').appendTo(modalHeader);

	$('<h4 class="modal-title ' + options.className + '">' + options.title + '</h4>').appendTo(modalHeader);

	var modalBody = $('<div class="modal-body ' + options.className + '">').appendTo(modalContent);

	if (options.type === 'prompt') {
		var formGroup = $('<div class="form-group">').appendTo(modalBody);
		$('<label>' + options.message + '</label>').appendTo(formGroup);

		if (typeof customEl !== 'undefined') {
			$(customEl).appendTo(formGroup);
		} else {
			$('<input type="text" class="form-control input-sm" id="txtPrompt" placeholder="' + options.placeholder + '">')
				.on('keypress', function (ev) {
					if (ev.charCode===13) {
						$('#btnOK').trigger('click');
					}
				}).appendTo(formGroup);
		}
	} else {
		modalBody.html(options.message);
	}

	var modalFooter = $('<div class="modal-footer ' + options.className + '">').appendTo(modalContent);

	$('<button type="button" class="btn ' + options.btnOk.className + '" data-dismiss="modal" id="btnOk">' + options.btnOk.label + '</button>').appendTo(modalFooter);

	if (options.type !== 'alert') {
		$('<button type="' + (options.type === 'prompt' ? 'submit' : 'button') + '" class="btn ' + options.btnCancel.className + '" data-dismiss="modal" id="btnCancel">' + options.btnCancel.label + '</button>').appendTo(modalFooter);
	}

	return modalDialog;
};
},{}]},{},[2])
(2)
});