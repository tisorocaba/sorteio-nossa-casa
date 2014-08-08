<table class="table table-bordered table-condensed table-hover table-fixed table-candidatos-lista">
	<thead>
		<th>NOME</th>
		<th>CPF</th>
		<th>CRITÉRIOS ATENDIDOS</th>
		<th>SEQUÊNCIA</th>
	</thead>
	<tbody>
	{{#each candidatos}}
		<tr id="{{id}}" {{#dataContemplacao}}class="success text-success"{{/dataContemplacao}}>
			<td>{{nome}}</td>
			<td>{{cpf}}</td>
			<td>{{quantidadeCriterios}}</td>
			<td>{{sequenciaContemplacao}}</td>
		</tr>
	{{/each}}
	</tbody>
</table>