let matchlistBuilder = (function() {
    "use strict";

    //global privates
    let  summonerProfileContainer = document.getElementById("summonerProfile");
    let riotHandler = riotApiHandler();
    let summonerID;
    let summonerName;
    let region;

    function buildProfile(summID, summName, searchedRegion) {
        summonerID = summID;
        summonerName = summName;
        region = searchedRegion;

        buildProfileHeader();
        buildMatchlist();
    }

    function buildProfileHeader() {

        //Add Summoner header info

        let profileHeaderContainer = document.createElement("div");
        profileHeaderContainer.id = "profileHeader";

        let profileStatsContainer = document.createElement("div");
        profileStatsContainer.id = "profileStats";

        let summonerNameHeader = document.createElement("h1");
        summonerNameHeader.classList.add("statHeader");
        summonerNameHeader.appendChild(document.createTextNode(summonerName));
        profileStatsContainer.appendChild(summonerNameHeader);

        //Add most played champion header info
        let mostPlayedContainer = document.createElement("div");
        mostPlayedContainer.id = "mostPlayedChamps";

        let mostPlayedHeader = document.createElement("h3");
        mostPlayedHeader.classList.add("statHeader");
        mostPlayedHeader.appendChild(document.createTextNode("Most Played Champions"));
        mostPlayedContainer.appendChild(mostPlayedHeader);

        //Make an api call to add overall account stats and top played champion stats.
        //Can get both stats from one call so bundling it in one query
        let rankedStatsEndpoint = buildRankedStatsEndpoint(summonerID, region);
        riotHandler.queryRiotApi(rankedStatsEndpoint, function (data) {
            //Sort the champions array by most games as I only want to get them in order of most played
            let champions = data.champions.sort((a, b) => b.stats.totalSessionsPlayed - a.stats.totalSessionsPlayed);

            //Add account stats
            addSummonerPlayerInfo(profileStatsContainer, champions);
            profileHeaderContainer.appendChild(profileStatsContainer);

            //Add most played stats
            addMostPlayedChamps(mostPlayedContainer, champions);
            profileHeaderContainer.appendChild(mostPlayedContainer);

        },
        //function for how to handle failed api calls. Display erro message.
        function(XMLHttpRequest, textStatus, errorThrown) {
            let errorText = document.createElement("h1");
            errorText.classList.add("errorMessage");
            errorText.appendChild(document.createTextNode("Stats are not available for this summoner."));
            profileHeaderContainer.appendChild(errorText);
            summonerProfileContainer.appendChild(profileHeaderContainer);
        });

        summonerProfileContainer.appendChild(profileHeaderContainer);
    }

    //the championData also has an index that contains all information added together, I am using this to get around making extra api calls.
    //The champion data was sorted before getting to this function so the first element contains all of the games together.
    function addSummonerPlayerInfo(profileStatsContainer, championData) {
        let winLossPara = document.createElement("p");
        winLossPara.classList.add("profileStat");
        let winratePara = document.createElement("p");
        winratePara.classList.add("profileStat");

        let played = championData[0].stats.totalSessionsPlayed;
        let wins = championData[0].stats.totalSessionsWon;
        let losses = championData[0].stats.totalSessionsLost;
        let winrate = Math.round((wins / played) * 100) + "%";

        winLossPara.appendChild(document.createTextNode(wins + " W " + losses + "L"));
        winratePara.appendChild(document.createTextNode(winrate));

        profileStatsContainer.appendChild(winLossPara);
        profileStatsContainer.appendChild(winratePara);

    }

    function addMostPlayedChamps(mostPlayedContainer, championData) {
            //Start loop from 1 as index 0 is all champion data together.
        for(let i = 1; i < 4; i++) {
            let championID = championData[i].id;

            let mostPlayedChampion = document.createElement("div");
            mostPlayedChampion.classList.add("mostPlayed");

            let img = document.createElement("img");
            img.classList.add("mostPlayedImage");
            img.src = `media/champions/${championID}.png`;
            img.alt = `Most Played Champion: ID - ${championID}`;

            let winrateText = document.createElement("p");
            winrateText.classList.add("champWinrate");
            let winrate = Math.round((championData[i].stats.totalSessionsWon / championData[i].stats.totalSessionsPlayed) * 100) + "%";
            winrateText.appendChild(document.createTextNode(winrate));

            mostPlayedChampion.appendChild(img);
            mostPlayedChampion.appendChild(winrateText);
            mostPlayedContainer.appendChild(mostPlayedChampion);
        }
    }

    function buildMatchlist() {
        let matchlistEndpoint = buildMatchlistEndpoint(summonerID, region);

        let matchListContainer = document.createElement("div");
        matchListContainer.id = "matchList";
        riotHandler.queryRiotApi(matchlistEndpoint, function(data) {
            let gamesArray = data["games"];

            for(let i=0; i < gamesArray.length - 1; i++) {
                matchListContainer.appendChild(createMatch(gamesArray[i]));
            }
            summonerProfileContainer.appendChild(matchListContainer);
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
            let errorText = document.createElement("h2");
            errorText.classList.add("errorMessage");
            errorText.appendChild(document.createTextNode("No matches are available for this summoner."));
            matchListContainer.appendChild(errorText);
            summonerProfileContainer.appendChild(matchListContainer);
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
        addGameMode(matchTextDiv, match);
        addTimestamp(matchTextDiv, match);
        addGameResultText(matchTextDiv, match);
        addKdaText(matchTextDiv, match);

        matchDiv.appendChild(matchTextDiv);

        matchDiv.addEventListener("click", function() {
            let animate = animation();
            animate.showMatchDetail();

            let detailBuilder = matchDetailBuilder();
            detailBuilder.buildMatchDetail(matchID, summonerID, region);
        });

        return matchDiv;
    }

    function addChampionImage(matchDiv, championID) {
        let matchChampion = document.createElement("div");
        matchChampion.classList.add("matchChampion");

        let img = document.createElement("img");
        img.classList.add("championImage");
        img.src = `media/champions/${championID}.png`;
        img.alt = `Champion Played: ID - ${championID}`;
        matchChampion.appendChild(img);

        matchDiv.appendChild(matchChampion);
    }

    function addGameMode(matchTextDiv, match) {
        //Key value pairs so that you can get a nicely formated string for each game mode
        let gameModes = {
            "RANKED_SOLO_5x5"   : "Solo Ranked",
            "RANKED_FLEX_SR"    : "Flex 5v5 Ranked",
            "NORMAL"            : "Normal",
            "ARAM_UNRANKED_5x5" : "ARAM",
            "URF"               : "URF"
        };

        let gameType = match.subType;
        let gameTypeString = gameModes[gameType];

        let gameTypePara = document.createElement("p");
        gameTypePara.classList.add("matchText");
        gameTypePara.appendChild(document.createTextNode(gameTypeString));
        matchTextDiv.appendChild(gameTypePara);
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

        let kdaString = `KDA:${kills}/${deaths}/${assists}`;

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
            timePlayedString = `${Math.round(timeBetween.getMinutes())} minutes ago`;
        else if(amountOfHoursSince < 24)
            timePlayedString = `${amountOfHoursSince} hours ago`;
        else if(amountOfDaysSince < 28)
            timePlayedString = amountOfDaysSince == 1 ? `a day ago` : `${amountOfDaysSince} days ago`;
        else
            timePlayedString =`A long time ago`;


        //Add time played text string to paragraph and add the paragraph to the text div container.
        let timestampPara = document.createElement("p");
        timestampPara.classList.add("matchText");
        timestampPara.appendChild(document.createTextNode(timePlayedString));
        matchTextDiv.appendChild(timestampPara);

    }



    function buildMatchlistEndpoint(summonerID, region) {
        return `https://${region}.api.pvp.net/api/lol/${region}/v1.3/game/by-summoner/${summonerID}/recent`;
    }

    function buildRankedStatsEndpoint(summonerID, region) {
        return `https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerID}/ranked`;
    }



    return {
        buildProfile: buildProfile
    }
});