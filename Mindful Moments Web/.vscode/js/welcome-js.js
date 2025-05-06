document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFAQ();
    initPricingToggle();
    initSmoothScrolling();
    initAnimations();
});

function initMobileMenu() {
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuTrigger && sidebar) {
        mobileMenuTrigger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                !mobileMenuTrigger.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                }
            });
            
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });
}

function initPricingToggle() {
    const pricingToggle = document.querySelector('.pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');
    
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            if (this.checked) {
                yearlyPrices.forEach(price => price.style.display = 'block');
                monthlyPrices.forEach(price => price.style.display = 'none');
            } else {
                monthlyPrices.forEach(price => price.style.display = 'block');
                yearlyPrices.forEach(price => price.style.display = 'none');
            }
        });
    }
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            const mobileMenu = document.querySelector('.sidebar');
            
            if (target) {
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function checkElements() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', checkElements);
    checkElements();
} 