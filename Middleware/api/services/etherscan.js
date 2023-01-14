const axios = require('axios');

const getProjectManagementContractTransactions = async () => {
  const contractAddress = '0xF65382Ad9f0c37a58a850aA9dfbA0d43e1c43Ecb'; //Project Management contract
  const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=999999999&sort=asc&apikey=DCT856JQAQ91VXCQQYV5TUDKN2UIUKPWGW`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) return response.data;
    else throw (new Error('unable to reach etherscan API'))
  } catch (error) {
    console.error(error);
  }
}

const getProjectManagementContractEventLogs = async () => {
  const contractAddress = '0xF65382Ad9f0c37a58a850aA9dfbA0d43e1c43Ecb'; //Project Management contract
  const url = `https://api-goerli.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${contractAddress}&apikey=DCT856JQAQ91VXCQQYV5TUDKN2UIUKPWGW`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) return response.data;
    else throw (new Error('unable to reach etherscan API'))
  } catch (error) {
    console.error(error);
  }
}

const getDepartmentManagementContractTransactions = async () => {
  const contractAddress = '0xbd0de51ca063F3F45B5197E0C28B5f6D1b142B85'; //Department Management contract
  const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=999999999&sort=asc&apikey=8UGA5ZB4G51Z6IPFDCTJFRYWJG8WYE9EE8`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) return response.data;
    else throw (new Error('unable to reach etherscan API'))
  } catch (error) {
    console.error(error);
  }
}

const getDepartmentManagementContractEventLogs = async () => { //Department Management contract
  const contractAddress = '0xbd0de51ca063F3F45B5197E0C28B5f6D1b142B85';
  const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=999999999&sort=asc&apikey=8UGA5ZB4G51Z6IPFDCTJFRYWJG8WYE9EE8`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) return response.data;
    else throw (new Error('unable to reach etherscan API'))
  } catch (error) {
    console.error(error);
  }
}

const getTransactionReceipt = async (txHash) => {
  const url = `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=XZG48NK8VNVC9EEVDT56VIE63MC17YEXQU`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) return response.data;
    else throw (new Error('unable to reach etherscan API'))
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getProjectManagementContractTransactions,
  getProjectManagementContractEventLogs,
  getDepartmentManagementContractTransactions,
  getDepartmentManagementContractEventLogs,
  getTransactionReceipt
}