<table class="table table-bordered table-condensed table-hover table-fixed table-sorteios">
	<thead>
		<th>DATA DO SORTEIO</th>
		<th>OBSERVAÇÃO</th>
		<th>FINALIZADO?</th>
		<th></th>
	</thead>
	<tbody>
	{{#each sorteios}}
		<tr id="{{id}}">
			<td class="clickable">{{data}}</td>
			<td class="clickable">{{observacao}}</td>
			<td class="clickable">
			{{#finalizado}}
				<strong class="text-success">SIM</strong>
			{{else}}
				<strong class="text-danger">NÃO</strong>
			{{/finalizado}}
			</td>
			<td>
			{{#unless finalizado}}
				<button type="button" class="btn btn-xs btn-danger btn-excluir-sorteio">Excluir</button>
			{{/unless}}
			</td>
		</tr>
	{{else}}
		<tr class="warning text-danger">
			<td colspan="4"><strong>Não há sorteios cadastrados ainda. Deseja <a href="#sorteios/inserir">cadastrar um novo</a>?</strong></td>
		</tr>
	{{/each}}
	</tbody>
</table>