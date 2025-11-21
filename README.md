---

# **Megapack Site Layout Planner**

A full-stack application built for the **Tesla SEIA UI Engineering challenge**.
The system allows users to configure Megapack battery units, auto-calculate required transformers, compute total energy & cost, and generate a dynamic grid-based site layout with 100 ft max width.
Users can also save sessions, load previous configurations, customize device colors, and export layout state.

---

---
Public access:

```
http://18.191.196.192:8000/
```
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
│   └── .env.local.example
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

✏️ As per regular practice we cannot push `.env` values; `.env` is listed in `.gitignore`.
For demonstration, I committed `.env.example`.
To run locally, **remove the `.example` suffix** or copy the contents into a new file named `.env`.

Backend 
.env 

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/seia_layout
```

#### **frontend/.env.local**

✏️ Same rule applies. The repo contains `.env.local.example`.
For local use, **rename to `.env.local`** or create a new one with the same content.


Frontend
.env.local

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

### Path where Postman JSON is located

Import this into Postman for complete backend testing:

```
api_testing/postman_seia.json
```

✏️ Even though the frontend prevents negative values, backend API validation still explicitly checks and rejects negative inputs. This ensures the backend is robust and secure regardless of UI constraints.

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

---

# ⭐ How the Instant Recalculation Toggle Reduces API Calls

### **Instant Recalculation (autoRecalc = true)**

When the user edits any input field (e.g., changing MegapackXL from 1→12):

* Every keystroke triggers:

  ```
  POST /layout/calc
  ```
* Example: typing “12”

  * Type "1" → triggers recalculation → **1 API call**
  * Type "2" → triggers recalculation → **1 more API call**

➡ **Total: 2 API calls** just for typing a two-digit number.

With multiple fields changing rapidly:

* 10–20 API calls may occur in a few seconds.
* This offers real-time feedback but increases backend load.

---

### **Manual Recalculation (autoRecalc = false)**

When instant mode is disabled:

* Input changes **do not** trigger any backend calls.
* The system only updates local React state.
* A red “Unsaved Changes” banner appears.
* User clicks **Recalculate → only then** one API call is made.

➡ **Total: 1 API call**, no matter how many values were changed.

---

### **Summary Table**

| Action              | Instant Recalc ON | Instant Recalc OFF |
| ------------------- | ----------------- | ------------------ |
| User types “12”     | 2 API calls       | 0 API calls        |
| User edits 4 fields | ~10–20 calls      | 0 calls            |
| Final recalc        | N/A (auto)        | 1 call             |
| Total calls         | High              | Very low           |

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

![image alt](https://github.com/Tanmay-Dev-SM/Tesla_SEIA_FINAL/blob/64163fa35e70657faba5b6372cb80eb93e4ea404/assets/HLD_system.png)

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

