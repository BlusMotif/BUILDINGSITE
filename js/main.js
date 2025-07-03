// Main JavaScript file for BuildCorp website

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultData();
    loadComponents();
    initializeContent();
    setupEventListeners();
    
    // Listen for storage changes to update content dynamically
    window.addEventListener('storage', function() {
        loadSiteLogo();
        loadSiteContactInfo();
        loadContactPageInfo();
    });
});

// Load header and footer components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('components/header.html');
        const headerHTML = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerHTML;
        
        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHTML = await footerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = footerHTML;
        
        // Load site logo and contact info after components are loaded
        setTimeout(() => {
            loadSiteLogo();
            loadSiteContactInfo();
        }, 300);
        
        // Setup mobile menu after header is loaded
        setupMobileMenu();
    } catch (error) {
        console.error('Error loading components:', error);
        // Fallback if components can't be loaded
        loadFallbackHeader();
        loadFallbackFooter();
        setTimeout(() => {
            loadSiteLogo();
            loadSiteContactInfo();
        }, 300);
    }
}

// Fallback header if component loading fails
function loadFallbackHeader() {
    const headerHTML = `
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <div class="logo">BuildCorp</div>
                    <nav class="nav">
                        <ul class="nav-menu">
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="services.html">Services</a></li>
                            <li><a href="projects.html">Projects</a></li>
                            <li><a href="properties.html">Properties</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                        <button class="mobile-menu-toggle">
                            <i class="fas fa-bars"></i>
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    `;
    document.getElementById('header-placeholder').innerHTML = headerHTML;
}

// Fallback footer if component loading fails
function loadFallbackFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>BuildCorp</h3>
                        <p>Building dreams, creating futures. Your trusted partner in construction and real estate.</p>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-facebook"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-linkedin"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="services.html">Services</a></li>
                            <li><a href="projects.html">Projects</a></li>
                            <li><a href="properties.html">Properties</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="services.html">Construction</a></li>
                            <li><a href="services.html">Real Estate</a></li>
                            <li><a href="services.html">Project Management</a></li>
                            <li><a href="services.html">Consulting</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Contact Info</h3>
                        <ul>
                            <li><i class="fas fa-map-marker-alt"></i> 123 Construction Ave, Building City</li>
                            <li><i class="fas fa-phone"></i> (555) 123-4567</li>
                            <li><i class="fas fa-envelope"></i> info@buildcorp.com</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 BuildCorp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Initialize page-specific content
function initializeContent() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            loadHomeContent();
            break;
        case 'about':
            loadAboutContent();
            break;
        case 'services':
            loadServicesContent();
            break;
        case 'projects':
            loadProjectsContent();
            break;
        case 'properties':
            loadPropertiesContent();
            break;
        case 'contact':
            setupContactForm();
            loadContactPageInfo();
            break;
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Load home page content
function loadHomeContent() {
    loadAboutPreview();
    loadServicesPreview();
    loadProjectsPreview();
    loadPropertiesPreview();
}

// Load about preview for home page
function loadAboutPreview() {
    const aboutContent = localStorage.getItem('aboutContent');
    const aboutElement = document.getElementById('home-about-content');
    
    if (aboutElement) {
        if (aboutContent) {
            aboutElement.innerHTML = aboutContent.substring(0, 300) + '...';
        }
    }
}

// Load services preview for home page
function loadServicesPreview() {
    const services = JSON.parse(localStorage.getItem('services')) || getDefaultServices();
    const servicesGrid = document.getElementById('home-services-grid');
    
    if (servicesGrid) {
        const limitedServices = services.slice(0, 3); // Show only first 3 services
        servicesGrid.innerHTML = limitedServices.map(service => createServiceCard(service)).join('');
    }
}

