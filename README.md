# 🏋️ Gym Class Scheduling and Membership Management System

This is a full-stack backend project designed to manage gym class scheduling and membership efficiently. It supports roles like Admin, Trainer, and Trainee, with role-based permissions and JWT authentication. The system ensures business rules like class booking limits, schedule caps, and proper error handling.

---

## 📌 Project Overview

A system that:
- Allows **Admins** to manage trainers and schedules.
- Allows **Trainers** to view their assigned classes.
- Allows **Trainees** to book/cancel class schedules.
- Ensures **max 5 classes/day** and **10 trainees/class** rules.
- Implements robust validation and error handling.

---

## 🔗 Relational Diagram

![Relational Diagram](https://res.cloudinary.com/djzt5tkwu/image/upload/v1752412592/er-diagram_gsiryl.png) <!-- Replace with actual image path or link -->

---

## 🛠 Technology Stack

| Category           | Technology                   |
|-------------------|------------------------------|
| Language           | TypeScript                   |
| Runtime            | Node.js                      |
| Framework          | Express.js                   |
| ORM                | Prisma                       |
| Database           | PostgreSQL (preferred) / MongoDB |
| Authentication     | JWT                          |
| File Upload        | Multer                       |
| Cloud Image Store  | Cloudinary                   |
| Environment Config | dotenv                       |

---

## 🔐 Roles and Permissions

| Role    | Permissions                          |
|---------|--------------------------------------|
| Admin   | Create trainers, manage schedules    |
| Trainer | View own class schedules only        |
| Trainee | Manage profile, book/cancel classes  |

---

## 📋 API Endpoints

### ✅ Auth & User

| Method | Endpoint               | Description                    | Access        |
|--------|------------------------|--------------------------------|---------------|
| POST   | `/user/register-user`  | Register new user (trainee)    | Public        |
| POST   | `/user/register-trainer` | Register new trainer         | Admin         |
| POST   | `/user/login`          | User login                     | Public        |
| GET    | `/user/me`             | View own profile               | All roles     |
| PUT    | `/user/me`             | Update own profile             | All roles     |
| GET    | `/user/trainers`       | Get all trainers               | Public        |
| DELETE | `/user/trainers/:id`   | Delete a trainer               | Admin         |

---

### 🗓️ Class Schedules

| Method | Endpoint                  | Description                | Access    |
|--------|---------------------------|----------------------------|-----------|
| POST   | `/schedule/`              | Create class schedule      | Admin     |
| GET    | `/schedule/`              | Get all schedules          | Public    |
| GET    | `/schedule/my-schedules`  | Get trainer's schedules    | Trainer   |

---

### 📅 Booking

| Method | Endpoint                    | Description                  | Access       |
|--------|-----------------------------|------------------------------|--------------|
| POST   | `/booking/create-booking`   | Book a class schedule        | Trainee      |
| DELETE | `/booking/cancel-booking`   | Cancel a booking             | Trainee/Admin |
| GET    | `/booking/my-bookings`      | View trainee’s bookings      | Trainee      |

---

## 🧾 Database Schema (Prisma)

```ts

model User {
  id           String  @id @default(uuid())
  name         String
  email        String  @unique
  password     String
  profileImage String?

  userStatus   UserStatus @default(ACTIVE)
  role         UserRole   @default(TRAINEE)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  trainerClassSchedules ClassSchedule[]
  traineeBookings       Booking[]
}

model ClassSchedule {
  id        String   @id @default(uuid())
  date      DateTime
  startTime DateTime
  endTime   DateTime

  trainerId String
  trainer   User   @relation(fields: [trainerId], references: [id])

  bookings  Booking[]
  createdAt DateTime  @default(now())
  updatedAt DateTime?  @updatedAt

  @@index([date])
}

model Booking {
  id              String   @id @default(uuid())
  traineeId       String
  classScheduleId String
  createdAt       DateTime @default(now())
  updatedAt       DateTime? @updatedAt 

  trainee         User          @relation(fields: [traineeId], references: [id])
  classSchedule   ClassSchedule @relation(fields: [classScheduleId], references: [id])

  @@unique([traineeId, classScheduleId])
}

```


## ✅ Business Rules

### 🗓️ Class Schedule Rules:
- Max **5 schedules/day**
- Each class lasts **2 hours**
- Max **10 trainees/class**

### 📅 Booking Rules:
- Trainees can’t **double-book** the same time
- Booking fails if class is **full**
- Trainees can **cancel** bookings

## ⚠️ Error Handling Examples

🔹 Validation Error

```json
{
  "success": false,
  "message": "Validation error occurred.",
  "errorDetails": {
    "field": "email",
    "message": "Invalid email format."
  }
}
```
🔹 Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized access.",
  "errorDetails": "You must be an admin to perform this action."
}
```
🔹 Booking Limit Exceeded

```json
{
  "success": false,
  "message": "Class schedule is full. Maximum 10 trainees allowed per schedule."
}
```
✅ Success Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Class booked successfully",
  "Data": "return data"
}
```

## 🚀 How to Run Locally

### 🛠️ Step-by-step Instructions

```bash
# 1. Clone the repo
git clone https://github.com/Sajjadhosenshohan/Gym-membership-management-backend
cd Gym-membership-management-backend

# 2. Install dependencies
npm install

# 3. Set up .env file
cp .env.example .env
# Add values for DB URL, JWT secrets, Cloudinary, etc.

# 4. Migrate and generate the Prisma client
npx prisma migrate dev --name init
npx prisma generate

# 5. Start the development server
npm run dev
```


## 🔐 Admin Credentials

Email: admin@gmail.com 
Password: 123456



## 🌍 Live Hosting Link

👉 [https://gym-schedule-and-booking-management.vercel.app](https://gym-schedule-and-booking-management.vercel.app)


## 📬 Postman Documentation

📄 [View Postman Collection](https://www.postman.com/bongodevs-1923/workspace/gym-management-backend/collection/37579050-dc92312c-58ee-4ae2-b786-ffdf23e2bd43?action=share&creator=37579050)


## 🧪 Testing Instructions

1. **Login with admin credentials**
2. **Create a trainer**  
   `POST /user/register-trainer`
3. **Schedule classes**  
   `POST /schedule/`
4. **Create trainee account**  
   `POST /user/register-user`
5. **Login as trainee → Book class**  
   `POST /booking/create-booking`
6. **Try overbooking → Validate error**
7. **Cancel booking**  
   `DELETE /booking/cancel-booking`


## 📎 .env Configuration Example

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db
BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
