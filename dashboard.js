// ============================================
// MEDICINE DASHBOARD - JAVASCRIPT
// ============================================

// Global Variables
let todayMedicines = [];
let reminderInterval = null;
let currentReminder = null;

// ============================================
// 1. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Set greeting based on time of day
    setGreeting();
    
    // Display today's date
    displayTodayDate();
    
    // Load today's medicines
    loadTodayMedicines();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start reminder check
    startReminderCheck();
}

// ============================================
// 2. WELCOME MESSAGE & DATE
// ============================================

function setGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('greeting');
    
    if (hour < 12) {
        greetingElement.textContent = 'Good Morning, Alex!';
    } else if (hour < 17) {
        greetingElement.textContent = 'Good Afternoon, Alex!';
    } else {
        greetingElement.textContent = 'Good Evening, Alex!';
    }
}

function displayTodayDate() {
    const dateElement = document.getElementById('date-display');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// ============================================
// 3. REQUEST TODAY'S MEDICINES
// ============================================

async function loadTodayMedicines() {
    try {
        // Simulate API call - In production, replace with actual fetch
        const response = await fetchMedicinesAPI();
        todayMedicines = response;
        
        // Sort medicines by time
        todayMedicines.sort((a, b) => a.time.localeCompare(b.time));
        
        // Display the schedule
        displayMedicineSchedule();
        
        // Update medicine count
        updateMedicineCount();
        
    } catch (error) {
        console.error('Error loading medicines:', error);
        showErrorMessage('Failed to load medicines. Please try again.');
    }
}

// Simulated API function
async function fetchMedicinesAPI() {
    // In production, replace with:
    // const response = await fetch('/api/medicines/today');
    // return await response.json();
    
    // Mock data for demonstration
    return [
        {
            id: 1,
            name: 'Vitamin D3',
            time: '08:00',
            dosage: '1 Capsule',
            status: 'taken',
            takenAt: '2024-01-15T08:00:00'
        },
        {
            id: 2,
            name: 'Aspirin',
            time: '10:30',
            dosage: '1 Tablet',
            status: 'pending',
            takenAt: null
        },
        {
            id: 3,
            name: 'Antibiotics',
            time: '13:00',
            dosage: '2 Capsules',
            status: 'pending',
            takenAt: null
        },
        {
            id: 4,
            name: 'Magnesium',
            time: '20:00',
            dosage: '1 Tablet',
            status: 'pending',
            takenAt: null
        }
    ];
}

// ============================================
// 4. DISPLAY MEDICINE SCHEDULE
// ============================================

function displayMedicineSchedule() {
    const tableBody = document.getElementById('medicine-list');
    const emptyState = document.getElementById('empty-state');
    
    tableBody.innerHTML = '';
    
    if (todayMedicines.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    todayMedicines.forEach(medicine => {
        const row = createMedicineRow(medicine);
        tableBody.appendChild(row);
    });
}

function createMedicineRow(medicine) {
    const row = document.createElement('tr');
    row.id = `row-${medicine.id}`;
    
    const statusClass = medicine.status === 'taken' ? 'taken' : 'pending';
    const statusText = medicine.status === 'taken' ? 'Taken' : 'Pending';
    const isChecked = medicine.status === 'taken' ? 'checked' : '';
    
    row.innerHTML = `
        <td>${formatTime(medicine.time)}</td>
        <td class="medicine-name">${medicine.name}</td>
        <td>${medicine.dosage}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td class="actions-cell">
            <input type="checkbox" class="checker" 
                   ${isChecked} 
                   onchange="toggleMedicineStatus(${medicine.id})">
            <button class="action-btn btn-edit" onclick="editMedicine(${medicine.id})">Edit</button>
            <button class="action-btn btn-delete" onclick="deleteMedicine(${medicine.id})">Delete</button>
        </td>
    `;
    
    return row;
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function updateMedicineCount() {
    const countElement = document.getElementById('medicine-count');
    const count = todayMedicines.length;
    const taken = todayMedicines.filter(m => m.status === 'taken').length;
    
    countElement.textContent = `${count} medicines (${taken} taken)`;
}

// ============================================
// 5. SHOW REMINDER ALERT
// ============================================

function startReminderCheck() {
    // Check every minute for reminders
    reminderInterval = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();
}

function checkReminders() {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;
    
    // Find medicines that need to be taken now
    const pendingMedicines = todayMedicines.filter(
        m => m.status === 'pending' && m.time === currentTime
    );
    
    if (pendingMedicines.length > 0) {
        showReminderAlert(pendingMedicines);
    }
}

function showReminderAlert(medicines) {
    // Prevent multiple alerts
    if (currentReminder) return;
    
    currentReminder = medicines;
    
    const reminderModal = document.getElementById('reminder-modal');
    const reminderMessage = document.getElementById('reminder-message');
    
    // Create reminder message
    const names = medicines.map(m => m.name).join(', ');
    reminderMessage.textContent = `Time to take: ${names}`;
    
    // Show modal
    reminderModal.style.display = 'flex';
    
    // Play notification sound (optional)
    playNotificationSound();
}

function playNotificationSound() {
    // Simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
}

// ============================================
// 6. HANDLE NAVIGATION ACTIONS
// ============================================

function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Add Medicine Button
    document.getElementById('add-medicine-btn').addEventListener('click', openAddMedicineModal);
    
    // Close Modal
    document.getElementById('close-modal').addEventListener('click', closeAddMedicineModal);
    document.getElementById('close-reminder').addEventListener('click', closeReminderModal);
    
    // Add Medicine Form
    document.getElementById('add-medicine-form').addEventListener('submit', handleAddMedicine);
    
    // Reminder Actions
    document.getElementById('btn-taken').addEventListener('click', handleMedicineTaken);
    document.getElementById('btn-snooze').addEventListener('click', handleSnooze);
    
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const addModal = document.getElementById('add-medicine-modal');
        const reminderModal = document.getElementById('reminder-modal');
        
        if (event.target === addModal) {
            closeAddMedicineModal();
        }
        if (event.target === reminderModal) {
            closeReminderModal();
        }
    });
}

