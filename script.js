// ===================================
// Goldenwoods School - JavaScript
// ===================================

// Configuration
const CONFIG = {
    // Replace this with your actual n8n webhook URL
    webhookURL: 'https://backyou-n8n.pf0hps.easypanel.host/webhook/206dd60c-e2bb-46c7-9c8b-025631c7fb2a',

    // Carousel settings
    carouselAutoPlayInterval: 5000, // 5 seconds

    // Scroll animation settings
    scrollOffset: 100
};

// ===================================
// SMOOTH SCROLLING
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 20;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.offering-card, .video-card, .benefit-item');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// WHATSAPP BUTTON VISIBILITY
// ===================================
const whatsappButton = document.querySelector('.whatsapp-float');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        whatsappButton.style.opacity = '1';
        whatsappButton.style.visibility = 'visible';
    } else {
        whatsappButton.style.opacity = '0';
        whatsappButton.style.visibility = 'hidden';
    }
});

// Initial state
if (window.scrollY <= 300) {
    whatsappButton.style.opacity = '0';
    whatsappButton.style.visibility = 'hidden';
}

// ===================================
// UNOI SECTION SCROLL ANIMATION
// ===================================
const unoiSection = document.querySelector('.unoi-section');

if (unoiSection) {
    window.addEventListener('scroll', () => {
        const rect = unoiSection.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));

        // Apply dynamic transform based on scroll position for paint dripping effect
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const translateY = scrollPercent * 30;
            unoiSection.style.setProperty('--scroll-offset', `${translateY}px`);
        }
    }, { passive: true });
}

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================
const form = document.getElementById('inscripcionForm');
const submitButton = form.querySelector('.btn-submit');
const successMessage = form.querySelector('.success-message');
const errorMessageBox = form.querySelector('.error-message-box');

// Validation functions
const validators = {
    nombre: (value) => {
        if (!value.trim()) return 'Por favor ingresa tu nombre completo';
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
        return null;
    },

    email: (value) => {
        if (!value.trim()) return 'Por favor ingresa tu correo electrónico';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Por favor ingresa un correo válido';
        return null;
    },

    telefono: (value) => {
        if (!value.trim()) return 'Por favor ingresa tu teléfono';
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) return 'Por favor ingresa un teléfono válido';
        if (value.replace(/\D/g, '').length < 10) return 'El teléfono debe tener al menos 10 dígitos';
        return null;
    },

    nivel: (value) => {
        if (!value) return 'Por favor selecciona un nivel educativo';
        return null;
    }
};

// Real-time validation
Object.keys(validators).forEach(fieldName => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.parentElement.classList.contains('error')) {
                validateField(field);
            }
        });
    }
});

function validateField(field) {
    const fieldName = field.name;
    const value = field.value;
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');

    const error = validators[fieldName] ? validators[fieldName](value) : null;

    if (error) {
        formGroup.classList.add('error');
        if (errorMessage) errorMessage.textContent = error;
        return false;
    } else {
        formGroup.classList.remove('error');
        if (errorMessage) errorMessage.textContent = '';
        return true;
    }
}

function validateForm() {
    let isValid = true;

    Object.keys(validators).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous messages
    successMessage.classList.remove('show');
    errorMessageBox.classList.remove('show');

    // Validate form
    if (!validateForm()) {
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Get form data
    const formData = {
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        telefono: form.telefono.value.trim(),
        nivel: form.nivel.value,
        mensaje: form.mensaje.value.trim(),
        fecha: new Date().toISOString(),
        fuente: 'Landing Page Goldenwoods'
    };

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
        // Send to n8n webhook
        const response = await fetch(CONFIG.webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Success - redirect to thank you page

            // Track conversion (if you have analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Inscripciones',
                    'event_label': formData.nivel
                });
            }

            // Redirect to thank you page after a brief delay
            setTimeout(() => {
                window.location.href = 'gracias.html';
            }, 500);

        } else {
            throw new Error('Error en la respuesta del servidor');
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        errorMessageBox.classList.add('show');

        // Scroll to error message
        errorMessageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide error message after 8 seconds
        setTimeout(() => {
            errorMessageBox.classList.remove('show');
        }, 8000);
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});

// ===================================
// TESTIMONIALS CAROUSEL
// ===================================
class TestimonialsCarousel {
    constructor() {
        this.track = document.querySelector('.testimonials-track');
        this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.indicators = Array.from(document.querySelectorAll('.indicator'));

        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (!this.track || this.cards.length === 0) return;

        // Set up event listeners
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch events for mobile
        this.setupTouchEvents();

        // Auto-play
        this.startAutoPlay();

        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.addEventListener('mouseleave', () => this.startAutoPlay());

        // Initial display
        this.updateCarousel();
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    updateCarousel() {
        // Update track position
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Update cards visibility for screen readers
        this.cards.forEach((card, index) => {
            card.setAttribute('aria-hidden', index !== this.currentIndex);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, CONFIG.carouselAutoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ===================================
// VIDEO CAROUSEL
// ===================================
class VideoCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.prevBtn = document.querySelector('.video-section .prev-btn');
        this.nextBtn = document.querySelector('.video-section .next-btn');
        this.indicators = Array.from(document.querySelectorAll('.video-section .indicator'));

        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (!this.track || this.slides.length === 0) return;

        // Set up event listeners
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch events for mobile
        this.setupTouchEvents();

        // Auto-play
        this.startAutoPlay();

        // Pause on hover
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselWrapper.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Initial display
        this.updateCarousel();
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    updateCarousel() {
        // Update track position
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Update slides visibility for screen readers
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
        });

        // Update active class on slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, CONFIG.carouselAutoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
    new VideoCarousel();
});

// ===================================
// SCROLL INDICATOR HIDE ON SCROLL
// ===================================
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.visibility = 'hidden';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.visibility = 'visible';
    }
}, { passive: true });

// ===================================
// OFFERING CARDS HOVER EFFECT
// ===================================
document.querySelectorAll('.offering-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
        this.style.zIndex = '1';
    });
});

// ===================================
// LAZY LOADING FOR VIDEOS
// ===================================
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    videoObserver.unobserve(iframe);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe video iframes (if you want to implement lazy loading)
    // Uncomment and modify iframe src to data-src in HTML
    // document.querySelectorAll('iframe[data-src]').forEach(iframe => {
    //     videoObserver.observe(iframe);
    // });
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScroll = debounce(() => {
    // Any additional scroll-based functionality
}, 100);

window.addEventListener('scroll', optimizedScroll, { passive: true });

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const isCarouselFocused = carousel.contains(document.activeElement);

    if (isCarouselFocused) {
        if (e.key === 'ArrowLeft') {
            document.querySelector('.prev-btn')?.click();
        } else if (e.key === 'ArrowRight') {
            document.querySelector('.next-btn')?.click();
        }
    }
});

// Focus trap for form when submitting
form.addEventListener('submit', () => {
    const firstInput = form.querySelector('input, select, textarea');
    if (firstInput) {
        setTimeout(() => {
            const errorField = form.querySelector('.form-group.error input, .form-group.error select');
            if (errorField) {
                errorField.focus();
            }
        }, 100);
    }
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🎓 Goldenwoods School', 'font-size: 20px; font-weight: bold; color: #4CAF50;');
console.log('%cLanding Page v1.0', 'font-size: 12px; color: #666;');
console.log('%cRecuerda actualizar la URL del webhook en script.js', 'font-size: 12px; color: #FF9800;');

// ===================================
// EXPORT FOR TESTING (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validators,
        validateField,
        validateForm,
        TestimonialsCarousel
    };
}
