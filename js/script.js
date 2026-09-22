// =====================================================
// STUDENT RESULT & QUIZ PORTAL
// COMPLETE JAVASCRIPT
// =====================================================


document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // LOGIN SYSTEM
    // =================================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const username =
                    document
                        .getElementById("username")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value
                        .trim();


                const rememberElement =
                    document.getElementById("remember");


                const remember =
                    rememberElement
                        ? rememberElement.checked
                        : false;


                const oldMessage =
                    document.querySelector(
                        ".login-message"
                    );


                if (oldMessage) {
                    oldMessage.remove();
                }


                // Empty field validation
                if (
                    username === "" ||
                    password === ""
                ) {

                    showLoginMessage(
                        "Please enter username and password.",
                        "error"
                    );

                    return;
                }


                // -----------------------------------------
                // GET REGISTERED STUDENT DATA
                // -----------------------------------------

                const savedStudent =
                    JSON.parse(
                        localStorage.getItem(
                            "studentData"
                        )
                    );


                let loginSuccessful = false;


                // -----------------------------------------
                // LOGIN USING REGISTERED EMAIL
                // -----------------------------------------

                if (savedStudent) {

                    if (
                        username === savedStudent.email &&
                        password === savedStudent.password
                    ) {

                        loginSuccessful = true;

                    }

                }


                // -----------------------------------------
                // DEMO LOGIN
                // -----------------------------------------

                if (
                    username === "student" &&
                    password === "123456"
                ) {

                    loginSuccessful = true;

                }


                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                if (loginSuccessful) {

                    localStorage.setItem(
                        "studentLoggedIn",
                        "true"
                    );


                    if (savedStudent) {

                        localStorage.setItem(
                            "studentUsername",
                            savedStudent.fullName
                        );

                    } else {

                        localStorage.setItem(
                            "studentUsername",
                            "Student"
                        );

                    }


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


                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        1000
                    );

                }

                // -----------------------------------------
                // INVALID LOGIN
                // -----------------------------------------

                else {

                    showLoginMessage(
                        "Invalid email/username or password.",
                        "error"
                    );

                }

            }
        );

    }


    // =================================================
    // DASHBOARD - LOAD STUDENT DATA
    // =================================================

    loadStudentDashboard();


    // =================================================
    // REGISTRATION SYSTEM
    // =================================================

    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const fullName =
                    document
                        .getElementById("fullName")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById("phone")
                        .value
                        .trim();


                const course =
                    document
                        .getElementById("course")
                        .value;


                const semester =
                    document
                        .getElementById("semester")
                        .value;


                const password =
                    document
                        .getElementById(
                            "registerPassword"
                        )
                        .value;


                const confirmPassword =
                    document
                        .getElementById(
                            "confirmPassword"
                        )
                        .value;


                const terms =
                    document
                        .getElementById("terms")
                        .checked;


                const message =
                    document.getElementById(
                        "registerMessage"
                    );


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

                if (fullName.length < 3) {

                    showRegisterMessage(
                        "Please enter a valid full name.",
                        "error"
                    );

                    return;

                }


                // Email validation
                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showRegisterMessage(
                        "Please enter a valid email address.",
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


                if (course === "") {

                    showRegisterMessage(
                        "Please select your course.",
                        "error"
                    );

                    return;

                }


                if (semester === "") {

                    showRegisterMessage(
                        "Please select your semester.",
                        "error"
                    );

                    return;

                }


                if (password.length < 6) {

                    showRegisterMessage(
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    return;

                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showRegisterMessage(
                        "Passwords do not match.",
                        "error"
                    );

                    return;

                }


                if (!terms) {

                    showRegisterMessage(
                        "Please accept the terms and conditions.",
                        "error"
                    );

                    return;

                }


                // -----------------------------------------
                // STUDENT DATA
                // -----------------------------------------

                const studentData = {

                    fullName: fullName,

                    email: email,

                    phone: phone,

                    course: course,

                    semester: semester,

                    password: password

                };


                // -----------------------------------------
                // SAVE DATA
                // -----------------------------------------

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(studentData)
                );


                // -----------------------------------------
                // SUCCESS MESSAGE
                // -----------------------------------------

                showRegisterMessage(
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );

            }
        );

    }


    // =================================================
    // QUIZ SYSTEM
    // =================================================

    const quizForm =
        document.getElementById("quizForm");


    if (quizForm) {

        quizForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const correctAnswers = {

                    q1: "a",

                    q2: "b",

                    q3: "c",

                    q4: "b",

                    q5: "c"

                };


                let score = 0;

                let attempted = 0;


                for (
                    let question in correctAnswers
                ) {

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
                    (score / totalQuestions) *
                    100;


                let message = "";


                if (percentage === 100) {

                    message =
                        "Excellent! Perfect Score 🎉";

                }

                else if (percentage >= 80) {

                    message =
                        "Great job! Keep it up 👍";

                }

                else if (percentage >= 60) {

                    message =
                        "Good attempt! Keep practicing.";

                }

                else {

                    message =
                        "Keep learning and try again.";

                }


                const resultBox =
                    document.getElementById(
                        "quizResult"
                    );


                if (resultBox) {

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
                            <strong>
                                ${attempted}
                            </strong>
                            out of
                            <strong>
                                ${totalQuestions}
                            </strong>
                            questions.
                        </p>

                        <p>
                            Percentage:
                            <strong>
                                ${percentage}%
                            </strong>
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


                    resultBox.style.display =
                        "block";


                    resultBox.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }

});


