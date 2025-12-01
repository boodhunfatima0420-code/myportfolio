// script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('nav .nav-links a');
    const sections = document.querySelectorAll('section[id], main#home');
    const startBtn = document.getElementById('start-btn');
    const cards = document.querySelectorAll('.card');
    const contactForm = document.getElementById('contact-form');
    const certificateButtons = document.querySelectorAll('.view-certificate');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const bgAudio = document.getElementById('background-audio');
    const fadeElements = document.querySelectorAll('.fade-in');

    // variables
   
    let isScrolling = false;

    // 3D and flip animations for cards
    function initializeCards() {
        cards.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            let isFlipped = false;
            let isHovering = false;

            // flip button creation and position at card-back
            const flipBackBtn = document.createElement('button');
            flipBackBtn.className = 'flip-back-btn';
            flipBackBtn.innerHTML = '<i class="fas fa-undo"></i>';
            flipBackBtn.setAttribute('aria-label', 'Flip card back to front');

            
            const cardBack = card.querySelector('.card-back');
            if (cardBack) {
                cardBack.appendChild(flipBackBtn);
            }

            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                if (isFlipped) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateX = (-y / (rect.height / 2)) * 8; // Increased rotation for better effect
                const rotateY = (x / (rect.width / 2)) * 8;

                cardInner.style.transform = `
                    rotateY(${rotateY}deg) 
                    rotateX(${rotateX}deg) 
                    translateZ(20px) 
                    scale(1.02)
                `;
                card.style.setProperty('--shadow-intensity', '0.4');
            });

            card.addEventListener('mouseenter', () => {
                if (isFlipped) return;
                isHovering = true;
                card.style.setProperty('--glow-opacity', '0.6');
            });

            card.addEventListener('mouseleave', () => {
                if (isFlipped) return;
                isHovering = false;

                // smooth reset
                cardInner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                card.style.setProperty('--shadow-intensity', '0.2');
                card.style.setProperty('--glow-opacity', '0');
            });

            // flip functionality
            card.addEventListener('click', (e) => {
                if (e.target.closest('.flip-back-btn')) {
                    return;
                }

                isFlipped = !isFlipped;
                card.classList.toggle('flipped', isFlipped);

                if (isFlipped) {
                    cardInner.style.transform = 'rotateY(180deg) translateZ(20px)';
                    card.setAttribute('aria-label', 'Project card - flipped to show details');
                } else {
                    // return to normal state
                    cardInner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
                    card.setAttribute('aria-label', 'Project card - front view');
                }

            });

            //flip back button
            flipBackBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isFlipped = false;
                card.classList.remove('flipped');
                cardInner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
                card.setAttribute('aria-label', 'Project card - front view');
            });

          
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }

                if (e.key === 'Escape' && isFlipped) {
                    flipBackBtn.click();
                }
            });

            card.style.setProperty('--shadow-intensity', '0.2');
            card.style.setProperty('--glow-opacity', '0');
        });

        // close flipped cards when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.card')) {
                cards.forEach(card => {
                    const cardInner = card.querySelector('.card-inner');
                    card.classList.remove('flipped');
                    cardInner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
                });
            }
        });
    }

    function smoothScroll(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const targetPosition = target.offsetTop - 80; // Offset for fixed nav
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // nav menu
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScroll(targetId);

            // update active link
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Start button functionality
    startBtn.addEventListener('click', () => {
        smoothScroll('#skills');
    });

    function setActiveNav() {
        if (isScrolling) return;

        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    let scrollTimer;
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            setActiveNav();
            isScrolling = false;
        }, 100);
    });

    setActiveNav();

    initializeCards();

    // contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // get form data and validations
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

       
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        showNotification('Sending your message...', 'info');

        setTimeout(() => {
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
        }, 1500);
    });

    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // notification system
    function showNotification(message, type = 'info') {
        // remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

       
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        const colors = {
            info: '#6fb3a8',
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // animate
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // auto remove after 10 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);

        // manual close on click
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // certificate modal 
    certificateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const certificateType = button.getAttribute('data-certificate');
            const modal = document.getElementById(`${certificateType}-modal`);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; 
            
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = ''; 
            
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // restore scrolling
            }
        });
    });

    // close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; 
                }
            });
        }
    });

    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                // Stop observing after animation
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeObserver.observe(el);
    });

    // Add loading state to buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.classList.contains('submit-btn') || this.classList.contains('view-certificate')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;

                // Reset after a delay (simulated loading)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1500);
            }
        });
    });

    // Add scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #6fb3a8;
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 99;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;

    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-3px)';
        scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    });

    scrollToTopBtn.addEventListener('click', () => {
        smoothScroll('#home');
        
    });

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
            scrollToTopBtn.style.justifyContent = 'center';
            scrollToTopBtn.style.alignItems = 'center';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Add typing effect to introduction
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Uncomment to enable typing effect on the intro text
    /*
    const introText = document.querySelector('.intro p');
    const originalText = introText.textContent;
    introText.textContent = '';
    setTimeout(() => {
        typeWriter(introText, originalText, 30);
    }, 1000);
    */

    // Add parallax effect to profile picture
    window.addEventListener('scroll', () => {
        const profilePic = document.querySelector('.profile-pic');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (profilePic && window.innerWidth > 900) {
            profilePic.style.transform = `translateY(${rate}px) scale(1.05)`;
        }
    });

    // Initialize tooltips for social icons
    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        const platform = icon.classList[1] || 'Social Media';
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
        tooltip.style.cssText = `
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;

        icon.style.position = 'relative';
        icon.appendChild(tooltip);

        icon.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // Add skill level animations
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'skillPulse 0.5s ease';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 500);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(skill => {
        skillObserver.observe(skill);
    });

    // Add CSS for skill animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes skillPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    console.log('Portfolio initialized successfully with enhanced 3D cards!');
});