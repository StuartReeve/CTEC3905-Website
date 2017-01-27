var riotApiHandler = (function() {


    function queryRiotApi(apiEndpoint) {

        if(apiEndpoint != "") {
            //Call is made to a php wrapper for the riot api as calls can't be made in javascript due to CORS.
            //PHP code also allows for the api key to be hidden.
            $.ajax({
                url: 'http://riot-api-wrapper.local/?riotUrl=' + apiEndpoint,
                type: 'GET',
                dataType: 'json',
                data: {},
                success: function (json) {
                    console.log(json);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to get data from riot API.");
                    //return false;
                }

            });
        }
    }


    return {
        queryRiotApi : queryRiotApi
    }

});