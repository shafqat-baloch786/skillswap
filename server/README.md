# SkillSwap Backend — Octopus Hackathon V1.0 🐙

This is the **backend API documentation** for SkillSwap, handling authentication, skill posts, swaps, HelpPoints transactions, and email notifications.

> **Hackathon Submission:** Octopus Hackathon — V1.0  
> **Author:** Shafqat Baloch  
> **Status:** MVP / Hackathon-ready


---

## 🚀 Quick Summary

* **Backend:** Node.js, Express, MongoDB (Mongoose)
* **Auth:** JWT-based authentication
* **Uploads:** Multer + Cloudinary (avatars)
* **Email Notifications:** Nodemailer (meeting notifications)
* **Architecture:** Clean MVC + REST APIs

---

## 🏗️ Project Structure

```text
└── server
    ├── config
    │   ├── cloudinary.js
    │   ├── db.js
    ├── controllers
    │   ├── authController.js
    │   ├── postController.js
    │   ├── swapController.js
    ├── middleware
    │   ├── auth.js
    │   ├── errorHandler.js
    ├── models
    │   ├── User.js
    │   ├── Post.js
    │   ├── Swap.js
    ├── routes
    │   ├── authRoute.js
    │   ├── postRoute.js
    │   ├── swapRoute.js
    ├── utils
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

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory:

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

```bash
cd server
npm install
npm run dev
```

* Server runs on: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Documentation (REST)

### Base URL

```
/api
```

### 🔑 Auth Routes (`/api/auth`)

| Method | Endpoint    | Description                            |
| ------ | ----------- | -------------------------------------- |
| POST   | `/register` | Register user (supports avatar upload) |
| POST   | `/login`    | Login user                             |
| GET    | `/me`       | Get current user profile               |
| PATCH  | `/update`   | Update profile & avatar                |

---

### 📝 Posts Routes (`/api/posts`)

| Method | Endpoint    | Description                                                 |
| ------ | ----------- | ----------------------------------------------------------- |
| GET    | `/`         | Get all posts (filters: category, type, excludes own posts) |
| POST   | `/`         | Create a new skill post                                     |
| GET    | `/my-posts` | Get logged-in user's posts                                  |
| GET    | `/:id`      | Get post by ID                                              |
| DELETE | `/:id`      | Delete own post                                             |

**Post Types:**

* `Offer` → teaching
* `Request` → learning

> **Sorting:** Posts are sorted by newest first (`createdAt: -1`)

---

### 🔄 Swap Routes (`/api/swaps`)

| Method | Endpoint        | Description                         |
| ------ | --------------- | ----------------------------------- |
| POST   | `/request`      | Send swap request                   |
| GET    | `/my-swaps`     | View incoming & outgoing swaps      |
| PUT    | `/:id/status`   | Accept / Reject swap                |
| POST   | `/:id/complete` | Complete swap & transfer HelpPoints |

**Swap Lifecycle:**

```
Pending → Accepted → Completed
        ↳ Rejected
```

---

## 🔐 Authentication

* JWT-based authentication
* Token sent via `Authorization: Bearer <token>`
* Protected routes enforced via middleware

---

## 📧 Email Notifications

* Triggered when a swap is **accepted**
* Sends:

  * Meeting link
  * Date & time
  * Skill title
* Implemented using Nodemailer

---

## 🧪 Key Technical Highlights

* Clean MVC architecture ensures easy scalability
* AsyncWrapper used to handle async errors
* HelpPoints logic enforces fairness in swaps
* Proper ownership and permissions checks for posts and swaps
* Multer + Cloudinary used for avatar/image uploads

---

## 📜 License

MIT License

---

## 🤝 Contact

**Shafqat Baloch**
GitHub: [https://github.com/shafqat-baloch786](https://github.com/shafqat-baloch786)
