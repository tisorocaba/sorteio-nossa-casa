<div class="navbar navbar-inverse navbar-static-top">
	<a href="#">
		<img src="{{CONFIG 'CDN_URL'}}/brasao_sorocaba.png" class="logotipo-prefeitura pull-left">
		<span class="navbar-brand">HABITASORTE - SOROCABA {{CONFIG 'ENV'}}</span>
	</a>
{{#if (CONFIG 'AUTH_ENABLED')}}
	<div class="logged-user-el"></div>
{{/if}}
</div>