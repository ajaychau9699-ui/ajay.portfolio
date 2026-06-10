// ==========================================================================
// PORTFOLIO INTERACTIVITY & LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Cache theme choice
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
    body.className = savedTheme;

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });

    // 3. Navbar Shrink on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scrollspy (Highlight Navbar links on scroll)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle portion of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 5. Case Study Modal Viewer Logic
    const modal = document.getElementById('case-study-modal');
    const modalImg = document.getElementById('modal-case-study-img');
    const modalProjectName = document.getElementById('modal-project-name');
    const modalScrollProgress = document.getElementById('modal-scroll-progress');
    const modalScrollableContent = document.getElementById('modal-scrollable-content');
    const modalImageWrapper = document.getElementById('modal-img-container');
    const modalSpinner = document.getElementById('modal-loading-spinner');
    
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomFit = document.getElementById('btn-zoom-fit');
    const btnDownloadCaseStudy = document.getElementById('btn-download-casestudy');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnModalScrollTop = document.getElementById('modal-scroll-top');

    // Project data mapping
    const projectData = {
        'air-india': {
            title: 'Air India Booking Redesign - Full Case Study',
            url: 'assets/case-studies/Air_India_Case_Study.jpg'
        },
        'phonepe': {
            title: 'PhonePe SIP Gold Experience - Full Case Study',
            url: 'assets/case-studies/Case_Study_Of_Phonepe_SIP.jpg'
        },
        'rcc-tank': {
            title: 'RCC Water Tank Operations App - Full Case Study',
            url: 'assets/case-studies/Rcc_Water_Tank_Cleaning_Service_App_Case_Study.jpg'
        },
        'resume-fullscreen': {
            title: 'Ajay Chauhan - UI/UX Designer Resume',
            url: 'assets/resume.jpg'
        }
    };

    // Zoom state
    let currentZoomLevel = 1; // 1: 900px, 2: 1200px, 3: 1500px, fit: 100%
    const zoomClasses = ['zoom-level-1', 'zoom-level-2', 'zoom-level-3', 'zoom-level-fit'];

    function setZoom(level) {
        // Remove existing zoom classes
        zoomClasses.forEach(c => modalImageWrapper.classList.remove(c));
        
        if (level === 'fit') {
            modalImageWrapper.classList.add('zoom-level-fit');
        } else {
            modalImageWrapper.classList.add(`zoom-level-${level}`);
        }
    }

    function openCaseStudy(projectId) {
        const project = projectData[projectId];
        if (!project) return;

        // Show Modal and reset scroll position
        modal.classList.remove('modal-hidden');
        // Force layout pass
        modal.offsetHeight;
        modal.classList.add('modal-visible');
        document.body.style.overflow = 'hidden'; // Lock main background scrolling

        // Reset scroll position and zoom
        modalScrollableContent.scrollTop = 0;
        modalScrollableContent.scrollLeft = 0;
        currentZoomLevel = 1;
        setZoom(1);

        // Show spinner and load image
        modalSpinner.classList.remove('spinner-hidden');
        modalProjectName.textContent = project.title;
        btnDownloadCaseStudy.setAttribute('href', project.url);
        btnDownloadCaseStudy.setAttribute('download', `${projectId}_case_study.jpg`);

        // Load image asynchronously
        modalImg.src = project.url;
        modalImg.onload = () => {
            modalSpinner.classList.add('spinner-hidden');
        };
        modalImg.onerror = () => {
            modalSpinner.classList.add('spinner-hidden');
            alert('Failed to load the case study image. Please check if the file is available.');
        };
    }

    function closeModal() {
        modal.classList.remove('modal-visible');
        document.body.style.overflow = ''; // Unlock main background scrolling
        
        // Hide overlay in display after transition
        setTimeout(() => {
            if (!modal.classList.contains('modal-visible')) {
                modal.classList.add('modal-hidden');
                modalImg.src = ''; // Clear source to free up memory
            }
        }, 350);
    }

    // Modal click triggers
    document.querySelectorAll('.open-case-study').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = e.currentTarget.getAttribute('data-project');
            openCaseStudy(projectId);
        });
    });

    // Reuse modal viewer for full screen resume
    const btnFullscreenResume = document.getElementById('btn-fullscreen-resume');
    if (btnFullscreenResume) {
        btnFullscreenResume.addEventListener('click', () => {
            openCaseStudy('resume-fullscreen');
        });
    }

    btnCloseModal.addEventListener('click', closeModal);

    // Close on click outside the image container (only on overlay bounds)
    modalScrollableContent.addEventListener('click', (e) => {
        if (e.target === modalScrollableContent) {
            closeModal();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-visible')) {
            closeModal();
        }
    });

    // Zoom buttons handling
    btnZoomIn.addEventListener('click', () => {
        if (currentZoomLevel === 'fit') {
            currentZoomLevel = 1;
        } else if (currentZoomLevel < 3) {
            currentZoomLevel++;
        }
        setZoom(currentZoomLevel);
    });

    btnZoomOut.addEventListener('click', () => {
        if (currentZoomLevel === 'fit') {
            currentZoomLevel = 3;
        } else if (currentZoomLevel > 1) {
            currentZoomLevel--;
        }
        setZoom(currentZoomLevel);
    });

    btnZoomFit.addEventListener('click', () => {
        currentZoomLevel = 'fit';
        setZoom('fit');
    });

    // Track scroll position inside modal for progress bar & scroll-to-top button
    modalScrollableContent.addEventListener('scroll', () => {
        const scrollTop = modalScrollableContent.scrollTop;
        const scrollHeight = modalScrollableContent.scrollHeight;
        const clientHeight = modalScrollableContent.clientHeight;
        
        // Calculate progress percentage
        const scrollRange = scrollHeight - clientHeight;
        if (scrollRange > 0) {
            const progress = (scrollTop / scrollRange) * 100;
            modalScrollProgress.style.width = `${progress}%`;
        } else {
            modalScrollProgress.style.width = '0%';
        }

        // Show/hide scroll-to-top inside modal
        if (scrollTop > 300) {
            btnModalScrollTop.classList.add('visible');
        } else {
            btnModalScrollTop.classList.remove('visible');
        }
    });

    // Scroll to top inside modal click handler
    btnModalScrollTop.addEventListener('click', () => {
        modalScrollableContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 6. Contact Form Submission Logic (Simulated API call)
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;

            // Simple validation double check
            if (!name || !email || !message) return;

            // Set sending status on button
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending message... <div class="spinner" style="width: 16px; height: 16px; border-width: 2px; display: inline-block; margin-bottom: 0; margin-left: 8px; vertical-align: middle;"></div>';

            // Simulate server response delay (1.5 seconds)
            setTimeout(() => {
                // Reset button status
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Show success feedback
                formFeedback.className = 'form-feedback-visible form-feedback-success';
                formFeedback.innerHTML = `<i data-lucide="check-circle" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 6px;"></i> Thank you, <strong>${name}</strong>! Your message has been sent. I will get back to you shortly.`;
                
                // Re-initialize Lucide for injected feedback icon
                if (window.lucide) {
                    window.lucide.createIcons();
                }

                // Clear input fields
                contactForm.reset();

                // Clear success feedback after 6 seconds
                setTimeout(() => {
                    formFeedback.className = 'form-feedback-hidden';
                    formFeedback.innerHTML = '';
                }, 6000);

            }, 1500);
        });
    }
});
