<div class="navbar navbar-inverse navbar-static-top">
	<a href="#">
		<img src="{{CONFIG 'CDN_URL'}}/brasao_sorocaba.png" class="logotipo-prefeitura pull-left">
		<span class="navbar-brand">Nossa Casa - Sorteio {{CONFIG 'ENV'}}</span>
	</a>
{{#isLogged}}
	<ul class="nav navbar-nav">
		<li class="dropdown">
			<a href="#" class="dropdown-toggle" data-toggle="dropdown">Sorteios <b class="caret"></b></a>
			<ul class="dropdown-menu">
				<li><a href="#sorteios/inserir">Inserir</a></li>
				<li><a href="#sorteios">Listar</a></li>
			</ul>
		</li>
	</ul>
{{/isLogged}}

	<div class="logged-user-el"></div>
</div>