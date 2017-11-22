const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'minhafeira'
});

connection.connect(function(err)    {
    if(err) return console.log(err);
    console.log('conectou!');
});

connection.query(sqlQry, function(error, results, fields){
    if(error) 
      res.json(error);
    else
      res.json(results);
    connection.end();
    console.log('executou!');
});