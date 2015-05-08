require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"templates":[function(require,module,exports){
module.exports = function(Handlebars) {
var templates = {};
templates["menu.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\r\n	<div class=\"logged-user-el\"></div>\r\n";
  }

  buffer += "<div class=\"navbar navbar-inverse navbar-static-top\">\r\n	<a href=\"#\">\r\n		<img src=\""
    + escapeExpression((helper = helpers.CONFIG || (depth0 && depth0.CONFIG),options={hash:{},data:data},helper ? helper.call(depth0, "CDN_URL", options) : helperMissing.call(depth0, "CONFIG", "CDN_URL", options)))
    + "/brasao_sorocaba.png\" class=\"logotipo-prefeitura pull-left\">\r\n		<span class=\"navbar-brand\">NOSSA CASA - HABITASORTE "
    + escapeExpression((helper = helpers.CONFIG || (depth0 && depth0.CONFIG),options={hash:{},data:data},helper ? helper.call(depth0, "ENV", options) : helperMissing.call(depth0, "CONFIG", "ENV", options)))
    + "</span>\r\n	</a>\r\n";
  stack1 = (helper = helpers.CONFIG || (depth0 && depth0.CONFIG),options={hash:{},data:data},helper ? helper.call(depth0, "AUTH_ENABLED", options) : helperMissing.call(depth0, "CONFIG", "AUTH_ENABLED", options));
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });
templates["pagina404.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"home\">\r\n	<div class=\"container\">\r\n		<div class=\"row\">\r\n			<div class=\"col-md-12 text-center\">\r\n				<h2 class=\"text-danger\">A página solicitada não existe ou não foi encontrada!</h2>\r\n			</div>\r\n		</div>\r\n		<div class=\"row\">\r\n			<div class=\"col-md-12 text-center\">\r\n				<a href=\"#\" class=\"btn btn-primary\">Retornar à Página Inicial</a>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
  });
templates["sorteios/candidatos.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"form-group upload-controls\">\r\n	<label class=\"control-label\">Importação de Arquivo:</label>\r\n	<div class=\"row\">\r\n		<div class=\"col-md-12\">\r\n			<div class=\"input-group input-group-sm\">\r\n				<input type=\"file\" class=\"form-control\" id=\"arquivo\">\r\n				<span class=\"input-group-btn\">\r\n					<button type=\"button\" class=\"btn btn-success btn-enviar-arquivo\" disabled=\"disabled\">Enviar Arquivo</button>\r\n				</span>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n<div class=\"row\" style=\"margin-bottom:10px;\">\r\n	<div class=\"col-md-offset-6 col-md-6\">\r\n		<div id=\"searcherCandidatos\"></div>\r\n	</div>\r\n</div>\r\n\r\n<div id=\"gridderCandidatos\"></div>\r\n\r\n<div class=\"row\">\r\n	<div class=\"col-md-12\">\r\n		<div class=\"paginator pull-right text-info\">\r\n			<div id=\"paginatorCandidatos\"></div>\r\n		</div>\r\n	</div>\r\n</div>";
  });
