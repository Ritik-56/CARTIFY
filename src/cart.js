const productDiv = document.getElementById("products");
const loader = document.getElementById("loader");
const totalPriceEl = document.getElementById("totalPrice");
const checkout = document.getElementById("checkout");

async function loadCart() {
  try {
    const res = await fetch("http://localhost:5000/cart");
    const products = await res.json();

    loader.style.display = "none";
    productDiv.classList.remove("hidden");

    if (products.length === 0) {
      productDiv.innerHTML = `<p class="text-gray-600 col-span-full text-center">🛒 Your cart is empty</p>`;
      totalPriceEl.textContent = `Total: ₹0`;
      return;
    }

    let total = 0;
    productDiv.innerHTML = "";

    products.forEach(product => {
      const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
      total += price * product.quantity;

      const img = product.image ? product.image : "https://via.placeholder.com/150";

      const prod = document.createElement("div");
      prod.className = "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col justify-center";

      prod.innerHTML = `
    <div class="flex items-center justify-center gap-4">
      <img src="${img}" alt="${product.title}" class="w-20 h-20 object-cover rounded">
      <div>
        <h3 class="font-bold">${product.title}</h3>
        <p class="text-gray-600">₹${price}</p>
        <p class="text-sm text-gray-500">${product.category || ""}</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button class="dec-btn bg-gray-200 px-2 rounded" data-id="${product._id}">-</button>
      <span class="quantity">${product.quantity}</span>
      <button class="inc-btn bg-gray-200 px-2 rounded" data-id="${product._id}">+</button>
      <button class="remove-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" data-id="${product._id}">Remove</button>
    </div>
  `;

      productDiv.appendChild(prod);
    });

    totalPriceEl.textContent = `Total: ₹${total.toFixed(2)}`;

  } catch (err) {
    loader.style.display = "none";
    productDiv.classList.remove("hidden");
    productDiv.innerHTML = `<p class="text-red-500 text-center col-span-full">Error loading cart</p>`;
    console.error(err);
  }
}

async function updateQuantity(id, change) {
  try {
    await fetch(`http://localhost:5000/cart/${id}/quantity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ change })
    });
  } catch (err) {
    console.error("❌ Quantity update failed:", err);
  }
}


// ✅ Event delegation for remove button
productDiv.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("remove-btn")) {
    await removeFromCart(id);
    loadCart();
  }

  if (e.target.classList.contains("inc-btn")) {
    await updateQuantity(id, 1); // increase by 1
    loadCart();
  }

  if (e.target.classList.contains("dec-btn")) {
    await updateQuantity(id, -1); // decrease by 1
    loadCart();
  }
});


async function removeFromCart(id) {
  try {
    const res = await fetch(`http://localhost:5000/cart/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    console.log("✅ Delete response:", data);
  } catch (err) {
    console.error("❌ Remove failed:", err);
  }
}


//--------------------------------
function onGooglePayLoaded() {
  const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  const allowedCardNetworks = ["VISA", "MASTERCARD"];
  const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

  const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      'gateway': 'example',          // Replace with your gateway (Stripe, Razorpay)
      'gatewayMerchantId': 'exampleMerchantId'
    }
  };

  const cardPaymentMethod = {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: allowedCardAuthMethods,
      allowedCardNetworks: allowedCardNetworks
    },
    tokenizationSpecification: tokenizationSpecification
  };

  const paymentDataRequest = Object.assign({}, baseRequest, {
    allowedPaymentMethods: [cardPaymentMethod],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '0.00',       // Will update dynamically
      currencyCode: 'INR'
    },
    merchantInfo: {
      merchantName: 'Cartify'
    }
  });

  // Update total dynamically
  async function updatePaymentTotal(totalAmount) {
    paymentDataRequest.transactionInfo.totalPrice = totalAmount.toFixed(2);
  }

  // Create Google Pay button
  const button = paymentsClient.createButton({
    onClick: async () => {
      const totalAmount = getCartTotal();  // function returns total cart price
      await updatePaymentTotal(totalAmount);

      paymentsClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => {
          console.log("Payment token:", paymentData.paymentMethodData.tokenizationData.token);
          // Send this token to backend to process payment
        })
        .catch(err => console.error("Payment failed:", err));
    }
  });

  document.getElementById('checkoutBtnContainer').appendChild(button);
}

function getCartTotal() {
  const totalPriceEl = document.getElementById("totalPrice");
  let total = Number(totalPriceEl.textContent.replace(/[^0-9.]/g, ""));
  return total || 0;
}



document.addEventListener("DOMContentLoaded", loadCart);
