(function(){

    let searchForm = document.getElementById("searchForm");
    let summonerDetailCloseButton = document.getElementById("closeDetail");
    let animate = animation();

    //Perform search when submitted
    searchForm.addEventListener("submit", function(event) {

        //Perform animation to expand main content
        animate.animateSearch();
        resetMatchDetail();

        let lookupSummoner = summonerSearch();
        lookupSummoner.lookupSummoner();

        event.preventDefault();
    });

    //Set on click for the detail close button
    summonerDetailCloseButton.addEventListener("click", function() {
        resetMatchDetail();
    });


    function resetMatchDetail() {
        animate.hideMatchDetail();
        let matchDetail = matchDetailBuilder();
        matchDetail.clearMatchDetail();
    }

}());