templates["sorteios/inserir_atualizar.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", helper, options;
  buffer += "value=\""
    + escapeExpression((helper = helpers.formatDate || (depth0 && depth0.formatDate),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.data), options) : helperMissing.call(depth0, "formatDate", (depth0 && depth0.data), options)))
    + "\"";
  return buffer;
  }

  if (helper = helpers.VALIDATION_MESSAGES) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.VALIDATION_MESSAGES); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n<div class=\"row\">\r\n	<div class=\"col-md-3\">\r\n		<div class=\"form-group\">\r\n			<label class=\"control-label\">Data:</label>\r\n			<input type=\"date\" class=\"form-control input-sm required\" id=\"data\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.data), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n		</div>\r\n	</div>\r\n	<div class=\"col-md-9\">\r\n		<div class=\"form-group\">\r\n			<label class=\"control-label\">Observação:</label>\r\n			<input type=\"text\" class=\"form-control input-sm\" id=\"observacao\" value=\"";
  if (helper = helpers.observacao) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.observacao); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n	<div class=\"col-md-6\">\r\n		<div class=\"form-group\">\r\n			<label>Empreendimento 1:</label>\r\n			<input type=\"text\" class=\"form-control input-sm empreendimento required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.empreendimentos)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.nome)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		</div>\r\n	</div>\r\n	<div class=\"col-md-6\">\r\n		<div class=\"form-group\">\r\n			<label>Empreendimento 2:</label>\r\n			<input type=\"text\" class=\"form-control input-sm empreendimento\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.empreendimentos)),stack1 == null || stack1 === false ? stack1 : stack1[1])),stack1 == null || stack1 === false ? stack1 : stack1.nome)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		</div>\r\n	</div>\r\n</div>\r\n<div class=\"row\">\r\n	<div class=\"col-md-6\">\r\n		<div class=\"form-group\">\r\n			<label>Empreendimento 3:</label>\r\n			<input type=\"text\" class=\"form-control input-sm empreendimento\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.empreendimentos)),stack1 == null || stack1 === false ? stack1 : stack1[2])),stack1 == null || stack1 === false ? stack1 : stack1.nome)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		</div>\r\n	</div>\r\n	<div class=\"col-md-6\">\r\n		<div class=\"form-group\">\r\n			<label>Empreendimento 4:</label>\r\n			<input type=\"text\" class=\"form-control input-sm empreendimento\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.empreendimentos)),stack1 == null || stack1 === false ? stack1 : stack1[3])),stack1 == null || stack1 === false ? stack1 : stack1.nome)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		</div>\r\n	</div>\r\n</div>";
  return buffer;
  });
templates["sorteios/lista.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n			<div class=\"row\">\r\n				<div class=\"col-md-6\">\r\n					<div class=\"alert alert-info\" style=\"padding:6px;margin-bottom:10px;\">\r\n						<span class=\"glyphicon glyphicon-info-sign\"></span>\r\n						<span>\r\n							Semente Utilizada neste Sorteio: <strong>";
  if (helper = helpers.sementeSorteio) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sementeSorteio); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong>\r\n						</span>\r\n					</div>\r\n				</div>\r\n				<div class=\"col-md-6 text-right\">\r\n					<button type=\"button\" class=\"btn btn-primary btn-publicar-lista\" style=\"margin-top:0;\">Publicar Lista de Contemplados</button>\r\n					<a href=\""
    + escapeExpression((helper = helpers.CONFIG || (depth0 && depth0.CONFIG),options={hash:{},data:data},helper ? helper.call(depth0, "BASE_URL", options) : helperMissing.call(depth0, "CONFIG", "BASE_URL", options)))
    + "/api/publicacao/lista/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/exportar\" target=\"_blank\" class=\"btn btn-success\" style=\"margin-top:0;\">Baixar Lista de Contemplados</a>\r\n				</div>\r\n			</div>\r\n		";
  return buffer;
  }

  buffer += "<div class=\"modal-dialog modal-big\">\r\n	<div class=\"modal-content\">\r\n		<div class=\"modal-header\">\r\n			<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n			<h4 class=\"modal-title text-info\">Lista <span class=\"text-danger\">";
  if (helper = helpers.nome) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nome); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></h4>\r\n		</div>\r\n		<div class=\"modal-body\">\r\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.sorteada), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			<div id=\"gridderCandidatosLista\"></div>\r\n		</div>\r\n		<div class=\"modal-footer\">\r\n			<div class=\"row\">\r\n				<div class=\"col-md-12\">\r\n					<div class=\"paginator pull-right text-info\">\r\n						<div id=\"paginatorCandidatosLista\"></div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
  return buffer;
  });
templates["sorteios/listar.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h3 class=\"text-info\">Sorteios Cadastrados <a href=\"#sorteios/inserir\" class=\"btn btn-success btn-sm pull-right\">Novo Sorteio</a></h3>\r\n\r\n<div id=\"gridderSorteios\"></div>";
  });
templates["sorteios/listas.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row\">\r\n	<div class=\"col-md-12 text-right\">\r\n		<button type=\"button\" class=\"btn btn-primary btn-sm btn-alterar-quantidade\">Alterar Quantidade de Casas</button>\r\n		<button type=\"button\" class=\"btn btn-success btn-sm btn-sortear-proxima-lista\">Sortear Próxima Lista</button>\r\n	</div>\r\n</div>\r\n\r\n<div id=\"gridderListas\" style=\"margin-top:10px;\"></div>";
  });
