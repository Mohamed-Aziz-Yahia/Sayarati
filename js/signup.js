document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('form');
    const emailOrPhoneInput = signupForm.querySelector('input[type="text"]');
    const passwordInput = signupForm.querySelector('input[type="password"]');
    const signupButton = document.getElementById('signup-btn');
  
    if (signupButton) {
      signupButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
  
        const emailOrPhone = emailOrPhoneInput.value.trim();
        const password = passwordInput.value.trim();
  
        if (!emailOrPhone || !password) {
          alert('Please enter your email/phone and password.');
          return;
        }
  
        // Basic check to see if it looks like an email
        let username = emailOrPhone;
        let email = '';
        if (emailOrPhone.includes('@')) {
          email = emailOrPhone;
          username = emailOrPhone.substring(0, emailOrPhone.indexOf('@')); // Extract username from email
        }
  
        const registerData = {
          username: username,
          email: email,
          password: password,
          // Ignoring 'role' as per your request
        };
  
        fetch('https://sayarati-production.up.railway.app/api/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(`Registration failed: ${response.status} - ${errorData?.message || 'Something went wrong'}`);
            });
          }
          return response.json();
        })
        .then(userData => {
          console.log('Registration successful:', userData);
          alert('Registration successful!');
          // Optionally redirect the user to the login page or another page
          window.location.href = './login.html';
        })
        .catch(error => {
          console.error('Registration error:', error);
          alert(error.message);
        });
      });
    }
  });