"use client"

import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowUpRight, Bell, BellRing, X } from "lucide-react"
import { useState, useEffect } from "react"
import { playNotificationSound } from "../../lib/gosense-data"

export const NewsSection = ({ darkMode }: { darkMode: boolean }) => {
  interface NewsItem {
    id: string
    title: string
    source: string
    time: string
    impact: 'high' | 'medium' | 'low'
    isNew?: boolean
  }

  const [news, setNews] = useState<NewsItem[]>([])
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [currentAlert, setCurrentAlert] = useState<NewsItem | null>(null)

  // Simulate real-time news updates
  useEffect(() => {
    // Initial news load
    const initialNews: NewsItem[] = [
      {
        id: '1',
        title: 'NVIDIA announces new AI chip with 2x performance',
        source: 'Tech News',
        time: '2h ago',
        impact: 'high' as const
      },
      {
        id: '2',
        title: 'AI industry growth exceeds expectations',
        source: 'Financial Times',
        time: '5h ago',
        impact: 'medium' as const
      },
      {
        id: '3',
        title: 'New data center partnership announced',
        source: 'Data Center Weekly',
        time: '1d ago',
        impact: 'low' as const
      }
    ]
    setNews(initialNews)

    // Simulate real-time news updates
    const newsIntervals = [
      {
        time: 30000, // 30 seconds
        news: {
          id: '4',
          title: 'Breaking: NVIDIA stock surges 5% on strong earnings report',
          source: 'Market Watch',
          time: 'Just now',
          impact: 'high' as const,
          isNew: true
        }
      },
      {
        time: 90000, // 1.5 minutes
        news: {
          id: '5',
          title: 'New AI regulations could impact tech sector growth',
          source: 'Wall Street Journal',
          time: 'Just now',
          impact: 'medium' as const,
          isNew: true
        }
      }
    ]

    const timers = newsIntervals.map(item => {
      return setTimeout(() => {
        setNews(prevNews => [
          { ...item.news, time: 'Just now' },
          ...prevNews.filter(n => n.id !== item.news.id)
        ])
        
        // Only show notification for high impact news
        if (item.news.impact === 'high') {
          setCurrentAlert(item.news)
          setShowNotification(true)
          playNotificationSound()
          
          // Auto-hide notification after 10 seconds
          setTimeout(() => {
            setShowNotification(false)
          }, 10000)
        }
      }, item.time)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  const impactColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  // Close notification
  const handleCloseNotification = () => {
    setShowNotification(false)
  }

  // Mark all news as read
  const markAllAsRead = () => {
    setNews(prevNews => 
      prevNews.map(item => ({
        ...item,
        isNew: false
      }))
    )
  }

  return (
    <div className="relative">
      {/* Notification Alert */}
      {showNotification && currentAlert && (
        <div className="fixed top-4 right-4 z-50 w-80">
          <Card className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'}`}>
                    Breaking News
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Just now • {currentAlert.source}
                  </span>
                </div>
                <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentAlert.title}
                </h4>
              </div>
              <button 
                onClick={handleCloseNotification}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      )}

      <Card className={`p-6 ${darkMode ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Market News & Alerts
            </h3>
            {news.some(item => item.isNew) && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm flex items-center gap-1"
            onClick={markAllAsRead}
          >
            <BellRing className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      
        <div className="space-y-4">
          {news.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-lg border ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} transition-colors cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      {item.isNew && (
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? impactColors[item.impact].replace('text-', 'text-').replace('bg-', 'bg-opacity-20 ') : impactColors[item.impact]}`}>
                        {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)} Impact
                      </span>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.time} • {item.source}
                    </span>
                  </div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Price Alerts
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Get notified about significant price movements
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Set Alert
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default NewsSection
