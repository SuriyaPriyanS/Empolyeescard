# 🧑‍💼 Employee Directory – Frontend UI Assignment

## 🎯 Objective

Develop a **responsive** and **interactive Employee Directory Web Interface** using **HTML**, **CSS**, **JavaScript**, and **Freemarker templates**.

The goal is to showcase modern front-end development skills through a clean, modular, and user-friendly interface without relying on backend APIs.

---

## 📂 Project Structure

📋 Dashboard Page
Displays employee data (Employee ID, First Name, Last Name, Email, Department, Role)

Each card has Edit and Delete buttons

Supports pagination with options: 10, 25, 50, 100 per page

Responsive grid/list layout

🧾 Add/Edit Employee Page
Form with fields: First Name, Last Name, Email, Department, Role



Inline validation for:

Required fields

Proper email format

Pre-fill form when editing

🔍 Filter, Search & Sort
Filter Sidebar:

Filter by First Name, Department, Role

Apply/Clear filters dynamically

Search Bar:

Real-time search by full name or email

Debounced for performance

Sorting (optional):

Sort by First Name or Department

https://docs.google.com/document/d/1Eza09oYyRG0q4IAKpi8YPXdHYX6XAaUZIBc_ov-tN9Q/edit?tab=t.0

📱 Responsive Design
Fully responsive UI for:

✅ Desktop

✅ Tablet

✅ Mobile

✅ Data Handling
Employee data handled via a local JS array in data.js

Operations like add, edit, delete, filter, and sort modify local data only

simple Netifly website Linked

https://employeecards.netlify.app/

Uses Freemarker <#assign> to render mock data dynamically

⚠️ Error Handling
Clear error messages for invalid email or missing fields

Graceful handling of edge cases (e.g., editing/deleting empty list)

