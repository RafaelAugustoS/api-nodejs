let express    = require("express");
let mysql      = require("mysql");
let bodyParser = require("body-parser");
let md5 	   = require("MD5");
let rest 	   = require("./REST.js");
let app 	   = express();


function REST(){
	let self = this;
	self.connectMysql();
}

REST.prototype.connectMysql = function(){
	let self = this;
	let pool = mysql.createPool({
		connectionLimit: 100,
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'restful_api_demo',
		debug: false
	});
	pool.getConnection(function(err, connection){
		if(err){
			self.stop(err);
		}else{
			self.configureExpress(connection);
		}
	});
}

REST.prototype.configureExpress = function(connection){
	let self = this;

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	let router = express.Router();
	app.use('/api', router);

	let rest_router = new rest(router, connection, md5);
	self.startServer();
}

REST.prototype.startServer = function(){
	app.listen(3000, function(){
		console.log('Servidor rodando na porta 3000');
	});
}

REST.prototype.stop = function(err){
	console.log('Erro no MYSQL n' + err);
	process.exit(1);
}

new REST();