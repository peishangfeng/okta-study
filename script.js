/* ============================================
   ChibaOKTA Presentation - JavaScript
   ============================================ */

let currentSlide = 0;
const totalSlides = 8;

// DOM References
const slides = document.querySelectorAll('.slide');
const progressFill = document.getElementById('progressFill');
const slideCounter = document.getElementById('slideCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize
function init() {
    updateSlide();
    setupKeyboardNav();
    setupTouchNav();
    setupMouseWheel();
}

// Navigate to a specific slide
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    updateSlide();
}

// Update UI state
function updateSlide() {
    // Progress bar
    progressFill.style.width = ((currentSlide + 1) / totalSlides * 100) + '%';
    
    // Counter
    slideCounter.textContent = (currentSlide + 1) + ' / ' + totalSlides;
    
    // Button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

// Navigation functions
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

// Keyboard navigation
function setupKeyboardNav() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
        }
        
        // Number keys 1-8 jump to slides
        const num = parseInt(e.key);
        if (num >= 1 && num <= totalSlides) {
            goToSlide(num - 1);
        }
    });
}

// Touch/swipe navigation
function setupTouchNav() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Horizontal swipe has priority
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });
}

// Mouse wheel navigation
function setupMouseWheel() {
    let wheelTimeout = null;
    let lastWheelTime = 0;
    const cooldown = 800; // ms between slides
    
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastWheelTime < cooldown) return;
        
        if (Math.abs(e.deltaY) > 30) {
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            lastWheelTime = now;
        }
    }, { passive: false });
}

// Fullscreen toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// Start
document.addEventListener('DOMContentLoaded', init);
