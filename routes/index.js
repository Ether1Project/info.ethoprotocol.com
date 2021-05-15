const logger = require("../logger");
const {MISC_numberFormating} = require('../misc');
const got = require('got');
const ping = require('ping');
const checkCertExpiration = require('check-cert-expiration');
const tabletojson = require('tabletojson').Tabletojson;



var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var currency;
    var title;
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    res.render('index', {
        title: 'ETHO | Coin dashboard'
    });
});

/* GET home page. */
router.get('/dash_subscribe', function(req, res, next) {
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    res.render('dash_subscribe', {
        title: 'ETHO | Subscribe'
    });
});

/* GET home page. */
router.get('/dash_richlist', async function(req, res, next) {
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 1";
    
    pool.query(vsql)
        .then(async (inforows) => {
            let supply = inforows[0].coin_1_supply;
    
            const puppeteer = require('puppeteer');
    
            const browser = await puppeteer.launch({
                slowMo: 250
            }).then(async (browser) => {
                const page = await browser.newPage();
                await page.goto('https://richlist.ethoprotocol.com');
                await page.content().then(async (html) => {
                    // Fetch richlist and do some magic
                    tablesAsJson = tabletojson.convert(html);
                    let i;
                    console.log(html);
                    let top50share = [];
                    let labelstr = [];
                    let obj;
                    let max = 100;
                    for (i = 0; i < tablesAsJson[0].length; i++) {
                        switch (tablesAsJson[0][i].Address.slice(42)) {
                            case '0xfbd45d6ed333c4ae16d379ca470690e3f8d0d2a2':
                            case '0x548833f13d6bf156260f6e1769c847991c0f6324':
                                console.log(tablesAsJson[0][i].Address.slice(42));
                                break;
                            default:
                                obj = tablesAsJson[0][i];
                                top50share.push(obj['% of Coins']);
                                max -= obj['% of Coins'];
                                labelstr.push(i);
                                break;
                        }
                    }
                    console.log(top50share);
                    console.log(max);
                    labelstr.push(50);
                    let data = [];
                    data.first50 = MISC_numberFormating(Math.round(((100 - max) * supply) / 100));
                    data.after50 = MISC_numberFormating(Math.round((max * supply / 100)));
            
                    top50share.push(Math.round(100 * max) / 100);
                    let rgbstr = [];
                    for (i = 0; i < top50share.length - 1; i++) {
                        rgbstr.push("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
                    }
                    rgbstr.push("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
            
                    let chartobj = {
                        type: 'doughnut',
                        data: {
                    
                            datasets:
                                [{
                                    label: labelstr,
                                    backgroundColor: rgbstr,
                                    data: top50share
                                }]
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content1 = "";
                    content1 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content1 += "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj) + ");</script>";
            
            
                    res.render('dash_richlist', {
                        title: 'ETHO | Richlist dashboard',
                        data: data,
                        chart1: content1
                    });
            
                })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    
    
            await browser.close();
        })
        .catch((error) => {
            console.error(error);
        })
    
});







/* GET home page. */
router.get('/dash_ipfs', async function(req, res, next) {
    var currency;
    var title;
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    const {body} = await got('http://api.ether1.org/ethofsapi.php?api=network_stats_archive');
    bd=JSON.parse(body);
    
    res.render('dash_ipfs', {
        title: 'ETHO | IPFS dashboard',
        data: bd
    });
});

/* GET home page. */
router.get('/dash_exchanges', async function(req, res, next) {
    var currency;
    var title;
    
    
    logger.info("#server.routes.index.get.dash_exchanges");
    let data=[];
    
    const {body} = await got('https://api.ether1.org/api.php?api=chain_summary');
    bd=JSON.parse(body);
    console.log(bd);
    
    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 1";
    
    pool.query(vsql)
        .then(async (inforows) => {
            let exchange_all=inforows[0].etho_exchange_stex+inforows[0].etho_exchange_graviex+inforows[0].etho_exchange_probit+inforows[0].etho_exchange_mercatox;
    
            data.push({
                exchange_stex: MISC_numberFormating(inforows[0].etho_exchange_stex),
                exchange_graviex: MISC_numberFormating(inforows[0].etho_exchange_graviex),
                exchange_probit: MISC_numberFormating(inforows[0].etho_exchange_probit),
                exchange_mercatox: MISC_numberFormating(inforows[0].etho_exchange_mercatox),
                exchange_all: MISC_numberFormating(exchange_all),
                exchange_percent: Math.round(exchange_all/bd.circulating_supply*10000)/100
            })

            
            let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
    
            let content=await pool.query(vsql)
                .then((inforows) => {
                    if (inforows != undefined) {
                        // Generate chart
                        let exchange_stex = [];
                        let exchange_graviex = [];
                        let exchange_mercatox = [];
                        let exchange_probit = [];
                        let i;
                        for (i = 0; i < inforows.length; i++) {
                            if (inforows[i].etho_exchange_stex == null) {
                                inforows[i].etho_exchange_stex = 0;
                                inforows[i].etho_exchange_graviex = 0;
                                inforows[i].etho_exchange_probit = 0;
                                inforows[i].etho_exchange_mercatox = 0;
    
                            }
                        }
                        for (i = 0; i < inforows.length; i++) {
                            exchange_stex[i] = (inforows[i].etho_exchange_stex);
                            exchange_graviex[i] = (inforows[i].etho_exchange_graviex);
                            exchange_probit[i] = (inforows[i].etho_exchange_probit);
                            exchange_mercatox[i] = (inforows[i].etho_exchange_mercatox);
    
                        }
                
                        let chartobj2 = {
                            type: 'line',
                            data: {
                                labels:
                                    ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr1', '-23hr'],
                                datasets:
                                    [{
                                        'label': 'Marcatox coin wallet',
                                        data: exchange_mercatox,
                                        backgroundColor: 'rgb(26,238,26)'
                                    },{
                                        'label': 'Graviex coin wallet',
                                        data: exchange_graviex,
                                        backgroundColor: 'rgb(239,239,12)'
                                    },{
                                        'label': 'Probit coin wallet',
                                        data: exchange_probit,
                                        backgroundColor: 'rgb(236,13,13)'
                                    },{
                                        'label': 'STEX coin wallet',
                                        data: exchange_stex,
                                        backgroundColor: 'rgb(8,168,241)'
                                    }
                                    ]
                        
                            },
                            options: {
                                responsive: true
                            }
                        };
                        // Create charts
                        let content = "";
                        content += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                        content += "" +
                            "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
                        return(content);
                    }
                })
                .catch((error)=> {
                    logger.error("%s", error);
                })
    
            res.render('dash_exchanges', {
                title: 'ETHO | Exchange dashboard',
                data: data[0],
                chart1: content
            });
    
        })
});


router.get('/dash_health', async function(req, res, next) {
    var currency;
    var title;
    
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    let server=["blocks.ethoprotocol.com","explorer.ethoprotocol.com","explorer2.ethoprotocol.com","info.ethoprotocol.com","www.ethoprotocol.com", "nodes.ethoprotocol.com", "richlist.ethoprotocol.com", "uploads.ethoprotocol.com", "wallet.ethoprotocol.com", "stats.ethoprotocol.com"];
    let data=[];
    let i;
    
    
    
    for (i=0;i<server.length;i++) {
        await ping.promise.probe(server[i])
            .then(async (pingres) => {
                 await got('https://' + server[i])
                    .then(async (response) => {
                        await (async function () {
                            try {
                                const {daysLeft, host, port} = await checkCertExpiration(server[i]);
                            
                                data.push({
                                    servername: server[i],
                                    up: false,
                                    certdate: daysLeft + " days left",
                                    latency: pingres.time
                                });
                            } catch (err) {
                                data.push({
                                    servername: server[i],
                                    up: true,
                                    certdate: err.name,
                                    latency: pingres.time
                                });
                            
                            }
                        })();
                    
                    })
                    .catch((error) => {
                        data.push({
                            servername: server[i],
                            up: true,
                            certdate: error,
                            latency: pingres.time
                        })
                    
                    
                    })
            })
            .catch((error) => {
                data.push({
                    servername: server[i],
                    up: true,
                    certdate: error,
                    latency: 0
                })
            })
    }
    
    res.render('dash_health', {
        title: 'ETHO | Coin dashboard',
        data: data
    });
});


/* GET home page. */
router.get('/dash_financial', function(req, res, next) {
    let data = [];
    
    
    (async () => {
        const {body} = await got('https://api.ether1.org/api.php?api=chain_summary');
        logger.info("Body %s", JSON.parse(body)); // Print the json response
        bd=JSON.parse(body);
        data.blockheight = MISC_numberFormating(bd.block_height);
        data.circulatingsupply = MISC_numberFormating(bd.circulating_supply);
        
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 1";
        
        pool.query(vsql)
            .then(async (inforows) => {
                if (inforows!=undefined) {
                    // Generate pie chart
                    let marketcaps = [];
                    marketcaps.push(Math.round(inforows[0].coin_1_quote * inforows[0].coin_1_supply / 1E4) / 100);
                    marketcaps.push(Math.round(inforows[0].coin_2_quote * inforows[0].coin_2_supply / 1E4) / 100);
                    marketcaps.push(Math.round(inforows[0].coin_3_quote * inforows[0].coin_3_supply / 1E4) / 100);
                    marketcaps.push(Math.round(inforows[0].coin_4_quote * inforows[0].coin_4_supply / 1E4) / 100);
                    
                    let chartobj = {
                        type: 'pie',
                        data: {
                            labels:
                                ['ETHO', 'FIL', 'SC', 'STORJ'],
                            datasets:
                                [{
                                    'label': 'Market cap share',
                                    backgroundColor:
                                        ['rgb(171,47,73)',
                                            'rgb(54, 162, 235)',
                                            'rgb(87,224,57)',
                                            'rgb(255, 205, 86)'],
                                    data: marketcaps
                                }]
                            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content1 = "";
                    content1 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content1 += "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj) + ");</script>";
                    
                    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
                    
                    let content2=await pool.query(vsql)
                        .then((inforows) => {
                            if (inforows != undefined) {
                                // Generate chart
                                let marketcapList = [];
                                let i;
                                for (i = 0; i < inforows.length; i++) {
                                    if (inforows[i].coin_1_marketcap == null)
                                        inforows[i].coin_1_marketcap = 0;
                                }
                                for (i = 0; i < inforows.length; i++) {
                                    marketcapList[i] = (inforows[i].coin_1_quote * inforows[i].coin_1_supply / 1E4) / 100;
                                }
                                
                                let chartobj2 = {
                                    type: 'bar',
                                    data: {
                                        labels:
                                            ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr1', '-23hr'],
                                        datasets:
                                            [{
                                                'label': 'ETHO market cap (MUSD)',
                                                data: marketcapList,
                                                backgroundColor: 'rgb(171,47,73)'
                                            }]
                                        
                                    },
                                    options: {
                                        responsive: true
                                    }
                                };
                                // Create charts
                                let content = "";
                                content += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                                content += "" +
                                    "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
                                return(content);
                            }
                        })
                        .catch((error)=> {
                            logger.error("%s", error);
                        })
                    
                    
                    inforows[0].coin_1_quote = Math.trunc(inforows[0].coin_1_quote * 10000) / 10000;
                    inforows[0].coin_2_quote = Math.trunc(inforows[0].coin_2_quote * 10000) / 10000;
                    inforows[0].coin_3_quote = Math.trunc(inforows[0].coin_3_quote * 10000) / 10000;
                    inforows[0].coin_4_quote = Math.trunc(inforows[0].coin_4_quote * 10000) / 10000;
                    
                    
                    inforows[0].coin_1_marketcap = Math.round(inforows[0].coin_1_quote*inforows[0].coin_1_supply/1E4) /100 + "MUSD";
                    inforows[0].coin_1_percent1d = Math.round(inforows[0].coin_1_percent1d/100);
                    inforows[0].coin_1_percent30d = Math.round(inforows[0].coin_1_percent30d/100);
                    inforows[0].coin_2_percent1d = Math.round(inforows[0].coin_2_percent1d/100);
                    inforows[0].coin_2_percent30d = Math.round(inforows[0].coin_2_percent30d/100);
                    inforows[0].coin_3_percent1d = Math.round(inforows[0].coin_3_percent1d/100);
                    inforows[0].coin_3_percent30d = Math.round(inforows[0].coin_3_percent30d/100);
                    inforows[0].coin_4_percent1d = Math.round(inforows[0].coin_4_percent1d/100);
                    inforows[0].coin_4_percent30d = Math.round(inforows[0].coin_4_percent30d/100);
                    
                    inforows[0].format_coin_1_supply = MISC_numberFormating(parseInt(inforows[0].coin_1_supply));
                    inforows[0].format_coin_2_supply = MISC_numberFormating(parseInt(inforows[0].coin_2_supply));
                    inforows[0].format_coin_3_supply = MISC_numberFormating(parseInt(inforows[0].coin_3_supply));
                    inforows[0].format_coin_4_supply = MISC_numberFormating(parseInt(inforows[0].coin_4_supply));
                    
                    inforows[0].norm_coin_1_supply = Math.round(10*inforows[0].coin_1_supply/inforows[0].coin_1_supply)/10;
                    inforows[0].norm_coin_2_supply = Math.round(10*inforows[0].coin_2_supply/inforows[0].coin_1_supply)/10;
                    inforows[0].norm_coin_3_supply = Math.round(10*inforows[0].coin_3_supply/inforows[0].coin_1_supply)/10;
                    inforows[0].norm_coin_4_supply = Math.round(10*inforows[0].coin_4_supply/inforows[0].coin_1_supply)/10;
                    
                    
                    res.render('dash_financial', {
                        title: 'ETHO | Financial dashboard',
                        data: data,
                        db: inforows[0],
                        chart1: content2,
                        chart2: content1,
                    });
                }
                else {
                    res.render('index', {
                        title: 'ETHO | Financial dashboard'
                    });
                    
                }
            })
            .catch((error) => {
                logger.error('#server.users.get.account: Error %s', error);
                throw error;
            })
    })();
    
});


/* GET home page. */
router.get('/dash_financial2', async function(req, res, next) {
    let data = [];
    
    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 1";
    
    data.year=0;
    
    await pool.query(vsql)
        .then(async (inforows) => {
            data.year = MISC_numberFormating(Math.round(inforows[0].coin_1_quote / 0.005 * 100000)/100);
        });
    res.render('dash_financial2', {
        title: 'ETHO | Financial 2 dashboard',
        data: data
    });
    
});

router.get('/dash_cmctrending', function(req, res, next) {
    let data = [];
    
    
    (async () => {
        const {body} = await got('https://api.ether1.org/api.php?api=chain_summary');
        logger.info("Body %s", JSON.parse(body)); // Print the json response
        bd=JSON.parse(body);
        data.blockheight = MISC_numberFormating(bd.block_height);
        data.circulatingsupply = MISC_numberFormating(bd.circulating_supply);
        
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
        
        pool.query(vsql)
            .then((inforows) => {
                if (inforows!=undefined) {
                    // Generate chart
                    let watchlist = [];
                    let i;
                    for (i=0;i<inforows.length;i++) {
                        if (inforows[i].etho_watchlist==null)
                            inforows[i].etho_watchlist=10600;
                    }
                    for (i=0;i<inforows.length;i++) {
                        watchlist[i]=inforows[i].etho_watchlist-inforows[inforows.length-1].etho_watchlist;
                    }
                    
                    let chartobj = {
                        type: 'bar',
                        data: {
                            labels:
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr1','-23hr'],
                            datasets:
                                [{'label':'24hrs CMC watchlist, increase from: ' + inforows[23].etho_watchlist,
                                    data: watchlist,
                                    backgroundColor: 'rgb(171,47,73)'
                                }]
                            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content1 = "";
                    content1 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content1 += "" +
                        "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj) + ");</script>";
                    
                    
                    
                    // Generate chart
                    let trend = [];
                    for (i=0;i<inforows.length;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        trend[i]=inforows[i].etho_trending;
                    }
                    
                    chartobj = {
                        type: 'bar',
                        data: {
                            labels:
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr1','-23hr'],
                            datasets:
                                [{'label':'CMC top 20 trending position',
                                    data: trend,
                                    backgroundColor: 'rgb(0,0,0)'
    
                                }]
                            
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    min: 1,
                                    max: 25,
                                    reverse: true
                                }
                            }
                        },
                    };
                    // Create charts
                    let content2 = "";
                    content2 += "<canvas id='chartjs-5' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content2 += "" +
                        "<script>new Chart(document.getElementById('chartjs-5')," + JSON.stringify(chartobj) + ");</script>";
                    
                    
                    inforows[0].coin_1_quote = Math.trunc(inforows[0].coin_1_quote * 10000) / 10000;
                    inforows[0].coin_2_quote = Math.trunc(inforows[0].coin_2_quote * 10000) / 10000;
                    inforows[0].coin_3_quote = Math.trunc(inforows[0].coin_3_quote * 10000) / 10000;
                    inforows[0].coin_4_quote = Math.trunc(inforows[0].coin_4_quote * 10000) / 10000;
                    
                    
                    inforows[0].coin_1_marketcap = Math.round(inforows[0].coin_1_quote*inforows[0].coin_1_supply/1E4) /100 + "MUSD";
                    inforows[0].coin_1_percent1d = Math.round(inforows[0].coin_1_percent1d/100);
                    inforows[0].coin_1_percent30d = Math.round(inforows[0].coin_1_percent30d/100);
                    inforows[0].coin_2_percent1d = Math.round(inforows[0].coin_2_percent1d/100);
                    inforows[0].coin_2_percent30d = Math.round(inforows[0].coin_2_percent30d/100);
                    inforows[0].coin_3_percent1d = Math.round(inforows[0].coin_3_percent1d/100);
                    inforows[0].coin_3_percent30d = Math.round(inforows[0].coin_3_percent30d/100);
                    inforows[0].coin_4_percent1d = Math.round(inforows[0].coin_4_percent1d/100);
                    inforows[0].coin_4_percent30d = Math.round(inforows[0].coin_4_percent30d/100);
                    
                    
                    
                    
                    
                    res.render('dash_cmctrending', {
                        title: 'ETHO | ETHO trending',
                        data: data,
                        db: inforows[0],
                        chart1: content1,
                        chart2: content2
                    });
                }
                else {
                    res.render('index', {
                        title: 'ETHO | Financial dashboard'
                    });
                    
                }
            })
            .catch((error) => {
                logger.error('#server.update1rsDatabase: Error %s', error);
                throw error;
            })
    })();
    
});

/* GET home page. */
router.get('/dash_nodes', function(req, res, next) {
    let data = [];
    
    
    (async () => {
        
        const ethofsSDK = require('@ethofs/sdk');
        const ethofs = ethofsSDK();
        
        let stats= await ethofs.networkStats().then((result) => {
            //handle results here
            return(result);
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
        
        stats.gatewaynode_reward=Math.round(10*stats.gatewaynode_reward)/10;
        stats.masternode_reward=Math.round(10*stats.masternode_reward)/10;
        stats.servicenode_reward=Math.round(10*stats.servicenode_reward)/10;
        
        
        
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
        
        pool.query(vsql)
            .then(async (inforows) => {
                if (inforows!=undefined) {
                    // Generate pie chart
                    let nodesList = [];
                    nodesList.push(inforows[0].etho_active_gatewaynodes);
                    nodesList.push(inforows[0].etho_active_masternode);
                    nodesList.push(inforows[0].etho_active_servicenodes);
                    inforows[0].collateral=MISC_numberFormating(parseInt(inforows[0].etho_active_gatewaynodes*30000)+ parseInt(inforows[0].etho_active_masternode*15000)+ parseInt(inforows[0].etho_active_servicenodes*5000));
                    let chartobj = {
                        type: 'pie',
                        data: {
                            labels:
                                ['Gateway', 'Master', 'Service'],
                            datasets:
                                [{
                                    'label': 'Market cap share',
                                    backgroundColor:
                                        ['rgb(171,47,73)',
                                            'rgb(54, 162, 235)',
                                            'rgb(255, 205, 86)'],
                                    data: nodesList
                                }]
                            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content1 = "";
                    content1 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content1 += "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj) + ");</script>";
                    
                    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
                    
                    let content2=await pool.query(vsql)
                        .then((inforows) => {
                            if (inforows != undefined) {
                                // Generate chart
                                let contractList = [];
                                let i;
                                for (i = 0; i < inforows.length; i++) {
                                    if (inforows[i].etho_activeUploadContracts == null)
                                        inforows[i].etho_activeUploadContracts = 0;
                                }
                                for (i = 0; i < inforows.length; i++) {
                                    contractList.push(inforows[i].etho_activeUploadContracts);
                                }
                                
                                let chartobj2 = {
                                    type: 'bar',
                                    data: {
                                        labels:
                                            ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr1', '-23hr'],
                                        datasets:
                                            [{
                                                'label': 'Active contracts',
                                                data: contractList,
                                                backgroundColor: 'rgb(170,250,58)'
                                            }]
                                        
                                    },
                                    options: {
                                        responsive: true
                                    }
                                };
                                // Create charts
                                let content = "";
                                content += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                                content += "" +
                                    "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
                                return(content);
                            }
                        })
                        .catch((error)=> {
                            logger.error("%s", error);
                        })
                    
                    
                    res.render('dash_nodes', {
                        title: 'ETHO | Financial dashboard',
                        ethofsstats: stats,
                        db: inforows[0],
                        chart1: content2,
                        chart2: content1,
                    });
                }
                else {
                    res.render('index', {
                        title: 'ETHO | Financial dashboard'
                    });
                    
                }
            })
            .catch((error) => {
                logger.error('#server.users.get.account: Error %s', error);
                throw error;
            })
    })();
    
});




module.exports = router;
