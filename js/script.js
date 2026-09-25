/* =========================================================
   STUDENT RESULT & QUIZ PORTAL
   COMPLETE MAIN JAVASCRIPT
   VERSION 2.0
   20 QUESTIONS + 10 MINUTES + PREMIUM CERTIFICATE
   ========================================================= */


/* =========================================================
   GLOBAL SETTINGS
   ========================================================= */

const QUIZ_TOTAL_QUESTIONS = 20;
const QUIZ_TIME_LIMIT_SECONDS = 10 * 60;
const PASSING_PERCENTAGE = 70;

let latestResult = null;
let quizTimerInterval = null;
let quizTimeRemaining = QUIZ_TIME_LIMIT_SECONDS;
let quizSubmitted = false;


/* =========================================================
   FALLBACK ANSWERS
   =========================================================
   If your HTML questions contain:
   data-correct="a"
   then the system will use those answers automatically.

   Otherwise these answers are used.
   Change only these values if your existing 20 questions
   use different correct options.
   ========================================================= */

const DEFAULT_ANSWERS = {

    q1: "a",
    q2: "b",
    q3: "c",
    q4: "b",
    q5: "c",
    q6: "a",
    q7: "b",
    q8: "c",
    q9: "a",
    q10: "b",

    q11: "c",
    q12: "a",
    q13: "b",
    q14: "c",
    q15: "a",
    q16: "b",
    q17: "c",
    q18: "a",
    q19: "b",
    q20: "c"

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

        loadLatestResult();

        setupQuiz();

    }
);


/* =========================================================
   REGISTRATION
   ========================================================= */

function setupRegistration() {

    const registerForm =
        document.getElementById("registerForm");


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        function (event) {

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


            const namePattern =
                /^[A-Za-z ]+$/;


            if (
                !namePattern.test(fullName) ||
                fullName.length < 3
            ) {

                alert(
                    "Please enter a valid name using alphabets only."
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
                    new Date().toLocaleString(
                        "en-IN"
                    )

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

        }
    );

}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


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
                    String(
                        studentData.email
                    ).toLowerCase();


                const nameMatch =
                    username ===
                    String(
                        studentData.fullName
                    ).toLowerCase();


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


            /* DEMO LOGIN */

            if (
                username === "student" &&
                password === "123456"
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


    setTimeout(
        function () {

            window.location.href =
                "dashboard.html";

        },
        900
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

    let studentData = null;
    let currentStudent = null;


    try {

        studentData =
            JSON.parse(
                localStorage.getItem(
                    "studentData"
                )
            );

    } catch (error) {

        studentData = null;

    }


    try {

        currentStudent =
            JSON.parse(
                localStorage.getItem(
                    "currentStudent"
                )
            );

    } catch (error) {

        currentStudent = null;

    }


    const student =
        currentStudent ||
        studentData;


    if (!student) {
        return;
    }


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

function setupQuiz() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {
        return;
    }


    quizSubmitted = false;

    quizTimeRemaining =
        QUIZ_TIME_LIMIT_SECONDS;


    setupQuizInterface();


    startQuizTimer();


    setupQuestionTracking();


    const quizButton =
        document.getElementById(
            "quizSubmit"
        );


    if (quizButton) {

        quizButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                submitQuiz(
                    false
                );

            }
        );

    }


    quizForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            submitQuiz(
                false
            );

        }
    );

}


/* =========================================================
   QUIZ INTERFACE
   ========================================================= */

function setupQuizInterface() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {
        return;
    }


    /* Timer */

    let timer =
        document.getElementById(
            "quizTimer"
        );


    if (!timer) {

        timer =
            document.createElement(
                "div"
            );

        timer.id =
            "quizTimer";

        timer.className =
            "premium-quiz-timer";


        quizForm.parentNode.insertBefore(
            timer,
            quizForm
        );

    }


    timer.innerHTML = `
        <div class="quiz-timer-inner">
            <span class="timer-icon">⏱</span>
            <span class="timer-label">TIME REMAINING</span>
            <strong id="quizTimerValue">10:00</strong>
        </div>
    `;


    injectQuizStyles();


    updateQuizTimer();


    /* Progress */

    let progress =
        document.getElementById(
            "quizProgress"
        );


    if (!progress) {

        progress =
            document.createElement(
                "div"
            );

        progress.id =
            "quizProgress";

        progress.className =
            "quiz-progress-box";


        timer.insertAdjacentElement(
            "afterend",
            progress
        );

    }


    progress.innerHTML = `
        <div class="quiz-progress-top">
            <span>Assessment Progress</span>
            <strong id="quizProgressText">0 / ${QUIZ_TOTAL_QUESTIONS}</strong>
        </div>

        <div class="quiz-progress-track">
            <div id="quizProgressBar"></div>
        </div>
    `;


    updateQuizProgress();

}


