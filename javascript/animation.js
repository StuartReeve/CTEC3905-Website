let animation = (function() {

    //privates
    let searchContainer = document.getElementById("searchContainer");
    let summonerContainer = document.getElementById("summonerContainer");
    let matchListContainer = document.getElementById("matchList");
    let matchDetailContainer = document.getElementById("matchDetail");

    function animateSearch() {
        searchContainer.classList.add("expanded");
        summonerContainer.classList.remove("hidden");
    }

    function showMatchDetail() {
        matchListContainer.classList.add("hidden");
        matchDetailContainer.classList.remove("hidden");
    }

    function hideMatchDetail() {
        matchDetailContainer.classList.add("hidden");
        matchListContainer.classList.remove("hidden");
    }


    //return an object exposing public information
    return {
        animateSearch: animateSearch,
        showMatchDetail: showMatchDetail,
        hideMatchDetail: hideMatchDetail
    }

});