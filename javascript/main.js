(function(){

    var searchForm = document.getElementById("searchForm");

    //Perform search when submitted
    searchForm.addEventListener("submit", function(event) {

        //Perform animation to expand main content
        var animate = animation();
        animate.animateSearch();

        var lookupSummoner = summonerSearch();
        lookupSummoner.lookupSummoner();

        event.preventDefault();
    })
}());