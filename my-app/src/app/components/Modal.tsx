'use client'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal as MuiModal } from '@mui/material'
import { cloneElement, useMemo, useState } from 'react'

type Props = {
  triggerComponent: JSX.Element
  modalContent: JSX.Element
  size?: 'S' | 'M'
}

export default function Modal({
  triggerComponent,
  modalContent,
  size = 'S'
}: Props) {
  // состояние открытости модалки
  const [open, setOpen] = useState(false)

  // метод для открытия модалки
  const handleOpen = () => setOpen(true)
  // метод для закрытия модалки
  const handleClose = () => setOpen(false)

  // содержимому модалки в качестве пропа передается метод для закрытия модалки
  const content = cloneElement(modalContent, { closeModal: handleClose })

  const modalStyles = useMemo(
    () => ({
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 24,
      left: '50%',
      maxWidth: size === 'S' ? 425 : 576,
      p: 2,
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      outline: 'none'
    }),
    [size]
  )

  return (
    <>
      <Box onClick={handleOpen}>{triggerComponent}</Box>
      <MuiModal open={open} onClose={handleClose}>
        <Box sx={modalStyles}>
          <IconButton
            sx={{
              position: 'absolute',
              top: '1rem',
              right: '1rem'
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          {content}
        </Box>
      </MuiModal>
    </>
  )
}