var artist_id = '50OApTJurDusIo9dGTqSU4';
var related_artists;

const browseRelatedArtists = function() {

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }

        var params = getHashParams();

        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;

        if (error) {
          alert('There was an error during the authentication');
        } else {
          if (access_token) {

            $.ajax({
                url: 'https://api.spotify.com/v1/artists/'+artist_id+'/related-artists',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
// HERE is the actual code *-*-*-**-*-*-*--*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-**--*-*
                  related_artists = response["artists"];
                  // Sort by popularity :
                  related_artists.sort(function(a, b){return b["popularity"] - a["popularity"]});
                  const nbArtistsToDisplay = 3 ;
                  //Famous ones
                  for( k = 0 ; k < nbArtistsToDisplay ; ++k ){
                    var artist = document.querySelector('#most_famous_artist_'+k) ;
                    artist.innerHTML= "<img id="+k+" class='artist_image' src=" +related_artists[k]["images"][0]["url"]+ " /> "+ related_artists[k]["name"] ;
                  }
                  //Least famous ones
                  for( k = related_artists.length-1 ; k > related_artists.length-1-nbArtistsToDisplay ; --k ){
                    artist = document.querySelector('#least_famous_artist_'+(related_artists.length-1-k)) ;
                    artist.innerHTML = "<img id="+k+" class='artist_image' src=" +related_artists[k]["images"][0]["url"]+ " />"+ related_artists[k]["name"] ;
                  }

// END  of the actual code *-*-*-**-*-*-*--*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-**--*-*
                  $('#login').hide();
                  $('#loggedin').show();
                }
            });
          } else {
              // render initial screen
              $('#login').show();
              $('#loggedin').hide();
          }
          
        }
      };

const replaceSpaces = function(str){
  var new_string = "" ;
  for( k = 0 ; k < str.length ; ++k){
    if( str.charAt(k) != ' ' )
        new_string += str.charAt(k);
    else
        new_string += "%20"
  }
  return new_string;
};

const searchArtist = function() {

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }

        var params = getHashParams();

        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;

        if (error) {
          alert('There was an error during the authentication');
        } else {
          if (access_token) {

            $.ajax({
                url: 'https://api.spotify.com/v1/search?q='+replaceSpaces(document.querySelector("#searchInput").value)+'&type=artist',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
// HERE is the actual code *-*-*-**-*-*-*--*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-**--*-*
                  const artist = response["artists"]["items"][0];
                  artist_id = artist["id"];
                  document.querySelector("#current_artist_image").src = artist["images"][0]["url"];
                  document.querySelector("#current_artist_name").innerHTML = artist["name"];
                  document.querySelector("#current_artist_spotify_link").href = "https://open.spotify.com/artist/"+artist["id"];
                  browseRelatedArtists() ;

// END  of the actual code *-*-*-**-*-*-*--*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-**--*-*
                  $('#login').hide();
                  $('#loggedin').show();
                  $('#current_artist').show();
                  $('#related_artists').show();
                }
            });
          } else {
              // render initial screen
              $('#login').show();
              $('#loggedin').hide();
          }
          
        }
      };

document.querySelector("#searchImg").addEventListener('click',searchArtist);

const updateArtist = function(e){
  const artist_position = e.target.id;
  const artist = related_artists[artist_position];
  artist_id = artist["id"];
  document.querySelector("#current_artist_image").src = artist["images"][0]["url"];
  document.querySelector("#current_artist_name").innerHTML = artist["name"];
  document.querySelector("#current_artist_spotify_link").href = "https://open.spotify.com/artist/"+artist["id"];

};

var artist_class = document.getElementsByClassName("artist");
for (var i = 0; i < artist_class.length; i++) {
    artist_class[i].addEventListener('click', updateArtist);
    artist_class[i].addEventListener('click', browseRelatedArtists);
};

browseRelatedArtists();