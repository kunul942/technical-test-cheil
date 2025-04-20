# Technical Test - Cheil (Backend & Frontend)

## Table of Contents
- [Backend Setup](#backend-setup)
- [Authentication](#authentication )
- [API Documentation](#api-documentation)
- [Default Admin Credentials](#default-admin-credentials)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)

---

## Backend Setup

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download)

### Go to the GitHub Repository
``` bash
https://github.com/kunul942/technical-test-cheil
```


## Clone the project on GitHub
### You can use HTTPS
``` bash
git clone https://github.com/kunul942/technical-test-cheil.git
```

### Or SSH
``` bash
git clone git@github.com:kunul942/technical-test-cheil.git
```

## Navigate to the backend directory
``` bash
cd server
```

## Once you are in the proyect, we need to restore, build and run the project

### Restore
``` bash
dotnet restore
```

### Build
``` bash
dotnet build
```

### Run
``` bash
dotnet run
```

### The backend server will be available at:
``` bash
localhost:5242
```

## Environment Configuration for (JWT)
### Ensure your appsettings.json includes the following configuration fot JWT authentication
``` bash
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
},
  "AllowedHosts": "*",
  "JwtSettings": {
    "SecretKey": "this-is-a-very-strong-secret-key!!!",
    "Issuer": "http://localhost:5242",
    "Audience": "http://localhost:5242",
    "ExpiryInMinutes": 60
  }
}
```

## Authentication 
### To interact with protected endpoints, you must authenticate using the default admin user. Upon logging in, a JWT token will be returned, which should be used in the Authorization header for subsequent requests:

``` bash
Authorization: Bearer <jwt-token>
```


## API Documentation
### The Swagger UI is available for testing and exploring the backend API at:
```bash
http://localhost:5242/swagger
```


## Default Admin Credentials 
### Use the following credentials to log in:

- Email: admin@example.com
- Password: Admin123


## Frontend Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/download)

## Navigate to the frontend directory
``` bash
cd client
```

## Install dependencies
``` bash
npm install
```

## Run the application 
``` bash
npm run start
```


## The frontend will be available at: 
``` bash
http://localhost:4200/profile
```



## Running the application
1. Start the backend
### Follow the - [Backend Setup](#backend-setup) instructions to run the server.

2. Start the frontend
### Follow the - [Frontend Setup](#frontend-setup) instructions to run the client.

### Once both are running, you can log in using the default admin credentials and start using the system.