/* =========================================================
   QUIZ TIMER
   ========================================================= */

function startQuizTimer() {

    stopQuizTimer();


    quizTimeRemaining =
        QUIZ_TIME_LIMIT_SECONDS;


    updateQuizTimer();


    quizTimerInterval =
        setInterval(
            function () {

                if (quizSubmitted) {

                    stopQuizTimer();

                    return;
                }


                quizTimeRemaining--;


                updateQuizTimer();


                if (
                    quizTimeRemaining <= 0
                ) {

                    stopQuizTimer();


                    alert(
                        "Time is over. Your test will be submitted automatically."
                    );


                    submitQuiz(
                        true
                    );

                }

            },
            1000
        );

}


/* =========================================================
   STOP TIMER
   ========================================================= */

function stopQuizTimer() {

    if (quizTimerInterval) {

        clearInterval(
            quizTimerInterval
        );

        quizTimerInterval =
            null;

    }

}


/* =========================================================
   UPDATE TIMER
   ========================================================= */

function updateQuizTimer() {

    const timerValue =
        document.getElementById(
            "quizTimerValue"
        );


    if (!timerValue) {
        return;
    }


    const minutes =
        Math.floor(
            quizTimeRemaining / 60
        );


    const seconds =
        quizTimeRemaining % 60;


    timerValue.textContent =
        String(minutes).padStart(
            2,
            "0"
        ) +
        ":" +
        String(seconds).padStart(
            2,
            "0"
        );


    const timerBox =
        document.getElementById(
            "quizTimer"
        );


    if (!timerBox) {
        return;
    }


    timerBox.classList.remove(
        "timer-warning",
        "timer-danger"
    );


    if (
        quizTimeRemaining <= 60
    ) {

        timerBox.classList.add(
            "timer-danger"
        );

    } else if (
        quizTimeRemaining <= 180
    ) {

        timerBox.classList.add(
            "timer-warning"
        );

    }

}


/* =========================================================
   QUESTION TRACKING
   ========================================================= */

function setupQuestionTracking() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {
        return;
    }


    const inputs =
        quizForm.querySelectorAll(
            'input[type="radio"], input[type="checkbox"]'
        );


    inputs.forEach(
        function (input) {

            input.addEventListener(
                "change",
                function () {

                    updateQuizProgress();

                }
            );

        }
    );


    updateQuizProgress();

}


/* =========================================================
   UPDATE QUIZ PROGRESS
   ========================================================= */

function updateQuizProgress() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {
        return;
    }


    let answered =
        0;


    for (
        let i = 1;
        i <= QUIZ_TOTAL_QUESTIONS;
        i++
    ) {

        const selected =
            quizForm.querySelector(
                'input[name="q' +
                i +
                '"]:checked'
            );


        if (selected) {
            answered++;
        }

    }


    const progressText =
        document.getElementById(
            "quizProgressText"
        );


    if (progressText) {

        progressText.textContent =
            answered +
            " / " +
            QUIZ_TOTAL_QUESTIONS;

    }


    const progressBar =
        document.getElementById(
            "quizProgressBar"
        );


    if (progressBar) {

        const percentage =
            Math.min(
                100,
                (
                    answered /
                    QUIZ_TOTAL_QUESTIONS
                ) * 100
            );


        progressBar.style.width =
            percentage +
            "%";

    }

}


/* =========================================================
   GET CORRECT ANSWERS
   ========================================================= */

function getQuizAnswers() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    const answers = {};


    for (
        let i = 1;
        i <= QUIZ_TOTAL_QUESTIONS;
        i++
    ) {

        const questionName =
            "q" + i;


        const questionInputs =
            quizForm
                ? quizForm.querySelectorAll(
                    'input[name="' +
                    questionName +
                    '"]'
                )
                : [];


        let correctAnswer = null;


        questionInputs.forEach(
            function (input) {

                if (
                    input.dataset &&
                    input.dataset.correct
                ) {

                    correctAnswer =
                        input.dataset.correct;

                }

            }
        );


        if (correctAnswer) {

            answers[questionName] =
                correctAnswer;

        } else {

            answers[questionName] =
                DEFAULT_ANSWERS[
                    questionName
                ];

        }

    }


    return answers;

}


