function initialize() {	
	var latInic = $("#lat").val();
	var lonInic = $("#lon").val();
	var latlng = new google.maps.LatLng(latInic, lonInic);
	var options = {
		zoom: 14,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map"), options);
	
	geocoder = new google.maps.Geocoder();	
	marker = new google.maps.Marker({
		map: map,
		draggable: true
	});	
	marker.setPosition(latlng);
	
    google.maps.event.addListener(marker, 'dragend', function(marker){
        var latLng = marker.latLng; 
        currentLatitude = latLng.lat();
        currentLongitude = latLng.lng();
        $("#lat").val(currentLatitude);
        $("#lon").val(currentLongitude);
     });
}

