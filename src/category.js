const categoryContainer = document.getElementById("categoryContainer");

    // Example with FakeStoreAPI
    const API_BASE = "https://fakestoreapi.com";

    // Fetch categories first
    async function loadCategories() {
      const res = await fetch(`${API_BASE}/products/categories`);
      const categories = await res.json();

      // Loop through categories
      categories.forEach(async (category) => {
        // Create section dynamically
        const section = document.createElement("section");
        section.className =
          "py-16 px-6 bg-white mt-8 rounded-2xl shadow-md";

        section.innerHTML = `
          <h2 class="text-3xl font-bold text-center mb-10 text-[#8B5E3C] capitalize">✨ ${category}</h2>
          <div id="${category}-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"></div>
        `;

        categoryContainer.appendChild(section);

        // Fetch products for this category
        const productsRes = await fetch(`${API_BASE}/products/category/${category}`);
        const products = await productsRes.json();

        const grid = document.getElementById(`${category}-grid`);

        // Insert product cards
        products.forEach((p) => {
          const card = document.createElement("div");
          card.className =
            "bg-gray-50 rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition duration-300";
          card.innerHTML = `
            <img src="${p.image}" alt="${p.title}" class="h-40 object-contain mb-4">
            <h3 class="font-semibold text-center text-gray-700 line-clamp-2">${p.title}</h3>
            <p class="text-lg font-bold text-[#8B5E3C] mt-2">$${p.price}</p>
            <button class="mt-3 bg-[#8B5E3C] text-white px-4 py-2 rounded-lg hover:bg-[#70462a] transition">Add to Cart</button>
          `;
          grid.appendChild(card);
        });
      });
    }

    loadCategories();