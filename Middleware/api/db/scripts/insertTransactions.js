const {config} = require('../connect');
const {getContractEventLogsService} = require('../../services/contract');
const { Client } = require('pg/lib');

const insertTransaction = async (tx) => {
  let position = 0;

  let columns = 'timestamp';
  let values = `${tx.timestamp}`;

  for (let param of tx.params) {
    columns += `, ${param.name}`; 
       
    if (param.type === 'string') {
      values += `, '${param.value}'`;
    } else if (param.type === 'address') {
      values += `, '${param.value}'`;
    } else {
      values += `, ${param.value}`;
    }

    position++;
  }

  let query = `INSERT INTO ${tx.name} (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;`;
  return query;
}

const scanBlockchainAndInsertTransactions = async () => { //nomes escaneja logs de la blockchain
  const client = new Client(config);
  client.connect();
  try {
    for (let numContract=0; numContract<2; numContract++){ //cada iteracio per la lectura de un contracte
            const transactions = await getContractEventLogsService(numContract);
            for (let tx of transactions) {
              let query = await insertTransaction(tx);
              await client.query(query);
            }
    }
  } catch (error) {
    console.log(error);
  }
  client.end();
};

const insertLastTransaction = async (tx) => { //insereix la última tx del contracte
  const client = new Client(config);
  client.connect();
  try {
      let query = await insertTransaction(tx);
      console.log(query);
      await client.query(query);
  } catch (error) {
    console.log(error);
  }
  client.end();
};



module.exports = {
  scanBlockchainAndInsertTransactions,
  insertLastTransaction
};