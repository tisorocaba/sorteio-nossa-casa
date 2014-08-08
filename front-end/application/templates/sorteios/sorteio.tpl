<div class="modal-dialog modal-big">
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
		{{#if id}}
			<h4 class="modal-title text-info">Detalhes do Sorteio</h4>
		{{else}}
			<h4 class="modal-title text-info">Inserir Sorteio <small class="text-danger">Os campos de cor amarela são obrigatórios!</small></h4>
		{{/if}}
		</div>
		<form>
			<div class="modal-body">
			{{#if id}}
				<ul class="nav nav-tabs">
					<li class="active"><a href="#detalhes" data-toggle="tab">Detalhes</a></li>
					<li><a href="#candidatos" data-toggle="tab">Candidatos</a></li>
					<li><a href="#listas" data-toggle="tab">Listas</a></li>
				</ul>

				<div class="tab-content">
					<div class="tab-pane active" id="detalhes"></div>
					<div class="tab-pane" id="candidatos"></div>
					<div class="tab-pane" id="listas"></div>
				</div>
			{{/if}}
			</div>
			<div class="modal-footer">
				<button type="submit" class="btn btn-sm btn-success">Salvar</button>
			</div>
		</form>
	</div>
</div>