function initNavigationPrevention() {
    // Add initial state
    history.pushState(null, null, location.href);
    
    // Add another state so back button has to be clicked twice to trigger
    history.pushState(null, null, location.href);
    
    window.onpopstate = function () {
        // Show message
        alert("Navigation back is not allowed. Please stay on this page and complete the level!");
        
        // Push state again to prevent back navigation
        history.pushState(null, null, location.href);
    };
    
    // Also prevent using keyboard shortcuts for navigation
    window.addEventListener('keydown', function(e) {
        if ((e.key === 'Backspace' || e.key === 'Alt') && !isInputFocused()) {
            e.preventDefault();
            alert("Navigation back is not allowed. Please stay on this page and complete the level!");
        }
    });
}

// Helper function to check if an input element is focused
function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable;
}
