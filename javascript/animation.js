let animation = (function() {

    //privates
    let searchContainer = document.getElementById("searchContainer");
    let summonerContainer = document.getElementById("summonerContainer");
    let profileContainer = document.getElementById("summonerProfile");
    let matchDetailContainer = document.getElementById("matchDetail");

    function animateSearch() {
        searchContainer.classList.add("expanded");
        summonerContainer.classList.remove("hidden");
    }

    function showMatchDetail() {
        profileContainer.classList.add("hidden");
        matchDetailContainer.classList.remove("hidden");
    }

    function hideMatchDetail() {
        matchDetailContainer.classList.add("hidden");
        profileContainer.classList.remove("hidden");
    }


    //return an object exposing public information
    return {
        animateSearch: animateSearch,
        showMatchDetail: showMatchDetail,
        hideMatchDetail: hideMatchDetail
    }

});