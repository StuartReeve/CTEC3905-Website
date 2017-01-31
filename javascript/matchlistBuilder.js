var matchlistBuilder = (function(summonerID, region) {

    //global privates
    var summonerContainer = document.getElementById("summonerContainer");
    var riotHandler = riotApiHandler();
    var summonerMatchlist;
    var currentMatchIndex;

    function buildMatchlist() {
        var matchlistEndpoint = buildMatchlistEndpoint(summonerID, region);
        console.log(matchlistEndpoint);
        riotHandler.queryRiotApi(matchlistEndpoint, matchlistCallback);
    }



    function matchlistCallback(data) {
        console.log(data);
        summonerMatchlist = data;
        for(i = 0; i < 10; i++) {
            displayMatch(data["matches"][i]);
        }
        //storing current match index for later paginaton stuff maybe?
        currentMatchIndex = 10;
    }

    function displayMatch(match) {
        var matchID = match["matchID"];
        var championID = match["champion"];

        //new div to insert
        var matchDiv = createMatchDiv(championID);
        summonerContainer.appendChild(matchDiv);
    }

    function createMatchDiv(championID) {
        var matchDiv = document.createElement("div");
        matchDiv.classList.add("match");

        var img = document.createElement("img");
        img.classList.add("matchChampion");
        getChampionImage(img, championID);
        matchDiv.appendChild(img);

        return matchDiv;
    }


    function getChampionImage(img, championID) {
        var championImageEndpoint = buildChampionImageEndpoint(championID, region);
        console.log(championImageEndpoint);

        riotHandler.queryRiotApi(championImageEndpoint, function(data) {
            console.log(data);
            var championName = date["name"];
            var championImg = data["image"]["full"];
            var imgUrl = "https://ddragon.leagueoflegends.com/cdn/7.1.1/img/champion/" + championImg;
            img.src = imgUrl;
            img.alt = "Champion played - " + championName;

        } );
    }

    function buildMatchlistEndpoint(summonerID, region) {
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/matchlist/by-summoner/' + summonerID ;
    }

    function buildChampionImageEndpoint(championID, region) {
        var champData = encodeURIComponent("?champData=image");
        return 'https://global.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion/' + championID + champData;
    }

    return {
        buildMatchlist: buildMatchlist

    }
});