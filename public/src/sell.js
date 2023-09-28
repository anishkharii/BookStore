let bars = document.querySelector('.fa-bars')
bars.addEventListener('click', () => {
    // document.querySelector('.nav-ul').style.left = "0%"
    document.querySelector('.nav-ul').classList.toggle('activeul')
    document.querySelector('.sell-body').classList.toggle('sell-body-m')

})
