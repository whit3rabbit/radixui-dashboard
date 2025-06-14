import { Link } from 'react-router-dom'
import { Container, Flex, Heading, Text, Button, TextField, Card, Box } from '@radix-ui/themes'
import { MagnifyingGlassIcon, HomeIcon, FileTextIcon, PersonIcon, GearIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')

  const popularLinks = [
    { title: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
    { title: 'Profile', href: '/dashboard/profile', icon: <PersonIcon /> },
    { title: 'Settings', href: '/dashboard/settings', icon: <GearIcon /> },
    { title: 'Forms', href: '/dashboard/forms', icon: <FileTextIcon /> }
  ]

  return (
    <Container size="2" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Flex direction="column" align="center" gap="6" style={{ width: '100%', textAlign: 'center' }}>
        {/* 404 Illustration */}
        <Box>
          <Text size="9" weight="bold" style={{ fontSize: '120px', color: 'var(--gray-9)' }}>
            404
          </Text>
        </Box>

        {/* Error Message */}
        <Flex direction="column" gap="2">
          <Heading size="7">Page not found</Heading>
          <Text size="3" color="gray">
            Sorry, we couldn't find the page you're looking for.
          </Text>
        </Flex>

        {/* Search Bar */}
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <form onSubmit={(e) => { e.preventDefault(); console.log('Search:', searchQuery) }}>
            <Flex gap="2">
              <TextField.Root 
                placeholder="Search for pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="3"
                style={{ flex: 1 }}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
              <Button size="3" type="submit">
                Search
              </Button>
            </Flex>
          </form>
        </Card>

        {/* Popular Links */}
        <Flex direction="column" gap="3" align="center">
          <Text size="2" color="gray" weight="medium">
            Popular pages
          </Text>
          <Flex gap="3" wrap="wrap" justify="center">
            {popularLinks.map((link) => (
              <Link key={link.href} to={link.href} style={{ textDecoration: 'none' }}>
                <Button variant="soft" size="2">
                  {link.icon}
                  {link.title}
                </Button>
              </Link>
            ))}
          </Flex>
        </Flex>

        {/* Back to Dashboard */}
        <Flex gap="3" mt="4">
          <Link to="/dashboard">
            <Button size="3">
              <HomeIcon />
              Back to Dashboard
            </Button>
          </Link>
          <Button size="3" variant="soft" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Flex>
      </Flex>
    </Container>
  )
}