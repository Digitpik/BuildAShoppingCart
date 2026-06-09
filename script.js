 const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

class Dessert {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }
}

const products = [
  new Dessert(1, "Vanilla Cupcakes (6 Pack)", 12.99, "Cupcake"),
  new Dessert(2, "French Macaron", 3.99, "Macaron"),
  new Dessert(3, "Pumpkin Cupcake", 3.99, "Cupcake"),
  new Dessert(4, "Chocolate Cupcake", 5.99, "Cupcake"),
  new Dessert(5, "Chocolate Pretzels (4 Pack)", 10.99, "Pretzel"),
  new Dessert(6, "Strawberry Ice Cream", 2.99, "Ice Cream"),
  new Dessert(7, "Chocolate Macarons (4 Pack)", 9.99, "Macaron"),
  new Dessert(8, "Strawberry Pretzel", 4.99, "Pretzel"),
  new Dessert(9, "Butter Pecan Ice Cream", 2.99, "Ice Cream"),
  new Dessert(10, "Rocky Road Ice Cream", 2.99, "Ice Cream"),
  new Dessert(11, "Vanilla Macarons (5 Pack)", 11.99, "Macaron"),
  new Dessert(12, "Lemon Cupcakes (4 Pack)", 12.99, "Cupcake"),
];

products.forEach(
  ({ name, id, price, category }) => {
    dessertCards.innerHTML += `
      <div class="dessert-card">
        <h2>${name}</h2>
        <p class="dessert-price">$${price}</p>
        <p class="product-category">Category: ${category}</p>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Add to cart
        </button>
      </div>
    `;
  }
);

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, price } = product;
    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((dessert) => {
      totalCountPerProduct[dessert.id] = (totalCountPerProduct[dessert.id] || 0) + 1;
    })

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);

    currentProductCount > 1 
      ? currentProductCountSpan.textContent = `${currentProductCount}x`
      : productsContainer.innerHTML += `
      <div id="dessert${id}" class="product">
        <p>
          <span class="product-count" id="product-count-for-id${id}"></span>${name}
        </p>
        <p>${price}</p>
      </div>
      `;
  }

  getCounts() {
    return this.items.length;
  }

  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;
    return this.total;
  }
};

const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach(
  (btn) => {
    btn.addEventListener("click", (event) => {
      cart.addItem(Number(event.target.id), products);
      totalNumberOfItems.textContent = cart.getCounts();
      cart.calculateTotal();
    })
  }
);

cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));

// =========================================================
// NEW: DYNAMIC CHECKOUT MODAL INTERACTIVE LOGIC
// =========================================================

// Grab DOM Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const confirmOrderBtn = document.getElementById('confirm-order-btn');

// Dynamically inject a visible "Checkout" button right inside the FreeCodeCamp shopping cart panel
if (cartContainer && !document.getElementById('open-checkout-btn')) {
    const checkoutTriggerBtn = document.createElement('button');
    checkoutTriggerBtn.id = 'open-checkout-btn';
    checkoutTriggerBtn.className = 'btn';
    checkoutTriggerBtn.style.margin = "15px auto";
    checkoutTriggerBtn.style.width = "85%";
    checkoutTriggerBtn.innerText = "Checkout 💳";
    cartContainer.appendChild(checkoutTriggerBtn);
    
    // Wire up the button to collect cart data and trigger our modal display!
    checkoutTriggerBtn.addEventListener('click', () => {
        openCheckoutModal();
    });
}

function openCheckoutModal() {
    const modalItemsList = document.getElementById('modal-items-list');
    const modalTotalPrice = document.getElementById('modal-total-price');
    
    modalItemsList.innerHTML = "";
    
    if (cart.items.length === 0) {
        modalItemsList.innerHTML = "<p style='text-align:center; color:#777;'>Your cart is empty! Add some sweets first. 🛒</p>";
        modalTotalPrice.innerText = "$0.00";
    } else {
        // Group the individual cart items to calculate quantities accurately
        const groupedCounts = {};
        cart.items.forEach((item) => {
            groupedCounts[item.id] = (groupedCounts[item.id] || { name: item.name, price: item.price, quantity: 0 });
            groupedCounts[item.id].quantity += 1;
        });
        
        // Append text dynamically into the modal list view area
        Object.values(groupedCounts).forEach(item => {
            const itemRow = document.createElement('p');
            itemRow.style.margin = "8px 0";
            itemRow.innerHTML = `<strong>${item.name}</strong> x ${item.quantity} - <span style='color:#ff6f61;'>$${(item.price * item.quantity).toFixed(2)}</span>`;
            modalItemsList.appendChild(itemRow);
        });
        
        modalTotalPrice.innerText = cartTotal.textContent;
    }
    
    // Slide modal on screen
    checkoutModal.classList.add('open');
}

// Close Modal
closeModalBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('open');
});

// Confirm Order Action
confirmOrderBtn.addEventListener('click', () => {
    alert("✨ Order Placed Successfully! E go sweet you well well! 🍰");
    checkoutModal.classList.remove('open');
    
    // Wipe out the local cart state instantly
    cart.items = [];
    cart.total = 0;
    productsContainer.innerHTML = "";
    totalNumberOfItems.textContent = 0;
    cartSubTotal.textContent = 0;
    cartTaxes.textContent = 0;
    cartTotal.textContent = 0;
});