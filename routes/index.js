const logger = require("../logger");
const {MISC_numberFormating} = require('../misc');
const got = require('got');
const ping = require('ping');
const checkCertExpiration = require('check-cert-expiration');
const tabletojson = require('tabletojson').Tabletojson;
const ethofsSDK = require('@ethofs/sdk');



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
    
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT 24";
    
    pool.query(vsql)
        .then(async (inforows) => {
            let supply = inforows[0].coin_1_supply;
            let tablesAsJson = JSON.parse(inforows[0].etho_richlist);
            let i;
            let top50share = [];
            let top50label = [];
            
            let labelstr = [];
            let max = supply;
            let exchange_all=inforows[0].etho_exchange_stex+inforows[0].etho_exchange_graviex+inforows[0].etho_exchange_probit+inforows[0].etho_exchange_mercatox;
            let rich=0;
            let devfund = inforows[0].etho_devfund;
    
    
            for (i = 0; i < tablesAsJson.length; i++) {
                top50share.push(tablesAsJson[i].bal);
                
                top50label.push(i +": " + tablesAsJson[i].add);
                rich+= tablesAsJson[i].bal;
                labelstr.push(i);
            }
            labelstr.push(50);
            let data = [];
            data.supply = MISC_numberFormating(Math.round((supply) * 100) / 100);
            data.richlist = MISC_numberFormating(Math.round((rich) * 100) / 100);
            data.exchanges= MISC_numberFormating(Math.round((exchange_all) * 100) / 100);
            data.devfund= MISC_numberFormating(Math.round((devfund) * 100) / 100);
            data.rest = MISC_numberFormating(Math.round((supply-exchange_all-devfund-rich)*100) / 100);
            
            let rgbstr = [];
            for (i = 0; i < top50share.length; i++) {
                rgbstr.push("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
                top50label.push("");
            }
            rgbstr.push("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
            
            let chartobj = {
                type: 'doughnut',
                data: {
                    datasets:
                        [{
                            label: top50label,
    
                            backgroundColor: rgbstr,
                            data: top50share
                        }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    responsive: true,
                }
            };
            // Create charts
            let content1 = "";
            content1 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
            content1 += "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj) + ");</script>";
    
            let rich_24hrs=[];
            let label_24hrs=[];
            for (i=0;i<inforows.length;i++) {
                rich=0;
                tablesAsJson = JSON.parse(inforows[i].etho_richlist);
                for (j = 0; j < tablesAsJson.length; j++) {
                    rich+= tablesAsJson[j].bal;
                }
                rich_24hrs.push(rich);
                label_24hrs.push(-i + "hr" );
            }
            
            let chartobj2 = {
                type: 'line',
                data: {
                    labels:
                        ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr1', '-23hr'],
    
                    datasets:
                        [{
                            label: 'Top 45 accounts value',
                            backgroundColor: 'rgb(26,238,26)',
                            data: rich_24hrs
                        }]
                },
                options: {
                    responsive: true
                }
            };
            // Create charts
            let content2 = "";
            content2 += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
            content2 += "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
    
    
    
            res.render('dash_richlist', {
                title: 'ETHO | Richlist dashboard',
                data: data,
                chart1: content1,
                chart2: content2
            });
            
        })
        .catch((error) => {
            console.error(error);
        })
    
    
});







