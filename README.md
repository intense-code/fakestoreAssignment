📝 Module Project: FakeStore E-Commerce App
📌 Project Overview
 In this project, you will build a FakeStore E-Commerce App using React, React Router, and FakeStoreAPI. Your app will allow users to view, create, update, and delete products dynamically using API calls. This project reinforces state management, API interactions, React Router for navigation, and component-based architecture.
Important Note: FakeStoreAPI is a mock API designed for testing and learning purposes. While it will respond positively to POST, PUT, and DELETE requests (as if the actions were successful), these changes will not actually persist. You’ll still receive a success message and can test how your app handles these interactions, but the data will reset or remain unchanged when you fetch it again.
Unlike a full-stack project, you do not need to build a backend—your app will interact with this external API solely for practice with front-end API integration.

✨ Learning Objectives
 By the end of this project, you should be able to:
 ✅ Organize and structure a React application with reusable components.
 ✅ Manage state using useState.
 ✅ Fetch, create, update, and delete products using Axios or Fetch API.
 ✅ Implement React Router for multi-page navigation.
 ✅ Apply React Bootstrap for UI styling and responsiveness.
 ✅ Handle loading states, errors, and API responses effectively.

💬 Project Presentation Reminder
 As part of your final deliverables for this module, you’ll also give a short presentation of your project. This can be done live during a weekly Q&A session, recorded and submitted to Google Classroom, or shared directly with your Student Success Manager. If you'd like to schedule a 1-on-1 presentation, click here to book a time.

🛠 Project Setup Instructions
1️⃣ Set up the React app
 Create a new React project inside a folder:
npx create-vite fakestore-app --template react
Navigate into the project folder and install dependencies:
cd fakestore-app  
npm install  
npm install react-router-dom axios react-bootstrap bootstrap
Import Bootstrap in main.jsx:
import 'bootstrap/dist/css/bootstrap.min.css';
Start the development server:
npm run dev

📌 Project Requirements
Your project should consist of the following pages, components, and functionalities:
🏠 1️⃣ Home Page
Displays a welcome message and introduction to the store.
Contains a button to navigate to the Product Listing page.
Styled using React Bootstrap.


🛍 2️⃣ Product Listing Page
Fetches and displays a list of products from FakeStoreAPI (https://fakestoreapi.com/products).
Products should be displayed in a visually structured layout.


Each product should show:
Image
Title
Price
Button to view details (navigates to Product Details page).
Uses React Router for navigation.


📄 3️⃣ Product Details Page
Displays detailed information for a single product.
Uses useParams() to extract the product ID from the URL.
Fetches the product data from FakeStoreAPI (https://fakestoreapi.com/products/:id).
Displays:
Product image, title, description, category, and price.
Button to add the product to a cart (cart functionality is optional).
Button to delete the product (removes it from the API).
Handles loading states and error messages.
Note: FakeStoreAPI will return a success response to DELETE requests, but the product will not actually be removed from the API. This is expected behavior for a mock testing API.
➕ 4️⃣ Add Product Page
A form to create a new product using FakeStoreAPI (POST request).
The form should include fields for:
Product title
Price
Description
Category
Submitting the form should send data to FakeStoreAPI.
Displays a confirmation message when the product is "created."
Note: FakeStoreAPI will return a successful response to your POST request, allowing you to test how your app handles product creation. However, the new product will not actually be saved or appear in the product list on future API calls, since this API is for testing purposes only.
Uses React Bootstrap form components.


✏️ 5️⃣ Edit Product Page
Allows users to update an existing product (PUT request to FakeStoreAPI).
Pre-fills the form with the existing product data.
Submitting the form should update the product on the API.
Displays a success message after updating.
Note: While FakeStoreAPI will respond as if the update succeeded, the changes will not persist if you refresh or fetch the data again. This is expected behavior for a mock API used in testing.
🗑 6️⃣ Delete Product Functionality
Users should be able to delete a product (DELETE request to FakeStoreAPI).


Includes a confirmation modal before deletion.
After deletion, the user should be redirected to the product listing page.
Note: FakeStoreAPI will return a success response when you send a DELETE request, but the product will not actually be removed from the API data. This allows you to test the frontend interaction and behavior without altering real data.
🛠 7️⃣ Navigation Bar
A React Bootstrap Navbar should be present across the app.
Should include links to:
Home (/)
Product Listing (/products)
Add Product (/add-product)
The navbar should work properly in mobile view.


🛠 8️⃣ Additional Features
Handle loading states (display loading indicators when fetching data).
Handle API errors (display user-friendly error messages).
Ensure mobile responsiveness using React Bootstrap.



✅ Final Checklist Before Submission
🚀 Core Features
 ✅ Home page with navigation.
 ✅ Fetch and display products on /products.
 ✅ View individual product details on /products/:id.
 ✅ Add, edit, and delete products with API interactions.
🎨 Styling & Layout
 ✅ Uses React Bootstrap for styling and layout.
 ✅ Fully responsive on desktop and mobile devices.
🔄 API Handling
 ✅ Handles API loading states and errors.
 ✅ Uses Axios or Fetch for API interactions.
 ✅ Clearly communicates that FakeStoreAPI is a testing API—responses to POST/PUT/DELETE will appear successful, but the underlying data will not change permanently.
💡 Code Structure
 ✅ Organized React components with reusable structure.
 ✅ Uses React Router for navigation.

📤 Submission Instructions
 🔹 Push your project to GitHub.
 🔹 Submit your GitHub repository link in the assignment portal.




💯 Grading Criteria (Total: 25 Points)
Criteria
Full Points (5 pts)
Partial (2–4 pts)
Needs Improvement (0–1 pts)
State Management
Uses useState properly
Minor issues with state
Missing or incorrect state usage
API Handling
Fetch, create, update, delete work correctly
Some API calls work
Major API failures
Routing & Navigation
React Router works properly
Minor navigation issues
Broken or missing routes
Component Structure
Components are well-organized
Some structure issues
Components are disorganized
Styling & Layout
Clean and responsive UI
Some layout issues
Poor styling or lack of responsiveness


🎯 Tips for Success
 ✅ Test API calls using Postman or browser before implementing them.
 ✅ Break your UI into reusable components (e.g., ProductCard).
 ✅ Use console logs to debug API calls.
 ✅ Plan before coding! Sketch layouts before writing JSX.

🎉 Congratulations!
 Once you’ve completed this project, you’ve built a fully functional E-Commerce front-end that interacts with a real API for testing and development practice! 🚀


