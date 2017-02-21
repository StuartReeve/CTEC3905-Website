var matchDetailBuilder = (function() {

    var matchDetailContainer = document.getElementById("matchDetailContent");
    var riotHandler = riotApiHandler();






    function buildMatchDetail(matchID, summonerID, searchedRegion) {
        var matchEndpoint = buildMatchEndpoint(matchID, searchedRegion);

        riotHandler.queryRiotApi(matchEndpoint, function(data) {
            console.log(data);

            var participants = data["participants"];

            //CREATE TABLE FOR TEAM 1
            matchDetailContainer.appendChild(createTeamHeading(data["teams"][0]["winner"]));

            var teamOneTable = document.createElement("table");
            teamOneTable.classList.add("matchDetailTable");
            teamOneTable.appendChild(createTableHeadings());
            var tableBody = document.createElement("tbody");

            for(let i = 0; i < participants.length / 2; i++) {
                var participantIdentity = data["participantIdentities"][i]["player"];
                var participantStats = participants[i];

                tableBody.appendChild(createPlayerTableRow(participantIdentity,participantStats, summonerID));

            }
            teamOneTable.appendChild(tableBody);
            matchDetailContainer.appendChild(teamOneTable);



            //CREATE TABLE FOR TEAM 2
            matchDetailContainer.appendChild(createTeamHeading(data["teams"][1]["winner"]));

            var teamTwoTable = document.createElement("table");
            teamTwoTable.classList.add("matchDetailTable");
            teamTwoTable.appendChild(createTableHeadings());
            tableBody = document.createElement("tbody");

            for(let i = 5; i < participants.length; i++) {
                participantIdentity = data["participantIdentities"][i]["player"];
                participantStats = participants[i];

                tableBody.appendChild(createPlayerTableRow(participantIdentity,participantStats, summonerID));

            }
            teamTwoTable.appendChild(tableBody);
            matchDetailContainer.appendChild(teamTwoTable);




        });
    }

    function createTableHeadings() {
        var tableHeadings = ["Name", "Champion", "Level", "KDA", "Minions", "items"];

        var tableHead = document.createElement("thead");
        var headRow = document.createElement("tr");
        tableHeadings.forEach(function(heading) {
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(heading));
            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);
        return tableHead;


    }

    function createPlayerTableRow(playerIdentity, playerStats, summonerID) {
        var playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");

        //Add the summoner name
        var summonerNameCell = document.createElement("td");
        summonerNameCell.appendChild(document.createTextNode(playerIdentity["summonerName"]));
        if(playerIdentity["summonerId"] == summonerID)
            summonerNameCell.classList.add("searchedPlayer");
        playerRow.appendChild(summonerNameCell);

        //Add the champion img
        var championCell = document.createElement("td");
        championCell.classList.add("centredCell");
        var championID = playerStats["championId"];
        addChampionImg(championCell, championID);
        playerRow.appendChild(championCell);

        //Add the champion level
        var levelCell = document.createElement("td");
        levelCell.classList.add("centredCell");
        levelCell.appendChild(document.createTextNode(playerStats["stats"]["champLevel"]));
        playerRow.appendChild(levelCell);

        //add the KDA
        var kdaCell = document.createElement("td");
        kdaCell.classList.add("centredCell");
        //If these values are 0 they don't appear in the JSON file and are therefore undefined so the check is needed.
        var kills = playerStats["stats"]["kills"] === undefined ? "0" : playerStats["stats"]["kills"];
        var deaths = playerStats["stats"]["deaths"] === undefined ? "0" : playerStats["stats"]["deaths"];
        var assists = playerStats["stats"]["assists"] === undefined ? "0" : playerStats["stats"]["assists"];
        var kda = kills + "/" + deaths + "/" + assists;
        kdaCell.appendChild(document.createTextNode(kda));
        playerRow.appendChild(kdaCell);

        //add minion kills
        var minionsCell = document.createElement("td");
        minionsCell.classList.add("centredCell");
        minionsCell.appendChild(document.createTextNode(playerStats["stats"]["minionsKilled"]));
        playerRow.appendChild(minionsCell);

        var itemsCell = document.createElement("td");
        itemsCell.classList.add("centredCell");
        for(let i = 0; i < 7; i++) {
            var item = "item" + i;
            addItemImg(itemsCell, playerStats["stats"][item]);
         }
        playerRow.appendChild(itemsCell);




        return playerRow;


    }

    function addChampionImg(td, championID) {
        var img = document.createElement("img");
        img.classList.add("matchDetailChampion");
        img.src = "media/champions/" + championID + ".png";
        img.alt = "Champion: ID - "  + championID;
        td.appendChild(img);
    }

    function addItemImg(td, itemID) {
        var img = document.createElement("img");
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
        var teamHeading = document.createElement("h2");


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