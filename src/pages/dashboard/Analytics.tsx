/**
 * @file Analytics.tsx
 * @description This file defines the Analytics page component for the dashboard.
 * It displays various charts and key performance indicators (KPIs) related to
 * website traffic, conversions, revenue, and product performance.
 * All data displayed is currently mock data.
 */
import {
  Box,
  Heading,
  Grid,
  Card,
  Flex,
  Text,
  Select,
  Badge,
  Separator
} from '@radix-ui/themes'
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  BarChartIcon,
  PersonIcon,
  CubeIcon,
  ReaderIcon
} from '@radix-ui/react-icons'
import Chart from '../../components/Chart' // Reusable Chart component

/**
 * @function Analytics
 * @description The main component for the Analytics page.
 * It renders various statistical cards and charts to visualize business data.
 * Currently uses mock data for demonstration.
 * @returns {JSX.Element} The rendered Analytics page.
 */
export default function Analytics() {
  // TODO: Replace all mock data with actual data fetched from an API or data source.

  /**
   * @const trafficData
   * @description Mock data for traffic sources chart (e.g., Direct, Organic, Referral).
   */
  const trafficData = [
    {
      name: 'Direct',
      data: [4344, 5500, 4100, 6700, 2200, 4300, 7100]
    },
    {
      name: 'Organic',
      data: [2444, 3300, 3100, 2700, 1200, 2300, 3100]
    },
    {
      name: 'Referral',
      data: [1444, 1300, 1100, 1700, 1200, 1300, 1100]
    }
  ]

  /**
   * @const conversionData
   * @description Mock data for the conversion rate chart.
   */
  const conversionData = [
    {
      name: 'Conversion Rate', // Represents the percentage of visitors who complete a desired action
      data: [2.1, 2.3, 2.8, 3.1, 2.9, 3.4, 3.8] // Example: daily conversion rates
    }
  ]

  /**
   * @const revenueByCategory
   * @description Mock data for the revenue by category pie chart.
   * Each element in `data` corresponds to a category in `categories`.
   */
  const revenueByCategory = [
    {
      name: 'Revenue', // Series name
      data: [44000, 55000, 41000, 67000, 22000] // Example revenue for each category
    }
  ]

  /**
   * @const topProducts
   * @description Mock data for the list of top-performing products.
   * Includes product name, sales count, total revenue, and growth percentage.
   */
  const topProducts = [
    { name: 'Wireless Headphones', sales: 1234, revenue: 123340, growth: 12.5 },
    { name: 'Smart Watch', sales: 892, revenue: 222908, growth: -5.2 }, // Negative growth example
    { name: 'Running Shoes', sales: 756, revenue: 67944, growth: 23.1 },
    { name: 'Laptop Backpack', sales: 634, revenue: 31666, growth: 8.7 },
    { name: 'Bluetooth Speaker', sales: 521, revenue: 41659, growth: 15.3 }
  ]

  /**
   * @const metrics
   * @description Mock data for key performance indicators (KPIs) displayed in stat cards.
   * Includes title, value, percentage change, positive/negative status, and an icon.
   */
  const metrics = [
    {
      title: 'Page Views', // Total number of pages viewed
      value: '284,312',
      change: '+12.5%',
      isPositive: true,
      icon: <BarChartIcon />
    },
    {
      title: 'Unique Visitors',
      value: '142,873',
      change: '+8.2%',
      isPositive: true,
      icon: <PersonIcon />
    },
    {
      title: 'Avg. Session Duration',
      value: '3m 42s',
      change: '-5.1%',
      isPositive: false,
      icon: <ReaderIcon />
    },
    {
      title: 'Bounce Rate',
      value: '42.3%', // Percentage of single-page sessions
      change: '-2.1%', // Negative change is good for bounce rate
      isPositive: true, // Interpreted as a positive outcome (lower bounce rate)
      icon: <CubeIcon />
    }
  ]

  /**
   * @const days
   * @description Labels for the x-axis of time-based charts (e.g., days of the week).
   */
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  /**
   * @const categories
   * @description Labels for categories in charts (e.g., product categories for revenue pie chart).
   */
  const categories = ['Electronics', 'Footwear', 'Accessories', 'Sports', 'Appliances']

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="7" mb="2">Analytics</Heading>
          <Text color="gray">Track your business performance and metrics</Text>
        </Box>
        <Select.Root defaultValue="7days">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="today">Today</Select.Item>
            <Select.Item value="yesterday">Yesterday</Select.Item>
            <Select.Item value="7days">Last 7 days</Select.Item>
            <Select.Item value="30days">Last 30 days</Select.Item>
            <Select.Item value="90days">Last 90 days</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Key Metrics */}
      <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4" mb="6">
        {metrics.map((metric, index) => (
          <Card key={index} size="3">
            <Flex justify="between" align="start">
              <Box>
                <Text size="2" color="gray" weight="medium" mb="1">
                  {metric.title}
                </Text>
                <Heading size="6" mb="2">{metric.value}</Heading>
                <Flex align="center" gap="2">
                  <Badge color={metric.isPositive ? "green" : "red"} variant="soft" size="1">
                    {metric.isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {metric.change}
                  </Badge>
                  <Text size="1" color="gray">vs last period</Text>
                </Flex>
              </Box>
              <Box
                p="2" // padding: '8px'
                radius="3" // borderRadius: '6px'
                style={{
                  backgroundColor: 'var(--gray-3)', // Radix variable, fine in style
                }}
              >
                {metric.icon}
              </Box>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Traffic Sources */}
      <Grid columns={{ initial: "1", lg: "2" }} gap="4" mb="6">
        <Card size="3">
          <Heading size="4" mb="4">Traffic Sources</Heading>
          <Chart
            type="area"
            series={trafficData}
            height={300}
            options={{
              xaxis: {
                categories: days
              },
              stroke: {
                curve: 'smooth'
              },
              fill: {
                type: 'gradient',
                gradient: {
                  opacityFrom: 0.6,
                  opacityTo: 0.1
                }
              }
            }}
          />
        </Card>

        <Card size="3">
          <Heading size="4" mb="4">Conversion Rate</Heading>
          <Chart
            type="line"
            series={conversionData}
            height={300}
            options={{
              xaxis: {
                categories: days
              },
              yaxis: {
                labels: {
                  formatter: (value: number) => `${value}%`
                }
              },
              stroke: {
                curve: 'smooth',
                width: 3
              },
              markers: {
                size: 5
              }
            }}
          />
        </Card>
      </Grid>

      {/* Revenue by Category and Top Products */}
      <Grid columns={{ initial: "1", lg: "3" }} gap="4">
        <Card size="3">
          <Heading size="4" mb="4">Revenue by Category</Heading>
          <Chart
            type="pie"
            series={revenueByCategory[0].data}
            height={280}
            options={{
              labels: categories,
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }}
          />
        </Card>

        <Card size="3" style={{ gridColumn: 'span 2' }}>
          <Heading size="4" mb="4">Top Products</Heading>
          <Box>
            {topProducts.map((product, index) => (
              <Box key={index}>
                {index > 0 && <Separator my="3" />}
                <Flex justify="between" align="center">
                  <Box>
                    <Text size="2" weight="medium">{product.name}</Text>
                    <Text size="1" color="gray">{product.sales} sales</Text>
                  </Box>
                  <Flex align="center" gap="3">
                    <Text size="2" weight="medium">${product.revenue.toLocaleString()}</Text>
                    <Badge 
                      color={product.growth > 0 ? "green" : "red"} 
                      variant="soft"
                      size="1"
                    >
                      {product.growth > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      {Math.abs(product.growth)}%
                    </Badge>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>
    </Box>
  )
}