/* GET home page. */
router.get('/dash_ipfs', async function(req, res, next) {
    let contracts=[];
    let networkStorage=[];
    let data=[];
    let bd;
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    const {body} = await got('http://api.ether1.org/ethofsapi.php?api=network_stats_archive');
    bd=JSON.parse(body);
    console.log(countProperties(bd));
    let i=0;
    let k=0;
    let labels=[];
    let obj;
    
    for (key in bd) {
        if (bd.hasOwnProperty(key)) {
            if (!(k%100)) {
                contracts[i] = parseInt(bd[key].activeUploadContracts).toString();
                networkStorage[i] = parseInt(bd[key].totalNetworkStorageUsed)/1E9;
                labels.push(1000000 + i*100000);
                i = i + 1;
            }
            k=k+1;
        }
    }
    
    let ethofs = ethofsSDK(global.config.ETHOSERIAL);
    
    const options = {
        ethofsOptions: {
            hostingContractDuration: parseInt(100000),
            hostingContractSize: parseInt(1E6)
        }
    };
    data.cost=await ethofs.calculateCost(options)
        .then((result) => {
            //handle results here
            logger.info("#server.routes.index.get.dash_ipfs: %s", result);
            return(result.uploadCost/1E18);
            })
        .catch((err) => {
            //handle error here
            logger.error("#server.routes.index.get.dash_ipfs: %s", err);
            return(0);
            })
    
    data.cost=Math.round(data.cost*10000)/10000;
    
    
    
    let chartobj1 = {
        type: 'line',
        data: {
            labels: labels,
            datasets:
                [{
                    'label': 'Contracts over time',
                    data: contracts,
                    backgroundColor: 'rgb(26,238,26)'
                }
                ]
            
        },
        options: {
            responsive: true
        }
    };
    
    // Create charts
    let content1 = "";
    content1 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
    content1 += "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj1) + ");</script>";
    
    let chartobj2 = {
        type: 'line',
        data: {
            labels: labels,
            datasets:
                [{
                    'label': 'Storage in GB over time',
                    data: networkStorage,
                    backgroundColor: 'rgb(2,172,250)'
                }
                ]
            
        },
        options: {
            responsive: true
        }
    };
    
    // Create charts
    let content2 = "";
    content2 += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
    content2 += "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
    
    res.render('dash_ipfs', {
        title: 'ETHO | IPFS dashboard',
        data: data,
        chart1: content1,
        chart2: content2
    });
});

function countProperties(obj) {
    return Object.keys(obj).length;
}

