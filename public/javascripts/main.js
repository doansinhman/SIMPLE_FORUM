$(document).ready(function() {
    while (!localStorage.getItem('name') || localStorage.getItem('name') == 'null') {
        localStorage.setItem('name', window.prompt('Enter your name:', 'Anonymous'));
    }
    if (new Date() - new Date(localStorage.getItem('last_login')) >= 30 * 60 * 1000) {
        alert('Hello ' + localStorage.getItem('name'));
    }
    localStorage.setItem('last_login', new Date());
});

function logOut() {
    localStorage.removeItem('name');
    location.reload();
}