let map;
let infoWindow;
var markers = [];

function initMap() {
  const losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 8,
  });

  infoWindow = new google.maps.InfoWindow();
}
const onEnter = (e) => {
  if (e.keyCode === "enter") {
    getStores();
  }
};

const getStores = () => {
  const zipCode = document.getElementById("zip-code").value;
  if (!zipCode) {
    return;
  }

  const API_URL = "http://localhost:3000/api/stores";
  const fullUrl = `${API_URL}?zipCode=${zipCode}`;
  fetch(API_URL)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      clearLocation();
      searchLocationsNear(data);
      setStoresList(data);
      setOnClickListener();
    });
};

const clearLocation = () => {
  infoWindow.close();
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
};

const setOnClickListener = () => {
  let storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach((elem, index) => {
    elem.addEventListener("click", () => {
      google.maps.event.trigger(markers[index], "click");
    });
  });
};

const setStoresList = (stores) => {
  let storesHtml = "";
  stores.forEach((store, index) => {
    storesHtml += `
    <div class="store-container">
    <div class="store-container-background">
        <div class="store-info-container">
            <div class="store-address">
                <span class="address-line1">${
                  store.addressLines[0]
                }</span>                     
                <span class="address-line2">${store.addressLines[1]}</span>
            </div>
            <div class="store-phone-number">
                ${store.phoneNumber}
            </div>
            <div class="store-number-container">
                <div class="store-number">
                   ${index + 1}
                </div>
            </div>
        </div>
    </div>
</div>
    `;
  });
  document.querySelector(".stores-list").innerHTML = storesHtml;
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
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(html);
    infowindow.open(map, marker);
  });
  markers.push(marker);
};
