//Calendar input

flatpickr(".date", {
  dateFormat: "m/d/Y",
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
});
// Animations

const observerLeft = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-left");
    } else {
      entry.target.classList.remove("show-left");
    }
  });
});
const observerRight = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-right");
    } else {
      entry.target.classList.remove("show-right");
    }
  });
});
const hiddenElementsLeft = document.querySelectorAll(".hidden-left");
hiddenElementsLeft.forEach((element) => {
  observerLeft.observe(element);
});
const hiddenElementsRight = document.querySelectorAll(".hidden-right");
hiddenElementsRight.forEach((element) => {
  observerRight.observe(element);
});

//Car list models

function showDropdown() {
  document.getElementById("dropdownList").style.display = "block";
}

function hideDropdown() {
  setTimeout(() => {
    document.getElementById("dropdownList").style.display = "none";
  }, 200);
}

function selectCar(carModel) {
  document.getElementById("carInput").value = carModel;
  document.getElementById("dropdownList").style.display = "none";
}

//Map API
// function showMap() {
//   const show = document.getElementById("map");
//   if (show.style.display === "none" || show.style.display === "") {
//     show.style.display = "block";
//     if(!map){
//         initMap(); // Initialize the map if not already done
//     }
//     setTimeout(() => {
//         google.maps.event.trigger(map, "resize");
//         map.setCenter(map.getCenter()); // Re-center the map
//     }, 0);
//   } else {
//     show.style.display = "none";
//   }
// }

// let map;
// let marker;
// const geocoder = new google.maps.Geocoder();

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 }, // Default center
//     zoom: 8, // Default zoom level
//   });

//   // Add a click event listener to the map
//   map.addListener("click", (event) => {
//     placeMarker(event.latLng); // Place a marker at the clicked location
//     getAddress(event.latLng); // Get the address for the clicked location
//   });
// }

// function placeMarker(location) {
//   if (marker) {
//     marker.setPosition(location); // Move existing marker
//   } else {
//     // Create a new marker
//     marker = new google.maps.Marker({
//       position: location,
//       map: map,
//     });
//   }
// }

function getAddress(latLng) {
  // Reverse geocode the coordinates to get the address
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        // Populate the input field with the address
        document.getElementById("locationInput").value =
          results[0].formatted_address;
      } else {
        document.getElementById("locationInput").value = "No address found";
      }
    } else {
      document.getElementById("locationInput").value =
        "Geocoder failed due to: " + status;
    }
  });
}

// Show Paragraph
function showParagraph() {
    const shownParagraph=document.getElementById("shown-paragraph");
    const hiddenParagraph=document.getElementById("hidden-paragraph");
    shownParagraph.style.display="none";
    hiddenParagraph.style.display="block";
}
const readMoreButton=document.getElementById("read-more-btn");
readMoreButton.addEventListener("click",showParagraph);

// Hide Paragraph

function hideParagraph() {
    const shownParagraph=document.getElementById("shown-paragraph");
    const hiddenParagraph=document.getElementById("hidden-paragraph");
    shownParagraph.style.display="block";
    hiddenParagraph.style.display="none";
}
const readLessButton=document.getElementById("read-less-btn");
readMoreButton.addEventListener("click",showParagraph);

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkModeKey = 'darkModeEnabled';
// Function to enable dark mode
function enableDarkMode() {
  console.log("Dark mode enabled");
  body.classList.add('dark-mode');
  localStorage.setItem(darkModeKey, 'true');
}

// Function to disable dark mode
function disableDarkMode() {
  body.classList.remove('dark-mode');
  localStorage.setItem(darkModeKey, 'false');
}

// Check local storage for previously set preference
const isDarkModeEnabled = localStorage.getItem(darkModeKey) === 'true';

if (isDarkModeEnabled) {
  enableDarkMode();
}

// Event listener for the button click
darkModeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});