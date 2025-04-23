// Main function to load and display sellers
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // 1. Fetch all sellers from backend
    const response = await fetch('https://your-backend-api.com/api/sellers');
    if (!response.ok) throw new Error('Failed to fetch sellers');
    const sellers = await response.json();

    // 2. Render all sellers
    renderSellers(sellers);

  } catch (error) {
    console.error('Error loading sellers:', error);
    showError();
  }
});

// Function to render all sellers
function renderSellers(sellers) {
  const container = document.getElementById('repair-container');
  container.innerHTML = sellers.map(seller => `
    <div class="repair-item" data-id="${seller.id}" onclick="showDetails(${JSON.stringify(seller).replace(/"/g, '&quot;')})">
      <img src="${seller.image || 'images/default-profile.png'}" alt="${seller.name}">
      <h2>${seller.name}</h2>
      <p>${seller.phone}</p>
      <div class="repair-rating">
        ${generateStars(seller.rating)}
        <span class="rating-value">${seller.rating.toFixed(1)}</span>
      </div>
      <div class="repair-services">
        ${seller.services.map(service => 
          `<img src="Logos/${service}-icon.png" alt="${service}">`
        ).join('')}
      </div>
    </div>
  `).join('');
}

// Star rating generator
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) stars += '<img src="Logos/star.png" alt="★">';
  if (hasHalfStar) stars += '<img src="Logos/star-half.png" alt="½">';
  for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) {
    stars += '<img src="Logos/star-empty.png" alt="☆">';
  }
  return stars;
}

// Error display
function showError() {
  document.getElementById('repair-container').innerHTML = `
    <div class="error-message">
      Failed to load sellers. Please try again later.
    </div>
  `;
}

// Seller details display
function showDetails(sellerData) {
  // Convert stringified data back to object if needed
  const seller = typeof sellerData === 'string' ? JSON.parse(sellerData) : sellerData;
  
  document.body.classList.add("noscroll");
  
  const repairDetails = document.createElement("div");
  repairDetails.classList.add("repair-details");
  repairDetails.innerHTML = `
    <button id='close'><img src="./Logos/close.png" alt="Close"/></button>
    <div id='details-content'>
      <img id='profile-img' src="${seller.image || './images/default-profile.png'}" alt="${seller.name}"/>
      <div>
        <p>Name: ${seller.name}</p>
        <p>Phone Number: ${seller.phone}</p>
        <p>Working hours: 8:00am-5:00pm</p>
        <p>Working days: Sunday-Thursday</p>
        <p>Services: ${formatServices(seller.services)}</p>
        <div id='rating'>Rating: ${generateStars(seller.rating)} <span>${seller.rating.toFixed(1)}/5</span></div>
      </div>
    </div>
    <div id='buttons'>
      <button id='call'><img src="./Logos/phone.png" alt="Phone"/>Contact</button>
      // <button id='available'><img src="./Logos/back-in-time.png" alt="Clock"/>Available after 32min</button>
    </div>
    // <button id='automatic-call'>Contact after time ends automatically</button>
  `;

  document.body.appendChild(repairDetails);

  // Event listeners
  document.getElementById("close").addEventListener("click", closeDetails);
  document.getElementById("call").addEventListener("click", () => startReviewProcess(seller));
}

// Helper functions
function formatServices(services) {
  const serviceNames = {
    'car-repair': 'Car Repair',
    'car-breakdown': 'Car Breakdown',
  };
  return services.map(service => serviceNames[service] || service).join(', ');
}

function closeDetails() {
  document.querySelector(".repair-details")?.remove();
  document.body.classList.remove("noscroll");
}

function startReviewProcess(seller) {
  window.open(`https://wa.me/${seller.phone.replace(/\D/g, '')}`, "_blank");
  closeDetails();

  const review = document.createElement("div");
  review.classList.add("repair-review");
  review.innerHTML = `
    <img id='check' src='Logos/check.png' alt="Checkmark"/>
    <h2>Thanks for reaching out to us</h2>
    <p>Please evaluate our service</p>
    <div class="stars">
      ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}">★</span>`).join('')}
    </div>
    <button id='submit'>Submit</button>
  `;

  document.body.appendChild(review);
  setupStarRating(seller.id);
}

function setupStarRating(sellerId) {
  let selectedRating = 0;
  const stars = document.querySelectorAll(".star");

  stars.forEach(star => {
    star.addEventListener("click", function() {
      selectedRating = parseInt(this.getAttribute("data-value"));
      highlightStars(selectedRating);
    });
  });

  document.getElementById("submit").addEventListener("click", async () => {
    if (selectedRating > 0) {
      await submitRating(sellerId, selectedRating);
      document.querySelector(".repair-review")?.remove();
      document.body.classList.remove("noscroll");
    } else {
      alert("Please select a rating");
    }
  });
}

async function submitRating(sellerId, rating) {
  try {
    await fetch('https://your-backend-api.com/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId, rating })
    });
  } catch (error) {
    console.error("Rating submission failed:", error);
  }
}

function highlightStars(count) {
  document.querySelectorAll(".star").forEach(star => {
    star.classList.toggle("active", 
      parseInt(star.getAttribute("data-value")) <= count
    );
  });
}