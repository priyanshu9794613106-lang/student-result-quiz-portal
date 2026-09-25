/* =========================================================
   STUDENT RESULT & QUIZ PORTAL
   COMPLETE MAIN JAVASCRIPT
   ========================================================= */

let latestResult = null;


/* =========================================================
   CONFIGURATION
   ========================================================= */

const PORTAL_CONFIG = {

    portalName:
        "STUDENT RESULT & QUIZ PORTAL",

    portalSubtitle:
        "ONLINE LEARNING & ASSESSMENT PLATFORM",

    collegeName:
        "IEC College of Institutions, Greater Noida",

    founderName:
        "Priyanshu Mishra",

    founderRole:
        "Founder & Developer",

    passingPercentage:
        70,

    signatureFile:
        "Priyanshu_Mishra_Signature_Certificate.png"

};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupRegistration();

        setupLogin();

        loadStudentInformation();

        setupBasicQuiz();

        loadLatestResult();

    }
);


/* =========================================================
   REGISTRATION
   ========================================================= */

function setupRegistration() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullNameElement =
                document.getElementById(
                    "fullName"
                );

            const emailElement =
                document.getElementById(
                    "email"
                );

            const phoneElement =
                document.getElementById(
                    "phone"
                );

            const courseElement =
                document.getElementById(
                    "course"
                );

            const semesterElement =
                document.getElementById(
                    "semester"
                );

            const passwordElement =
                document.getElementById(
                    "password"
                );

            const confirmPasswordElement =
                document.getElementById(
                    "confirmPassword"
                );

            const termsElement =
                document.getElementById(
                    "terms"
                );


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
                emailElement.value
                    .trim()
                    .toLowerCase();

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


            /* NAME */

            const namePattern =
                /^[A-Za-z ]+$/;


            if (
                !namePattern.test(
                    fullName
                )
            ) {

                alert(
                    "Please enter a valid name using alphabets only."
                );

                return;

            }


            if (
                fullName.length < 3
            ) {

                alert(
                    "Name must contain at least 3 characters."
                );

                return;

            }


            /* EMAIL */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email
                )
            ) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            /* PHONE */

            const phonePattern =
                /^[0-9]{10}$/;


            if (
                !phonePattern.test(
                    phone
                )
            ) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            /* PASSWORD */

            if (
                password.length < 6
            ) {

                alert(
                    "Password must be at least 6 characters long."
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Password and Confirm Password do not match."
                );

                return;

            }


            /* TERMS */

            if (
                termsElement &&
                !termsElement.checked
            ) {

                alert(
                    "Please agree to the terms and conditions."
                );

                return;

            }


            /* EXISTING USER */

            const existingUser =
                JSON.parse(
                    localStorage.getItem(
                        "studentData"
                    )
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


            /* STUDENT DATA */

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
                    new Date()
                        .toLocaleString(
                            "en-IN"
                        )

            };


            localStorage.setItem(
                "studentData",
                JSON.stringify(
                    studentData
                )
            );


            /* REGISTERED STUDENTS */

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

        }
    );

}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const usernameElement =
                document.getElementById(
                    "username"
                );

            const passwordElement =
                document.getElementById(
                    "password"
                );

            const rememberElement =
                document.getElementById(
                    "remember"
                );


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


            /* REGISTERED ACCOUNT */

            if (studentData) {

                const emailMatch =
                    username ===
                    studentData.email
                        .toLowerCase();

                const nameMatch =
                    username ===
                    studentData.fullName
                        .toLowerCase();


                if (
                    (emailMatch ||
                        nameMatch) &&
                    password ===
                    studentData.password
                ) {

                    completeLogin(
                        studentData,
                        rememberElement
                    );

                    return;

                }

            }


            /* DEMO ACCOUNT */

            const demoUsername =
                "student";

            const demoPassword =
                "123456";


            if (
                username ===
                    demoUsername &&
                password ===
                    demoPassword
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


/* =========================================================
   COMPLETE LOGIN
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
        JSON.stringify(
            studentData
        )
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


    setTimeout(
        function () {

            window.location.href =
                "dashboard.html";

        },
        1000
    );

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
        document.createElement(
            "div"
        );


    messageBox.className =
        "login-message " +
        type;


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
        currentStudent ||
        studentData;


    if (!student) {
        return;
    }


    /* NAME */

    const nameElements =
        document.querySelectorAll(
            "#studentName, .student-name, [data-student-name]"
        );


    nameElements.forEach(
        function (element) {

            element.textContent =
                student.fullName ||
                "Student";

        }
    );


    /* EMAIL */

    const emailElements =
        document.querySelectorAll(
            "#studentEmail, .student-email, [data-student-email]"
        );


    emailElements.forEach(
        function (element) {

            element.textContent =
                student.email ||
                "-";

        }
    );


    /* COURSE */

    const courseElements =
        document.querySelectorAll(
            "#studentCourse, .student-course, [data-student-course]"
        );


    courseElements.forEach(
        function (element) {

            element.textContent =
                student.course ||
                "B.Tech CSE";

        }
    );


    /* SEMESTER */

    const semesterElements =
        document.querySelectorAll(
            "#studentSemester, .student-semester, [data-student-semester]"
        );


    semesterElements.forEach(
        function (element) {

            element.textContent =
                student.semester ||
                "3rd Semester";

        }
    );

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
   QUIZ SETUP
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


    if (!quizButton) {
        return;
    }


    quizButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            calculateBasicQuiz();

        }
    );

}


