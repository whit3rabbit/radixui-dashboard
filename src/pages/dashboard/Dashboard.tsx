/**
 * @file Dashboard.tsx
 * @description This file defines the main Dashboard page component.
 * It serves as the central overview page, displaying key metrics, charts,
 * and summaries of various aspects of the application or business.
 * All data displayed is currently mock data.
 */
import { Grid, Card, Flex, Heading, Text, Badge, Box, Button } from '@radix-ui/themes'
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@radix-ui/react-icons'
import Chart from '../../components/Chart' // Reusable Chart component

/**
 * @function Dashboard
 * @description The main component for the dashboard overview page.
 * It renders a collection of statistical cards (StatsCard) and charts
 * to provide a high-level summary of data.
 * Currently uses mock data for demonstration.
 * @returns {JSX.Element} The rendered Dashboard page.
 */
export default function Dashboard() {
  // TODO: Replace all mock data with actual data fetched from an API or data source.

  /**
   * @const revenueData
   * @description Mock data for the revenue overview chart.
   * Represents monthly revenue.
   */
  const revenueData = [
    {
      name: 'Revenue', // Series name
      data: [3100, 4000, 2800, 5100, 4200, 10900, 10000, 9100, 8000, 7000, 9500, 11000] // Example monthly revenue
    }
  ]

  /**
   * @const userGrowthData
   * @description Mock data for the user growth chart.
   * Represents new users per month.
   */
  const userGrowthData = [
    {
      name: 'Users', // Series name
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 140, 180] // Example new users per month
    }
  ]

  /**
   * @const salesData
   * @description Mock data for the sales performance chart.
   * Represents number of sales per month.
   */
  const salesData = [
    {
      name: 'Sales', // Series name
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80] // Example sales count per month
    }
  ]

  /**
   * @const categoryData
   * @description Mock data for the categories donut chart.
   * Represents distribution across different categories.
   */
  const categoryData = [
    {
      name: 'Categories', // Series name (though often not directly visible in donut charts)
      data: [44, 35, 41, 17, 15] // Example data for 5 categories
    }
  ]

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Heading size="7">Dashboard Overview</Heading>
        <Button>
          <PlusIcon /> Add Widget
        </Button>
      </Flex>

      {/* Stats Cards */}
      <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4" mb="6">
        <StatsCard
          title="Total Revenue"
          value="$45,231.89"
          change="+20.1%"
          isPositive={true}
          description="from last month"
        />
        <StatsCard
          title="Subscriptions"
          value="+2350"
          change="+180.1%"
          isPositive={true}
          description="from last month"
        />
        <StatsCard
          title="Sales"
          value="+12,234"
          change="+19%"
          isPositive={true}
          description="from last month"
        />
        <StatsCard
          title="Active Now"
          value="+573"
          change="+201"
          isPositive={true}
          description="from last hour"
        />
      </Grid>

      {/* Charts */}
      <Grid columns={{ initial: "1", lg: "2" }} gap="4" mb="6">
        <Card size="3">
          <Flex direction="column" gap="3">
            <Heading size="4">Revenue Overview</Heading>
            <Chart
              type="area"
              series={revenueData}
              height={300}
              options={{
                xaxis: {
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
              }}
            />
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="3">
            <Heading size="4">User Growth</Heading>
            <Chart
              type="line"
              series={userGrowthData}
              height={300}
              options={{
                xaxis: {
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
              }}
            />
          </Flex>
        </Card>
      </Grid>

      <Grid columns={{ initial: "1", lg: "2" }} gap="4">
        <Card size="3">
          <Flex direction="column" gap="3">
            <Heading size="4">Sales Performance</Heading>
            <Chart
              type="bar"
              series={salesData}
              height={300}
              options={{
                xaxis: {
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
              }}
            />
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="3">
            <Heading size="4">Categories</Heading>
            <Chart
              type="donut"
              series={categoryData[0].data}
              height={300}
              options={{
                labels: ['Technology', 'Design', 'Marketing', 'Sales', 'Support']
              }}
            />
          </Flex>
        </Card>
      </Grid>
    </Box>
  )
}

interface StatsCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean;
  description: string;
}

/**
 * @function StatsCard
 * @description A reusable component to display a single statistic with a title, value, change indicator, and description.
 * @param {StatsCardProps} props - The props for the StatsCard component.
 * @returns {JSX.Element} The rendered StatsCard.
 */
function StatsCard({ title, value, change, isPositive, description }: StatsCardProps) {
  return (
    <Card size="3">
      <Flex direction="column" gap="2">
        <Text size="2" color="gray" weight="medium">
          {title}
        </Text>
        <Heading size="6">{value}</Heading>
        <Flex align="center" gap="2">
          <Badge color={isPositive ? "green" : "red"} variant="soft">
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {change}
          </Badge>
          <Text size="1" color="gray">
            {description}
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}