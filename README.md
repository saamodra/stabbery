# stabbery

Stabbery is a dynamic mock server application designed to simulate external services with ease. It allows developers to define and manage mock API endpoints through a user-friendly web interface, storing configurations in an SQLite database.

## Features

### Server

- **Dynamic Route Registration**: Define mock endpoints for any URL path without a mandatory prefix (e.g., `/users`, `/products/123`).
- **Full HTTP Method Support**: Supports all standard HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, etc.).
- **Database Persistence**: Route configurations are stored and managed in an SQLite database.
- **Request Matching**: Incoming requests are matched against stored configurations based on:
    - URL Path
    - HTTP Method
    - Request Headers (exact match or subset)
    - Request Body Schema (JSON schema validation)
- **Configurable Responses**: Return custom mock responses including:
    - HTTP Status Code
    - Response Headers (JSON)
    - Response Body (JSON or plain text)
- **Request Logging**: Logs incoming requests and their matched mock responses for debugging and monitoring.
- **Hot-Reloading**: Dynamically loads and updates route configurations from the database without requiring a server restart.
- **Configuration Validation**: Ensures that new or updated mock configurations are valid before saving.

### Web UI

- **Add New Mock Endpoints**:
    - Specify the **URL Path** (e.g., `/users/:id`, `/orders`).
    - Select the **HTTP Method**.
    - Define **Expected Request Headers** (JSON format, e.g., `{"Content-Type": "application/json"}`).
    - Define **Expected Request Body Schema** (JSON Schema format for validating incoming request bodies).
    - Set the **Response Status Code** (e.g., 200, 404, 500).
    - Configure **Response Headers** (JSON format, e.g., `{"Content-Type": "application/json"}`).
    - Craft the **Response Body** using a JSON editor or as plain text.
- **View and Edit Configurations**: Browse, search, and modify existing mock endpoint configurations.
- **Delete Endpoints**: Easily remove mock configurations that are no longer needed.
- **Test Endpoints**: Directly test configured mock endpoints from the UI by sending requests and viewing the mock response.

## Implementation Details

- **Backend**: Node.js with Express.js framework.
- **Database**: SQLite for lightweight and file-based persistence.
- **Response Body Types**: Supports both JSON and plain text for mock responses.
- **Request Matching Logic**:
    - Matches URL patterns (including path parameters).
    - Matches the specified HTTP method.
    - Optionally matches a subset or exact set of request headers.
    - Optionally validates the request body against a JSON schema if provided.
- **Validation**: Uses Joi or a similar library for validating route configuration inputs from the UI.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saamodra/stabbery
   cd stabbery
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start both the server and the client development environments:
```bash
npm run dev
```

- The mock server will run on a port `3001` (configurable).
- The web UI (Vite client) will run on a port `5173`.
