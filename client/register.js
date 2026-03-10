const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    const password = document.getElementById("password").value;

    // Simple temporary check: if email and password are filled
    if (email && password) {
        alert("Registration successful");
        window.location.href = "login.html"; // redirect to login
    } else {
        alert("Registration failed");
    }
});
