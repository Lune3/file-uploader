# Express File Management System with Prisma and Passport.js

## Project Overview
This project is a file management system built using Express.js, Prisma, and Passport.js. It allows users to authenticate using session-based authentication, upload files to specific folders, and view file details. The files are stored in a cloud storage service (e.g., Supabase or Cloudinary), and all session data is persisted in a database using Prisma session store.

## Features
- **Session-based Authentication**: User authentication using Passport.js, with sessions stored in the database.
- **File Uploads**: Authenticated users can upload files into folders.
- **Folder Management**: Users can create, update, delete, and list folders.
- **File Details**: View specific file details (name, size, upload time) and download files.
- **Cloud Storage Integration**: Files are uploaded to a cloud storage provider, with file URLs stored in the database.


