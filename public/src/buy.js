let bars = document.querySelector('.fa-bars')

bars.addEventListener('click', () => {
  document.querySelector('.nav-ul').classList.toggle('activeul')
  document.querySelector('.hr-normal').classList.toggle('toogle-hr')

})
function myupdatefun() {
  document.getElementById("myupdateDropdown").classList.toggle("showupdate");
}



var selectBtn = document.getElementsByClassName('dropdown'),
  dropdownMenu = document.getElementsByClassName('dropdownMenu');

for (i = 0; i < selectBtn.length; i++) {
  selectBtn[i].onclick = function () {
    if (this.className.indexOf('active') > -1) {
      for (j = 0; j < selectBtn.length; j++) {
        removeClass(selectBtn[j], 'active')
      }
    } else {
      addClass(this, 'active');
    }
  };
}
for (i = 0; i < dropdownMenu.length; i++) {
  var child = dropdownMenu[i].children;
  for (j = 0; j < child.length; j++) {
    child[j].onclick = function () {
      var text = this.innerHTML;
      this.parentNode.previousElementSibling.children[0].innerHTML = text;
      toggleClass(this.parentNode, 'showMenu');
    };
  }
}

window.addEventListener('click', function (event) {
  for (i = 0; i < selectBtn.length; i++) {
    if (event.target != selectBtn[i].children[0]) {
      removeClass(selectBtn[i], 'active');
    }
  }
});




function toggleClass(el, classToToggle) {
  var classN = el.className;
  if (classN.indexOf(classToToggle) > -1) {
    el.className = classN.replace(" " + classToToggle, '');
  } else {
    el.className = classN + " " + classToToggle;
  }
}
function addClass(el, classToToggle) {
  var classN = el.className
  if (classN.indexOf(classToToggle) < 1) {
    el.className = classN + " " + classToToggle;
  }
}
function removeClass(el, classToToggle) {
  var classN = el.className;
  if (classN.indexOf(classToToggle) > -1) {
    el.className = classN.replace(" " + classToToggle, '');
  }
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





let bookdiv = document.querySelector('.buy-book-cont')
let categorylist = document.querySelector('.catagory-list')
let allcat = []
let displayproduct = async (allcheckcat = []) => {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      bookdiv.innerHTML = ''
      if (json.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }


      json.forEach((ele) => {
        if (!allcat.includes(ele.booktype)) {
          allcat.push(ele.booktype)
          console.log(ele.booktype)
          categorylist.innerHTML += `  <div class="form-group">
          <input type="checkbox" value=${ele.booktype}  onclick='categoryfilter()' id="${ele.booktype}">
          <label for="${ele.booktype}">${ele.booktype}</label>
        </div>`
        }
        if (allcheckcat.length == 0) {
          allcheckcat = allcat
        }
        if (allcheckcat.includes(ele.booktype)) {
          bookdiv.innerHTML += `
                                <div class="book">
                                   <div class="img-div">
                                     <img src="/uploads/${ele.imgpath}" alt="not rendre" />
                                   </div>
                                   <div class="book-detail">
                                       <p class="book-name-p" >${ele.bookname}</p>
                                       <p>Written By ${ele.authorname}</p>
                                       <p>Book are Written About a ${ele.booktype}</p> 
                                       <p class="rating">
                                       ${checkfun(ele.rating)}
                                          
                                       </p>    
                                       <form action="/wishlist/${ele.bookname}" method="get">
                                       <button class="wishlist-btn">Move To Wishlist</button>
                                      </form>                          
                                   </div>
                              
                                 <div class="btn-div">
                                

                                  <p class="price-p" >&dollar;${ele.price}</p>
                                  <p class="quantity-red-p">only ${ele.quantity} left !!</p>
                                  <form action="/addtocart/${ele.bookname}" method="get">
                                    <button type="submit">Add To Cart</button>
                                  </form>
                                  <form action="/buy/${ele.bookname}" method="post">
                                    <button class="buy-btn" type="submit">Buy</button>
                                  </form>
                                 </div>
                                </div>`
        }
      });
    })

}
function checkfun(num) {
  let str = ''
  for (let i = 0; i < num; i++) {
    str += '<i class="fa-solid fa-star"></i>'
  }
  let rema = 5 - num
  for (let i = 0; i < rema; i++) {
    str += '<i class="fa-regular fa-star"></i>'
  }
  return str;
}
displayproduct();

