import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation } from '../../store/api/commonSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  usd_rate: Yup.number()
    .positive('USD rate must be positive')
    .required('USD rate is required'),
  order: Yup.number()
    .integer('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .required('Order is required'),
  status: Yup.string()
    .oneOf(['ACTIVE', 'FROZEN'])
    .default('ACTIVE')
});

export default function AddCurrency() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();

  const initialValues = {
    name: '',
    usd_rate: '',
    order: '',
    status: 'ACTIVE'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postApi({
        end_point: 'currencies',
        body: values
      }).unwrap();

      toast.success('Currency added successfully');
      navigate('/currencies');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add currency');
      console.error('Error adding currency:', error);
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
          <Link to="/currencies" className="flex items-center hover:text-gray-700 transition">
            Currencies
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Add Currency</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Currency</h1>
        <p className="text-gray-600 mt-1">Create a new cryptocurrency in the system</p>
      </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter currency name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">USD Rate</label>
                  <Field
                    type="number"
                    name="usd_rate"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter USD rate"
                  />
                  <ErrorMessage name="usd_rate" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <Field
                    type="number"
                    name="order"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter display order"
                  />
                  <ErrorMessage name="order" component="div" className="text-sm text-red-500 mt-1" />
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/currencies')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Currency'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
