let cart = [];
let favourite = [];

document.addEventListener("DOMContentLoaded", () => {
    loadMedicines();
    loadFavourites();
    test1();
    displayFavourites();
    document.getElementById("buy-now").addEventListener("click", checkout);
    document.getElementById("save-fav").addEventListener("click", saveFavourites);
    document.getElementById("apply-fav").addEventListener("click", applyFavourites);
    document.getElementById("check-fav").addEventListener("click", checkFavourites);
});

function loadMedicines() {
    fetch('scripts/data.json')
        .then(response => response.json())
        .then(data => {
            const categories = ['analgesics', 'antibiotics', 'antidepressants', 'antihistamines', 'antihypertensives'];
            categories.forEach(category => {
                const categoryElement = document.getElementById(category);
                const medicineList = categoryElement.querySelector('.medicine-list');
                medicineList.innerHTML = '';

                data.forEach(item => {
                    if (item.category === category) {
                        const div = document.createElement('div');
                        div.classList.add('medicine');
                        div.innerHTML = `
                            <img src="${item.img}" alt="${item.name}" class="medicine-image">
                            <span>${item.name} - $${item.price}</span>
                            <input type="number" min="1" max="10" value="1" id="${item.id}-quantity">
                            <button onclick="addToCart('${item.id}')">Add</button>
                        `;
                        medicineList.appendChild(div);
                    }
                });
            });
        })
        .catch(error => console.error('Error loading data:', error));
}

function addToCart(id) {
    const quantityInput = document.getElementById(`${id}-quantity`);
    let quantity = parseInt(quantityInput.value);

    
    if (quantity < 1) {
        alert("Negative values or zero cannot be added. Please enter a positive quantity.");
        quantityInput.value = 1;  
        return;  
    }

    fetch('scripts/data.json')
        .then(response => response.json())
        .then(data => {
            const item = data.find(item => item.id === id);
            const existingItem = cart.find(cartItem => cartItem.id === id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const cartItem = { ...item, quantity };
                cart.push(cartItem);
            }
            updateCart();
        });
}


function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const totalPrice = document.getElementById("total-price");
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price * item.quantity}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartItems.appendChild(row);
        total += item.price * item.quantity;
    });
    totalPrice.textContent = `Total: $${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to the cart before proceeding.");
        return;  // Prevent the checkout if the cart is empty
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Proceeding to checkout");
    window.location.href = "order.html";
}


function saveFavourites() {
    
    localStorage.setItem("favourite", JSON.stringify(cart));
    alert("Favourites saved!");
    displayFavourites();  
}

function applyFavourites() {
    const savedFavourites = JSON.parse(localStorage.getItem("favourite"));
    if (savedFavourites) {
        cart = savedFavourites;
        updateCart();
        alert("Favourites applied!");
    } else {
        alert("No favourites found!");
    }
}

function loadFavourites() {
    const savedFavourites = JSON.parse(localStorage.getItem("favourite"));
    if (savedFavourites) {
        cart = savedFavourites;
        updateCart();
    }
}

function checkFavourites() {
    const favouritesSection = document.getElementById("favourites-section");
    if (favouritesSection.style.display === "none" || favouritesSection.style.display === "") {
        favouritesSection.style.display = "block";  
        displayFavourites();  
    } else {
        favouritesSection.style.display = "none";  
    }
}


function displayFavourites() {
    const favouritesItems = document.getElementById("favourites-items");
    favouritesItems.innerHTML = '';  

    const savedFavourites = JSON.parse(localStorage.getItem("favourite"));

    if (savedFavourites && savedFavourites.length > 0) {
        savedFavourites.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
            `;
            favouritesItems.appendChild(row);
        });
    } else {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='3'>No favourites saved.</td>";
        favouritesItems.appendChild(row);
    }
}


function test1() {
    fetch("scripts/data.json")
        .then(response => response.json())
        .then(json => console.log(json[0].name));
}
