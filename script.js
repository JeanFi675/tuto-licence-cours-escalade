// State management
let currentStep = 1;
let userData = {
    hasPlace: null,
    hadPreviousLicence: null,
    licenceDone: false,
    inscriptionDone: false,
    licenceNumber: ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add cache clear on version change
    const VERSION = '1.0.5';
    const savedVersion = localStorage.getItem('cafInscriptionVersion');
    if (savedVersion !== VERSION) {
        localStorage.clear();
        localStorage.setItem('cafInscriptionVersion', VERSION);
    }
    
    loadProgress();
    initializeEventListeners();
    updateDateDisplay();
    checkSeptemberDate();
    updateStepDisplay();
});

// Load saved progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('cafInscriptionProgress');
    if (saved) {
        const data = JSON.parse(saved);
        userData = data.userData || userData;
        currentStep = data.currentStep || 1;
        
        // Restore form values
        restoreFormValues();
    }
}

// Save progress to localStorage
function saveProgress() {
    const data = {
        userData,
        currentStep,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cafInscriptionProgress', JSON.stringify(data));
}

// Initialize all event listeners
function initializeEventListeners() {
    // Step 1: Previous licence question only
    document.querySelectorAll('input[name="licence-previous"]').forEach(radio => {
        radio.addEventListener('change', handlePreviousLicenceSelection);
    });
    
    // Step 3: Inscription completion checkbox
    const inscriptionDoneCheckbox = document.getElementById('inscription-done');
    if (inscriptionDoneCheckbox) {
        inscriptionDoneCheckbox.addEventListener('change', (e) => {
            userData.inscriptionDone = e.target.checked;
            document.getElementById('step3-continue').disabled = !e.target.checked;
            saveProgress();
        });
    }
    
    // Progress steps click navigation
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', (e) => {
            const stepNumber = parseInt(step.dataset.step);
            if (stepNumber <= currentStep) {
                goToStep(stepNumber);
            }
        });
    });
}


// Handle previous licence selection - auto advance to next step
function handlePreviousLicenceSelection(e) {
    userData.hadPreviousLicence = e.target.value;
    userData.hasPlace = 'yes'; // Auto-set as they have a place
    saveProgress();
    
    // Auto advance to next step after a short delay
    setTimeout(() => {
        nextStep();
    }, 300);
}


// Navigation functions
function nextStep() {
    if (currentStep < 4) {
        // Mark current step as completed
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
        
        currentStep++;
        updateStepDisplay();
        saveProgress();
        
        // Special handling for step transitions
        if (currentStep === 2) {
            setupStep2();
        } else if (currentStep === 3) {
            setupStep3();
        } else if (currentStep === 4) {
            celebrateCompletion();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        saveProgress();
    }
}

function goToStep(step) {
    currentStep = step;
    updateStepDisplay();
    saveProgress();
}

// Update the display for current step
function updateStepDisplay() {
    // Update progress indicator
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active');
        if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Update step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup Step 2 (Licence)
function setupStep2() {
    const renewalSection = document.getElementById('renewal-section');
    const newSection = document.getElementById('new-section');
    
    if (userData.hadPreviousLicence === 'yes') {
        renewalSection.style.display = 'block';
        newSection.style.display = 'none';
    } else {
        renewalSection.style.display = 'none';
        newSection.style.display = 'block';
    }
}

// Setup Step 3 (Inscription)
function setupStep3() {
    const existingMember = document.getElementById('existing-member');
    const newMember = document.getElementById('new-member');
    
    if (userData.hadPreviousLicence === 'yes') {
        existingMember.style.display = 'block';
        newMember.style.display = 'none';
    } else {
        existingMember.style.display = 'none';
        newMember.style.display = 'block';
    }
}

// Validate licence number
function validateLicence() {
    const input = document.getElementById('licence-number');
    const value = input.value.trim();
    
    if (!value) {
        showToast('Veuillez entrer votre numéro de licence', 'warning');
        return;
    }
    
    if (!value.startsWith('7480') || value.length < 8) {
        showToast('Le numéro de licence doit commencer par 7480', 'error');
        return;
    }
    
    userData.licenceNumber = value;
    
    // Simulate validation process
    showToast('Validation en cours...', 'info');
    
    // Update timeline
    document.getElementById('timeline-1').classList.add('completed');
    document.getElementById('timeline-2').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('timeline-2').classList.remove('active');
        document.getElementById('timeline-2').classList.add('completed');
        document.getElementById('timeline-3').classList.add('active');
        
        showToast('Numéro de licence validé ! Synchronisation en cours...', 'success');
        
        // Enable continue button after a delay
        setTimeout(() => {
            document.getElementById('timeline-3').classList.add('completed');
            showToast('Inscription finalisée avec succès !', 'success');
            document.getElementById('inscription-done').checked = true;
            userData.inscriptionDone = true;
            document.getElementById('step3-continue').disabled = false;
            saveProgress();
        }, 2000);
    }, 1500);
}

