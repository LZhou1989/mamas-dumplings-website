// How to Cook Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const methodTabs = document.querySelectorAll('.method-tab');
    const methodContents = document.querySelectorAll('.method-content');

    methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetMethod = this.getAttribute('data-method');
            
            // Remove active class from all tabs and contents
            methodTabs.forEach(t => t.classList.remove('active'));
            methodContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetMethod).classList.add('active');
        });
    });

    // Add some interactive animations
    const steps = document.querySelectorAll('.step');
    
    // Add hover effects to steps
    steps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all steps for scroll animations
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(step);
    });

    // Add some fun interactive elements
    const illustrations = document.querySelectorAll('.step-illustration');
    
    illustrations.forEach(illustration => {
        illustration.addEventListener('click', function() {
            // Add a little bounce effect when clicked
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        const activeTab = document.querySelector('.method-tab.active');
        const currentIndex = Array.from(methodTabs).indexOf(activeTab);
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : methodTabs.length - 1;
            } else {
                newIndex = currentIndex < methodTabs.length - 1 ? currentIndex + 1 : 0;
            }
            
            methodTabs[newIndex].click();
        }
    });

    // Add smooth scrolling to tips section
    const tipsSection = document.querySelector('.cooking-tips');
    if (tipsSection) {
        tipsSection.addEventListener('click', function() {
            this.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Add some Easter egg animations
    let clickCount = 0;
    const title = document.querySelector('.how-to-cook-container h2');
    
    if (title) {
        title.addEventListener('click', function() {
            clickCount++;
            if (clickCount >= 5) {
                this.style.animation = 'bounce 0.5s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
                clickCount = 0;
            }
        });
    }

    // Add CSS animation for bounce effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}); 