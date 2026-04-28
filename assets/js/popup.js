/*
  Popup Javascript Logic for Startup Solicitors
  Instant Entry Popup: Shows instantly on page load, once per session.
*/

document.addEventListener('DOMContentLoaded', () => {
    const instantPopup = document.getElementById('ak-instant-popup');
    
    // Check if popup exists
    if (!instantPopup) return;

    const popupClose = instantPopup.querySelector('.ak-popup-close');
    
    // Utility to close a popup
    const closePopup = (popupElement) => {
        popupElement.classList.remove('active');
        // Wait for CSS transition to finish before hiding completely
        setTimeout(() => {
             popupElement.style.display = 'none';
        }, 500); // 0.5s matches CSS transition
    };

    // Utility to open a popup
    const openPopup = (popupElement) => {
        popupElement.style.display = 'flex';
        // Force reflow
        void popupElement.offsetWidth;
        popupElement.classList.add('active');
    };

    // Close button event listeners
    popupClose.addEventListener('click', () => closePopup(instantPopup));

    // Close when clicking outside the container
    instantPopup.addEventListener('click', (e) => {
        if (e.target === instantPopup) closePopup(instantPopup);
    });

    // Session logic setup
    const hasSeenPopup = sessionStorage.getItem('ak_instant_popup_seen');

    // Trigger Instantly on load (with tiny delay to allow paint)
    if (!hasSeenPopup) {
        setTimeout(() => {
            openPopup(instantPopup);
            sessionStorage.setItem('ak_instant_popup_seen', 'true');
        }, 100);
    }
});
