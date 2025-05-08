import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGetApiWithIdQuery, useUpdateApiMutation } from '../../store/api/commonSlice';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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

export default function EditCurrency() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currencyData, isLoading: isLoadingCurrency, isError: isErrorCurrency } = useGetApiWithIdQuery([
    'currencies',
    id,
  ]);

  const [updateCurrency] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    name: '',
    usd_rate: '',
    order: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (currencyData?.data) {
      const currency = currencyData.data;
      setInitialValues({
        name: currency.name || '',
        usd_rate: currency.usd_rate || '',
        order: currency.order || '',
        status: currency.status || 'ACTIVE'
      });
    }
  }, [currencyData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Compare with initial values and only send changed fields
      const originalValues = currencyData?.data || {};
      const changedFields = {};

      // Check which fields have changed
      Object.keys(values).forEach(key => {
        if (values[key] !== originalValues[key]) {
          changedFields[key] = true;
        }
      });

      // Check if any fields were changed
      if (Object.keys(changedFields).length === 0) {
        toast.info('No changes detected');
        return;
      }

      await updateCurrency({
        end_point: `currencies/${id}`,
        body: values
      }).unwrap();

      toast.success('Currency updated successfully');
      navigate('/currencies');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update currency');
      console.error('Error updating currency:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingCurrency) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading currency data...</p>
        </div>
      </div>
    );
  }

  if (isErrorCurrency) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading currency data. Please try again later.</p>
        <button
          onClick={() => navigate('/currencies')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Currencies
        </button>
      </div>
    );
  }

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
          <span className="text-gray-700">Edit Currency</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Currency</h1>
        <p className="text-gray-600 mt-1">Update currency information in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                  {isSubmitting ? 'Updating...' : 'Update Currency'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
