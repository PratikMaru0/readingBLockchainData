const { ethers } = require("ethers");
const { createPool } = require("mysql");

const INFURA_ID = "";  // Please enter INFURA ID.
const provider = new ethers.providers.JsonRpcProvider(
  `https://kovan.infura.io/v3/${INFURA_ID}`
);

// For Database
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "Maru80762.@",
  database: "blockentry",
  connectionLimit: 10,
});

const main = async () => {
  // .... Wallet Address creation.
  var addresses = [
    "0xaB523b56fb94466FBEB11ECC6dbEc9ED40a2efE0",
    "0x96f79b13Acd37aa13F9eebfFF62e96628af260FC",
    "0xf79652824CAeCa4f0f243490C9a807F1D2BaC446",
    "0xc0A57bBeb6651A9f59bd831CC130a750db51ed69",
    "0xc6c50FE89dE8929734738E4a5B146736b1e1De63",
    "0x2B4963faa13AA37D82812d55531aF32Fb1B72273",
    "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "0x5D0Aeb8EeB92741961AfA332F880917f104fa3AD",
    "0xc015bcf1Ca3f704E717D34741f3eBdE6B131b396"
  ];

  var block = await provider.getBlockNumber();
  // block = 32099713;
  console.log(block);

  const blockInfo = await provider.getBlock(block);
  // console.log(blockInfo);

  const { transactions } = await provider.getBlockWithTransactions(block);
  // console.log(transactions[0]);
  var arr = [];
  for (var i = 0; i < transactions.length; i++) {
    const trxns = transactions[i];
    arr.push(trxns.to);
  }

  // .... For Testing purposes.
  // for(var i=0;i<arr.length;i++){
  // console.log(arr[i]);
  // }

  // .... For Block table.
  var blockHashArr = [];
  var parentHashArr = [];
  var timeStamp = [];
  var processArr = [];

  // .... For Transaction table.
  var transactions_hash = [];
  var fromAddress = [];
  var toAddress = [];
  var amount = [];
  // var timeStamp = [];

  let count = 0;

  // For Blocks Table.
  for (var i = 0; i < addresses.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (addresses[i] == arr[j]) {
        const trxnsObj = transactions[j];
        const blockObj = blockInfo;
        blockHashArr[count] = blockObj.hash;
        parentHashArr[count] = blockObj.parentHash;
        timeStamp[count] = blockObj.timestamp;
        transactions_hash[count] = trxnsObj.hash;
        fromAddress[count] = trxnsObj.from;
        toAddress[count] = trxnsObj.to;
        amount[count] = trxnsObj.value;
        // processArr[count] = processArr[count]++;
        processArr[count] = 0; // FIXME: Didn't understood what it means.
        count++;
      }
    }
  }

  // TODO: For testing purposes.
  // for(var i=0;i<=count;i++){
  //     console.log(`BlockHash : ${blockHashArr[i]} , ParentHash : ${parentHashArr[i]}`);
  // }

  // Inserting the values inside "BLOCKS" database.
  for (let i = 0; i < count; i++) {
    var _blockHash = blockHashArr[i];
    var _parentHashArr = parentHashArr[i];
    var _timeStamp = timeStamp[i];
    var _processArr = processArr[i];
    pool.query(
      `INSERT INTO BLOCKS(BLOCK_HASH,PARENT_HASH,TIMESTAMP,PROCESS) VALUES ( "${_blockHash}","${_parentHashArr}","${_timeStamp}","${_processArr}");`,
      (err, result, fields) => {
        if (err) {
          return console.log(err);
        }
        return console.log(result);
      }
    );
  }

  // Inserting the values inside "TRANSACTIONS" database.
  for (let i = 0; i < count; i++) {
    var _transactionHash = transactions_hash[i];
    var _fromAddress = fromAddress[i];
    var _toAddress = toAddress[i];
    var _amount = amount[i];
    var _timeStamp = timeStamp[i];
    pool.query(
      `INSERT INTO TRANSACTIONS(TRANSACTION_HASH,FROMADDRESS,TOADDRESS,AMOUNT,TIMESTAMP) VALUES ( "${_transactionHash}","${_fromAddress}","${_toAddress}","${_amount}",${_timeStamp});`,
      (err, result, fields) => {
        if (err) {
          return console.log(err);
        }
        return console.log(result);
      }
    );
  }
};

main();

// Database Entry. (Structure of the tables.)
// TODO: Table blocks.
// CREATE TABLE BLOCKS (ID INT PRIMARY KEY AUTO_INCREMENT, BLOCK_HASH TEXT, PARENT_HASH TEXT, TIMESTAMP INT, PROCESS INT);
//  INSERT INTO BLOCKS(BLOCK_HASH,PARENT_HASH,TIMESTAMP,PROCESS) VALUES ('234rtyhgfrtgfd','1234tref',1234,4);

// TODO: Table tranactions.
// CREATE TABLE TRANSACTIONS(ID INT PRIMARY KEY AUTO_INCREMENT, TRANSACTION_HASH TEXT, FROMADDRESS TEXT, TOADDRESS TEXT, AMOUNT INT, TIMESTAMP BIGINT);
