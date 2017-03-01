let matchlistBuilder = (function() {

    //global privates
    let  matchListContainer = document.getElementById("matchList");
    let riotHandler = riotApiHandler();
    let summonerID;
    let region;


    function buildMatchlist(summID, searchedRegion) {
        summonerID = summID;
        region = searchedRegion;
        let matchlistEndpoint = buildMatchlistEndpoint(summonerID, region);
        riotHandler.queryRiotApi(matchlistEndpoint, function(data) {
            console.log(data);
            let gamesArray = data["games"];

            for(i=0; i < gamesArray.length; i++) {
                createMatch(gamesArray[i]);
            }

        });
    }

    function createMatch(match) {
        let championID = match["championId"];
        let matchID = match["gameId"];

        //new div to insert
        let matchDiv = document.createElement("div");
        matchDiv.classList.add("match");


        addChampionImage(matchDiv, championID);

        //Create div for info text
        let matchTextDiv = document.createElement("div");
        matchTextDiv.classList.add("matchInfo");

        //Retrieves and adds both result and kda information to match text div
        addGameResultText(matchTextDiv, match);
        addKdaText(matchTextDiv, match);
        addTimestamp(matchTextDiv, match);

        matchDiv.appendChild(matchTextDiv);

        matchDiv.addEventListener("click", function() {
            let animate = animation();
            animate.showMatchDetail();

            let detailBuilder = matchDetailBuilder();
            detailBuilder.buildMatchDetail(matchID, summonerID, region);
        });

        matchListContainer.appendChild(matchDiv);
    }

    function addChampionImage(matchDiv, championID) {
        let matchChampion = document.createElement("div");
        matchChampion.classList.add("matchChampion");

        let img = document.createElement("img");
        img.classList.add("championImage");
        img.src = "media/champions/" + championID + ".png";
        img.alt = "Champion Played: ID - "  + championID;
        matchChampion.appendChild(img);

        matchDiv.appendChild(matchChampion);
    }

    function addGameResultText(matchTextDiv, match) {

        //Create and populate result paragraph
        let gameResultPara = document.createElement("p");
        gameResultPara.classList.add("matchText");
        let resultTextNode;

        //result is a boolean, true if win, false if lose.
        let result = match["stats"]["win"];

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
        let kills = match.stats.championsKilled  || "0";
        let deaths = match.stats.numDeaths       || "0";
        let assists = match.stats.assists        || "0";

        let kdaString = "KDA: " + kills + "/" + deaths + "/" + assists;

        let gameKdaPara = document.createElement("p");
        gameKdaPara.classList.add("matchText");
        let kdaTextNode = document.createTextNode(kdaString);
        gameKdaPara.appendChild(kdaTextNode);

        matchTextDiv.appendChild(gameKdaPara);
    }

    //Timestamps in the Riot API are stored in epoch milliseconds so some conversion is needed to find out when
    //the game was played and display the it in the appropriate time. e.g Hours ago
    function addTimestamp(matchTextDiv, match) {
        let timePlayedString = "";
        let timestamp = new Date(match.createDate);
        let currentTime = new Date().getTime();
        let timeBetween = new Date(currentTime - timestamp);
        let amountOfDaysSince = Math.round(timeBetween.getTime() / 86400000);
        let amountOfHoursSince = Math.round(timeBetween.getTime() / 3600000);

        //Checking to see how to display when the game was played based on how long ago it was.
        if(amountOfHoursSince < 1)
            timePlayedString = Math.round(timeBetween.getMinutes()) + " minutes ago";
        else if(amountOfDaysSince < 1)
            timePlayedString = amountOfHoursSince + " hours ago";
        else if(amountOfDaysSince < 28)
            timePlayedString = amountOfDaysSince + " days ago";
        else
            timePlayedString ="A long time ago";


        //Add time played text string to paragraph and add the paragraph to the text div container.
        let timestampPara = document.createElement("p");
        timestampPara.classList.add("matchText");
        timestampPara.appendChild(document.createTextNode(timePlayedString));
        matchTextDiv.appendChild(timestampPara);

    }



    function buildMatchlistEndpoint(summonerID, region) {
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/game/by-summoner/' + summonerID + "/recent";
    }



    return {
        buildMatchlist: buildMatchlist

    }
});