/* =========================================================
   SUBMIT QUIZ
   ========================================================= */

function submitQuiz(
    automaticSubmit
) {

    if (quizSubmitted) {
        return;
    }


    quizSubmitted = true;


    stopQuizTimer();


    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {

        quizSubmitted =
            false;

        return;
    }


    const answers =
        getQuizAnswers();


    let score =
        0;

    let attempted =
        0;


    for (
        let i = 1;
        i <= QUIZ_TOTAL_QUESTIONS;
        i++
    ) {

        const question =
            "q" + i;


        const selected =
            quizForm.querySelector(
                'input[name="' +
                question +
                '"]:checked'
            );


        if (selected) {

            attempted++;


            const selectedValue =
                String(
                    selected.value
                ).trim().toLowerCase();


            const correctValue =
                String(
                    answers[question] || ""
                ).trim().toLowerCase();


            if (
                selectedValue ===
                correctValue
            ) {

                score++;

            }

        }

    }


    const total =
        QUIZ_TOTAL_QUESTIONS;


    const percentage =
        Math.round(
            (
                score /
                total
            ) * 100
        );


    const passed =
        percentage >=
        PASSING_PERCENTAGE;


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

        unanswered:
            total - attempted,

        passed:
            passed,

        testName:
            testName,

        studentName:
            getCurrentStudentName(),

        date:
            new Date().toLocaleDateString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            ),

        certificateId:
            passed
            ? createCertificateId()
            : null,

        duration:
            formatDuration(
                QUIZ_TIME_LIMIT_SECONDS -
                quizTimeRemaining
            ),

        submittedAutomatically:
            Boolean(
                automaticSubmit
            )

    };


    latestResult =
        result;


    localStorage.setItem(
        "lastTestResult",
        JSON.stringify(
            result
        )
    );


    saveTestStatistics(
        result
    );


    showQuizResult(
        result
    );


    disableQuiz();


    scrollToResult();

}


/* =========================================================
   GET TEST NAME
   ========================================================= */

function getTestName() {

    const possibleElements = [

        document.getElementById(
            "testName"
        ),

        document.querySelector(
            "[data-test-name]"
        ),

        document.querySelector(
            ".test-name"
        ),

        document.querySelector(
            "h1"
        ),

        document.querySelector(
            "h2"
        )

    ];


    for (
        let i = 0;
        i < possibleElements.length;
        i++
    ) {

        const element =
            possibleElements[i];


        if (
            element &&
            element.textContent.trim()
        ) {

            const text =
                element.textContent.trim();


            if (
                text.length <= 100
            ) {

                return text;

            }

        }

    }


    return "Online Assessment";

}


/* =========================================================
   SHOW RESULT
   ========================================================= */

