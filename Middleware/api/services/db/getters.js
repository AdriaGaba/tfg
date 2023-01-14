const { Client } = require('pg/lib');
const {config} = require('../../db/connect');

const getActiveProjectsFromDb = async (introData) => {
  const client = new Client(config);
  const query = `SELECT *
    FROM projectesactius a
    WHERE (a.timestamp <= ${introData} AND a.e >= ${introData})
    ;`;
  try {
    client.connect();
    console.time('getActiveProjectsFromDb');
    const result = await client.query(query);
    console.timeEnd('getActiveProjectsFromDb');
    return result.rows;
  } catch (error) {
    console.error(error);
  }
}

const getAllDepartmentsFromDb = async () => {
  const client = new Client(config);
  const query = `SELECT DISTINCT s._d1 as departments
                 FROM public.start_project s
    ;`;
  try {
    client.connect();
    console.time('getAllDepartmentsFromDb');
    const result = await client.query(query);
    console.timeEnd('getAllDepartmentsFromDb');
    return result.rows;
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  getActiveProjectsFromDb
}