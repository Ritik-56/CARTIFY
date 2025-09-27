
async function fetchProducts() {
    const loader = document.getElementById("loader");
    const grid = document.getElementById("productGrid");

    try {
      const response = await fetch("https://fakestoreapi.com/products?limit=20"); 
      const products = await response.json();

      // Hide loader & show grid
      //loader.style.display = "none";
      loader.classList.add("hidden");
      grid.classList.remove("hidden");

      // Render products
      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105";

        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="rounded-md mb-3 w-full h-40 object-contain bg-gray-50 p-2">
          <h3 class="font-semibold text-lg line-clamp-1">${product.title}</h3>
          <p class="text-gray-600 font-medium">₹${(product.price * 80).toFixed(0)}</p>
          <button class="mt-3 w-full bg-gradient-to-r from-[#B5A192] to-[#D0B9A7] text-white py-2 rounded-lg font-medium hover:opacity-90 transition">
            Add to Cart
          </button>
        `;

        grid.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      loader.innerHTML = `<p class="text-red-600 font-semibold">⚠️ Failed to load products</p>`;
    }
  }

  // Call function on page load
fetchProducts();

const productGrid = document.getElementById("productGrid");

// Listen for clicks on the product grid
productGrid.addEventListener("click", (e) => {
  // Check if the clicked element is a button
  if (e.target.tagName === "BUTTON") {
    
    // Find the product card (parent div)
    const card = e.target.closest("div"); 

    const product = {
      title: card.querySelector("h3").textContent,
      price: parseFloat(
  card.querySelector("p").textContent.replace("₹", "").replace("$", "")
),
      image: card.querySelector("img").src,   // ✅ important
      category: card.dataset.category
    };
    addToCart(product);

    // Optional: show feedback
    //alert(`${product.title} added to cart!`);
  }
});

// Example addToCart function
async function addToCart(product) {
  try {
    const res = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    console.log("Saved:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}