Summoner Search Site
--------------------
The site can be accessed from: http://summoner-search.sreeve.tech

The summoner Search site is a single page application that heavily uses JavaScript and
the [Riot Games JSON API](https://developer.riotgames.com/) to allows users of the site
to get up to date information about [League of Legends](https://en.wikipedia.org/wiki/League_of_Legends)
accounts.

###Using the Site

The site provides a search bar which a user can enter a summoner name (League
of Legends account name) that they would like to search for, a drop down list also 
allows you to select the region which the search will be performed in. When a summoner
 name is entered the API will be used to provide a brief account overview such as a win/loss
ratio and the accounts most played Champions (a playable character in the game). Below
this is a match list showing a summary of recently played games. Each game in the list 
shows the Champion that was played, the game mode, how long ago the game was played,
the result of the game (victory/defeat) and the KDA of the player (KDA stats for kills/
deaths/assists and is essentially the players score). Each of these games can be clicked
on to provide a more detailed match summary.

**_(All test names provided should be searched on the EUW region)_**

The following summoner names can be used to test the site: 

* Morphig
* Fugger
* JJWF
* Mistfall
* Toxaris
* Dezachu
* AlexRL
 
###The API
The Riot Games API provides a large number of different request endpoints(request URLs) that can be
used to retrieve information from the API in JSON format. Each endpoint returns
different information from the API and in most cases will provide IDs which are then 
used in future API calls, some example endpoints are:

* __/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}__ - Which takes a summoner name
and provides information about that summoner. This request returns a summoner ID which 
can be used to in other calls.
* __/api/lol/{region}/v2.2/match/{matchId}__ - Which takes a matchId and provides detailed
information for that specific match.

#####Making API Calls
The Riot Games API does not allow requests to be made directly from JavaScript and will
cause a CORS error if attempted. So I could make calls to the API I wrote a very small
piece of PHP which makes the actual call to the API and returns the JSON. My JavaScript
contains a file called riotApiHandler which takes an API endpoint and sends it to the 
PHP code hosted on my server which adds the API key makes the actual call. This is 
also the correct way to make API calls according to the Riot Games API as all API keys should be hidden server side so they can not be accessed by the
public

#####Rate Limiting
Unfortunately when first signing up to use the API you are provided with a development
API key which has a strict rate limit applied to it which limits the amount of requests
that can be made to the API to 10 requests every 10 seconds. This meant that in order
to make the site work properly some workarounds were needed (This was discussed with
Dave).

######The Workarounds
The rate limit caused me to have to be very careful with how many times I made requests
to the API. I reduced the amount of requests I was making a couple of ways which were:

* Download images provided from the API and serve them myself. This was used done for
both champion images and item images. This meant that instead of getting an ID
and using that ID to make a request for the image name I could just name the image
after the corresponding ID and use this in my img src. This also reduced loading speeds.
* The next main way in which I reduced requests was to use a different endpoint to retrieve
the list of previous matches. The original way that I was creating the list of recent
matches was to get a list of all the match IDs for the searched summoner and then use
these match IDs to get more detailed information like the game mode and when the game
was played. This however meant that I needed to make 10 requests just to build the match
list. To get around this problem I had to change the endpoint that I was using. The new
endpoint allowed me to get the 10 most recent matches including all of the more in depth
detail that I wanted like game mode and game stats. The downside to this was that I was
forced to only display the last 10 games. The original method returned many more matches.

###Design
The aim of the site design wise was to provide a very simple and minimalistic approach to
displaying recent game information for League of Legends accounts on both mobile and
desktop. The site uses mobile first design and uses CSS breakpoints to provide tailored views
for mobile, tablet and desktop.

###Development Process
As part of my development process I asked a number of friends who are familiar with League of
Legends to try using my site and to provide any feedback they had. From these testing
session I added a couple of features.

* Previous iterations of the match list didn't include the game mode or any indication of when
the game was played. This caused the majority of people who tested the site to comment that
it was unclear on which order to read the matches, vertically or horizontally. From this
feedback I added how long ago the game was played, which gave a better indiction of what
order the games were played in.
* Another piece of feedback I received was it being unclear on what summoner the displayed
information was for. This feedback was what inspired the summoner header when a search is 
performed which contains; the searched name, statistics and most played champions.

I found these small testing sessions incredibly useful and as each user was normally using
a different browser or screen size it also highlighted a number of smaller issues such as 
elements not displaying on certain screen sizes which I could then go amend.

###JavaScript

The JavaScript used in the site is all written from scratch and uses some ES6 features and
the JavaScript design pattern, Revealing Module Pattern. The ES6 features that are used are:
* Let to declare variables instead of Var.
* Use Strict.
* Template literals

The Revealing Module Pattern was used through out my site. The pattern allows for the
emulation of classes which include both private and public methods and variables allowing
certain things to be hidden from global scope. This is achieved by declaring each JavaScript
file as an anonymous function that returns an object with pointers to the functions that
should be available publicly, all other variables and functions are private. More about
the revealing module pattern can be read [here](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

###Testing
The site has been tested on Desktop using Chrome and Firefox as well as mobile and tablet
using the Chrome browser for Android.

###HTML Validation
As the majority of the HTML is inserted to the website, validating the website from the
URL will not give true results. The best way to validate the website is to perform a
search for a summoner to generate the HTML, then copy the HTML from the browser 
developer tools. To do this right click on the html tag and select copy outer html.
This however will likely not include the DOCTYPE from the HTML.
 
During testing I received no errors from the W3C HTML validator. 
 
 