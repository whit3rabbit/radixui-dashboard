/**
 * @file NotFound.tsx
 * @description This file defines the 404 Not Found error page component.
 * It is displayed when a user navigates to a route that does not exist.
 * It provides a clear error message, a search bar (mock functionality),
 * links to popular pages, and navigation options to go back or to the dashboard.
 */
import { Link } from 'react-router-dom'
import { Container, Flex, Heading, Text, Button, TextField, Card, Box } from '@radix-ui/themes'
import { MagnifyingGlassIcon, HomeIcon, FileTextIcon, PersonIcon, GearIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

/**
 * @typedef PopularLink
 * @description Defines the structure for a popular link item.
 * @property {string} title - The display text for the link.
 * @property {string} href - The URL path for the link.
 * @property {JSX.Element} icon - An icon component to display next to the link title.
 */
type PopularLink = {
  title: string;
  href: string;
  icon: JSX.Element;
};

/**
 * @function NotFound
 * @description A component that renders the 404 Page Not Found error page.
 * It includes a search bar (with mock submission logic), a list of popular navigation links,
 * and options to return to the dashboard or the previous page.
 * @returns {JSX.Element} The rendered 404 Not Found page.
 */
export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input

  /**
   * @const popularLinks
   * @description An array of `PopularLink` objects representing common pages users might want to navigate to.
   */
  const popularLinks: PopularLink[] = [
    { title: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
    { title: 'Profile', href: '/dashboard/profile', icon: <PersonIcon /> },
    { title: 'Settings', href: '/dashboard/settings', icon: <GearIcon /> },
    { title: 'Forms', href: '/dashboard/forms', icon: <FileTextIcon /> }
  ];

  /**
   * @function handleSearchSubmit
   * @description Handles the submission of the search form.
   * Currently logs the search query to the console.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual search functionality or redirect to a search results page.
    console.log('Search submitted for:', searchQuery);
    // Example: navigate(`/search?q=${searchQuery}`);
  };

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
          <form onSubmit={handleSearchSubmit}>
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