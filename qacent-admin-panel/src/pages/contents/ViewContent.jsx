import { useParams, Link } from 'react-router-dom';
import { useGetApiWithIdQuery } from '../../store/api/commonSlice';
import { HomeIcon, PencilIcon } from '@heroicons/react/24/outline';
import './rich-text.css';

export default function ViewContent() {
  const { id } = useParams();
  const { data: response, isLoading, isError } = useGetApiWithIdQuery(['contents', id]);
  const content = response?.data;

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500">Error loading content. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm font-medium">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
          <HomeIcon className="h-4 w-4 inline mr-1" />
          Dashboard
        </Link>
        <span className="text-gray-400">/</span>
        <Link to="/contents" className="text-gray-500 hover:text-gray-700">
          Contents
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">View Content</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{content.name}</h1>
          <p className="text-gray-600 mt-1">Content details</p>
        </div>
        <Link
          to={`/contents/edit/${id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit Content
        </Link>
      </div>

      {/* Content Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Content Information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{content.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(content.status)}`}>
                  {content.status}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(content.created_at).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(content.updated_at).toLocaleString()}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 prose max-w-none">
                {content.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: content.description }}
                    className="rich-text-content border p-4 rounded-lg bg-white"
                  />
                ) : (
                  <p className="text-gray-500 italic">No description provided.</p>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
