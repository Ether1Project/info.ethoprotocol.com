const logger = require("../logger");
const {MISC_numberFormating} = require('../misc');
const got = require('got');
const ping = require('ping');
const checkCertExpiration = require('check-cert-expiration');
const tabletojson = require('tabletojson').Tabletojson;
const ethofsSDK = require('@ethofs/sdk');


var express = require('express');
var router = express.Router();

const lastElement_24hrs=24;
const lastElement_7d=168;
const lastElement_30d=720;


/* GET home page. */
router.get('/', function(req, res, next) {
    var currency;
    var title;
    
    let data=[];
    
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT 1";
    
    pool.query(vsql)
        .then(async (inforows) => {
    
            let dateParts = inforows[0].date;
            let now = Date.now();
            data.date = dateParts + " GMT ";
//            data.secs = (now - dateParts.getTime())/1000;
            logger.info("Secs left %s", now);
//            logger.info("Secs left %s", data.secs);
    
            logger.info("#server.routes.index.get: %s", req.headers.host);
            res.render('index', {
                version: version,
                data: data,
                title: 'ETHO | Coin dashboard'
            });
        });
});

/* GET home page. */
router.get('/dash_storagecost', async function(req, res, next) {    var currency;    var title;
    
    logger.info("#server.routes.index.get.dash_storagecost: size: %s, length: %s",req.query.size, req.query.duration);
    
    let length="";
    let cost=0;
    
    if (req.query.size==undefined)
        req.query.size=1;
    if (req.query.duration==undefined)
        req.query.duration=2233107;
    
    if (req.query.duration==6646)
        length+='<option value="6646" selected>1 day</option>';
    else
        length+='<option value="6646">1 day</option>';
    if (req.query.duration==13292)
        length+='<option value="13292" selected>2 days</option>';
    else
        length+='<option value="13292">2 days</option>';
    if (req.query.duration==19938)
        length+='<option value="19938" selected>3 days</option>';
    else
        length+='<option value="19938">3 days</option>';
    if (req.query.duration==26548)
        length+='<option value="26548" selected>4 days</option>';
    else
        length+='<option value="26548">4 days</option>';
    if (req.query.duration==33230)
        length+='<option value="33230" selected>5 days</option>';
    else
        length+='<option value="33230">5 days</option>';
    if (req.query.duration==39876)
        length+='<option value="39876" selected>6 days</option>';
    else
        length+='<option value="39876">6 days</option>';
    if (req.query.duration==46523)
        length+='<option value="46523" selected>7 days</option>';
    else
        length+='<option value="46523">7 days</option>';
    if (req.query.duration==93046)
        length+='<option value="93046" selected>2 weeks</option>';
    else
        length+='<option value="93046">2 weeks</option>';
    if (req.query.duration==139569)
        length+='<option value="139569" selected>3 weeks</option>';
    else
        length+='<option value="139569">3 weeks</option>';
    if (req.query.duration==186029)
        length+='<option value="186029" selected>4 weeks</option>';
    else
        length+='<option value="186029">4 weeks</option>';
    if (req.query.duration==372194)
        length+='<option value="372194" selected>2 months</option>';
    else
        length+='<option value="372194">2 months</option>';
    if (req.query.duration==558276)
        length+='<option value="558276" selected>3 months</option>';
    else
        length+='<option value="558276">3 months</option>';
    if (req.query.duration==744369)
        length+='<option value="744369" selected>4 months</option>';
    else
        length+='<option value="744369">4 months</option>';
    
    if (req.query.duration==930461)
        length+='<option value="930461" selected>5 months</option>';
    else
        length+='<option value="930461">5 months</option>';
    
    if (req.query.duration==1116553)
        length+='<option value="1116553" selected>6 months</option>';
    else
        length+='<option value="1116553">6 months</option>';
    
    if (req.query.duration==2233107)
        length+='<option value="2233107" selected>12 months</option>';
    else
        length+='<option value="2233107">12 months</option>';
    
    if (req.query.duration==4466215)
        length+='<option value="4466215" selected>2 years</option>';
    else
        length+='<option value="4466215">2 years</option>';

    if (req.query.duration==6699323)
        length+='<option value="6699323" selected>3 years</option>';
    else
        length+='<option value="6699323">3 years</option>';
    if (req.query.duration==8932430)
        length+='<option value="8932430" selected>4 years</option>';
    else
        length+='<option value="8932430">4 years</option>';
    
    if (req.query.duration==11165538)
        length+='<option value="11165538" selected>5 years</option>';
    else
        length+='<option value="11165538">5 years</option>';
    
    if (req.query.duration==13398646)
        length+='<option value="13398646" selected>6 years</option>';
    else
        length+='<option value="13398646">6 years</option>';
    
    if (req.query.duration==15631753)
        length+='<option value="15631753" selected>7 years</option>';
    else
        length+='<option value="15631753">7 years</option>';
    
    if (req.query.duration==17864861)
        length+='<option value="17864861" selected>8 years</option>';
    else
        length+='<option value="17864861">8 years</option>';
    
    
    
    
    
    length+='</select>';
    
    
    let selector_size;
    if (req.query.size==1)
        selector_size+='<option value="1" selected>1 MB</option>';
    else
        selector_size+='<option value="1">1 MB</option>';
    
    if (req.query.size==2)
        selector_size+='<option value="2" selected>2 MB</option>';
    else
        selector_size+='<option value="2">2 MB</option>';
    
    if (req.query.size==5)
        selector_size+='<option value="5" selected>5 MB</option>';
    else
        selector_size+='<option value="5">5 MB</option>';
    
    if (req.query.size==10)
        selector_size+='<option value="10" selected>10 MB</option>';
    else
        selector_size+='<option value="10">10 MB</option>';
    
    if (req.query.size==25)
        selector_size+='<option value="25" selected>25 MB</option>';
    else
        selector_size+='<option value="25">25 MB</option>';
    
    if (req.query.size==50)
        selector_size+='<option value="50" selected>50 MB</option>';
    else
        selector_size+='<option value="50">50 MB</option>';
    
    if (req.query.size==100)
        selector_size+='<option value="100" selected>100 MB</option>';
    else
        selector_size+='<option value="100">100 MB</option>';
    
    if (req.query.size==250)
        selector_size+='<option value="250" selected>250 MB</option>';
    else
        selector_size+='<option value="250">250 MB</option>';
    
    if (req.query.size==500)
        selector_size+='<option value="500" selected>500 MB</option>';
    else
        selector_size+='<option value="500">500 MB</option>';
    
    if (req.query.size==1000)
        selector_size+='<option value="1000" selected>1000 MB</option>';
    else
        selector_size+='<option value="1000">1000 MB</option>';
    
    selector_size+='</select>';
    
    let ethofs = ethofsSDK(global.config.ETHOSERIAL);
    
    const options = {
        ethofsOptions: {
            hostingContractDuration: parseInt(req.query.duration),
            hostingContractSize: parseInt(req.query.size*1E6)
        }
    };
    console.log(options);
    ethofs.calculateCost(options).then((cost)=> {
        console.log(cost);
        res.render('dash_storagecost', {
            version: version,
            selector_length: length,
            selector_size: selector_size,
            cost: Math.round(1000*cost.uploadCost/1E18)/1000,
            title: 'ETHO | File storage cost calculator'
        });
    
    })
        .catch((error)=> {
            logger.error("#server.routes.index.get.dash_storagecost: size: %s",error);
        })
    
 });


