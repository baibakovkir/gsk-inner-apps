'use client'
import { Box } from "@mui/material";
import Link from "next/link";

const programms = {
  1: {
    id: 1,
    name: 'Cправка',
    description: 'Описание программы 1',
    image: 'https://example.com/image1.jpg',
    link: 'information',
  },
  2: {
    id: 2,
    name: 'Cправка',
    description: 'Описание программы 1',
    image: 'https://example.com/image1.jpg',
    link: 'information',
  },
  3: {
    id: 3,
    name: 'Cправка',
    description: 'Описание программы 1',
    image: 'https://example.com/image1.jpg',
    link: 'information',
  },
}

export default function Home() {
  return (
    <main>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', minHeight: 'calc(100vh - 130px)' }}>
        {Object.values(programms).map((programm) => (
          
            <Box key={programm.id} sx={{ height: '300px', minWidth: '300px', border: 2 }}>
              <Link  href={programm.link}>
                <h2>{programm.name}</h2>
                <p>{programm.description}</p>
              </Link>
            </Box>
        ))}
      </Box>
    </main>
  );
}