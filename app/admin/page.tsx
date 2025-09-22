'use client'

import { useState, useEffect } from 'react'
import { Shield, CheckCircle, XCircle, Eye, Search } from 'lucide-react'

interface Company {
  id: string
  name: string
  slug: string
  category: string
  description?: string
  status: 'pending' | 'published' | 'archived'
  createdAt: string
  views: number
}

export default function AdminPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [adminSecret, setAdminSecret] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'archived'>('all')

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin-auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchCompanies()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminSecret === process.env.NEXT_PUBLIC_ADMIN_SECRET || adminSecret === 'eqt-admin-secret-2024') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-auth', 'true')
      fetchCompanies()
    } else {
      alert('Invalid admin secret')
    }
  }

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      // For now, we'll use mock data since we don't have the API set up yet
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'TechFlow Solutions',
          slug: 'techflow-solutions',
          category: 'Technology',
          description: 'AI-powered workflow automation platform for enterprise clients.',
          status: 'published',
          createdAt: '2024-01-15T00:00:00Z',
          views: 245
        },
        {
          id: '2',
          name: 'GreenEnergy Co',
          slug: 'greenenergy-co',
          category: 'Energy',
          description: 'Renewable energy solutions for commercial and residential properties.',
          status: 'pending',
          createdAt: '2024-01-20T00:00:00Z',
          views: 0
        },
        {
          id: '3',
          name: 'MediCare Plus',
          slug: 'medicare-plus',
          category: 'Healthcare',
          description: 'Digital health platform connecting patients with healthcare providers.',
          status: 'pending',
          createdAt: '2024-01-22T00:00:00Z',
          views: 0
        }
      ]
      
      setCompanies(mockCompanies)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (companyId: string, newStatus: 'pending' | 'published' | 'archived') => {
    try {
      // In a real app, this would make an API call
      setCompanies(prev => 
        prev.map(company => 
          company.id === companyId 
            ? { ...company, status: newStatus }
            : company
        )
      )
    } catch (error) {
      console.error('Error updating company status:', error)
    }
  }

  const filteredCompanies = companies.filter(company => 
    filter === 'all' || company.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Eye className="h-4 w-4" />
      case 'archived':
        return <XCircle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600">Enter admin secret to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Secret
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin secret"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="h-8 w-8 mr-3 text-blue-600" />
          Admin Panel
        </h1>
        <p className="text-gray-600 mt-2">Manage company listings and approvals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
          <div className="text-gray-600">Total Companies</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {companies.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {companies.filter(c => c.status === 'published').length}
          </div>
          <div className="text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-600">
            {companies.filter(c => c.status === 'archived').length}
          </div>
          <div className="text-gray-600">Archived</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          </div>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'published', label: 'Published' },
              { key: 'archived', label: 'Archived' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No companies found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                        {getStatusIcon(company.status)}
                        <span className="ml-1 capitalize">{company.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {company.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(company.id, 'published')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(company.id, 'archived')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {company.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(company.id, 'archived')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Archive
                        </button>
                      )}
                      {company.status === 'archived' && (
                        <button
                          onClick={() => handleStatusChange(company.id, 'published')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
