{{VALIDATION_MESSAGES}}
<div class="row">
	<div class="col-md-3">
		<div class="form-group">
			<label class="control-label">Data:</label>
			<input type="date" class="form-control input-sm required" id="data" {{#if data}}value="{{formatDate data}}"{{/if}}>
		</div>
	</div>
	<div class="col-md-9">
		<div class="form-group">
			<label class="control-label">Observação:</label>
			<input type="text" class="form-control input-sm" id="observacao" value="{{observacao}}">
		</div>
	</div>
</div>

<div class="row">
	<div class="col-md-6">
		<div class="form-group">
			<label>Empreendimento 1:</label>
			<input type="text" class="form-control input-sm empreendimento required" value="{{empreendimentos.[0].nome}}">
		</div>
	</div>
	<div class="col-md-6">
		<div class="form-group">
			<label>Empreendimento 2:</label>
			<input type="text" class="form-control input-sm empreendimento" value="{{empreendimentos.[1].nome}}">
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-6">
		<div class="form-group">
			<label>Empreendimento 3:</label>
			<input type="text" class="form-control input-sm empreendimento" value="{{empreendimentos.[2].nome}}">
		</div>
	</div>
	<div class="col-md-6">
		<div class="form-group">
			<label>Empreendimento 4:</label>
			<input type="text" class="form-control input-sm empreendimento" value="{{empreendimentos.[3].nome}}">
		</div>
	</div>
</div>