/* =========================================================
   GET TEST NAME
   ========================================================= */

function getTestName() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (
        quizForm &&
        quizForm.dataset &&
        quizForm.dataset.testName
    ) {

        return quizForm.dataset.testName;

    }


    const testNameElement =
        document.getElementById(
            "testName"
        );


    if (
        testNameElement &&
        testNameElement.value
    ) {

        return testNameElement.value.trim();

    }


    const heading =
        document.querySelector(
            "h1, h2"
        );


    if (
        heading &&
        heading.textContent.trim()
    ) {

        const headingText =
            heading.textContent.trim();


        if (
            !/quiz|test|assessment/i.test(
                headingText
            )
        ) {

            return headingText;

        }

    }


    return "Online Assessment";

}


/* =========================================================
   BASIC QUIZ CALCULATION
   ========================================================= */

function calculateBasicQuiz() {

    /*
       Current answer key.
       These are the 5-question answers
       from the existing quiz setup.
    */

    const answers = {

        q1: "a",
        q2: "b",
        q3: "c",
        q4: "b",
        q5: "c"

    };


    let score = 0;

    let attempted = 0;


    Object.keys(
        answers
    ).forEach(
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
        Object.keys(
            answers
        ).length;


    const percentage =
        total > 0
            ? Math.round(
                (score / total) *
                100
            )
            : 0;


    const testName =
        getTestName();


    const result = {

        score:
            score,

        total:
            total,

        percentage:
            percentage,

        attempted:
            attempted,

        passed:
            percentage >=
            PORTAL_CONFIG.passingPercentage,

        testName:
            testName,

        studentName:
            getCurrentStudentName(),

        date:
            new Date()
                .toLocaleDateString(
                    "en-IN"
                ),

        certificateId:
            createCertificateId()

    };


    latestResult =
        result;


    localStorage.setItem(
        "lastTestResult",
        JSON.stringify(
            result
        )
    );


    /* UPDATE STATISTICS */

    updateTestStatistics(
        result
    );


    /* DISPLAY RESULT */

    const resultElement =
        document.getElementById(
            "quizResult"
        );


    if (!resultElement) {
        return;
    }


    resultElement.innerHTML = `

        <div class="quiz-result-card">

            <h2>
                Quiz Completed
            </h2>

            <p>
                <strong>Test:</strong>
                ${escapeHTML(testName)}
            </p>

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

            <p>
                <strong>Status:</strong>
                ${
                    result.passed
                        ? "Passed"
                        : "Not Passed"
                }
            </p>

            ${
                result.passed
                    ? `

                        <button
                            type="button"
                            onclick="generateCertificate()"
                        >
                            🎓 Generate Certificate
                        </button>

                      `
                    : `

                        <p>
                            Certificate requires a minimum
                            passing score of
                            ${PORTAL_CONFIG.passingPercentage}%.
                        </p>

                      `
            }

        </div>

    `;

}


/* =========================================================
   UPDATE TEST STATISTICS
   ========================================================= */

function updateTestStatistics(
    result
) {

    let statistics =
        JSON.parse(
            localStorage.getItem(
                "portalStatistics"
            )
        ) || {

            testsTaken: 0,

            certificatesIssued: 0,

            ratings: []

        };


    statistics.testsTaken =
        Number(
            statistics.testsTaken || 0
        ) + 1;


    localStorage.setItem(
        "portalStatistics",
        JSON.stringify(
            statistics
        )
    );

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

    let currentStudent = null;

    let studentData = null;


    try {

        currentStudent =
            JSON.parse(
                localStorage.getItem(
                    "currentStudent"
                )
            );

    } catch (error) {

        currentStudent =
            null;

    }


    try {

        studentData =
            JSON.parse(
                localStorage.getItem(
                    "studentData"
                )
            );

    } catch (error) {

        studentData =
            null;

    }


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
            .substring(
                2,
                8
            )
            .toUpperCase()

    );

}


/* =========================================================
   GET SIGNATURE URL
   ========================================================= */

function getSignatureURL() {

    try {

        return new URL(
            PORTAL_CONFIG.signatureFile,
            window.location.href
        ).href;

    } catch (error) {

        return PORTAL_CONFIG.signatureFile;

    }

}


