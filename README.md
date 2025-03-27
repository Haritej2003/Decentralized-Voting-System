### Decentralized Voting System

A secure and transparent blockchain-based voting system that ensures election integrity through decentralized technology.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)


## 🔍 Overview

This decentralized voting system leverages blockchain technology to create a secure, transparent, and tamper-proof electronic voting platform. By utilizing Ethereum smart contracts, the application ensures that votes are immutable once cast and provides real-time election results while maintaining voter privacy.

## ✨ Features

### User Roles

- **Admin Dashboard**

- Manage candidates (add/delete)
- Conduct and end elections
- View election statistics
- Monitor real-time election results
- Track voting percentage turnout



- **Voter Dashboard**

- View personal voter details
- Access current election information
- Check upcoming election schedules
- Cast votes securely
- View real-time election results (updated every minute)





### Security Features

- Blockchain-based vote storage
- JWT authentication
- Secure user registration and login
- Smart contract validation


### Home Page

- System instructions
- Developer information
- Project overview


## 🛠️ Technology Stack

### Frontend

- React.js
- TypeScript
- Metamask integration


### Backend

- Node.js
- Express.js
- TypeScript
- JWT authentication


### Database

- PostgreSQL
- Prisma ORM

- Voter table
- Candidate table
- Election table





### Blockchain

- Ethereum
- Solidity (smart contracts)
- Ganache (local blockchain)
- Truffle (development framework)


## 📸 Screenshots

### 🏠 Home Page
![Home Page](screenshots/homePage.png)

### 🔑 Login Page
![Login Page](screenshots/Login.png)

### 🗳️ Voter Dashboard
![Voter Dashboard](screenshots/VoterDashboard.png)

### 🗳️ Confirmation
![Vote Confirmation](screenshots/Confirmation.png)

### 📊 Result
![Real Time Result](screenshots/Result.png)

### 🗳️ Election Statistics
![Election Statistics](screenshots/Stats.png)



## 🚀 Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Ganache
- Metamask browser extension


### Setup Steps

1. **Clone the repository**

```shellscript
git clone https://github.com/Haritej2003/Decentralized-Voting-System.git
cd decentralized-voting-system
```


2. **Install dependencies for both frontend and backend**

```shellscript
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```


3. **Set up the database**

```shellscript
# In the backend directory
npx prisma migrate dev --name init
npx prisma generate
```


4. **Set up Ganache and Truffle**

```shellscript
# Install Truffle globally if not already installed
npm install -g truffle

# Start Ganache (GUI or CLI)
ganache-cli

# In a new terminal, deploy smart contracts
cd backend
truffle migrate --reset
```


5. **Configure Metamask**

1. Connect Metamask to your Ganache network 
2. Import at least one Ganache account into Metamask using the private key





## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```plaintext
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/name"

# Authentication
JWTPassword="your-jwt-secret"
SaltRounds=10

# Blockchain
RPC_URL="your-RPC-url"
ADMIN_PRIVATE_KEY="your-metamask-private-key"
contractAddress="your-deployed-contract-address"
```

## 📝 Usage

1. **Start the Blockchain Network**
```shellscript
truffle compile
truffle migrate
copy the contractAdress and store in .env
```

2. **Start the backend server**

```shellscript
cd backend
npx tsc -b
node dist/index.js
```


3. **Start the frontend application**

```shellscript
cd frontend
npm run dev
```


### Admin Access

- Login with admin credentials
- Navigate to the admin dashboard to manage elections and candidates


### Voter Access

- Register as a new voter or login with existing credentials
- View election information and cast your vote during active elections


## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Made with ❤️*

## 👨‍💻 Contributors

🚀 Juvvagani Hari Tej - Developer & Maintainer