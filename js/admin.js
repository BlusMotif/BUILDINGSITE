// Admin panel functionality for BuildCorp website

// Check if user is logged in
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = getCurrentAdminPage();
    
    if (currentPage === 'login') {
        setupLoginForm();
    } else {
        if (checkAdminAuth()) {
            initializeAdminPage(currentPage);
        }
    }
});

// Get current admin page
function getCurrentAdminPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page;
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
            
            if (password === storedPassword) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                showAdminAlert('Invalid password. Please try again.', 'error');
            }
        });
    }
}

// Initialize admin page based on current page
function initializeAdminPage(page) {
    switch(page) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'manage-about':
            setupAboutEditor();
            break;
        case 'manage-services':
            setupServicesManager();
            break;
        case 'manage-projects':
            setupProjectsManager();
            break;
        case 'manage-properties':
            setupPropertiesManager();
            break;
        case 'manage-messages':
            loadContactMessages();
            break;
        case 'manage-site':
            setupSiteManager();
            break;
    }
    
    setupLogout();
}

// Load dashboard statistics
function loadDashboardStats() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Update stat cards
    updateStatCard('services-count', services.length);
    updateStatCard('projects-count', projects.length);
    updateStatCard('properties-count', properties.length);
    updateStatCard('messages-count', messages.length);
}

// Update stat card
function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Setup about page editor
function setupAboutEditor() {
    const editor = document.getElementById('about-editor');
    const saveBtn = document.getElementById('save-about');
    
    if (editor) {
        // Load existing content
        const aboutContent = localStorage.getItem('aboutContent');
        if (aboutContent) {
            editor.innerHTML = aboutContent;
        }
        
        // Setup rich text editor
        setupRichTextEditor(editor);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const content = editor.innerHTML;
            localStorage.setItem('aboutContent', content);
            showAdminAlert('About content saved successfully!', 'success');
        });
    }
}

// Setup rich text editor
function setupRichTextEditor(editor) {
    editor.contentEditable = true;
    
    // Add editor toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    toolbar.innerHTML = `
        <button type="button" class="editor-btn" onclick="formatText('bold')"><i class="fas fa-bold"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('italic')"><i class="fas fa-italic"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('underline')"><i class="fas fa-underline"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('insertUnorderedList')"><i class="fas fa-list-ul"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('insertOrderedList')"><i class="fas fa-list-ol"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('justifyLeft')"><i class="fas fa-align-left"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('justifyCenter')"><i class="fas fa-align-center"></i></button>
        <button type="button" class="editor-btn" onclick="formatText('justifyRight')"><i class="fas fa-align-right"></i></button>
    `;
    
    editor.parentNode.insertBefore(toolbar, editor);
}

// Format text in editor
function formatText(command) {
    document.execCommand(command, false, null);
}

// Compress image for better storage efficiency
function compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Process image upload with compression
async function processImageUpload(file, previewElement, successMessage = 'Image uploaded successfully!') {
    try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showAdminAlert('Please select a valid image file (JPEG, PNG, GIF, or WebP).', 'error');
            return null;
        }
        
        // Validate file size (max 10MB before compression)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showAdminAlert('Image file size must be less than 10MB.', 'error');
            return null;
        }
        
        showAdminAlert('Processing image...', 'info');
        
        // Compress the image
        const compressedImage = await compressImage(file);
        
        // Update preview
        if (previewElement) {
            previewElement.src = compressedImage;
            previewElement.style.display = 'block';
        }
        
        showAdminAlert(successMessage, 'success');
        return compressedImage;
        
    } catch (error) {
        console.error('Error processing image:', error);
        showAdminAlert('Error processing image file.', 'error');
        return null;
    }
}

// Setup drag and drop functionality
function setupDragAndDrop(uploadArea, fileInput, previewElement, successMessage) {
    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e67e22';
        uploadArea.style.backgroundColor = '#fef9f3';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e1e8ed';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', async function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e1e8ed';
        uploadArea.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            await processImageUpload(file, previewElement, successMessage);
        }
    });
}

// Setup services manager
function setupServicesManager() {
    loadServicesTable();
    setupAddServiceForm();
}

// Load services table
function loadServicesTable() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const tableBody = document.getElementById('services-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = services.map((service, index) => `
            <tr>
                <td>${escapeHtml(service.title)}</td>
                <td>${escapeHtml(service.description)}</td>
                <td>${service.icon}</td>
                <td>
                    <button onclick="editService(${index})" class="btn btn-sm btn-primary">Edit</button>
                    <button onclick="deleteService(${index})" class="btn btn-sm btn-secondary">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

// Setup add service form
function setupAddServiceForm() {
    const form = document.getElementById('add-service-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const serviceData = {
                title: document.getElementById('service-title').value.trim(),
                description: document.getElementById('service-description').value.trim(),
                icon: document.getElementById('service-icon').value.trim() || 'fas fa-cog'
            };
            
            if (!serviceData.title || !serviceData.description) {
                showAdminAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            const services = JSON.parse(localStorage.getItem('services')) || [];
            services.push(serviceData);
            localStorage.setItem('services', JSON.stringify(services));
            
            showAdminAlert('Service added successfully!', 'success');
            form.reset();
            loadServicesTable();
        });
    }
}

