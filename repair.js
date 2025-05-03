let sellers = [
  {
    id: 1,
    name: "City Auto Repair",
    phone: "0555010123",
    services: ["repair", "towing"],
    rating: 4.2,
    city: "Alger",
    image: "images/default-profile.png"
  },
  {
    id: 2,
    name: "24/7 Breakdown Service",
    phone: "0755020278",
    services: ["towing"],
    rating: 3.9,
    city: "Constantine",
    image: "images/default-profile.png"
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const searchBar = document.getElementById('search-bar'); // Make sure you have this ID in your HTML
  if (searchBar) {
    searchBar.addEventListener('input', handleSearch);
  }
  renderSellers(sellers); // Initial render
});

function handleSearch(e) {
  const searchTerm = e.target.value.trim().toLowerCase();
  if (searchTerm === '') {
    renderSellers(sellers); // Show all when empty
    return;
  }

  const filtered = sellers.filter(seller => 
    seller.city.toLowerCase() === searchTerm // Changed from includes to ===
  );
  renderSellers(filtered);
}
function renderSellers(sellersToShow) {
  const container = document.getElementById('repair-container');
  if (!container) return;
  const logoStyles = 'width: 60px; height: 60px; margin-right: 4px; vertical-align: middle; border-radius: 3px;'; // Example styles
  container.innerHTML = sellersToShow.map(seller => `
    <div class="repair-item" data-id="${seller.id}" onclick="showDetails(this)">
      <img src="${seller.image}" alt="${seller.name}">
      <h2>${seller.name}</h2>
      <p>${seller.phone}</p>
      <p class="seller-city">${seller.city}</p> <!-- Added city display -->
      <div class="repair-rating">
        ${generateStars(seller.rating)}
        <span class="rating-value">${seller.rating.toFixed(1)}</span>
      </div>
      <div class="repair-services">
        ${seller.services.map(service => 
          `<img src="Logos/${service}-icon.png" alt="${service}" style="${logoStyles}">`
        ).join('')}
      </div>
    </div>
  `).join('');
}

function showDetails(item) {
  try {
    document.body.classList.add("noscroll");
    
    // 1. EXTRACT DATA (with fallbacks)
    const name = item.querySelector("h2")?.textContent || "Unknown Shop";
    const phoneNum = item.querySelector("p")?.textContent || "No phone";
    const city = item.querySelector(".seller-city")?.textContent || "Unknown City";
    const ratingValue = parseFloat(item.querySelector(".rating-value")?.textContent) || 0;
    const services = item.querySelectorAll(".repair-services img").length;
    const image = item.querySelector("img")?.src || "images/default-profile.png";

    // 2. YOUR ORIGINAL RATING FUNCTIONS (unchanged)
    function createRating(rating) {
      let starsHtml = "<div>";
      for (let i = 0; i < rating; i++) {
        starsHtml += `<img src="./Logos/star.png" alt="star"/>`;
      }
      starsHtml += "</div>";
      return starsHtml;
    }

    function service(services) {
      if (services === 1) return "Car repair";
      if (services === 2) return "Car repair, Car breakdown";
      return "Various services";
    }

    // 3. CREATE POPUP (with error-proof DOM injection)
    const repairDetails = document.createElement("div");
    repairDetails.className = "repair-details";
    repairDetails.innerHTML = `
      <button id='close'><img src="./Logos/close.png" alt="Close"/></button>
      <div id='details-content'>
        <img id='profile-img' src="${image}" alt="${name}"/>
        <div>
          <p>Name: ${name}</p>
          <p>Phone: ${phoneNum}</p>
          <p>Location: ${city}</p>
          <p>Hours: 8:00am-5:00pm</p>
          <p>Days: Sunday-Thursday</p>
          <p>Services: ${service(services)}</p>
          <div id='rating'>Rating: ${createRating(Math.floor(ratingValue))}</div>
        </div>
      </div>
      <div id='buttons'>
        <button id='call'><img src="./Logos/phone.png"/>Contact</button>
        <button id='available'><img src="./Logos/back-in-time.png"/>Available after 32min</button>
      </div>
      <button id='automatic-call'>Contact after time ends automatically</button>
    `;

    // 4. SAFE DOM INJECTION
    if (!document.body) {
      console.error("Document body not found!");
      return;
    }
    document.body.appendChild(repairDetails);

    // 5. YOUR ORIGINAL EVENT HANDLERS (with error handling)
    const closeBtn = document.getElementById("close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        const details = document.querySelector(".repair-details");
        if (details) details.remove();
        document.body.classList.remove("noscroll");
      });
    }

    const callBtn = document.getElementById("call");
    if (callBtn) {
      callBtn.addEventListener("click", () => {
        window.open("https://web.whatsapp.com/", "_blank");
        
        const details = document.querySelector(".repair-details");
        if (details) details.remove();

        // YOUR ORIGINAL REVIEW CODE
        const review = document.createElement("div");
        review.className = "repair-review";
        review.innerHTML = `
          <img id='check' src='Logos/check.png' alt="Checkmark"/>
          <h2>Thanks for reaching out</h2>
          <p>Please evaluate our service</p>
          <div class="stars">
            ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}">★</span>`).join("")}
          </div>
          <button id='submit'>Submit</button>
        `;
        
        document.body.appendChild(review);
        setupStarRating(); // Your original function
      });
    }

  } catch (error) {
    console.error("Error in showDetails:", error);
    document.body.classList.remove("noscroll");
  }
}

// YOUR ORIGINAL STAR FUNCTIONS (keep exactly as you had them)
function setupStarRating() {
  const stars = document.querySelectorAll(".star");
  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener("mouseover", function() {
      const value = parseInt(this.getAttribute("data-value"));
      highlightStars(value);
    });

    star.addEventListener("mouseout", function() {
      highlightStars(selectedRating);
    });

    star.addEventListener("click", function() {
      selectedRating = parseInt(this.getAttribute("data-value"));
      highlightStars(selectedRating);
    });
  });

  function highlightStars(count) {
    stars.forEach((star) => {
      star.classList.toggle("active", 
        parseInt(star.getAttribute("data-value")) <= count
      );
    });
  }
}
document.addEventListener("click", function(event) {
  if (event.target.id === "submit") {
    const review = document.querySelector(".repair-review");
    if (review) review.remove();
    document.body.classList.remove("noscroll");
  }
});
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Optional: for half stars
  const emptyStars = 5 - fullStars - halfStar; // Adjust if using half stars
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) starsHtml += '★'; // Or an img tag
  // Add half star logic if needed
  for (let i = 0; i < emptyStars; i++) starsHtml += '☆'; // Or an empty star img
  return starsHtml;
}
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkModeKey = 'darkModeEnabled';

// Function to enable dark mode
function enableDarkMode() {
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

function forwardBilling(url){
  window.location.href=url;
}