<div class="modal-dialog modal-big">
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
			<h4 class="modal-title text-info">Lista <span class="text-danger">{{nome}}</span></h4>
		</div>
		<div class="modal-body">
		{{#if sorteada}}
			<div class="row">
				<div class="col-md-6">
					<div class="alert alert-info" style="padding:6px;margin-bottom:10px;">
						<span class="glyphicon glyphicon-info-sign"></span>
						<span>
							Semente Utilizada neste Sorteio: <strong>{{sementeSorteio}}</strong>
						</span>
					</div>
				</div>
				<div class="col-md-6 text-right">
					<button type="button" class="btn btn-primary btn-publicar-lista" style="margin-top:0;">Publicar Lista de Contemplados</button>
					<a href="{{CONFIG 'BASE_URL'}}/api/publicacao/lista/{{id}}/exportar" target="_blank" class="btn btn-success" style="margin-top:0;">Baixar Lista de Contemplados</a>
				</div>
			</div>
		{{/if}}
			<div id="gridderCandidatosLista"></div>
		</div>
		<div class="modal-footer">
			<div class="row">
				<div class="col-md-12">
					<div class="paginator pull-right text-info">
						<div id="paginatorCandidatosLista"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>