templates["sorteios/progress_bar.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"modal-dialog\" data-keyboard=\"false\">\r\n	<div class=\"modal-content\">\r\n		<div class=\"modal-body\">\r\n			<div class=\"alert alert-info\">\r\n				<strong id=\"message\"></strong>\r\n			</div>\r\n			<div class=\"progress\" style=\"margin-bottom:0;\">\r\n				<div class=\"progress-bar progress-bar-success progress-bar-striped active\"></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
  });
templates["sorteios/sorteio.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\r\n			<h4 class=\"modal-title text-info\">Detalhes do Sorteio</h4>\r\n		";
  }

function program3(depth0,data) {
  
  
  return "\r\n			<h4 class=\"modal-title text-info\">Inserir Sorteio <small class=\"text-danger\">Os campos de cor amarela são obrigatórios!</small></h4>\r\n		";
  }

function program5(depth0,data) {
  
  
  return "\r\n				<ul class=\"nav nav-tabs\">\r\n					<li class=\"active\"><a href=\"#detalhes\" data-toggle=\"tab\">Detalhes</a></li>\r\n					<li><a href=\"#candidatos\" data-toggle=\"tab\">Candidatos</a></li>\r\n					<li><a href=\"#listas\" data-toggle=\"tab\">Listas</a></li>\r\n				</ul>\r\n\r\n				<div class=\"tab-content\">\r\n					<div class=\"tab-pane active\" id=\"detalhes\"></div>\r\n					<div class=\"tab-pane\" id=\"candidatos\"></div>\r\n					<div class=\"tab-pane\" id=\"listas\"></div>\r\n				</div>\r\n			";
  }

  buffer += "<div class=\"modal-dialog modal-big\">\r\n	<div class=\"modal-content\">\r\n		<div class=\"modal-header\">\r\n			<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</div>\r\n		<form>\r\n			<div class=\"modal-body\">\r\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</div>\r\n			<div class=\"modal-footer\">\r\n				<button type=\"submit\" class=\"btn btn-sm btn-success\">Salvar</button>\r\n			</div>\r\n		</form>\r\n	</div>\r\n</div>";
  return buffer;
  });
Handlebars.registerPartial("sorteios/_gridderCandidatos.tpl",Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n		<tr id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  options={hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}
  if (helper = helpers.contemplado) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.contemplado); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.contemplado) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n			<td>";
  if (helper = helpers.nome) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nome); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.cpf) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cpf); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.quantidadeCriterios) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.quantidadeCriterios); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.lista) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lista); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.data) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.data); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>\r\n			";
  options={hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data}
  if (helper = helpers.contemplado) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.contemplado); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.contemplado) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</td>\r\n		</tr>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "class=\"success text-success\"";
  }

function program4(depth0,data) {
  
  
  return "\r\n				<strong class=\"text-success\">SIM</strong>\r\n			";
  }

function program6(depth0,data) {
  
  
  return "\r\n				<strong class=\"text-danger\">NÃO</strong>\r\n			";
  }

function program8(depth0,data) {
  
  
  return "\r\n		<tr class=\"warning text-danger\">\r\n			<td colspan=\"6\"><strong>Sem registros para exibição!</strong></td>\r\n		</tr>\r\n	";
  }

  buffer += "<table class=\"table table-bordered table-condensed table-hover table-fixed table-candidatos\">\r\n	<thead>\r\n		<th>NOME</th>\r\n		<th>CPF</th>\r\n		<th>CRITÉRIOS ATENDIDOS</th>\r\n		<th>LISTA</th>\r\n		<th>DATA</th>\r\n		<th>CONTEMPLADO</th>\r\n	</thead>\r\n	<tbody>\r\n	";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.candidatos), {hash:{},inverse:self.program(8, program8, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</tbody>\r\n</table>";
  return buffer;
  }));;
Handlebars.registerPartial("sorteios/_gridderCandidatosLista.tpl",Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n		<tr id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  options={hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}
  if (helper = helpers.dataContemplacao) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.dataContemplacao); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.dataContemplacao) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n			<td>";
  if (helper = helpers.nome) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nome); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.cpf) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cpf); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.quantidadeCriterios) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.quantidadeCriterios); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>";
  if (helper = helpers.sequenciaContemplacao) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sequenciaContemplacao); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n		</tr>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "class=\"success text-success\"";
  }

  buffer += "<table class=\"table table-bordered table-condensed table-hover table-fixed table-candidatos-lista\">\r\n	<thead>\r\n		<th>NOME</th>\r\n		<th>CPF</th>\r\n		<th>CRITÉRIOS ATENDIDOS</th>\r\n		<th>SEQUÊNCIA</th>\r\n	</thead>\r\n	<tbody>\r\n	";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.candidatos), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</tbody>\r\n</table>";
  return buffer;
  }));;
