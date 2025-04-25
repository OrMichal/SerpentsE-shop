window.onload = async () => {
    try {
        const response = await fetch("http://localhost:3000/GetProds");
        const res = await response.json();  // Převod odpovědi na JSON

        const prodGrid = document.getElementById("prodGrid");

        res.forEach(item => {
            const prodDiv = document.createElement("div");
            prodDiv.className = "productDiv";

            const prodImg = document.createElement("img");
            prodImg.className = "productIMG";
            prodImg.src = "./pictures/" + item.imageName + ".jpg";

            const prodName = document.createElement("span");
            prodName.className = "prodName";
            prodName.textContent = item.name;

            const prodPrice = document.createElement("span");
            prodPrice.className = "prodPrice";
            prodPrice.textContent = item.price + ' Kč';

            prodDiv.appendChild(prodImg);
            prodDiv.appendChild(prodName);
            prodDiv.appendChild(prodPrice);

            prodDiv.addEventListener("click", () => openOrderDialog(item));

            prodGrid.appendChild(prodDiv);
        });

    } catch (err) {
        console.error("Chyba při načítání produktů:", err);
    }

    // Funkce pro otevření dialogu s detaily objednávky
    function openOrderDialog(product) {
        const dialog = document.getElementById("orderDialog");
        const dialogDetails = document.getElementById("dialogProductDetails");

        dialogDetails.innerHTML = `
            <img src="./pictures/${product.imageName}.jpg" class="productIMG" />
            <h3>${product.name}</h3>
            <p>${product.price} Kč</p>
            <p>${product.description || "Žádný popis k dispozici"}</p>
        `;

        dialog.style.display = "flex";

        // Přidat produkt do košíku
        document.getElementById("cartAddButton").addEventListener("click", () => {
            const quantity = document.getElementById("quantity").value;
            const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const existingProduct = cart.find(item => item.name === product.name);

            if (existingProduct) {
                existingProduct.quantity += parseInt(quantity);
            } else {
                cart.push({ name: product.name, quantity: parseInt(quantity), price: product.price });
            }

            sessionStorage.setItem("cart", JSON.stringify(cart));

            updateCartCount();

            dialog.style.display = "none"; // Zavření dialogu
        });
    }

    // Zavření dialogu
    document.getElementById("closeDialog").addEventListener("click", () => {
        document.getElementById("orderDialog").style.display = "none";
    });

    // Funkce pro zobrazení košíku
    document.getElementById("cartIcon").addEventListener("click", () => {
        openCartDialog();
    });

    function openCartDialog() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const cartItemsList = document.getElementById("cartItemsList");
        const cartTotal = document.getElementById("cartTotal");

        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cartItem";

            const itemName = document.createElement("span");
            itemName.textContent = item.name;

            const itemQuantity = document.createElement("input");
            itemQuantity.type = "number";
            itemQuantity.value = item.quantity;
            itemQuantity.min = "1";
            itemQuantity.addEventListener("change", () => updateCart(item));

            const removeButton = document.createElement("button");
            removeButton.textContent = "Odstranit";
            removeButton.addEventListener("click", () => removeFromCart(item));

            cartItemDiv.appendChild(itemName);
            cartItemDiv.appendChild(itemQuantity);
            cartItemDiv.appendChild(removeButton);
            cartItemsList.appendChild(cartItemDiv);

            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Celková cena: ${total} Kč`;

        document.getElementById("cartDialog").style.display = "flex";
    }

    function updateCart(item) {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const itemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
        if (itemIndex !== -1) {
            // Získáme input z DOMu, který byl upraven
            const itemQuantityInput = document.querySelector(`input[data-item-name='${item.name}']`);
    
            if (itemQuantityInput) {
                const newQuantity = parseInt(itemQuantityInput.value);
    
                // Ověření, že množství je platné číslo
                if (newQuantity >= 1) {
                    cart[itemIndex].quantity = newQuantity;
                    sessionStorage.setItem("cart", JSON.stringify(cart));
    
                    openCartDialog();  // Znovu otevřeme dialog s aktualizovanými údaji
                } else {
                    alert("Množství musí být alespoň 1.");
                }
            }
        }
    }
    

    function removeFromCart(item) {
        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        cart = cart.filter(cartItem => cartItem.name !== item.name);
        sessionStorage.setItem("cart", JSON.stringify(cart));

        openCartDialog();
    }

    document.getElementById("closeCartDialog").addEventListener("click", () => {
        document.getElementById("cartDialog").style.display = "none";
    });

    // Funkce pro odeslání objednávky
    document.getElementById("orderButton").addEventListener("click", () => {
        const fullName = document.getElementById("fullName").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;

        if (fullName && address && phone && email) {
            alert(`Objednávka byla odeslána!\nJméno: ${fullName}\nAdresa: ${address}\nTelefon: ${phone}\nEmail: ${email}`);

            sessionStorage.removeItem("cart");
            document.getElementById("cartDialog").style.display = "none";
        } else {
            alert("Vyplňte všechny údaje.");
        }
    });

    function updateCartCount() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById("cartItemCount").textContent = cartCount;
    }

    updateCartCount();
};
