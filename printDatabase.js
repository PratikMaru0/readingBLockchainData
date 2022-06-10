// File to check the data of the database.

// TODO: Table blocks.
// CREATE TABLE BLOCKS (ID INT PRIMARY KEY AUTO_INCREMENT, BLOCK_HASH TEXT, PARENT_HASH TEXT, TIMESTAMP INT, PROCESS INT);
//  INSERT INTO BLOCKS(BLOCK_HASH,PARENT_HASH,TIMESTAMP,PROCESS) VALUES ('234rtyhgfrtgfd','1234tref',1234,4);

// TODO: Table tranactions.
// CREATE TABLE TRANSACTIONS(ID INT PRIMARY KEY AUTO_INCREMENT, TRANSACTION_HASH TEXT, FROMADDRESS TEXT, TOADDRESS TEXT, AMOUNT INT, TIMESTAMP BIGINT);

const {createPool} = require("mysql");

const pool = createPool({
    host:"localhost",
    user:"root",
    password:"Maru80762.@",
    database:"blockentry",
    connectionLimit: 10
})

pool.query('select * from blocks',(err,result,fields)=> {
    if(err){
        return console.log(err);
    }
    return console.log(result);
});