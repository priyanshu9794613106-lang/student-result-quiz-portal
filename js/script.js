/* =========================================================
   STUDENT RESULT & QUIZ PORTAL
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       REGISTRATION
       ===================================================== */

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const fullNameElement =
                document.getElementById("fullName");

            const emailElement =
                document.getElementById("email");

            const phoneElement =
                document.getElementById("phone");

            const courseElement =
                document.getElementById("course");

            const semesterElement =
                document.getElementById("semester");

            const passwordElement =
                document.getElementById("password");

            const confirmPasswordElement =
                document.getElementById("confirmPassword");

            const termsElement =
                document.getElementById("terms");


            /* Check required elements */

            if (
                !fullNameElement ||
                !emailElement ||
                !phoneElement ||
                !courseElement ||
                !semesterElement ||
                !passwordElement ||
                !confirmPasswordElement
            ) {

                alert(
                    "Registration form fields are missing. Please check register.html."
                );

                return;
            }


            const fullName =
                fullNameElement.value.trim();

            const email =
                emailElement.value.trim().toLowerCase();

            const phone =
                phoneElement.value.trim();

            const course =
                courseElement.value;

            const semester =
                semesterElement.value;

            const password =
                passwordElement.value;

            const confirmPassword =
                confirmPasswordElement.value;


            /* Name validation */

            const namePattern =
                /^[A-Za-z ]+$/;

            if (!namePattern.test(fullName)) {

                alert(
                    "Please enter a valid name using alphabets only."
                );

                return;
            }


            if (fullName.length < 3) {

                alert(
                    "Name must contain at least 3 characters."
                );

                return;
            }


            /* Email validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /* Phone validation */

            const phonePattern =
                /^[0-9]{10}$/;

            if (!phonePattern.test(phone)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;
            }


            /* Password validation */

            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters long."
                );

                return;
            }


            /* Confirm password */

            if (password !== confirmPassword) {

                alert(
                    "Password and Confirm Password do not match."
                );

                return;
            }


            /* Terms */

            if (termsElement && !termsElement.checked) {

                alert(
                    "Please agree to the terms and conditions."
                );

                return;
            }


            /* =================================================
               CHECK EXISTING USER
               ================================================= */

            const existingUser =
                JSON.parse(
                    localStorage.getItem("studentData")
                );


            if (
                existingUser &&
                existingUser.email === email
            ) {

                alert(
                    "An account with this email already exists. Please login."
                );

                window.location.href =
                    "login.html";

                return;
            }


            /* =================================================
               SAVE STUDENT
               ================================================= */

            const studentData = {

                id:
                    "STU-" +
                    Date.now(),

                fullName:
                    fullName,

                email:
                    email,

                phone:
                    phone,

                course:
                    course,

                semester:
                    semester,

                password:
                    password,

                registeredAt:
                    new Date().toLocaleString()

            };


            localStorage.setItem(
                "studentData",
                JSON.stringify(studentData)
            );


            /* =================================================
               CREATE STATISTICS ENTRY
               ================================================= */

            let registeredStudents =
                JSON.parse(
                    localStorage.getItem(
                        "registeredStudents"
                    )
                ) || [];


            registeredStudents.push({

                id:
                    studentData.id,

                name:
                    studentData.fullName,

                email:
                    studentData.email,

                registeredAt:
                    studentData.registeredAt

            });


            localStorage.setItem(
                "registeredStudents",
                JSON.stringify(
                    registeredStudents
                )
            );


            /* =================================================
               SUCCESS
               ================================================= */

            alert(
                "Registration successful! Please login to continue."
            );


            window.location.href =
                "login.html";

        });

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const usernameElement =
                    document.getElementById("username");

                const passwordElement =
                    document.getElementById("password");

                const rememberElement =
                    document.getElementById("remember");


                if (
                    !usernameElement ||
                    !passwordElement
                ) {

                    alert(
                        "Login fields are missing. Please check login.html."
                    );

                    return;
                }


                const username =
                    usernameElement.value.trim().toLowerCase();

                const password =
                    passwordElement.value;


                if (
                    username === "" ||
                    password === ""
                ) {

                    showLoginMessage(
                        "Please enter username/email and password.",
                        "error"
                    );

                    return;
                }


                /* Get registered student */

                const studentData =
                    JSON.parse(
                        localStorage.getItem(
                            "studentData"
                        )
                    );


                /* =================================================
                   LOGIN USING REGISTERED ACCOUNT
                   ================================================= */

                if (studentData) {

                    const emailMatch =
                        username ===
                        studentData.email.toLowerCase();

                    const nameMatch =
                        username ===
                        studentData.fullName.toLowerCase();


                    if (
                        (emailMatch || nameMatch) &&
                        password === studentData.password
                    ) {

                        completeLogin(
                            studentData,
                            rememberElement
                        );

                        return;
                    }

                }


                /* =================================================
                   DEMO ACCOUNT
                   ================================================= */

                const demoUsername =
                    "student";

                const demoPassword =
                    "123456";


                if (
                    username === demoUsername &&
                    password === demoPassword
                ) {

                    const demoStudent = {

                        id: "STU-DEMO",

                        fullName: "Student",

                        email: "student@example.com",

                        phone: "",

                        course: "B.Tech CSE",

                        semester: "3rd Semester"

                    };


                    completeLogin(
                        demoStudent,
                        rememberElement
                    );

                    return;
                }


                showLoginMessage(
                    "Invalid email/name or password.",
                    "error"
                );

            }
        );

    }


    /* =====================================================
       AUTO LOAD PROFILE DATA
       ===================================================== */

    loadStudentInformation();


    /* =====================================================
       QUIZ
       ===================================================== */

    setupBasicQuiz();

});


