// Realiza um request para pegar as configurações do arquivo config.json
// e exporta como um módulo para ser consumido pela aplicação.
module.exports = (function() {

	var $ = require('jquery'),
		configJson = null;

	$.ajax({
		url: 'config.json',
		dataType: 'json',
		cache: false,
		async: false,
		success: function(response) {
			configJson = response;
		}
	});

	return configJson;
})();