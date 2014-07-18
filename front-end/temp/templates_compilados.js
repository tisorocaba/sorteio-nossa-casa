module.exports = function(Handlebars) {
var templates = {};
templates["menu.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  return "\n	<ul class=\"nav navbar-nav\">\n		<li class=\"dropdown\">\n			<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Sorteios <b class=\"caret\"></b></a>\n			<ul class=\"dropdown-menu\">\n				<li><a href=\"#sorteios/inserir\">Inserir</a></li>\n				<li><a href=\"#sorteios\">Listar</a></li>\n			</ul>\n		</li>\n	</ul>\n";
  }

  buffer += "<div class=\"navbar navbar-inverse navbar-static-top\">\n	<a href=\"#\">\n		<img src=\""
    + escapeExpression((helper = helpers.CONFIG || (depth0 && depth0.CONFIG),options={hash:{},data:data},helper ? helper.call(depth0, "CDN_URL", options) : helperMissing.call(depth0, "CONFIG", "CDN_URL", options)))
    + "/brasao_sorocaba.png\" class=\"logotipo-prefeitura pull-left\">\n		<span class=\"navbar-brand\">Nossa Casa - Sorteio "
    + escapeExpression((helper = helpers.CONFIG || (depth0 && depth0.CONFIG),options={hash:{},data:data},helper ? helper.call(depth0, "ENV", options) : helperMissing.call(depth0, "CONFIG", "ENV", options)))
    + "</span>\n	</a>\n";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.isLogged) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.isLogged); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.isLogged) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	<div class=\"logged-user-el\"></div>\n</div>";
  return buffer;
  });
templates["pagina404.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"home\">\n	<div class=\"container\">\n		<div class=\"row\">\n			<div class=\"col-md-12 text-center\">\n				<h2 class=\"text-danger\">A página solicitada não existe ou não foi encontrada!</h2>\n			</div>\n		</div>\n		<div class=\"row\">\n			<div class=\"col-md-12 text-center\">\n				<a href=\"#\" class=\"btn btn-primary\">Retornar à Página Inicial</a>\n			</div>\n		</div>\n	</div>\n</div>";
  });
templates["sorteios/candidatos.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"form-group upload-controls\">\r\n	<label class=\"control-label\">Importação de Arquivo:</label>\r\n	<div class=\"row\">\r\n		<div class=\"col-md-12\">\r\n			<div class=\"input-group input-group-sm\">\r\n				<input type=\"file\" class=\"form-control\" id=\"arquivo\">\r\n				<span class=\"input-group-btn\">\r\n					<button type=\"button\" class=\"btn btn-success btn-enviar-arquivo\" disabled=\"disabled\">Enviar Arquivo</button>\r\n				</span>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n<div id=\"gridderCandidatos\"></div>\r\n\r\n<div class=\"row\">\r\n	<div class=\"col-md-12\">\r\n		<div class=\"paginator pull-right text-info\">\r\n			<div id=\"paginatorCandidatos\"></div>\r\n		</div>\r\n	</div>\r\n</div>";
  });
templates["sorteios/inserir_atualizar.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  if (helper = helpers.VALIDATION_MESSAGES) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.VALIDATION_MESSAGES); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n<div class=\"row\">\r\n	<div class=\"col-md-3\">\r\n		<div class=\"form-group\">\r\n			<label class=\"control-label\">Data:</label>\r\n			<input type=\"date\" class=\"form-control input-sm required\" id=\"data\" value=\""
    + escapeExpression((helper = helpers.formatDate || (depth0 && depth0.formatDate),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.data), options) : helperMissing.call(depth0, "formatDate", (depth0 && depth0.data), options)))
    + "\">\r\n		</div>\r\n\r\n	</div>\r\n	<div class=\"col-md-9\">\r\n		<div class=\"form-group\">\r\n			<label class=\"control-label\">Observação:</label>\r\n			<input type=\"text\" class=\"form-control input-sm\" id=\"observacao\" value=\"";
  if (helper = helpers.observacao) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.observacao); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n		</div>\r\n	</div>\r\n</div>";
  return buffer;
  });
templates["sorteios/lista.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"modal-dialog modal-big\">\r\n	<div class=\"modal-content\">\r\n		<div class=\"modal-header\">\r\n			<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n			<h4 class=\"modal-title text-info\">Lista <span class=\"text-danger\">";
  if (helper = helpers.nome) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nome); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></h4>\r\n		</div>\r\n		<div class=\"modal-body\">\r\n			<div id=\"gridderCandidatosLista\"></div>\r\n		</div>\r\n		<div class=\"modal-footer\">\r\n			<div class=\"row\">\r\n				<div class=\"col-md-12\">\r\n					<div class=\"paginator pull-right text-info\">\r\n						<div id=\"paginatorCandidatosLista\"></div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
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
  


  return "<div class=\"modal-dialog\" data-keyboard=\"false\">\r\n	<div class=\"modal-content\">\r\n		<div class=\"modal-body\">\r\n			<div class=\"alert alert-info\">\r\n				<strong>Sorteio em andamento! Por favor aguarde.</strong>\r\n			</div>\r\n			<div class=\"progress\" style=\"margin-bottom:0;\">\r\n				<div class=\"progress-bar progress-bar-success progress-bar-striped active\"></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
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

  buffer += "<div class=\"modal-dialog modal-medium\">\r\n	<div class=\"modal-content\">\r\n		<div class=\"modal-header\">\r\n			<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</div>\r\n		<form>\r\n			<div class=\"modal-body\">\r\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</div>\r\n			<div class=\"modal-footer\">\r\n				<button type=\"submit\" class=\"btn btn-sm btn-success\">Salvar</button>\r\n			</div>\r\n		</form>\r\n	</div>\r\n</div>";
  return buffer;
  });
return templates;
};