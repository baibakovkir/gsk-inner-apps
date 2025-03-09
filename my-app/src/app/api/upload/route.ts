// pages/api/upload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export async function POST(req: NextRequest, res: NextResponse) {
  const upload = multer({ storage }).single('avatar');
  const avatar = await new Promise((resolve, reject) => {
    req.blob().then((blob) => {
      console.log(blob)
    })
  })
  await console.log(avatar)
  return new Response(JSON.stringify({ message: 'File uploaded successfully' }), { status: 201 });
}
 