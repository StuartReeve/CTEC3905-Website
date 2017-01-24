var animation = (function() {

    //privates
    var searchContainer = document.getElementById("searchContainer");
    var summonerContainer = document.getElementById("summonerContainer");

    function animateSearch() {
        searchContainer.classList.add("expanded");
        summonerContainer.classList.remove("hidden");
    }

    //return an object exposing public information
    return {
        animateSearch: animateSearch
    }

});