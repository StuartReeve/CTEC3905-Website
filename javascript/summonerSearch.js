let summonerSearch = (function() {

    //global privates
    let riotHandler = riotApiHandler();
    let matchListContainer = document.getElementById("matchList");
    let searchField = document.getElementById("summonerSearch");
    let regionSelect = document.getElementById("regionSelect");
    let summonerName = searchField.value;
    let region = regionSelect.value;

    function lookupSummoner() {
        //reset resetMatchListContainer info
        resetMatchListContainer();

        let summonerEndpoint = buildSummonerEndpoint(summonerName, region);
        console.log(summonerEndpoint);

        riotHandler.queryRiotApi(summonerEndpoint, summonerCallback);
    }

    function summonerCallback(data) {
        console.log(data);
        console.log("Summoner Name = " + summonerName);

        //get the string ready to use with json
        let summonerNameNoSpaces = summonerName.replace(/ /g, "");
        summonerNameNoSpaces = summonerNameNoSpaces.toLocaleLowerCase().trim();
        console.log("Summoner name no spaces/lowerecase = " + summonerNameNoSpaces);

        //Grab the summoner ID
        let summonerId = data[summonerNameNoSpaces].id;
        console.log("Summoner ID = " + summonerId);

        let matchlist = matchlistBuilder();
        matchlist.buildMatchlist(summonerId, region);
    }


    //Use the region and summoner name to build a url for the api
    function buildSummonerEndpoint(summonerName, region) {
        summonerName = encodeURIComponent(summonerName);
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName;
    }

    function resetMatchListContainer() {
        while (matchListContainer.firstChild) {
            matchListContainer.removeChild(matchListContainer.firstChild);
        }
    }

    //return an object exposing public information
    return {
        lookupSummoner: lookupSummoner
    }

});