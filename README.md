# Social Media App


## Description
The Social Media App is a platform for online communication where users can:
- Add, edit, and delete posts.
- Comment on posts and reply to comments.
- Upload images and manage their profiles.
- Like/unlike posts and comments.

Admins can monitor all activities, block or reactivate user accounts, and manage posts and comments.

## Key Features
- **User Authentication**:
  - Signup with email confirmation (OTP).
  - Login with access and refresh tokens.
  - Social login (Google).
  - Forget/reset password using OTP.
- **User Profile Management**:
  - Update basic info, password, and email.
  - Upload profile pictures using Multer (local storage or Cloudinary).
- **Posts, Comments, and Replies**:
  - Create, read, update, and delete posts.
  - Like/unlike posts and comments.
  - Mention users in posts or comments (email notifications).
- **Admin Panel**:
  - List all users and posts.
  - Block or reactivate accounts, posts, and comments.
- **Real-Time Chat**:
  - Simple chat functionality using Socket.io.
- **Deployment**:
  - Dockerized for both production and development.
  - Deployed on Vercel

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: mongodb
- **Authentication**: JWT, OTP, Social Login (Google)
- **File Upload**: Multer, Cloudinary
- **Real-Time Communication**: Socket.io
- **API**: GraphQL , Restfull
- **Deployment**: Docker, Vercel

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/social-media-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd social-media-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file and add the required variables (e.g., database URL, JWT secret, Cloudinary credentials).
5. Run the app in development mode:
   ```bash
   npm run dev
   ```
6. For production, build and run using Docker:
   ```bash
   docker-compose up --build
   ```

## Usage
1. **Sign Up**: Create an account using your email and confirm it with the OTP sent to your inbox.
2. **Login**: Use your credentials or social login to access your account.
3. **Create Posts**: Add posts with titles, content, and images.
4. **Interact**: Like, comment, and reply to posts.
5. **Manage Profile**: Update your profile information and upload a profile picture.
6. **Admin Panel**: Admins can monitor and manage users, posts, and comments.

## API Documentation
Explore the API endpoints and interact with the Social Media App using the **Postman Documentation**:
[View API Documentation](https://documenter.getpostman.com/view/27083413/2sAYdcrC1J)
