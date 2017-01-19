(function(){

    var searchContainer = document.getElementById("searchContainer");
    var searchForm = document.getElementById("searchForm");


    function performSearch() {
        animateSearch();
        event.preventDefault();

    }

    function animateSearch() {
        searchContainer.classList.add("expanded");
    }

    searchForm.addEventListener("submit", performSearch);



}());