const {config} = require('../connect');
const { Client } = require('pg/lib');

const deleteTablesDB = async () => {
    //console.log("Deleting...");
    const client = new Client(config);
    client.connect();
    await client.query(`DROP SCHEMA public CASCADE;
                 CREATE SCHEMA public;`);
    client.end();
    //console.log("Deleted!");
    return true;
}

module.exports = {
    deleteTablesDB
}