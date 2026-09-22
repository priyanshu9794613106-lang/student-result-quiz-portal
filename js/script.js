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
// ==========================================
// QUIZ SYSTEM
// ==========================================

const quizForm = document.getElementById("quizForm");

if (quizForm) {

    quizForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // Correct answers

        const correctAnswers = {

            q1: "a",
            q2: "b",
            q3: "c",
            q4: "b",
            q5: "c"

        };


        let score = 0;

        let attempted = 0;


        // Check answers

        for (let question in correctAnswers) {

            const selected =
                document.querySelector(
                    `input[name="${question}"]:checked`
                );


            if (selected) {

                attempted++;

                if (
                    selected.value ===
                    correctAnswers[question]
                ) {

                    score++;

                }

            }

        }


        const totalQuestions = 5;

        const percentage =
            (score / totalQuestions) * 100;


        // Result message

        let message = "";

        if (percentage === 100) {

            message =
                "Excellent! Perfect Score 🎉";

        } else if (percentage >= 80) {

            message =
                "Great job! Keep it up 👍";

        } else if (percentage >= 60) {

            message =
                "Good attempt! Keep practicing.";

        } else {

            message =
                "Keep learning and try again.";

        }


        // Display result

        const resultBox =
            document.getElementById("quizResult");


        resultBox.innerHTML = `

            <div class="result-icon">
                🏆
            </div>

            <h2>
                Quiz Completed!
            </h2>

            <div class="quiz-score">
                ${score} / ${totalQuestions}
            </div>

            <p>
                You attempted
                <strong>${attempted}</strong>
                out of
                <strong>${totalQuestions}</strong>
                questions.
            </p>

            <p>
                Percentage:
                <strong>${percentage}%</strong>
            </p>

            <h3>
                ${message}
            </h3>

            <button
                onclick="location.reload()"
                class="retry-btn"
            >
                Try Again
            </button>

        `;


        // Show result

        resultBox.style.display = "block";


        // Scroll to result

        resultBox.scrollIntoView({
            behavior: "smooth"
        });

    });

}
// ==========================================
// REGISTRATION SYSTEM
// ==========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                document.getElementById("fullName")
                .value.trim();

            const email =
                document.getElementById("email")
                .value.trim();

            const phone =
                document.getElementById("phone")
                .value.trim();

            const course =
                document.getElementById("course")
                .value;

            const semester =
                document.getElementById("semester")
                .value;

            const password =
                document.getElementById("registerPassword")
                .value;

            const confirmPassword =
                document.getElementById("confirmPassword")
                .value;

            const terms =
                document.getElementById("terms")
                .checked;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Name validation

            if (fullName.length < 3) {

                showRegisterMessage(
                    "Please enter a valid full name.",
                    "error"
                );

                return;
            }


            // Phone validation

            const phonePattern =
                /^[0-9]{10}$/;

            if (!phonePattern.test(phone)) {

                showRegisterMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                return;
            }


            // Password validation

            if (password.length < 6) {

                showRegisterMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            // Confirm password

            if (password !== confirmPassword) {

                showRegisterMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            // Terms

            if (!terms) {

                showRegisterMessage(
                    "Please accept the terms and conditions.",
                    "error"
                );

                return;
            }


            // Save demo student data

            const studentData = {

                fullName: fullName,

                email: email,

                phone: phone,

                course: course,

                semester: semester,

                password: password

            };


            localStorage.setItem(
                "studentData",
                JSON.stringify(studentData)
            );


            // Success

            showRegisterMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1500);

        }
    );
}


// ==========================================
// REGISTRATION MESSAGE
// ==========================================

function showRegisterMessage(
    messageText,
    type
) {

    const message =
        document.getElementById(
            "registerMessage"
        );

    if (!message) {
        return;
    }

    message.textContent = messageText;

    message.className =
        "register-message " + type;

}

