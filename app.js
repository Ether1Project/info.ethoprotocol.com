"use strict";


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var logger = require("./logger");
const CoinMarketCap = require('coinmarketcap-api');
const tabletojson = require('tabletojson').Tabletojson;
const got = require('got');
const cheerio = require('cheerio');

const ethofsSDK = require('@ethoprotocol/sdk');
const ethofs = ethofsSDK();
const { Octokit } = require("@octokit/core");

const puppeteer = require('puppeteer');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ethoprotocol.com'));



const {MISC_ensureAuthenticated, MISC_validation, MISC_makeid, MISC_maketoken, MISC_checkOrigin} = require('./misc');

// Init email setup
const Email = require('email-templates');

// Default using the Atheios contact mail, but that can be overwritten
global.email = new Email({
  message: {
    from: 'info@pinable.org'
  },
  // uncomment below to send emails in development/test env:
  send: true,
  preview: false,
  transport: {
    host: config.NODEMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: config.NODEMAIL_USER, // generated user
      pass: config.NODEMAIL_PASS // generated password
    },
    tls: {
      rejectUnauthorized: false
    }
  }});

// Define the globals
global.debugon=true;
global.version="2.01";


// Init database
if (global.config.development) {
  global.baseurl="http://localhost:"+global.config.PORT;
}
else {
  global.baseurl="https://info.ethoprotocol.com";
};

// Instatiate database
const Database=require('./database');
global.pool=new Database();

// Define express and routes
let indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
// Set Bootstrap Folder
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
// Set Bootstrap Folder
app.use(express.static(path.join(__dirname, 'node_modules/jquery')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



app.use( (req, res, done) => {
//  logger.info("#server.app: URL: %s", req.originalUrl);
  done();
});

app.use(express.json());
app.set('json spaces', 2)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  logger.error('#server.app.use: Error %s', err.message);
  
  res.locals.message = err.message;
  res.locals.error = config.development ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  
  res.render('error', {
    title: ""
  });
  
});


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

email
  .send({
    template: 'restart',
    message: {
      to: 'info@pinable.io'
    },
    locals: {
      name: 'Frank',
      date: pool.mysqlNow()
    }
  })
  .then(logger.info("#server.app: Restart email sent."))
  .catch(console.error);


async function read_repos(octokit, res, page, fullname) {
  
  await octokit.request('GET /orgs/{org}/repos', {
    org: 'Ether1Project',
    page: page
  }).then(async (ok) => {
    let i;
    let data;
    for (i=0;i<ok.data.length;i++) {
      fullname.push(ok.data[i].full_name);
      console.log(ok.data[i].full_name);
    }
    let headers=ok.headers.link.split(",");
    for (i=0;i<headers.length;i++) {
      if (headers[i].search("; rel=\"next\"")>0) {
        data=headers[i].match(/page=(\d*)/);
        res+=await read_repos(octokit, res, data[1], fullname);
      }
    }
    res=0.0+res+ok.data.length;
  });
  return(res);
}

async function countGithub(octokit, repos) {
  console.log(repos);
  await octokit.request('GET /repos/{owner}/{repo}/stats/participation', {
    owner: "Ether1Project",
    repo: repos
  }).then(async (ok) => {
    console.log(ok.data.all);
  })
    .catch((error)=>{
      logger.error('#server.app.read_repos: Error %s', error);
    })
}


