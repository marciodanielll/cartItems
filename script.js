function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}
function saveCartItemsLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartItems.innerHTML);
}
function getTotalValueItens() {
  const cartItem = document.querySelectorAll('.cart__item');
  let total = 0;
  cartItem.forEach((element) => {
    total += parseFloat(element.innerText.split('$')[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = total;
}
function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  getTotalValueItens();
  saveCartItemsLocalStorage();
}
function getItemsCarsLocalStorage() {
  const cartItemsLocalStorage = localStorage.getItem('cartItems');
  const carItems = document.querySelector('.cart__items');
  carItems.innerHTML = cartItemsLocalStorage;
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function createItensList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((element) => {
        const objItens = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement(objItens));
      });
    },
    );
}
function moveItensCart(event) {
  if (event.target.classList.contains('item__add')) {
    const parentNode = event.target.parentNode;
    const sku = getSkuFromProductItem(parentNode);
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        const itemObjCartItems = {
          sku,
          name: data.title,
          salePrice: data.price,
        };
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(createCartItemElement(itemObjCartItems));
        getTotalValueItens();
        saveCartItemsLocalStorage();
      });
  }
}
function addItensCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', moveItensCart);
}
function emptyCartItems() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    getTotalValueItens();
  });
}
window.onload = async () => {
  createItensList();
  addItensCart();
  getItemsCarsLocalStorage();
  emptyCartItems();
  getTotalValueItens();
};
