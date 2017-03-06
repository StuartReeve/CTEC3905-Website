let riotApiHandler = (function() {


    function queryRiotApi(apiEndpoint, callback) {

        if(apiEndpoint != "") {
            //Call is made to a php wrapper for the riot api as calls can't be made in javascript due to CORS.
            //PHP code also allows for the api key to be hidden.
            $.ajax({
                url: 'http://riot-api-wrapper.sreeve.tech?riotUrl=' + apiEndpoint,
                type: 'GET',
                dataType: 'json',
                data: {},
                success: callback,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to get data from riot API. " + errorThrown.toString());
                    //return false;
                }

            });
        }
    }

    return {
        queryRiotApi : queryRiotApi
    }

});