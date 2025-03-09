import { Box, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component='footer' p={3} bgcolor='primary.main'>
      <Typography variant='body2' textAlign='center' color='white'>
        {new Date().getFullYear()}. &copy; baibakovkir
      </Typography>
    </Box>
  )
}