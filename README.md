# SkillSwap — Octopus Hackathon V1.0 🐙

A **skill exchange platform** where users can **offer skills**, **request help**, and **swap knowledge** using a point-based trust system (**HelpPoints**).  
Built with a **MERN stack**, SkillSwap enables structured peer-to-peer learning with authentication, protected actions, and email-based coordination.

> **Hackathon Submission:** Octopus Hackathon — V1.0  
> **Author:** Shafqat Baloch  
> **Status:** MVP / Hackathon-ready

---

## 🚀 Quick Summary

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React, Vite, Context API
- **Auth:** JWT-based authentication
- **Uploads:** Multer + Cloudinary (avatars)
- **Email:** Nodemailer (meeting notifications)
- **Architecture:** Clean MVC + REST APIs
- **Core Concept:** Skill swapping powered by HelpPoints

---

## 🧠 Core Concept (HelpPoints System)

- Every new user starts with **5 HelpPoints**
- Requesting help on an **Offer** costs **1 HelpPoint**
- Completing a swap:
  - Skill provider **earns +1**
  - Skill requester **loses -1**
- This incentivizes fairness and contribution

---

## 🏗️ Architecture (Project Tree)

### Backend (`/server`)

```text
└── 📁server
    ├── 📁config
    │   ├── cloudinary.js
    │   ├── db.js
    ├── 📁controllers
    │   ├── authController.js
    │   ├── postController.js
    │   ├── swapController.js
    ├── 📁middleware
    │   ├── auth.js
    │   ├── errorHandler.js
    ├── 📁models
    │   ├── User.js
    │   ├── Post.js
    │   ├── Swap.js
    ├── 📁routes
    │   ├── authRoute.js
    │   ├── postRoute.js
    │   ├── swapRoute.js
    ├── 📁utils
    │   ├── asyncWrapper.js
    │   ├── ErrorHandlerClass.js
    │   ├── generateToken.js
    │   ├── multer.js
    │   ├── dataUri.js
    │   ├── emailHandler.js
    ├── app.js
    ├── server.js
    └── .env
```

### Frontend (`/client`)

```text
└── 📁client
    ├── 📁src
    │   ├── 📁api
    │   │   └── axios.js
    │   ├── 📁components
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── ProtectedRoute.jsx
    │   ├── 📁context
    │   │   └── AuthContext.jsx
    │   ├── 📁pages
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Marketplace.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MyPosts.jsx
    │   │   ├── Swaps.jsx
    │   │   ├── Profile.jsx
    │   │   └── EditProfile.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

---

## 🔐 Authentication Flow

- JWT-based authentication
- Token returned on **register/login**
- Stored client-side and sent via `Authorization: Bearer <token>`
- Protected routes enforced via middleware

---

## 📡 API Documentation (REST)

### Base URL
```
/api
```

---

### 🔑 Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/register` | Register user (supports avatar upload) |
| POST | `/login` | Login user |
| GET | `/me` | Get current user profile |
| PATCH | `/update` | Update profile & avatar |

---

### 📝 Posts Routes (`/api/posts`)

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/` | Get all posts (filters: category, type) |
| POST | `/` | Create a new skill post |
| GET | `/my-posts` | Get logged-in user's posts |
| GET | `/:id` | Get post by ID |
| DELETE | `/:id` | Delete own post |

**Post Types**
- `Offer` → teaching
- `Request` → learning

---

### 🔄 Swap Routes (`/api/swaps`)

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/request` | Send swap request |
| GET | `/my-swaps` | View incoming & outgoing swaps |
| PUT | `/:id/status` | Accept / Reject swap |
| POST | `/:id/complete` | Complete swap & transfer HelpPoints |

**Swap Lifecycle**
```
Pending → Accepted → Completed
        ↳ Rejected
```

---

## 📧 Email Notifications

- Triggered when a swap is **accepted**
- Uses Nodemailer
- Sends:
  - Meeting link
  - Date & time
  - Skill title

---

## ⚙️ Environment Variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skillswap
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> ⚠️ Never commit real secrets to GitHub

---

## ▶️ How to Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🧪 What Judges Should Look At

- Clean MVC backend architecture
- Real-world logic (points, permissions, ownership)
- Secure auth & protected routes
- Email integration
- Clear separation of concerns
- Practical, scalable idea

---

## 🛣️ Future Improvements

- Real-time chat (Socket.IO)
- Ratings & feedback
- Skill verification badges
- Admin moderation panel
- Calendar integration

---

## 📜 License

MIT License

---

## 🤝 Contact

**Shafqat Baloch**  
GitHub: https://github.com/shafqat-baloch786

---

⭐ If you like this project, consider starring the repo!