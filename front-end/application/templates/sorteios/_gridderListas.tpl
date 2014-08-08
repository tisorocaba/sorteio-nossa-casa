<table class="table table-bordered table-condensed table-hover table-fixed table-listas">
	<thead>
		<th>NOME</th>
		<th>TITULARES / RESERVA</th>
		<th>ORDEM DE SORTEIO</th>
		<th>SEMENTE</th>
		<th>SORTEADA?</th>
	</thead>
	<tbody>
	{{#each listas}}
		<tr id="{{id}}" {{#sorteada}}class="success text-success"{{/sorteada}}>
			<td class="clickable">{{nome}}</td>
			<td>
				<input type="text" class="form-control input-xs txt-quantidade" data-id="{{id}}" value="{{quantidade}}">
			</td>
			<td class="clickable">{{ordemSorteio}}</td>
			<td>
			{{#sorteada}}
				<input type="text" class="form-control input-sm" disabled="disabled" value="{{sementeSorteio}}">
			{{else}}
				<input type="text" class="form-control input-sm txt-semente" data-id="{{id}}" placeholder="Semente a ser utilizada no sorteio (opcional).">
			{{/sorteada}}
			</td>
			<td class="clickable">
			{{#sorteada}}
				<strong class="text-success">SIM</strong>
			{{else}}
				<strong class="text-danger">NÃO</strong>
			{{/sorteada}}
			</td>
		</tr>
	{{else}}
		<tr class="warning text-danger">
			<td colspan="5"><strong>Sem registros para exibição!</strong></td>
		</tr>
	{{/each}}
	</tbody>
</table>

