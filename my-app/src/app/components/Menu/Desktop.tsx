import { List, ListItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import ProfileButton from '../Buttons/ProfileButton'
import type { PageLinks } from '../Header'

type Props = {
  links: PageLinks
}

export default function DesktopMenu({ links }: Props) {
  const theme = useTheme()

  return (
    <List
      sx={{
        display: { xs: 'none', sm: 'flex' },
        justifyContent: 'flex-end',
        paddingInline: theme.spacing(1)
      }}
    >
      {links.map((link, i) => (
        <ListItem key={i}>
          <Link href={link.href}>
            {link.title}
          </Link>
        </ListItem>
      ))}
      <ProfileButton />
    </List>
  )
}