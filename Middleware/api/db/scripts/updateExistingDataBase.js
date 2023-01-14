const {config} = require('../connect');
const {getContractTransactionsService, getContractEventLogsService, getContractLastLogService} = require('../../services/contract');
const {getEthereumContractTransactions, getTransactionReceipt} = require('../../services/etherscan');
const { Client } = require('pg/lib');

var lastTransactionProjectManagement = ''; //guardem l'últim paquet de transaccions per poder comparar amb el nou i veure si és necessari actualitzar la DB
var lastTransactionDepartmentManagement = ''; //guardem l'últim paquet de transaccions per poder comparar amb el nou i veure si és necessari actualitzar la DB

const initializeLastSetOfTransactions = async () => {
    for (let numContract = 0; numContract < 2; numContract++){
        let aux = await getContractLastLogService(numContract); // lastSetOfTransactions = antiga array de  tx
        if (numContract == 0){
            lastTransactionProjectManagement = aux[aux.length - 1];
        }
        if (numContract == 1){
            lastTransactionDepartmentManagement = aux[aux.length - 1];
        }
    }
}

const updateDB = async () => {
  const client = new Client(config);
  client.connect();
  try {
    for (let numContract = 0; numContract < 2; numContract++){
        let aux = await getContractLastLogService(numContract); // currentSetOfTransactions = nova array de  tx
        let currentSetOfTransactions = aux[aux.length - 1];
        let lastSetOfTransactions = "";
        if (numContract == 0){
            lastSetOfTransactions = lastTransactionProjectManagement;
        }
        else if (numContract == 1){
            lastSetOfTransactions = lastTransactionDepartmentManagement;
        }
        /*console.log("Instant de l'actual última transacció: -----------------------------------------");
        console.log(currentSetOfTransactions.timestamp);
        console.log("Instant de l'antiga última transacció: -----------------------------------------");
        console.log(lastSetOfTransactions.timestamp);*/

        if (currentSetOfTransactions.timestamp > lastSetOfTransactions.timestamp){
            console.log("ACTUALITZACIONS DETECTADES!");

            // SCRIPT INSERIR LA NOVA TRANSACCIÓ
            const insertTransactionsScript = require('./insertTransactions');
            await insertTransactionsScript.insertLastTransaction(currentSetOfTransactions);

            console.log("Base de dades actualitzada");
            if (numContract == 0){
                lastTransactionProjectManagement = currentSetOfTransactions;
            }
            else if (numContract == 1){
                lastTransactionDepartmentManagement = currentSetOfTransactions;
            }
        }
        else{
            if (numContract == 0){
                console.log("No hi han actualitzacions en Project Management ")
            }
            if (numContract == 1){
                console.log("No hi han actualitzacions en Department Management")
            }

        }
    }
  } catch (error) {
    console.log(error);
  }
  client.end();
};

module.exports = {
    updateDB,
    initializeLastSetOfTransactions
}