// ==========================================
// STUDENT RESULT & QUIZ PORTAL
// LOGIN SYSTEM
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    // Run only when login form exists
    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const username =
                document.getElementById("username").value.trim();

            const password =
                document.getElementById("password").value.trim();

            const remember =
                document.getElementById("remember").checked;


            // Remove old message
            const oldMessage =
                document.querySelector(".login-message");

            if (oldMessage) {
                oldMessage.remove();
            }


            // Empty field validation
            if (username === "" || password === "") {

                showLoginMessage(
                    "Please enter username and password.",
                    "error"
                );

                return;
            }


            // Demo login credentials
            const demoUsername = "student";
            const demoPassword = "123456";


            // Check login
            if (
                username === demoUsername &&
                password === demoPassword
            ) {

                // Save login status
                localStorage.setItem(
                    "studentLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "studentUsername",
                    username
                );


                // Remember me
                if (remember) {

                    localStorage.setItem(
                        "rememberStudent",
                        "true"
                    );

                } else {

                    localStorage.removeItem(
                        "rememberStudent"
                    );
                }


                showLoginMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                // Redirect to dashboard
                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 1200);

            } else {

                showLoginMessage(
                    "Invalid username or password.",
                    "error"
                );
            }

        });
    }
});


// ==========================================
// LOGIN MESSAGE
// ==========================================

function showLoginMessage(message, type) {

    const loginCard =
        document.querySelector(".login-card");

    if (!loginCard) {
        return;
    }


    const messageBox =
        document.createElement("div");

    messageBox.className =
        "login-message " + type;

    messageBox.textContent = message;


    const form =
        document.getElementById("loginForm");

    loginCard.insertBefore(
        messageBox,
        form
    );
}


// ==========================================
// FORGOT PASSWORD
// ==========================================

function showForgotMessage() {

    alert(
        "For this demo project, please contact the administrator to reset your password."
    );
}