/* =========================================================
   PREMIUM CERTIFICATE GENERATOR
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
        formatCertificateDate(
            result.date
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


    const signatureURL =
        getSignatureURL();


    /*
       Save certificate ID back to result
       if it was missing.
    */

    result.certificateId =
        certificateId;


    latestResult =
        result;


    localStorage.setItem(
        "lastTestResult",
        JSON.stringify(
            result
        )
    );


    /* Increase certificate statistics */

    updateCertificateStatistics();


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
    ${escapeHTML(testName)} - Certificate
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

    padding: 65px 85px;

    overflow: hidden;

    box-shadow:
        0 30px 80px
        rgba(
            15,
            23,
            42,
            .18
        );

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

}


.certificate::after {

    content: "";

    position: absolute;

    inset: 28px;

    border:
        1px solid #d4af37;

    border-radius: 7px;

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

    margin-top: 40px;

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

    max-width: 700px;

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


.footer {

    display: grid;

    grid-template-columns:
        1fr
        150px
        1fr;

    align-items: end;

    gap: 30px;

    margin-top: 40px;

}


.signature {

    text-align: center;

}


.signature-image {

    width: 170px;

    height: 70px;

    object-fit: contain;

    object-position: center;

    display: block;

    margin:
        0 auto 4px;

}


.signature-line {

    width: 190px;

    height: 1px;

    margin: 4px auto;

    background: #334155;

}


.signature-name {

    font-size: 14px;

    font-weight: 900;

    color: #0f172a;

}


.signature-role {

    margin-top: 3px;

    font-size: 11px;

    font-weight: 800;

    color: #64748b;

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

    position: fixed;

    left: 50%;

    bottom: 20px;

    transform:
        translateX(-50%);

    text-align: center;

    z-index: 100;

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

    box-shadow:
        0 8px 25px
        rgba(
            29,
            78,
            216,
            .25
        );

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


    .signature-image {

        width: 150px;

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

            ${escapeHTML(
                PORTAL_CONFIG.portalName
            )}

        </div>


        <div class="portal-subtitle">

            ${escapeHTML(
                PORTAL_CONFIG.portalSubtitle
            )}

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

            ${escapeHTML(
                studentName
            )}

        </div>


        <div class="name-line"></div>


        <div class="description">

            In recognition of successfully completing the
            online assessment

        </div>


        <div class="test-name">

            ${escapeHTML(
                testName
            )}

        </div>


        <div class="affiliation">

            Issued under academic affiliation of

            <br>

            <strong>

                ${escapeHTML(
                    PORTAL_CONFIG.collegeName
                )}

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

                ${escapeHTML(
                    certificateId
                )}

            </strong>

            &nbsp; | &nbsp;

            Issue Date:

            <strong>

                ${escapeHTML(
                    issueDate
                )}

            </strong>

        </div>


        <div class="footer">


            <div class="signature">

                <img
                    class="signature-image"
                    src="${signatureURL}"
                    alt="Priyanshu Mishra Signature"
                    onerror="this.style.display='none';"
                >


                <div class="signature-line"></div>


                <div class="signature-name">

                    ${escapeHTML(
                        PORTAL_CONFIG.founderName
                    )}

                </div>


                <div class="signature-role">

                    ${escapeHTML(
                        PORTAL_CONFIG.founderRole
                    )}

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

                    ${escapeHTML(
                        PORTAL_CONFIG.portalName
                    )}

                </div>


                <div class="issuer-sub">

                    Online Learning &amp;
                    Assessment Platform

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
   CERTIFICATE STATISTICS
   ========================================================= */

function updateCertificateStatistics() {

    let statistics =
        JSON.parse(
            localStorage.getItem(
                "portalStatistics"
            )
        ) || {

            testsTaken: 0,

            certificatesIssued: 0,

            ratings: []

        };


    statistics.certificatesIssued =
        Number(
            statistics.certificatesIssued || 0
        ) + 1;


    localStorage.setItem(
        "portalStatistics",
        JSON.stringify(
            statistics
        )
    );

}


/* =========================================================
   FORMAT CERTIFICATE DATE
   ========================================================= */

function formatCertificateDate(
    dateValue
) {

    if (!dateValue) {

        return new Date()
            .toLocaleDateString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            );

    }


    const parsedDate =
        new Date(
            dateValue
        );


    if (
        !isNaN(
            parsedDate.getTime()
        )
    ) {

        return parsedDate
            .toLocaleDateString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            );

    }


    return String(
        dateValue
    );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value || ""
    )
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
   CERTIFICATE TEXT SAFETY
   ========================================================= */

function escapeCertificateText(
    value
) {

    return escapeHTML(
        value
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

    localStorage.removeItem(
        "lastTestResult"
    );

    localStorage.removeItem(
        "rememberStudent"
    );


    alert(
        "Saved demo account data has been cleared."
    );

}
