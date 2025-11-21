---

# **Megapack Site Layout Planner**

A full-stack application built for the **Tesla SEIA UI Engineering challenge**.
The system allows users to configure Megapack battery units, auto-calculate required transformers, compute total energy & cost, and generate a dynamic grid-based site layout with 100 ft max width.
Users can also save sessions, load previous configurations, customize device colors, and export layout state.

---

## **✨ Features Overview**

### **1. Configuration Panel**

* Enter counts for:

  * Megapack XL
  * Megapack 2
  * Megapack
  * PowerPack
* Transformers auto-calculated (1 per 2 industrial batteries).
* Supports either:

  * **Instant recalculation**
  * **Manual recalculation** (toggle + “Recalculate” button)

---

### **2. Layout Engine**

Implements Tesla’s specification:

* 100 ft site width → **10 grid columns**

* Device widths (in columns):

  | Device      | Width |
  | ----------- | ----- |
  | Megapack XL | 4     |
  | Megapack 2  | 3     |
  | Megapack    | 3     |
  | PowerPack   | 1     |
  | Transformer | 1     |

* Layout rows are automatically generated

* Alignment options: **Left / Center / Right** ⭐Extra Feature

* Color-coded device blocks ⭐Extra Feature

* Hover-to-identify each device ⭐Extra Feature

* Supports row-wise shuffling (visual spacing flexibility) ⭐Extra Feature

---

### **3. Summary Panel**

Displays:

* Total industrial batteries
* Total transformers
* Total cost
* Total energy (MWh)
* Site width / depth

---

### **4. Session Management**

* Save any configuration (config + colors). ⭐Extra Feature
* Load previously saved sessions. 
* Quick dropdown list of saved sessions with timestamps. ⭐Extra Feature
* On change: UI shows **unsaved changes banner**. ⭐Extra Feature

---

### **5. Appearance Settings**

* User can customize colors per device type ⭐Extra Feature
* Colors are persisted within saved sessions ⭐Extra Feature

---

## **🔧 Technology Stack**

### **Frontend**

* **Next.js 16 (App Router)**
* React 19
* Styled with plain CSS modules
* API routes for server → backend proxying
* Environment variables via `.env.local`
* Dockerized for deployment

### **Backend**

* **Node.js + Express**
* **MongoDB** for persistent sessions
* Unit-tested API endpoints
* Layout + energy + cost calculation engine
* Dockerized for deployment

### **Database**

* MongoDB (running via Docker)
* Internal networking via Docker Compose

### **Cloud Deployment**

* Hosted on **AWS EC2 t3.micro Free tier**
* Entire system runs via:

  ```
  docker-compose up -d
  ```
* Exposed ports:

  * 8000 → Frontend
  * 3001 → Backend
* Security group configured for HTTP/SSH

---

## **📦 Project Structure**

```
TESLA-SEIA/
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── devices.js
│   │   ├── layoutLogic.js
│   │   └── models/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── page.js
│   │   ├── layout.js
│   │   └── api/
│   ├── components/
│   ├── lib/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

---

## **🚀 Setup Instructions**

### **1. Clone repository**

```sh
git clone https://github.com/<your-username>/tesla-seia.git
cd tesla-seia
```

---

### **2. Environment Variables**

#### **backend/.env**

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/seia_layout
```

#### **frontend/.env.local**

```
BACKEND_INTERNAL_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

For Docker, these are overridden by `docker-compose.yml`.

---

### **3. Run locally with Node**

**Backend**

```sh
cd backend
npm install
npm run dev
```

**Frontend**

```sh
cd frontend
npm install
npm run dev
```

---

### **4. Run with Docker (recommended)**

```sh
docker-compose up --build -d
```

App available at:

```
http://localhost:8000
```

Backend:

```
http://localhost:3001/health
```

---

## **🌐 Deployment on AWS EC2**

* Ubuntu 24.04 LTS
* Installed Docker Engine + Docker Compose
* Pulled project from GitHub
* Started entire stack via:

```sh
docker-compose up -d
```

Firewall rules (Security Group):

| Port  | Purpose                                |
| ----- | -------------------------------------- |
| 22    | SSH                                    |
| 8000  | Frontend                               |
| 3001  | Backend                                |
| 27017 | Optional if accessing Mongo externally |

Public access:

```
http://18.191.196.192:8000/
```

---

## **🧪 API Testing**

### File Path were the postman json is located import this directly in postman for backend API testing
### api_testing/postman_seia.json - Postman JSON file for API testing

**✏️ Note special edge case route have been added even though the values are checked in frontend and we can't add negative values we still have API validation of negative values

Example:

### POST `/layout/calc`

```json
{
  "megapackXL": 2,
  "megapack2": 1,
  "megapack": 0,
  "powerPack": 3
}
```

Returns:

```
- layout grid
- row count
- total MWh
- total cost
- auto transformer count
```

---

---

## **🧪 Unit Testing**

```
- Layout algorithm tests
- Cost + energy calculation tests
- Transformer logic tests
```

---

## **🛠 Trade-Offs & Architecture Decisions**

### **1. Next.js frontend → Express backend split**

* Clean separation of UI vs calculation logic
* Backend independently testable
* Future microservices possible

### **2. MongoDB for sessions**

* Lightweight, flexible schema
* Efficient for storing configuration snapshots
* Easy to scale horizontally

### **3. Docker Compose for end-to-end deployment**

* Reproducible environment
* Easy for Tesla reviewers to run with a single command
* Future CI/CD compatible

### **4. Grid layout algorithm**

* Uses a simplified greedy row-fill model
* Optimized for readability over deep packing heuristics
* Easy to extend for future SEIA layout rules

---

## **📸 Screenshots (Replace with your own)**

```
![App UI Screenshot](./screenshots/ui.png)
![Layout Screenshot](./screenshots/layout.png)
```

---

## **🎯 Summary**

This project demonstrates:

* Production-grade full-stack engineering
* UI/UX design for industrial tools
* Real-world layout logic
* API design + validation
* Cloud deployment
* Docker orchestration
* Clean component-based architecture
* High code clarity and reliability

---
