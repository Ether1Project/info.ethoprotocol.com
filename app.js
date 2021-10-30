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

const ethofsSDK = require('@ethofs/sdk');
const ethofs = ethofsSDK();
const { Octokit } = require("@octokit/core");

const puppeteer = require('puppeteer');



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
global.version="1.13";


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
    await got('http://95.111.230.192:8080/rest/guild')
        .then((res) => {
            let result = JSON.parse(res.body);
            for (i = 0; i < result.guild.length; i++) {
                if (result.guild[i].guildId == '426241424229662721') {
                    discordMembers = result.guild[i].guildMember;
                    break;
                }
            }
            logger.info('#server.app.update1hrsDatabase: Discord members %s', discordMembers);
        });
    
    
    let wETHO;
    await got('https://api.ethplorer.io/getTokenInfo/0x99676c9fa4c77848aeb2383fcfbd7e980dc25027?apiKey=' + config.ETHPLORERKEY)
        .then((res) => {
            wETHO = JSON.parse(res.body);
        });
    
    
    let wETHO_holder;
    let exchange_kucoin = 0;
    await got('https://api.ethplorer.io/getTopTokenHolders/0x99676c9fA4c77848aEb2383fCFbD7e980dC25027?apiKey=' + config.ETHPLORERKEY)
        .then((res) => {
            wETHO_holder = JSON.parse(res.body);
            for (i = 0; i < wETHO_holder.holders.length; i++) {
                if (wETHO_holder.holders[i].address == "0xa1d8d972560c2f8144af871db508f0b0b10a3fbf" || wETHO_holder.holders[i].address == "0x495f8bdacfbe7347131b7f8fd240d903daa2cc44") {
                    exchange_kucoin += wETHO_holder.holders[i].balance / 1E18;
                }
            }
        });
    console.log(exchange_kucoin);
    
    // Check first if the latest entry is larger than 1 hour back
    
    
    await puppeteer.launch({}).then(async (browser) => {
        let etho_richlist = [];
        // First we get previous entry
        let vsql = "SELECT *,TIMESTAMPDIFF(SECOND, date, UTC_TIMESTAMP()) AS secs FROM info ORDER BY id DESC LIMIT 1";
        
        await pool.query(vsql)
            .then(async (inforows) => {
                
                const page = await browser.newPage();
                
                await page.goto('http://144.91.93.170/', {
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
                                    case '0xe82e114833c558496b7d2405584c5a2286b9170e':
                                    case '0x2edfef4716612b705993c73e69728beb6e28c57f':
                                        break;
                                    default:
                                        etho_richlist.push({
                                            add: tablesAsJson[0][i].Address.slice(0, 42),
                                            bal: parseInt(tablesAsJson[0][i]['Balance (ETHO))'].replace(/,/g, '')),
                                            li: tablesAsJson[0][i]['Last In'],
                                            lo: tablesAsJson[0][i]['Last Out']
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
                
                
                logger.info('#server.app.update1hrsDatabase: Timeout %s', inforows[0].secs);
                if (inforows[0].secs > 3500 || config.development) {
                    
                    // Fetch exchange status
                    let exchange_stex = 0;
                    let exchange_graviex = 0;
                    let exchange_mercatox = 0;
                    let exchange_probit = 0;
                    let etho_devfund = 0;
                    let etho_masterfund = 0;
                    logger.info("#server.aoo.update1hrsDatabase: Fetching data from exchanges...");
                    await got('http://161.97.164.158:4000/api?module=account&action=balance&address=0xFBd45D6ED333c4ae16d379ca470690E3F8d0D2a2')
                        .then((res) => {
                            let bd = JSON.parse(res.body);
                            exchange_stex = parseInt(bd.result / 1E18);
                            logger.info("STEX: %s ETHO", exchange_stex); // Print the json response
                        })
                        .catch((error) => {
                            logger.info("#server.app.udate1hrsDatabase: %s", error);
                        })
                    await got('http://161.97.164.158:4000/api?module=account&action=balance&address=0x548833f13d6bf156260f6e1769c847991c0f6324')
                        .then((res) => {
                            let bd = JSON.parse(res.body);
                            exchange_graviex = parseInt(bd.result / 1E18);
                            logger.info("Graviex: %s ETHO", exchange_graviex); // Print the json response
                        })
                        .catch((error) => {
                            logger.info("#server.app.udate1hrsDatabase: %s", error);
                        })
                    await got('http://161.97.164.158:4000/api?module=account&action=balance&address=0xccdbbb5d42e631ea6b040dee17fa78232ec4c87e')
                        .then((res) => {
                            let bd = JSON.parse(res.body);
                            exchange_mercatox = parseInt(bd.result / 1E18);
                            logger.info("Mecatox: %s ETHO", exchange_mercatox); // Print the json response
                        })
                        .catch((error) => {
                            logger.info("#server.app.udate1hrsDatabase: %s", error);
                        })
                    await got('http://161.97.164.158:4000/api?module=account&action=balance&address=0xe2c8cbec30c8513888f7a95171ea836f8802d981')
                        .then((res) => {
                            let bd = JSON.parse(res.body);
                            etho_devfund = parseInt(bd.result / 1E18);
                            logger.info("Devfund: %s ETHO", etho_devfund); // Print the json response
                        })
                        .catch((error) => {
                            logger.info("#server.app.udate1hrsDatabase: %s", error);
                        })
    
                    await got('http://161.97.164.158:4000/api?module=account&action=balance&address=0xE19363Ffb51C62bEECd6783A2c9C5bfF5D4679ac')
                        .then((res) => {
                            let bd = JSON.parse(res.body);
                            etho_masterfund = parseInt(bd.result / 1E18);
                            logger.info("Devfund: %s ETHO", etho_devfund); // Print the json response
                        })
                        .catch((error) => {
                            logger.info("#server.app.udate1hrsDatabase: %s", error);
                        })
    
    
                    await got('http://161.97.164.158:4000/api?module=account&action=balance&address=0xe82e114833c558496b7d2405584c5a2286b9170e')
                        .then((res) => {
                            let bd = JSON.parse(res.body);
                            exchange_probit = parseInt(bd.result / 1E18);
                            logger.info("Exchange Probit: %s ETHO", exchange_probit); // Print the json response
                        })
                        .catch((error) => {
                            logger.info("#server.app.update1hrsDatabase: %s", error);
                        })
                    
                    // Fetch node stats
                    let stats;
                    stats = await ethofs.networkStats().then((result) => {
                        //handle results here
                        logger.info("#server.app.update1hrsDatabase: Fetching network stats ...");
                        console.log(result);
                        return (result);
                    })
                        .catch((error) => {
                            logger.error("#server.app.update1hrsDatabase: Error %s", error);
                        })
                    
                    
                    let difficulty = 0;
                    let hashrate = 0;
                    
                    await got('http://api.ether1.org/api.php?api=network_stats')
                        .then((ok) => {
                            let bd = JSON.parse(ok.body);
                            difficulty = parseInt(bd.difficulty);
                            hashrate = parseInt(bd.hashrate);
                            logger.info("#server.app.update1hrsDatabase: Successful fetch diff %s, hashrate %s", difficulty, hashrate);
                        })
                        .catch((error) => {
                            logger.error("#server.app.update1hrsDatabase: Error %s", error);
                        })
                    
                    // Fetch relevant data from CMC
                    const apiKey = config.CMCAPIKEY;
                    const client = new CoinMarketCap(apiKey);
                    
                    client.getQuotes({symbol: 'ETHO,SC,FIL,STORJ'}).then(async (jsonarr) => {
                        if (jsonarr.status.error_code == 0) {
                            // we have valid data
                            // Here we fetch the position from the CMC server and track it
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
                                        let sql = "INSERT INTO info (coin_1_id, coin_1_name, coin_1_symbol, coin_1_rank, coin_1_markets, coin_1_supply, coin_1_quote, coin_1_percent1d, coin_1_percent7d, coin_1_percent30d,  " +
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
                                            "socialDiscord_members, etho_masterfund, date) VALUES ("
                                            + jsonarr.data.ETHO.id + ",'" + jsonarr.data.ETHO.name + "','" + jsonarr.data.ETHO.symbol + "', " + jsonarr.data.ETHO.cmc_rank + ", " + jsonarr.data.ETHO.num_market_pairs + ", " + jsonarr.data.ETHO.circulating_supply + ", " + jsonarr.data.ETHO.quote.USD.price + ", " + Math.round(jsonarr.data.ETHO.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.ETHO.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.ETHO.quote.USD.percent_change_30d * 100) + ", " +
                                            +jsonarr.data.FIL.id + ",'" + jsonarr.data.FIL.name + "','" + jsonarr.data.FIL.symbol + "', " + jsonarr.data.FIL.cmc_rank + ", " + jsonarr.data.FIL.num_market_pairs + ", " + jsonarr.data.FIL.circulating_supply + ", " + jsonarr.data.FIL.quote.USD.price + "," + Math.round(jsonarr.data.FIL.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.FIL.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.FIL.quote.USD.percent_change_30d * 100) + ", " +
                                            +jsonarr.data.SC.id + ",'" + jsonarr.data.SC.name + "','" + jsonarr.data.SC.symbol + "', " + jsonarr.data.SC.cmc_rank + ", " + jsonarr.data.SC.num_market_pairs + ", " + jsonarr.data.SC.circulating_supply + ", " + jsonarr.data.SC.quote.USD.price + "," + Math.round(jsonarr.data.SC.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.SC.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.SC.quote.USD.percent_change_30d * 100) + ", " +
                                            +jsonarr.data.STORJ.id + ",'" + jsonarr.data.STORJ.name + "','" + jsonarr.data.STORJ.symbol + "', " + jsonarr.data.STORJ.cmc_rank + ", " + jsonarr.data.STORJ.num_market_pairs + ", " + jsonarr.data.STORJ.circulating_supply + ", " + jsonarr.data.STORJ.quote.USD.price + "," + Math.round(jsonarr.data.STORJ.quote.USD.percent_change_24h * 100) + ", " + Math.round(jsonarr.data.STORJ.quote.USD.percent_change_7d * 100) + ", " + Math.round(jsonarr.data.STORJ.quote.USD.percent_change_30d * 100) + ", " +
                                            pos + "," + etho_watchlist + "," + stats.activeUploadContracts + "," + stats.totalNetworkStorageUsed + "," + stats.networkStorageAvailable + "," +
                                            stats.active_gatewaynodes + "," + stats.active_masternodes + "," + stats.active_servicenodes + "," + hashrate + "," + difficulty + "," +
                                            exchange_kucoin + "," + exchange_stex + "," + exchange_graviex + "," + exchange_mercatox + "," + exchange_probit + "," + etho_devfund + ",'" + JSON.stringify(etho_richlist) + "'," + Math.round(stats.gatewaynode_reward * 10) + "," + Math.round(stats.masternode_reward * 10) + "," + Math.round(stats.servicenode_reward * 10) + ",'" +
                                            wETHO.totalSupply + "'," + wETHO.transfersCount + "," + wETHO.holdersCount + "," +
                                            discordMembers + "," + etho_masterfund + ",'" + pool.mysqlNow() + "')";
                                        
                                        
                                        await pool.query(sql)
                                            .then(function (rows) {
                                            })
                                            .catch(function (error) {
                                                logger.error("#server.app.update1hrsdatabase: Error: %s", error);
                                            })
                                        
                                    }
                                );
                                
                                
                            }).catch((error) => {
                                logger.error("#server.app.update1hrsDatabase: 4 %s", error);
                            });
                            
                        } else {
                            console.log(jsonarr.status);
                        }
                    }).catch((error) => {
                        logger.error("#server.app.update1hrsDatabase: 3 %s", error);
                    });
                }
            })
        await browser.close();
        
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



module.exports = app;