// Date handling
function updateDateDisplay() {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('fr-FR', options);
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = dateStr;
    }
}

function checkSeptemberDate() {
    const today = new Date();
    const september1 = new Date(today.getFullYear(), 8, 1); // Month is 0-indexed
    const statusElement = document.getElementById('date-status');
    
    if (!statusElement) return;
    
    if (today < september1) {
        const daysRemaining = Math.ceil((september1 - today) / (1000 * 60 * 60 * 24));
        statusElement.innerHTML = `
            <div class="alert alert-warning">
                <strong>Attention :</strong> Il reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} avant le 1er septembre.
                Ne prenez pas votre licence maintenant !
            </div>
        `;
    } else {
        statusElement.innerHTML = `
            <div class="alert alert-success">
                <strong>Parfait !</strong> Vous pouvez maintenant prendre ou renouveler votre licence.
            </div>
        `;
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            ${getToastIcon(type)}
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return `<span class="toast-icon">${icons[type] || icons.info}</span>`;
}

// Confirm licence and continue
function confirmLicenceAndContinue() {
    userData.licenceDone = true;
    saveProgress();
    nextStep();
}

// Celebration animation for completion
function celebrateCompletion() {
    // Add confetti or celebration animation
    const successCard = document.querySelector('.success-card');
    if (successCard) {
        successCard.style.animation = 'pulse 2s ease-in-out';
    }
    
    // Clear saved progress
    localStorage.removeItem('cafInscriptionProgress');
}

// Restart the process
function restart() {
    if (confirm('Êtes-vous sûr de vouloir recommencer le parcours ?')) {
        localStorage.removeItem('cafInscriptionProgress');
        userData = {
            hasPlace: null,
            hadPreviousLicence: null,
            licenceDone: false,
            inscriptionDone: false,
            licenceNumber: ''
        };
        currentStep = 1;
        
        // Reset all form values
        document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
        document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
        document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
        
        // Reset step classes
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('completed', 'active');
        });
        document.querySelector('.step[data-step="1"]').classList.add('active');
        
        // Reset timeline
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('active', 'completed');
        });
        
        updateStepDisplay();
        showToast('Parcours réinitialisé', 'info');
    }
}

// Restore form values from saved data
function restoreFormValues() {
    // Restore Step 1 - only previous licence question
    if (userData.hadPreviousLicence) {
        const licenceRadio = document.querySelector(`input[name="licence-previous"][value="${userData.hadPreviousLicence}"]`);
        if (licenceRadio) {
            licenceRadio.checked = true;
            // Don't auto-advance when restoring saved state
        }
    }
    
    // No need to restore checkbox anymore since it's just a button
    
    // Restore Step 3
    if (userData.inscriptionDone) {
        const inscriptionCheckbox = document.getElementById('inscription-done');
        if (inscriptionCheckbox) {
            inscriptionCheckbox.checked = true;
            document.getElementById('step3-continue').disabled = false;
        }
    }
    
    if (userData.licenceNumber) {
        const licenceInput = document.getElementById('licence-number');
        if (licenceInput) {
            licenceInput.value = userData.licenceNumber;
        }
    }
}

// Show privacy/legal information
function showPrivacy() {
    showToast('Mentions légales : Site développé pour le CAF La Roche-Bonneville', 'info');
}

// Add toast styles dynamically
const toastStyles = `
    <style>
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        max-width: 400px;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .toast-icon {
        font-size: 1.25rem;
    }
    
    .toast-success {
        border-left: 4px solid var(--success-color);
    }
    
    .toast-error {
        border-left: 4px solid var(--danger-color);
    }
    
    .toast-warning {
        border-left: 4px solid var(--warning-color);
    }
    
    .toast-info {
        border-left: 4px solid var(--info-color);
    }
    
    @media (max-width: 768px) {
        .toast {
            left: 20px;
            right: 20px;
            bottom: 10px;
        }
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);