// Load projects preview for home page
function loadProjectsPreview() {
    const projects = JSON.parse(localStorage.getItem('projects')) || getDefaultProjects();
    const projectsGrid = document.getElementById('home-projects-grid');
    
    if (projectsGrid) {
        const limitedProjects = projects.slice(0, 3); // Show only first 3 projects
        projectsGrid.innerHTML = limitedProjects.map(project => createProjectCard(project)).join('');
    }
}

// Load properties preview for home page
function loadPropertiesPreview() {
    const properties = JSON.parse(localStorage.getItem('properties')) || getDefaultProperties();
    const propertiesGrid = document.getElementById('home-properties-grid');
    
    if (propertiesGrid) {
        const limitedProperties = properties.slice(0, 3); // Show only first 3 properties
        propertiesGrid.innerHTML = limitedProperties.map(property => createPropertyCard(property)).join('');
    }
}

// Load about page content
function loadAboutContent() {
    const aboutContent = localStorage.getItem('aboutContent');
    const aboutElement = document.getElementById('about-content');
    
    if (aboutElement && aboutContent) {
        aboutElement.innerHTML = aboutContent;
    }
}

// Load services page content
function loadServicesContent() {
    const services = JSON.parse(localStorage.getItem('services')) || getDefaultServices();
    const servicesGrid = document.getElementById('services-grid');
    
    if (servicesGrid) {
        servicesGrid.innerHTML = services.map(service => createServiceCard(service)).join('');
    }
}

// Load projects page content
function loadProjectsContent() {
    const projects = JSON.parse(localStorage.getItem('projects')) || getDefaultProjects();
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projectsGrid) {
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p class="text-center">No projects available at the moment.</p>';
        } else {
            projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
        }
    }
}

// Load properties page content
function loadPropertiesContent() {
    const properties = JSON.parse(localStorage.getItem('properties')) || getDefaultProperties();
    const propertiesGrid = document.getElementById('properties-grid');
    
    if (propertiesGrid) {
        if (properties.length === 0) {
            propertiesGrid.innerHTML = '<p class="text-center">No properties available at the moment.</p>';
        } else {
            propertiesGrid.innerHTML = properties.map(property => createPropertyCard(property)).join('');
        }
    }
}

// Create service card HTML
function createServiceCard(service) {
    return `
        <div class="service-card">
            <i class="${service.icon || 'fas fa-cog'}"></i>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
        </div>
    `;
}

// Create project card HTML
function createProjectCard(project) {
    const imageStyle = project.image ? `background-image: url(${project.image})` : '';
    return `
        <div class="project-card">
            <div class="project-image" style="${imageStyle}"></div>
            <div class="project-content">
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
                ${project.location ? `<p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(project.location)}</p>` : ''}
            </div>
        </div>
    `;
}