/* =========================================================
   LOGIN SUCCESS
   ========================================================= */

function completeLogin(
    studentData,
    rememberElement
) {

    localStorage.setItem(
        "studentLoggedIn",
        "true"
    );


    localStorage.setItem(
        "studentUsername",
        studentData.fullName
    );


    localStorage.setItem(
        "currentStudent",
        JSON.stringify(studentData)
    );


    if (
        rememberElement &&
        rememberElement.checked
    ) {

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
        "Login successful! Redirecting to dashboard...",
        "success"
    );


    setTimeout(function () {

        window.location.href =
            "dashboard.html";

    }, 1000);

}


/* =========================================================
   LOGIN MESSAGE
   ========================================================= */

function showLoginMessage(
    message,
    type
) {

    const loginCard =
        document.querySelector(
            ".login-card"
        );


    if (!loginCard) {

        alert(message);

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
        document.createElement("div");


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

    } else {

        loginCard.prepend(
            messageBox
        );

    }

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function showForgotMessage() {

    alert(
        "For this demo project, please register again or contact the portal administrator for password reset."
    );

}


/* =========================================================
   LOAD STUDENT INFORMATION
   ========================================================= */

function loadStudentInformation() {

    const studentData =
        JSON.parse(
            localStorage.getItem(
                "studentData"
            )
        );


    const currentStudent =
        JSON.parse(
            localStorage.getItem(
                "currentStudent"
            )
        );


    const student =
        currentStudent || studentData;


    if (!student) {
        return;
    }


    /* Possible name elements */

    const nameElements =
        document.querySelectorAll(
            "#studentName, .student-name, [data-student-name]"
        );


    nameElements.forEach(function (element) {

        element.textContent =
            student.fullName || "Student";

    });


    /* Email */

    const emailElements =
        document.querySelectorAll(
            "#studentEmail, .student-email, [data-student-email]"
        );


    emailElements.forEach(function (element) {

        element.textContent =
            student.email || "-";

    });


    /* Course */

    const courseElements =
        document.querySelectorAll(
            "#studentCourse, .student-course, [data-student-course]"
        );


    courseElements.forEach(function (element) {

        element.textContent =
            student.course || "B.Tech CSE";

    });


    /* Semester */

    const semesterElements =
        document.querySelectorAll(
            "#studentSemester, .student-semester, [data-student-semester]"
        );


    semesterElements.forEach(function (element) {

        element.textContent =
            student.semester || "3rd Semester";

    });

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutStudent() {

    localStorage.removeItem(
        "studentLoggedIn"
    );

    localStorage.removeItem(
        "studentUsername"
    );

    localStorage.removeItem(
        "currentStudent"
    );


    window.location.href =
        "login.html";

}


/* =========================================================
   BASIC QUIZ SUPPORT
   ========================================================= */

function setupBasicQuiz() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {
        return;
    }


    const quizButton =
        document.getElementById(
            "quizSubmit"
        );


    if (quizButton) {

        quizButton.addEventListener(
            "click",
            function () {

                calculateBasicQuiz();

            }
        );

    }

}


/* =========================================================
   BASIC QUIZ CALCULATION
   ========================================================= */

function calculateBasicQuiz() {

    const answers = {

        q1: "a",
        q2: "b",
        q3: "c",
        q4: "b",
        q5: "c"

    };


    let score = 0;

    let attempted = 0;


    Object.keys(answers).forEach(
        function (question) {

            const selected =
                document.querySelector(
                    'input[name="' +
                    question +
                    '"]:checked'
                );


            if (selected) {

                attempted++;


                if (
                    selected.value ===
                    answers[question]
                ) {

                    score++;

                }

            }

        }
    );


    const total =
        Object.keys(answers).length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    if (result) {

        result.innerHTML = `
            <div class="quiz-result-card">
                <h2>Quiz Completed</h2>
                <p><strong>Score:</strong> ${score}/${total}</p>
                <p><strong>Percentage:</strong> ${percentage}%</p>
                <p><strong>Attempted:</strong> ${attempted}/${total}</p>
            </div>
        `;

    }

}


/* =========================================================
   FORGOT OLD TEST DATA HELPER
   ========================================================= */

function clearDemoLogin() {

    localStorage.removeItem(
        "studentData"
    );

    localStorage.removeItem(
        "currentStudent"
    );

    localStorage.removeItem(
        "studentLoggedIn"
    );

    localStorage.removeItem(
        "studentUsername"
    );

    alert(
        "Saved demo account data has been cleared."
    );

}
