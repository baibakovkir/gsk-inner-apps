import { useUser } from '@/utils/swr'
import { Avatar, Box, Button, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import FormFieldsWrapper from './Wrapper'

type Props = {
  closeModal?: () => void
}

export default function UploadForm({ closeModal }: Props) {
  // ссылка на элемент для превью загруженного файла
  const previewRef = useRef<HTMLImageElement | null>(null)
  // состояние файла
  const [file, setFile] = useState<File>()
  const { user, accessToken, mutate } = useUser()

  if (!user) return null

  // обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return; // Ensure there's a file to upload
  
    const formData = new FormData();
    formData.append('avatar', file); // Append the file directly
  
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const updatedUser = await res.json();
      mutate({ user: updatedUser }); // Update cache with new user data
  
      if (closeModal) {
        closeModal(); // Close modal if applicable
      }
    } catch (error) {
      console.error(error);
    }
  };

  // обработчик изменения состояния инпута для загрузки файла
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const _file = e.target.files[0];
      setFile(_file);
      
      if (previewRef.current && previewRef.current.children.length > 0) {
        const img = previewRef.current.children[0] as HTMLImageElement;
        img.src = URL.createObjectURL(_file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
        };
      }
    }
  }

  return (
    <FormFieldsWrapper handleSubmit={handleSubmit}>
      <Typography variant='h4'>Avatar</Typography>
      <Box display='flex' alignItems='center' gap={2}>
        <input
          accept='image/*'
          style={{ display: 'none' }}
          id='avatar'
          name='avatar'
          type='file'
          onChange={handleChange}
        />
        <label htmlFor='avatar'>
          <Button component='span'>Choose file</Button>
        </label>
        <Avatar alt='preview' ref={previewRef} src='/public/gsk.png' />
        <Button
          type='submit'
          variant='contained'
          color='success'
          disabled={!file}
        >
          Upload
        </Button>
      </Box>
    </FormFieldsWrapper>
  )
}