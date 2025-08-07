const products = [
  { id: 1, title: "Floral Summer Dress", price: 1000, image: "assests/product-1.jpg" },
  { id: 2, title: "Classic Black Gown", price: 1350, image: "assests/product-2.jpg" },
  { id: 3, title: "Boho Maxi Dress", price: 2300, image: "assests/product-3.jpg" },
  { id: 4, title: "Red Satin Evening Dress", price: 800, image: "assests/product-4.jpg" },
  { id: 5, title: "Linen Shirt Dress", price: 5400, image: "assests/product-5.jpg" },
  { id: 6, title: "Polka Dot Wrap Dress", price: 3000, image: "assests/product-6.jpg" },
];

const grid = document.querySelector(".product-grid");
const selectedList = document.querySelector(".selected-products");
const subtotalEl = document.querySelector(".subtotal-value");
const discountEl = document.querySelector(".discount-value");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.querySelector(".progress-text");
const ctaButton = document.querySelector(".cta-button");

let selected = [];

function updateSidebar() {
  selectedList.innerHTML = "";
  let subtotal = 0;

  selected.forEach((product) => {
    // Add quantity field (default 1) to the product
    if (!product.quantity) product.quantity = 1;

    const li = document.createElement("li");
    li.classList.add("bundle-item");

    li.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="bundle-info">
        <p class="bundle-title">${product.title}</p>
        <p class="bundle-price">₹${product.price} x ${product.quantity}</p>
        <div class="quantity-controls">
          <button class="decrease">−</button>
          <span class="qty-display">${product.quantity}</span>
          <button class="increase">+</button>
        </div>
      </div>
      <button class="remove-btn" title="Remove">
        <img src="assests/icons/Close.svg" alt="Remove" class="btn-icon" />
      </button>
    `;

    // Quantity logic
    const increaseBtn = li.querySelector(".increase");
    const decreaseBtn = li.querySelector(".decrease");
    const qtyDisplay = li.querySelector(".qty-display");

    increaseBtn.addEventListener("click", () => {
      product.quantity += 1;
      updateSidebar();
    });

    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 1) {
        product.quantity -= 1;
        updateSidebar();
      }
    });

    // Remove product from bundle
    li.querySelector(".remove-btn").addEventListener("click", () => {
      selected = selected.filter((p) => p.id !== product.id);
      updateSidebar();

      // Reset main product button
      const allProductCards = document.querySelectorAll(".product-card");
      allProductCards.forEach((card) => {
        const titleEl = card.querySelector("h4");
        if (titleEl && titleEl.textContent === product.title) {
          const btn = card.querySelector("button");
          if (btn) {
            btn.classList.remove("selected");
            btn.innerHTML = `
              <img src="assests/icons/Plus.svg" alt="Add Icon" class="btn-icon" />
              <span>Add to Bundle</span>
            `;
          }
        }
      });
    });

    selectedList.appendChild(li);
    subtotal += product.price * product.quantity;
  });

  const discount = selected.length >= 3 ? 0.3 : 0;
  const finalTotal = subtotal * (1 - discount);

  subtotalEl.textContent = finalTotal.toFixed(2);
  discountEl.textContent = `${discount * 100}%`;

  const discountAmountEl = document.querySelector(".discount-amount");
  const discountAmount = subtotal * discount;
document.querySelector(".discount-amount").textContent = `₹${discountAmount.toFixed(2)}`;
document.querySelector(".discount-value").textContent = `${discount * 100}%`;

  const progressPercent = Math.min((selected.length / 3) * 100, 100);
  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `${selected.length}/3 selected`;

  ctaButton.disabled = selected.length < 3;
}

function createCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const button = document.createElement("button");
  button.className = "add-btn";
button.innerHTML = `
  <div class="btn-content">
    <span>Add to Bundle</span>
    <img src="assests/icons/Plus.svg" alt="Add Icon" class="btn-icon" />
  </div>
`;

  button.addEventListener("click", () => {
    const isSelected = selected.find((p) => p.id === product.id);
    if (isSelected) {
      selected = selected.filter((p) => p.id !== product.id);
      button.classList.remove("selected");
      button.innerHTML = `
      <div class="btn-content">
      <span>Add to Bundle</span>
      <img src="assests/icons/Plus.svg" alt="Add Icon" class="btn-icon" />
      </div>
      `;
    } else {
      selected.push(product);
      button.classList.add("selected");
      button.innerHTML = `
      <div class="btn-content">
      <span>Added </span>
      <img src="assests/icons/Check.svg" alt="Added Icon" class="btn-icon" />
      </div>
      `;
    }
    updateSidebar();
  });

  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" />
    <h4>${product.title}</h4>
    <p>₹${product.price}</p>
  `;
  card.appendChild(button);

  return card;
}

// Render products
products.forEach((product) => {
  const card = createCard(product);
  grid.appendChild(card);
});

// CTA button
ctaButton.addEventListener("click", () => {
  console.log("Bundle selected:", selected);

  // Change button text to "Added to Cart" with icon
  ctaButton.innerHTML = `
    <span>Added to Cart</span>
    <img src="assests/icons/Check.svg" alt="Done" class="btn-icon" />
  `;
  ctaButton.disabled = true;
  ctaButton.classList.add("added-to-cart");

  // Auto-refresh after 3 seconds
  setTimeout(() => {
    window.location.reload();
  }, 5000);
});