function showQuizResult(
    result
) {

    let resultElement =
        document.getElementById(
            "quizResult"
        );


    if (!resultElement) {

        resultElement =
            document.createElement(
                "div"
            );

        resultElement.id =
            "quizResult";


        const quizForm =
            document.getElementById(
                "quizForm"
            );


        if (quizForm) {

            quizForm.insertAdjacentElement(
                "afterend",
                resultElement
            );

        } else {

            document.body.appendChild(
                resultElement
            );

        }

    }


    const certificateButton =
        result.passed
        ? `
            <button
                type="button"
                class="premium-certificate-btn"
                onclick="generateCertificate()"
            >
                🎓 Generate Certificate
            </button>
        `
        : `
            <div class="certificate-locked">
                🔒 Certificate unlocks at ${PASSING_PERCENTAGE}% or above.
            </div>
        `;


    resultElement.innerHTML = `

        <div class="premium-result-card">

            <div class="result-header">

                <span class="result-badge">
                    ${result.passed ? "PASSED" : "NOT PASSED"}
                </span>

                <h2>
                    Assessment Completed
                </h2>

                <p>
                    ${escapeHTML(result.testName)}
                </p>

            </div>


            <div class="result-score">

                <div class="score-circle">

                    <strong>
                        ${result.percentage}%
                    </strong>

                    <span>
                        Score
                    </span>

                </div>

            </div>


            <div class="result-grid">

                <div class="result-stat">

                    <span>
                        SCORE
                    </span>

                    <strong>
                        ${result.score}/${result.total}
                    </strong>

                </div>


                <div class="result-stat">

                    <span>
                        ATTEMPTED
                    </span>

                    <strong>
                        ${result.attempted}
                    </strong>

                </div>


                <div class="result-stat">

                    <span>
                        UNANSWERED
                    </span>

                    <strong>
                        ${result.unanswered}
                    </strong>

                </div>


                <div class="result-stat">

                    <span>
                        TIME USED
                    </span>

                    <strong>
                        ${result.duration}
                    </strong>

                </div>

            </div>


            <div class="result-message">

                ${
                    result.passed
                    ? "🎉 Congratulations! You have successfully passed the assessment."
                    : "Keep practicing and try again to achieve the passing score."
                }

            </div>


            ${certificateButton}


            ${
                result.certificateId
                ? `
                    <div class="certificate-id-display">
                        Certificate ID:
                        <strong>
                            ${escapeHTML(
                                result.certificateId
                            )}
                        </strong>
                    </div>
                `
                : ""
            }

        </div>

    `;


    resultElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   DISABLE QUIZ
   ========================================================= */

function disableQuiz() {

    const quizForm =
        document.getElementById(
            "quizForm"
        );


    if (!quizForm) {
        return;
    }


    const inputs =
        quizForm.querySelectorAll(
            "input, select, textarea"
        );


    inputs.forEach(
        function (input) {

            input.disabled =
                true;

        }
    );


    const submitButton =
        document.getElementById(
            "quizSubmit"
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Assessment Submitted";

    }

}


/* =========================================================
   SAVE TEST STATISTICS
   ========================================================= */

function saveTestStatistics(
    result
) {

    let statistics = {};


    try {

        statistics =
            JSON.parse(
                localStorage.getItem(
                    "portalStatistics"
                )
            ) || {};

    } catch (error) {

        statistics = {};

    }


    statistics.testsTaken =
        Number(
            statistics.testsTaken || 0
        ) + 1;


    if (result.passed) {

        statistics.certificatesIssued =
            Number(
                statistics.certificatesIssued || 0
            ) + 1;

    }


    statistics.lastUpdated =
        new Date().toISOString();


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

    let currentStudent =
        null;

    let studentData =
        null;


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
            .substring(2, 8)
            .toUpperCase()

    );

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


    const studentName =
        result.studentName ||
        getCurrentStudentName();


    const testName =
        result.testName ||
        "Online Assessment";


    const certificateId =
        result.certificateId ||
        createCertificateId();


    const issueDate =
        result.date ||
        new Date().toLocaleDateString(
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

    padding: 25px;

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

    color:
        #0f172a;

}


.certificate {

    position: relative;

    width: min(
        1120px,
        100%
    );

    min-height: 720px;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8fafc
        );

    border-radius:
        18px;

    padding:
        70px 85px;

    overflow:
        hidden;

    box-shadow:
        0 30px 80px
        rgba(
            15,
            23,
            42,
            .18
        );

    border:
        1px solid
        #cbd5e1;

}


.certificate::before {

    content: "";

    position: absolute;

    inset:
        18px;

    border:
        2px solid
        #1d4ed8;

    border-radius:
        10px;

    pointer-events:
        none;

}


.certificate::after {

    content: "";

    position: absolute;

    inset:
        28px;

    border:
        1px solid
        #d4af37;

    border-radius:
        7px;

    pointer-events:
        none;

}


.corner {

    position: absolute;

    width:
        80px;

    height:
        80px;

    border-color:
        #d4af37;

    border-style:
        solid;

    z-index:
        2;

}


.top-left {

    top:
        38px;

    left:
        38px;

    border-width:
        5px 0 0 5px;

}


.top-right {

    top:
        38px;

    right:
        38px;

    border-width:
        5px 5px 0 0;

}


.bottom-left {

    bottom:
        38px;

    left:
        38px;

    border-width:
        0 0 5px 5px;

}


.bottom-right {

    bottom:
        38px;

    right:
        38px;

    border-width:
        0 5px 5px 0;

}


