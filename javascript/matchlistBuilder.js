var matchlistBuilder = (function() {

    //global privates
    var  matchListContainer = document.getElementById("matchList");
    var riotHandler = riotApiHandler();
    var summonerID;
    var region;


    function buildMatchlist(summID, searchedRegion) {
        summonerID = summID;
        region = searchedRegion;
        var matchlistEndpoint = buildMatchlistEndpoint(summonerID, region);
        riotHandler.queryRiotApi(matchlistEndpoint, function(data) {
            console.log(data);
            var gamesArray = data["games"];

            for(i=0; i < gamesArray.length; i++) {
                createMatch(gamesArray[i]);
            }

        });
    }

    function createMatch(match) {
        var championID = match["championId"];
        var matchID = match["gameId"];

        //new div to insert
        var matchDiv = document.createElement("div");
        matchDiv.classList.add("match");


        addChampionImage(matchDiv, championID);

        //Create div for info text
        var matchTextDiv = document.createElement("div");
        matchTextDiv.classList.add("matchInfo");

        //Retrieves and adds both result and kda information to match text div
        addGameResultText(matchTextDiv, match);
        addKdaText(matchTextDiv, match);

        matchDiv.appendChild(matchTextDiv);

        matchDiv.addEventListener("click", function() {
            var animate = animation();
            animate.showMatchDetail();

            var detailBuilder = matchDetailBuilder();
            detailBuilder.buildMatchDetail(matchID, summonerID, region);
        });

        matchListContainer.appendChild(matchDiv);
    }

    function addGameResultText(matchTextDiv, match) {

        //Create and populate result paragraph
        var gameResultPara = document.createElement("p");
        gameResultPara.classList.add("matchText");
        var resultTextNode;

        //result is a boolean, true if win, false if lose.
        var result = match["stats"]["win"];

        //Check to see if the game was won add the need text and class
        if(result) {
            resultTextNode = document.createTextNode("Victory");
            gameResultPara.classList.add("victory");
        }
        else {
            resultTextNode = document.createTextNode("Defeat");
            gameResultPara.classList.add("defeat");
        }

        gameResultPara.appendChild(resultTextNode);
        matchTextDiv.appendChild(gameResultPara);
    }

    function addKdaText(matchTextDiv, match) {

        //If these values are 0 they don't appear in the JSON file and are therefore undefined so the check is needed.
        var kills = match["stats"]["championsKilled"] === undefined ? "0" : match["stats"]["championsKilled"];
        var deaths = match["stats"]["numDeaths"] === undefined ? "0" : match["stats"]["numDeaths"];
        var assists = match["stats"]["assists"] === undefined ? "0" : match["stats"]["assists"];

        var kdaString = "KDA: " + kills + "/" + deaths + "/" + assists;

        var gameKdaPara = document.createElement("p");
        gameKdaPara.classList.add("matchText");
        var kdaTextNode = document.createTextNode(kdaString);
        gameKdaPara.appendChild(kdaTextNode);

        matchTextDiv.appendChild(gameKdaPara);
    }

    function addChampionImage(matchDiv, championID) {
        var matchChampion = document.createElement("div");
        matchChampion.classList.add("matchChampion");

        var img = document.createElement("img");
        img.classList.add("championImage");
        img.src = "media/champions/" + championID + ".png";
        img.alt = "Champion Played: ID - "  + championID;
        matchChampion.appendChild(img);

        matchDiv.appendChild(matchChampion);
    }

    function buildMatchlistEndpoint(summonerID, region) {
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/game/by-summoner/' + summonerID + "/recent";
    }



    return {
        buildMatchlist: buildMatchlist

    }
});