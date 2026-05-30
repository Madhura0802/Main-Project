
    mapboxgl.accessToken =mapToken;
    console.log(mapToken) 
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });


     const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`${listing.title}<h4><p>Exact Location provided after booking</p></h4>`))
        .addTo(map);