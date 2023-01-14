const abiDecoder = require('abi-decoder');
const fs = require('fs');
const path = require('path');

const decodeTransaction = async (txData) => {
  let rawAbi = fs.readFileSync(path.resolve(__dirname, '../../assets/abi.json'));
  const testABI = JSON.parse(rawAbi);
  abiDecoder.addABI(testABI);

  const decodedData = abiDecoder.decodeMethod(txData);
  return (decodedData);
};

const decodeEventLog = async (logs, numContract) => {
  let rawAbi;
  if (numContract == 0){
     rawAbi = fs.readFileSync(path.resolve(__dirname, '../../assets/abiProjectManagement.json'));
  }
  else if (numContract == 1){
    rawAbi = fs.readFileSync(path.resolve(__dirname, '../../assets/abiDepartmentManagement.json'));
  }

  const testABI = JSON.parse(rawAbi);
  abiDecoder.addABI(testABI);

  const decodedLogs = abiDecoder.decodeLogs(logs);
  return decodedLogs;
};

module.exports = {
  decodeTransaction,
  decodeEventLog
};