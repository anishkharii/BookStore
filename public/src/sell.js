
let bars = document.querySelector('.fa-bars')
bars.addEventListener('click', () => {
    document.querySelector('.nav-ul').classList.toggle('activeul')
    document.querySelector('.sell-body').classList.toggle('sell-body-m')

})

function myupdatefun() {
    document.getElementById("myupdateDropdown").classList.toggle("showupdate");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtnupdate')) {
        var dropdowns = document.getElementsByClassName("dropdown-content-update");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('showupdate')) {
                openDropdown.classList.remove('showupdate');
            }
        }
    }
}