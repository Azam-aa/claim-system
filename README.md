# Claims Processing System

An end-to-end full-stack modern web application that allows users to easily register, file claims, track their application statuses in real-time, and provides administrators with a comprehensive dashboard to review and resolve claims efficiently. 

## 🌟 First Impressions & User Experience
When a user visits the application, they are greeted by a **modern, responsive, and highly intuitive interface**. The goal of the design is to instill **trust, reliability, and peace of mind**, turning a traditionally stressful process—filing a claim—into an effortless and guided experience.

- **Dynamic Interactivity:** Smooth micro-animations and page transitions using Framer Motion keep the UI feeling "alive" and highly engaging.
- **Clean Aesthetic:** Tailwind CSS provides a highly polished, aesthetic look with organized layouts, clear typography, and a modern color palette that ensures high readability.
- **Instant Feedback:** Interactive elements and Sweetalert2 notifications ensure the user is constantly aware of their actions resulting in success or error states.

## 🚀 Tech Stack

### Frontend
- **React.js (v19) & Vite:** For building a lightning-fast Single Page Application (SPA).
- **Tailwind CSS:** Utility-first CSS framework for rapid and precise styling.
- **Framer Motion:** For fluid micro-animations and UI transitions.
- **Lucide React:** Beautiful, consistent iconography.
- **Axios:** For robust REST API HTTP requests.
- **SweetAlert2:** For beautiful, customizable popup alerts.

### Backend
- **Java Spring Boot (v3.3.0):** The robust underlying framework serving RESTful APIs.
- **Spring Security & JWT:** Stateless authentication ensuring secure access to endpoints.
- **MySQL (v8.0):** Relational database providing ACID-compliant data persistence.
- **Redis:** High-performance caching layer for quick data retrieval.
- **Apache Kafka:** Distributed event streaming platform handling asynchronous tasks (like email notifications after claim submission).

---

## 🔐 Demo Credentials

Use the following default credentials to securely test the distinct roles over the platform:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `password123` |
| **Default User** | `agent1` | `password123` |

---

## 📂 Folder Structure

```
D:\Projects\frontend-claim\
├── .gitignore               # Git ignore rules
├── Dockerfile               # Docker configuration for backend
├── docker-compose.yml       # Orchestration for MySQL, Redis, Kafka, Zookeeper
├── pom.xml                  # Maven dependencies list for Spring Boot
├── README.md                # Project documentation overview
├── TECHNICAL_DOCUMENTATION.md # In-depth technical guide (HLD, LLD)
│
├── frontend/                # 🌐 Frontend React Application
│   ├── index.html           # Main HTML file
│   ├── package.json         # Node.js dependencies
│   ├── src/                 
│   │   ├── components/      # Reusable UI components (Sidebar, Layouts, etc.)
│   │   ├── pages/           # Application views (Login, Dashboard, AdminDashboard, etc.)
│   │   ├── App.jsx          # Main application routing component
│   │   └── main.jsx         # React application entry point
│   └── ...
│
└── src/                     # ⚙️ Backend Spring Boot Application
    └── main/
        ├── java/com/claim/demo/
        │   ├── config/      # Configuration (Security, Redis, Kafka, Init Data)
        │   ├── controller/  # API endpoints (Auth, Claims, User)
        │   ├── dto/         # Data Transfer Objects
        │   ├── entity/      # JPA Entity models (User, Claim, Notification)
        │   ├── filter/      # JWT Authentication & interceptors
        │   ├── repository/  # Database access interfaces
        │   └── service/     # Core business logic & Kafka producers/consumers
        └── resources/
            └── application.properties # App configuration, server port, DB URL
```

## 🛠 Setup & Run Instructions

1. **Start the Infrastructure (DB, Redis, Kafka):**
   Ensure you have Docker installed and running.
   ```bash
   docker-compose up -d
   ```

2. **Run the Backend (Spring Boot):**
   You can run this using Maven or your IDE (Eclipse/IntelliJ).
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will be available at `http://localhost:8080`*

3. **Run the Frontend (React):**
   Navigate to the `frontend` directory, install packages, and start the Vite development server.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`*
