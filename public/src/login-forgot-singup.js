let bars = document.querySelector('.fa-bars')
bars.addEventListener('click', () => {
    // document.querySelector('.nav-ul').style.left = "0%"
    document.querySelector('.nav-ul').classList.toggle('activeul')
    document.querySelector('.form-container').classList.toggle('form-container-res')

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