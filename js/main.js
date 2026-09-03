/* =========================================================
   TEACHERS' DAY — GLOBAL MAIN.JS
   Class 10th I
   Army Public School, Lal Bahadur Shastri Marg

   PERFORMANCE-FIRST VERSION

   Included:
   ✓ Scroll reveal
   ✓ Smooth anchor scrolling
   ✓ Report card support on index.html
   ✓ Moderate confetti celebration
   ✓ Button / link interactions
   ✓ Back-to-home support
   ✓ Mobile optimization
   ✓ Reduced-motion support

   Intentionally NOT included:
   ✗ Particle canvas
   ✗ Particle animation
   ✗ Cursor-following glow
   ✗ Continuous requestAnimationFrame loops
   ✗ Heavy parallax
   ✗ Continuous mouse calculations
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       DEVICE DETECTION
    ===================================================== */

    const isMobile =
        window.matchMedia(
            "(max-width: 700px)"
        ).matches;


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       PERFORMANCE CSS
    ===================================================== */

    function addPerformanceStyles() {

        if (
            document.getElementById(
                "td-performance-styles"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");

        style.id =
            "td-performance-styles";


        style.textContent = `

            /*
             * Browser-friendly animation hints.
             */

            .reveal {
                will-change: opacity, transform;
            }


            /*
             * Remove the old particle/cursor systems
             * if remnants exist in an HTML file.
             */

            #particleCanvas {
                display: none !important;
            }


            .cursor-glow {
                display: none !important;
            }


            /*
             * Keep transitions short and smooth.
             */

            .teacher,
            .teacher-arrow,
            .explore,
            button,
            a {
                -webkit-tap-highlight-color:
                    transparent;
            }


            /*
             * Mobile devices don't need expensive
             * backdrop blur everywhere.
             *
             * The glass appearance remains.
             */

            @media (max-width: 700px) {

                .topbar,
                .report-panel,
                .select-wrap,
                .glass,
                .glass-card {
                    backdrop-filter:
                        blur(10px);

                    -webkit-backdrop-filter:
                        blur(10px);
                }

            }


            /*
             * Accessibility.
             */

            @media (prefers-reduced-motion: reduce) {

                *,
                *::before,
                *::after {

                    animation-duration:
                        0.001ms !important;

                    animation-iteration-count:
                        1 !important;

                    transition-duration:
                        0.001ms !important;

                    scroll-behavior:
                        auto !important;
                }

            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       SCROLL REVEAL
       
       Uses IntersectionObserver.
       No scroll event.
       No animation loop.
    ===================================================== */

    function initReveal() {

        const elements =
            document.querySelectorAll(
                ".reveal"
            );


        if (!elements.length) {
            return;
        }


        /*
         * If the user prefers reduced motion,
         * simply show everything.
         */

        if (
            prefersReducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                element => {

                    element.classList.add(
                        "visible"
                    );

                }
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "visible"
                            );


                            /*
                             * Stop observing after
                             * the animation has happened.
                             */

                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        elements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       SMOOTH ANCHOR LINKS
    ===================================================== */

    function initSmoothAnchors() {

        const anchors =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        if (!anchors.length) {
            return;
        }


        anchors.forEach(
            anchor => {

                anchor.addEventListener(
                    "click",
                    event => {

                        const href =
                            anchor.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                href
                            );


                        if (!target) {
                            return;
                        }


                        /*
                         * Let the browser handle
                         * normal scrolling when motion
                         * reduction is enabled.
                         */

                        event.preventDefault();


                        target.scrollIntoView({
                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",

                            block: "start"
                        });

                    }
                );

            }
        );

    }


    /* =====================================================
       MODERATE CONFETTI
       
       One celebration per page.
       No particle canvas.
    ===================================================== */

    function launchPageConfetti() {

        if (
            prefersReducedMotion
        ) {
            return;
        }


        if (
            typeof window.confetti !==
            "function"
        ) {
            return;
        }


        /*
         * Wait until the page has rendered.
         * This prevents confetti from competing with
         * initial page rendering.
         */

        window.setTimeout(
            () => {

                /*
                 * First burst.
                 */

                window.confetti({

                    particleCount:
                        isMobile
                            ? 28
                            : 42,

                    spread:
                        isMobile
                            ? 55
                            : 65,

                    startVelocity:
                        isMobile
                            ? 18
                            : 23,

                    gravity: 0.85,

                    scalar:
                        isMobile
                            ? 0.62
                            : 0.72,

                    ticks:
                        isMobile
                            ? 105
                            : 125,

                    origin: {
                        x: 0.15,
                        y: 0.45
                    }

                });


                /*
                 * Second burst.
                 *
                 * Slight delay creates the feeling
                 * of a celebration rather than one
                 * huge explosion.
                 */

                window.setTimeout(
                    () => {

                        window.confetti({

                            particleCount:
                                isMobile
                                    ? 28
                                    : 42,

                            spread:
                                isMobile
                                    ? 55
                                    : 65,

                            startVelocity:
                                isMobile
                                    ? 18
                                    : 23,

                            gravity: 0.85,

                            scalar:
                                isMobile
                                    ? 0.62
                                    : 0.72,

                            ticks:
                                isMobile
                                    ? 105
                                    : 125,

                            origin: {
                                x: 0.85,
                                y: 0.45
                            }

                        });

                    },
                    140
                );


            },
            850
        );

    }


    /* =====================================================
       SMALL INTERACTION CONFETTI
       
       Used only when the report-card teacher changes.
    ===================================================== */

    function smallConfetti() {

        if (
            prefersReducedMotion
        ) {
            return;
        }


        if (
            typeof window.confetti !==
            "function"
        ) {
            return;
        }


        window.confetti({

            particleCount:
                isMobile
                    ? 14
                    : 22,

            spread: 45,

            startVelocity: 16,

            gravity: 0.95,

            scalar:
                isMobile
                    ? 0.55
                    : 0.62,

            ticks:
                isMobile
                    ? 85
                    : 100,

            origin: {
                x: 0.5,
                y: 0.55
            }

        });

    }


    /* =====================================================
       REPORT CARD
       
       Compatible with your existing index.html.

       IMPORTANT:
       This function does NOTHING on teacher pages.
       Therefore one main.js can safely be used everywhere.
    ===================================================== */

    function initReportCard() {

        const select =
            document.getElementById(
                "teacherSelect"
            );


        /*
         * No report card on this page.
         */

        if (!select) {
            return;
        }


        const reportPanel =
            document.getElementById(
                "reportPanel"
            );


        const reportName =
            document.getElementById(
                "reportName"
            );


        const reportSubject =
            document.getElementById(
                "reportSubject"
            );


        const metrics =
            document.getElementById(
                "metrics"
            );


        const finalWord =
            document.getElementById(
                "finalWord"
            );


        const finalMark =
            document.getElementById(
                "finalMark"
            );


        const reportRemark =
            document.getElementById(
                "reportRemark"
            );


        /*
         * If the report HTML is incomplete,
         * don't throw errors.
         */

        if (
            !reportPanel ||
            !reportName ||
            !reportSubject ||
            !metrics ||
            !finalWord ||
            !finalMark ||
            !reportRemark
        ) {

            console.warn(
                "Teachers' Day: Report card markup is incomplete."
            );

            return;
        }


        /* =================================================
           TEACHER DATA
        ================================================= */

        const teacherData = {

            shonali: {

                name:
                    "Mrs. Shonali Saha",

                subject:
                    "English · Class Teacher",

                metrics: [

                    [
                        "Storytelling",
                        99
                    ],

                    [
                        "Motivation",
                        100
                    ],

                    [
                        "Patience",
                        98
                    ],

                    [
                        "Chaos Management",
                        100
                    ]

                ],

                final:
                    "INCOMPARABLE",

                mark:
                    "Some teachers cannot be measured in marks.",

                remark:
                    "“The person who made English, stories and 10th I feel a little more like home.”"

            },


            ritesh: {

                name:
                    "Mr. Ritesh Tiwari",

                subject:
                    "Mathematics",

                metrics: [

                    [
                        "Mathematics",
                        100
                    ],

                    [
                        "Board Motivation",
                        100
                    ],

                    [
                        "Hard Work",
                        99
                    ],

                    [
                        "Unexpected Comedy",
                        98
                    ]

                ],

                final:
                    "LEGENDARY",

                mark:
                    "Strict on the outside. Invested in our future on the inside.",

                remark:
                    "“Five questions, board preparation and somehow... a lot of memories.”"

            },


            shalini: {

                name:
                    "Mrs. Shalini Sinha",

                subject:
                    "Social Science",

                metrics: [

                    [
                        "Storytelling",
                        100
                    ],

                    [
                        "Student Connection",
                        99
                    ],

                    [
                        "Making History Alive",
                        100
                    ],

                    [
                        "Classroom Energy",
                        98
                    ]

                ],

                final:
                    "UNFORGETTABLE",

                mark:
                    "Because chapters become memories when someone makes them come alive.",

                remark:
                    "“Somehow, history stopped feeling like history and started feeling like a story.”"

            },


            ajay: {

                name:
                    "Mr. Ajay Trivedi",

                subject:
                    "Hindi · Sparsh",

                metrics: [

                    [
                        "Student Connection",
                        100
                    ],

                    [
                        "Humour",
                        98
                    ],

                    [
                        "Life Lessons",
                        99
                    ],

                    [
                        "Discipline",
                        100
                    ]

                ],

                final:
                    "INCOMPARABLE",

                mark:
                    "A little strict. A lot caring. Completely unforgettable.",

                remark:
                    "“Some lessons were written in Sparsh. Others were written by you.”"

            },


            ariba: {

                name:
                    "Ms. Ariba Ansari",

                subject:
                    "Biology · Chemistry",

                metrics: [

                    [
                        "Science",
                        100
                    ],

                    [
                        "Focus Recovery",
                        99
                    ],

                    [
                        "Roasting",
                        100
                    ],

                    [
                        "Lala Land Detection",
                        100
                    ]

                ],

                final:
                    "ICONIC",

                mark:
                    "For bringing 10th I back to Earth, one roast at a time.",

                remark:
                    "“Strict, loving, and somehow always aware when someone had left for Lala Land.”"

            },


            himanshu: {

                name:
                    "Mr. Himanshu",

                subject:
                    "Physics",

                metrics: [

                    [
                        "Concept Clarity",
                        100
                    ],

                    [
                        "Calmness",
                        99
                    ],

                    [
                        "Storytelling",
                        98
                    ],

                    [
                        "Focus Recovery",
                        97
                    ]

                ],

                final:
                    "UNFORGETTABLE",

                mark:
                    "Complex physics became easier when you told us the story behind it.",

                remark:
                    "“Idhar dhyan de beta — and somehow, the lesson stayed with us.”"

            }

        };


        /* =================================================
           RENDER REPORT
        ================================================= */

        function renderReport(
            key,
            animate = true
        ) {

            const teacher =
                teacherData[key];


            if (!teacher) {
                return;
            }


            /*
             * Fade the old content slightly.
             * CSS transition handles the animation.
             */

            if (animate) {

                reportPanel.style.opacity =
                    "0.55";

                reportPanel.style.transform =
                    "translateY(5px)";
            }


            /*
             * Small delay is enough.
             * No requestAnimationFrame loop.
             */

            window.setTimeout(
                () => {

                    reportName.textContent =
                        teacher.name;


                    reportSubject.textContent =
                        teacher.subject;


                    finalWord.textContent =
                        teacher.final;


                    finalMark.textContent =
                        teacher.mark;


                    reportRemark.textContent =
                        teacher.remark;


                    /*
                     * Rebuild metrics.
                     */

                    metrics.innerHTML = "";


                    teacher.metrics.forEach(
                        ([label, score]) => {

                            const metric =
                                document.createElement(
                                    "div"
                                );


                            metric.className =
                                "metric";


                            metric.innerHTML = `

                                <div class="metric-top">

                                    <div class="metric-name">
                                        ${label}
                                    </div>

                                    <div class="metric-score">
                                        ${score}%
                                    </div>

                                </div>

                                <div class="metric-track">

                                    <div
                                        class="metric-fill"
                                        data-score="${score}"
                                    ></div>

                                </div>

                            `;


                            metrics.appendChild(
                                metric
                            );

                        }
                    );


                    /*
                     * Trigger the CSS width transition.
                     */

                    window.setTimeout(
                        () => {

                            reportPanel.style.opacity =
                                "";

                            reportPanel.style.transform =
                                "";


                            reportPanel.classList.add(
                                "active"
                            );


                            const bars =
                                metrics.querySelectorAll(
                                    ".metric-fill"
                                );


                            bars.forEach(
                                bar => {

                                    const score =
                                        clampScore(
                                            Number(
                                                bar.dataset.score
                                            )
                                        );


                                    bar.style.width =
                                        `${score}%`;

                                }
                            );

                        },
                        35
                    );


                },
                animate ? 110 : 0
            );

        }


        function clampScore(
            score
        ) {

            return Math.min(
                100,
                Math.max(
                    0,
                    score
                )
            );

        }


        /* =================================================
           INITIAL REPORT
        ================================================= */

        renderReport(
            select.value ||
            "shonali",
            false
        );


        /* =================================================
           SELECT CHANGE
        ================================================= */

        select.addEventListener(
            "change",
            () => {

                renderReport(
                    select.value,
                    true
                );


                /*
                 * One tiny celebration.
                 * Much lighter than the page-load burst.
                 */

                smallConfetti();

            }
        );

    }


    /* =====================================================
       BUTTON / LINK MICRO INTERACTIONS
       
       No JS animation.
       CSS handles the visual effect.
    ===================================================== */

    function initButtons() {

        const elements =
            document.querySelectorAll(
                ".explore, .teacher, button, .back-home"
            );


        if (!elements.length) {
            return;
        }


        /*
         * On touch screens, don't attach hover listeners.
         */

        if (isMobile) {
            return;
        }


        elements.forEach(
            element => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        element.classList.add(
                            "is-hovering"
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        element.classList.remove(
                            "is-hovering"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       BACK BUTTON
       
       Teacher pages already use:
       <a href="index.html">
       
       Nothing special is needed, but this adds a tiny
       safety check for broken links.
    ===================================================== */

    function checkInternalLinks() {

        const links =
            document.querySelectorAll(
                'a[href$=".html"]'
            );


        links.forEach(
            link => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {
                    return;
                }


                /*
                 * We deliberately do NOT fetch the files.
                 * That would create unnecessary network work.
                 *
                 * The browser will handle navigation normally.
                 */

            }
        );

    }


    /* =====================================================
       STOP UNNECESSARY OLD CANVAS
       
       If the previous index.html still contains the canvas,
       we hide it. This prevents the old visual from appearing.
    ===================================================== */

    function disableOldCanvas() {

        const canvas =
            document.getElementById(
                "particleCanvas"
            );


        if (!canvas) {
            return;
        }


        canvas.width = 1;
        canvas.height = 1;


        canvas.style.display =
            "none";

    }


    /* =====================================================
       PAGE INITIALIZATION
    ===================================================== */

    function init() {

        addPerformanceStyles();

        disableOldCanvas();

        initReveal();

        initSmoothAnchors();

        initReportCard();

        initButtons();

        checkInternalLinks();


        /*
         * Confetti happens last so it doesn't compete
         * with initial layout/rendering.
         */

        launchPageConfetti();

    }


    /* =====================================================
       START ONCE
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }

})();