Handlebars.registerPartial("sorteios/_gridderListas.tpl",Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n		<tr id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  options={hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}
  if (helper = helpers.sorteada) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.sorteada); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.sorteada) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n			<td class=\"clickable\">";
  if (helper = helpers.nome) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nome); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>\r\n				<input type=\"text\" class=\"form-control input-xs txt-quantidade\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.quantidade) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.quantidade); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n			</td>\r\n			<td class=\"clickable\">";
  if (helper = helpers.ordemSorteio) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ordemSorteio); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td>\r\n			";
  options={hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data}
  if (helper = helpers.sorteada) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.sorteada); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.sorteada) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</td>\r\n			<td class=\"clickable\">\r\n			";
  options={hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data}
  if (helper = helpers.sorteada) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.sorteada); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.sorteada) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</td>\r\n		</tr>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "class=\"success text-success\"";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n				<input type=\"text\" class=\"form-control input-sm\" disabled=\"disabled\" value=\"";
  if (helper = helpers.sementeSorteio) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sementeSorteio); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n			";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n				<input type=\"text\" class=\"form-control input-sm txt-semente\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"Semente a ser utilizada no sorteio (opcional).\">\r\n			";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "\r\n				<strong class=\"text-success\">SIM</strong>\r\n			";
  }

function program10(depth0,data) {
  
  
  return "\r\n				<strong class=\"text-danger\">NÃO</strong>\r\n			";
  }

function program12(depth0,data) {
  
  
  return "\r\n		<tr class=\"warning text-danger\">\r\n			<td colspan=\"5\"><strong>Sem registros para exibição!</strong></td>\r\n		</tr>\r\n	";
  }

  buffer += "<table class=\"table table-bordered table-condensed table-hover table-fixed table-listas\">\r\n	<thead>\r\n		<th>NOME</th>\r\n		<th>TITULARES / RESERVA</th>\r\n		<th>ORDEM DE SORTEIO</th>\r\n		<th>SEMENTE</th>\r\n		<th>SORTEADA?</th>\r\n	</thead>\r\n	<tbody>\r\n	";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.listas), {hash:{},inverse:self.program(12, program12, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</tbody>\r\n</table>\r\n\r\n";
  return buffer;
  }));;
Handlebars.registerPartial("sorteios/_gridderSorteios.tpl",Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n		<tr id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n			<td class=\"clickable\">";
  if (helper = helpers.data) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.data); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td class=\"clickable\">";
  if (helper = helpers.observacao) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.observacao); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n			<td class=\"clickable\">\r\n			";
  options={hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data}
  if (helper = helpers.finalizado) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.finalizado); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.finalizado) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</td>\r\n			<td>\r\n			";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.finalizado), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</td>\r\n		</tr>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\r\n				<strong class=\"text-success\">SIM</strong>\r\n			";
  }

function program4(depth0,data) {
  
  
  return "\r\n				<strong class=\"text-danger\">NÃO</strong>\r\n			";
  }

function program6(depth0,data) {
  
  
  return "\r\n				<button type=\"button\" class=\"btn btn-xs btn-danger btn-excluir-sorteio\">Excluir</button>\r\n			";
  }

function program8(depth0,data) {
  
  
  return "\r\n		<tr class=\"warning text-danger\">\r\n			<td colspan=\"4\"><strong>Não há sorteios cadastrados ainda. Deseja <a href=\"#sorteios/inserir\">cadastrar um novo</a>?</strong></td>\r\n		</tr>\r\n	";
  }

  buffer += "<table class=\"table table-bordered table-condensed table-hover table-fixed table-sorteios\">\r\n	<thead>\r\n		<th>DATA DO SORTEIO</th>\r\n		<th>OBSERVAÇÃO</th>\r\n		<th>FINALIZADO?</th>\r\n		<th></th>\r\n	</thead>\r\n	<tbody>\r\n	";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.sorteios), {hash:{},inverse:self.program(8, program8, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</tbody>\r\n</table>";
  return buffer;
  }));;
return templates;
};
},{}]},{},[]);
