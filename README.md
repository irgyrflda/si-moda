==============================================

TECH STACK

==============================================
 # Node.js
 Sebagai environment runtime JavaScript di server.

 # Express.js
 Web framework minimalis untuk Node.js, digunakan untuk membuat API dan handling request/response.

 # TypeScript
 Superset dari JavaScript yang mendukung static typing, memberikan fitur seperti autocompletion, error checking saat development.

 # Database
 MySQL: Database relasional yang sering digunakan untuk menyimpan data secara terstruktur.

 # Authentication & Authorization
 JWT (JSON Web Token): Untuk otentikasi stateless, sangat umum digunakan di aplikasi berbasis API.

 # Validation
 Zod: Untuk validasi schema yang bekerja baik dengan TypeScript, memudahkan validasi request body atau data lainnya.

 # Security
 Helmet: Middleware untuk menambahkan header HTTP yang meningkatkan keamanan.
 CORS: Digunakan untuk mengatur kebijakan Cross-Origin Resource Sharing (CORS).
 crypto: Untuk encrypt decrypt data.

 # Logging
 Log4js Library logging yang kuat dan scalable untuk mencatat aktivitas aplikasi. 

 # File Upload
 Multer: Middleware untuk menangani file upload (sudah kamu gunakan).

 # API Documentation
 Postman Untuk dokumentasi API yang interaktif.

 # Environment Management
 dotenv: Untuk mengelola variabel lingkungan secara aman.

 # ORM Setup (Sequelize):
 Sequelize CLI: Untuk mempermudah setup dan menjalankan migrasi serta seed data.
 sequelize-typescript: Membuat Sequelize kompatibel dengan TypeScript untuk pengalaman yang lebih baik.

==============================================

LIBRARY

==============================================
"axios": "^1.5.1",
"body-parser": "^1.20.2",
"bwip-js": "^4.1.1",
"compression": "^1.7.4",
"cors": "^2.8.5",
"crypto-js": "^4.1.1",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"express-rate-limit": "^7.1.1",
"helmet": "^7.0.0",
"jsonwebtoken": "^9.0.2",
"log4js": "^6.9.1",
"moment-timezone": "^0.5.43",
"multer": "^1.4.5-lts.1",
"mysql2": "^3.6.1",
"sequelize": "^6.33.0",
"socket.io": "^4.7.2",
"tsconfig-paths": "^4.2.0",
"zod": "^3.22.4"

"@types/compression": "^1.7.3",
"@types/cors": "^2.8.14",
"@types/crypto-js": "^4.1.2",
"@types/express": "^4.17.18",
"@types/html-pdf": "^3.0.3",
"@types/jsonwebtoken": "^9.0.6",
"@types/multer": "^1.4.8",
"@types/node": "^20.7.0",
"@types/sequelize": "^4.28.16",
"@types/socket.io": "^3.0.2",
"nodemon": "^3.0.1",
"ts-node": "^10.9.1",
"typescript": "^5.2.2"

===============================================

STRUKTURE

===============================================

```
my-app/
├── logs/
├── src/
│   ├── certificate/
│   ├── config/
│   ├── controllers/
│   │   ├── web/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   │   ├── upload/
│   ├── routes/
│   │   ├── api/
│   │   ├── api-public/
│   ├── schema/
│   |── services/
│   |    ├── web/
│   └── utils/
└── package.json
```

# My App

This is the README file for the "my-app" project.

## Project Structure

The project structure is organized as follows:

* **logs/** : This directory is intended for storing log files related to the application or path logs this server.
* **src/** : The source code of the application is stored in this directory.
* **certificate/** : Contains certificates or related files.
* **controllers/** : This directory is further divided into subdirectories based on the type of controllers.
  * **api/** : Controllers responsible for handling API-related logic.\
* **middleware/** : Middleware components that can be used in the application.
* **models/** : Database models or other data models are stored in this directory.
* **public/** : This directory is meant for public assets such as images, stylesheets, and client-side JavaScript files or monthing folder.
* **routes/** : Defines the routes of the application.
* **schema/** : Contains database schemas or other schema-related files.
* **services/** : The business logic of the application is organized into service modules. Subdirectories represent different modules or components of the application.
  * **api/** : Services related to API functionality.\
* **utils/** : Utility functions or helper modules are stored here.
* **package.json** : The package.json file contains metadata about the project and its dependencies.

## Getting Started

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd my-app`
3. Create file `.env`
4. Install dependencies: `npm install`
5. Start the application: `npm run dev`

Happy coding