const express = require('express');
const router = express.Router();
require('dotenv').config();
// const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//         host : '127.0.0.1',
//         port : 3306,
//         user : 'root',
//         password : '',
//         database : 'unityserver'
//     }
// })
const infuraKey = process.env.REACT_INFURA_KEY;
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : process.env.user,
        password : process.env.password,
        database : process.env.database
    }
})

// add a new hashVal to database
router.post('/saveHash',async function (req, res) {
    var address  = req.body.address.toString().toLowerCase();
    var hash = req.body.hash;
    var type = req.body.type;
    if(hash == null || address == null || type == null){
        res.send(false);
    }
    else{
        if(address.length == 42 && address.substring(0,2) == "0x"){
            try{
                await knex('tbl_hash').where({"address":address , "type":type})
                    .update({transactionHash: hash}).then(async function (count) {
                        if(count == 0 ){
                            await knex('tbl_hash').insert({
                                    address: address,
                                    transactionHash: hash,
                                    type: type
                                    
                                }).then(function (count) {
                                    res.send(true);
                                }); 
                        }
                        else{
                            res.send(true);
                        }
                })
            }
            catch{
                res.send(false);
            }            
        }
        else{
            res.send(false);
        }   
    }  
});

// add a new transaction result to database
router.post('/saveTransactionResult',async function (req, res) {
    var address  = req.body.address;
    var result = req.body.result;
    var contract = req.body.contract;
    if(result == null || address == null || contract == null){
        res.send(false);
    }
    else{
        if(address.length == 42 && address.substring(0,2) == "0x"){
            try{
                await knex('tbl_transaction').where({"address":address , "contract":contract})
                    .update({result: result}).then(async function (count) {
                        if(count == 0 ){
                            await knex('tbl_transaction').insert({
                                    address: address,
                                    result: result,
                                    contract: contract
                                    
                                }).then(function (count) {
                                    res.send(true);
                                }); 
                        }
                        else{
                            res.send(true);
                        }
                })
            }
            catch{
                res.send(false);
            }            
        }
        else{
            res.send(false);
        }   
    }  
});

router.get('/getTransactionResult',async function (req, res) {
    var address  = req.body.address.toString().toLowerCase();
    var contract = req.body.contract;
    if(address == null || contract == null){
        res.send("fail");
    }
    else{
        if(address.length == 42 && address.substring(0,2) == "0x"){
            try{
                var rows = await knex('tbl_transaction')
                    .where({"address":address , "contract":contract})
                    .select(knex.raw('result as RESULT'));                
                if(rows.length == 0 ){
                    res.send("fail");
                }
                else{
                    res.send(rows[0].RESULT);
                }
            }
            catch{
                res.send("fail");
            }            
        }
        else{
            res.send("fail");
        }   
    }  
});

router.get('/getHash',async function (req, res) {
    var address  = req.body.address.toString().toLowerCase();
    var type = req.body.type;
    if(address == null || type == null){
        res.send("fail");
    }
    else{
        if(address.length == 42 && address.substring(0,2) == "0x"){
            try{
                var rows = await knex('tbl_hash')
                    .where({"address":address , "type":type})
                    .select(knex.raw('transactionHash as HASH'));                
                if(rows.length == 0 ){
                    res.send("fail");
                }
                else{
                    res.send(rows[0].HASH);
                }
            }
            catch{
                res.send("fail");
            }            
        }
        else{
            res.send("fail");
        }   
    }  
});

module.exports = router;