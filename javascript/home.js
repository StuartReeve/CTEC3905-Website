(function(){

    var searchContainer = document.getElementById("searchContainer");
    var summonerContainer = document.getElementById("summonerContainer");
    var searchForm = document.getElementById("searchForm");


    function performSearch() {
        animateSearch();
        event.preventDefault();

    }

    function animateSearch() {
        searchContainer.classList.add("expanded");
        summonerContainer.classList.remove("hidden");
    }

    searchForm.addEventListener("submit", performSearch);



}());