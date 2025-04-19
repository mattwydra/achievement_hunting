// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Track completed achievements
    const achievementCards = document.querySelectorAll('.achievement-card');
    let completedCount = document.querySelectorAll('.achievement-card.completed').length;
    const totalCount = achievementCards.length;
    
    // Update progress bar
    updateProgressBar(completedCount, totalCount);
    
    // Make achievement cards toggleable
    achievementCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('completed');
            
            // Update completion count
            completedCount = document.querySelectorAll('.achievement-card.completed').length;
            updateProgressBar(completedCount, totalCount);
            
            // Save completion state
            saveCompletionState();
        });
    });
    
    // Load saved completion states
    loadCompletionState();
    
    // Filter functionality (if added later)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Toggle active class on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter achievement cards
            if (filter === 'all') {
                achievementCards.forEach(card => card.style.display = 'block');
            } else if (filter === 'completed') {
                achievementCards.forEach(card => {
                    card.style.display = card.classList.contains('completed') ? 'block' : 'none';
                });
            } else if (filter === 'incomplete') {
                achievementCards.forEach(card => {
                    card.style.display = !card.classList.contains('completed') ? 'block' : 'none';
                });
            }
        });
    });
});

// Update the progress bar with current completion
function updateProgressBar(completed, total) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        const percentage = Math.round((completed / total) * 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${completed}/${total} achievements completed (${percentage}%)`;
    }
}

// Save completion state to localStorage
function saveCompletionState() {
    const achievements = document.querySelectorAll('.achievement-card');
    const completionState = {};
    
    achievements.forEach(achievement => {
        const id = achievement.getAttribute('data-id');
        completionState[id] = achievement.classList.contains('completed');
    });
    
    // Get current page to store category-specific data
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    localStorage.setItem(`terraria-achievements-${currentPage}`, JSON.stringify(completionState));
}

// Load completion state from localStorage
function loadCompletionState() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const savedState = localStorage.getItem(`terraria-achievements-${currentPage}`);
    
    if (savedState) {
        const completionState = JSON.parse(savedState);
        const achievements = document.querySelectorAll('.achievement-card');
        
        achievements.forEach(achievement => {
            const id = achievement.getAttribute('data-id');
            if (completionState[id]) {
                achievement.classList.add('completed');
            } else {
                achievement.classList.remove('completed');
            }
        });
        
        // Update progress
        const completedCount = document.querySelectorAll('.achievement-card.completed').length;
        const totalCount = achievements.length;
        updateProgressBar(completedCount, totalCount);
    }
}