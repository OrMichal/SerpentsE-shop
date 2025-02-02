window.onload = async () => {
    const data = await fetch("http://localhost:3000/GetProds", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });

    const res = await data.json();
    const prodGrid = document.getElementById("prodGrid");
    
    res.forEach(item => {
        const prodDiv = document.createElement("div");
        prodDiv.className = "productDiv";
        
        const prodImg = document.createElement("img");
        prodImg.className = "productIMG";
        prodImg.src = "./pictures/" + item.name + ".jpg";

        const prodName = document.createElement("span");
        prodName.className = "prodName";
        prodName.textContent = item.name;

        const prodPrice = document.createElement("span");
        prodPrice.className = "prodPrice";
        prodPrice.textContent = item.price;

        prodDiv.appendChild(prodImg);
        prodDiv.appendChild(prodName);
        prodDiv.appendChild(prodPrice);

        prodGrid.appendChild(prodDiv);
    });
};