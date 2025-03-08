import { NextResponse } from 'next/server';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import prisma from '@/utils/prisma'; // Adjust your import path
import authGuard from '@/utils/authGuard'; // Your function to verify JWTs

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'public', 'avatars');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Format file name
  },
});

// Initialize multer
const upload = multer({ storage }).single('avatar');

export async function POST(req) {
  return new Promise((resolve, reject) => {
    // Extract the Authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return reject(new NextResponse('Authorization token is missing', { status: 401 }));
    }
    const token = authHeader.split(' ')[1]; // Bearer token
    const userData = authGuard(token); // Your verification logic
    if (!userData) {
      return reject(new NextResponse('Invalid token', { status: 403 }));
    }

    // Use multer to handle the file upload process directly
    upload(req, null, async (err) => {
      if (err) {
        return reject(new NextResponse('Error uploading file', { status: 500 }));
      }

      try {
        const avatarUrl = `/avatars/${req.file.filename}`; // URL to the uploaded avatar

        // Update the user in the database with the avatar URL
        const user = await prisma.user.update({
          where: { id: userData.id }, // Use user ID from token
          data: { avatar: avatarUrl },
        });

        resolve(NextResponse.json(user)); // Return the updated user
      } catch (error) {
        console.error(error);
        reject(new NextResponse('Internal Server Error', { status: 500 }));
      }
    });
  });
}