// Edit service
function editService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services[index];
    
    if (service) {
        document.getElementById('service-title').value = service.title;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-icon').value = service.icon;
        
        // Change form to edit mode
        const form = document.getElementById('add-service-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Service';
        
        // Store edit index
        form.dataset.editIndex = index;
        
        // Update form handler
        form.removeEventListener('submit', setupAddServiceForm);
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            updateService(index);
        });
    }
}

// Update service
function updateService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    
    services[index] = {
        title: document.getElementById('service-title').value.trim(),
        description: document.getElementById('service-description').value.trim(),
        icon: document.getElementById('service-icon').value.trim() || 'fas fa-cog'
    };
    
    localStorage.setItem('services', JSON.stringify(services));
    showAdminAlert('Service updated successfully!', 'success');
    
    // Reset form
    const form = document.getElementById('add-service-form');
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Add Service';
    delete form.dataset.editIndex;
    
    loadServicesTable();
    setupAddServiceForm();
}

// Delete service
function deleteService(index) {
    if (confirm('Are you sure you want to delete this service?')) {
        const services = JSON.parse(localStorage.getItem('services')) || [];
        services.splice(index, 1);
        localStorage.setItem('services', JSON.stringify(services));
        showAdminAlert('Service deleted successfully!', 'success');
        loadServicesTable();
    }
}

// Setup projects manager
function setupProjectsManager() {
    loadProjectsTable();
    setupAddProjectForm();
}

// Load projects table
function loadProjectsTable() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const tableBody = document.getElementById('projects-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = projects.map((project, index) => `
            <tr>
                <td>${escapeHtml(project.title)}</td>
                <td>${escapeHtml(project.description)}</td>
                <td>${escapeHtml(project.location || '')}</td>
                <td>${project.image ? '<i class="fas fa-image"></i>' : 'No image'}</td>
                <td>
                    <button onclick="editProject(${index})" class="btn btn-sm btn-primary">Edit</button>
                    <button onclick="deleteProject(${index})" class="btn btn-sm btn-secondary">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

// Setup add project form
function setupAddProjectForm() {
    const form = document.getElementById('add-project-form');
    const imageInput = document.getElementById('project-image');
    const imagePreview = document.getElementById('image-preview');
    const uploadArea = document.getElementById('project-image-upload');
    
    // Setup drag and drop
    if (uploadArea && imageInput) {
        setupDragAndDrop(uploadArea, imageInput, imagePreview, 'Project image uploaded and optimized!');
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                await processImageUpload(file, imagePreview, 'Project image uploaded and optimized!');
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectData = {
                title: document.getElementById('project-title').value.trim(),
                description: document.getElementById('project-description').value.trim(),
                location: document.getElementById('project-location').value.trim(),
                image: imagePreview.src || ''
            };
            
            if (!projectData.title || !projectData.description) {
                showAdminAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects.push(projectData);
            localStorage.setItem('projects', JSON.stringify(projects));
            
            showAdminAlert('Project added successfully!', 'success');
            form.reset();
            imagePreview.style.display = 'none';
            loadProjectsTable();
        });
    }
}

// Edit project
function editProject(index) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects[index];
    
    if (project) {
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-location').value = project.location || '';
        
        const imagePreview = document.getElementById('image-preview');
        if (project.image) {
            imagePreview.src = project.image;
            imagePreview.style.display = 'block';
        }
        
        // Change form to edit mode
        const form = document.getElementById('add-project-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Project';
        form.dataset.editIndex = index;
    }
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        showAdminAlert('Project deleted successfully!', 'success');
        loadProjectsTable();
    }
}

// Setup properties manager
function setupPropertiesManager() {
    loadPropertiesTable();
    setupAddPropertyForm();
}

