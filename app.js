let allProducts = [];
let currentCategory = "All";
let searchText = "";
let currentSort = "featured";

// Load products
fetch("products.json")
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    // Let updateGallery handle the initial load so sorting/filtering applies immediately
    updateGallery();
    setupEventListeners();
  });

// Event listeners
function setupEventListeners() {
  // Search box
  document.getElementById("search").addEventListener("input", (event) => {
    searchText = event.target.value;
    updateGallery();
  });

  // Filter buttons
  document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      currentCategory = button.dataset.category; // Set the state
      updateGallery(); // Run the combined filter/sort/render pipeline
      console.log("filter success");
    });
  });

  // Sort select
  document.getElementById("sort").addEventListener("change", (event) => {
    currentSort = event.target.value;
    updateGallery();
    console.log(currentSort);
  });
}

// Functions
function createCards(products) {
  // 1. Map each item into its HTML template string
  const innerHtml = products.map(product => `
    <div class="product-card">
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="card-text">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
      </div>
    </div>
  `).join('');

  // 2. Wrap everything in a single wrapper div and inject it into the DOM
  const gallery = document.getElementById("product-gallery");
  gallery.innerHTML = `
    <div class="product-gallery">
      ${innerHtml}
    </div>
  `;
}

function updateGallery() {
  let filtered = [...allProducts];
  
  // Category filter
  if (currentCategory !== "All") {
    filtered = filtered.filter(product => product.category === currentCategory);
  }

  // Search filter
  filtered = filtered.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sorting logic
  if (currentSort === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (currentSort === "za") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (currentSort === "newest") {
    filtered.sort((a, b) => b.createdOrder - a.createdOrder);
  }
  if (currentSort === "oldest") {
    filtered.sort((a, b) => a.createdOrder - b.createdOrder);
  }
  if (currentSort === "featured") {
    filtered.sort((a, b) => a.featuredOrder - b.featuredOrder);
  } 

  // Finally, render the filtered and sorted list
  createCards(filtered);
}
