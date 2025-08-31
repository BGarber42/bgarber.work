// Platform Engineering Portfolio JavaScript

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const terminalHeader = document.querySelector('.terminal-header');
const serviceNodes = document.querySelectorAll('.service-node');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeServiceNodes();
    initializeFormHandling();
    initializeAnimations();
    initializeCarousel();
    initializeThemeToggle();
});

// Theme toggle functionality
function initializeThemeToggle() {
    const traditionalBtn = document.getElementById('traditional-view-btn');
    const terminalBtn = document.getElementById('terminal-view-btn');
    const traditionalLayout = document.getElementById('traditional-layout');
    const terminalLayout = document.getElementById('terminal-layout');

    // Set theme based on localStorage or default
    const savedTheme = localStorage.getItem('theme') || 'terminal';
    setTheme(savedTheme);

    traditionalBtn.addEventListener('click', () => setTheme('traditional'));
    terminalBtn.addEventListener('click', () => setTheme('terminal'));

    function setTheme(theme) {
        if (theme === 'traditional') {
            traditionalLayout.style.display = 'block';
            terminalLayout.style.display = 'none';
            traditionalBtn.classList.add('active');
            terminalBtn.classList.remove('active');
            populateTraditionalLayout();
            document.body.classList.add('traditional-theme-active');
        } else {
            traditionalLayout.style.display = 'none';
            terminalLayout.style.display = 'block';
            terminalBtn.classList.add('active');
            traditionalBtn.classList.remove('active');
            document.body.classList.remove('traditional-theme-active');
        }
        localStorage.setItem('theme', theme);
    }
}

function populateTraditionalLayout() {
    // Populate Experience
    const experienceSection = document.getElementById('traditional-experience');
    const timelineItems = document.querySelectorAll('.timeline-item');
    let experienceHtml = '<h2>Work Experience</h2>';
    timelineItems.forEach(item => {
        const title = item.querySelector('h3').innerText;
        const company = item.querySelector('h4').innerText;
        const date = item.querySelector('.timeline-date').innerText;
        const description = item.querySelector('.timeline-body ul').innerHTML;
        experienceHtml += `
            <div class="job">
                <h3>${title} at ${company}</h3>
                <p><em>${date}</em></p>
                <ul>${description}</ul>
            </div>
        `;
    });
    experienceSection.innerHTML = experienceHtml;

    // Populate Projects
    const projectsSection = document.getElementById('traditional-projects');
    const projectCards = document.querySelectorAll('#terminal-layout .project-card');
    let projectsHtml = '<h2>Projects</h2>';
    projectCards.forEach(card => {
        const title = card.querySelector('h3').innerText;
        const type = card.querySelector('.project-type').innerText;
        const description = card.querySelector('.project-content p').innerText;
        const techTags = card.querySelectorAll('.tech-tag');
        const linksContainer = card.querySelector('.project-links');
        let tagsHtml = '';
        techTags.forEach(tag => {
            tagsHtml += `<li>${tag.innerText}</li>`;
        });
        const linksHtml = linksContainer ? linksContainer.innerHTML : '';
        projectsHtml += `
            <div class="project">
                <h3>${title} - ${type}</h3>
                <p>${description}</p>
                <ul class="project-tech-traditional">${tagsHtml}</ul>
                <div class="project-links-traditional">${linksHtml}</div>
            </div>
        `;
    });
    projectsSection.innerHTML = projectsHtml;
}

// Navigation functionality
function initializeNavigation() {
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation based on scroll position
    window.addEventListener('scroll', updateActiveNavigation);
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
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

// Scroll effects
function initializeScrollEffects() {
    const updateScrollEffects = () => {
        const scrollY = window.scrollY;
        
        // Add scrolled class to terminal header
        if (scrollY > 10) {
            terminalHeader.classList.add('scrolled');
        } else {
            terminalHeader.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateScrollEffects);
    updateScrollEffects(); // Initial call
}

// Service nodes interaction
function initializeServiceNodes() {
    serviceNodes.forEach(node => {
        node.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            console.log(`Service clicked: ${service}`);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add hover effects
        node.addEventListener('mouseenter', function() {
            this.style.borderColor = '#27c93f';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.borderColor = '#333';
        });
    });
}

// Form handling
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const traditionalContactForm = document.getElementById('contactFormTraditional');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    if (traditionalContactForm) {
        traditionalContactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const form = this;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Submit form to Formspree
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        background: ${type === 'success' ? '#27c93f' : '#ff5f56'};
        color: #0a0a0a;
        padding: 12px 20px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-content, .project-card, .stat-card, .metric-card');
    animateElements.forEach(el => observer.observe(el));
    
    // Animate skill metrics on scroll
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metricFills = entry.target.querySelectorAll('.metric-fill');
                metricFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const skillsDashboard = document.querySelector('.skills-dashboard');
    if (skillsDashboard) {
        skillObserver.observe(skillsDashboard);
    }
}

// Utility function to scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Terminal controls functionality
document.addEventListener('DOMContentLoaded', function() {
    const terminalControls = document.querySelectorAll('.terminal-controls .control');
    
    terminalControls.forEach(control => {
        control.addEventListener('click', function() {
            const type = this.classList.contains('close') ? 'close' : 
                        this.classList.contains('minimize') ? 'minimize' : 'maximize';
            
            // Add click animation
            this.style.transform = 'scale(0.8)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle different control actions
            switch(type) {
                case 'close':
                    console.log('Terminal close clicked');
                    break;
                case 'minimize':
                    console.log('Terminal minimize clicked');
                    break;
                case 'maximize':
                    console.log('Terminal maximize clicked');
                    break;
            }
        });
    });
});

// Mobile menu toggle (for responsive design)
function toggleMobileMenu() {
    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('active');
    }
}

// Add mobile menu toggle button if needed
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.style.cssText = `
            position: fixed;
            top: 50px;
            left: 20px;
            z-index: 1001;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #e4e4e7;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            display: none;
        `;
        
        mobileToggle.addEventListener('click', toggleMobileMenu);
        document.body.appendChild(mobileToggle);
        
        // Show on mobile
        if (window.innerWidth <= 1024) {
            mobileToggle.style.display = 'block';
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                mobileToggle.style.display = 'block';
            } else {
                mobileToggle.style.display = 'none';
                sidebar.classList.remove('active');
            }
        });
    }
});

// Add some terminal-style typing effect to the hero section
document.addEventListener('DOMContentLoaded', function() {
    const outputLines = document.querySelectorAll('.output-line .result');
    
    outputLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            typeWriter(line, text, 50);
        }, index * 1000);
    });
});

function typeWriter(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Carousel functionality
function initializeCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.project-card');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const indicators = carousel.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialize carousel
    function initCarousel() {
        updateCarousel();
        updateIndicators();
        updateButtons();
    }

    // Update carousel position
    function updateCarousel() {
        const containerWidth = carousel.querySelector('.carousel-container').offsetWidth;
        const slideWidth = containerWidth;
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }

    // Update indicator states
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            currentSlide = slideIndex;
            updateCarousel();
            updateIndicators();
            updateButtons();
        }
    }

    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (carousel.contains(document.activeElement) || 
            carousel.querySelector(':hover')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                goToSlide(0);
            }
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Initialize
    initCarousel();
    startAutoPlay();
} 