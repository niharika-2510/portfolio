// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.getElementById('typing-text');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        hamburger.addEventListener('click', () => this.toggleMobileMenu());
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 72;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (!this.isDeleting) {
            // Typing
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;

            if (this.charIndex === currentText.length) {
                // Pause before deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.pauseTime);
                return;
            }
        } else {
            // Deleting
            this.element.textContent = currentText.substring(0, this.charIndex);
            this.charIndex--;

            if (this.charIndex < 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
            }
        }

        const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        setTimeout(() => this.type(), speed);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.animateSkillBars();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections and cards
        document.querySelectorAll('section, .project-card, .skill-category, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    }

    animateSkillBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    setTimeout(() => {
                        progressBar.style.width = `${width}%`;
                    }, 200);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }
}

// Contact Form Handler
class ContactForm {
    constructor(form) {
        this.form = form;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        this.showLoading();
        
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
        }, 2000);
    }

    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    }

    showSuccess() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            particlesContainer.appendChild(this.canvas);
            this.resize();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(14, 165, 233, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth Scroll for anchor links
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 72;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const scrollAnimations = new ScrollAnimations();
    const contactFormHandler = new ContactForm(contactForm);
    
    // Initialize typing animation
    const typingTexts = [
        'AI/ML Developer',
        'Flutter Enthusiast',
        'Data Analyst',
        'Generative AI Explorer',
        'Problem Solver',
        'Tech Innovator'
    ];
    new TypingAnimation(typingText, typingTexts);
    
    // Initialize particle system
    if (window.innerWidth > 768) {
        new ParticleSystem();
    }
    
    // Initialize smooth scroll
    smoothScroll();
    
    // Add loading animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimizations
// Debounce scroll events
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
window.addEventListener('scroll', debounce(() => {
    // Handle scroll-based animations here if needed
}, 10));

// Preload critical images
function preloadImages() {
    const images = [
        'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg',
        'https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg',
        'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg',
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload function
preloadImages();

// Add page visibility change handler for performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});