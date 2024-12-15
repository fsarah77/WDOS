document.addEventListener("DOMContentLoaded", () => {
    loadCartToOrderPage();
    setupEventListeners();
});


function loadCartToOrderPage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderTableBody = document.querySelector("#orderTable tbody");
    const orderTotalPrice = document.getElementById("orderTotalPrice");
    orderTableBody.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const row = document.createElement("tr");
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${itemTotal}</td>
        `;
        orderTableBody.appendChild(row);
    });

    orderTotalPrice.textContent = total.toFixed(2);
}


function setupEventListeners() {
    document.getElementById("addToFavorites").addEventListener("click", saveOrderAsFavorite);
    document.getElementById("applyFavorites").addEventListener("click", applyFavoriteOrder);
    document.getElementById("payButton").addEventListener("click", processPayment);

    
    document.getElementById("deliveryForm").addEventListener("change", (e) => {
        const cardDetails = document.getElementById("cardDetails");
        if (e.target.id === "paymentMethod") {
            if (e.target.value === "Card") {
                cardDetails.style.display = "block";
            } else {
                cardDetails.style.display = "none";
            }
        }
    });
}


function saveOrderAsFavorite() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
        localStorage.setItem("favoriteOrder", JSON.stringify(cart));
        alert("Order saved as favorite!");
    } else {
        alert("No order found to save as favorite!");
    }
}


function applyFavoriteOrder() {
    const favoriteOrder = JSON.parse(localStorage.getItem("favoriteOrder"));
    if (favoriteOrder) {
        localStorage.setItem("cart", JSON.stringify(favoriteOrder));
        loadCartToOrderPage();
        alert("Favorite order applied!");
    } else {
        alert("No favorite order found!");
    }
}


function processPayment() {
    const name = document.getElementById("userName").value.trim();
    const address = document.getElementById("userAddress").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value.trim();
    const cardCVV = document.getElementById("cardCVV").value.trim();

    
if (!name.trim()) {
    alert("Name field cannot be empty. Please enter your name.");
    return;
}

const namePattern = /^[A-Za-z\s]+$/;
if (!namePattern.test(name)) {
    alert("Name should only contain letters and spaces. Please enter a valid name.");
    return;
}

if (!address.trim()) {
    alert("Address field cannot be empty. Please enter your address.");
    return;
}


const fakeAddressPattern = /^(fake|test|123|none|null|not provided)/i;
if (fakeAddressPattern.test(address)) {
    alert("It seems like you've entered a placeholder address. Please provide a real address.");
    return;
}

if (address.length < 10) {
    alert("The address seems too short. Please provide a more detailed address.");
    return;
}


const addressPattern = /\d{1,5}\s[\w\s]+,?\s[\w\s]+,?\s[\w\s]+/;  
if (!addressPattern.test(address)) {
    alert("The address format seems incorrect. Please enter a valid address.");
    return;
}

if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
}


if (paymentMethod === "Card") {
    if (!cardNumber || !cardNumber.trim()) {
        alert("Card number is required. Please enter your card number.");
        return;
    } else if (!/^\d{16}$/.test(cardNumber)) {
        alert("Invalid card number. Please enter a 16-digit card number.");
        return;
    }

    if (!cardExpiry || !cardExpiry.trim()) {
        alert("Card expiry date is required. Please enter the expiry date (MM/YY).");
        return;
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert("Invalid expiry date. Please use the format MM/YY.");
        return;
    }

    if (!cardCVV || !cardCVV.trim()) {
        alert("Card CVV is required. Please enter the CVV.");
        return;
    } else if (!/^\d{3}$/.test(cardCVV)) {
        alert("Invalid CVV. Please enter a 3-digit CVV.");
        return;
    }
}


alert("All fields are valid! Proceeding with the order...");

    
    const thankYouMessage = document.getElementById("thankYouMessage");
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); 
    document.getElementById("deliveryDate").textContent = deliveryDate.toDateString();

    document.getElementById("orderPage").style.display = "none";
    thankYouMessage.style.display = "block";
}