/* GET home page. */
router.get('/dash_overview', async function(req, res, next) {
    
    logger.info("#server.routes.index.get.dash_overview");
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT "+ lastElement_30d;
    
    pool.query(vsql)
        .then(async (inforows) => {
    
            let data = [];
            let label = [];
    
            data.supply = MISC_numberFormating(Math.round(inforows[0].coin_1_supply * 100) / 100);
    
            let rgbstr = [];
            let supply = [];
            label.push("Wrapped ETHO");
            rgbstr.push('rgb(2,84,248)');
            supply.push(Math.round(100*(inforows[0].wetho_totalSupply/1E18)/100))
    
            label.push("Exchanges");
            rgbstr.push('rgb(191,3,243)');
            let exchange_all=getExchanges(inforows[0]);
            supply.push(Math.round((100*exchange_all)/100));
    
            label.push("Dev fund");
            rgbstr.push('rgb(70,248,5)');
            let devfund = inforows[0].etho_devfund;
            supply.push(Math.round((100*devfund)/100));
    
    
            let nodes_collateral=parseInt(inforows[0].etho_active_gatewaynodes*30000)+ parseInt(inforows[0].etho_active_masternode*15000)+ parseInt(inforows[0].etho_active_servicenodes*5000);
            label.push("Nodes");
            rgbstr.push('rgb(239,66,127)');
            supply.push(Math.round((100*nodes_collateral)/100));
    
            let remain=Math.round(100*(inforows[0].coin_1_supply-inforows[0].wetho_totalSupply/1E18-exchange_all-inforows[0].etho_devfund-nodes_collateral))/100;
            
            label.push("HODL");
            rgbstr.push('rgb(7,7,7)');
            supply.push(Math.round((100*remain)/100));
    
    
            let chartobj = {
                type: 'pie',
                data: {
                    labels: label,
    
                    datasets:
                        [{
                            'label': "Supply distribution",
                            backgroundColor: rgbstr,
                            data: supply
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
    
            // Create chart for dev account
            let devaccount_30d=[];
            let labels_30d=[];
            let i;
            for (i = 0; i < lastElement_30d; i++) {
                devaccount_30d[i] = inforows[i].etho_devfund;
                labels_30d.push(-i + " hr");
        
            }
    
            let chartobj2 = {
                type: 'line',
                data: {
                    labels:
                    labels_30d,
            
                    datasets:
                        [{
                            'label': 'Dev account',
                            data: devaccount_30d,
                            backgroundColor: 'rgb(87,190,194)',
                            fill: true
                        }]
            
                },
                options: {
                    responsive: true
                }
            };
    
            let content2;
            content2 = "<canvas id='chartjs-2' class='chartjs'></canvas>";
            content2 += "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
    
    
            res.render('dash_overview', {
                version: version,
                title: 'ETHO | Overview',
                data: data,
                chart1: content1,
                chart2: content2
            });
        })
        .catch((error)=>{
            logger.error("##server.routes.index.get.dash_overview: Error %s", error);
        })
});


/* GET home page. */
router.get('/dash_activity', async function(req, res, next) {
    
    logger.info("#server.routes.index.get.dash_activity");
    let data=[];
    
    
    res.render('dash_activity', {
        version: version,
        title: 'ETHO | Activity',
        data: data
    });
});

async function read_repos(octokit, res, page) {
    
    await octokit.request('GET /orgs/{org}/repos', {
        org: 'Ether1Project',
        page: page
    }).then((ok) => {
        let i;
        let data;
        
        let headers=ok.headers.link.split(",");
        for (i=0;i<headers.length;i++) {
            if (headers[i].search("; rel=\"next\"")>0) {
                console.log("++++++++");
                data=headers[i].match(/page=(\d*)/);
                console.log(data[1]);
                read_repos(octokit, res, data[1]);
            }
        }
        logger.info("#server.routes.index.get.dash_activity: Nr of repos: %s", ok.data.length);
        res+=ok.data.length;
        
        return(res);
    });
    
}

router.get('/dash_social', async function(req, res, next) {
    
    logger.info("#server.routes.index.get.dash_social");
    
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT " + lastElement_30d;
    
    pool.query(vsql)
        .then(async (inforows) => {
            
            let data=[];
            data.socialDiscord_members=inforows[0].socialDiscord_members;
            
            
            let content1_24hrs = "";
            let content1_7d = "";
            let content1_30d = "";
            
            let memberList = [];
            let memberList_7d = [];
            let memberList_30d = [];
            
            let labels_7d = [];
            let labels_30d = [];
            
            let i;
            for (i = 0; i < lastElement_24hrs; i++) {
                memberList[i] = inforows[i].socialDiscord_members;
            }
            
            for (i = 0; i < lastElement_7d; i++) {
                memberList_7d[i] = inforows[i].socialDiscord_members;
                labels_7d.push(-i + " hr");
            }
            
            for (i = 0; i < inforows.length; i++) {
                memberList_30d[i] = inforows[i].socialDiscord_members;
                labels_30d.push(-i + "hr");
            }
            
            
            let chartobj2_24hrs = {
                type: 'line',
                
                data: {
                    labels:
                        ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr', '-23hr'],
                    datasets:
                        [{
                            'label': 'Discord member count',
                            data: memberList,
                            backgroundColor: 'rgb(171,47,73)'
                        }]
                },
                options: {
                    responsive: true
                }
            };
            // Create charts
            content1_24hrs += "<canvas id='chartjs-2_24hrs' class='chartjs'></canvas>";
            content1_24hrs += "<script>new Chart(document.getElementById('chartjs-2_24hrs')," + JSON.stringify(chartobj2_24hrs) + ");</script>";
            
            let chartobj2_7d = {
                type: 'line',
                data: {
                    labels: labels_7d,
                    datasets:
                        [{
                            'label': 'Discord member cout',
                            data: memberList_7d,
                            backgroundColor: 'rgb(171,47,73)'
                        }]
                    
                },
                options: {
                    responsive: true,
                }
            };
            // Create charts
            content1_7d += "<canvas id='chartjs-2-7d' class='chartjs'></canvas>";
            content1_7d += "<script>new Chart(document.getElementById('chartjs-2-7d')," + JSON.stringify(chartobj2_7d) + ");</script>";
            
            let chartobj2_30d = {
                type: 'line',
                data: {
                    labels: labels_30d,
                    datasets:
                        [{
                            'label': 'Discord member count',
                            data: memberList_30d,
                            backgroundColor: 'rgb(171,47,73)'
                        }]
                    
                },
                options: {
                    responsive: true,
                }
            };
            // Create charts
            content1_30d += "<canvas id='chartjs-2-30d' class='chartjs'></canvas>";
            content1_30d += "<script>new Chart(document.getElementById('chartjs-2-30d')," + JSON.stringify(chartobj2_30d) + ");</script>";
            
            
            
            let dateParts = inforows[0].date;
            data.date = dateParts + " GMT ";
            
            res.render('dash_social', {
                version: version,
                title: 'ETHO | Social',
                data: data,
                chart1_24hrs: content1_24hrs,
                chart1_7d: content1_7d,
                chart1_30d: content1_30d
                
            });
        })
})



router.get('/dash_wetho', async function(req, res, next) {
    
    logger.info("#server.routes.index.get.dash_activity:s");
    
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT "+ lastElement_30d;
    
    pool.query(vsql)
        .then(async (inforows) => {
            
            let data=[];
            data.transfersCount=inforows[0].wetho_tranfersCount;
            data.totalSupply=MISC_numberFormating(Math.round(100*(inforows[0].wetho_totalSupply/1E18)/100));
            data.holdersCount=inforows[0].wetho_holdersCount;
            data.percentageSupply=Math.round(10000*((inforows[0].wetho_totalSupply/1E18)/inforows[0].coin_1_supply))/100;
    
    
            let content1_24hrs = "";
            let content1_7d = "";
            let content1_30d = "";
            let content2_24hrs = "";
            let content2_7d = "";
            let content2_30d = "";
    
            let marketcapList = [];
            let marketcapList_7d = [];
            let marketcapList_30d = [];
            let wethoList = [];
            let wethoList_7d = [];
            let wethoList_30d = [];
    
    
            let labels_7d = [];
            let labels_30d = [];
    
            let i;
            for (i = 0; i < inforows.length; i++) {
                if (inforows[i].coin_1_marketcap == null)
                    inforows[i].coin_1_marketcap = 0;
            }
            for (i = 0; i < lastElement_24hrs; i++) {
                marketcapList[i] = Math.round(inforows[i].coin_1_quote * inforows[i].wetho_totalSupply / 1E16) / 100;
                wethoList[i] = Math.round(inforows[i].wetho_totalSupply/1E16) / 100;
            }
    
            for (i = 0; i < lastElement_7d; i++) {
                marketcapList_7d[i] = Math.round(inforows[i].coin_1_quote * inforows[i].wetho_totalSupply / 1E16) / 100;
                wethoList_7d[i] = Math.round(inforows[i].wetho_totalSupply/1E16) / 100;
                labels_7d.push(-i + " hr");
            }
    
            for (i = 0; i < inforows.length; i++) {
                marketcapList_30d[i] = Math.round(inforows[i].coin_1_quote * inforows[i].wetho_totalSupply / 1E16) / 100;
                wethoList_30d[i] = Math.round(inforows[i].wetho_totalSupply/1E16) / 100;
                labels_30d.push(-i + "hr");
            }
    
    
            let chartobj2_24hrs = {
                type: 'bar',
        
                data: {
                    labels:
                        ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr', '-23hr'],
                    datasets:
                        [{
                            'label': 'wETHO market cap (USD)',
                            data: marketcapList,
                            backgroundColor: 'rgb(171,47,73)'
                        }]
                },
                options: {
                    responsive: true
                }
            };
            // Create charts
            content2_24hrs += "<canvas id='chartjs-2_24hrs' class='chartjs'></canvas>";
            content2_24hrs += "<script>new Chart(document.getElementById('chartjs-2_24hrs')," + JSON.stringify(chartobj2_24hrs) + ");</script>";
    
            let chartobj2_7d = {
                type: 'bar',
                data: {
                    labels: labels_7d,
                    datasets:
                        [{
                            'label': 'wETHO market cap (USD)',
                            data: marketcapList_7d,
                            backgroundColor: 'rgb(171,47,73)'
                        }]
            
                },
                options: {
                    responsive: true,
                }
            };
            // Create charts
            content2_7d += "<canvas id='chartjs-2-7d' class='chartjs'></canvas>";
            content2_7d += "<script>new Chart(document.getElementById('chartjs-2-7d')," + JSON.stringify(chartobj2_7d) + ");</script>";
    
            let chartobj2_30d = {
                type: 'bar',
                data: {
                    labels: labels_30d,
                    datasets:
                        [{
                            'label': 'wETHO market cap (USD)',
                            data: marketcapList_30d,
                            backgroundColor: 'rgb(171,47,73)'
                        }]
            
                },
                options: {
                    responsive: true,
                }
            };
            // Create charts
            content2_30d += "<canvas id='chartjs-2-30d' class='chartjs'></canvas>";
            content2_30d += "<script>new Chart(document.getElementById('chartjs-2-30d')," + JSON.stringify(chartobj2_30d) + ");</script>";
    
            let chartobj1_24hrs = {
                type: 'bar',
        
                data: {
                    labels:
                        ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr', '-23hr'],
                    datasets:
                        [{
                            'label': 'wETHO Supply',
                            data: wethoList,
                            backgroundColor: 'rgb(3,149,248)'
                        }]
                },
                options: {
                    responsive: true
                }
            };
            // Create charts
            content1_24hrs += "<canvas id='chartjs-1_24hrs' class='chartjs'></canvas>";
            content1_24hrs += "<script>new Chart(document.getElementById('chartjs-1_24hrs')," + JSON.stringify(chartobj1_24hrs) + ");</script>";
    
            let chartobj1_7d = {
                type: 'bar',
                data: {
                    labels: labels_7d,
                    datasets:
                        [{
                            'label': 'wETHO supply',
                            data: wethoList_7d,
                            backgroundColor: 'rgb(3,149,248)'
                        }]
            
                },
                options: {
                    responsive: true,
                }
            };
            // Create charts
            content1_7d += "<canvas id='chartjs-1-7d' class='chartjs'></canvas>";
            content1_7d += "<script>new Chart(document.getElementById('chartjs-1-7d')," + JSON.stringify(chartobj1_7d) + ");</script>";
    
            let chartobj1_30d = {
                type: 'bar',
                data: {
                    labels: labels_30d,
                    datasets:
                        [{
                            'label': 'wETHO supply',
                            data: wethoList_30d,
                            backgroundColor: 'rgb(3,149,248)'
                        }]
            
                },
                options: {
                    responsive: true,
                }
            };
            // Create charts
            content1_30d += "<canvas id='chartjs-1-30d' class='chartjs'></canvas>";
            content1_30d += "<script>new Chart(document.getElementById('chartjs-1-30d')," + JSON.stringify(chartobj1_30d) + ");</script>";
    
    
            let dateParts = inforows[0].date;
            data.date = dateParts + " GMT ";
    
            res.render('dash_wetho', {
                version: version,
                title: 'ETHO | Wrapped ETHO',
                data: data,
                chart1_24hrs: content1_24hrs,
                chart1_7d: content1_7d,
                chart1_30d: content1_30d,
                chart2_24hrs: content2_24hrs,
                chart2_7d: content2_7d,
                chart2_30d: content2_30d,
    
            });
        })
})







/* GET home page. */
router.get('/dash_richlist', async function(req, res, next) {
    
    logger.info("#server.routes.index.get: %s", req.headers.host);
    
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT " + lastElement_24hrs;
    
    pool.query(vsql)
        .then(async (inforows) => {
            let supply = inforows[0].coin_1_supply;
            let tablesAsJson = JSON.parse(inforows[0].etho_richlist);
            let i;
            let top50share = [];
            let top50label = [];
            
            let labelstr = [];
            let max = supply;
            let exchange_all=getExchanges(inforows[0]);
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
                            backgroundColor: 'rgb(97,182,246)',
                            data: rich_24hrs,
                            fill: true
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
    
            let dateParts = inforows[0].date;
            data.date=dateParts+ " GMT ";
    
    
            res.render('dash_richlist', {
                version: version,
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
    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 1";
    
    pool.query(vsql)
        .then(async (inforows) => {
    
            const {body} = await got('http://api.ether1.org/ethofsapi.php?api=network_stats_archive');
            bd = JSON.parse(body);
            console.log(countProperties(bd));
            let i = 0;
            let k = 0;
            let labels = [];
            let obj;
    
            for (key in bd) {
                if (bd.hasOwnProperty(key)) {
                    if (!(k % 100)) {
                        contracts[i] = parseInt(bd[key].activeUploadContracts).toString();
                        networkStorage[i] = parseInt(bd[key].totalNetworkStorageUsed) / 1E9;
                        labels.push(1000000 + i * 100000);
                        i = i + 1;
                    }
                    k = k + 1;
                }
            }
    
            let ethofs = ethofsSDK(global.config.ETHOSERIAL);
    
            const options = {
                ethofsOptions: {
                    hostingContractDuration: parseInt(100000),
                    hostingContractSize: parseInt(1E6)
                }
            };
            data.cost = await ethofs.calculateCost(options)
                .then((result) => {
                    //handle results here
                    logger.info("#server.routes.index.get.dash_ipfs: %s", result);
                    return (result.uploadCost / 1E18);
                })
                .catch((err) => {
                    //handle error here
                    logger.error("#server.routes.index.get.dash_ipfs: %s", err);
                    return (0);
                })
    
            data.cost = Math.round(data.cost * 10000) / 10000;
    
    
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
    
            let dateParts = inforows[0].date;
            data.date = dateParts + " GMT ";
    
            res.render('dash_ipfs', {
                version: version,
                title: 'ETHO | IPFS dashboard',
                data: data,
                chart1: content1,
                chart2: content2
            });
        });
});

function countProperties(obj) {
    return Object.keys(obj).length;
}

/* GET home page. */
router.get('/dash_exchanges', async function(req, res, next) {
    let bd=[];
    
    logger.info("#server.routes.index.get.dash_exchanges");
    let data=[];
    let exchange_percent;
    
    
    let vsql="SELECT * FROM info ORDER BY id DESC LIMIT 25";
    
    pool.query(vsql)
        .then(async (inforows) => {
            let exchange_all=getExchanges(inforows[0]);
            await got('https://api.ether1.org/api.php?api=chain_summary')
                .then((body)=>{
                    logger.info("Body %s", JSON.parse(body.body)); // Print the json response
                    bd = JSON.parse(body.body);
                    exchange_percent=Math.round(exchange_all/bd.circulating_supply*10000)/100
            
                })
                .catch((error)=>{
                    logger.error("#server.routes.index.get.dash_exchanges: Error %s", error);
                    exchange_percent="Not available";
                })
    
    
            data.push({
                exchange_kucoin: MISC_numberFormating(inforows[0].etho_exchange_kucoin),
                exchange_stex: MISC_numberFormating(inforows[0].etho_exchange_stex),
                exchange_graviex: MISC_numberFormating(inforows[0].etho_exchange_graviex),
                exchange_probit: MISC_numberFormating(inforows[0].etho_exchange_probit),
                exchange_mercatox: MISC_numberFormating(inforows[0].etho_exchange_mercatox),
                exchange_all: MISC_numberFormating(exchange_all),
                exchange_percent: exchange_percent,
                kucoinFluctuation: Math.round((inforows[0].etho_exchange_kucoin/inforows[23].etho_exchange_kucoin*100-100)*100)/100,
                stexFluctuation: Math.round((inforows[0].etho_exchange_stex/inforows[23].etho_exchange_stex*100-100)*100)/100,
                graviexFluctuation: Math.round((inforows[0].etho_exchange_graviex/inforows[23].etho_exchange_graviex*100-100)*100)/100,
                probitFluctuation: Math.round((inforows[0].etho_exchange_probit/inforows[23].etho_exchange_probit*100-100)*100)/100,
                mercatoxFluctuation: Math.round((inforows[0].etho_exchange_mercatox/inforows[23].etho_exchange_mercatox*100-100)*100)/100
            })

            
            // Generate chart
            logger.info("#server.routes.index.get.dash_exchanges: Generating chart");
    
            let exchange_stex = [];
            let exchange_kucoin = [];
            let exchange_graviex = [];
            let exchange_mercatox = [];
            let exchange_probit = [];
            let i;
            for (i = 0; i < inforows.length; i++) {
                if (inforows[i].etho_exchange_stex == null) {
                    inforows[i].etho_exchange_stex = 0;
                    inforows[i].etho_exchange_kucoin = 0;
                    inforows[i].etho_exchange_graviex = 0;
                    inforows[i].etho_exchange_probit = 0;
                    inforows[i].etho_exchange_mercatox = 0;

                }
            }
            for (i = 0; i < inforows.length; i++) {
                exchange_kucoin[i] = (inforows[i].etho_exchange_kucoin);
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
                            'label': 'Marcatox wallet',
                            data: exchange_mercatox,
                            backgroundColor: 'rgb(26,238,26)'
                        },{
                            'label': 'Graviex wallet',
                            data: exchange_graviex,
                            backgroundColor: 'rgb(239,239,12)'
                        },{
                            'label': 'Probit wallet',
                            data: exchange_probit,
                            backgroundColor: 'rgb(236,13,13)'
                        },{
                            'label': 'STEX wallet',
                            data: exchange_stex,
                            backgroundColor: 'rgb(8,168,241)'
                        },{
                            'label': 'Kucoin wallet',
                            data: exchange_kucoin,
                            backgroundColor: 'rgb(8,28,1)'
                        }
                        ]
            
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            stacked: true
                        }
                    }
    
                }
            };
            // Create charts
            let content = "";
            content += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
            content += "" +
                "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj1) + ");</script>";
    
            let exchanges_percentage=[];
            for (i = 0; i < inforows.length; i++) {
                exchanges_percentage[i]=100*(inforows[i].etho_exchange_kucoin+inforows[i].etho_exchange_stex+inforows[i].etho_exchange_graviex+inforows[i].etho_exchange_probit+inforows[i].etho_exchange_mercatox)/inforows[i].coin_1_supply;
            }
    
            let chartobj2 = {
                type: 'line',
                data: {
                    labels:
                        ['Now', '-1hr', '-2hr', '-3hr', '-4hr', '-5hr', '-6hr', '-7hr', '-8hr', '-9hr', '-10hr', '-11hr', '-12hr', '-13hr', '-14hr', '-15hr', '-16hr', '-17hr', '-18hr', '-19hr', '-20hr', '-21hr', '-22hr', '-23hr'],
                    datasets:
                        [{
                            'label': 'Percentage locked',
                            data: exchanges_percentage,
                            backgroundColor: 'rgb(129,128,128)'
                        }
                        ]
            
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Hours'
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        }
                    }
                }
             };
            // Create charts
            let content2 = "";
            content2 += "<canvas id='chartjs-2' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
            content2 += "<script>new Chart(document.getElementById('chartjs-2')," + JSON.stringify(chartobj2) + ");</script>";
    
            let dateParts = inforows[0].date;
            data.date=dateParts+ " GMT ";
    
            res.render('dash_exchanges', {
                version: version,
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
    
    
    logger.info("#server.routes.index.get.dash_health");
    
    let vsql = "SELECT * FROM info ORDER BY id DESC LIMIT 1";
    
    pool.query(vsql)
        .then(async (inforows) => {
            
            let server = ["explorer.ethoprotocol.com", "explorer2.ethoprotocol.com", "info.ethoprotocol.com", "www.ethoprotocol.com", "nodes.ethoprotocol.com", "richlist.ethoprotocol.com", "uploads.ethoprotocol.com", "wallet.ethoprotocol.com", "stats.ethoprotocol.com"];
            let data = [];
            let i;
    
    
            for (i = 0; i < server.length; i++) {
                await ping.promise.probe(server[i])
                    .then(async (pingres) => {
                        await got('https://' + server[i])
                            .then(async (response) => {
                                logger.info("#server.routes.index.get.dash_health: Pinging server %s", server[i]);
                                await (async function () {
                                    try {
                                        logger.info("#server.routes.index.get.dash_health: Cert checking server %s", server[i]);
    
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
            logger.info("#server.routes.index.get.dash_health: Render page");
    
            let dateParts = inforows[0].date;
            data.date = dateParts + " GMT ";
            
            res.render('dash_health', {
                version: version,
                title: 'ETHO | Coin dashboard',
                data: data
            });
        })
        .catch((error)=>{
            logger.error("#server..routes.index.get.dash_health: Error: %s", error);
        })
});


/* GET home page. */
router.get('/dash_financial', function(req, res, next) {
    let data = [];
    let bd = [];
    
    (async () => {
        await got('https://api.ether1.org/api.php?api=chain_summary')
            .then((body) => {
                logger.info("Body %s", body.body); // Print the json response
                bd = JSON.parse(body.body);
                data.blockheight = MISC_numberFormating(bd.block_height);
                data.circulatingsupply = MISC_numberFormating(bd.circulating_supply);
            })
            .catch((error) => {
                logger.error('#server.route.dash_financial: Error %s', error);
                data.blockheight = "Not available";
                data.circulatingsupply = "Not available";
            })
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT "+ lastElement_30d;
        
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
                    content1 += "<canvas id='chartjs-1' class='chartjs'></canvas>";
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
                    for (i = 0; i < lastElement_24hrs; i++) {
                        marketcapList[i] = Math.round(inforows[i].coin_1_quote * inforows[i].coin_1_supply / 1E4) / 100;
                    }
    
                    for (i = 0; i < lastElement_7d; i++) {
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
                    content2_24hrs += "<canvas id='chartjs-2_24hrs' class='chartjs' style='height:55vh; width:40vw; display: flex;'></canvas>";
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
                    content2_7d += "<canvas id='chartjs-2-7d' class='chartjs' style='height:55vh; width:40vw; display: flex;'></canvas>";
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
                    content2_30d += "<canvas id='chartjs-2-30d' class='chartjs' style='height:55vh; width:40vw; display: flex;'></canvas>";
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

                    let dateParts = inforows[0].date;
                    data.date=dateParts+ " GMT ";
                    
                    res.render('dash_financial', {
                        version: version,
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
                        version: version,
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
            data.year = MISC_numberFormating(Math.round(inforows[0].coin_1_quote / 0.005 * 100000) / 100);
    
            let dateParts = inforows[0].date;
            data.date = dateParts + " GMT ";
    
            res.render('dash_financial2', {
                version: version,
                title: 'ETHO | Financial 2 dashboard',
                data: data
            });
        });
    
});

router.get('/dash_cmctrending', function(req, res, next) {
    let data = [];
    
    
    (async () => {
        await got('https://api.ether1.org/api.php?api=chain_summary')
            .then((body) => {
                logger.info("Body %s", JSON.parse(body.body)); // Print the json response
                bd = JSON.parse(body.body);
                data.blockheight = MISC_numberFormating(bd.block_height);
                data.circulatingsupply = MISC_numberFormating(bd.circulating_supply);
            })
            .catch((error) => {
                logger.error('#server.route.dash_financial: Error %s', error);
                data.blockheight = "Not available";
                data.circulatingsupply = "Not available";
            })
        
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT "+ lastElement_30d;
        
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
                    for (i=0;i<lastElement_24hrs;i++) {
                        watchlist[i]=inforows[i].etho_watchlist-inforows[23].etho_watchlist;
                    }
                    
                    let chartobj = {
                        type: 'bar',
                        data: {
                            labels:
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
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
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
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
    
                    // Generate line chart
                    let cmcrank = [];
                    for (i=0;i<lastElement_24hrs;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmcrank[i]=inforows[i].coin_1_rank;
                    }
    
                    chartobj = {
                        type: 'line',
                        data: {
                            labels:
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                            datasets:
                                [{'label':'CMC ETHO position',
                                    data: cmcrank,
                                    backgroundColor: 'rgb(0,0,0)'
                    
                                }]
            
                        },
                        options: {
                            responsive: true,
                            }
                    };
                    // Create charts
                    let content3_24hrs = "";
                    content3_24hrs += "<canvas id='chartjs-6_24hrs' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content3_24hrs += "" +
                        "<script>new Chart(document.getElementById('chartjs-6_24hrs')," + JSON.stringify(chartobj) + ");</script>";
    
                    let cmcrank_7d=[];
                    let cmcrank_30d=[];
                    let labels_7d=[];
                    let labels_30d=[];
                    
                    for (i = 0; i < lastElement_7d; i++) {
                        cmcrank_7d[i] = inforows[i].coin_1_rank;
                        labels_7d.push(-i + " hr");
                    }
                    chartobj = {
                        type: 'line',
                        data: {
                            labels: labels_7d,
                            datasets:
                                [{'label':'CMC ETHO position',
                                    data: cmcrank_7d,
                                    backgroundColor: 'rgb(0,0,0)'
                    
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content3_7d = "";
                    content3_7d += "<canvas id='chartjs-6_7d' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content3_7d += "" +
                        "<script>new Chart(document.getElementById('chartjs-6_7d')," + JSON.stringify(chartobj) + ");</script>";
    
    
                    for (i = 0; i < inforows.length; i++) {
                        cmcrank_30d[i] = inforows[i].coin_1_rank;
                        labels_30d.push(-i + " hr");
                    }
                    chartobj = {
                        type: 'line',
                        data: {
                            labels: labels_30d,
                            datasets:
                                [{'label':'CMC ETHO position',
                                    data: cmcrank_30d,
                                    backgroundColor: 'rgb(0,0,0)'
                    
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content3_30d = "";
                    content3_30d += "<canvas id='chartjs-6_30d' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content3_30d += "" +
                        "<script>new Chart(document.getElementById('chartjs-6_30d')," + JSON.stringify(chartobj) + ");</script>";
    
    
    
                    // Generate line chart
                    let cmc_etho_rank_24hrs = [];
                    for (i=0;i<lastElement_24hrs;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_etho_rank_24hrs[i]=inforows[i].coin_1_rank;
                    }
    
                    let cmc_fil_rank_24hrs = [];
                    for (i=0;i<lastElement_24hrs;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_fil_rank_24hrs[i]=inforows[i].coin_2_rank;
                    }
    
                    let cmc_sia_rank_24hrs = [];
                    for (i=0;i<lastElement_24hrs;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_sia_rank_24hrs[i]=inforows[i].coin_3_rank;
                    }
    
                    let cmc_storj_rank_24hrs = [];
                    for (i=0;i<lastElement_24hrs;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_storj_rank_24hrs[i]=inforows[i].coin_4_rank;
                    }
    
                    chartobj = {
                        type: 'line',
                        data: {
                            labels:
                                ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                            datasets:
                                [{
                                    'label': 'ETHO ranking',
                                    data: cmc_etho_rank_24hrs,
                                    backgroundColor: 'rgb(2,2,2)'
                                },{
                                    'label': 'Filecoin ranking',
                                    data: cmc_fil_rank_24hrs,
                                    backgroundColor: 'rgb(239,239,12)'
                                },{
                                    'label': 'Sia coin',
                                    data: cmc_sia_rank_24hrs,
                                    backgroundColor: 'rgb(66,241,5)'
                                },{
                                    'label': 'STORJ coin',
                                    data: cmc_storj_rank_24hrs,
                                    backgroundColor: 'rgb(236,13,13)'
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content4_24hrs = "";
                    content4_24hrs += "<canvas id='chartjs-7_24hrs' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content4_24hrs += "" +
                        "<script>new Chart(document.getElementById('chartjs-7_24hrs')," + JSON.stringify(chartobj) + ");</script>";
    
                    // Generate line chart
                    let cmc_etho_rank_7d = [];
    
                    for (i=0;i<lastElement_7d;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_etho_rank_7d[i]=inforows[i].coin_1_rank;
                    }
    
                    let cmc_fil_rank_7d = [];
                    for (i=0;i<lastElement_7d;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_fil_rank_7d[i]=inforows[i].coin_2_rank;
                    }
    
                    let cmc_sia_rank_7d = [];
                    for (i=0;i<lastElement_7d;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_sia_rank_7d[i]=inforows[i].coin_3_rank;
                    }
    
                    let cmc_storj_rank_7d = [];
                    for (i=0;i<lastElement_7d;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_storj_rank_7d[i]=inforows[i].coin_4_rank;
                    }
    
                    chartobj = {
                        type: 'line',
                        data: {
                            labels: labels_7d,
                            datasets:
                                [{
                                    'label': 'ETHO ranking',
                                    data: cmc_etho_rank_7d,
                                    backgroundColor: 'rgb(2,2,2)'
                                },{
                                    'label': 'Filecoin ranking',
                                    data: cmc_fil_rank_7d,
                                    backgroundColor: 'rgb(239,239,12)'
                                },{
                                    'label': 'Sia coin',
                                    data: cmc_sia_rank_7d,
                                    backgroundColor: 'rgb(66,241,5)'
                                },{
                                    'label': 'STORJ coin',
                                    data: cmc_storj_rank_7d,
                                    backgroundColor: 'rgb(236,13,13)'
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content4_7d = "";
                    content4_7d += "<canvas id='chartjs-7_7d' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content4_7d += "" +
                        "<script>new Chart(document.getElementById('chartjs-7_7d')," + JSON.stringify(chartobj) + ");</script>";
    
                    // Generate line chart
                    let cmc_etho_rank_30d = [];
    
                    for (i=0;i<inforows.length;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_etho_rank_30d[i]=inforows[i].coin_1_rank;
                    }
    
                    let cmc_fil_rank_30d = [];
                    for (i=0;i<inforows.length;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_fil_rank_30d[i]=inforows[i].coin_2_rank;
                    }
    
                    let cmc_sia_rank_30d = [];
                    for (i=0;i<inforows.length;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_sia_rank_30d[i]=inforows[i].coin_3_rank;
                    }
    
                    let cmc_storj_rank_30d = [];
                    for (i=0;i<inforows.length;i++) {
                        if (inforows[i].etho_trending==null)
                            inforows[i].etho_trending=0;
                        cmc_storj_rank_30d[i]=inforows[i].coin_4_rank;
                    }
    
                    chartobj = {
                        type: 'line',
                        data: {
                            labels: labels_30d,
                            datasets:
                                [{
                                    'label': 'ETHO ranking',
                                    data: cmc_etho_rank_30d,
                                    backgroundColor: 'rgb(2,2,2)'
                                },{
                                    'label': 'Filecoin ranking',
                                    data: cmc_fil_rank_30d,
                                    backgroundColor: 'rgb(239,239,12)'
                                },{
                                    'label': 'Sia coin',
                                    data: cmc_sia_rank_30d,
                                    backgroundColor: 'rgb(66,241,5)'
                                },{
                                    'label': 'STORJ coin',
                                    data: cmc_storj_rank_30d,
                                    backgroundColor: 'rgb(236,13,13)'
                                }]
            
                        },
                        options: {
                            responsive: true,
                        }
                    };
                    // Create charts
                    let content4_30d = "";
                    content4_30d += "<canvas id='chartjs-7_30d' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                    content4_30d += "" +
                        "<script>new Chart(document.getElementById('chartjs-7_30d')," + JSON.stringify(chartobj) + ");</script>";
    
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
    
    
                    let dateParts = inforows[0].date;
                    data.date=dateParts+ " GMT ";
    
                    res.render('dash_cmctrending', {
                        version: version,
                        title: 'ETHO | ETHO trending',
                        data: data,
                        db: inforows[0],
                        chart1: content1,
                        chart2: content2,
                        chart3_24hrs: content3_24hrs,
                        chart3_7d: content3_7d,
                        chart3_30d: content3_30d,
                        chart4_24hrs: content4_24hrs,
                        chart4_7d: content4_7d,
                        chart4_30d: content4_30d
    
                    });
                }
                else {
                    res.render('index', {
                        version: version,
                        title: 'ETHO | ETHO trending'
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
router.get('/dash', function(req, res, next) {
    let data = [];
    
    
    (async () => {
        
        const ethofsSDK = require('@ethofs/sdk');
        const ethofs = ethofsSDK();
        
        let stats=[];
        await ethofs.networkStats().then((result) => {
            //handle results here
            stats.gatewaynode_reward=Math.round(100*result.gatewaynode_reward)/100;
            stats.masternode_reward=Math.round(100*result.masternode_reward)/100;
            stats.servicenode_reward=Math.round(100*result.servicenode_reward)/100;
        }).catch((err) => {
            //handle error here
            stats.gatewaynode_reward="Not available";
            stats.masternode_reward="Not available";
            stats.servicenode_reward="Not available"
            logger.error('#server.routes.index.dash_nodes: Error %s', err);
    
        });
        
        console.log(stats);
        
        
        let vsql="SELECT * FROM info ORDER BY id DESC LIMIT " + lastElement_30d;
        
        pool.query(vsql)
            .then(async (inforows) => {
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
                                    ['rgb(91,105,214)',
                                        'rgb(74,162,97)',
                                        'rgb(87,190,194)'],
                                data: nodesList
                            }]
                        
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content4 = "";
                content4 += "<canvas id='chartjs-1' class='chartjs' width='1540' height='770' style='display: block; height: 385px; width: 770px;'></canvas>";
                content4 += "<script>new Chart(document.getElementById('chartjs-1')," + JSON.stringify(chartobj) + ");</script>";
    
                let content1_24hrs="";
                let content1_7d="";
                let content1_30d="";
                let gatewayList = [];
                let gatewayList_7d = [];
                let gatewayList_30d = [];
                let masterList = [];
                let masterList_7d = [];
                let masterList_30d = [];
                let serviceList = [];
                let serviceList_7d = [];
                let serviceList_30d = [];
                let lockedList = [];
                let lockedList_7d = [];
                let lockedList_30d = [];
    
    
                let labels_7d=[];
                let labels_30d=[];
    
                let i;
                for (i = 0; i < inforows.length; i++) {
                    if (inforows[i].etho_active_gatewaynodes == null)
                        inforows[i].etho_active_gatewaynodes = 0;
                    if (inforows[i].etho_active_masternodes == null)
                        inforows[i].etho_active_masternodes = 0;
                    if (inforows[i].etho_active_servicenodes == null)
                        inforows[i].etho_active_servicenodes = 0;
    
                }
                for (i = 0; i < lastElement_24hrs; i++) {
                    gatewayList[i] = inforows[i].etho_active_gatewaynodes-inforows[23].etho_active_gatewaynodes;
                    masterList[i] = inforows[i].etho_active_masternode-inforows[23].etho_active_masternode;
                    serviceList[i] = inforows[i].etho_active_servicenodes-inforows[23].etho_active_servicenodes;
                    lockedList[i] = parseInt(inforows[i].etho_active_gatewaynodes*30000)+ parseInt(inforows[i].etho_active_masternode*15000)+ parseInt(inforows[i].etho_active_servicenodes*5000);
                    
                }
    
                for (i = 0; i < lastElement_7d; i++) {
                    gatewayList_7d[i] = inforows[i].etho_active_gatewaynodes-inforows[167].etho_active_gatewaynodes;
                    masterList_7d[i] = inforows[i].etho_active_masternode-inforows[167].etho_active_masternode;
                    serviceList_7d[i] = inforows[i].etho_active_servicenodes-inforows[167].etho_active_servicenodes;
                    lockedList_7d[i] = parseInt(inforows[i].etho_active_gatewaynodes*30000)+ parseInt(inforows[i].etho_active_masternode*15000)+ parseInt(inforows[i].etho_active_servicenodes*5000);
    
    
                    labels_7d.push(-i + " hr");
                }
    
                for (i = 0; i < inforows.length; i++) {
                    gatewayList_30d[i] = inforows[i].etho_active_gatewaynodes-inforows[inforows.length-1].etho_active_gatewaynodes;
                    masterList_30d[i] = inforows[i].etho_active_masternode-inforows[inforows.length-1].etho_active_masternode;
                    serviceList_30d[i] = inforows[i].etho_active_servicenodes-inforows[inforows.length-1].etho_active_servicenodes;
                    lockedList_30d[i] = parseInt(inforows[i].etho_active_gatewaynodes*30000)+ parseInt(inforows[i].etho_active_masternode*15000)+ parseInt(inforows[i].etho_active_servicenodes*5000);
    
                    labels_30d.push(-i + "hr");
                }
    
    
                let chartobj1_1_24hrs = {
                    type: 'bar',
        
                    data: {
                        labels:
                            ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                        datasets:
                            [{
                                'label': 'Added nodes in last 24 hrs from ' + inforows[lastElement_24hrs-1].etho_active_gatewaynodes,
                                data: gatewayList,
                                backgroundColor: 'rgb(91,105,214)',
                                fill: true
                            }]
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                let content1_1_24hrs = "<canvas id='chartjs1_1_24hrs' class='chartjs'></canvas>";
                content1_1_24hrs += "<script>new Chart(document.getElementById('chartjs1_1_24hrs')," + JSON.stringify(chartobj1_1_24hrs) + ");</script>";
    
                let chartobj1_1_7d = {
                    type: 'bar',
                    data: {
                        labels: labels_7d,
                        datasets:
                            [{
                                'label': 'Added nodes in last 7d hrs from ' + inforows[lastElement_7d-1].etho_active_gatewaynodes,
                                data: gatewayList_7d,
                                backgroundColor: 'rgb(91,105,214)'
                            }
                            ]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_1_7d = "<canvas id='chartjs1_1_7d' class='chartjs'></canvas>";
                content1_1_7d += "<script>new Chart(document.getElementById('chartjs1_1_7d')," + JSON.stringify(chartobj1_1_7d) + ");</script>";
    
                let chartobj1_1_30d = {
                    type: 'bar',
                    data: {
                        labels: labels_30d,
                        datasets:
                            [{
                                'label': 'Added nodes in last 30d from ' + inforows[lastElement_30d-1].etho_active_gatewaynodes,
                                data: gatewayList_30d,
                                backgroundColor: 'rgb(91,105,214)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_1_30d = "<canvas id='chartjs1_1_30d' class='chartjs'></canvas>";
                content1_1_30d += "<script>new Chart(document.getElementById('chartjs1_1_30d')," + JSON.stringify(chartobj1_1_30d) + ");</script>";
    
                let chartobj1_2_24hrs = {
                    type: 'bar',
        
                    data: {
                        labels:
                            ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                        datasets:
                            [{
                                'label': 'Added nodes in last 24 hrs from ' + inforows[lastElement_24hrs-1].etho_active_masternode,
                                data: masterList,
                                backgroundColor: 'rgb(74,162,97)',
                                fill: true
                            }]
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                let content1_2_24hrs = "<canvas id='chartjs1_2_24hrs' class='chartjs'></canvas>";
                content1_2_24hrs += "<script>new Chart(document.getElementById('chartjs1_2_24hrs')," + JSON.stringify(chartobj1_2_24hrs) + ");</script>";
    
                let chartobj1_2_7d = {
                    type: 'bar',
                    data: {
                        labels: labels_7d,
                        datasets:
                            [{
                                'label': 'Added nodes in last 7d hrs from ' + inforows[lastElement_7d-1].etho_active_masternode,
                                data: masterList_7d,
                                backgroundColor: 'rgb(74,162,97)'
                            }
                            ]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_2_7d = "<canvas id='chartjs1_2_7d' class='chartjs'></canvas>";
                content1_2_7d += "<script>new Chart(document.getElementById('chartjs1_2_7d')," + JSON.stringify(chartobj1_2_7d) + ");</script>";
    
                let chartobj1_2_30d = {
                    type: 'bar',
                    data: {
                        labels: labels_30d,
                        datasets:
                            [{
                                'label': 'Added nodes in last 30d from ' + inforows[lastElement_30d-1].etho_active_masternode,
                                data: masterList_30d,
                                backgroundColor: 'rgb(74,162,97)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_2_30d = "<canvas id='chartjs1_2_30d' class='chartjs'></canvas>";
                content1_2_30d += "<script>new Chart(document.getElementById('chartjs1_2_30d')," + JSON.stringify(chartobj1_2_30d) + ");</script>";
    
                let chartobj1_3_24hrs = {
                    type: 'bar',
        
                    data: {
                        labels:
                            ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                        datasets:
                            [{
                                'label': 'Added nodes in last 24 hrs from ' + inforows[lastElement_24hrs-1].etho_active_servicenodes,
                                data: serviceList,
                                backgroundColor: 'rgb(87,190,194)',
                                fill: true
                            }]
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                let content1_3_24hrs = "<canvas id='chartjs1_3_24hrs' class='chartjs'></canvas>";
                content1_3_24hrs += "<script>new Chart(document.getElementById('chartjs1_3_24hrs')," + JSON.stringify(chartobj1_3_24hrs) + ");</script>";
    
                let chartobj1_3_7d = {
                    type: 'bar',
                    data: {
                        labels: labels_7d,
                        datasets:
                            [{
                                'label': 'Added nodes in last 7d hrs from ' + inforows[lastElement_7d-1].etho_active_servicenodes,
                                data: serviceList_7d,
                                backgroundColor: 'rgb(87,190,194)'
                            }
                            ]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_3_7d = "<canvas id='chartjs1_3_7d' class='chartjs'></canvas>";
                content1_3_7d += "<script>new Chart(document.getElementById('chartjs1_3_7d')," + JSON.stringify(chartobj1_3_7d) + ");</script>";
    
                let chartobj1_3_30d = {
                    type: 'bar',
                    data: {
                        labels: labels_30d,
                        datasets:
                            [{
                                'label': 'Added nodes in last 30d from ' + inforows[lastElement_30d-1].etho_active_servicenodes,
                                data: serviceList_30d,
                                backgroundColor: 'rgb(87,190,194)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_3_30d = "<canvas id='chartjs1_3_30d' class='chartjs'></canvas>";
                content1_3_30d += "<script>new Chart(document.getElementById('chartjs1_3_30d')," + JSON.stringify(chartobj1_3_30d) + ");</script>";
    
                let chartobj1_4_24hrs = {
                    type: 'bar',
        
                    data: {
                        labels:
                            ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                        datasets:
                            [{
                                'label': 'ETHO locked by nodes in last 24 hrs ',
                                data: lockedList,
                                backgroundColor: 'rgb(7,16,196)',
                                fill: true
                            }]
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                let content1_4_24hrs = "<canvas id='chartjs1_4_24hrs' class='chartjs'></canvas>";
                content1_4_24hrs += "<script>new Chart(document.getElementById('chartjs1_4_24hrs')," + JSON.stringify(chartobj1_4_24hrs) + ");</script>";
    
                let chartobj1_4_7d = {
                    type: 'bar',
                    data: {
                        labels: labels_7d,
                        datasets:
                            [{
                                'label': 'ETHO locked by nodes in last 7 days',
                                data: lockedList_7d,
                                backgroundColor: 'rgb(87,190,194)'
                            }
                            ]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_4_7d = "<canvas id='chartjs1_4_7d' class='chartjs'></canvas>";
                content1_4_7d += "<script>new Chart(document.getElementById('chartjs1_4_7d')," + JSON.stringify(chartobj1_4_7d) + ");</script>";
    
                let chartobj1_4_30d = {
                    type: 'bar',
                    data: {
                        labels: labels_30d,
                        datasets:
                            [{
                                'label': 'ETHO locked by nodes in last 30 days ',
                                data: lockedList_30d,
                                backgroundColor: 'rgb(87,190,194)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                let content1_4_30d = "<canvas id='chartjs1_4_30d' class='chartjs'></canvas>";
                content1_4_30d += "<script>new Chart(document.getElementById('chartjs1_4_30d')," + JSON.stringify(chartobj1_4_30d) + ");</script>";
    
    
    
                let content2_24hrs="";
                let content2_7d="";
                let content2_30d="";
                let contractList = [];
                let contractList_7d = [];
                let contractList_30d = [];
    
    
                for (i = 0; i < inforows.length; i++) {
                    if (inforows[i].etho_activeUploadContracts == null)
                        inforows[i].etho_activeUploadContracts = 0;
                }
                for (i = 0; i < lastElement_24hrs; i++) {
                    contractList[i] = inforows[i].etho_activeUploadContracts-inforows[23].etho_activeUploadContracts;
                }
    
                for (i = 0; i < lastElement_7d; i++) {
                    contractList_7d[i] = inforows[i].etho_activeUploadContracts-inforows[167].etho_activeUploadContracts;
                }
    
                for (i = 0; i < inforows.length; i++) {
                    contractList_30d[i] = inforows[i].etho_activeUploadContracts-inforows[inforows.length-1].etho_activeUploadContracts;
                }
    
    
                let chartobj2_24hrs = {
                    type: 'line',
        
                    data: {
                        labels:
                            ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                        datasets:
                            [{
                                'label': 'Number of added contracts in last 24 hrs from ' + inforows[lastElement_24hrs-1].etho_activeUploadContracts,
                                data: contractList,
                                backgroundColor: 'rgb(156,252,3)',
                                fill: true
                            }]
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                content2_24hrs += "<canvas id='chartjs2_24hrs' class='chartjs'></canvas>";
                content2_24hrs += "<script>new Chart(document.getElementById('chartjs2_24hrs')," + JSON.stringify(chartobj2_24hrs) + ");</script>";
    
                let chartobj2_7d = {
                    type: 'line',
                    data: {
                        labels: labels_7d,
                        datasets:
                            [{
                                'label': 'Number of added contracts in last 7d hrs from ' + inforows[lastElement_7d-1].etho_activeUploadContracts,
                                data: contractList_7d,
                                backgroundColor: 'rgb(156,252,3)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                content2_7d += "<canvas id='chartjs2-7d' class='chartjs'></canvas>";
                content2_7d += "<script>new Chart(document.getElementById('chartjs2-7d')," + JSON.stringify(chartobj2_7d) + ");</script>";
    
                let chartobj2_30d = {
                    type: 'line',
                    data: {
                        labels: labels_30d,
                        datasets:
                            [{
                                'label': 'Number of added contracts in last 30d from ' + inforows[lastElement_30d-1].etho_activeUploadContracts,
                                data: contractList_30d,
                                backgroundColor: 'rgb(156,252,3)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                content2_30d += "<canvas id='chartjs2-30d' class='chartjs'></canvas>";
                content2_30d += "<script>new Chart(document.getElementById('chartjs2-30d')," + JSON.stringify(chartobj2_30d) + ");</script>";
    
    
                let content3_24hrs="";
                let content3_7d="";
                let content3_30d="";
    
    
                for (i = 0; i < inforows.length; i++) {
                    if (inforows[i].etho_activeUploadContracts == null)
                        inforows[i].etho_activeUploadContracts = 0;
                }
                for (i = 0; i < lastElement_24hrs; i++) {
                    contractList[i] = inforows[i].etho_activeUploadContracts-inforows[23].etho_activeUploadContracts;
                }
    
                for (i = 0; i < lastElement_7d; i++) {
                    contractList_7d[i] = inforows[i].etho_activeUploadContracts-inforows[167].etho_activeUploadContracts;
                }
    
                for (i = 0; i < inforows.length; i++) {
                    contractList_30d[i] = inforows[i].etho_activeUploadContracts-inforows[inforows.length-1].etho_activeUploadContracts;
                }
    
    
                let chartobj3_24hrs = {
                    type: 'bar',
        
                    data: {
                        labels:
                            ['Now','-1hr','-2hr','-3hr','-4hr','-5hr','-6hr','-7hr','-8hr','-9hr','-10hr','-11hr','-12hr','-13hr','-14hr','-15hr','-16hr','-17hr','-18hr','-19hr','-20hr','-21hr','-22hr','-23hr'],
                        datasets:
                            [{
                                'label': 'Number of added contracts in last 24 hrs from ' + inforows[lastElement_24hrs-1].etho_activeUploadContracts,
                                data: contractList,
                                backgroundColor: 'rgb(156,252,3)',
                                fill: true
                            }]
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                content3_24hrs += "<canvas id='chartjs-3_24hrs' class='chartjs'></canvas>";
                content3_24hrs += "<script>new Chart(document.getElementById('chartjs-3_24hrs')," + JSON.stringify(chartobj3_24hrs) + ");</script>";
    
                let chartobj3_7d = {
                    type: 'bar',
                    data: {
                        labels: labels_7d,
                        datasets:
                            [{
                                'label': 'Number of added contracts in last 7d hrs from ' + inforows[lastElement_7d-1].etho_activeUploadContracts,
                                data: contractList_7d,
                                backgroundColor: 'rgb(156,252,3)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                content3_7d += "<canvas id='chartjs3-7d' class='chartjs'></canvas>";
                content3_7d += "<script>new Chart(document.getElementById('chartjs3-7d')," + JSON.stringify(chartobj3_7d) + ");</script>";
    
                let chartobj3_30d = {
                    type: 'bar',
                    data: {
                        labels: labels_30d,
                        datasets:
                            [{
                                'label': 'Number of added contracts in last 30d from ' + inforows[lastElement_30d-1].etho_activeUploadContracts,
                                data: contractList_30d,
                                backgroundColor: 'rgb(156,252,3)'
                            }]
            
                    },
                    options: {
                        responsive: true,
                    }
                };
                // Create charts
                content3_30d += "<canvas id='chartjs3-30d' class='chartjs'></canvas>";
                content3_30d += "<script>new Chart(document.getElementById('chartjs3-30d')," + JSON.stringify(chartobj3_30d) + ");</script>";
    
                let gateway_30d=[];
                let master_30d=[];
                let service_30d=[];
                for (i = 0; i < lastElement_30d; i++) {
                    gateway_30d[i] = inforows[i].etho_gatewaynode_reward/10;
                    master_30d[i] = inforows[i].etho_masternode_reward/10;
                    service_30d[i] = inforows[i].etho_servicenode_reward/10;
                }
    
    
                let chartobj5 = {
                    type: 'line',
                    data: {
                        labels:
                            labels_30d,
        
                    datasets:
                            [{
                                'label': 'Service node reward',
                                data: service_30d,
                                backgroundColor: 'rgb(87,190,194)',
                                fill: true
                            }, {
                                'label': 'Master node reward',
                                data: master_30d,
                                backgroundColor: 'rgb(74,162,97)',
                                fill: true
                            }, {
                                'label': 'Gateway node reward',
                                data: gateway_30d,
                                backgroundColor: 'rgb(91,105,214)',
                                fill: true
                            }
                            
                            ]
            
                    },
                    options: {
                        responsive: true
                    }
                };
                // Create charts
                let content5;
                content5 = "<canvas id='chartjs-5' class='chartjs'></canvas>";
                content5 += "<script>new Chart(document.getElementById('chartjs-5')," + JSON.stringify(chartobj5) + ");</script>";
    
                let dateParts = inforows[0].date;
                data.date=dateParts+ " GMT ";
    
    
                res.render('dash_nodes', {
                    version: version,
                    title: 'ETHO | Node dashboard',
                    ethofsstats: stats,
                    data: data,
                    db: inforows[0],
                    chart1_1_24hrs: content1_1_24hrs,
                    chart1_1_7d: content1_1_7d,
                    chart1_1_30d: content1_1_30d,
                    chart1_2_24hrs: content1_2_24hrs,
                    chart1_2_7d: content1_2_7d,
                    chart1_2_30d: content1_2_30d,
                    chart1_3_24hrs: content1_3_24hrs,
                    chart1_3_7d: content1_3_7d,
                    chart1_3_30d: content1_3_30d,
                    chart1_4_24hrs: content1_4_24hrs,
                    chart1_4_7d: content1_4_7d,
                    chart1_4_30d: content1_4_30d,
                    chart2_24hrs: content2_24hrs,
                    chart2_7d: content2_7d,
                    chart2_30d: content2_30d,
                    chart3_24hrs: content3_24hrs,
                    chart3_7d: content3_7d,
                    chart3_30d: content3_30d,
                    chart4: content4,
                    chart5: content5,
                });
            })
            .catch((error) => {
                logger.error('#server.users.get.account: Error %s', error);
                throw error;
            })
    })();
    
});

// Support functions
function getExchanges(data) {
    return(data.etho_exchange_kucoin+data.etho_exchange_stex+data.etho_exchange_graviex+data.etho_exchange_probit+data.etho_exchange_mercatox);
}


module.exports = router;
