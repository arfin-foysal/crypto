import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation } from '../../store/api/commonSlice';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Country name is required'),
  code: Yup.string().required('Country code is required').max(2, 'Country code must be 2 characters'),
  order_index: Yup.number().required('Order is required').min(0, 'Order must be a positive number'),
  status: Yup.string().required('Status is required')
});

export default function AddCountry() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();

  const initialValues = {
    name: '',
    code: '',
    order_index: '',
    status: 'ACTIVE'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postApi({
        end_point: 'countries',
        body: values
      }).unwrap();

      toast.success('Country added successfully');
      navigate('/countries');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add country');
      console.error('Error adding country:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link to="/" className="flex items-center hover:text-gray-700 transition">
            <HomeIcon className="h-4 w-4 mr-1" />
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/settings" className="flex items-center hover:text-gray-700 transition">
            Settings
          </Link>
          <span className="mx-2">/</span>
          <Link to="/countries" className="flex items-center hover:text-gray-700 transition">
            Countries
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Add Country</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add Country</h1>
      </div>

      {/* Add Country Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter country name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                  <Field
                    type="text"
                    name="code"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter country code (2 characters)"
                    maxLength="2"
                  />
                  <ErrorMessage name="code" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <Field
                    type="number"
                    name="order_index"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter display order"
                    min="0"
                  />
                  <ErrorMessage name="order_index" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="FROZEN">Frozen</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  to="/countries"
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Adding...' : 'Add Country'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
