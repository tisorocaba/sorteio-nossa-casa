var Initializer = require('initializer'),
	Dispatcher = require('dispatcher'),
	Application = require('application');

// Executa as rotinas contidas no arquivo application/initializer.js
Initializer();

// Registra as rotas da aplicação
Dispatcher.registerRoutes();

// Inicia a aplicação
Application.start();
