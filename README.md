# SkillSwap — Octopus Hackathon V1.0 🐙

A **skill exchange platform** where users can **offer skills**, **request help**, and **swap knowledge** using a point-based trust system (**HelpPoints**).
Built with a **MERN stack**, SkillSwap enables structured peer-to-peer learning with authentication, protected actions, and email-based coordination.

> **Hackathon Submission:** Octopus Hackathon — V1.0  
> **Author:** Shafqat Baloch  
> **Status:** MVP / Hackathon-ready

---

## 💡 Problem & Solution

### Problem: Limitations in Existing Learning Platforms
Millions of people want to learn practical skills, but current options have major limitations:

- Paid platforms are expensive and not accessible to everyone.  
- Free platforms lack accountability — users often ghost or fail to deliver.  
- No neutral system exists to ensure fairness in skill exchanges.  
- Skill value is asymmetric; someone may be great at one skill but need help in another.

### Solution: How SkillSwap Fixes This
**SkillSwap** addresses these challenges with a credit-based, skill-for-skill exchange:

- Users can **offer skills** they can teach and **request skills** they want to learn.  
- **HelpPoints system** ensures fairness — you must help to get help.  
- Scheduled sessions and completion verification prevent ghosting.  
- Transparent tracking guarantees fair exchanges, trust, and commitment.  

---

## 🚀 Quick Summary

* **Backend:** Node.js, Express, MongoDB (Mongoose)
* **Frontend:** React, Vite, Context API
* **Auth:** JWT-based authentication
* **Uploads:** Multer + Cloudinary (avatars)
* **Email:** Nodemailer (meeting notifications)
* **Architecture:** Clean MVC + REST APIs
* **Core Concept:** Skill swapping powered by HelpPoints

---

## 🧠 Core Concept (HelpPoints System)

* Every new user starts with **5 HelpPoints**
* Requesting help on an **Offer** costs **1 HelpPoint**
* Completing a swap:

  * Skill provider **earns +1**
  * Skill requester **loses -1**
* This incentivizes fairness and contribution

---

## 🏗️ Architecture (Project Tree)

### Backend (`/server`)

```text
├── config
├── controllers
├── middleware
├── models
├── routes
├── utils
├── app.js
└── server.js
```

> For detailed backend API documentation, environment variables, and email logic, see [`server/README.md`](server/README.md).

### Frontend (`/client`)

```text
├── src
│   ├── api
│   ├── components
│   ├── context
│   ├── pages
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

---

## 🔐 Authentication Flow

* JWT-based authentication
* Token returned on **register/login**
* Stored client-side and sent via `Authorization: Bearer <token>`
* Protected routes enforced via middleware

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

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🧪 What Judges Should Look At

* Clean MVC backend architecture
* Real-world logic (points, permissions, ownership)
* Secure auth & protected routes
* Clear separation of concerns
* Practical, scalable idea

---

## 🛣️ Future Improvements

* Real-time chat (Socket.IO)
* Ratings & feedback
* Skill verification badges
* Admin moderation panel
* Calendar integration

---

## 📜 License

MIT License

---

## 🤝 Contact

**Shafqat Baloch**
GitHub: [https://github.com/shafqat-baloch786](https://github.com/shafqat-baloch786)

---

⭐ If you like this project, consider starring the repo!