let categoryfilter = () => {
  let checkinput = document.querySelectorAll("input[type='checkbox']")
  let checkdata = []
  checkinput.forEach((e) => {
    if (e.checked) {
      checkdata.push(e.value)

    }
  })
  displayproduct(checkdata)
}

function search() {
  const searchbox = document.getElementById('search-item').value.toLowerCase();
  const storeitem = document.getElementsByClassName('buy-book-cont')
  const product = document.querySelectorAll('.book');

  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookarr = []
      json.forEach(ele => {
        bookarr.push(ele)
      })
      for (let index = 0; index < bookarr.length; index++) {
        let match = product[index].getElementsByTagName('p')[0];
        if (match) {
          let textval = match.textContent.toLocaleLowerCase() || match.innerHTML.toLowerCase()
          if (textval.indexOf(searchbox) > -1) {
            product[index].style.display = "";
          } else {
            product[index].style.display = "none";

          }
        }
      }
    })
}

function search2() {
  const searchbox = document.getElementById('search-item2').value.toLowerCase();
  const storeitem = document.getElementsByClassName('buy-book-cont')
  const product = document.querySelectorAll('.book');

  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookarr = []
      json.forEach(ele => {
        bookarr.push(ele)
      })
      for (let index = 0; index < bookarr.length; index++) {
        let match = product[index].getElementsByTagName('p')[0];
        if (match) {
          let textval = match.textContent.toLocaleLowerCase() || match.innerHTML.toLowerCase()
          if (textval.indexOf(searchbox) > -1) {
            product[index].style.display = "";
          } else {
            product[index].style.display = "none";

          }
        }
      }
    })


}
function lowtohigh() {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookdiv = document.querySelector('.buy-book-cont')
      json.sort(function (a, b) {
        return a.price - b.price;
      });
      bookdiv.innerHTML = ''
      if (json.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }

      json.forEach((ele) => {

        bookdiv.innerHTML += `
        <div class="book">
        <div class="img-div">
        <img src="/uploads/${ele.imgpath}" alt="not rendre" />
        </div>
        <div class="book-detail">
        <p class="book-name-p" >${ele.bookname}</p>
        <p>Written By ${ele.authorname}</p>
        <p>Book are Written About a ${ele.booktype}</p> 
        <p class="rating">
                                       ${checkfun(ele.rating)}
                                          
                                       </p>    
                                       <form action="/wishlist/${ele.bookname}" method="get">
                                       <button class="wishlist-btn">Move To Wishlist</button>
        </form>                          
        </div>
        
        <div class="btn-div">
        <p class="price-p" >&dollar;${ele.price}</p>
        <p class="quantity-red-p">only ${ele.quantity} left !!</p>

        <form action="/addtocart/${ele.bookname}" method="get">
        <button type="submit">Add To Cart</button>
        </form>
          <form action="/buy/${ele.bookname}" method="post">
            <button class="buy-btn" type="submit">Buy</button>
          </form>
        
        
        
        </div>
        </div>`
      })

    })
}


