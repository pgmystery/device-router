'use strict';

// Set the header-text with the current version of the app:
document.getElementById('headerText')
    .textContent = "Rounector v" + appVersion.toUpperCase().replace('-', ' ');

// Make the exit-button working
document.getElementById('exit').addEventListener('click', e => {
    e.preventDefault();
    closeApp();
});