// =====================================================
// LOGIN MESSAGE
// =====================================================

function showLoginMessage(
    message,
    type
) {

    const loginCard =
        document.querySelector(
            ".login-card"
        );


    if (!loginCard) {
        return;
    }


    const oldMessage =
        loginCard.querySelector(
            ".login-message"
        );


    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement(
            "div"
        );


    messageBox.className =
        "login-message " + type;


    messageBox.textContent =
        message;


    const form =
        document.getElementById(
            "loginForm"
        );


    if (form) {

        loginCard.insertBefore(
            messageBox,
            form
        );

    }

}


// =====================================================
// FORGOT PASSWORD
// =====================================================

function showForgotMessage() {

    alert(
        "For this demo project, please contact the administrator to reset your password."
    );

}


// =====================================================
// REGISTRATION MESSAGE
// =====================================================

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


    message.textContent =
        messageText;


    message.className =
        "register-message " + type;

}


// =====================================================
// LOAD STUDENT DASHBOARD
// =====================================================

function loadStudentDashboard() {

    const studentData =
        JSON.parse(
            localStorage.getItem(
                "studentData"
            )
        );


    // If no registered student
    if (!studentData) {

        return;

    }


    // -----------------------------------------
    // WELCOME SECTION
    // -----------------------------------------

    const studentName =
        document.getElementById(
            "studentName"
        );


    const studentCourse =
        document.getElementById(
            "studentCourse"
        );


    const studentSemester =
        document.getElementById(
            "studentSemester"
        );


    const studentEmail =
        document.getElementById(
            "studentEmail"
        );


    if (studentName) {

        studentName.textContent =
            studentData.fullName;

    }


    if (studentCourse) {

        studentCourse.textContent =
            studentData.course;

    }


    if (studentSemester) {

        studentSemester.textContent =
            studentData.semester;

    }


    if (studentEmail) {

        studentEmail.textContent =
            studentData.email;

    }


    // -----------------------------------------
    // PROFILE CARD
    // -----------------------------------------

    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileCourse =
        document.getElementById(
            "profileCourse"
        );


    const profileSemester =
        document.getElementById(
            "profileSemester"
        );


    if (profileName) {

        profileName.textContent =
            studentData.fullName;

    }


    if (profileCourse) {

        profileCourse.textContent =
            studentData.course;

    }


    if (profileSemester) {

        profileSemester.textContent =
            studentData.semester;

    }


    // -----------------------------------------
    // FULL INFORMATION CARD
    // -----------------------------------------

    const infoName =
        document.getElementById(
            "infoName"
        );


    const infoEmail =
        document.getElementById(
            "infoEmail"
        );


    const infoPhone =
        document.getElementById(
            "infoPhone"
        );


    const infoCourse =
        document.getElementById(
            "infoCourse"
        );


    const infoSemester =
        document.getElementById(
            "infoSemester"
        );


    if (infoName) {

        infoName.textContent =
            studentData.fullName;

    }


    if (infoEmail) {

        infoEmail.textContent =
            studentData.email;

    }


    if (infoPhone) {

        infoPhone.textContent =
            studentData.phone;

    }


    if (infoCourse) {

        infoCourse.textContent =
            studentData.course;

    }


    if (infoSemester) {

        infoSemester.textContent =
            studentData.semester;

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logoutStudent() {

    localStorage.removeItem(
        "studentLoggedIn"
    );


    localStorage.removeItem(
        "studentUsername"
    );


    window.location.href =
        "login.html";

}
