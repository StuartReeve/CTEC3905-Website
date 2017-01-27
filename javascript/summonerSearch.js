var summonerSearch = (function() {

    //privates
    var searchField = document.getElementById("summonerSearch");
    var regionSelect = document.getElementById("regionSelect");
    var summonerName = searchField.value;
    var region = regionSelect.value;

    function lookupSummoner() {

        queryRiotApi();

    }

    //Use the region and summoner name to build a url for the api
    function buildApiUrl(summonerName, region) {
        summonerName = encodeURIComponent(summonerName);
        return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName;
    }

    function queryRiotApi() {

        if (summonerName !== "") {
            var apiUrl = buildApiUrl(summonerName, region);

            $.ajax({
                url: 'http://riot-api-wrapper.local/?riotUrl=' + apiUrl,
                type: 'GET',
                dataType: 'json',
                data: {},
                success: function (json) {
                    console.log(json);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to get summoner data.");
                }

            });
        }
    }




    //return an object exposing public information
    return {
        lookupSummoner: lookupSummoner
    }

});