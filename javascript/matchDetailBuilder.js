let matchDetailBuilder = (function() {

    let matchDetailContainer = document.getElementById("matchDetailContent");
    let riotHandler = riotApiHandler();
    let region = "";
    let summonerID = "";

    function buildMatchDetail(matchID, searchedSummonerID, searchedRegion) {
        region = searchedRegion;
        summonerID = searchedSummonerID;
        let matchEndpoint = buildMatchEndpoint(matchID, region);

        riotHandler.queryRiotApi(matchEndpoint, function(data) {

            //Create team 1 information
            let team1Container = document.createElement("div");
            team1Container.classList.add("teamInfo");

            //add team heading - Victory or Defeat
            team1Container.appendChild(createTeamHeader(data.teams[0].winner));

            //Create table and add th row
            let team1Table = document.createElement("table");
            team1Table.classList.add("matchDetailTable");
            team1Table.appendChild(createTableHeaders());

            let team1TableBody = document.createElement("tbody");


            for(let i = 0; i < data.participants.length / 2; i++) {
                //the information for players is split into two arrays in the JSON so I get each part to use when creating a row.
                //Player name information is stored in a participantIdentity array.
                //Player stats is stored in a participants array.
                let playerIdentity = data.participantIdentities[i].player;
                let playerStats = data.participants[i];

                team1TableBody.appendChild(createPlayerRow(playerIdentity, playerStats));
            }
            team1Table.appendChild(team1TableBody);
            team1Container.appendChild(team1Table);

            //Append all of the players for team 1 to the match detail container
            matchDetailContainer.appendChild(team1Container);


            //Create team 2 information
            let team2Container = document.createElement("div");
            team2Container.classList.add("teamInfo");

            //add team heading - Victory or Defeat
            team2Container.appendChild(createTeamHeader(data.teams[1].winner));

            let team2Table = document.createElement("table");
            team2Table.classList.add("matchDetailTable");
            team2Table.appendChild(createTableHeaders());

            let team2TableBody = document.createElement("tbody");


            for(let i = 5; i < data.participants.length; i++) {
                //the information for players is split into two arrays in the JSON so I get each part to use when creating a row.
                //Player name information is stored in a participantIdentity array.
                //Player stats is stored in a participants array.
                let playerIdentity = data.participantIdentities[i].player;
                let playerStats = data.participants[i];

                team2TableBody.appendChild(createPlayerRow(playerIdentity, playerStats));
            }
            team2Table.appendChild(team2TableBody);
            team2Container.appendChild(team2Table);

            matchDetailContainer.appendChild(team2Container);

        });

    }


    function createTeamHeader(teamWon) {
        let teamHeader = document.createElement("div");
        teamHeader.classList.add("teamHeader");

        //create and populate the header of the teams result
        let resultText = document.createElement("h2");
        //if teamWon is true add victory text and class, else add defeat
        if(teamWon) {
            resultText.appendChild(document.createTextNode("Victory"));
            resultText.classList.add("victory");
        }
        else {
            resultText.appendChild(document.createTextNode("Defeat"));
            resultText.classList.add("defeat");
        }
        teamHeader.appendChild(resultText);
        return teamHeader;
    }

    function createTableHeaders() {
        let tableHeadings = ["Name", "Champion", "Level", "KDA", "Minions", "Items"];

        let tableHead = document.createElement("thead");
        let headerRow = document.createElement("tr");

        tableHeadings.forEach(function(headingText) {
            let heading = document.createElement("th");
            heading.classList.add("heading");
            heading.appendChild(document.createTextNode(headingText));
            headerRow.appendChild(heading);
        });

        tableHead.appendChild(headerRow);
        return tableHead;
    }

    function createPlayerRow(playerIdentity, playerStats) {
        let playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");

        playerRow.appendChild(createName(playerIdentity, playerStats.championId));
        playerRow.appendChild(createChampionImage(playerStats.championId));
        playerRow.appendChild(createLevel(playerStats.stats.champLevel));
        playerRow.appendChild(createKDA(playerStats));
        playerRow.appendChild(createMinions(playerStats.stats.minionsKilled));
        playerRow.appendChild(createItems(playerStats));

        return playerRow;
    }

    function createName(playerIdentity, champID) {
        let summonerCell = document.createElement("td");

        //For normal games player information like names is hidden which can cause playerIdentity to be undefined(not in JSON)
        //If this happens we subsitute the name of the character that was played instead
        if(playerIdentity != undefined) {
            summonerCell.appendChild(document.createTextNode(playerIdentity.summonerName));
            if (playerIdentity["summonerId"] == summonerID)
                summonerCell.classList.add("searchedPlayer");

        }
        else {
            //If not summoner name is available make an API call to get the champion name as an alternative.
            let championEndpoint = buildChampionEndpoint(champID, region);
            riotHandler.queryRiotApi(championEndpoint, function(data) {
                summonerCell.appendChild(document.createTextNode(data.name));
            });
        }
        return summonerCell;
    }

    function createChampionImage(championID) {
        let championCell = document.createElement("td");
        championCell.classList.add("centredCell");

        let championImage = document.createElement("img");
        championImage.classList.add("matchDetailChampion");
        championImage.src = "media/champions/" + championID + ".png";
        championImage.alt = "Champion: ID - "  + championID;

        championCell.appendChild(championImage);

        return championCell;
    }

    function createLevel(level) {
        let levelCell = document.createElement("td");
        levelCell.classList.add("centredCell");

        levelCell.appendChild(document.createTextNode(level));

        return levelCell;
    }

    function createKDA(playerStats) {
        let kdaCell = document.createElement("td");
        kdaCell.classList.add("centredCell");

        //If these values are 0 they don't appear in the JSON file and are therefore undefined so the check is needed.
        let kills = playerStats.stats.kills || "0";
        let deaths = playerStats.stats.deaths || "0";
        let assists = playerStats.stats.assists || "0";
        let kda = kills + "/" + deaths + "/" + assists;

        kdaCell.appendChild(document.createTextNode(kda));

        return kdaCell;
    }

    function createMinions(minions) {
        let minionCell = document.createElement("td");
        minionCell.classList.add("centredCell");

        minionCell.appendChild(document.createTextNode(minions));

        return minionCell;
    }

    function createItems(playerStats) {
        let itemsCell = document.createElement("td");
        itemsCell.classList.add("centredCell");

        for(let i = 0; i < 7; i++) {
            let item = "item" + i;
            let itemID = playerStats.stats[item];
            let itemImg = document.createElement("img");
            itemImg.classList.add("item");

            if(itemID != 0) {
                itemImg.src = "media/items/" + itemID + ".png";
                itemImg.alt = "Item: ID - " + itemID;
            }
            else {
                itemImg.src = "media/items/EmptyIcon.png";
                itemImg.alt = "No item";
            }
            itemsCell.appendChild(itemImg);
        }
        return itemsCell;
    }

    function clearMatchDetail() {
        while(matchDetailContainer.firstChild) {
            matchDetailContainer.removeChild(matchDetailContainer.firstChild);
        }
    }

    function buildMatchEndpoint(matchID, region) {
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/' + matchID;
    }

    function buildChampionEndpoint(champID, region) {
        return 'https://global.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion/' + champID;
    }

    return {
        buildMatchDetail: buildMatchDetail,
        clearMatchDetail: clearMatchDetail
    }


});