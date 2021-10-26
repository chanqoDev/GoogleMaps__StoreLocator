let map;
let infoWindow;

function initMap() {
  const losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 8,
  });
  const infowindow = new google.maps.InfoWindow();
  getStores();
}

const getStores = () => {
  const API_URL = "http://localhost:3000/api/stores";
  fetch(API_URL)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      searchLocationsNear(data);
    });
};

const searchLocationsNear = (stores) => {
  var bounds = new google.maps.LatLngBounds();

  stores.forEach((store, index) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[1],
      store.location.coordinates[0]
    );
    let name = store.storeName;
    let address = store.addressLines[0];
    let phone = store.phoneNumber;
    let openStatusText = store.openStatusText;
    bounds.extend(latlng);
    createMaker(latlng, name, address, openStatusText, phone, index + 1);
  });
  map.fitBounds(bounds);
};

const createMaker = (
  latlng,
  name,
  address,
  openStatusText,
  phone,
  storeNumber
) => {
  let html = `
  <div class="store-info-window">
  <div class="store-info-name">
      ${name}
  </div>
    <div class="store-info-open-status">
      ${openStatusText}
    </div>
    <div class="store-info-address">
      <div class="icon"> 
        <i class="fas fa-location-arrow"></i>
        </div> 
        <span>${address}</span>
    </div> 
  
   <div class="store-info-phone">
   <div class="icon">
     <i class="fas fa-phone-alt"></i>
   </div> 
   <span>
    <a href="tel:${phone}">${phone}</span> 
   </div>
  </div> 
  `;
  const infowindow = new google.maps.InfoWindow({
    content: html,
  });

  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${storeNumber}`,
  });
  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
  // infoWindow.setContent(html);
  // infoWindow.open(map, marker);
};

// map.mapTypes.set("styled_map", styledMapType);
//   map.setMapTypeId("styled_map");
//   marker.addListener("click", toggleBounce);

//   function toggleBounce() {
//     if (marker.getAnimation() !== null) {
//       marker.setAnimation(null);
//     } else {
//       marker.setAnimation(google.maps.Animation.BOUNCE);
//     }
//   }
//Associate the styled map with the MapTypeId and set it to display.
// const styledMapType = new google.maps.StyledMapType(
//   [
//     {
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#ebe3cd",
//         },
//       ],
//     },
//     {
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#523735",
//         },
//       ],
//     },
//     {
//       elementType: "labels.text.stroke",
//       stylers: [
//         {
//           color: "#f5f1e6",
//         },
//       ],
//     },
//     {
//       featureType: "administrative",
//       elementType: "geometry.stroke",
//       stylers: [
//         {
//           color: "#c9b2a6",
//         },
//       ],
//     },
//     {
//       featureType: "administrative.land_parcel",
//       elementType: "geometry.stroke",
//       stylers: [
//         {
//           color: "#dcd2be",
//         },
//       ],
//     },
//     {
//       featureType: "administrative.land_parcel",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#ae9e90",
//         },
//       ],
//     },
//     {
//       featureType: "landscape.natural",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#dfd2ae",
//         },
//       ],
//     },
//     {
//       featureType: "poi",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#dfd2ae",
//         },
//       ],
//     },
//     {
//       featureType: "poi",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#93817c",
//         },
//       ],
//     },
//     {
//       featureType: "poi.park",
//       elementType: "geometry.fill",
//       stylers: [
//         {
//           color: "#a5b076",
//         },
//       ],
//     },
//     {
//       featureType: "poi.park",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#447530",
//         },
//       ],
//     },
//     {
//       featureType: "road",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#f5f1e6",
//         },
//       ],
//     },
//     {
//       featureType: "road.arterial",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#fdfcf8",
//         },
//       ],
//     },
//     {
//       featureType: "road.highway",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#f8c967",
//         },
//       ],
//     },
//     {
//       featureType: "road.highway",
//       elementType: "geometry.stroke",
//       stylers: [
//         {
//           color: "#e9bc62",
//         },
//       ],
//     },
//     {
//       featureType: "road.highway.controlled_access",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#e98d58",
//         },
//       ],
//     },
//     {
//       featureType: "road.highway.controlled_access",
//       elementType: "geometry.stroke",
//       stylers: [
//         {
//           color: "#db8555",
//         },
//       ],
//     },
//     {
//       featureType: "road.local",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#806b63",
//         },
//       ],
//     },
//     {
//       featureType: "transit.line",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#dfd2ae",
//         },
//       ],
//     },
//     {
//       featureType: "transit.line",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#8f7d77",
//         },
//       ],
//     },
//     {
//       featureType: "transit.line",
//       elementType: "labels.text.stroke",
//       stylers: [
//         {
//           color: "#ebe3cd",
//         },
//       ],
//     },
//     {
//       featureType: "transit.station",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#dfd2ae",
//         },
//       ],
//     },
//     {
//       featureType: "water",
//       elementType: "geometry.fill",
//       stylers: [
//         {
//           color: "#b9d3c2",
//         },
//       ],
//     },
//     {
//       featureType: "water",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#92998d",
//         },
//       ],
//     },
//   ],
//   {
//     name: "Retro🪖",
//   }
// );
