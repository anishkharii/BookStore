const fun = async () => {
    let data = await document.querySelector('.updatebook').addEventListener('click', (e) => { e.target.parentNode.parentNode.parentNode.firstChild.innerHTML })
}
fun()
document.querySelector('.deletebook').addEventListener('click', (e) => { console.log(e.target) })


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