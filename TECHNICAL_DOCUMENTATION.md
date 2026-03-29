# 📘 Technical Documentation

## ❓ What is this file and why does it exist?
This document serves as the comprehensive and ultimate reference source for software engineers, solution architects, and technical project managers building, maintaining, or scaling the **Claims Processing System**. 

Rather than sifting through thousands of lines of code to understand execution flows and data persistence strategies, engineers can refer directly to this document. It bridges the gap between raw code implementations and broader system design philosophy.

Here, you will find:
1. **High-Level Design (HLD):** Understanding system macro-architecture, infrastructure integration (Docker, Message Brokers, DB), and how different subsystems interact at scale.
2. **Low-Level Design (LLD):** The detailed, granular view of internal packages, database tables, and the specific responsibilities of individual services, controllers, and classes.

---

## 🏗️ High-Level Design (HLD)

The system leverages a decoupled, asynchronous, modern monolithic architecture designed to operate at scale. We decouple the client logic entirely from the backend execution.
 
### 1. Architectural Modules
- **Client Tier (Frontend):** React (v19) SPA interacting smoothly utilizing Vite and Tailwind CSS.
- **API/Application Tier (Backend):** Built with Spring Boot (v3.3.0), orchestrating business rules, data transformation, security headers, and caching mechanisms.
- **Relational Storage:** MySQL (v8.0) handles structured, ACID-compliant records regarding Users, Role-Based Access Control, Claims history, and Notifications.
- **Event Streaming:** Apache Kafka prevents tight coupling. By utilizing a Publish/Subscribe pattern, heavy notification activities happen outside the critical path of claim submissions.
- **Cache Layer:** Redis keeps real-time or frequently fetched data in-memory to drastically lower MySQL latency overhead.

### 2. High-Level Flow (End-to-End Submission)
1. The **React UI** submits a `POST /api/v1/claims` REST invocation with user-provided JSON.
2. The **Spring Boot Controller (`ClaimController.java`)** intercepts the request and offloads it to the **`ClaimService.java`**.
3. The **`ClaimService`** performs basic validations and persists the initial schema as `SUBMITTED` into the default **MySQL** Database using **Spring Data JPA**.
4. To defer downstream operations (like sending Emails, or Audit logging), **`ClaimService`** drops a `ClaimCreatedEvent` onto a **Kafka Topic**.
5. The claim creation REST response is immediately sent back to the frontend yielding rapid UI feedback.
6. Asynchronously, **`NotificationService`** acts as a Kafka Consumer. It pulls the event off the topic queue, executes email procedures via SMTP, and persists an in-app `Notification` record back into the SQL layer.

---

## 🛠️ Low-Level Design (LLD)

The codebase organizes itself precisely into layers—preventing "fat controllers" and standardizing how information travels. 

### 1. Layered Backend Design (`src/main/java/com/claim/demo/`)

#### 🔹 `controller/` (The Application API Edge)
Controllers define the REST boundaries. These inject `Service` singletons and return standardized `DTOs` (Data Transfer Objects).
- **`AuthController.java`**: Exposes `/login` and `/register`. Interacts with `AuthenticationManager` to exchange credentials for JsonWebTokens (JWTs).
- **`ClaimController.java`**: Exposes `/claims` routing (GET list, POST generate, PUT update status map). Admin routes are gated.
- **`UserController.java`**: Provides specific, authenticated profile requests retrieving session-based active states.

#### 🔹 `dto/` (Data Transfer Objects)
Classes isolated specifically to handle inbound (Request) or outbound (Response) payloads.
- **`JwtAuthResponse`, `LoginRequest`, `RegisterRequest`**: Decoupled from `User.java` to avoid exposing password hashes and sensitive meta data fields.

#### 🔹 `entity/` (JPA Mappings)
Direct 1-to-1 representations of SQL table rows.
- **`User.java`**: Mapped to `#users` with JPA `@Table`. Has relationships pointing to claims and notices.
- **`Claim.java`**: Mapped to `#claims`, holds state strings (`SUBMITTED`, `PROCESSING`, `APPROVED`, etc.).
- **`Notification.java`**: Mapped to `#notifications` (Linked many-to-one to `User.java`).

#### 🔹 `repository/` (The Data Access Layer)
Spring Data JPA Interfaces that automatically generate SQL operations.
- **`UserRepository.java`**: `findByUsername()`
- **`ClaimRepository.java`**: `findByUserId()`
- **`NotificationRepository.java`**: `findByUserIdAndIsReadFalse()`

#### 🔹 `service/` (Core Business Logic)
The "brain" of the application handling heavy lifting rules.
- **`ClaimService.java`**: Validates request models, maps DTO -> Entities, saves the DB state, and acts as the **Kafka Producer** (serializes entity data over the wire).
- **`NotificationService.java`**: A background listener class operating inside a thread pool consuming incoming Kafka messages.
- **`UserDetailsServiceImpl.java`**: Specific to Spring Security internals—fetching hashed credentials prior to JWT minting.

#### 🔹 `filter/` & `config/` (Cross-Cutting Concerns)
- **`JwtAuthenticationFilter.java`**: Intercepts *every* API request before the controllers are reached. Cracks the Authorization HTTP Header, parses the Bearer JWT, and statically assigns the `SecurityContext`.
- **`SecurityConfig.java`**: Binds role-based access. Admin endpoints require `hasRole("ADMIN")`.
- **`KafkaConfig.java` / `RedisConfig.java`**: Bean initializers overriding default memory pools to bind to Docker containers.
- **`DataInitializer.java`**: A `CommandLineRunner` hook overriding startup to pre-populate default Demo users (`admin`, `agent1`) if the Database is fresh.

### 2. Frontend React Directory Architecture (`frontend/src/`)

#### 🔹 `pages/` (View Containers)
Where independent sub-sections reside, rendering complex UI blocks.
- **`Login.jsx` & `Register.jsx`**: Handles contextless auth token generations via Axios POST. Upon success, stores `localStorage` tokens and executes browser redirects.
- **`Dashboard.jsx`**: General entry portal, displaying personalized analytics or summaries.
- **`AdminDashboard.jsx`**: A gate-kept UI. Performs distinct API fetches utilizing Admin credentials. Displays aggregate states allowing PUT iterations to modify active claims.
- **`MyClaims.jsx`**: A user-specific grid fetching their particular historical claims history for visual tracking.
- **`Profile.jsx`**: Represents user specific metadata.

#### 🔹 `components/` & `layout/`
- **`Sidebar.jsx`**: High level persistent navigational router map updating URL contexts dynamically. 

### 3. Database Summary Table

| Table schema | Column Details | Index Keys |
| :--- | :--- | :--- |
| **users** | `id`, `username`, `email`, `role`, `password_hash`, `created_at` | Primary Key `id` |
| **claims** | `id`, `user_id`, `policy_number`, `amount`, `status`, `description`| FK `user_id` -> users(`id`) |
| **notifications** | `id`, `user_id`, `message`, `is_read`, `sent_at` | FK `user_id` -> users(`id`) |

---

## 🔒 Security Architecture
The system employs explicit **Zero-Trust** principles intermixing stateless JWT and robust endpoint authorization mappings. 

1. Passwords are never stored raw; they are systematically hashed using `BCrypt`.
2. REST filters implicitly deny any incoming request without a valid RSA-signed JWT.
3. React `localStorage` acts merely as the bearer holder—backend controllers ultimately re-validate the role identity tied to the tokens prior to updating database values ensuring frontend-tampering does not affect final states.
