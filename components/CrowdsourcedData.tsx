'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

interface Stat {
  label: string
  value: number
  change: number
  icon: React.ElementType
  tooltip: string
}

interface TrendData {
  name: string;
  reports: number;
}

interface Incident {
  type: string
  count: number
}

const timeFilters = ['Last Week', 'Last Month', 'Last 3 Months', 'Last Year']

export default function CrowdsourcedData() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Active Users",
      value: 0,
      change: 0,
      icon: Users,
      tooltip: "Number of users actively using the app in the selected time period"
    },
    {
      label: "Safety Reports",
      value: 0,
      change: 0,
      icon: TrendingUp,
      tooltip: "Total number of safety reports submitted by users"
    },
    {
      label: "Incidents Reported",
      value: 0,
      change: 0,
      icon: AlertTriangle,
      tooltip: "Number of incidents reported by users in the selected time period"
    }
  ])
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Last Week')
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMockData = () => {
    // Simulating API call with setTimeout
    setTimeout(() => {
      const mockData = {
        activeUsers: Math.floor(Math.random() * 10000) + 5000,
        activeUsersChange: Math.floor(Math.random() * 20) - 10,
        safetyReports: Math.floor(Math.random() * 1000) + 500,
        safetyReportsChange: Math.floor(Math.random() * 30) - 15,
        incidentsReported: Math.floor(Math.random() * 200) + 100,
        incidentsReportedChange: Math.floor(Math.random() * 25) - 12,
        dailyTrend: Array.from({ length: 7 }, (_, i) => ({
          name: `Day ${i + 1}`,
          reports: Math.floor(Math.random() * 50) + 10
        })),
        incidentBreakdown: [
          { type: 'Theft', count: Math.floor(Math.random() * 50) + 20 },
          { type: 'Harassment', count: Math.floor(Math.random() * 40) + 15 },
          { type: 'Assault', count: Math.floor(Math.random() * 30) + 10 },
          { type: 'Other', count: Math.floor(Math.random() * 20) + 5 }
        ]
      };

      setStats([
        {
          ...stats[0],
          value: mockData.activeUsers,
          change: mockData.activeUsersChange
        },
        {
          ...stats[1],
          value: mockData.safetyReports,
          change: mockData.safetyReportsChange
        },
        {
          ...stats[2],
          value: mockData.incidentsReported,
          change: mockData.incidentsReportedChange
        }
      ]);

      setTrendData(mockData.dailyTrend);
      setIncidents(mockData.incidentBreakdown);
      setIsLoading(false);
    }, 1000); // Simulating 1 second delay
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMockData();
  }, [selectedTimeFilter]);

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-t-2 border-orange-500 rounded-full"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">
          {t('crowdsourcedData')}
        </CardTitle>
        <Select value={selectedTimeFilter} onValueChange={setSelectedTimeFilter}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timeFilters.map((filter) => (
              <SelectItem key={filter} value={filter}>{filter}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-5 w-5 text-orange-500" />
                  <h3 className="text-sm text-gray-400">{stat.label}</h3>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stat.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-2xl font-bold text-white">
                {stat.value.toLocaleString()}
              </div>
              <div className={`text-sm ${
                stat.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}% {selectedTimeFilter.toLowerCase()}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Safety Reports Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="reports" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Incident Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-semibold">{incident.type}</h4>
                <p className="text-2xl font-bold text-orange-500">{incident.count}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-orange-500 text-white p-4 rounded-lg"
        >
          <h3 className="font-semibold mb-2">Important Update</h3>
          <p>Incidents have increased by {Math.abs(stats[2].change)}% in the {selectedTimeFilter.toLowerCase()}. Stay vigilant and report any suspicious activities.</p>
        </motion.div>
      </CardContent>
    </Card>
  )
}