// Load properties table
function loadPropertiesTable() {
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const tableBody = document.getElementById('properties-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = properties.map((property, index) => `
            <tr>
                <td>${escapeHtml(property.title)}</td>
                <td>${escapeHtml(property.location)}</td>
                <td>$${formatNumber(property.price)}</td>
                <td>${property.bedrooms || 'N/A'}</td>
                <td>${property.bathrooms || 'N/A'}</td>
                <td>${property.area || 'N/A'} sq ft</td>
                <td>
                    <button onclick="editProperty(${index})" class="btn btn-sm btn-primary">Edit</button>
                    <button onclick="deleteProperty(${index})" class="btn btn-sm btn-secondary">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

// Setup add property form
function setupAddPropertyForm() {
    const form = document.getElementById('add-property-form');
    const imageInput = document.getElementById('property-image');
    const imagePreview = document.getElementById('property-image-preview');
    const uploadArea = document.getElementById('property-image-upload');
    
    // Setup drag and drop
    if (uploadArea && imageInput) {
        setupDragAndDrop(uploadArea, imageInput, imagePreview, 'Property image uploaded and optimized!');
    }
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                await processImageUpload(file, imagePreview, 'Property image uploaded and optimized!');
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const propertyData = {
                title: document.getElementById('property-title').value.trim(),
                description: document.getElementById('property-description').value.trim(),
                location: document.getElementById('property-location').value.trim(),
                price: parseInt(document.getElementById('property-price').value) || 0,
                bedrooms: parseInt(document.getElementById('property-bedrooms').value) || null,
                bathrooms: parseInt(document.getElementById('property-bathrooms').value) || null,
                area: parseInt(document.getElementById('property-area').value) || null,
                image: imagePreview ? imagePreview.src || '' : ''
            };
            
            if (!propertyData.title || !propertyData.description || !propertyData.location || !propertyData.price) {
                showAdminAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            const properties = JSON.parse(localStorage.getItem('properties')) || [];
            properties.push(propertyData);
            localStorage.setItem('properties', JSON.stringify(properties));
            
            showAdminAlert('Property added successfully!', 'success');
            form.reset();
            if (imagePreview) imagePreview.style.display = 'none';
            loadPropertiesTable();
        });
    }
}