/* GET home page. */
router.get('/dash_exchanges', async function(req, res, next) {
    var currency;
    var title;
    
    
    logger.info("#server.routes.index.get.dash_exchanges");
    let data=[];
    
    const {body} = await got('https://api.ether1.org/api.php?api=chain_summary');
    bd=JSON.parse(body);
    
    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
    
    pool.query(vsql)
        .then(async (inforows) => {
            let exchange_all=inforows[0].etho_exchange_stex+inforows[0].etho_exchange_graviex+inforows[0].etho_exchange_probit+inforows[0].etho_exchange_mercatox;
    
            data.push({
                exchange_stex: MISC_numberFormating(inforows[0].etho_exchange_stex),
                exchange_graviex: MISC_numberFormating(inforows[0].etho_exchange_graviex),
                exchange_probit: MISC_numberFormating(inforows[0].etho_exchange_probit),
                exchange_mercatox: MISC_numberFormating(inforows[0].etho_exchange_mercatox),
                exchange_all: MISC_numberFormating(exchange_all),
                exchange_percent: Math.round(exchange_all/bd.circulating_supply*10000)/100,
                stexFluctuation: Math.round((inforows[0].etho_exchange_stex/inforows[23].etho_exchange_stex*100-100)*100)/100,
                graviexFluctuation: Math.round((inforows[0].etho_exchange_graviex/inforows[23].etho_exchange_graviex*100-100)*100)/100,
                probitFluctuation: Math.round((inforows[0].etho_exchange_probit/inforows[23].etho_exchange_probit*100-100)*100)/100,
                mercatoxFluctuation: Math.round((inforows[0].etho_exchange_mercatox/inforows[23].etho_exchange_mercatox*100-100)*100)/100
            })

            
            // Generate chart
            logger.info("#server.routes.index.get.dash_exchanges: Generating chart");
            
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
    
            let chartobj1 = {
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
            content += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
            content += "" +
                "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj1) + ");</script>";
    
            let exchanges_percentage=[];
            for (i = 0; i < inforows.length; i++) {
                exchanges_percentage[i]=(inforows[i].etho_exchange_stex+inforows[i].etho_exchange_graviex+inforows[i].etho_exchange_probit+inforows[i].etho_exchange_mercatox)/inforows[i].coin_1_supply;
            }
    
            let chartobj2 = {
                type: 'line',
                data: {
                    labels:
                        ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr1', '-23hr'],
                    datasets:
                        [{
                            'label': 'Percentage locked',
                            data: exchanges_percentage,
                            backgroundColor: 'rgb(129,128,128)'
                        }
                        ]
            
                },
                options: {
                    responsive: true
                }
            };
            // Create charts
            let content2 = "";
            content2 += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
            content2 += "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
    
    
            res.render('dash_exchanges', {
                title: 'ETHO | Exchange dashboard',
                data: data[0],
                chart1: content,
                chart2: content2
            });
    
        })
        .catch((error)=>{
            logger.error("#server.routes.index.get.dash_exchanges: Error %s", error);
            
    
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
        
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 5040";
        
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
    
                    let content2_24hrs="";
                    let content2_7d="";
                    let content2_30d="";
                    let marketcapList = [];
                    let marketcapList_7d = [];
                    let marketcapList_30d = [];
    
                    let labels_7d=[];
                    let labels_30d=[];
    
                    let i;
                    for (i = 0; i < inforows.length; i++) {
                        if (inforows[i].coin_1_marketcap == null)
                            inforows[i].coin_1_marketcap = 0;
                    }
                    for (i = 0; i < 24; i++) {
                        marketcapList[i] = Math.round(inforows[i].coin_1_quote * inforows[i].coin_1_supply / 1E4) / 100;
                    }
    
                    for (i = 0; i < 168; i++) {
                        marketcapList_7d[i] = Math.round(inforows[i].coin_1_quote * inforows[i].coin_1_supply / 1E4) / 100;
                        labels_7d.push(-i + " hr");
                    }
    
                    for (i = 0; i < inforows.length; i++) {
                        marketcapList_30d[i] = Math.round(inforows[i].coin_1_quote * inforows[i].coin_1_supply / 1E4) / 100;
                        labels_30d.push(-i + "hr");
                    }
    
    
                    let chartobj2_24hrs = {
                        type: 'bar',
                        
                        data: {
                            labels:
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr1','-23hr'],
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
                    content2_24hrs += "<canvas id='chartjs-2_24hrs' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content2_24hrs += "<script>new Chart(document.getElementById('chartjs-2_24hrs')," + JSON.stringify(chartobj2_24hrs) + ");</script>";
    
                    let chartobj2_7d = {
                        type: 'bar',
                        data: {
                            labels: labels_7d,
                            datasets:
                                [{
                                    'label': 'ETHO market cap (MUSD)',
                                    data: marketcapList_7d,
                                    backgroundColor: 'rgb(171,47,73)'
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    content2_7d += "<canvas id='chartjs-2-7d' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content2_7d += "<script>new Chart(document.getElementById('chartjs-2-7d')," + JSON.stringify(chartobj2_7d) + ");</script>";
    
                    let chartobj2_30d = {
                        type: 'bar',
                        data: {
                            labels: labels_30d,
                            datasets:
                                [{
                                    'label': 'ETHO market cap (MUSD)',
                                    data: marketcapList_30d,
                                    backgroundColor: 'rgb(171,47,73)'
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    content2_30d += "<canvas id='chartjs-2-30d' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content2_30d += "<script>new Chart(document.getElementById('chartjs-2-30d')," + JSON.stringify(chartobj2_30d) + ");</script>";
    
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
                        chart1_24hrs: content2_24hrs,
                        chart1_7d: content2_7d,
                        chart1_30d: content2_30d,
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
