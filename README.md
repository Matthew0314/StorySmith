# StorySmith

> A collaborative worldbuilding platform for writers, game developers, and creative teams.

StorySmith is a full-stack web application designed to help writers, game developers, and creative teams organize fictional worlds in one centralized workspace. The platform provides customizable wikis, structured worldbuilding tools, AI-assisted writing, and collaborative project management to streamline the creative process.

---

## Features

### Modular Wiki System
- Create unlimited wiki pages
- Organize pages into custom categories and subcategories
- Build pages using reusable content blocks 
- Text Descriptions
- Quotes
- Character statistics
- Image uploads

### Team Collaboration
- Multiple projects
- Invite collaborators
- Shared project workspace

### AI Writing Assistant
- Google Gemini AI integration
- Brainstorm characters, lore, and locations
- Generate descriptions
- Assist with worldbuilding ideas

### Image Management
- Upload and manage images
- Associate artwork with wiki pages
- Cloud-based image storage

### Authentication
- Secure user registration and login
- JWT Authentication
- Protected API endpoints

### Project Management
- Project dashboard
- Custom project settings
- Category management
- User role management

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- CSS

## Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

## Database
- PostgreSQL

## Cloud
- AWS EC2
- AWS RDS
- AWS S3

## AI
- Spring AI
- Google Gemini API



<!-- # Architecture

```text
                 React Frontend
                        │
                  REST API Calls
                        │
                        ▼
               Spring Boot Backend
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
   PostgreSQL Database             AWS S3 Storage
```



# 📷 Screenshots

> *(Replace these with your own screenshots.)*

| Dashboard | Wiki Editor |
|------------|-------------|
| ![](images/dashboard.png) | ![](images/wiki.png) |

| AI Assistant | Project Settings |
|---------------|-----------------|
| ![](images/ai.png) | ![](images/settings.png) |

---
-->
# Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/storysmith.git
cd storysmith
```

---

## Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create an `.env` file (or configure your application properties) with the following values:

```properties
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=

JWT_SECRET=

GEMINI_API_KEY=

AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
```

---

# Project Structure

```text
StorySmith
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── security
│   ├── entities
│   └── dto
│
└── frontend
    ├── components
    ├── pages
    └── assets
```

---

# Technical Highlights

- Full-stack application using React, TypeScript, Spring Boot, and PostgreSQL
- Modular wiki architecture supporting reusable content blocks
- JWT-based authentication and authorization
- RESTful API design
- Google Gemini AI integration using Spring AI
- Image upload and cloud storage through AWS S3
- Deployment using AWS EC2, RDS, and S3

---

# Roadmap

- [ ] Real-time collaborative editing
- [ ] Script editor
- [ ] Dialogue localization tools
- [ ] Version history
- [ ] Activity feed
- [ ] Notification system

---

# Motivation

Worldbuilding often becomes scattered across documents, spreadsheets, and note-taking applications. StorySmith was created to provide a centralized platform where writers, designers, and developers can collaborate on large fictional universes while keeping lore, characters, locations, and project information organized in one place.

---

# License

This project is licensed under the MIT License.

---

# Author

**Matthew Holzer**

- GitHub: https://github.com/Matthew0314
- LinkedIn: https://linkedin.com/in/matthewholzer314
- Portfolio: https://matthewholzer.com/