function handleNavigation(e) {
    e.preventDefault();
    
    const page = e.target.dataset.page;
    
    // Update active link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Handle different pages
    switch(page) {
        case 'dashboard':
            loadTodayMedicines();
            break;
        case 'history':
            showPage('history');
            break;
        case 'profile':
            showPage('profile');
            break;
        case 'settings':
            showPage('settings');
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            console.log('Navigating to:', page);
    }
}

function showPage(pageName) {
    // In production, this would navigate to different pages
    alert(`Navigating to ${pageName} page`);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        localStorage.removeItem('userSession');
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// ============================================
// 7. ADD MEDICINE FUNCTIONALITY
// ============================================

function openAddMedicineModal() {
    document.getElementById('add-medicine-modal').style.display = 'flex';
}

function closeAddMedicineModal() {
    document.getElementById('add-medicine-modal').style.display = 'none';
    document.getElementById('add-medicine-form').reset();
}

function handleAddMedicine(e) {
    e.preventDefault();
    
    const medicineName = document.getElementById('medicine-name').value;
    const medicineTime = document.getElementById('medicine-time').value;
    const medicineDosage = document.getElementById('medicine-dosage').value;
    
    const newMedicine = {
        id: Date.now(),
        name: medicineName,
        time: medicineTime,
        dosage: medicineDosage,
        status: 'pending',
        takenAt: null
    };
    
    // Add to medicines array
    todayMedicines.push(newMedicine);
    
    // Sort by time
    todayMedicines.sort((a, b) => a.time.localeCompare(b.time));
    
    // Update display
    displayMedicineSchedule();
    updateMedicineCount();
    
    // Close modal
    closeAddMedicineModal();
    
    // Show success message
    showSuccessMessage('Medicine added successfully!');
}

// ============================================
// 8. MEDICINE STATUS & ACTIONS
// ============================================

function toggleMedicineStatus(medicineId) {
    const medicine = todayMedicines.find(m => m.id === medicineId);
    
    if (medicine) {
        if (medicine.status === 'pending') {
            medicine.status = 'taken';
            medicine.takenAt = new Date().toISOString();
            showSuccessMessage('Medicine marked as taken!');
        } else {
            medicine.status = 'pending';
            medicine.takenAt = null;
            showInfoMessage('Medicine marked as pending.');
        }
        
        // Update display
        displayMedicineSchedule();
        updateMedicineCount();
    }
}

function editMedicine(medicineId) {
    const medicine = todayMedicines.find(m => m.id === medicineId);
    
    if (medicine) {
        // Open modal with pre-filled data
        document.getElementById('medicine-name').value = medicine.name;
        document.getElementById('medicine-time').value = medicine.time;
        document.getElementById('medicine-dosage').value = medicine.dosage;
        
        // Open modal
        openAddMedicineModal();
        
        // Store edit ID for update
        window.editingId = medicineId;
    }
}

function deleteMedicine(medicineId) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        // Remove from array
        todayMedicines = todayMedicines.filter(m => m.id !== medicineId);
        
        // Update display
        displayMedicineSchedule();
        updateMedicineCount();
        
        // Show success message
        showSuccessMessage('Medicine deleted successfully!');
    }
}

// ============================================
// 9. REMINDER ACTIONS
// ============================================

function handleMedicineTaken() {
    if (currentReminder) {
        // Mark all reminder medicines as taken
        currentReminder.forEach(medicine => {
            const medicineObj = todayMedicines.find(m => m.id === medicine.id);
            if (medicineObj) {
                medicineObj.status = 'taken';
                medicineObj.takenAt = new Date().toISOString();
            }
        });
        
        // Update display
        displayMedicineSchedule();
        updateMedicineCount();
        
        // Close reminder modal
        closeReminderModal();
        
        // Show success message
        showSuccessMessage('Medicine marked as taken!');
    }
}

function handleSnooze() {
    // Snooze reminder for 15 minutes
    if (currentReminder) {
        setTimeout(() => {
            showReminderAlert(currentReminder);
        }, 15 * 60 * 1000); // 15 minutes
    }
    
    closeReminderModal();
}

function closeReminderModal() {
    document.getElementById('reminder-modal').style.display = 'none';
    currentReminder = null;
}

// ============================================
// 10. UTILITY FUNCTIONS
// ============================================

function showSuccessMessage(message) {
    alert(`✅ ${message}`);
}

function showInfoMessage(message) {
    alert(`ℹ️ ${message}`);
}

function showErrorMessage(message) {
    alert(`❌ ${message}`);
}

// ============================================
// 11. SAVE TO LOCAL STORAGE (Optional)
// ============================================

function saveMedicinesToStorage() {
    localStorage.setItem('todayMedicines', JSON.stringify(todayMedicines));
}

function loadMedicinesFromStorage() {
    const stored = localStorage.getItem('todayMedicines');
    if (stored) {
        todayMedicines = JSON.parse(stored);
    }
}

// Call on initialization
loadMedicinesFromStorage();