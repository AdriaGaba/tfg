const {poolConfig} = require('../connect');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg/lib');

const createTableFromContractMethod = async (method) => {
  let query = 'CREATE TABLE ';
  if (method.name) query += method.name + '(';
  else query += 'constructor(';
  for (let param of method.inputs) {
    query += param.name;
    query += ' ';
    if (param.type === 'string') query += 'text';
    else if (param.type === 'address') query += 'text';
    else if (param.type === 'uint256') query += 'integer';
    query += ', ';
  }
  query += 'timestamp integer);';
  console.log(query);
  return query;
};

const scanAbiAndCreateTables = async (numContract) => { //s'utilitza aquesta funció per crear les taules
  const client = new Pool(poolConfig);
  client.connect();
  var rawAbi = "";
  if (numContract == 0){
    rawAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../assets/abiProjectManagement.json')));
  }
  if (numContract == 1){
    rawAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../assets/abiDepartmentManagement.json')));
  }
  for (let method of rawAbi) {
    if (method.anonymous === false) {
      let query = await createTableFromContractMethod(method);
      await client.query(query);
    }
  }
  client.end();
};

module.exports = {
  scanAbiAndCreateTables
};