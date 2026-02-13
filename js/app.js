/* ============================================
   SAN VALENTINO — Interactive Logic
   ============================================ */

(function () {
    'use strict';

    // ---- DOM References ----
    const questionScreen = document.getElementById('questionScreen');
    const successScreen = document.getElementById('successScreen');
    const meaningScreen = document.getElementById('meaningScreen'); // New
    const poemScreen = document.getElementById('poemScreen');

    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const btnToMeaning = document.getElementById('btnToMeaning'); // Renamed from btnPoem
    const btnGoToPoem = document.getElementById('btnGoToPoem'); // New
    const btnPoemBack = document.getElementById('btnPoemBack');

    const floatingHeartsContainer = document.getElementById('floatingHearts');

    // Meaning screen elements
    const meaningTitle = document.getElementById('meaningTitle');
    const meaningReveal = document.getElementById('meaningReveal');
    const meaningContent = document.getElementById('meaningContent');

    // ---- State ----
    let noAttempts = 0;
    const isTouchDevice = matchMedia('(pointer: coarse)').matches;

    // Growing "Sì" messages for each attempt
    const yesMessages = [
        'Sì! ❤️',
        'Sììì! ❤️❤️❤️',
        'SÌÌÌ! 🥰🥰🥰',
        'SÌÌÌÌ! 😍😍😍',
        'SÌÌÌÌÌ! 💘💘💘',
        'DAI DILLO! 🥺💖💖💖',
        'SÌÌÌÌÌÌ! 🫶🫶🫶',
    ];

    // Teasing "No" replacement texts (mobile)
    const noTeaseTexts = [
        'Sicura? 🤔',
        'Ripensaci!!!!!',
        'Ma dai... 🥺🥺🥺',
        'Impossibile! 💔💔💔',
        'Riprova! 😤😤😤',
        'Sì! ❤️❤️❤️',  // finally transforms
    ];

    // ============================================
    // FLOATING HEARTS BACKGROUND
    // ============================================
    function createFloatingHearts() {
        const hearts = ['💕', '💗', '💖', '❤️', '💘', '🩷', '🤍'];
        const count = isTouchDevice ? 12 : 20;

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (6 + Math.random() * 8) + 's';
            heart.style.animationDelay = (Math.random() * 10) + 's';
            heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            floatingHeartsContainer.appendChild(heart);
        }
    }

    // ============================================
    // "NO" BUTTON — DESKTOP (Runaway)
    // ============================================
    function initDesktopNoButton() {
        let escapeCount = 0;

        btnNo.addEventListener('mouseenter', function () {
            escapeCount++;

            // Make it fixed-position so it can fly around the whole viewport
            if (!btnNo.classList.contains('escaping')) {
                btnNo.classList.add('escaping');
            }

            const btnW = btnNo.offsetWidth;
            const btnH = btnNo.offsetHeight;
            const margin = 20;

            // Random position within viewport bounds
            const maxX = window.innerWidth - btnW - margin;
            const maxY = window.innerHeight - btnH - margin;
            const newX = margin + Math.random() * (maxX - margin);
            const newY = margin + Math.random() * (maxY - margin);

            btnNo.style.left = newX + 'px';
            btnNo.style.top = newY + 'px';

            // Grow the "Sì" button with each escape
            growYesButton();
        });

        // Safety: if they somehow manage to click "No" on desktop, treat as "Sì"
        btnNo.addEventListener('click', function (e) {
            e.preventDefault();
            celebrate();
        });
    }

    // ============================================
    // "NO" BUTTON — MOBILE (Transform)
    // ============================================
    function initMobileNoButton() {
        btnNo.addEventListener('touchstart', function (e) {
            e.preventDefault(); // prevent ghost clicks

            if (noAttempts < noTeaseTexts.length - 1) {
                // Tease with escalating texts
                btnNo.textContent = noTeaseTexts[noAttempts];
                noAttempts++;

                // Subtle shake animation
                btnNo.style.animation = 'none';
                btnNo.offsetHeight; // reflow
                btnNo.style.animation = 'transformPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

                // Grow "Sì" button too
                growYesButton();
            } else {
                // Final transformation — becomes "Sì"
                btnNo.textContent = noTeaseTexts[noTeaseTexts.length - 1];
                btnNo.classList.add('transformed');

                // Wait a beat then celebrate
                setTimeout(celebrate, 500);
            }
        }, { passive: false });

        // Regular click fallback for mobile
        btnNo.addEventListener('click', function (e) {
            e.preventDefault();
            if (noAttempts >= noTeaseTexts.length - 1) {
                celebrate();
            }
        });
    }

    // ============================================
    // GROW "SÌ" BUTTON
    // ============================================
    function growYesButton() {
        const idx = Math.min(noAttempts, yesMessages.length - 1);
        btnYes.textContent = yesMessages[idx];

        // Scale it up slightly each time
        const scale = 1 + (noAttempts * 0.06);
        btnYes.style.transform = `scale(${Math.min(scale, 1.5)})`;
        btnYes.style.padding = `${14 + noAttempts * 2}px ${36 + noAttempts * 4}px`;
    }

    // ============================================
    // "SÌ" BUTTON
    // ============================================
    btnYes.addEventListener('click', celebrate);

    function celebrate() {
        // Transition screens
        questionScreen.classList.remove('active');
        setTimeout(() => {
            successScreen.classList.add('active');
        }, 400);

        // Launch heart confetti burst 🎉
        launchHeartConfetti();

        // Keep launching periodically
        const confettiInterval = setInterval(launchHeartConfetti, 2500);

        // Stop after some time
        setTimeout(() => clearInterval(confettiInterval), 15000);
    }

    // ============================================
    // HEART CONFETTI 🎉
    // ============================================
    function launchHeartConfetti() {
        const heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 });

        const defaults = {
            spread: 360,
            ticks: 100,
            gravity: 0.4,
            decay: 0.94,
            startVelocity: 20,
            shapes: [heartShape],
            scalar: 1.8,
            colors: ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffffff', '#c9184a'],
        };

        // Center burst
        confetti({
            ...defaults,
            particleCount: 50,
            origin: { x: 0.5, y: 0.5 },
        });

        // Left burst
        confetti({
            ...defaults,
            particleCount: 25,
            origin: { x: 0.2, y: 0.6 },
        });

        // Right burst
        confetti({
            ...defaults,
            particleCount: 25,
            origin: { x: 0.8, y: 0.6 },
        });
    }

    // ============================================
    // NAVIGATION FLOW
    // ============================================

    // 1. Success -> Meaning Screen
    if (btnToMeaning) {
        btnToMeaning.addEventListener('click', function () {
            successScreen.classList.remove('active');
            setTimeout(() => {
                meaningScreen.classList.add('active');
            }, 400);
        });
    }

    // 2. Meaning Screen Interaction (Reveal)
    if (meaningContent) {
        meaningContent.addEventListener('click', function () {
            // Only trigger if not already active
            if (!meaningReveal.classList.contains('active')) {
                meaningTitle.classList.add('fade-out');
                setTimeout(() => {
                    meaningReveal.classList.add('active');
                }, 500);
            }
        });
    }

    // 3. Meaning -> Poem Screen
    if (btnGoToPoem) {
        btnGoToPoem.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent bubbling to meaningContent
            meaningScreen.classList.remove('active');
            setTimeout(() => poemScreen.classList.add('active'), 400);
        });
    }

    // 4. Poem -> Back to Success (or Meaning?)
    // Let's go back to Success as it's the "Main Hub" of celebration
    btnPoemBack.addEventListener('click', function () {
        poemScreen.classList.remove('active');
        // Reset meaning screen for re-experience?
        meaningTitle.classList.remove('fade-out');
        meaningReveal.classList.remove('active');

        setTimeout(() => successScreen.classList.add('active'), 400);
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        createFloatingHearts();

        if (isTouchDevice) {
            initMobileNoButton();
        } else {
            initDesktopNoButton();
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
