function showDetails(item) {
  document.body.classList.add("noscroll");
  const name = item.querySelector("h2").textContent;
  const phoneNum = item.querySelector("p").textContent;
  const rating = item.querySelectorAll(".repair-rating img").length;
  const services = item.querySelectorAll(".repair-services img").length;
  const image = item.querySelector("img").src;
  function createRating(rating) {
    let starsHtml = "<div>";
    for (let i = 0; i < rating; i++) {
      starsHtml += `<img src="./Logos/star.png" alt="star"/>`;
    }
    starsHtml += "</div>";
    return starsHtml;
  }

  function service(services) {
    if (services === 1) {
      return "Car repair";
    } else if (services === 2) {
      return "Car repair, Car breakdown";
    }
  }

  const repairDetails = document.createElement("div");
  repairDetails.classList.add("repair-details");

  repairDetails.innerHTML = `
      <button id='close'><img src="./Logos/close.png"/></button>
    <div id='details-content'>
      <img id='profile-img'src="${image}"/>
      <div>
      <p>Name: ${name}</p>
      <p>Phone Number: ${phoneNum}</p>
      <p>Working hours: 8:00am-5:00pm</p>
      <p>Working days: Sunday-Thursday</p>
      <p>Services: ${service(services)}</p>
      <div id='rating'><p>Rating:${createRating(rating)}</p></div>
      </div>
    </div>
      <div id='buttons'>
        <button id='call'><img src="./Logos/phone.png"/>Contact</button>
        <button id='available'><img src="./Logos/back-in-time.png"/>Available after 32min</button>
      </div>
      <button id='automatic-call'>Contact after time ends automatically</button>
    `;

  document.body.appendChild(repairDetails);

  document.getElementById("close").addEventListener("click", () => {
    document.querySelector(".repair-details").remove();
    document.body.classList.remove("noscroll");
  });

  document.getElementById("call").addEventListener("click", () => {
    window.open("https://web.whatsapp.com/", "_blank");
    document.querySelector(".repair-details").remove();

    // Create review div
    const review = document.createElement("div");
    review.classList.add("repair-review");
    review.innerHTML = `
          <img id='check'src='Logos/check.png'/>
          <h2>Thanks for reaching out to us</h2>
          <p>Please evaluate our service</p>
          <div class="stars">
            <span class="star" data-value="1">★</span>
            <span class="star" data-value="2">★</span>
            <span class="star" data-value="3">★</span>
            <span class="star" data-value="4">★</span>
            <span class="star" data-value="5">★</span>
          </div>
          <button id='submit'>Submit</button>
      `;

    document.body.appendChild(review);

    // Initialize the star rating AFTER creating the elements
    setupStarRating();

    document.getElementById("submit").addEventListener("click", () => {
      document.querySelector(".repair-review").remove();
      document.body.classList.remove("noscroll");
    });
  });

  function setupStarRating() {
    const stars = document.querySelectorAll(".star");
    let selectedRating = 0;

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
        console.log(`User rated: ${selectedRating} stars`);
        // You can store selectedRating to use when submit is clicked
      });
    });

    function highlightStars(count) {
      stars.forEach((star) => {
        const value = parseInt(star.getAttribute("data-value"));
        if (value <= count) {
          star.classList.add("active");
        } else {
          star.classList.remove("active");
        }
      });
    }
  }
}
