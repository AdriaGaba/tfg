const { StatusCodes } = require('http-status-codes');

const {
  getContractTransactionsService
} = require('../services/contract');

const getContractTransactions = async (req, res, next) => {
  try {
    const info = await getContractTransactionsService();
    res.status(StatusCodes.OK).json(info);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getContractTransactions
}