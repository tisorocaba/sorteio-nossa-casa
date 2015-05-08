<table class="table table-bordered table-condensed table-hover table-fixed table-candidatos">
	<thead>
		<th>NOME</th>
		<th>CPF</th>
		<th>CRITÉRIOS ATENDIDOS</th>
		<th>LISTA</th>
		<th>DATA</th>
		<th>CONTEMPLADO</th>
	</thead>
	<tbody>
	{{#each candidatos}}
		<tr id="{{id}}" {{#contemplado}}class="success text-success"{{/contemplado}}>
			<td>{{nome}}</td>
			<td>{{cpf}}</td>
			<td>{{quantidadeCriterios}}</td>
			<td>{{lista}}</td>
			<td>{{data}}</td>
			<td>
			{{#contemplado}}
				<strong class="text-success">SIM</strong>
			{{else}}
				<strong class="text-danger">NÃO</strong>
			{{/contemplado}}
			</td>
		</tr>
	{{else}}
		<tr class="warning text-danger">
			<td colspan="6"><strong>Sem registros para exibição!</strong></td>
		</tr>
	{{/each}}
	</tbody>
</table>