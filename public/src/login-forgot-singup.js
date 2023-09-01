let bars = document.querySelector('.fa-bars')
bars.addEventListener('click', () => {
    // document.querySelector('.nav-ul').style.left = "0%"
    document.querySelector('.nav-ul').classList.toggle('activeul')
    document.querySelector('.form-container').classList.toggle('form-container-res')

})