function hightolow() {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookdiv = document.querySelector('.buy-book-cont')
      json.sort(function (a, b) {
        return b.price - a.price;
      });
      bookdiv.innerHTML = ''
      if (json.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }
      json.forEach((ele) => {

        bookdiv.innerHTML += `
        <div class="book">
        <div class="img-div">
        <img src="/uploads/${ele.imgpath}" alt="not rendre" />
        </div>
        <div class="book-detail">
        <p class="book-name-p" >${ele.bookname}</p>
        <p>Written By ${ele.authorname}</p>
        <p>Book are Written About a ${ele.booktype}</p> 
        <p class="rating">
        ${checkfun(ele.rating)}
           
        </p>     
        <form action="/wishlist/${ele.bookname}" method="get">
        <button class="wishlist-btn">Move To Wishlist</button>
        </form>                          
        </div>
        
        <div class="btn-div">
        <p class="price-p" >&dollar;${ele.price}</p>
        <p class="quantity-red-p">only ${ele.quantity} left !!</p>

        <form action="/addtocart/${ele.bookname}" method="get">
        <button type="submit">Add To Cart</button>
        </form>
          <form action="/buy/${ele.bookname}" method="post">
            <button class="buy-btn" type="submit">Buy</button>
          </form>
        
        
        
        </div>
        </div>`
      })

    })
}



function below50() {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookdiv = document.querySelector('.buy-book-cont')
      let newarr = []
      json.forEach((ele) => {
        if (ele.price < 50) {
          newarr.push(ele)
        }
      })
      bookdiv.innerHTML = ''
      if (newarr.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }

      newarr.forEach((ele) => {

        bookdiv.innerHTML += `
        <div class="book">
        <div class="img-div">
        <img src="/uploads/${ele.imgpath}" alt="not rendre" />
        </div>
        <div class="book-detail">
        <p class="book-name-p" >${ele.bookname}</p>
        <p>Written By ${ele.authorname}</p>
        <p>Book are Written About a ${ele.booktype}</p> 
        <p class="rating">
                                       ${checkfun(ele.rating)}
                                          
                                       </p>     
                                       <form action="/wishlist/${ele.bookname}" method="get">
                                       <button class="wishlist-btn">Move To Wishlist</button>
        </form>                          
        </div>
        
        <div class="btn-div">
        <p class="price-p" >&dollar;${ele.price}</p>
        <p class="quantity-red-p">only ${ele.quantity} left !!</p>

        <form action="/addtocart/${ele.bookname}" method="get">
        <button type="submit">Add To Cart</button>
        </form>
          <form action="/buy/${ele.bookname}" method="post">
            <button class="buy-btn" type="submit">Buy</button>
          </form>
        
        
        
        </div>
        </div>`
      })

    })

}
function below75() {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookdiv = document.querySelector('.buy-book-cont')
      let newarr = []
      json.forEach((ele) => {
        if (ele.price <= 75) {
          newarr.push(ele)
        }
      })
      bookdiv.innerHTML = ''
      if (newarr.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }

      newarr.forEach((ele) => {

        bookdiv.innerHTML += `
      <div class="book">
      <div class="img-div">
      <img src="/uploads/${ele.imgpath}" alt="not rendre" />
      </div>
      <div class="book-detail">
      <p class="book-name-p" >${ele.bookname}</p>
      <p>Written By ${ele.authorname}</p>
      <p>Book are Written About a ${ele.booktype}</p> 
      <p class="rating">
      ${checkfun(ele.rating)}
         
      </p>     
      <form action="/wishlist/${ele.bookname}" method="get">
      <button class="wishlist-btn">Move To Wishlist</button>
      </form>                          
      </div>
      
      <div class="btn-div">
      <p class="price-p" >&dollar;${ele.price}</p>
      <p class="quantity-red-p">only ${ele.quantity} left !!</p>

      <form action="/addtocart/${ele.bookname}" method="get">
      <button type="submit">Add To Cart</button>
      </form>
        <form action="/buy/${ele.bookname}" method="post">
          <button class="buy-btn" type="submit">Buy</button>
        </form>
      
      
      
      </div>
      </div>`
      })

    })
}
function above150() {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookdiv = document.querySelector('.buy-book-cont')
      let newarr = []
      json.forEach((ele) => {
        if (ele.price >= 150) {
          newarr.push(ele)
        }
      })
      bookdiv.innerHTML = ''
      if (newarr.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }
      newarr.forEach((ele) => {

        bookdiv.innerHTML += `
      <div class="book">
      <div class="img-div">
      <img src="/uploads/${ele.imgpath}" alt="not rendre" />
      </div>
      <div class="book-detail">
      <p class="book-name-p" >${ele.bookname}</p>
      <p>Written By ${ele.authorname}</p>
      <p>Book are Written About a ${ele.booktype}</p> 
      <p class="rating">
      ${checkfun(ele.rating)}
         
      </p>     
      <form action="/wishlist/${ele.bookname}" method="get">
      <button class="wishlist-btn">Move To Wishlist</button>
      </form>                          
      </div>
      
      <div class="btn-div">
      <p class="price-p" >&dollar;${ele.price}</p>
      <p class="quantity-red-p">only ${ele.quantity} left !!</p>

      <form action="/addtocart/${ele.bookname}" method="get">
      <button type="submit">Add To Cart</button>
      </form>
        <form action="/buy/${ele.bookname}" method="post">
          <button class="buy-btn" type="submit">Buy</button>
        </form>
      
      
      
      </div>
      </div>`
      })

    })
}
function above175() {
  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let bookdiv = document.querySelector('.buy-book-cont')
      let newarr = []
      json.forEach((ele) => {
        if (ele.price >= 175) {
          newarr.push(ele)
        }
      })
      bookdiv.innerHTML = ''
      if (newarr.length == 0) {
        bookdiv.innerHTML += '<p class="no-book" >No Books</p>'
      }
      newarr.forEach((ele) => {

        bookdiv.innerHTML += `
      <div class="book">
      <div class="img-div">
      <img src="/uploads/${ele.imgpath}" alt="not rendre" />
      </div>
      <div class="book-detail">
      <p class="book-name-p" >${ele.bookname}</p>
      <p>Written By ${ele.authorname}</p>
      <p>Book are Written About a ${ele.booktype}</p>       
      <p class="rating">
                                       ${checkfun(ele.rating)}
                                          
                                       </p>      
                                       <form action="/wishlist/${ele.bookname}" method="get">
                                       <button class="wishlist-btn">Move To Wishlist</button>
      </form>                          
      </div>
      
      <div class="btn-div">
      <p class="price-p" >&dollar;${ele.price}</p>
      <p class="quantity-red-p">only ${ele.quantity} left !!</p>

      <form action="/addtocart/${ele.bookname}" method="get">
      <button type="submit">Add To Cart</button>
      </form>
        <form action="/buy/${ele.bookname}" method="post">
          <button class="buy-btn" type="submit">Buy</button>
        </form>
      </div>
      </div>`
      })

    })
}



