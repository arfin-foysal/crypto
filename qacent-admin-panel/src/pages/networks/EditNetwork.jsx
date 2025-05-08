import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGetApiWithIdQuery, useUpdateApiMutation, useGetApiQuery } from '../../store/api/commonSlice';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  currency_id: Yup.string()
    .required('Currency is required'),
  order: Yup.number()
    .integer('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .required('Order is required'),
  enable_extra_field: Yup.boolean(),
  status: Yup.string()
    .oneOf(['ACTIVE', 'FROZEN'])
    .default('ACTIVE')
});

export default function EditNetwork() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: networkData, isLoading: isLoadingNetwork, isError: isErrorNetwork } = useGetApiWithIdQuery([
    'networks',
    id,
  ]);

  // Fetch active currencies for dropdown
  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetApiQuery({
    url: 'currencies/dropdown/active'
  });

  const [updateNetwork] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    name: '',
    currency_id: '',
    order: '',
    enable_extra_field: false,
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (networkData?.data) {
      const network = networkData.data;
      setInitialValues({
        name: network.name || '',
        currency_id: network.currency_id || '',
        order: network.order || '',
        enable_extra_field: network.enable_extra_field || false,
        status: network.status || 'ACTIVE'
      });
    }
  }, [networkData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Compare with initial values and only send changed fields
      const originalValues = networkData?.data || {};
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

      await updateNetwork({
        end_point: `networks/${id}`,
        body: values
      }).unwrap();

      toast.success('Network updated successfully');
      navigate('/networks');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update network');
      console.error('Error updating network:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingNetwork) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading network data...</p>
        </div>
      </div>
    );
  }

  if (isErrorNetwork) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading network data. Please try again later.</p>
        <button
          onClick={() => navigate('/networks')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Networks
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
          <Link to="/networks" className="flex items-center hover:text-gray-700 transition">
            Networks
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit Network</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Network</h1>
        <p className="text-gray-600 mt-1">Update network information in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter network name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <Field
                    as="select"
                    name="currency_id"
                    className="w-full p-2 border rounded-lg"
                    disabled={isLoadingCurrencies}
                  >
                    <option value="">Select Currency</option>
                    {currenciesData?.data?.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.name} ({currency.code})
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="currency_id" component="div" className="text-sm text-red-500 mt-1" />
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

                <div className="flex items-center mt-4">
                  <Field
                    type="checkbox"
                    name="enable_extra_field"
                    id="enable_extra_field"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_extra_field" className="ml-2 block text-sm text-gray-700">
                    Enable Extra Field
                  </label>
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
                  onClick={() => navigate('/networks')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Network'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
