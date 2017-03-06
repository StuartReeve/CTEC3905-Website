let riotApiHandler = (function() {
    "use strict"
;

    /*queryRiotAPI takes 3 arguments:
        -the endpoint to be requested
        -A function to be called on success
        -A function to be called on error - all error functions need at least the following params- (XMLHttpRequest, textStatus, errorThrown)
     */
    function queryRiotApi(apiEndpoint, callback, errorFunction) {

        if(apiEndpoint != "") {
            //Call is made to a php wrapper for the riot api as calls can't be made in javascript due to CORS.
            //PHP code also allows for the api key to be hidden.
            $.ajax({
                url:`http://riot-api-wrapper.sreeve.tech?riotUrl=${apiEndpoint}`,
                type: 'GET',
                dataType: 'json',
                data: {},
                success: callback,
                error: errorFunction

            });
        }
    }

    return {
        queryRiotApi : queryRiotApi
    }

});