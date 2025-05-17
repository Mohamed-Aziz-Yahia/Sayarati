document.addEventListener('DOMContentLoaded', function() {
  const headerBtn = document.getElementById('header-btn');
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = localStorage.getItem('loggedInUser');
  const header = document.getElementById('header');
  
  if (headerBtn) {
    if (authToken && loggedInUser) {
      try {
        const user = JSON.parse(loggedInUser);
        // Use the username from the user object
        if (user) {
          // const usernameParts = user.username.split('@')[0]; // Get part before '@' if it's an email
          headerBtn.textContent = user;
          headerBtn.classList.remove('header-btn');
          headerBtn.classList.add('header-user');
          headerBtn.innerHTML+='<img src="./Logos/user.png" alt="user" class="user-icon"/>';
          // headerBtn.href = './dashboard.html'; // Redirect to dashboard or profile
        } else {
          // Fallback if username is not available (shouldn't happen based on your response)
          headerBtn.textContent = 'My Account';
          console.log(loggedInUser);
          console.log(user);
          // headerBtn.href = './dashboard.html';
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If there's an error parsing, maybe clear the storage and revert to login state
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedInUser');
        headerBtn.textContent = 'Login|Sign up';
        headerBtn.href = './login.html';
      }
    } else {
      // User is not logged in
      headerBtn.textContent = 'Login|Sign up';
      headerBtn.href = './login.html';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const headerBtn = document.getElementById('header-btn');
  const userDropdown = document.getElementById('user-dropdown');

  // Show/hide dropdown based on header-btn class
  headerBtn.addEventListener('click', function(e) {
    if (this.classList.contains('header-user')) {
      e.preventDefault();
      userDropdown.classList.toggle('show');
    }
    // If not header-user, will proceed to login page normally
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!headerBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('show');
    }
  });

  // Logout functionality
  document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    headerBtn.classList.remove('header-user');
    headerBtn.classList.add('header-btn');
    headerBtn.textContent = 'Login|Sign up';
    headerBtn.href = './login.html';
    userDropdown.classList.remove('show');
  });
});
//Calendar input

flatpickr(".date", {
  dateFormat: "m/d/Y",
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
});
// Animations

const observerLeft = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-left");
      observer.unobserve(entry.target); // Stop observing after first reveal
    }
  });
});
const observerRight = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-right");
      observer.unobserve(entry.target); // Stop observing after first reveal
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
  document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.querySelector('.dropdown');
  
  dropdown.addEventListener('click', function(e) {
    // Only prevent default for the main dropdown link (#)
    if (e.target === this.querySelector('a[href="#"]')) {
      e.preventDefault();
      console.log('Dropdown trigger clicked');
      this.querySelector('.dropdown-menu').classList.toggle('active');
    }
    // Allow normal link behavior for menu items
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
      dropdown.querySelector('.dropdown-menu').classList.remove('active');
    }
  });
});