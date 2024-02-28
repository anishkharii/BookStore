document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const confirmation = document.getElementById("confirmation");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        confirmation.innerHTML = "Your message has been sent!";
        contactForm.reset();
    });
});

let bars = document.querySelector('.fa-bars')
bars.addEventListener('click', () => {
    document.querySelector('.nav-ul').classList.toggle('activeul')
    console.log(document.querySelector('.nav-hr').classList)
    document.querySelector('.nav-hr').classList.toggle('margin-hr')
})
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}