/* =========================================================
   STUDENT RESULT & QUIZ PORTAL
   MAIN JAVASCRIPT
   FINAL VERSION WITH SIGNATURE CERTIFICATE
   ========================================================= */

let latestResult = null;


/* =========================================================
   CERTIFICATE SIGNATURE IMAGE
   ========================================================= */

const SIGNATURE_IMAGE_URL =
    "https://priyanshu9794613106-lang.github.io/student-result-quiz-/Screenshot%202026-09-25%20172226.png";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       REGISTRATION
       ===================================================== */

    const registerForm =
        document.getElementById("registerForm");

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


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            const phonePattern =
                /^[0-9]{10}$/;

            if (!phonePattern.test(phone)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters long."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert(
                    "Password and Confirm Password do not match."
                );

                return;
            }


            if (
                termsElement &&
                !termsElement.checked
            ) {

                alert(
                    "Please agree to the terms and conditions."
                );

                return;
            }


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
                    usernameElement.value
                        .trim()
                        .toLowerCase();

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


                const studentData =
                    JSON.parse(
                        localStorage.getItem(
                            "studentData"
                        )
                    );


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


                const demoUsername =
                    "student";

                const demoPassword =
                    "123456";


                if (
                    username === demoUsername &&
                    password === demoPassword
                ) {

                    const demoStudent = {

                        id:
                            "STU-DEMO",

                        fullName:
                            "Student",

                        email:
                            "student@example.com",

                        phone:
                            "",

                        course:
                            "B.Tech CSE",

                        semester:
                            "3rd Semester"

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


    loadStudentInformation();

    setupBasicQuiz();

    loadLatestResult();

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


    const nameElements =
        document.querySelectorAll(
            "#studentName, .student-name, [data-student-name]"
        );


    nameElements.forEach(function (element) {

        element.textContent =
            student.fullName || "Student";

    });


    const emailElements =
        document.querySelectorAll(
            "#studentEmail, .student-email, [data-student-email]"
        );


    emailElements.forEach(function (element) {

        element.textContent =
            student.email || "-";

    });


    const courseElements =
        document.querySelectorAll(
            "#studentCourse, .student-course, [data-student-course]"
        );


    courseElements.forEach(function (element) {

        element.textContent =
            student.course || "B.Tech CSE";

    });


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


    const result = {

        score:
            score,

        total:
            total,

        percentage:
            percentage,

        passed:
            percentage >= 70,

        testName:
            "Basic Quiz",

        studentName:
            getCurrentStudentName(),

        date:
            new Date().toLocaleDateString(
                "en-IN"
            ),

        certificateId:
            createCertificateId()

    };


    latestResult =
        result;


    localStorage.setItem(
        "lastTestResult",
        JSON.stringify(result)
    );


    const resultElement =
        document.getElementById(
            "quizResult"
        );


    if (resultElement) {

        resultElement.innerHTML = `

            <div class="quiz-result-card">

                <h2>
                    Quiz Completed
                </h2>

                <p>
                    <strong>Score:</strong>
                    ${score}/${total}
                </p>

                <p>
                    <strong>Percentage:</strong>
                    ${percentage}%
                </p>

                <p>
                    <strong>Attempted:</strong>
                    ${attempted}/${total}
                </p>

                ${
                    result.passed
                    ?
                    `
                        <button
                            type="button"
                            onclick="generateCertificate()"
                        >
                            🎓 Generate Certificate
                        </button>
                    `
                    :
                    `
                        <p>
                            Certificate requires a minimum
                            passing score of 70%.
                        </p>
                    `
                }

            </div>

        `;

    }

}


/* =========================================================
   LOAD LATEST RESULT
   ========================================================= */

function loadLatestResult() {

    try {

        const savedResult =
            JSON.parse(
                localStorage.getItem(
                    "lastTestResult"
                )
            );


        if (savedResult) {

            latestResult =
                savedResult;

        }

    } catch (error) {

        latestResult =
            null;

    }

}


/* =========================================================
   CURRENT STUDENT NAME
   ========================================================= */

function getCurrentStudentName() {

    const currentStudent =
        JSON.parse(
            localStorage.getItem(
                "currentStudent"
            )
        );


    const studentData =
        JSON.parse(
            localStorage.getItem(
                "studentData"
            )
        );


    const student =
        currentStudent ||
        studentData;


    return (
        student &&
        student.fullName
    ) || "Student";

}


/* =========================================================
   CERTIFICATE ID
   ========================================================= */

function createCertificateId() {

    return (

        "SRQP-" +

        new Date()
            .getFullYear() +

        "-" +

        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()

    );

}


/* =========================================================
   PREMIUM CERTIFICATE GENERATOR
   WITH PRIYANSHU SIGNATURE
   ========================================================= */

function generateCertificate() {

    const result =
        latestResult ||
        JSON.parse(
            localStorage.getItem(
                "lastTestResult"
            )
        );


    if (!result) {

        alert(
            "No test result found."
        );

        return;

    }


    if (!result.passed) {

        alert(
            "Certificate is available only after passing the assessment."
        );

        return;

    }


    const certificateWindow =
        window.open(
            "",
            "_blank"
        );


    if (!certificateWindow) {

        alert(
            "Please allow pop-ups for this website to generate the certificate."
        );

        return;

    }


    const issueDate =
        result.date ||
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    const studentName =
        result.studentName ||
        getCurrentStudentName();


    const testName =
        result.testName ||
        "Online Assessment";


    const certificateId =
        result.certificateId ||
        createCertificateId();


    certificateWindow.document.write(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Certificate of Achievement
</title>


<style>

* {
    box-sizing: border-box;
}


body {

    margin: 0;

    min-height: 100vh;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 30px;

    background:
        radial-gradient(
            circle at top left,
            #dbeafe,
            transparent 35%
        ),
        radial-gradient(
            circle at bottom right,
            #e0e7ff,
            transparent 35%
        ),
        #f1f5f9;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: #0f172a;

}


.certificate {

    position: relative;

    width: min(
        1120px,
        100%
    );

    min-height: 720px;

    background: #ffffff;

    border-radius: 18px;

    padding: 70px 85px;

    overflow: hidden;

    box-shadow:
        0 30px 80px
        rgba(15,23,42,.18);

    border:
        1px solid #cbd5e1;

}


.certificate::before {

    content: "";

    position: absolute;

    inset: 18px;

    border:
        2px solid #1d4ed8;

    border-radius: 10px;

    pointer-events: none;

}


.certificate::after {

    content: "";

    position: absolute;

    inset: 28px;

    border:
        1px solid #d4af37;

    border-radius: 7px;

    pointer-events: none;

}


.corner {

    position: absolute;

    width: 80px;

    height: 80px;

    border-color: #d4af37;

    border-style: solid;

    z-index: 2;

}


.top-left {

    top: 38px;

    left: 38px;

    border-width:
        5px 0 0 5px;

}


.top-right {

    top: 38px;

    right: 38px;

    border-width:
        5px 5px 0 0;

}


.bottom-left {

    bottom: 38px;

    left: 38px;

    border-width:
        0 0 5px 5px;

}


.bottom-right {

    bottom: 38px;

    right: 38px;

    border-width:
        0 5px 5px 0;

}


.content {

    position: relative;

    z-index: 5;

}


.portal-name {

    text-align: center;

    font-size: 15px;

    font-weight: 900;

    letter-spacing: 4px;

    color: #1d4ed8;

}


.portal-subtitle {

    text-align: center;

    margin-top: 8px;

    font-size: 11px;

    letter-spacing: 2px;

    color: #64748b;

}


.divider {

    width: 110px;

    height: 3px;

    margin: 18px auto;

    background:
        linear-gradient(
            90deg,
            #1d4ed8,
            #d4af37
        );

}


.title {

    text-align: center;

    font-family:
        Georgia,
        "Times New Roman",
        serif;

    font-size:
        clamp(
            38px,
            5vw,
            58px
        );

    letter-spacing: 3px;

    margin: 10px 0 5px;

    color: #0f172a;

    text-transform:
        uppercase;

}


.subtitle {

    text-align: center;

    font-size: 12px;

    font-weight: 800;

    letter-spacing: 3px;

    color: #64748b;

}


.presented {

    text-align: center;

    margin-top: 42px;

    color: #64748b;

    font-size: 14px;

}


.student-name {

    text-align: center;

    margin: 15px 0 10px;

    font-family:
        Georgia,
        "Times New Roman",
        serif;

    font-size:
        clamp(
            34px,
            5vw,
            52px
        );

    font-weight: 700;

    color: #1e3a8a;

}


.name-line {

    width: 360px;

    max-width: 70%;

    height: 1px;

    margin: auto;

    background:
        linear-gradient(
            90deg,
            transparent,
            #d4af37,
            transparent
        );

}


.description {

    text-align: center;

    margin-top: 25px;

    color: #475569;

    font-size: 15px;

}


.test-name {

    text-align: center;

    margin: 12px auto 25px;

    font-size: 25px;

    font-weight: 800;

    color: #0f172a;

}


.affiliation {

    max-width: 650px;

    margin: 0 auto 28px;

    padding: 12px 18px;

    text-align: center;

    border-radius: 10px;

    background: #f8fafc;

    border:
        1px solid #e2e8f0;

    color: #334155;

    font-size: 13px;

}


.affiliation strong {

    color: #1e3a8a;

}


.stats {

    display: grid;

    grid-template-columns:
        repeat(
            3,
            1fr
        );

    gap: 16px;

    max-width: 760px;

    margin: 0 auto 28px;

}


.stat {

    padding: 18px;

    text-align: center;

    border:
        1px solid #e2e8f0;

    border-radius: 12px;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8fafc
        );

}


.stat-label {

    font-size: 10px;

    font-weight: 800;

    letter-spacing: 1.5px;

    color: #64748b;

}


.stat-value {

    margin-top: 7px;

    font-size: 20px;

    font-weight: 900;

    color: #1d4ed8;

}


.meta {

    text-align: center;

    font-size: 12px;

    color: #64748b;

}


.meta strong {

    color: #0f172a;

}


/* =========================================
   SIGNATURE SECTION
========================================= */

.footer {

    display: grid;

    grid-template-columns:
        1fr
        150px
        1fr;

    align-items: end;

    gap: 30px;

    margin-top: 48px;

}


.signature {

    text-align: center;

}


.signature-image {

    display: block;

    width: 180px;

    height: 75px;

    object-fit: contain;

    object-position: center;

    margin:
        0 auto 2px;

    mix-blend-mode: multiply;

}


.signature-line {

    width: 190px;

    height: 1px;

    margin: 5px auto;

    background: #334155;

}


.signature-role {

    font-size: 11px;

    font-weight: 800;

    color: #64748b;

}


.signature-owner {

    margin-top: 3px;

    font-size: 12px;

    font-weight: 900;

    color: #0f172a;

}


.seal {

    width: 110px;

    height: 110px;

    margin: auto;

    border:
        4px solid #d4af37;

    border-radius: 50%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    background:
        radial-gradient(
            circle,
            #fffdf0,
            #f8fafc
        );

    color: #92400e;

    font-size: 10px;

    font-weight: 900;

    letter-spacing: 1px;

}


.seal-star {

    font-size: 25px;

    color: #d4af37;

}


.issuer {

    text-align: center;

}


.issuer-name {

    font-size: 14px;

    font-weight: 900;

    color: #1e3a8a;

}


.issuer-sub {

    margin-top: 5px;

    font-size: 10px;

    color: #64748b;

    line-height: 1.5;

}


.print-controls {

    text-align: center;

    margin-top: 22px;

}


.print-btn {

    border: none;

    border-radius: 10px;

    padding: 13px 22px;

    background:
        linear-gradient(
            135deg,
            #1d4ed8,
            #2563eb
        );

    color: white;

    font-weight: 800;

    cursor: pointer;

}


.print-btn:hover {

    transform:
        translateY(-2px);

}


@media (max-width: 700px) {

    body {

        padding: 12px;

    }


    .certificate {

        padding:
            55px 25px;

    }


    .stats {

        grid-template-columns:
            1fr;

    }


    .footer {

        grid-template-columns:
            1fr;

        gap: 25px;

    }


    .seal {

        order: -1;

    }


    .title {

        font-size: 32px;

    }


    .student-name {

        font-size: 32px;

    }

}


@media print {

    @page {

        size: A4 landscape;

        margin: 0;

    }


    body {

        padding: 0;

        background: white;

    }


    .certificate {

        width: 100vw;

        min-height: 100vh;

        border-radius: 0;

        box-shadow: none;

    }


    .print-controls {

        display: none;

    }

}

</style>

</head>


<body>


<div class="certificate">


    <div class="corner top-left"></div>

    <div class="corner top-right"></div>

    <div class="corner bottom-left"></div>

    <div class="corner bottom-right"></div>


    <div class="content">


        <div class="portal-name">
            STUDENT RESULT &amp; QUIZ PORTAL
        </div>


        <div class="portal-subtitle">
            ONLINE LEARNING &amp; ASSESSMENT PLATFORM
        </div>


        <div class="divider"></div>


        <div class="title">
            Certificate of Achievement
        </div>


        <div class="subtitle">
            PROFESSIONAL ONLINE ASSESSMENT
        </div>


        <div class="presented">
            This certificate is proudly presented to
        </div>


        <div class="student-name">
            ${escapeCertificateText(studentName)}
        </div>


        <div class="name-line"></div>


        <div class="description">
            In recognition of successfully completing the
            online assessment
        </div>


        <div class="test-name">
            ${escapeCertificateText(testName)}
        </div>


        <div class="affiliation">

            Academic Affiliation:

            <strong>
                IEC College of Institutions, Greater Noida
            </strong>

        </div>


        <div class="stats">


            <div class="stat">

                <div class="stat-label">
                    SCORE
                </div>

                <div class="stat-value">
                    ${result.score}/${result.total}
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    PERCENTAGE
                </div>

                <div class="stat-value">
                    ${result.percentage}%
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    ASSESSMENT
                </div>

                <div class="stat-value">
                    ${result.total} Questions
                </div>

            </div>


        </div>


        <div class="meta">

            Certificate ID:

            <strong>
                ${escapeCertificateText(certificateId)}
            </strong>

            &nbsp; | &nbsp;

            Issue Date:

            <strong>
                ${escapeCertificateText(issueDate)}
            </strong>

        </div>


        <div class="footer">


            <div class="signature">

                <img
                    class="signature-image"
                    src="${SIGNATURE_IMAGE_URL}"
                    alt="Priyanshu Mishra Signature"
                >

                <div class="signature-line"></div>

                <div class="signature-owner">
                    Priyanshu Mishra
                </div>

                <div class="signature-role">
                    Founder &amp; Developer
                </div>

            </div>


            <div class="seal">

                <div class="seal-star">
                    ★
                </div>

                VERIFIED

                <br>

                ASSESSMENT

                <br>

                CERTIFICATE

            </div>


            <div class="issuer">

                <div class="issuer-name">
                    Student Result &amp; Quiz Portal
                </div>

                <div class="issuer-sub">

                    Online Learning &amp; Assessment Platform

                    <br>

                    Certificate of Achievement

                </div>

            </div>


        </div>


    </div>

</div>


<div class="print-controls">

    <button
        class="print-btn"
        onclick="window.print()"
    >

        🖨️ Print / Save as PDF

    </button>

</div>


<script>

window.onload = function () {

    setTimeout(
        function () {

            window.print();

        },
        900
    );

};

</script>


</body>

</html>

    `);


    certificateWindow.document.close();

}


/* =========================================================
   CERTIFICATE TEXT SAFETY
   ========================================================= */

function escapeCertificateText(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   CLEAR DEMO LOGIN
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
