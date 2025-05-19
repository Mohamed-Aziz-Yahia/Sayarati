document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("search-bar");
  const repairContainer = document.getElementById("repair-container");
  const addBreakdownBtn = document.getElementById("add-breakdown");
  const removeBreakdownBtn = document.getElementById("remove-breakdown");
  const breakdownFormContainer = document.getElementById(
    "breakdown-form-container"
  );
  const cancelFormBtn = document.getElementById("cancel-form");
  const breakdownForm = document.getElementById("breakdown-form");
  const body = document.body;

  let allRepairShops = []; // To store the fetched repair shops
  // Function to render repair shops
  function renderRepairShops(shops) {
    repairContainer.innerHTML = ""; // Clear existing content
    const logoStyles =
      "width: 60px; height: 60px; margin-right: 4px; vertical-align: middle; border-radius: 3px;";

    shops.forEach((shop) => {
      const shopDiv = document.createElement("div");
      shopDiv.classList.add("repair-item");
      shopDiv.setAttribute("data-id", shop.id);
      shopDiv.onclick = function () {
        showDetails(this, shop); // Pass the shop object to showDetails
      };

      const image = document.createElement("img");
      image.classList.add("repair-image");
      image.src = shop.image || "images/default-profile.png";
      image.alt = shop.name;
      shopDiv.appendChild(image);

      const nameHeading = document.createElement("h2");
      nameHeading.textContent = shop.name;
      shopDiv.appendChild(nameHeading);

      const contactParagraph = document.createElement("p");
      contactParagraph.textContent = shop.contact_info || "No contact info";
      shopDiv.appendChild(contactParagraph);

      const locationParagraph = document.createElement("p");
      locationParagraph.textContent = shop.location || "No location";
      shopDiv.appendChild(locationParagraph);

      const ratingDiv = document.createElement("div");
      ratingDiv.classList.add("repair-rating");

      // Extract values from array
      const [averageRating, ownerId] = shop.average_rating || [0, null]; // Destructure with fallback

      ratingDiv.innerHTML = `
  <div class="rating-container">
    <span class="stars">${generateStars(averageRating)}</span>
    <span class="rating-value">
      ${averageRating}
    </span>
    <input type="hidden" class="owner-id" value="${ownerId}">
  </div>
`;

      shopDiv.appendChild(ratingDiv);

      const servicesDiv = document.createElement("div");
      servicesDiv.classList.add("repair-services");
      const servicesArray = [];
      if (shop.services === "repairing" || shop.services === "both") {
        servicesArray.push("repairing");
      }
      if (shop.services === "towing" || shop.services === "both") {
        servicesArray.push("towing");
      }
      servicesArray.forEach((service) => {
        const img = document.createElement("img");
        img.src = `./Logos/${service}-icon.png`;
        img.alt = service;
        img.style.cssText = logoStyles;
        servicesDiv.appendChild(img);
      });
      shopDiv.appendChild(servicesDiv);

      repairContainer.appendChild(shopDiv);
    });
  }

  // Fetch all repair shops on page load
  fetch("https://sayarati-production.up.railway.app/api/repairshops/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      allRepairShops = data;
      renderRepairShops(allRepairShops);
    })
    .catch((error) => {
      console.error("Error fetching repair shops:", error);
      repairContainer.innerHTML = "<p>Failed to load repair shops.</p>";
    });

  function handleSearch(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm === "") {
      renderRepairShops(allRepairShops);
      return;
    }

    const filtered = allRepairShops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchTerm) ||
        (shop.location && shop.location.toLowerCase().includes(searchTerm)) ||
        (shop.contact_info &&
          shop.contact_info.toLowerCase().includes(searchTerm)) ||
        (shop.service_type &&
          shop.service_type.toLowerCase().includes(searchTerm))
    );
    renderRepairShops(filtered);
  }

  if (searchBar) {
    searchBar.addEventListener("input", handleSearch);
  }

  if (addBreakdownBtn) {
    addBreakdownBtn.addEventListener("click", function () {
      body.classList.add("show-form");
      breakdownFormContainer.style.display = "block";
    });
  }

  if (cancelFormBtn) {
    cancelFormBtn.addEventListener("click", function () {
      breakdownFormContainer.style.display = "none";
      body.classList.remove("show-form");
      breakdownForm.reset();
    });
  }

  if (breakdownForm && repairContainer) {
    breakdownForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const shopNameInput = document.getElementById("shop-name");
      const shopPhoneInput = document.getElementById("shop-phone");
      const shopCityInput = document.getElementById("shop-city");
      const servicesCheckboxes = document.querySelectorAll(
        '#breakdown-form input[name="service"]:checked'
      );
      const shopImageInput = document.getElementById("shop-image");

      const shopName = shopNameInput.value.trim();
      const shopPhone = shopPhoneInput.value.trim();
      const shopCity = shopCityInput.value.trim();
      const selectedServices = Array.from(servicesCheckboxes).map(
        (checkbox) => checkbox.value
      );
      const shopImageFile = shopImageInput.files[0];

      if (!shopName || !shopPhone || !shopCity) {
        alert("Please fill in the shop name, phone number, and city.");
        return;
      }

      let backendServiceType = "";
      if (
        selectedServices.includes("repair") &&
        selectedServices.includes("towing")
      ) {
        backendServiceType = "both";
      } else if (selectedServices.includes("repair")) {
        backendServiceType = "repair";
      } else if (selectedServices.includes("towing")) {
        backendServiceType = "towing";
      }
    });
  }

  function generateStars(rating) {
    const numericRating = Number(rating) || 0;
    const rounded = Math.round(numericRating);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  }
  let selectedShopId = null;
  function showDetails(item, shopData) {
    selectedShopId = item.getAttribute("data-id");
    try {
      document.body.classList.add("noscroll");

      const name = shopData.name || "Unknown Shop";
      const phoneNum = shopData.contact_info || "No phone";
      const city = shopData.location || "Unknown City";
      const ratingValue = shopData.average_rating || 0;
      const imageSrc = shopData.image || "images/default-profile.png";
      const services = [];
      if (
        shopData.services === "repairing" ||
        shopData.services === "both"
      )
        services.push("repairing");
      if (
        shopData.services === "towing" ||
        shopData.services === "both"
      )
        services.push("towing");

      function serviceText(servicesArray) {
        if (servicesArray.length === 1)
          return (
            servicesArray[0].charAt(0).toUpperCase() + servicesArray[0].slice(1)
          );
        if (servicesArray.length === 2)
          return servicesArray
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(", ");
        return "Various services";
      }
      const repairDetails = document.createElement("div");
      repairDetails.className = "repair-details";
      repairDetails.innerHTML = `
          <button id='close'><img src="./Logos/close.png" alt="Close"/></button>
          <div id='details-content'>
            <img id='profile-img' src="${imageSrc}" alt="${name}"/>
            <div>
              <p>Name: ${name}</p>
              <p>Phone: ${phoneNum}</p>
              <p>Location: ${city}</p>
              <p>Services: ${serviceText(services)}</p>
              <div id='rating'>Rating: ${generateStars(ratingValue)}</div>
            </div>
          </div>
          <button id='call'><img src="./Logos/phone.png"/>Contact</button>
        `;

      if (!document.body) {
        console.error("Document body not found!");
        return;
      }
      document.body.appendChild(repairDetails);

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
          window.open(
            `https://web.whatsapp.com/send?phone=${phoneNum}`,
            "_blank"
          );
          const details = document.querySelector(".repair-details");
          if (details) details.remove();
          const review = document.createElement("div");
          review.className = "repair-review";
          review.innerHTML = `
          <img id='check' src='Logos/check.png' alt="Checkmark"/>
          <h2>Thanks for reaching out</h2>
          <p>Please evaluate our service</p>
          <div class="stars">
            ${[1, 2, 3, 4, 5]
              .map((i) => `<span class="star" data-value="${i}">★</span>`)
              .join("")}
          </div>
          <button id='submit'>Submit</button>
        `;

          document.body.appendChild(review);
          setupStarRating();
        });
      }
    } catch (error) {
      console.error("Error in showDetails:", error);
      document.body.classList.remove("noscroll");
    }
  }
  function setupStarRating() {
    const stars = document.querySelectorAll(".star");
    const submitBtn = document.getElementById("submit"); // Get submit button
    let selectedRating = 0;

    // Star hover/click logic (unchanged)
    stars.forEach((star) => {
      star.addEventListener("mouseover", function () {
        const value = parseInt(this.getAttribute("data-value"));
        highlightStars(value);
      });

      star.addEventListener("mouseout", function () {
        highlightStars(selectedRating);
      });

      star.addEventListener("click", function () {
        selectedRating = parseInt(this.getAttribute("data-value"));
        highlightStars(selectedRating);
      });
    });

    // Submit button logic
    submitBtn.addEventListener("click", async () => {
      if (selectedRating === 0) {
        alert("Please select a rating before submitting!");
        return;
      }
      const token = localStorage.getItem("authToken"); // Replace with your token key
      if (!token) {
        alert("You must be logged in to submit a rating!");
        window.location.href = "/login"; // Redirect if no token
        return;
      }
      try {
        // Replace `1` with the actual repair shop ID (dynamic value)
        const data = {
          repair_shop: parseInt(selectedShopId), // Hardcoded for now; replace with dynamic ID
          rating: selectedRating,
        };

        const response = await fetch("https://sayarati-production.up.railway.app/api/reviews/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Include token
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert("Rating submitted successfully!");
          const review = document.querySelector(".repair-review");
          if (review) review.remove();
          document.body.classList.remove("noscroll");
        } else {
          throw new Error("Failed to submit rating");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating. Please try again.");
      }
    });

    function highlightStars(count) {
      stars.forEach((star) => {
        star.classList.toggle(
          "active",
          parseInt(star.getAttribute("data-value")) <= count
        );
      });
    }
  }
  document.addEventListener("click", function (event) {
    if (event.target.id === "submit") {
      const review = document.querySelector(".repair-review");
      if (review) review.remove();
      document.body.classList.remove("noscroll");
    }
  });
  // ... (rest of your existing JavaScript for dark mode and billing forward) ...
  const darkModeToggle = document.getElementById("darkModeToggle");
  const bodyElement = document.body;
  const darkModeKey = "darkModeEnabled";

  function enableDarkMode() {
    bodyElement.classList.add("dark-mode");
    localStorage.setItem(darkModeKey, "true");
  }

  function disableDarkMode() {
    bodyElement.classList.remove("dark-mode");
    localStorage.setItem(darkModeKey, "false");
  }

  const isDarkModeEnabled = localStorage.getItem(darkModeKey) === "true";
  if (isDarkModeEnabled) {
    enableDarkMode();
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      if (bodyElement.classList.contains("dark-mode")) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    });
  }

  function forwardBilling(url) {
    window.location.href = url;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the form and its elements
  const breakdownForm = document.getElementById("breakdown-form");
  const shopNameInput = document.getElementById("shop-name");
  const shopPhoneInput = document.getElementById("shop-phone");
  const shopCityInput = document.getElementById("shop-city");
  const servicesCheckboxes = breakdownForm.querySelectorAll(
    'input[name="service"]'
  );
  const shopImageInput = document.getElementById("shop-image");
  const cancelButton = document.getElementById("cancel-form"); // Get cancel button
  function getCurrentUserId() {
  // Get the user ID JSON string from localStorage using the key "userID".
  const userIdJson = localStorage.getItem("userID");

  // Check if the item exists in localStorage.
  if (userIdJson) {
    try {
      // Attempt to parse the JSON string back into a JavaScript value.
      const userId = JSON.parse(userIdJson);

      // Basic check to ensure the parsed value is not null or undefined.
      if (userId !== null && userId !== undefined) {
        // Return the successfully parsed user ID.
        return userId;
      }
    } catch (e) {
      // Log any errors that occur during JSON parsing.
      console.error("Error parsing user ID from localStorage:", e);
      // Return null if parsing fails.
      return null;
    }
  }

  // If the "userID" item is not found in localStorage, log a warning.
  console.warn("User ID not found in localStorage under key 'userID'.");
  // Return null if the item is not found or is empty.
  return null;
}
function hasUserAlreadyCreatedShop(userId) {
  if (!userId) return false; // Can't check without a user ID
  return localStorage.getItem(`user_${userId}_hasShop`) === "true";
}

function markUserHasCreatedShop(userId) {
  if (userId) {
    localStorage.setItem(`user_${userId}_hasShop`, "true");
  }
}

function disableShopCreationUI(message = "You have already registered a shop.") {
  if (breakdownForm) {
    // Hide the form or disable its inputs
    breakdownForm.style.display = "none";
    // Or disable all form elements:
    // Array.from(breakdownForm.elements).forEach(element => element.disabled = true);
  }
  let statusMessageDiv = document.getElementById("shopCreationStatusMessage");
  if (!statusMessageDiv) {
    // Create a div to show the message if it doesn't exist
    statusMessageDiv = document.createElement("div");
    statusMessageDiv.id = "shopCreationStatusMessage";
    statusMessageDiv.style.color = "red";
    statusMessageDiv.style.fontWeight = "bold";
    // Insert it before the form or at a suitable place
    breakdownForm.parentNode.insertBefore(statusMessageDiv, breakdownForm);
  }
  statusMessageDiv.innerText = message;
}
 const currentUserId = getCurrentUserId();
  if (currentUserId && hasUserAlreadyCreatedShop(currentUserId)) {
    disableShopCreationUI();
  }
});

