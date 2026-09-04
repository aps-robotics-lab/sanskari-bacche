/* =========================================================
   TEACHERS' DAY — GLOBAL MAIN.JS
   Class 10th I
   Army Public School, Lal Bahadur Shastri Marg

   PERFORMANCE-FIRST / SILKY SCROLL VERSION

   INCLUDED
   ✓ Silky native scrolling
   ✓ Smooth anchor scrolling
   ✓ Scroll reveal
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
   ✓ Image optimization
   ✓ Legacy particle cleanup
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
   ✗ Heavy parallax
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


    let confettiTimerA =
        null;

    let confettiTimerB =
        null;


    let reportRenderTimer =
        null;

    let reportAnimationTimer =
        null;


    let reportRenderVersion =
        0;


    /* =====================================================
       PERFORMANCE STYLES

       Important:
       We use CSS native scrolling rather than a JS
       animation loop.

       This is much lighter than Lenis-style continuous
       RAF scrolling on low-end phones.
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
            document.createElement(
                "style"
            );


        style.id =
            "td-performance-styles";


        style.textContent = `

            /* ==========================================
               GLOBAL SCROLL
            ========================================== */

            html {

                scroll-behavior:
                    smooth;

                scroll-padding-top:
                    100px;

                overscroll-behavior-y:
                    auto;

            }


            body {

                overscroll-behavior-y:
                    auto;

                -webkit-tap-highlight-color:
                    transparent;

            }


            /*
             * Keep touch scrolling controlled by
             * the browser compositor.
             */

            * {

                -webkit-tap-highlight-color:
                    transparent;

            }


            /*
             * Prevent accidental horizontal
             * overflow from making scrolling feel bad.
             */

            html,
            body {

                max-width:
                    100%;

                overflow-x:
                    hidden;

            }


            /* ==========================================
               REVEAL PERFORMANCE
            ========================================== */

            .reveal {

                will-change:
                    opacity,
                    transform;

            }


            .reveal.visible {

                will-change:
                    auto;

            }


            /* ==========================================
               LEGACY EFFECT CLEANUP
            ========================================== */

            #particleCanvas,
            .cursor-glow {

                display:
                    none !important;

            }


            /* ==========================================
               REPORT CARD
            ========================================== */

            #reportPanel {

                will-change:
                    opacity,
                    transform;

            }


            /* ==========================================
               INTERACTIVE ELEMENTS
            ========================================== */

            .teacher,
            .teacher-arrow,
            .explore,
            button,
            a {

                -webkit-tap-highlight-color:
                    transparent;

            }


            /* ==========================================
               MOBILE GLASS OPTIMIZATION
            ========================================== */

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


            /* ==========================================
               REDUCED MOTION
            ========================================== */

            @media (prefers-reduced-motion: reduce) {

                html {

                    scroll-behavior:
                        auto !important;

                }


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
       SILKY SCROLL

       IMPORTANT:

       We do NOT hijack wheel scrolling.

       We do NOT create a requestAnimationFrame loop.

       We do NOT interpolate scroll position manually.

       Instead we allow the browser compositor to handle
       normal scrolling and only improve anchor navigation.

       This gives the safest performance on:

       ✓ Android
       ✓ iPhone
       ✓ low-end devices
       ✓ laptops
       ✓ desktop browsers
    ===================================================== */

    function initSilkyScroll() {

        /*
         * Reduced motion:
         * browser handles normal scrolling.
         */

        if (
            prefersReducedMotion
        ) {

            root.style.scrollBehavior =
                "auto";

            return;

        }


        /*
         * Desktop / modern browsers:
         * native smooth scrolling is enough.
         */

        root.style.scrollBehavior =
            "smooth";


        /*
         * Mobile browsers are intentionally
         * left completely native.
         *
         * Do NOT add wheel/touch interception.
         */

        if (isMobile) {

            root.style.scrollBehavior =
                "smooth";

        }

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

            try {

                canvas.width =
                    1;

                canvas.height =
                    1;

            } catch (error) {
                /* Ignore safely. */
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
         * Legacy cursor glow may also
         * use this class.
         */

        document
            .querySelectorAll(
                ".cursor-glow"
            )
            .forEach(
                element => {

                    element.style.display =
                        "none";

                }
            );


        body.classList.add(
            "td-performance-mode"
        );

    }


    /* =====================================================
       SCROLL REVEAL

       IntersectionObserver only.

       NO scroll event.
       NO RAF.
       NO polling.
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
         * Reduced motion users:
         * immediately reveal everything.
         */

        if (
            prefersReducedMotion ||
            !(
                "IntersectionObserver"
                in window
            )
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


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {

                    threshold:
                        0.08,

                    rootMargin:
                        "0px 0px -40px 0px"

                }
            );


        elements.forEach(
            element => {

                /*
                 * Immediately reveal things
                 * already visible.
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

                    element.style.willChange =
                        "auto";

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

       Handles:

       #home
       #teachers
       #message
       etc.

       No animation loop.
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


                        let target =
                            null;


                        try {

                            target =
                                document.querySelector(
                                    href
                                );

                        } catch (error) {

                            return;

                        }


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        /*
                         * Respect reduced motion.
                         */

                        target.scrollIntoView({

                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"

                        });


                        /*
                         * Update URL without
                         * forcing another page jump.
                         */

                        try {

                            history.replaceState(
                                null,
                                "",
                                href
                            );

                        } catch (error) {
                            /* Ignore. */
                        }

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
       PAGE CONFETTI
       
       Kept moderate because confetti itself
       can cause rendering spikes.
    ===================================================== */

    function launchPageConfetti() {

        if (
            !canUseConfetti()
        ) {
            return;
        }


        clearTimeout(
            confettiTimerA
        );

        clearTimeout(
            confettiTimerB
        );


        /*
         * Delay until initial rendering
         * has settled.
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
                                ? 28
                                : 42,

                        spread:
                            isMobile
                                ? 55
                                : 65,

                        startVelocity:
                            isMobile
                                ? 17
                                : 21,

                        gravity:
                            0.88,

                        scalar:
                            isMobile
                                ? 0.60
                                : 0.70,

                        ticks:
                            isMobile
                                ? 90
                                : 110,

                        origin: {

                            x:
                                0.10,

                            y:
                                0.46

                        }

                    });

                },
                1000
            );


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
                                ? 28
                                : 42,

                        spread:
                            isMobile
                                ? 55
                                : 65,

                        startVelocity:
                            isMobile
                                ? 17
                                : 21,

                        gravity:
                            0.88,

                        scalar:
                            isMobile
                                ? 0.60
                                : 0.70,

                        ticks:
                            isMobile
                                ? 90
                                : 110,

                        origin: {

                            x:
                                0.90,

                            y:
                                0.46

                        }

                    });

                },
                1150
            );

    }


    /* =====================================================
       SMALL CONFETTI
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
                    ? 12
                    : 20,

            spread:
                44,

            startVelocity:
                isMobile
                    ? 14
                    : 17,

            gravity:
                0.95,

            scalar:
                isMobile
                    ? 0.52
                    : 0.60,

            ticks:
                isMobile
                    ? 72
                    : 88,

            origin: {

                x:
                    0.50,

                y:
                    0.55

            }

        });

    }


    /* =====================================================
       TEACHER DATA
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

       Uses DOM methods instead of innerHTML.
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
            String(
                safeScore
            );


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
         * Teacher pages don't have this.
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
             * Version prevents old timers from
             * overwriting newer selections.
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
                         * Build metrics off-DOM.
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
       MESSAGE REVEAL
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


        if (
            !button ||
            !message
        ) {

            return;

        }


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


                button.setAttribute(
                    "aria-expanded",
                    "true"
                );


                launchSmallConfetti();


                /*
                 * Give the browser one frame to
                 * apply the new class before scrolling.
                 *
                 * This is NOT a continuous animation loop.
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
                                /* Ignore safely. */
                            }

                        },
                        80
                    );

                }

            }
        );

    }


    /* =====================================================
       PAGE DETECTION
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
       BACK TO HOME
    ===================================================== */

    function initBackHome() {

        const backButtons =
            document.querySelectorAll(
                ".back-home, [data-back-home]"
            );


        if (!backButtons.length) {
            return;
        }


        backButtons.forEach(
            button => {

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
       INTERNAL LINKS

       No fetch.
       No preload.
       No network validation.
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
                 * Intentionally do nothing.
                 *
                 * Native navigation is the fastest
                 * and most reliable option.
                 */

            }
        );

    }


    /* =====================================================
       VISIBILITY MANAGEMENT
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
       TIMER CLEANUP
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

       Only lazy-load images outside the initial
       viewport.

       Existing loading attributes are respected.
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
                 * Keep hero images immediate.
                 */

                if (
                    rect.top <
                    window.innerHeight * 1.2
                ) {

                    image.decoding =
                        "async";

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
       MOBILE OPTIMIZATION
    ===================================================== */

    function optimizeMobileGlass() {

        if (!isMobile) {
            return;
        }


        root.classList.add(
            "td-mobile"
        );

    }


    /* =====================================================
       PREVENT OLD BODY SCROLL LOCK
       
       Some old versions of the website may have left
       overflow:hidden on body/html.
       
       We only correct it if explicitly caused by an
       old performance mode.
    ===================================================== */

    function normalizeScrollState() {

        /*
         * Do NOT force overflow:auto globally.
         *
         * That can break modals.
         *
         * Only remove accidental inline
         * scroll-behavior settings.
         */

        if (
            root.style.scrollBehavior ===
            "auto"
        ) {

            if (
                !prefersReducedMotion
            ) {

                root.style.scrollBehavior =
                    "smooth";

            }

        }

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function init() {

        /*
         * Performance setup FIRST.
         */

        addPerformanceStyles();

        disableLegacyEffects();


        /*
         * Scroll system.
         */

        initSilkyScroll();

        normalizeScrollState();


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
         * Performance optimizations.
         */

        optimizeImages();

        optimizeMobileGlass();


        /*
         * Tab / lifecycle handling.
         */

        initVisibilityHandling();

        cleanupTimers();


        /*
         * Celebration LAST.
         *
         * Never during first paint.
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