// Create property card HTML
function createPropertyCard(property) {
    const imageStyle = property.image ? `background-image: url(${property.image})` : '';
    return `
        <div class="property-card">
            <div class="property-image" style="${imageStyle}">
                <div class="property-price">$${formatNumber(property.price)}</div>
            </div>
            <div class="property-content">
                <h3>${escapeHtml(property.title)}</h3>
                <p>${escapeHtml(property.description)}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(property.location)}</p>
                <div class="property-details">
                    ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} bed</span>` : ''}
                    ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} bath</span>` : ''}
                    ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area} sq ft</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                date: new Date().toISOString()
            };
            
            // Validate form
            if (!validateContactForm(formData)) {
                return;
            }
            
            // Save message to localStorage
            saveContactMessage(formData);
            
            // Show success message
            showAlert('Your message has been sent successfully! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    if (!data.name) {
        showAlert('Please enter your name.', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!data.subject) {
        showAlert('Please enter a subject.', 'error');
        return false;
    }
    
    if (!data.message) {
        showAlert('Please enter your message.', 'error');
        return false;
    }
    
    return true;
}

// Save contact message to localStorage
function saveContactMessage(message) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

// Setup event listeners
function setupEventListeners() {
    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Default data functions
function getDefaultServices() {
    return [
        {
            title: 'Residential Construction',
            description: 'Custom home building and residential construction services with attention to detail and quality craftsmanship.',
            icon: 'fas fa-home'
        },
        {
            title: 'Commercial Construction',
            description: 'Professional commercial building services for offices, retail spaces, and industrial facilities.',
            icon: 'fas fa-building'
        },
        {
            title: 'Real Estate Development',
            description: 'Complete real estate development services from land acquisition to project completion.',
            icon: 'fas fa-city'
        },
        {
            title: 'Project Management',
            description: 'Comprehensive project management ensuring timely delivery and budget adherence.',
            icon: 'fas fa-tasks'
        },
        {
            title: 'Renovation & Remodeling',
            description: 'Transform your existing space with our expert renovation and remodeling services.',
            icon: 'fas fa-tools'
        },
        {
            title: 'Consulting Services',
            description: 'Expert consulting for construction projects, feasibility studies, and market analysis.',
            icon: 'fas fa-clipboard-list'
        }
    ];
}

function getDefaultProjects() {
    return [
        {
            title: 'Sunset Residential Complex',
            description: 'A modern 50-unit residential complex featuring sustainable design and community amenities.',
            location: 'Downtown District',
            image: ''
        },
        {
            title: 'Corporate Office Tower',
            description: 'A 20-story commercial office building with state-of-the-art facilities and LEED certification.',
            location: 'Business Center',
            image: ''
        },
        {
            title: 'Green Valley Shopping Center',
            description: 'A contemporary shopping center with 40 retail units and modern amenities.',
            location: 'Green Valley',
            image: ''
        }
    ];
}

function getDefaultProperties() {
    return [
        {
            title: 'Modern Family Home',
            description: 'Beautiful 3-bedroom family home with contemporary design and premium finishes.',
            location: 'Maple Street',
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            area: 2200,
            image: ''
        },
        {
            title: 'Luxury Condo',
            description: 'Stunning 2-bedroom luxury condo with city views and premium amenities.',
            location: 'City Center',
            price: 320000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1400,
            image: ''
        },
        {
            title: 'Commercial Office Space',
            description: 'Prime commercial office space in the heart of the business district.',
            location: 'Business District',
            price: 750000,
            bedrooms: null,
            bathrooms: null,
            area: 3500,
            image: ''
        }
    ];
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at the top of the main content
    const main = document.querySelector('main') || document.body;
    main.insertBefore(alert, main.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Initialize default data if not exists
function initializeDefaultData() {
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify(getDefaultServices()));
    }
    
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(getDefaultProjects()));
    }
    
    if (!localStorage.getItem('properties')) {
        localStorage.setItem('properties', JSON.stringify(getDefaultProperties()));
    }
    
    if (!localStorage.getItem('adminPassword')) {
        localStorage.setItem('adminPassword', '50KMTOTHEWORLD');
    }
    
    if (!localStorage.getItem('contactInfo')) {
        localStorage.setItem('contactInfo', JSON.stringify({
            companyName: 'MJK BUILDING & CO',
            companyTagline: 'Building Tomorrow, Today',
            phone: '+1 (555) 123-4567',
            email: 'info@mjkbuildingco.com',
            address: '123 Construction Ave\nBuilder City, BC 12345\nUnited States',
            businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
            website: 'https://mjkbuildingco.com'
        }));
    }
    
    if (!localStorage.getItem('socialMedia')) {
        localStorage.setItem('socialMedia', JSON.stringify({
            facebook: 'https://facebook.com/mjkbuildingco',
            twitter: 'https://twitter.com/mjkbuildingco',
            instagram: 'https://instagram.com/mjkbuildingco',
            linkedin: 'https://linkedin.com/company/mjkbuildingco'
        }));
    }
}

// Load site logo from localStorage
function loadSiteLogo() {
    const siteLogo = localStorage.getItem('siteLogo');
    const logoImg = document.getElementById('site-logo-img');
    const logoText = document.getElementById('site-logo-text');
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || {};
    
    if (siteLogo && logoImg) {
        logoImg.src = siteLogo;
        logoImg.style.display = 'block';
        if (logoText) logoText.style.display = 'none';
    } else if (logoText) {
        logoText.textContent = contactInfo.companyName || 'BuildCorp';
    }
}

// Load site contact info and social media
function loadSiteContactInfo() {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || {};
    const socialMedia = JSON.parse(localStorage.getItem('socialMedia')) || {};
    
    console.log('Loading contact info:', contactInfo);
    console.log('Loading social media:', socialMedia);
    
    // Update footer with contact info and social media links
    setTimeout(() => {
        // Update company name and tagline
        const footerCompanyName = document.getElementById('footer-company-name');
        if (footerCompanyName && contactInfo.companyName) {
            footerCompanyName.textContent = contactInfo.companyName;
        }
        
        const footerCompanyTagline = document.getElementById('footer-company-tagline');
        if (footerCompanyTagline && contactInfo.companyTagline) {
            footerCompanyTagline.textContent = contactInfo.companyTagline;
        }
        
        // Update contact information
        const footerAddress = document.getElementById('footer-address');
        if (footerAddress && contactInfo.address) {
            footerAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${contactInfo.address.replace(/\n/g, '<br>')}`;
        }
        
        const footerPhone = document.getElementById('footer-phone');
        if (footerPhone && contactInfo.phone) {
            footerPhone.innerHTML = `<i class="fas fa-phone"></i> ${contactInfo.phone}`;
        }
        
        const footerEmail = document.getElementById('footer-email');
        if (footerEmail && contactInfo.email) {
            footerEmail.innerHTML = `<i class="fas fa-envelope"></i> ${contactInfo.email}`;
        }
        
        const footerHours = document.getElementById('footer-hours');
        if (footerHours && contactInfo.businessHours) {
            footerHours.innerHTML = `<i class="fas fa-clock"></i> ${contactInfo.businessHours.replace(/\n/g, '<br>')}`;
        }
        
        // Update social media links
        const socialLinks = document.getElementById('footer-social-links');
        if (socialLinks && Object.keys(socialMedia).length > 0) {
            let socialHTML = '';
            if (socialMedia.facebook) socialHTML += `<a href="${socialMedia.facebook}" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>`;
            if (socialMedia.twitter) socialHTML += `<a href="${socialMedia.twitter}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>`;
            if (socialMedia.instagram) socialHTML += `<a href="${socialMedia.instagram}" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>`;
            if (socialMedia.linkedin) socialHTML += `<a href="${socialMedia.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
            if (socialMedia.youtube) socialHTML += `<a href="${socialMedia.youtube}" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>`;
            if (socialMedia.tiktok) socialHTML += `<a href="${socialMedia.tiktok}" target="_blank" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>`;
            
            if (socialHTML) {
                socialLinks.innerHTML = socialHTML;
            }
        }
    }, 200); // Increased delay to ensure footer is fully loaded
}

// Load contact page information from localStorage
function loadContactPageInfo() {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || {};
    
    // Update contact information on the page
    const addressElement = document.getElementById('contact-address');
    if (addressElement && contactInfo.address) {
        addressElement.innerHTML = contactInfo.address.replace(/\n/g, '<br>');
    }
    
    const phoneElement = document.getElementById('contact-phone');
    if (phoneElement && contactInfo.phone) {
        phoneElement.textContent = contactInfo.phone;
    }
    
    const emailElement = document.getElementById('contact-email');
    if (emailElement && contactInfo.email) {
        emailElement.textContent = contactInfo.email;
    }
    
    const hoursElement = document.getElementById('contact-hours');
    if (hoursElement && contactInfo.businessHours) {
        hoursElement.innerHTML = contactInfo.businessHours.replace(/\n/g, '<br>');
    }
}

// Initialize default data on first load
initializeDefaultData();
