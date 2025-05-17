document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("form");
  const emailInput = loginForm.querySelector('input[type="text"]');
  const passwordInput = loginForm.querySelector('input[type="password"]');
  const loginButton = loginForm.querySelector(".login-btn");

  if (loginButton) {
    loginButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default form submission

      const username = emailInput.value.trim(); // Assuming the "Email" input is used for username
      const password = passwordInput.value.trim();

      if (!username || !password) {
        alert("Please enter your username and password.");
        return;
      }

      const loginData = {
        username: username,
        password: password,
      };

      fetch("http://localhost:8000/api/login/", {
        // The endpoint you provided
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (!response.ok) {
            // Handle non-2xx responses (e.g., invalid credentials)
            return response.json().then((errorData) => {
              throw new Error(
                `Login failed: ${response.status} - ${
                  errorData?.message || "Invalid credentials"
                }`
              );
            });
          }
          return response.json(); // Parse the successful response JSON
        })
        .then((data) => {
          // Handle the successful login response
          console.log("Login successful:", data);
          const token = data.token;
          const user = data.username;
          const userID= data.user_id;
          // Store the token in local storage or a cookie for future requests
          localStorage.setItem("authToken", token);
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          localStorage.setItem("userID", JSON.stringify(userID));
          // Redirect the user to a logged-in page (replace '/dashboard' with your actual page)
          window.location.href = './main.html';
        })
        .catch((error) => {
          console.error("Login error:", error);
          alert(error.message); // Display the error message to the user
        });
    });
  }
});
