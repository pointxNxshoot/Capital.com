import { Building2, Search, Filter } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-results' | 'no-saved' | 'no-companies'
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ 
  type, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: Search,
          title: title || 'No companies found',
          description: description || 'Try adjusting your search criteria or filters to find more companies.',
        }
      case 'no-saved':
        return {
          icon: Building2,
          title: title || 'No saved companies',
          description: description || 'Save companies you\'re interested in to view them here.',
        }
      case 'no-companies':
        return {
          icon: Building2,
          title: title || 'No companies yet',
          description: description || 'Be the first to list your company for equity investment.',
        }
      default:
        return {
          icon: Building2,
          title: title || 'Nothing here',
          description: description || 'There\'s nothing to display at the moment.',
        }
    }
  }

  const { icon: Icon, title: defaultTitle, description: defaultDescription } = getContent()

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description || defaultDescription}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
