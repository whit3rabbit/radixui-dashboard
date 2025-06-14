import { Grid, Card, Flex, Heading, Text, Badge, Box, Button } from '@radix-ui/themes'
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@radix-ui/react-icons'
import Chart from '../../components/Chart'

export default function Dashboard() {
  const revenueData = [
    {
      name: 'Revenue',
      data: [31, 40, 28, 51, 42, 109, 100, 91, 80, 70, 95, 110]
    }
  ]

  const userGrowthData = [
    {
      name: 'Users',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 140, 180]
    }
  ]

  const salesData = [
    {
      name: 'Sales',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80]
    }
  ]

  const categoryData = [
    {
      name: 'Categories',
      data: [44, 35, 41, 17, 15]
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
  isPositive: boolean
  description: string
}

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