var matchlistBuilder = (function() {

    //global privates
    var summonerContainer = document.getElementById("summonerContainer");
    var riotHandler = riotApiHandler();
    var region;

    function buildMatchlist(summonerID, searchedRegion) {
        region = searchedRegion;
        var matchlistEndpoint = buildMatchlistEndpoint(summonerID, region);
        console.log(matchlistEndpoint);
        riotHandler.queryRiotApi(matchlistEndpoint, matchlistCallback);
    }



    function matchlistCallback(data) {
        console.log(data);
        for(i = 0; i < 10; i++) {
            displayMatch(data["matches"][i]);
        }
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
            var championName = data["name"];
            var championImg = data["image"]["full"];
            img.src = "https://ddragon.leagueoflegends.com/cdn/7.1.1/img/champion/" + championImg;
            img.alt = "Champion played - " + championName;

        } );
    }

    function buildMatchlistEndpoint(summonerID, region) {
        var indexInfo = encodeURIComponent("?beginIndex=0&endIndex=10");
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/matchlist/by-summoner/' + summonerID + indexInfo;
    }

    function buildChampionImageEndpoint(championID, region) {
        var champData = encodeURIComponent("?champData=image");
        return 'https://global.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion/' + championID + champData;
    }

    return {
        buildMatchlist: buildMatchlist

    }
});