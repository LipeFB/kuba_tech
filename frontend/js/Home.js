const API_URL = "http://localhost:3000/api/customers";

const form = document.getElementById("customerForm");
const table = document.getElementById("customerTable");
const customerIdInput = document.getElementById("customerId");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

// Load customers when page opens
document.addEventListener("DOMContentLoaded", loadCustomers);

// ================= LOAD =================
async function loadCustomers() {
    const response = await fetch(API_URL);
    const customers = await response.json();

    table.innerHTML = "";

    customers.forEach(customer => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email || ""}</td>
            <td>
                <button class="edit" onclick="editCustomer(${customer.id}, '${customer.name}', '${customer.phone}', '${customer.email || ""}')">Edit</button>
                <button class="delete" onclick="deleteCustomer(${customer.id})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

// ================= CREATE / UPDATE =================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = customerIdInput.value;

    const customerData = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value
    };

    if (id) {
        // UPDATE
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData)
        });
    } else {
        // CREATE
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData)
        });
    }

    form.reset();
    customerIdInput.value = "";
    loadCustomers();
});

// ================= EDIT =================
function editCustomer(id, name, phone, email) {
    customerIdInput.value = id;
    nameInput.value = name;
    phoneInput.value = phone;
    emailInput.value = email;
}

// ================= DELETE =================
async function deleteCustomer(id) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadCustomers();
}