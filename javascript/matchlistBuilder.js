var matchlistBuilder = (function() {

    //global privates
    var summonerContainer = document.getElementById("summonerContainer");
    var riotHandler = riotApiHandler();
    var summonerID;
    var region;


    function buildMatchlist(summID, searchedRegion) {
        summonerID = summID;
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
        var championID = match["champion"];
        var matchID = match["matchId"];

        //new div to insert
        var matchDiv = createMatchDiv(matchID, championID);
        summonerContainer.appendChild(matchDiv);
    }

    function createMatchDiv(matchID, championID) {
        var matchDiv = document.createElement("div");
        matchDiv.classList.add("match");


        addChampionImage(matchDiv, championID);
        addMatchText(matchDiv, matchID);
        matchDiv.addEventListener("click", function() {
            alert("Match ID = " + matchID);

        });


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

        });

        matchDiv.appendChild(matchChampion);
    }

    function addMatchText(matchDiv, matchID) {
        var matchTextDiv = document.createElement("div");
        matchTextDiv.classList.add("matchInfo");

        var gameResultPara = document.createElement("p");
        gameResultPara.classList.add("matchText", "gameResult");


        var kdaPara = document.createElement("p");
        kdaPara.classList.add("matchText", "gameKda");


        var matchEndpoint = buildMatchEndpoint(matchID, region);
        console.log(matchEndpoint);

        riotHandler.queryRiotApi(matchEndpoint, function(data) {
            console.log(data);
            var result = data["participants"][0]["stats"]["winner"] === true ? "Victory" : "Defeat";

            //Get the game result
            var resultTextNode = document.createTextNode(result);
            gameResultPara.appendChild(resultTextNode);
            matchTextDiv.appendChild(gameResultPara);

            //Get KDA
            var kdaTextNode = document.createTextNode("kda");
            kdaPara.appendChild(kdaTextNode);
            matchTextDiv.appendChild(kdaPara);
        });

        matchDiv.appendChild(matchTextDiv);

    }

    function buildMatchlistEndpoint(summonerID, region) {
        var indexInfo = encodeURIComponent("?beginIndex=0&endIndex=4");
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/matchlist/by-summoner/' + summonerID + indexInfo;
    }

    function buildChampionImageEndpoint(championID, region) {
        var champData = encodeURIComponent("?champData=image");
        return 'https://global.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion/' + championID + champData;
    }

    function buildMatchEndpoint(matchID, region) {
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/' + matchID;

    }

    return {
        buildMatchlist: buildMatchlist

    }
});