const express = require('express')
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.listen(port, () => {
    console.log('Executant-se a http://localhost:3001')
});

//const contractRouter = require('./api/routes/contract.js');
//const dbRouter = require('./api/routes/db.js'); //comentat ja que he tret el routes/db degut a falta de frontend

//app.use('/api/contract', contractRouter);
//app.use('/api/db', dbRouter); //comentat ja que he tret el routes/db degut a falta de frontend

// SCRIPT BORRAR TAULES
deleteTablesDBScript = require('./api/db/scripts/deleteTables');
deleteTablesDBScript.deleteTablesDB();

//SCRIPT PER CREAR TAULES
const createTablesScript = require('./api/db/scripts/createTables');
setTimeout(function(){
    createTablesScript.scanAbiAndCreateTables(0);
}, 1500);
setTimeout(function(){
    createTablesScript.scanAbiAndCreateTables(1);
}, 2000);


// SCRIPT INSERIR TRANSACTIONS
const insertTransactionsScript = require('./api/db/scripts/insertTransactions');
setTimeout(function(){
    insertTransactionsScript.scanBlockchainAndInsertTransactions();
}, 3000);

//SCRIPT PER CREAR VISTES
const createViewsScript = require('./api/db/scripts/createViews');
setTimeout(function(){
    createViewsScript.createAllViews();
}, 9000);


const updateDataBaseScript = require('./api/db/scripts/updateExistingDataBase');

//inicialitzem amb el primer Set de transaccions per poder comparar amb futurs i saber si hem d'actualitzar al DB
setTimeout(function(){
    updateDataBaseScript.initializeLastSetOfTransactions();
}, 9000);

//SCRIPT PER ACTUALITZAR
setTimeout(function(){
        setInterval(function(){
             console.log("Actualitzant...");
             updateDataBaseScript.updateDB();
         }, 5000);
}, 12000);

/*const {controllerProjectes} = require ('./api/controllers/controllerProjectes');

app.get('/activeProjects', (req,res) => {
    res.send("Checkejant projectes actius...")
});
app.post('/activeProjects', (req,res) => {
    console.log(req.body);
});*/
