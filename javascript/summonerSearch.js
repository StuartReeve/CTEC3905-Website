var summonerSearch = (function() {

    //privates
    var searchField = document.getElementById("summonerSearch");
    var regionSelect = document.getElementById("regionSelect");
    var summonerName = searchField.value;
    var region = regionSelect.value;

    function lookupSummoner() {
        var summonerEndpoint = buildSummonerEndpoint(summonerName, region);
        console.log(summonerEndpoint);
        var riotHandler = riotApiHandler();
        riotHandler.queryRiotApi(summonerEndpoint);

    }

    //Use the region and summoner name to build a url for the api
    function buildSummonerEndpoint(summonerName, region) {
        summonerName = encodeURIComponent(summonerName);
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName;
    }




    //return an object exposing public information
    return {
        lookupSummoner: lookupSummoner
    }

});