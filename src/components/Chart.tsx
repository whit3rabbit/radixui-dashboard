import { useEffect, useState, memo, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useTheme } from '../lib/theme-context'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ChartProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut'
  series: any[]
  options?: ApexOptions
  height?: number
}

function Chart({ type, series, options = {}, height = 300 }: ChartProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { themeConfig, getSystemTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get the actual theme mode for the chart
  const chartTheme = useMemo(() => {
    if (themeConfig.appearance === 'inherit') {
      return getSystemTheme()
    }
    return themeConfig.appearance
  }, [themeConfig.appearance, getSystemTheme])

  const defaultOptions: ApexOptions = useMemo(() => ({
    chart: {
      type,
      height,
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    theme: {
      mode: chartTheme
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true,
      borderColor: 'var(--gray-6)',
      strokeDashArray: 0,
      position: 'back'
    },
    xaxis: {
      labels: {
        style: {
          colors: 'var(--gray-11)'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--gray-11)'
        }
      }
    },
    legend: {
      labels: {
        colors: 'var(--gray-11)'
      }
    },
    colors: ['var(--blue-9)', 'var(--green-9)', 'var(--orange-9)', 'var(--purple-9)', 'var(--red-9)'],
    ...options
  }), [type, height, chartTheme, options])

  if (!isMounted) {
    return (
      <div style={{ height }}>
        <LoadingSpinner message="Loading chart..." />
      </div>
    )
  }

  return (
    <ReactApexChart
      options={defaultOptions}
      series={series}
      type={type}
      height={height}
    />
  )
}

export default memo(Chart)