.content {

    position:
        relative;

    z-index:
        5;

}


.portal-name {

    text-align:
        center;

    font-size:
        15px;

    font-weight:
        900;

    letter-spacing:
        4px;

    color:
        #1d4ed8;

}


.portal-subtitle {

    text-align:
        center;

    margin-top:
        8px;

    font-size:
        11px;

    letter-spacing:
        2px;

    color:
        #64748b;

}


.divider {

    width:
        110px;

    height:
        3px;

    margin:
        18px auto;

    background:
        linear-gradient(
            90deg,
            #1d4ed8,
            #d4af37
        );

    border-radius:
        20px;

}


.title {

    text-align:
        center;

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

    letter-spacing:
        3px;

    margin:
        10px 0 5px;

    color:
        #0f172a;

    text-transform:
        uppercase;

}


.subtitle {

    text-align:
        center;

    font-size:
        12px;

    font-weight:
        800;

    letter-spacing:
        3px;

    color:
        #64748b;

}


.presented {

    text-align:
        center;

    margin-top:
        42px;

    color:
        #64748b;

    font-size:
        14px;

}


.student-name {

    text-align:
        center;

    margin:
        15px 0 10px;

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

    font-weight:
        700;

    color:
        #1e3a8a;

}


.name-line {

    width:
        360px;

    max-width:
        70%;

    height:
        1px;

    margin:
        auto;

    background:
        linear-gradient(
            90deg,
            transparent,
            #d4af37,
            transparent
        );

}


.description {

    text-align:
        center;

    margin-top:
        25px;

    color:
        #475569;

    font-size:
        15px;

}


.test-name {

    text-align:
        center;

    margin:
        12px auto 25px;

    font-size:
        25px;

    font-weight:
        800;

    color:
        #0f172a;

}


.affiliation {

    max-width:
        700px;

    margin:
        0 auto 28px;

    padding:
        14px 20px;

    text-align:
        center;

    border-radius:
        10px;

    background:
        #f8fafc;

    border:
        1px solid
        #e2e8f0;

    color:
        #334155;

    font-size:
        13px;

}


.affiliation strong {

    color:
        #1e3a8a;

}


.stats {

    display:
        grid;

    grid-template-columns:
        repeat(
            3,
            1fr
        );

    gap:
        16px;

    max-width:
        760px;

    margin:
        0 auto 28px;

}


.stat {

    padding:
        18px;

    text-align:
        center;

    border:
        1px solid
        #e2e8f0;

    border-radius:
        12px;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8fafc
        );

}


.stat-label {

    font-size:
        10px;

    font-weight:
        800;

    letter-spacing:
        1.5px;

    color:
        #64748b;

}


.stat-value {

    margin-top:
        7px;

    font-size:
        20px;

    font-weight:
        900;

    color:
        #1d4ed8;

}


.meta {

    text-align:
        center;

    font-size:
        12px;

    color:
        #64748b;

}


.meta strong {

    color:
        #0f172a;

}


.footer {

    display:
        grid;

    grid-template-columns:
        1fr
        150px
        1fr;

    align-items:
        end;

    gap:
        30px;

    margin-top:
        48px;

}


.signature {

    text-align:
        center;

}


.signature-name {

    font-family:
        "Brush Script MT",
        "Segoe Script",
        cursive;

    font-size:
        30px;

    color:
        #0f172a;

}


.signature-line {

    width:
        190px;

    height:
        1px;

    margin:
        5px auto;

    background:
        #334155;

}


.signature-role {

    font-size:
        11px;

    font-weight:
        800;

    color:
        #64748b;

}


.seal {

    width:
        115px;

    height:
        115px;

    margin:
        auto;

    border:
        4px solid
        #d4af37;

    border-radius:
        50%;

    display:
        flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    text-align:
        center;

    background:
        radial-gradient(
            circle,
            #fffdf0,
            #f8fafc
        );

    color:
        #92400e;

    font-size:
        10px;

    font-weight:
        900;

    letter-spacing:
        1px;

}


.seal-star {

    font-size:
        25px;

    color:
        #d4af37;

    margin-bottom:
        3px;

}


.issuer {

    text-align:
        center;

}


.issuer-name {

    font-size:
        14px;

    font-weight:
        900;

    color:
        #1e3a8a;

}


