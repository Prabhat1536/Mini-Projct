    let paymentId ="";
    document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("photo-upload");
    const copiesInput = document.getElementById("input");
    const colorOptions = document.querySelectorAll('input[name="r1"]');
    const summarySection = document.querySelector(".order-summary");
    const addToCartButton = document.getElementById("addToCart");
    const addressForm = document.getElementById("address-form");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");



    let orderDetails = [];
    let isLoggedIn = false;

    

    // Function to update order summary
    function updateOrderSummary() {
        summarySection.innerHTML = ""; // Clear previous summary

        let totalCost = 0;
        const summaryContainer = document.createElement("div");

        orderDetails.forEach((order) => {
            const orderItem = document.createElement("div");
            orderItem.classList.add("summary-item");

            // Set price based on color choice
            const costPerCopy = order.color === "b/W" ? 5 : 10; // ₹5 for B/W, ₹10 for color
            const cost = order.copies * costPerCopy; // Calculate cost
            totalCost += cost;

            orderItem.innerHTML = `<span>${order.fileName} (${order.copies}x) - ${order.color}</span> <span>Rs. ${cost}</span>`;
            summaryContainer.appendChild(orderItem);
        });

        // Display total cost
        const totalItem = document.createElement("div");
        totalItem.classList.add("total");
        totalItem.innerHTML = `<span><b>Total:</b></span> <span><b>Rs. ${totalCost}</b></span>`;
        summaryContainer.appendChild(totalItem);

        // Append updated summary to the section
        summarySection.appendChild(summaryContainer);

        // Return total cost for Razorpay
        return totalCost;
    }

    // Handle file selection (store file details)
    fileInput.addEventListener("change", (event) => {
        orderDetails = []; // Reset order details on new upload
        Array.from(event.target.files).forEach((file) => {
            orderDetails.push({
                fileName: file.name,
                copies: parseInt(copiesInput.value) || 1,
                color: document.querySelector('input[name="r1"]:checked')?.value || "Coloured",
            });
        });
        updateOrderSummary();
    });

    // Handle "Add to Cart" button click
    addToCartButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        // Update copies and color selection before updating summary
        const copies = parseInt(copiesInput.value) || 1;
        const selectedColor = document.querySelector('input[name="r1"]:checked')?.value || "Coloured";

        orderDetails.forEach((order) => {
            order.copies = copies;
            order.color = selectedColor;
        });

        updateOrderSummary();
        alert("Items added to cart successfully!");
    });

    // Handle address form submission
    addressForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form submission

        // Validate address fields
        const fullAddress = document.getElementById("full-address").value;
        const state = document.getElementById("state").value;
        const city = document.getElementById("city").value;
        const pincode = document.getElementById("pincode").value;

        if (!fullAddress || !state || !city || !pincode) {
            alert("Please fill out all address fields.");
            return;
        }

        // Calculate total cost
        const totalCost = updateOrderSummary();

        // Open Razorpay payment gateway
        const options = {
            key: "rzp_test_LkPzjKRe2votRG", // Replace with your Razorpay Key ID
            amount: totalCost * 100, // Convert to paise
            currency: "INR",
            name: "Test Merchant",
            description: "Test Transaction",
            image: "https://your-logo-url.com",
            handler: function (response) {
                paymentId = response.razorpay_payment_id;
                alert("Payment Successful! Payment ID: " + paymentId);
                  window. location. href='end.html';
            },
            prefill: {
                name: "suraj sah",
                email: "sah19112004@gmail.com",
                contact: "9082262956"
            },
            theme: {
                color: "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
      
    });

    // Login/Logout functionality
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault();
        isLoggedIn = true;
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline";
        alert("Logged in successfully!");
    });

    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        isLoggedIn = false;
        loginBtn.style.display = "inline";
        logoutBtn.style.display = "none";
        alert("Logged out successfully!");
    });

    // Increment and Decrement Logic
    const incrementButton = document.getElementById("increment");
    const decrementButton = document.getElementById("decrement");

    incrementButton.addEventListener("click", () => {
        copiesInput.value = parseInt(copiesInput.value) + 1;
    });

    decrementButton.addEventListener("click", () => {
        if (copiesInput.value > 1) {
            copiesInput.value = parseInt(copiesInput.value) - 1;
        }
    });
});
 
