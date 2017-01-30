var summonerSearch = (function() {

    //global privates
    var riotHandler = riotApiHandler();
    var summonerContainer = document.getElementById("summonerContainer");
    var searchField = document.getElementById("summonerSearch");
    var regionSelect = document.getElementById("regionSelect");
    var summonerName = searchField.value;
    var region = regionSelect.value;

    function lookupSummoner() {
        //reset summonerContainer info
        resetSummonerContainer();

        var summonerEndpoint = buildSummonerEndpoint(summonerName, region);
        console.log(summonerEndpoint);

        riotHandler.queryRiotApi(summonerEndpoint, summonerCallback);
    }

    function summonerCallback(data) {
        console.log(data);
        console.log("Summoner Name = " + summonerName);

        //get the string ready to use with json
        var summonerNameNoSpaces = summonerName.replace(/ /g, "");
        summonerNameNoSpaces = summonerNameNoSpaces.toLocaleLowerCase().trim();
        console.log("Summoner name no spaces/lowerecase = " + summonerNameNoSpaces);

        //Grab the summoner ID
        var summonerId = data[summonerNameNoSpaces].id;
        console.log("Summoner ID = " + summonerId);

        var matchlist = matchlistBuilder(summonerId, region);
        matchlist.buildMatchlist();
    }


    //Use the region and summoner name to build a url for the api
    function buildSummonerEndpoint(summonerName, region) {
        summonerName = encodeURIComponent(summonerName);
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName;
    }

    function resetSummonerContainer() {
        while (summonerContainer.firstChild) {
            summonerContainer.removeChild(summonerContainer.firstChild);
        }
    }

    //return an object exposing public information
    return {
        lookupSummoner: lookupSummoner
    }

});