function selectcatagoryfun() {

  fetch('prapi.json')
    .then((response) => response.json())
    .then((json) => {
      let selecttype = document.getElementById("mySelect").value

      let bookdiv = document.querySelector('.buy-book-cont')
      bookdiv.innerHTML = ''
      json.forEach((ele) => {
        if (ele.booktype === selecttype) {
          bookdiv.innerHTML += `
          <div class="book">
          <div class="img-div">
          <img src="/uploads/${ele.imgpath}" alt="not rendre" />
          </div>
          <div class="book-detail">
          <p class="book-name-p" >${ele.bookname}</p>
          <p>Written By ${ele.authorname}</p>
          <p>Book are Written About a ${ele.booktype}</p> 
          <p class="rating">
          ${checkfun(ele.rating)}
          </p>    
          <form action="/wishlist/${ele.bookname}" method="get">
          <button class="wishlist-btn">Move To Wishlist</button>
          </form>                          
          </div>
          
          <div class="btn-div">
          <p class="price-p" >&dollar;${ele.price}</p>
          <p class="quantity-red-p">only ${ele.quantity} left !!</p>

          <form action="/addtocart/${ele.bookname}" method="get">
          <button type="submit">Add To Cart</button>
          </form>
            <form action="/buy/${ele.bookname}" method="post">
              <button class="buy-btn" type="submit">Buy</button>
            </form>
          </div>
          </div>`
        }
      })

    })
}