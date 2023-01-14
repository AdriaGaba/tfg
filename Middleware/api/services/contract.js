const {getProjectManagementContractTransactions, getProjectManagementContractEventLogs,
    getDepartmentManagementContractTransactions, getDepartmentManagementContractEventLogs, getTransactionReceipt} = require('./etherscan');
const {decodeTransaction, decodeEventLog} = require('./abiDecoder');

const getContractTransactionsService = async () => {
    const data = await getProjectManagementContractTransactions();
    let transactions = [];

    for (let i = 0; i < data.result.length; i++) {
      let result = {};
      const decodedInput = await decodeTransaction(data.result[i].input);
      if (decodedInput != undefined) {
        result.name = decodedInput.name;
        result.params = decodedInput.params;
        result.timestamp = data.result[i].timeStamp;
        transactions.push(result);
      }
    }

    return transactions;
}

const getContractEventLogsService = async (numContract) => {
  let data = "";
  let transactions = [];
  if (numContract == 0){ // data = tx de project management
    data = await getProjectManagementContractTransactions();
  }
  if (numContract == 1){ // data = tx de department management
    data = await getDepartmentManagementContractTransactions();
  }

  for (let i = 0; i < data.result.length; i++) {
    let result = {};
    console.log("Contracte " + numContract + ": " + data.result[i].hash);
    let transactionReceipt = await getTransactionReceipt(data.result[i].hash);
    let decodedEventLog;
    if (transactionReceipt.message != "NOTOK" && transactionReceipt.result.logs.length > 0) {
      decodedEventLog = await decodeEventLog(transactionReceipt.result.logs, numContract);
      result.name = decodedEventLog[0].name;
      result.params = decodedEventLog[0].events;
      result.timestamp = data.result[i].timeStamp;
      transactions.push(result);
      console.log("Transacció afegida");
    }
  }

  return transactions;
}

const getContractLastLogService = async (numContract) => {
  var data = "";
  let transactions = [];
  if (numContract == 0){ // data = tx de project management
    data = await getProjectManagementContractTransactions();
  }
  if (numContract == 1){ // data = tx de department management
    data = await getDepartmentManagementContractTransactions();
  }

  for (let i = 0; i < data.result.length; i++) {
    let result = {};
    let transactionReceipt = await getTransactionReceipt(data.result[i].hash);
    let decodedEventLog;
    if (transactionReceipt.message != "NOTOK" && transactionReceipt.result.logs.length > 0) {
      decodedEventLog = await decodeEventLog(transactionReceipt.result.logs, numContract);
      result.name = decodedEventLog[0].name;
      result.params = decodedEventLog[0].events;
      result.timestamp = data.result[i].timeStamp;
      transactions.push(result);
    }
  }
  return transactions;
}

module.exports = {
  getContractTransactionsService,
  getContractEventLogsService,
  getContractLastLogService
}