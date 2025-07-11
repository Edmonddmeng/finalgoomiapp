"use client"

import { useState } from "react"
import { Moon, Sun, Bell, Shield, User, Palette, Globe, HelpCircle, LogOut } from "lucide-react"

export function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    achievements: true,
    weeklyReports: false,
    communityUpdates: true
  })
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and app settings
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">alex.j@example.com</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Update
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Username</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@alexjohnson</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="text-purple-600 dark:text-purple-400" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="pt-4">
            <p className="font-medium text-gray-900 dark:text-white mb-3">Theme Color</p>
            <div className="flex gap-3">
              {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-orange-500'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full ${color} ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600 transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-yellow-600 dark:text-yellow-400" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {key === 'taskReminders' && 'Task Reminders'}
                  {key === 'achievements' && 'Achievement Alerts'}
                  {key === 'weeklyReports' && 'Weekly Progress Reports'}
                  {key === 'communityUpdates' && 'Community Updates'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'taskReminders' && 'Get notified about upcoming tasks'}
                  {key === 'achievements' && 'Celebrate your accomplishments'}
                  {key === 'weeklyReports' && 'Receive weekly summary emails'}
                  {key === 'communityUpdates' && 'Stay updated with community posts'}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-green-600 dark:text-green-400" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <button className="w-full text-left flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg px-3 -mx-3 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</span>
            <span className="text-sm text-green-600 dark:text-green-400">Enabled</span>
          </button>
          
          <button className="w-full text-left flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg px-3 -mx-3 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">Privacy Settings</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Manage</span>
          </button>
          
          <button className="w-full text-left flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg px-3 -mx-3 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">Data Export</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Download</span>
          </button>
        </div>
      </div>

      {/* Other Options */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 py-3 px-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Globe className="text-gray-600 dark:text-gray-400" size={20} />
            <span className="font-medium text-gray-900 dark:text-white">Language & Region</span>
          </button>
          
          <button className="w-full flex items-center gap-3 py-3 px-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <HelpCircle className="text-gray-600 dark:text-gray-400" size={20} />
            <span className="font-medium text-gray-900 dark:text-white">Help & Support</span>
          </button>
          
          <button className="w-full flex items-center gap-3 py-3 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group">
            <LogOut className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" size={20} />
            <span className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Version 1.0.0 • © 2024 Goomi
        </p>
      </div>
    </div>
  )
}