// --- Existing form submission logic with new checks ---
if (breakdownForm) {
  breakdownForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const currentUserId = getCurrentUserId();

    // --- NEW: Frontend check before attempting to send the request ---
    if (currentUserId && hasUserAlreadyCreatedShop(currentUserId)) {
      alert("You have already registered a shop and cannot create another one.");
      disableShopCreationUI(); // Ensure UI is disabled
      return; // Stop the form submission
    }

    // Collect data from text inputs
    const shopName = shopNameInput.value.trim();
    const shopPhone = shopPhoneInput.value.trim();
    const shopCity = shopCityInput.value.trim();
    // Determine selected service type(s) from checkboxes
    let serviceType = "";
    const selectedServices = [];
    servicesCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedServices.push(checkbox.value);
      }
    });

    // Map selected services to the expected backend format (assuming 'repair', 'towing', 'both')
    if (
      selectedServices.includes("repairing") &&
      selectedServices.includes("towing")
    ) {
      serviceType = "both";
    } else if (selectedServices.includes("repairing")) {
      serviceType = "repairing";
    } else if (selectedServices.includes("towing")) {
      serviceType = "towing";
    }
    // If no service is selected, serviceType remains '' or you could set it to null/undefined

    // Get the selected image file
    const shopImageFile = shopImageInput.files[0]; // Get the first selected file

    // Basic validation
    if (!shopName || !shopPhone || !shopCity || !serviceType) {
      alert(
        "Please fill in all required fields (Shop Name, Phone, City, and select at least one Service)."
      );
      return;
    }

    // Create a FormData object to send the data, especially for the file upload
    const formData = new FormData();
    formData.append("name", shopName);
    formData.append("contact_info", shopPhone); // Assuming contact_info is the phone number
    formData.append("location", shopCity); // Assuming location is just the city for now
    formData.append("services", serviceType);

    // Append the image file if one was selected
    if (shopImageFile) {
      formData.append("profile_image", shopImageFile); // Use the field name your backend expects for the image
    }

    // --- Authentication Token ---
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication token not found. Please log in.");
      window.location.href = "./login.html";
      return;
    }

    // --- Send the data using Fetch ---
    const backendUrl = "https://sayarati-production.up.railway.app/api/repairshops/";

    fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Token ${authToken}`,
      },
      body: formData,
    })
      .then((response) => {
        // --- NEW: If backend says user already created, update frontend and stop ---
        if (response.status === 400 || response.status === 403 || response.status === 409) {
            // These status codes are common for "Bad Request", "Forbidden", or "Conflict"
            // The backend should ideally send a specific message indicating the limit.
            return response.json().then(errorData => {
                // Look for common phrases from backend or specific error fields
                if (JSON.stringify(errorData).includes("already has a shop") || JSON.stringify(errorData).includes("limit exceeded")) {
                    alert("You have already registered a shop and cannot create another one.");
                    markUserHasCreatedShop(currentUserId); // Mark even if backend rejected
                    disableShopCreationUI();
                    throw new Error("User limit reached (handled by frontend)."); // Stop the promise chain
                }
                throw new Error(`Server Error: ${response.status}. ${JSON.stringify(errorData)}`); // Re-throw if not the specific error
            }).catch(e => {
                // Catch JSON parsing errors for 4xx responses that might not be JSON
                if (e.message !== "User limit reached (handled by frontend).") {
                     alert(`Failed to add shop: ${response.status} - Could not parse error details.`);
                }
                throw e; // Re-throw for general error handling below
            });
        }


        if (!response.ok) {
          return response
            .json()
            .then((errorData) => {
              let errorMessage = `Failed to add shop: ${response.status}`;
              if (errorData) {
                for (const field in errorData) {
                  if (errorData.hasOwnProperty(field)) {
                    const fieldErrors = Array.isArray(errorData[field])
                      ? errorData[field].join(", ")
                      : errorData[field];
                    errorMessage += `\n${field}: ${fieldErrors}`;
                  }
                }
              } else {
                errorMessage += ` - Something went wrong (No error details from server)`;
              }
              throw new Error(errorMessage);
            })
            .catch(() => {
              throw new Error(
                `Failed to add shop: ${response.status} - Could not parse error details.`
              );
            });
        }
        return response.json();
      })
      .then((newShopData) => {
        alert("Breakdown shop added successfully!");
        // --- NEW: Mark that the user has now created a shop (INSECURE as primary method) ---
        markUserHasCreatedShop(currentUserId);
        disableShopCreationUI("Shop registered successfully!"); // Update UI after success

        // Optionally close the form or redirect
        // window.location.reload(); // Example: refresh the page to see the new shop
      })
      .catch((error) => {
        console.error("Error adding shop:", error);
        // Only show alert if it wasn't the "User limit reached" error handled above
        if (!error.message.includes("User limit reached")) {
            alert("Error adding breakdown shop: " + error.message);
        }
      });
  });
}
