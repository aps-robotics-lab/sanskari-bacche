/* =========================================================
   TEACHERS' DAY — GLOBAL MAIN.JS
   Class 10th I
   Army Public School, Lal Bahadur Shastri Marg

   PERFORMANCE-FIRST / SILKY VERSION

   INCLUDED
   ✓ Scroll reveal
   ✓ Smooth anchor scrolling
   ✓ Report card on index.html
   ✓ Teacher report switching
   ✓ Moderate page-load confetti
   ✓ Moderate report-card confetti
   ✓ Message reveal support
   ✓ Back-to-home support
   ✓ Mobile optimization
   ✓ Reduced-motion support
   ✓ Hidden-tab protection
   ✓ Race-safe report rendering
   ✓ No particle canvas
   ✓ No cursor-following animation
   ✓ No continuous requestAnimationFrame
   ✓ No heavy parallax
   ✓ No unnecessary mouse calculations

   INTENTIONALLY REMOVED
   ✗ Particle system
   ✗ Particle canvas animation
   ✗ Cursor glow tracking
   ✗ Continuous animation loops
   ✗ Heavy JS hover effects
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       GLOBAL STATE
    ===================================================== */

    const root =
        document.documentElement;

    const body =
        document.body;

    const isMobile =
        window.matchMedia(
            "(max-width: 700px)"
        ).matches;

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    let pageIsVisible =
        !document.hidden;

    let confettiTimerA = null;
    let confettiTimerB = null;

    let reportRenderTimer = null;
    let reportAnimationTimer = null;

    let reportRenderVersion = 0;


    /* =====================================================
       PERFORMANCE STYLES
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
             * Keep the browser compositor focused
             * on the properties that are actually animated.
             */

            .reveal {
                will-change:
                    opacity,
                    transform;
            }


            /*
             * Remove legacy particle/cursor elements
             * without needing to edit every old HTML file.
             */

            #particleCanvas,
            .cursor-glow {
                display: none !important;
            }


            /*
             * Prevent mobile tap flash.
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
             * The report card uses opacity/transform
             * during teacher switching.
             */

            #reportPanel {
                will-change:
                    opacity,
                    transform;
            }


            /*
             * Don't keep will-change on everything.
             * It consumes memory.
             */

            .reveal.visible {
                will-change: auto;
            }


            /*
             * Accessibility / reduced motion.
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


            /*
             * Smaller blur on mobile.
             *
             * This does NOT remove the glass effect.
             * It simply reduces GPU work.
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

        `;


        document.head.appendChild(
            style
        );

    }


    /* =====================================================
       LEGACY EFFECT CLEANUP
    ===================================================== */

    function disableLegacyEffects() {

        /*
         * Particle canvas
         */

        const canvas =
            document.getElementById(
                "particleCanvas"
            );


        if (canvas) {

            /*
             * Shrinking the backing buffer to 1x1
             * prevents an old script from consuming
             * a large canvas buffer if it somehow still runs.
             */

            try {

                canvas.width = 1;
                canvas.height = 1;

            } catch (error) {
                /* Safe to ignore. */
            }


            canvas.style.display =
                "none";

        }


        /*
         * Cursor glow
         */

        const cursorGlow =
            document.getElementById(
                "cursorGlow"
            );


        if (cursorGlow) {

            cursorGlow.style.display =
                "none";

        }


        /*
         * Remove legacy canvas references from
         * pointer events where possible.
         */

        body.classList.add(
            "td-performance-mode"
        );

    }


    /* =====================================================
       SCROLL REVEAL
       
       IntersectionObserver only.
       No scroll event.
       No requestAnimationFrame.
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
         * Reduced-motion users should see
         * everything immediately.
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

                    element.style.willChange =
                        "auto";

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
                             * Once revealed, it never
                             * needs observation again.
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
                        "0px 0px -40px 0px"
                }
            );


        elements.forEach(
            element => {

                /*
                 * Elements already visible when
                 * the page loads shouldn't wait.
                 */

                const rect =
                    element.getBoundingClientRect();


                if (
                    rect.top <
                    window.innerHeight * 0.92
                ) {

                    element.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        element
                    );

                } else {

                    observer.observe(
                        element
                    );

                }

            }
        );

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLLING
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


                        let target = null;


                        try {

                            target =
                                document.querySelector(
                                    href
                                );

                        } catch (error) {

                            /*
                             * Invalid selector.
                             * Let browser handle it normally.
                             */

                            return;

                        }


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({

                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"

                        });

                    }
                );

            }
        );

    }


    /* =====================================================
       CONFETTI AVAILABILITY
    ===================================================== */

    function canUseConfetti() {

        if (
            prefersReducedMotion
        ) {
            return false;
        }


        if (
            !pageIsVisible
        ) {
            return false;
        }


        return (
            typeof window.confetti ===
            "function"
        );

    }


    /* =====================================================
       MODERATE PAGE CONFETTI
       
       Two sides.
       Moderate quantity.
       Short lifetime.
       No continuous animation.
    ===================================================== */

    function launchPageConfetti() {

        if (
            !canUseConfetti()
        ) {
            return;
        }


        /*
         * Avoid stacking timers.
         */

        clearTimeout(
            confettiTimerA
        );

        clearTimeout(
            confettiTimerB
        );


        /*
         * Give the browser time to finish
         * the first visual paint.
         */

        confettiTimerA =
            window.setTimeout(
                () => {

                    if (
                        !canUseConfetti()
                    ) {
                        return;
                    }


                    window.confetti({

                        particleCount:
                            isMobile
                                ? 34
                                : 48,

                        spread:
                            isMobile
                                ? 58
                                : 68,

                        startVelocity:
                            isMobile
                                ? 18
                                : 23,

                        gravity: 0.88,

                        scalar:
                            isMobile
                                ? 0.62
                                : 0.72,

                        ticks:
                            isMobile
                                ? 95
                                : 115,

                        origin: {
                            x: 0.10,
                            y: 0.46
                        }

                    });

                },
                900
            );


        /*
         * Second side.
         */

        confettiTimerB =
            window.setTimeout(
                () => {

                    if (
                        !canUseConfetti()
                    ) {
                        return;
                    }


                    window.confetti({

                        particleCount:
                            isMobile
                                ? 34
                                : 48,

                        spread:
                            isMobile
                                ? 58
                                : 68,

                        startVelocity:
                            isMobile
                                ? 18
                                : 23,

                        gravity: 0.88,

                        scalar:
                            isMobile
                                ? 0.62
                                : 0.72,

                        ticks:
                            isMobile
                                ? 95
                                : 115,

                        origin: {
                            x: 0.90,
                            y: 0.46
                        }

                    });

                },
                1050
            );

    }


    /* =====================================================
       SMALL CONFETTI
       
       Used for report-card changes.
    ===================================================== */

    function launchSmallConfetti() {

        if (
            !canUseConfetti()
        ) {
            return;
        }


        window.confetti({

            particleCount:
                isMobile
                    ? 16
                    : 24,

            spread: 46,

            startVelocity:
                isMobile
                    ? 15
                    : 18,

            gravity: 0.95,

            scalar:
                isMobile
                    ? 0.55
                    : 0.62,

            ticks:
                isMobile
                    ? 78
                    : 92,

            origin: {
                x: 0.50,
                y: 0.55
            }

        });

    }


    /* =====================================================
       REPORT CARD DATA
    ===================================================== */

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


    /* =====================================================
       SCORE SANITIZATION
    ===================================================== */

    function clampScore(
        value
    ) {

        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {
            return 0;
        }


        return Math.min(
            100,
            Math.max(
                0,
                number
            )
        );

    }


    /* =====================================================
       CREATE METRIC
    ===================================================== */

    function createMetric(
        label,
        score
    ) {

        const metric =
            document.createElement(
                "div"
            );


        metric.className =
            "metric";


        const safeScore =
            clampScore(
                score
            );


        /*
         * Build DOM using textContent
         * rather than injecting arbitrary content.
         */

        const top =
            document.createElement(
                "div"
            );

        top.className =
            "metric-top";


        const name =
            document.createElement(
                "div"
            );

        name.className =
            "metric-name";

        name.textContent =
            label;


        const scoreElement =
            document.createElement(
                "div"
            );

        scoreElement.className =
            "metric-score";

        scoreElement.textContent =
            `${safeScore}%`;


        top.appendChild(
            name
        );

        top.appendChild(
            scoreElement
        );


        const track =
            document.createElement(
                "div"
            );

        track.className =
            "metric-track";


        const fill =
            document.createElement(
                "div"
            );

        fill.className =
            "metric-fill";

        fill.dataset.score =
            String(safeScore);


        track.appendChild(
            fill
        );


        metric.appendChild(
            top
        );

        metric.appendChild(
            track
        );


        return metric;

    }


    /* =====================================================
       REPORT CARD
    ===================================================== */

    function initReportCard() {

        const select =
            document.getElementById(
                "teacherSelect"
            );


        /*
         * Teacher pages don't have this element.
         * Therefore this function exits immediately.
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
         * Fail safely if markup is incomplete.
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
             * Every render gets a unique version.
             *
             * If the user changes:
             *
             * Shonali → Ajay → Ariba
             *
             * quickly, an older delayed render can
             * no longer overwrite the latest one.
             */

            const version =
                ++reportRenderVersion;


            clearTimeout(
                reportRenderTimer
            );

            clearTimeout(
                reportAnimationTimer
            );


            if (animate) {

                reportPanel.style.opacity =
                    "0.55";

                reportPanel.style.transform =
                    "translateY(5px)";

            }


            reportRenderTimer =
                window.setTimeout(
                    () => {

                        /*
                         * Ignore obsolete render.
                         */

                        if (
                            version !==
                            reportRenderVersion
                        ) {
                            return;
                        }


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
                         * Efficient DOM replacement.
                         */

                        const fragment =
                            document.createDocumentFragment();


                        teacher.metrics.forEach(
                            ([label, score]) => {

                                fragment.appendChild(
                                    createMetric(
                                        label,
                                        score
                                    )
                                );

                            }
                        );


                        metrics.replaceChildren(
                            fragment
                        );


                        /*
                         * Let the browser commit the
                         * DOM update before transitioning.
                         */

                        reportAnimationTimer =
                            window.setTimeout(
                                () => {

                                    if (
                                        version !==
                                        reportRenderVersion
                                    ) {
                                        return;
                                    }


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
                                                    bar.dataset.score
                                                );


                                            bar.style.width =
                                                `${score}%`;

                                        }
                                    );


                                },
                                animate
                                    ? 25
                                    : 0
                            );


                    },
                    animate
                        ? 90
                        : 0
                );

        }


        /* =================================================
           INITIAL REPORT
        ================================================= */

        const initialKey =
            teacherData[
                select.value
            ]
                ? select.value
                : "shonali";


        /*
         * Keep the select synchronized if the
         * HTML happens to have an invalid value.
         */

        if (
            select.value !==
            initialKey
        ) {

            select.value =
                initialKey;

        }


        renderReport(
            initialKey,
            false
        );


        /* =================================================
           SELECT CHANGE
        ================================================= */

        select.addEventListener(
            "change",
            () => {

                const selected =
                    select.value;


                if (
                    !teacherData[selected]
                ) {
                    return;
                }


                renderReport(
                    selected,
                    true
                );


                launchSmallConfetti();

            }
        );

    }


    /* =====================================================
       MESSAGE REVEAL SYSTEM
       
       Supports different versions of the HTML.

       The current website can use any of these:

       #messageButton
       .message-button
       [data-message-button]

       And:

       #classMessage
       .class-message
       [data-class-message]
    ===================================================== */

    function initMessageReveal() {

        const button =
            document.getElementById(
                "messageButton"
            ) ||
            document.querySelector(
                ".message-button"
            ) ||
            document.querySelector(
                "[data-message-button]"
            );


        const message =
            document.getElementById(
                "classMessage"
            ) ||
            document.querySelector(
                ".class-message"
            ) ||
            document.querySelector(
                "[data-class-message]"
            );


        /*
         * If this page doesn't contain the
         * message interaction, do nothing.
         */

        if (
            !button ||
            !message
        ) {
            return;
        }


        /*
         * Start hidden only if it has the
         * expected hidden class.
         *
         * We don't force display:none because
         * that could break an existing design.
         */

        button.addEventListener(
            "click",
            () => {

                const isOpen =
                    message.classList.contains(
                        "visible"
                    ) ||
                    message.classList.contains(
                        "show"
                    ) ||
                    message.classList.contains(
                        "active"
                    );


                if (isOpen) {
                    return;
                }


                message.classList.add(
                    "visible",
                    "show",
                    "active"
                );


                button.classList.add(
                    "used"
                );


                /*
                 * Accessibility.
                 */

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );


                /*
                 * Small celebration only.
                 */

                launchSmallConfetti();


                /*
                 * Move focus to the message
                 * when possible.
                 */

                if (
                    !prefersReducedMotion
                ) {

                    window.setTimeout(
                        () => {

                            try {

                                message.scrollIntoView({
                                    behavior:
                                        "smooth",

                                    block:
                                        "center"
                                });

                            } catch (error) {
                                /* Ignore. */
                            }

                        },
                        80
                    );

                }

            }
        );

    }


    /* =====================================================
       TEACHER PAGE DETECTION
    ===================================================== */

    function getCurrentPage() {

        const path =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        if (
            !path ||
            path === "index.html"
        ) {
            return "index";
        }


        return path.replace(
            ".html",
            ""
        );

    }


    /* =====================================================
       BACK-TO-HOME SAFETY
       
       We don't add click handlers.
       Normal <a href="index.html"> navigation
       is faster and more reliable.
    ===================================================== */

    function initBackHome() {

        const backButtons =
            document.querySelectorAll(
                '.back-home, [data-back-home]'
            );


        if (!backButtons.length) {
            return;
        }


        backButtons.forEach(
            button => {

                /*
                 * Accessibility enhancement only.
                 */

                if (
                    button.tagName ===
                    "A"
                ) {

                    button.setAttribute(
                        "aria-label",
                        "Back to Home"
                    );

                }

            }
        );

    }


    /* =====================================================
       INTERNAL HTML LINKS
       
       No network requests.
       No fetch.
       No validation loop.
       
       The browser handles these naturally.
    ===================================================== */

    function prepareInternalLinks() {

        const links =
            document.querySelectorAll(
                'a[href$=".html"]'
            );


        if (!links.length) {
            return;
        }


        links.forEach(
            link => {

                /*
                 * Avoid opening teacher pages
                 * in a new tab.
                 */

                if (
                    link.hasAttribute(
                        "target"
                    )
                ) {
                    return;
                }


                /*
                 * Nothing else is needed.
                 *
                 * Keeping navigation native is
                 * one of the performance optimizations.
                 */

            }
        );

    }


    /* =====================================================
       VISIBILITY MANAGEMENT
       
       Prevents delayed effects from firing
       after the user leaves the tab.
    ===================================================== */

    function initVisibilityHandling() {

        document.addEventListener(
            "visibilitychange",
            () => {

                pageIsVisible =
                    !document.hidden;


                if (
                    !pageIsVisible
                ) {

                    /*
                     * Cancel page confetti
                     * that hasn't started yet.
                     */

                    clearTimeout(
                        confettiTimerA
                    );

                    clearTimeout(
                        confettiTimerB
                    );

                }

            }
        );

    }


    /* =====================================================
       MEMORY / TIMER CLEANUP
    ===================================================== */

    function cleanupTimers() {

        window.addEventListener(
            "pagehide",
            () => {

                clearTimeout(
                    confettiTimerA
                );

                clearTimeout(
                    confettiTimerB
                );

                clearTimeout(
                    reportRenderTimer
                );

                clearTimeout(
                    reportAnimationTimer
                );

            },
            {
                once: true
            }
        );

    }


    /* =====================================================
       IMAGE PERFORMANCE
       
       Only adds lazy loading to images that
       don't already specify a loading strategy.
       
       Hero/first-view images remain untouched.
    ===================================================== */

    function optimizeImages() {

        const images =
            document.querySelectorAll(
                "img"
            );


        if (!images.length) {
            return;
        }


        images.forEach(
            image => {

                /*
                 * Don't override an explicit
                 * developer decision.
                 */

                if (
                    image.hasAttribute(
                        "loading"
                    )
                ) {
                    return;
                }


                const rect =
                    image.getBoundingClientRect();


                /*
                 * Images currently near the
                 * viewport should load normally.
                 */

                if (
                    rect.top <
                    window.innerHeight * 1.2
                ) {
                    return;
                }


                image.loading =
                    "lazy";


                image.decoding =
                    "async";

            }
        );

    }


    /* =====================================================
       MOBILE GLASS OPTIMIZATION
       
       Only activates when the device is mobile.
    ===================================================== */

    function optimizeMobileGlass() {

        if (!isMobile) {
            return;
        }


        /*
         * Don't rewrite the entire stylesheet.
         * Add one lightweight class so CSS can
         * selectively reduce expensive effects.
         */

        root.classList.add(
            "td-mobile"
        );

    }


    /* =====================================================
       PAGE INITIALIZATION
    ===================================================== */

    function init() {

        /*
         * First: make sure old systems are disabled.
         */

        addPerformanceStyles();

        disableLegacyEffects();


        /*
         * Core interactions.
         */

        initReveal();

        initSmoothAnchors();

        initReportCard();

        initMessageReveal();

        initBackHome();

        prepareInternalLinks();


        /*
         * Performance.
         */

        optimizeImages();

        optimizeMobileGlass();


        /*
         * Tab visibility / cleanup.
         */

        initVisibilityHandling();

        cleanupTimers();


        /*
         * Celebration LAST.
         *
         * This prevents confetti from competing
         * with the initial layout.
         */

        launchPageConfetti();

    }


    /* =====================================================
       START
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