.issuer-sub {

    margin-top:
        5px;

    font-size:
        10px;

    color:
        #64748b;

    line-height:
        1.5;

}


.print-controls {

    position:
        fixed;

    bottom:
        20px;

    left:
        50%;

    transform:
        translateX(-50%);

    z-index:
        100;

}


.print-btn {

    border:
        none;

    border-radius:
        10px;

    padding:
        13px 22px;

    background:
        linear-gradient(
            135deg,
            #1d4ed8,
            #2563eb
        );

    color:
        white;

    font-weight:
        800;

    cursor:
        pointer;

    box-shadow:
        0 10px 25px
        rgba(
            37,
            99,
            235,
            .25
        );

}


@media (
    max-width:
    700px
) {

    body {

        padding:
            10px;

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

        gap:
            25px;

    }


    .seal {

        order:
            -1;

    }


    .title {

        font-size:
            32px;

    }


    .student-name {

        font-size:
            32px;

    }

}


@media print {

    @page {

        size:
            A4 landscape;

        margin:
            0;

    }


    body {

        padding:
            0;

        background:
            white;

    }


    .certificate {

        width:
            100vw;

        min-height:
            100vh;

        border-radius:
            0;

        box-shadow:
            none;

    }


    .print-controls {

        display:
            none;

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

            <strong>

                online assessment

            </strong>

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

                <div class="signature-name">

                    Priyanshu Mishra

                </div>

                <div class="signature-line"></div>

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
   ESCAPE CERTIFICATE TEXT
   ========================================================= */

function escapeCertificateText(
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
   ESCAPE HTML
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
   FORMAT DURATION
   ========================================================= */

function formatDuration(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0") +
        ":" +
        String(remainingSeconds)
            .padStart(2, "0")
    );

}


/* =========================================================
   SCROLL TO RESULT
   ========================================================= */

function scrollToResult() {

    setTimeout(
        function () {

            const result =
                document.getElementById(
                    "quizResult"
                );


            if (result) {

                result.scrollIntoView({
                    behavior:
                        "smooth",
                    block:
                        "center"
                });

            }

        },
        200
    );

}


/* =========================================================
   INJECT PREMIUM QUIZ STYLES
   ========================================================= */

function injectQuizStyles() {

    if (
        document.getElementById(
            "premiumQuizStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "premiumQuizStyles";


    style.textContent = `

        .premium-quiz-timer {

            margin:
                20px auto;

            max-width:
                850px;

            border:
                1px solid
                #dbeafe;

            border-radius:
                16px;

            background:
                linear-gradient(
                    135deg,
                    #ffffff,
                    #eff6ff
                );

            box-shadow:
                0 10px 30px
                rgba(
                    15,
                    23,
                    42,
                    .08
                );

            transition:
                .3s ease;

        }


        .quiz-timer-inner {

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            gap:
                12px;

            padding:
                16px;

        }


        .timer-icon {

            font-size:
                22px;

        }


        .timer-label {

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                1.5px;

            color:
                #64748b;

        }


        #quizTimerValue {

            font-size:
                25px;

            color:
                #1d4ed8;

            letter-spacing:
                1px;

        }


        .timer-warning {

            border-color:
                #f59e0b;

            background:
                #fffbeb;

        }


        .timer-warning #quizTimerValue {

            color:
                #d97706;

        }


        .timer-danger {

            border-color:
                #ef4444;

            background:
                #fef2f2;

            animation:
                timerPulse 1s infinite;

        }


        .timer-danger #quizTimerValue {

            color:
                #dc2626;

        }


        @keyframes timerPulse {

            50% {

                transform:
                    scale(1.01);

            }

        }


        .quiz-progress-box {

            max-width:
                850px;

            margin:
                0 auto 20px;

            padding:
                15px 18px;

            border:
                1px solid
                #e2e8f0;

            border-radius:
                14px;

            background:
                #ffffff;

        }


        .quiz-progress-top {

            display:
                flex;

            justify-content:
                space-between;

            gap:
                15px;

            margin-bottom:
                9px;

            font-size:
                13px;

            color:
                #64748b;

        }


        .quiz-progress-top strong {

            color:
                #1d4ed8;

        }


        .quiz-progress-track {

            width:
                100%;

            height:
                8px;

            border-radius:
                50px;

            background:
                #e2e8f0;

            overflow:
                hidden;

        }


        #quizProgressBar {

            height:
                100%;

            width:
                0%;

            border-radius:
                inherit;

            background:
                linear-gradient(
                    90deg,
                    #1d4ed8,
                    #60a5fa
                );

            transition:
                width .3s ease;

        }


        .premium-result-card {

            max-width:
                850px;

            margin:
                30px auto;

            padding:
                35px;

            border:
                1px solid
                #dbeafe;

            border-radius:
                22px;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #f8fafc
                );

            box-shadow:
                0 20px 50px
                rgba(
                    15,
                    23,
                    42,
                    .12
                );

            text-align:
                center;

        }


        .result-header h2 {

            margin:
                10px 0 5px;

            font-size:
                30px;

            color:
                #0f172a;

        }


        .result-header p {

            color:
                #64748b;

        }


        .result-badge {

            display:
                inline-block;

            padding:
                7px 14px;

            border-radius:
                50px;

            background:
                #dcfce7;

            color:
                #166534;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1px;

        }


        .result-score {

            display:
                flex;

            justify-content:
                center;

            margin:
                25px 0;

        }


        .score-circle {

            width:
                145px;

            height:
                145px;

            border-radius:
                50%;

            display:
                flex;

            flex-direction:
                column;

            justify-content:
                center;

            align-items:
                center;

            background:
                linear-gradient(
                    145deg,
                    #eff6ff,
                    #ffffff
                );

            border:
                8px solid
                #bfdbfe;

        }


        .score-circle strong {

            font-size:
                34px;

            color:
                #1d4ed8;

        }


        .score-circle span {

            font-size:
                11px;

            color:
                #64748b;

        }


        .result-grid {

            display:
                grid;

            grid-template-columns:
                repeat(
                    4,
                    1fr
                );

            gap:
                12px;

            margin:
                20px 0;

        }


        .result-stat {

            padding:
                16px 10px;

            border:
                1px solid
                #e2e8f0;

            border-radius:
                12px;

            background:
                #ffffff;

        }


        .result-stat span {

            display:
                block;

            font-size:
                9px;

            font-weight:
                800;

            color:
                #64748b;

            letter-spacing:
                1px;

        }


        .result-stat strong {

            display:
                block;

            margin-top:
                6px;

            font-size:
                20px;

            color:
                #1d4ed8;

        }


        .result-message {

            margin:
                20px 0;

            padding:
                15px;

            border-radius:
                12px;

            background:
                #f8fafc;

            color:
                #334155;

            font-weight:
                600;

        }


        .premium-certificate-btn {

            border:
                none;

            padding:
                14px 24px;

            border-radius:
                12px;

            background:
                linear-gradient(
                    135deg,
                    #1d4ed8,
                    #2563eb
                );

            color:
                #ffffff;

            font-size:
                14px;

            font-weight:
                800;

            cursor:
                pointer;

            box-shadow:
                0 12px 25px
                rgba(
                    37,
                    99,
                    235,
                    .25
                );

            transition:
                .25s ease;

        }


        .premium-certificate-btn:hover {

            transform:
                translateY(-2px);

            box-shadow:
                0 16px 30px
                rgba(
                    37,
                    99,
                    235,
                    .30
                );

        }


        .certificate-locked {

            padding:
                13px;

            border-radius:
                10px;

            background:
                #fff7ed;

            color:
                #9a3412;

            font-weight:
                700;

        }


        .certificate-id-display {

            margin-top:
                18px;

            font-size:
                12px;

            color:
                #64748b;

        }


        .certificate-id-display strong {

            color:
                #1e3a8a;

        }


        @media (
            max-width:
            700px
        ) {

            .result-grid {

                grid-template-columns:
                    repeat(
                        2,
                        1fr
                    );

            }


            .premium-result-card {

                padding:
                    22px;

            }


            .quiz-timer-inner {

                flex-wrap:
                    wrap;

            }

        }

    `;


    document.head.appendChild(
        style
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


    latestResult =
        null;


    alert(
        "Saved demo account data has been cleared."
    );

}


/* =========================================================
   GLOBAL SAFETY
   ========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (
            quizTimerInterval &&
            !quizSubmitted
        ) {

            /*
             * Timer is intentionally not saved between
             * page reloads to avoid corrupting an assessment.
             */

        }

    }
);


/* =========================================================
   END OF MAIN JAVASCRIPT
   ========================================================= */
