let mysql = require("mysql");

function REST_ROUTER(router, connection, md5){
	let self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5){
	router.get("/", function(req, res){
		res.json({
			"Message": "Ola mundo"
		});
	});

	// Cadastra usuario
	router.post("/users", function(req, res){
		console.log(req.body);
		let query = "INSERT INTO ??(??,??) VALUES (?,?)";
		let table = ["user_login","user_email","user_password", req.query.email, md5(req.query.password)];
		query = mysql.format(query, table);
		console.log(query)
		connection.query(query, function(err, rows){
			if(err){
				res.json({"Error": true, "Message": "Erro ao executar a query do MYSQL"})
			}else{
				res.json({"Error" : false, "Message": "Usuario adicionado!"});
			}
		})
	});

	/* CONSULTA USUARIOS */
	// Todos os usuarios
	router.get("/users", function(req, res){
		let query = "SELECT * FROM ??";
		let table = ["user_login"];
		query = mysql.format(query, table);
		connection.query(query, function(err, rows){
			if(err){
				res.json({"Error": true, "Message": "Erro ao executar query do Mysql"});
			}else{
				res.json({"Error": false, "Message": "Successo", "Users": rows});
			}
		});
	});

	// Determinado usuario
	router.get("/users/:user_id", function(req, res){
		console.log(req.params.user_id)
		let query = "SELECT * FROM ?? WHERE ??=?";
		let table = ["user_login", "user_id", req.params.user_id];
		query = mysql.format(query, table);
		connection.query(query, function(err, rows){
			if(err){
				res.json({"Error": true, "Message": "Erro ao executar query do Mysql"});
			}else{
				res.json({"Error": false, "Message": "Sucesso", "User": rows});
			}
		});
	});

	// Atualiza o usuario
	router.put('/users', function(req, res){
		console.log(req.body.user_password)
		let query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
		let table = ["user_login", "user_password", md5(req.body.password), "user_email", req.body.email];
		query = mysql.format(query, table);
		connection.query(query, function(err, rows){
			if(err){
				res.json({"Error": true, "Message": "Erro ao executar query do Mysql"});
			}else{
				res.json({"Error": false, "Message": "Usuario atualizado"});
			}
		});
	});
}

module.exports = REST_ROUTER;