require(["esri/map","dojo/domReady!"],function(Map){
	window.map=new Map("mapDiv", {
          basemap: "gray",
          zoom: 4
        });

})