var matchlistBuilder = (function() {

    //global privates
    var summonerContainer = document.getElementById("summonerContainer");
    var riotHandler = riotApiHandler();
    var region;

    function buildMatchlist(summonerID, searchedRegion) {
        region = searchedRegion;
        var matchlistEndpoint = buildMatchlistEndpoint(summonerID, region);
        riotHandler.queryRiotApi(matchlistEndpoint, matchlistCallback);
    }



    function matchlistCallback(data) {
        console.log(data);
        for(i = 0; i < data["matches"].length; i++) {
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


        addChampionImage(matchDiv, championID);
        addMatchText(matchDiv);


        return matchDiv;
    }


    function addChampionImage(matchDiv, championID) {
        var matchChampion = document.createElement("div");
        matchChampion.classList.add("matchChampion");

        var img = document.createElement("img");
        img.classList.add("championImage");
        matchChampion.appendChild(img);

        var championImageEndpoint = buildChampionImageEndpoint(championID, region);
        console.log(championImageEndpoint);


        riotHandler.queryRiotApi(championImageEndpoint, function(data) {
            console.log(data);
            var championName = data["name"];
            var championImg = data["image"]["full"];
            img.src = "https://ddragon.leagueoflegends.com/cdn/7.1.1/img/champion/" + championImg;
            img.alt = "Champion played - " + championName;

        } );

        matchDiv.appendChild(matchChampion);
    }

    function addMatchText(matchDiv) {
        var matchTextDiv = document.createElement("div");
        matchTextDiv.classList.add("matchInfo");

        var gameResultPara = document.createElement("p");
        gameResultPara.classList.add("matchText", "gameResult");
        var resultTextNode = document.createTextNode("Victory");
        gameResultPara.appendChild(resultTextNode);
        matchTextDiv.appendChild(gameResultPara);

        var kdaPara = document.createElement("p");
        kdaPara.classList.add("matchText", "gameKda");
        var kdaTextNode = document.createTextNode("KDA: 17/0/12");
        kdaPara.appendChild(kdaTextNode);
        matchTextDiv.appendChild(kdaPara);


        matchDiv.appendChild(matchTextDiv);



    }

    function buildMatchlistEndpoint(summonerID, region) {
        var indexInfo = encodeURIComponent("?beginIndex=0&endIndex=12");
        console.log('https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/matchlist/by-summoner/' + summonerID + indexInfo    );
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