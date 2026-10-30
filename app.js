let allProducts = [];
let currentCategory = "All";
let searchText = "";
let currentSort ="featured";

//Load products
fetch ("products.json")
.then(response => response.json())
.then(products => {
  allProducts = products;

  createCards(allProducts);
  updateGallery();

  setupEventListeners()
});

//Event listeners
function setupEventListeners() {

  //Search box
  document.getElementById("search").addEventListener("input", (event) => {

    searchText = event.target.value
    updateGallery();
  });

  //Filter buttons
  document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (category === "All") {
        createCards(allProducts);
      } else {
        const filtered = allProducts.filter(product =>
          product.category === category
          );
          createCards(filtered);
          console.log("filter success"); // temporary test
      }
    });
  })

  //Sort select
  document.getElementById("sort").addEventListener("change", (event)=>{
    currentSort = event.target.value
    updateGallery();
    console.log(currentSort); // temporary test
  })
}

//Functions
function createCards(products) {
  const gallery = document.getElementById("product-gallery");

  gallery.innerHTML = ""

products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("product-card")

  card.innerHTML = `
  <img src="${product.image}" alt="${product.name}">
  <h2>${product.name}</h2>
  <p>${product.description}</p>
  `;

  gallery.appendChild(card)
});
}

function updateGallery() {
  let filtered = [...allProducts];
  
  //Category filter
  if (currentCategory !== "All"){
    filtered = filtered.filter(product =>
      product.category === currentCategory
      );
  }

  //Search filter
  filtered = filtered.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.description.toLowerCase().includes(searchText.toLowerCase())
    );

  //Sort
  if (currentSort === "az")  {
    filtered.sort((a,b) =>
    a.name.localeCompare(b.name)
    );
  }
  if (currentSort === "za") {
      filtered.sort((a,b) =>
      b.name.localeCompare(a.name)
      );
    }
    
  // Sort newest first
  if (currentSort === "newest") {
    filtered.sort((a,b) => b.createdOrder - a.createdOrder);
    }
  if (currentSort === "oldest") {
    filtered.sort((a,b) => a.createdOrder - b.createdOrder);
    }
   // Sort featured
  if (currentSort === "featured") {
    filtered.sort((a,b) => a.featuredOrder - b.featuredOrder);
    } 
    

    createCards(filtered);
}