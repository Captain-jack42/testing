window.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');

    if (userData && userData.isLoggedIn) {
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            if (userName) userName.textContent = userData.name || userData.email;
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
});

function logout() {
    localStorage.removeItem('userData');
    window.location.reload();
}

localStorage.setItem('userData', JSON.stringify({
    name: user.name,
    email: user.email,
    isLoggedIn: true
})); 