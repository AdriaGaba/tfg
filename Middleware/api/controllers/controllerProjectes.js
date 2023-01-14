const { StatusCodes } = require('http-status-codes');

const {
  getActiveProjectsFromDb
} = require('../services/db/getters');

/*const emptyResult = {
  message: 'Les dades introduïdes són incorrectes'
}*/

const getActiveProjectsByDate = async (req, res, next) => {
  const introData = req.query.introData;
  try {
    const info = await getActiveProjectsFromDb(introData);
    if (info.length > 0) {
      res.status(StatusCodes.OK).json(info);
    } else {
      console.log("Les dades son incorrectes");
    }
  } catch (error) {
    next(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(info);
  }
};

module.exports = {
  getActiveProjectsByDate
}