// Aimed to be run every 24 hours
async function update1hrsDatabase() {
  let i;
  let repo_nrOfRepos;
  let repo_names = [];
  let sql;
  let prevrow, rows;
  let wETHO;
  let wETHOBSC=[];
  let stats;
  
  // Reduce database to 720 entries
  sql = "DELETE FROM info WHERE DATE(date) < (curdate() - INTERVAL 60 DAY)";
  await pool.query(sql)
    .then((result) => {
      logger.info("#server.app.update1hrsdatabase: Reducing DB with %s", result.affectedRows);
    })
    .catch(function (error) {
        logger.error("#server.app.update1hrsdatabase: Error: %s", error);
      })
  
    
  let vsql = "SELECT *,TIMESTAMPDIFF(SECOND, date, UTC_TIMESTAMP()) AS secs FROM info ORDER BY id DESC LIMIT 1";
  logger.info("#server.app.update1hrsdatabase: %s", vsql);
  await pool.query(vsql)
    .then(async (prevrow) => {
      if (prevrow.length==0) {
        let preset={
          secs: 3600,
        }
        logger.info("#server.app.update1hrsdatabase: Server was offline and no older data is available.");
        prevrow.push(preset);
      }
      logger.info('#server.app.update1hrsDatabase: Timeout %s', prevrow[0].secs);
      if (prevrow[0].secs > 3500 || config.development) {
        
        
        // We start with fetching the last dataset
        // In case we have issues with any dataset we keep the old one to have a more consistent behaviour
        sql = 'SELECT * FROM info ORDER BY id DESC LIMIT 1;'
        logger.info("#server.app.update1hrsdatabase: Fetching old data set %s", sql);
        
        prevrow = await pool.query(sql)
          .then(function (rows) {
            return (rows);
          })
          .catch(function (error) {
            logger.error("#server.app.update1hrsdatabase: Error: %s", error);
          })
        
        
        /*
            const octokit = new Octokit({ auth: config.GITHUB });
        
            
            repo_nrOfRepos=await read_repos(octokit, 0, 1, repo_names);
            logger.info("#server.app.update1hrsDatabase: Nr of Repos %s",repo_nrOfRepos);
            
            let repo_info;
            let name;
            for (i=0;i<repo_names.length;i++) {
                console.log(repo_names[i]);
                name=repo_names[i].split("/");
                repo_info=await countGithub(octokit, name[1]); // or count anything you like
                console.log(repo_info);
            
            }
        */
        
        let discordMembers = 0;
        // await got('http://95.111.230.192:8080/rest/guild')
        //     .then((res) => {
        //         let result = JSON.parse(res.body);
        //         for (i = 0; i < result.guild.length; i++) {
        //             if (result.guild[i].guildId == '426241424229662721') {
        //                 discordMembers = result.guild[i].guildMember;
        //                 break;
        //             }
        //         }
        //         logger.info('#server.app.update1hrsDatabase: Discord members %s', discordMembers);
        //     }).catch((e)=> {
        //       logger.error("Can't fetch discord data: %s", e);
        //   });
  
  
        await got('https://api.ethplorer.io/getTokenInfo/0x99676c9fa4c77848aeb2383fcfbd7e980dc25027?apiKey=' + config.ETHPLORERKEY)
          .then((res) => {
            wETHO = JSON.parse(res.body);
          })
          .catch((error) => {
            logger.error("#server.app.update1hrsdatabase: Can't fetch data: Error: %s", error);
            wETHO.totalSupply = prevrow[0].wetho_totalSupply;
            wETHO.transfersCount = prevrow[0].wetho_transfersCount;
            wETHO.holdersCount = prevrow[0].wetho_holdersCount;
          })
  
        logger.info("#server.app.update1hrsdatabase: wETHO totalSupply=%s", wETHO.totalSupply);
        logger.info("#server.app.update1hrsdatabase: wETHO wetho_transfersCount=%s", wETHO.transfersCount);
        logger.info("#server.app.update1hrsdatabase: wETHO wetho_holdersCount=%s", wETHO.holdersCount);
  
        logger.info("#server.app.update1hrsdatabase: BSC scraping");
  
        wETHOBSC.totalsupply=0;
        wETHOBSC.transfersCount=0;
        wETHOBSC.holdersCount=0;
        
        // await got('https://bscscan.com/token/0x48b19b7605429acaa8ea734117f39726a9aab1f9')
        //   .then((res) => {
        //     let result;
        //     const $=cheerio.load(res.body);
        //     const list=[];
        //     const search=$('div[class="card h-100"]').find('Holders').each(function (index, element) {
        //       if ($(element)!="")
        //         list.push($(element));
        //     });
        //     console.dir(list);
        //     wETHOBSC.totalsupply=0;
        //     wETHOBSC.transfersCount=0;
        //     wETHOBSC.holdersCount=0;
        //
        //   })
        //   .catch((error) => {
        //     logger.error("#server.app.update1hrsdatabase: Can't fetch data: Error: %s", error);
        //     wETHO.totalSupply = prevrow[0].wetho_totalSupply;
        //     wETHO.transfersCount = prevrow[0].wetho_transfersCount;
        //     wETHO.holdersCount = prevrow[0].wetho_holdersCount;
        //   })
        
        logger.info("#server.app.update1hrsdatabase: wETHOBSC totalSupply=%s", wETHOBSC.totalsupply);
        logger.info("#server.app.update1hrsdatabase: wETHOBSC wetho_transfersCount=%s", wETHOBSC.transfersCount);
        logger.info("#server.app.update1hrsdatabase: wETHOBSC wetho_holdersCount=%s", wETHOBSC.holdersCount);
  
  
        let wETHO_holder;
        let exchange_kucoin = 0;
        await got('https://api.ethplorer.io/getTopTokenHolders/0x99676c9fA4c77848aEb2383fCFbD7e980dC25027?apiKey=' + config.ETHPLORERKEY)
          .then((res) => {
            wETHO_holder = JSON.parse(res.body);
            for (i = 0; i < wETHO_holder.holders.length; i++) {
              if (wETHO_holder.holders[i].address == "0xa1d8d972560c2f8144af871db508f0b0b10a3fbf" ||
                wETHO_holder.holders[i].address == "0x495f8bdacfbe7347131b7f8fd240d903daa2cc44" ||
                wETHO_holder.holders[i].address == "0xd6216fc19db775df9774a6e33526131da7d19a2c") {
                exchange_kucoin += wETHO_holder.holders[i].balance / 1E18;
              }
            }
          })
          .catch((error) => {
            logger.error("#server.app.update1hrsdatabase: Can't fetch data: Error: %s", error);
            exchange_kucoin = prevrow[0].etho_exchange_kucoin;
          });
        logger.info("#server.app.update1hrsdatabase: exchange_kucoin %s", exchange_kucoin);
        
        // Fetch node stats
        logger.info("#server.app.update1hrsDatabase: Fetching network stats ...");
        stats= await got('https://api.ethoprotocol.com/api?module=basic&action=network_stats')
          .then((res) => {
            let result = JSON.parse(res.body);
            console.log(result);
            return (result);
          })
          .catch((error) => {
            let stats=[];
            logger.error("#server.app.update1hrsDatabase: Fetching node stats: Error %s", error);
            stats.activeUploadContracts = prevrow[0].etho_activeUploadContracts;
            stats.totalNetworkStorageUsed = prevrow[0].etho_totalNetworkStorageUse;
            stats.networkStorageAvailable = prevrow[0].etho_networkStorageAvailable;
            stats.active_gatewaynodes = prevrow[0].etho_active_gatewaynodes;
            stats.active_masternodes = prevrow[0].etho_active_masternode;
            stats.active_servicenodes = prevrow[0].etho_active_servicenodes;
            stats.gatewaynode_reward = prevrow[0].etho_gatewaynode_reward;
            stats.masternode_reward = prevrow[0].etho_masternode_reward;
            stats.servicenode_reward = prevrow[0].etho_servicenode_reward;
            console.log(stats);
            return (stats);
          })
  
        logger.info("#server.app.update1hrsDatabase: pinStorage");
  
        // Overwrite the storage contracts with an own call
        const pinStorageContractAddress = '0xD3b80c611999D46895109d75322494F7A49D742F';
        const pinStorageABI = JSON.parse('[{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"changeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"set","type":"uint32"}],"name":"SetReplicationFactor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pin","type":"string"}],"name":"PinRemove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deleteContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pin","type":"string"},{"name":"size","type":"uint32"}],"name":"PinAdd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"PinCount","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ReplicationFactor","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"Pins","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pin","type":"string"}],"name":"GetPinSize","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
        
        const pinContract = new web3.eth.Contract(
          pinStorageABI,
          pinStorageContractAddress
        );
        
        await pinContract.methods.PinCount().call((err, count) => {
          if (err) {
            logger.error('cant get contracts Count ');
          }
          // for (let i =0; i <= count; i++) {
          // pinContract.methods.Pins(0).call((err, hash) => {
          // if(err){
          // console.error('cant get contract hash ');
          // }
          // console.log(hash)
          // pinContract.methods.GetPinSize(hash).call((err, size) => {
          // if (size !== '5000') {
          // console.log(i,hash,size)
          // };
          
          // })
          
          // })
          // if (i > 10) {
          // break
          // }
          // }
          stats.activeUploadContracts = count;
          stats.totalNetworkStorageUsed = Math.round(count / 101.649142 * 1E9);
        })
        logger.info("#server.app.update1hrsDatabase: %s", stats.activeUploadContracts);
        logger.info("#server.app.update1hrsDatabase: %s", stats.totalNetworkStorageUsed);
        logger.info("#server.app.update1hrsDatabase: %s", stats.networkStorageAvailable);
        logger.info("#server.app.update1hrsDatabase: %s", stats.active_gatewaynodes);
        logger.info("#server.app.update1hrsDatabase: %s", stats.active_masternodes);
        logger.info("#server.app.update1hrsDatabase: %s", stats.active_servicenodes);
        
        // Fetch info from exchanges
        let exchange_stex = 0;
        let exchange_graviex = 0;
        let exchange_mercatox = 0;
        let exchange_probit = 0;
        let etho_devfund = 0;
        let etho_devfund2 = 0;
        let etho_masterfund = 0;
        let etho_faucetfund = 0;
        logger.info("#server.app.update1hrsDatabase: Fetching data from exchanges...");
        await got('https://explorer.ethoprotocol.com/api?module=account&action=eth_get_balance&address=0xFBd45D6ED333c4ae16d379ca470690E3F8d0D2a2')
          .then((res) => {
            let bd = JSON.parse(res.body);
            exchange_stex = parseInt(bd.result / 1E18);
            logger.info("STEX: %s ETHO", exchange_stex); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            exchange_stex = prevrow[0].etho_exchange_stex;
          })
        await got('https://explorer.ethoprotocol.com/api?module=account&action=eth_get_balance&address=0x548833f13d6bf156260f6e1769c847991c0f6324')
          .then((res) => {
            let bd = JSON.parse(res.body);
            exchange_graviex = parseInt(bd.result / 1E18);
            logger.info("Graviex: %s ETHO", exchange_graviex); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            exchange_graviex = prevrow[0].etho_exchange_graviex;
          })
        await got('https://explorer.ethoprotocol.com/api?module=account&action=eth_get_balance&address=0xccdbbb5d42e631ea6b040dee17fa78232ec4c87e')
          .then((res) => {
            let bd = JSON.parse(res.body);
            exchange_mercatox = parseInt(bd.result / 1E18);
            logger.info("Mecatox: %s ETHO", exchange_mercatox); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            exchange_mercatox = prevrow[0].etho_exchange_mercatox;
          })
        await got('https://explorer.ethoprotocol.com/api?module=account&action=eth_get_balance&address=0xe2c8cbec30c8513888f7a95171ea836f8802d981')
          .then((res) => {
            let bd = JSON.parse(res.body);
            etho_devfund = parseInt(bd.result / 1E18);
            logger.info("Devfund: %s ETHO", etho_devfund); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            etho_devfund = prevrow[0].etho_devfund;
          })
        await getBalance('0xBA57dFe21F78F921F53B83fFE1958Bbab50F6b46')
          .then((res) => {
            etho_devfund2 = parseInt(res / 1E18);
            logger.info("Devfund2: %s ETHO", etho_devfund2); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            etho_devfund2 = prevrow[0].etho_devfund2;
          })
  
        await getBalance('0x00C41297cCEbe446AAbc154F32b16aEDE14E50aB')
          .then((res) => {
            etho_masterfund = parseInt(res / 1E18);
            logger.info("Devfund: %s ETHO", etho_masterfund); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            etho_masterfund = prevrow[0].etho_masterfund;
          })
  
        await getBalance('0xE6155872B3Aa90F156f87D389caeA26D577BE459')
          .then((res) => {
            etho_faucetfund = parseInt(res / 1E16);
            logger.info("Faucetfund: %s ETHO", etho_faucetfund); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.udate1hrsDatabase: %s", error);
            etho_faucitfund = prevrow[0].etho_faucetfund;
          })
        
        await got('https://explorer.ethoprotocol.com/api?module=account&action=eth_get_balance&address=0xe82e114833c558496b7d2405584c5a2286b9170e')
          .then((res) => {
            let bd = JSON.parse(res.body);
            exchange_probit = parseInt(bd.result / 1E18);
            logger.info("Exchange Probit: %s ETHO", exchange_probit); // Print the json response
          })
          .catch((error) => {
            logger.info("#server.app.update1hrsDatabase: %s", error);
            exchange_probit = prevrow[0].etho_exchange_probit;
          })
        logger.info("#server.app.update1hrsDatabase: %s", exchange_stex);
        logger.info("#server.app.update1hrsDatabase: %s", exchange_graviex);
        logger.info("#server.app.update1hrsDatabase: %s", exchange_mercatox);
        logger.info("#server.app.update1hrsDatabase: %s", exchange_probit);
        logger.info("#server.app.update1hrsDatabase: %s", etho_devfund);
        logger.info("#server.app.update1hrsDatabase: %s", etho_devfund2);
        logger.info("#server.app.update1hrsDatabase: %s", etho_faucetfund);
        logger.info("#server.app.update1hrsDatabase: %s", etho_masterfund);
  
        logger.info("#server.app.update1hrsDatabase: Fetch diff and hashrate");
        let difficulty = 0;
        let hashrate = 0;
        
        await getNetworkStats(10)
          .then((res)=>{
            difficulty = res.difficulty;
            hashrate = res.hashrate;
          })
          .catch((error)=>{
            logger.error("#server.app.update1hrsDatabase: No data: %s", error);
          })
        
        logger.info("#server.app.update1hrsDatabase: difficulty: %s", difficulty);
        logger.info("#server.app.update1hrsDatabase: hashrate: %s", hashrate);
        
        // Check first if the latest entry is larger than 1 hour back
        
        
        await puppeteer.launch({}).then(async (browser) => {
          let etho_richlist = [];
          // First we get previous entry
          
          const page = await browser.newPage();
          
          await page.goto('https://richlist.ethoprotocol.com', {
            waitUntil: 'networkidle0',
          })
            .then(async () => {
              logger.info("Success");
              await page.content().then(async (html) => {
                // Fetch richlist and do some magic
                let json;
                let tablesAsJson = tabletojson.convert(html);
                let i;
                for (i = 0; i < tablesAsJson[0].length; i++) {
                  switch (tablesAsJson[0][i].Address.slice(0, 42)) {
                    case '0xfbd45d6ed333c4ae16d379ca470690e3f8d0d2a2':
                    case '0x548833f13d6bf156260f6e1769c847991c0f6324':
                    case '0xccdbbb5d42e631ea6b040dee17fa78232ec4c87e':
                    case '0xe2c8cbec30c8513888f7a95171ea836f8802d981':
                      // Probit wallet 2
                    case '0xe82e114833c558496b7d2405584c5a2286b9170e':
                    case '0x2edfef4716612b705993c73e69728beb6e28c57f':
                      // ERC20
                    case '0x370f083A3c4794DDBb49cfB4E7C7e09B37d57545':
                      // BEP20
                    case '0xcC00694b3D51A53b8d2a96285496675cdbeD97fA':
                      // New dev fund
                    case '0xBA57dFe21F78F921F53B83fFE1958Bbab50F6b46':
                      // STEX
                    case '0xFBd45D6ED333c4ae16d379ca470690E3F8d0D2a2':
                      // Probit
                    case '0x930e5e100489069B088e6E2f26f4CB17de4be298':
                      break;
                    default:
                      let addr;
                      if(tablesAsJson[0][i].Address.slice(0, 2)=='0x') {
                        addr=tablesAsJson[0][i].Address.slice(0, 42);
                      } else {
                        addr=tablesAsJson[0][i].Address.split('\n')[0];
                      }
                      etho_richlist.push({
                        add: addr,
                        bal: parseInt(tablesAsJson[0][i].Balance.replace(/,/g, '').split('.'))
                      });
                      break;
                  }
                }
              })
                .catch((error) => {
                  logger.error("#erver.app.update1hrsDatabase: Error: %s", error);
                })
            })
            .catch((error) => {
              logger.error("#erver.app.update1hrsDatabase: Error: %s", error);
              
              etho_richlist.push(JSON.parse(inforows[0].etho_richlist));
              logger.error("Fail", inforows);
              
            })
          
          
          // Fetch exchange status
          
          
          // Fetch relevant data from CMC
          const apiKey = config.CMCAPIKEY;
          const client = new CoinMarketCap(apiKey);
          
          client.getQuotes({symbol: 'ETHO,SC,FIL,STORJ'}).then(async (jsonarr) => {
            if (jsonarr.status.error_code == 0) {
              // we have valid data
              // Here we fetch the position from the CMC server and track it
              
              // As long ETHO circulating supply is not fixed
              // therefore we take it from our API
              await got('https://api.ethoprotocol.com/api?module=basic&action=supply')
                .then((res) => {
                  let bd = JSON.parse(res.body);
                  jsonarr.data.ETHO.circulating_supply=parseInt(bd.CirculatingSupply);
                })
                .catch((error) => {
                  logger.info("#server.app.udate1hrsDatabase: %s", error);
                  jsonarr.data.ETHO.circulating_supply = prevrow[0].coin_1_supply;
                })
  
              logger.info("#server.app.udate1hrsDatabase: %s",jsonarr.data.ETHO.circulating_supply);
  
              await got('https://api.ethoprotocol.com/api?module=basic&action=totalsupply')
                .then((res) => {
                  let bd = JSON.parse(res.body);
                  jsonarr.data.ETHO.total_supply=parseInt(bd.TotalSupply);
                })
                .catch((error) => {
                  logger.info("#server.app.udate1hrsDatabase: %s", error);
                  jsonarr.data.ETHO.total_supply = prevrow[0].coin_1_totalsupply;
                })
  
              logger.info("#server.app.udate1hrsDatabase: %s",jsonarr.data.ETHO.total_supply);
              
              const vgmUrl = 'https://coinmarketcap.com/currencies/ether-1/';
              await got(vgmUrl).then(async (response) => {
                var rx = /On ([0-9,]*) watchlists/g;
                var arr = rx.exec(response.body);
                var numb = arr[1].match(/\d/g);
                let etho_watchlist = numb.join("");
                logger.info("#server.app.update1hrsDatabase: CMC watchlist position %s", etho_watchlist);
                await tabletojson.convertUrl(
                  'https://coinmarketcap.com/trending-cryptocurrencies/',
                  async function (tablesAsJson) {
                    let i;
                    let pos = 0;
                    for (i = 0; i < tablesAsJson[0].length; i++) {
                      if (tablesAsJson[0][i].Name.match(/ETHO/g)) {
                        pos = i + 1;
                        break;
                      }
                    }
                    logger.info("CMC Position: %s", pos);
                    sql = "INSERT INTO info (coin_1_id, coin_1_name, coin_1_symbol, coin_1_rank, coin_1_markets, coin_1_supply, coin_1_totalsupply, coin_1_quote, coin_1_percent1d, coin_1_percent7d, coin_1_percent30d,  " +
                      "coin_2_id, coin_2_name, coin_2_symbol, coin_2_rank, coin_2_markets, coin_2_supply, coin_2_quote, coin_2_percent1d, coin_2_percent7d, coin_2_percent30d, " +
                      "coin_3_id, coin_3_name, coin_3_symbol, coin_3_rank, coin_3_markets, coin_3_supply, coin_3_quote, coin_3_percent1d, coin_3_percent7d, coin_3_percent30d, " +
                      "coin_4_id, coin_4_name, coin_4_symbol, coin_4_rank, coin_4_markets, coin_4_supply, coin_4_quote, coin_4_percent1d, coin_4_percent7d, coin_4_percent30d, " +
                      "etho_trending, etho_watchlist, " +
                      "etho_activeUploadContracts, etho_totalNetworkStorageUse, etho_networkStorageAvailable, etho_active_gatewaynodes, etho_active_masternode, etho_active_servicenodes, " +
                      "etho_hashrate, etho_difficulty, " +
                      "etho_exchange_kucoin, etho_exchange_stex, etho_exchange_graviex, etho_exchange_mercatox, etho_exchange_probit, etho_devfund, " +
                      "etho_richlist, " +
                      "etho_gatewaynode_reward, etho_masternode_reward, etho_servicenode_reward, " +
                      "wetho_totalSupply, wetho_tranfersCount, wetho_holdersCount, " +
                      "socialDiscord_members, etho_masterfund, etho_devfund2, etho_faucetfund, date) VALUES ("
                      + jsonarr.data.ETHO.id + ",'" + jsonarr.data.ETHO.name + "','" + jsonarr.data.ETHO.symbol + "', " + jsonarr.data.ETHO.cmc_rank + ", " + jsonarr.data.ETHO.num_market_pairs + ", " + jsonarr.data.ETHO.circulating_supply + ", " + jsonarr.data.ETHO.total_supply+ ", " + jsonarr.data.ETHO.quote.USD.price + ", " + Math.round(jsonarr.data.ETHO.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.ETHO.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.ETHO.quote.USD.percent_change_30d * 100) + ", " +
                      +jsonarr.data.FIL.id + ",'" + jsonarr.data.FIL.name + "','" + jsonarr.data.FIL.symbol + "', " + jsonarr.data.FIL.cmc_rank + ", " + jsonarr.data.FIL.num_market_pairs + ", " + jsonarr.data.FIL.circulating_supply + ", " + jsonarr.data.FIL.quote.USD.price + "," + Math.round(jsonarr.data.FIL.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.FIL.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.FIL.quote.USD.percent_change_30d * 100) + ", " +
                      +jsonarr.data.SC.id + ",'" + jsonarr.data.SC.name + "','" + jsonarr.data.SC.symbol + "', " + jsonarr.data.SC.cmc_rank + ", " + jsonarr.data.SC.num_market_pairs + ", " + jsonarr.data.SC.circulating_supply + ", " + jsonarr.data.SC.quote.USD.price + "," + Math.round(jsonarr.data.SC.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.SC.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.SC.quote.USD.percent_change_30d * 100) + ", " +
                      +jsonarr.data.STORJ.id + ",'" + jsonarr.data.STORJ.name + "','" + jsonarr.data.STORJ.symbol + "', " + jsonarr.data.STORJ.cmc_rank + ", " + jsonarr.data.STORJ.num_market_pairs + ", " + jsonarr.data.STORJ.circulating_supply + ", " + jsonarr.data.STORJ.quote.USD.price + "," + Math.round(jsonarr.data.STORJ.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.STORJ.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.STORJ.quote.USD.percent_change_30d * 100) + ", " +
                      pos + "," + etho_watchlist + "," +
                      stats.activeUploadContracts + "," + stats.totalNetworkStorageUsed + "," + stats.networkStorageAvailable + ",'" +
                      stats.active_gatewaynodes + "','" + stats.active_masternodes + "','" + stats.active_servicenodes + "'," +
                      hashrate + "," + difficulty + "," +
                      exchange_kucoin + "," + exchange_stex + "," + exchange_graviex + "," + exchange_mercatox + "," + exchange_probit + "," + etho_devfund + ",'" + JSON.stringify(etho_richlist) + "'," + Math.round(stats.gatewaynode_reward * 10) + "," + Math.round(stats.masternode_reward * 10) + "," + Math.round(stats.servicenode_reward * 10) + ",'" +
                      wETHO.totalSupply + "'," + wETHO.transfersCount + "," + wETHO.holdersCount + "," +
                      discordMembers + "," + etho_masterfund + "," + etho_devfund2 + "," + etho_faucetfund + ",'" + pool.mysqlNow() + "')";
                    await pool.query(sql)
                      .then(async (row) => {
                        logger.info('#server.app.update1hrsDatabase: New dataset.');
                      })
                      .catch((error) => {
                        logger.error("#server.app.update1hrsDatabase: Error %s", error);
                      });
  
                  });
                
                
              }).catch((error) => {
                logger.error("#server.app.update1hrsDatabase: 4 %s", error);
              });
              
            } else {
              console.log(jsonarr.status);
            }
          }).catch((error) => {
            logger.error("#server.app.update1hrsDatabase: 3 %s", error);
          });
          await browser.close();
          
        })
      } else {
        logger.info('#server.app.update1hrsDatabase: Not yet ready');
      }
      
    })
    .catch((error) => {
      logger.error('#server.app.update1hrsDatabase: Error %s', error);
    })
  
}


update1hrsDatabase();


var longIntervalId=setInterval(
  () => update1hrsDatabase(),
  60000*60
);

async function getBalance(addr) {
  var balance = web3.eth.getBalance(addr)
    .then((res)=>{
      return(res);
    })
    .catch((error)=>{
      logger.error("#app.getBalance: Error %s", error);
    })
  return(balance);
  
}

async function getNetworkStats(
  sampleSize //!< [in] Larger n give more accurate numbers but with longer latency.
) {
  let blockNum = await web3.eth.getBlockNumber()
    .then((res)=>{
      return(res);
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  let difficulty = await web3.eth.getBlock(blockNum)
    .then((res)=>{
      return(res.difficulty);
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  
  
  let blockTime = (await web3.eth.getBlock(blockNum).then((res)=>{return(res.timestamp)}) - await web3.eth.getBlock(blockNum - sampleSize).then((res)=>{return(res.timestamp)})) / sampleSize;
  
  return {
    "blocktime": blockTime,
    "difficulty": difficulty,
    "hashrate": difficulty / blockTime,
  };
}



module.exports = app;
