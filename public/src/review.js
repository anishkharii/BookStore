let bars = document.querySelector('.fa-bars')
bars.addEventListener('click', () => {
    document.querySelector('.nav-ul').classList.toggle('activeul')
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
let a = document.getElementsByClassName('review-star-ul')
fetch('review.json')
    .then((response) => response.json())
    .then((json) => {
        for (let i = 0; i < json.length; i++) {
            a[i].innerHTML = ''
            let numbers = parseInt(json[i]['rating'])
            let remaining = 5 - numbers
            for (let j = 0; j < numbers; j++) {
                a[i].innerHTML += `<li><i class="fa-solid fa-star"></i></li>`
            }
            for (let j = 0; j < remaining; j++) {
                a[i].innerHTML += `   <li><i class="fa-regular fa-star"></i></li>`
            }
        }
    })
