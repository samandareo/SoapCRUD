# SOAP Client & Server

## Description

This project consists of:

1.  **Frontend Client:** A Next.js/React application providing a user interface to interact with a SOAP API for user management (CRUD operations).
2.  **Backend Server:** A Node.js/Express application implementing the SOAP API using `express-soap`.

## Features (Client)

*   **View Users:** Fetches and displays a list of users from the SOAP API.
*   **Create User:** Allows adding new users with name and email via a form. Includes basic email validation.
*   **Update User:** Provides functionality to edit the name and email of existing users through a modal.
*   **Delete User:** Allows removing users from the list.
*   **Responsive UI:** Uses Tailwind CSS for styling and layout.
*   **Loading States:** Shows loading indicators during API requests.

## Tech Stack

**Frontend (Client):**

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **HTTP Client:** Axios (for making SOAP requests)
*   **XML Parsing:** xml2js (for parsing SOAP responses)

**Backend (Server):**

*   **Framework:** Node.js, Express
*   **Language:** JavaScript (or TypeScript, depending on your implementation)
*   **SOAP Handling:** `express-soap`
*   **Data Storage:** In-memory array (for this example)

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-folder>
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server # Or your backend folder name
    npm install
    # or
    yarn install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client # Or your frontend folder name
    npm install
    # or
    yarn install
    ```

## Running the Application

1.  **Start the Backend Server:**
    *   Navigate to the backend directory (`server` or your backend folder name).
    *   Run the start command (this might vary based on your `package.json`):
        ```bash
        npm start
        # or
        node server.js # or your main server file
        ```
    *   The server should typically start on `http://localhost:4000` (check console output). The SOAP endpoint is usually `/soap`.

2.  **Start the Frontend Client:**
    *   Navigate to the frontend directory (`client` or your frontend folder name).
    *   Run the development server:
        ```bash
        npm run dev
        # or
        yarn dev
        ```
    *   Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

## Backend SOAP Service Details

The backend server exposes a SOAP service, typically at `http://localhost:4000/soap`.

*   **WSDL:** The service WSDL (Web Services Description Language) is usually available at the service endpoint with a `?wsdl` query parameter (e.g., `http://localhost:4000/soap?wsdl`).
*   **Supported Operations:**
    *   `getUsers`: Retrieves all users.
    *   `createUser`: Creates a new user. Expects `name` and `email`.
    *   `updateUser`: Updates an existing user. Expects `id`, `name`, and `email`.
    *   `deleteUser`: Deletes a user by `id`.

*(Note: Adapt file paths and start commands if your project structure or scripts differ.)*
