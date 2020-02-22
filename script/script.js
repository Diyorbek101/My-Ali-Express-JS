document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector(".search"),
    cartBtn = document.getElementById("cart"),
    wishlistBtn = document.getElementById("wishlist"),
    goodsWrapper = document.querySelector(".goods-wrapper"),
    cart = document.querySelector(".cart"),
    category = document.querySelector(".category"),
    cardCounter = cartBtn.querySelector(".counter"),
    wishlistCount = wishlistBtn.querySelector(".counter"),
   cartWrapper = document.querySelector(".cart-wrapper");
  // card-add-wishlist
  const wishlist = [];
  const goodsBasket = {};

  const loading = nameFunc => {
    const spinner = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
  </div><div><div>
  </div></div><div><div>
  </div></div><div><div>
  </div></div></div></div>
  </div>`;
    if (nameFunc === "renderCard") {
      goodsWrapper.innerHTML = spinner;
    }
    if (nameFunc === "renderBasket") {
      cartWrapper.innerHTML = spinner;
    }
  };

  const createCardGoods = (id, title, price, img) => {
    const card = document.createElement("div");

    card.className = "card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3";
    card.innerHTML = `<div class="card">
       <div class="card-img-wrapper">
           <img class="card-img-top" src="${img}" alt="">
            <button class="card-add-wishlist ${
              wishlist.includes(id) ? "active" : ""
            }" 
           data-goods-id="${id}"></button>
       </div>
       <div class="card-body justify-content-between">
             <a href="#" class="card-title">${title}</a>
           <div class="card-price">${price}₽</div>
           <div>
               <button class="card-add-cart"  data-goods-id="${id}"a>Добавить в корзину</button>
           </div>
       </div>
   </div>`;
    return card; // RETURN RETURN RETURN RETURN
  };

  const renderCard = items => {
    goodsWrapper.textContent = ``;
    if (items.length) {
      items.forEach(({ id, title, price, imgMin }) => {
        goodsWrapper.append(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = `❌ Товар не Найден`;
    }
  };
  //рендер  товаров в корзине

  const createCartGoodsBasket = (id, title, price, img) => {
    const card = document.createElement("div");

    card.className = "goods";
    card.innerHTML = `<div class="goods-img-wrapper">
            <img class="goods-img" src="${img}" alt="">
          </div>
          <div class="goods-description">
            <h2 class="goods-title">${title}</h2>
            <p class="goods-price">${price} ₽</p>

          </div>
          <div class="goods-price-count">
            <div class="goods-trigger">
              <button class="goods-add-wishlist ${
                wishlist.includes(id) ? "active" : ""
              }" data-goods-id="${id}"></button>
              <button class="goods-delete" data-goods-id="${id}"></button>
            </div>
            <div class="goods-count">${goodsBasket[id]}</div>
          </div>`;
    return card; // RETURN RETURN RETURN RETURN
  };
  // get
  const renderBasket = goods => {
    cartWrapper.textContent = ``;
    if (goods.length) {
      goods.forEach(({ id, title, price, imgMin }) => {
        cartWrapper.append(createCartGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = `<div id="cart-empty">Ваша корзина пока пуста</div>`;
    }
  };
  
  const closeCart = event => {
    const target = event.target;

    if (
      target === cart ||
      target.classList.contains("cart-close") ||
      event.keyCode === 27
    ) {
      cart.style.display = "none";
      document.removeEventListener("keyup", closeCart);
      // getGoods(renderCard,randomSort)
    }
  };
  // RegExp

//-----------------------------
  const calcTotalPrice = goods => {
    // let sum = 0;
    let sum = goods.reduce((accum, item) => {
      return accum + item.price * goodsBasket[item.id];
    }, 0);

    cart.querySelector(".cart-total>span").textContent = sum.toFixed(2);
  };
//-----------------------------

  const showCardBasket = goods => {
    const basketGoods = goods.filter(item =>
      goodsBasket.hasOwnProperty(item.id)
    );  
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  const openCart = event => {
    event.preventDefault();
    cart.style.display = "flex";
    document.addEventListener("keyup", closeCart);
    getGoods(renderBasket, showCardBasket);
  };

  const getGoods = (handler, filter) => {
    loading(handler.name); //IS LOADER
    fetch("db/db.json")
      .then(response => response.json())
      .then(filter)
      .then(handler);
  };

  const randomSort = item => {
    return item.sort(() => Math.random() - 0.5);
  };
  const choiceCategory = event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains("category-item")) {
      const category = target.dataset.category;
      getGoods(renderCard, goods =>
        goods.filter(item => item.category.includes(category))
      );
    }
  };
  const searchGoods = event => {
    event.preventDefault();
    const input = event.target.elements.searchGoods;
    const inputValue = input.value.trim();
    if (inputValue !== "") {
      const searchString = new RegExp(inputValue, "i");
      getGoods(renderCard, goods => {
        return goods.filter(item => searchString.test(item.title));
      });
    } else {
      search.classList.add("error");
      setTimeout(() => {
        search.classList.remove("error");
      }, 2000);
    }

    input.value = "";
  };

  const getCookie = name => {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  const CheckCount = () => {
    wishlistCount.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  };
  const cookieQuery = get => {
    if (get) {
      if (getCookie("goodsBasket")) {
        // goodsBasket = ;
        Object.assign(goodsBasket, JSON.parse(getCookie("goodsBasket")));
      }

      CheckCount();
    } else {
      document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; `;
    }
  };
  const storageQuery = get => {
    if (get) {
      if (localStorage.getItem("wishlist")) {
        /*const wishlistStorage = JSON.parse(localStorage.getItem("wishlist"));
         wishlistStorage.forEach(id => wishlist.push(id));*/

        wishlist.push(...JSON.parse(localStorage.getItem("wishlist")));
      }
      CheckCount();
    } else {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  };
  const toggleWishList = (id, elem) => {
    if (wishlist.includes(id)) {
      wishlist.splice(wishlist.indexOf(id), 2);
      elem.classList.remove("active");
    } else {
      wishlist.push(id);
      elem.classList.add("active");
    }
    CheckCount();
    storageQuery();
  };
  const addBasket = id => {
    if (goodsBasket[id]) {
      goodsBasket[id] += 1;
    } else {
      goodsBasket[id] = 1;
    }

    CheckCount();
    cookieQuery();
  };
  const handlerGoods = event => {
    const target = event.target;
    if (target.classList.contains("card-add-wishlist")) {
      toggleWishList(target.dataset.goodsId, target);
    }
    if (target.classList.contains("card-add-cart")) {
      addBasket(target.dataset.goodsId);
    }
  };
  const removeGoods = (id)=>{
    delete goodsBasket[id] 
    CheckCount();
    cookieQuery();
    getGoods(renderBasket,showCardBasket);
  }
  const handlerBasket = (event)=>{
     
    const target = event.target;
     
     if(target.classList.contains('goods-add-wishlist')){
       toggleWishList(target.dataset.goodsId,target);
     }
    if(target.classList.contains('goods-delete')){
      removeGoods(target.dataset.goodsId);
    }
  }


  const showWishList = () => {
    getGoods(renderCard, goods =>
      goods.filter(item => wishlist.includes(item.id))
    );
  };
  // calcTotalPrice
  
  cartBtn.addEventListener("click", openCart);
  cart.addEventListener("click", closeCart);
  category.addEventListener("click", choiceCategory);
  search.addEventListener("submit", searchGoods);
  goodsWrapper.addEventListener("click", handlerGoods);
  wishlistBtn.addEventListener("click", showWishList);
  cartWrapper.addEventListener('click',handlerBasket);

  getGoods(renderCard, randomSort);
  // getGoods(renderBasket, randomSort);
  storageQuery("get");
  cookieQuery("get");
});