// Edit property
function editProperty(index) {
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const property = properties[index];
    
    if (property) {
        document.getElementById('property-title').value = property.title;
        document.getElementById('property-description').value = property.description;
        document.getElementById('property-location').value = property.location;
        document.getElementById('property-price').value = property.price;
        document.getElementById('property-bedrooms').value = property.bedrooms || '';
        document.getElementById('property-bathrooms').value = property.bathrooms || '';
        document.getElementById('property-area').value = property.area || '';
        
        const imagePreview = document.getElementById('property-image-preview');
        if (imagePreview && property.image) {
            imagePreview.src = property.image;
            imagePreview.style.display = 'block';
        }
        
        // Change form to edit mode
        const form = document.getElementById('add-property-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Property';
        form.dataset.editIndex = index;
    }
}

// Delete property
function deleteProperty(index) {
    if (confirm('Are you sure you want to delete this property?')) {
        const properties = JSON.parse(localStorage.getItem('properties')) || [];
        properties.splice(index, 1);
        localStorage.setItem('properties', JSON.stringify(properties));
        showAdminAlert('Property deleted successfully!', 'success');
        loadPropertiesTable();
    }
}

// Load contact messages
function loadContactMessages() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const tableBody = document.getElementById('messages-table-body');
    
    if (tableBody) {
        if (messages.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No messages received yet.</td></tr>';
        } else {
            tableBody.innerHTML = messages.map((message, index) => `
                <tr>
                    <td>${escapeHtml(message.name)}</td>
                    <td>${escapeHtml(message.email)}</td>
                    <td>${escapeHtml(message.phone || 'N/A')}</td>
                    <td>${escapeHtml(message.subject)}</td>
                    <td>${escapeHtml(message.message.substring(0, 50))}${message.message.length > 50 ? '...' : ''}</td>
                    <td>
                        <button onclick="viewMessage(${index})" class="btn btn-sm btn-primary">View</button>
                        <button onclick="deleteMessage(${index})" class="btn btn-sm btn-secondary">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// View message
function viewMessage(index) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const message = messages[index];
    
    if (message) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>Message from ${escapeHtml(message.name)}</h3>
                <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(message.phone || 'N/A')}</p>
                <p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>
                <p><strong>Date:</strong> ${new Date(message.date).toLocaleDateString()}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px;">
                    ${escapeHtml(message.message)}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
}

// Delete message
function deleteMessage(index) {
    if (confirm('Are you sure you want to delete this message?')) {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.splice(index, 1);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        showAdminAlert('Message deleted successfully!', 'success');
        loadContactMessages();
    }
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        });
    }
}

// Show admin alert
function showAdminAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at the top of the admin container
    const container = document.querySelector('.admin-container') || document.body;
    container.insertBefore(alert, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Utility functions for admin
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// Setup site manager (logo, contact info, social media)
function setupSiteManager() {
    setupLogoManager();
    setupContactInfoForm();
    setupSocialMediaForm();
    loadCurrentSiteSettings();
}

// Setup logo management
function setupLogoManager() {
    const logoInput = document.getElementById('logo-input');
    const logoPreview = document.getElementById('logo-preview');
    const uploadArea = document.getElementById('logo-upload-area');
    const saveLogoBtn = document.getElementById('save-logo-btn');
    const removeLogoBtn = document.getElementById('remove-logo-btn');
    
    // Setup drag and drop for logo
    if (uploadArea && logoInput) {
        setupDragAndDrop(uploadArea, logoInput, logoPreview, 'Logo uploaded successfully!');
    }
    
    if (logoInput) {
        logoInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                const logoData = await processImageUpload(file, logoPreview, 'Logo ready to save!');
                if (logoData) {
                    saveLogoBtn.style.display = 'inline-block';
                }
            }
        });
    }
    
    if (saveLogoBtn) {
        saveLogoBtn.addEventListener('click', function() {
            const logoSrc = logoPreview.src;
            if (logoSrc) {
                localStorage.setItem('siteLogo', logoSrc);
                showAdminAlert('Logo saved successfully!', 'success');
                loadCurrentLogo();
                saveLogoBtn.style.display = 'none';
            }
        });
    }
    
    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove the current logo?')) {
                localStorage.removeItem('siteLogo');
                showAdminAlert('Logo removed successfully!', 'success');
                loadCurrentLogo();
            }
        });
    }
}

// Setup contact information form
function setupContactInfoForm() {
    const form = document.getElementById('contact-info-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const contactInfo = {};
            
            for (let [key, value] of formData.entries()) {
                contactInfo[key] = value;
            }
            
            localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
            showAdminAlert('Contact information saved successfully!', 'success');
        });
    }
}

// Setup social media form
function setupSocialMediaForm() {
    const form = document.getElementById('social-media-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const socialMedia = {};
            
            for (let [key, value] of formData.entries()) {
                if (value.trim()) { // Only save non-empty values
                    socialMedia[key] = value;
                }
            }
            
            localStorage.setItem('socialMedia', JSON.stringify(socialMedia));
            showAdminAlert('Social media links saved successfully!', 'success');
        });
    }
}

// Load current site settings
function loadCurrentSiteSettings() {
    loadCurrentLogo();
    loadContactInfo();
    loadSocialMedia();
}

// Load current logo
function loadCurrentLogo() {
    const currentLogoImg = document.getElementById('current-logo-img');
    const noLogoMessage = document.getElementById('no-logo-message');
    const removeLogoBtn = document.getElementById('remove-logo-btn');
    
    const savedLogo = localStorage.getItem('siteLogo');
    
    if (savedLogo && currentLogoImg) {
        currentLogoImg.src = savedLogo;
        currentLogoImg.style.display = 'block';
        if (noLogoMessage) noLogoMessage.style.display = 'none';
        if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
    } else {
        if (currentLogoImg) currentLogoImg.style.display = 'none';
        if (noLogoMessage) noLogoMessage.style.display = 'block';
        if (removeLogoBtn) removeLogoBtn.style.display = 'none';
    }
}

// Load contact information
function loadContactInfo() {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || getDefaultContactInfo();
    
    // Fill form fields
    Object.keys(contactInfo).forEach(key => {
        const field = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (field) {
            field.value = contactInfo[key] || '';
        }
    });
}

// Load social media links
function loadSocialMedia() {
    const socialMedia = JSON.parse(localStorage.getItem('socialMedia')) || {};
    
    // Fill form fields
    Object.keys(socialMedia).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = socialMedia[key] || '';
        }
    });
}

// Get default contact information
function getDefaultContactInfo() {
    return {
        companyName: 'BuildCorp',
        companyTagline: 'Building Tomorrow, Today',
        phone: '+1 (555) 123-4567',
        email: 'info@buildcorp.com',
        address: '123 Construction Ave\nBuilder City, BC 12345\nUnited States',
        businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
        website: 'https://buildcorp.com'
    };
}
