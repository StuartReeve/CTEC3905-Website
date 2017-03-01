let matchDetailBuilder = (function() {

    let matchDetailContainer = document.getElementById("matchDetailContent");
    let riotHandler = riotApiHandler();

    function buildMatchDetail(matchID, summonerID, searchedRegion) {
        let matchEndpoint = buildMatchEndpoint(matchID, searchedRegion);

        riotHandler.queryRiotApi(matchEndpoint, function(data) {
            console.log(data);

            let participants = data["participants"];

            try {
                //CREATE TABLE FOR TEAM 1
                matchDetailContainer.appendChild(createTeamHeading(data["teams"][0]["winner"]));

                let teamOneTable = document.createElement("table");
                teamOneTable.classList.add("matchDetailTable");
                teamOneTable.appendChild(createTableHeadings());
                let tableBody = document.createElement("tbody");

                for (let i = 0; i < participants.length / 2; i++) {
                    let participantIdentity = data["participantIdentities"][i]["player"];
                    let participantStats = participants[i];

                    tableBody.appendChild(createPlayerTableRow(participantIdentity, participantStats, summonerID));

                }
                teamOneTable.appendChild(tableBody);
                matchDetailContainer.appendChild(teamOneTable);


                //CREATE TABLE FOR TEAM 2
                matchDetailContainer.appendChild(createTeamHeading(data["teams"][1]["winner"]));

                let teamTwoTable = document.createElement("table");
                teamTwoTable.classList.add("matchDetailTable");
                teamTwoTable.appendChild(createTableHeadings());
                tableBody = document.createElement("tbody");

                for (let i = 5; i < participants.length; i++) {
                    participantIdentity = data["participantIdentities"][i]["player"];
                    participantStats = participants[i];

                    tableBody.appendChild(createPlayerTableRow(participantIdentity, participantStats, summonerID));

                }
                teamTwoTable.appendChild(tableBody);
                matchDetailContainer.appendChild(teamTwoTable);

            }
            catch(error) {
                console.log(error);
                clearMatchDetail();
                let errorParagraph = document.createElement("p");
                errorParagraph.classList.add("errorMessage");
                errorParagraph.appendChild(document.createTextNode("Detailed information for games of this type is not available from the API."));
                matchDetailContainer.appendChild(errorParagraph);
            }


        });
    }

    function createTableHeadings() {
        let tableHeadings = ["Name", "Champion", "Level", "KDA", "Minions", "Items"];

        let tableHead = document.createElement("thead");
        let headRow = document.createElement("tr");
        tableHeadings.forEach(function(heading) {
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(heading));
            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);
        return tableHead;


    }

    function createPlayerTableRow(playerIdentity, playerStats, summonerID) {
        let playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");

        //Add the summoner name
        let summonerNameCell = document.createElement("td");
        let summName;
        if(playerIdentity != undefined) {
            summName = playerIdentity.summonerName;
            if (playerIdentity["summonerId"] == summonerID)
                summonerNameCell.classList.add("searchedPlayer");
        }
        else {
            summName = "Hidden by API";
        }
        summonerNameCell.appendChild(document.createTextNode(summName));
        playerRow.appendChild(summonerNameCell);

        //Add the champion img
        let championCell = document.createElement("td");
        championCell.classList.add("centredCell");
        let championID = playerStats["championId"];
        addChampionImg(championCell, championID);
        playerRow.appendChild(championCell);

        //Add the champion level
        let levelCell = document.createElement("td");
        levelCell.classList.add("centredCell");
        levelCell.appendChild(document.createTextNode(playerStats["stats"]["champLevel"]));
        playerRow.appendChild(levelCell);

        //add the KDA
        let kdaCell = document.createElement("td");
        kdaCell.classList.add("centredCell");
        //If these values are 0 they don't appear in the JSON file and are therefore undefined so the check is needed.
        let kills = playerStats.stats.kills || "0";
        let deaths = playerStats.stats.deaths || "0";
        let assists = playerStats.stats.assists || "0";
        let kda = kills + "/" + deaths + "/" + assists;
        kdaCell.appendChild(document.createTextNode(kda));
        playerRow.appendChild(kdaCell);

        //add minion kills
        let minionsCell = document.createElement("td");
        minionsCell.classList.add("centredCell");
        minionsCell.appendChild(document.createTextNode(playerStats["stats"]["minionsKilled"]));
        playerRow.appendChild(minionsCell);

        let itemsCell = document.createElement("td");
        itemsCell.classList.add("centredCell");
        for(let i = 0; i < 7; i++) {
            let item = "item" + i;
            addItemImg(itemsCell, playerStats["stats"][item]);
         }
        playerRow.appendChild(itemsCell);

        return playerRow;


    }

    function addChampionImg(td, championID) {
        let img = document.createElement("img");
        img.classList.add("matchDetailChampion");
        img.src = "media/champions/" + championID + ".png";
        img.alt = "Champion: ID - "  + championID;
        td.appendChild(img);
    }

    function addItemImg(td, itemID) {
        let img = document.createElement("img");
        img.classList.add("item");
        //an itemID of 0 means the item slot is empty so do nothing

        if(itemID != 0) {
            img.src = "media/items/" + itemID + ".png";
            img.alt = "Item: ID - " + itemID;
        }
        else {
            img.src = "media/items/EmptyIcon.png";
            img.alt = "No item";
        }

        td.appendChild(img);
    }

    function createTeamHeading(teamResult) {
        let teamHeading = document.createElement("h2");


        if(teamResult) {
            teamHeading.appendChild(document.createTextNode("Victory"));
            teamHeading.classList.add("victory");
        }
        else {
            teamHeading.appendChild(document.createTextNode("Defeat"));
            teamHeading.classList.add("defeat");
        }

        return teamHeading;
    }

    function clearMatchDetail() {
        while(matchDetailContainer.firstChild) {
            matchDetailContainer.removeChild(matchDetailContainer.firstChild);
        }
    }


    function buildMatchEndpoint(matchID, region) {
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/' + matchID;
    }

    return {
        buildMatchDetail: buildMatchDetail,
        clearMatchDetail: clearMatchDetail
    }


});