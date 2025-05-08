import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Editor } from '@tinymce/tinymce-react';
import { useGetApiWithIdQuery, useUpdateApiMutation } from '../../store/api/commonSlice';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  description: Yup.string()
    .max(5000, 'Description must be less than 5000 characters'),
  status: Yup.string()
    .oneOf(['ACTIVE', 'INACTIVE'])
    .default('ACTIVE')
    .required('Status is required')
});

export default function EditContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: contentData, isLoading: isLoadingContent, isError: isErrorContent } = useGetApiWithIdQuery([
    'contents',
    id,
  ]);

  const [updateContent] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (contentData?.data) {
      const content = contentData.data;
      setInitialValues({
        name: content.name || '',
        description: content.description || '',
        status: content.status || 'ACTIVE'
      });
    }
  }, [contentData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateContent({
        end_point: `contents/${id}`,
        body: values
      }).unwrap();
      toast.success('Content updated successfully');
      navigate('/contents');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update content');
      console.error('Content update error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // State to track if editor is loading
  const [editorLoading, setEditorLoading] = useState(true);

  // TinyMCE API key - you should use your own key in production
  const TINY_API_KEY = 's1s4vsfs71p7es1iokxixpcgs3ml1mx3d1x7zgpawblv07sw';

  if (isLoadingContent) {
    return (
      <div className="p-6 flex justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (isErrorContent) {
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
        <span className="text-gray-900">Edit Content</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Content</h1>
        <p className="text-gray-600 mt-1">Update content information</p>
      </div>

      {/* Content Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter content name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="mb-12"> {/* Extra margin to accommodate the editor */}
                    {editorLoading && (
                      <div className="border rounded-lg p-3 bg-gray-50 mb-2">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-300 rounded"></div>
                              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-gray-500 mt-4">Loading editor...</p>
                      </div>
                    )}
                    <Field name="description">
                      {({ field, form }) => (
                        <Editor
                          apiKey={TINY_API_KEY}
                          value={field.value}
                          init={{
                            height: 400,
                            menubar: true,
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                              'bold italic forecolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }}
                          onInit={() => setEditorLoading(false)}
                          onEditorChange={(content) => form.setFieldValue(field.name, content)}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="description" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/contents')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || editorLoading}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Content'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
