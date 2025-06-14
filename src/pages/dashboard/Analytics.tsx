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
import Chart from '../../components/Chart'

export default function Analytics() {
  // Mock data for various analytics
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

  const conversionData = [
    {
      name: 'Conversion Rate',
      data: [2.1, 2.3, 2.8, 3.1, 2.9, 3.4, 3.8]
    }
  ]

  const revenueByCategory = [
    {
      name: 'Revenue',
      data: [44, 55, 41, 67, 22]
    }
  ]

  const topProducts = [
    { name: 'Wireless Headphones', sales: 1234, revenue: 123340, growth: 12.5 },
    { name: 'Smart Watch', sales: 892, revenue: 222908, growth: -5.2 },
    { name: 'Running Shoes', sales: 756, revenue: 67944, growth: 23.1 },
    { name: 'Laptop Backpack', sales: 634, revenue: 31666, growth: 8.7 },
    { name: 'Bluetooth Speaker', sales: 521, revenue: 41659, growth: 15.3 }
  ]

  const metrics = [
    {
      title: 'Page Views',
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
      value: '42.3%',
      change: '-2.1%',
      isPositive: true,
      icon: <CubeIcon />
    }
  ]

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
                style={{
                  padding: '8px',
                  backgroundColor: 'var(--gray-3)',
                  borderRadius: '6px'
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