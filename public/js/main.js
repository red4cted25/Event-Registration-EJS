document.addEventListener('DOMContentLoaded', () => {
    // Check if the URL has the "success" parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        // Show a success alert if the parameter exists
        alert('Your data was uploaded successfully!');
    }
});