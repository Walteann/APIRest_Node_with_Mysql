const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const mysql = require('mysql');



//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//inicia o servidor
app.listen(port);
console.log('API funcionando!');


const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);


//lista todas as mercadorias
router.get('/mercadorias', (req, res) =>    {
    execSQLQuery('select * from compras', res);
});


// Para fazer uma consultar as mercadorias
router.get('/mercadorias/:id?', (req, res) =>  {
    let filter = '';
    if(req.params.id) filter = ' WHERE id_compras = ' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM compras' + filter, res);
});

// Deleta uma mercadoria
router.delete('/mercadorias/:id', (req, res) => {
    execSQLQuery('DELETE FROM compras WHERE id_compras = ' + parseInt(req.params.id), res);
});

// Adicionar nova mercadoria
router.post('/mercadorias', (req, res) =>   {
    const nome_mercadoria = req.body.mercadoria.substring(0,150);
    const preco_mercadoria = req.body.preco.substring(0,11);
    const descricao_mercadoria = req.body.descricao.substring(0,150);
    execSQLQuery(`INSERT INTO compras (mercadoria) values ("${nome_mercadoria}")`, res);
});

// Update na Mercadoria

router.patch('/mercadorias/:id', (req, res) =>  {
    const id = parseInt(req.params.id);
    const nome_merca = req.body.mercadoria.substring(0,150);
    const preco_merca = req.body.preco.substring(0,11);
    const descricao = req.body.descricao.substring(0,150);
    execSQLQuery(`UPDATE compras set mercadoria = '${nome_merca}' WHERE id_compras = ${id}
    `, res);
});

// Busca para Historico de compras Inicio

//lista todas as mercadorias
router.get('/historico-compras', (req, res) =>    {
    execSQLQuery('select * from historico_compras', res);
});

// Adicionar nova mercadoria
router.post('/historico-compras', (req, res) =>   {
    const nomeacao_da_compra = req.body.historico[0].nome;
    // console.log(nomeacao_da_compra);
    const historico = req.body.historico[0].hist;
    // console.log(historico);
    execSQLQuery(`INSERT INTO historico_compras (nomeacao_da_compra, historico) values ('${nomeacao_da_compra}', '${historico}')`, res);
});

//Fim Busca Historico de Compras



// se Conectar ao banco de Dados e executa as querys
function execSQLQuery(sqlQry, res)  {
    const connection = mysql.createConnection({
        host     : 'localhost',
        port     : 3306,
        user     : 'root',
        password : 'root',
        database : 'minhafeira'
    });
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('executou!');
    });
};