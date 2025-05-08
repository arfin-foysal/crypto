import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useGetApiWithIdQuery, useUpdateApiMutation } from '../../store/api/commonSlice';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Country name is required'),
  code: Yup.string().required('Country code is required').max(2, 'Country code must be 2 characters'),
  order_index: Yup.number().required('Order is required').min(0, 'Order must be a positive number'),
  status: Yup.string().required('Status is required')
});

export default function EditCountry() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: countryData, isLoading, isError } = useGetApiWithIdQuery([
    'countries',
    id,
  ]);

  const [updateCountry] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    name: '',
    code: '',
    order_index: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (countryData?.data) {
      setInitialValues({
        name: countryData.data.name || '',
        code: countryData.data.code || '',
        order_index: countryData.data.order_index || '',
        status: countryData.data.status || 'ACTIVE'
      });
    }
  }, [countryData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateCountry({
        end_point: `countries/${id}`,
        body: values
      }).unwrap();

      toast.success('Country updated successfully');
      navigate('/countries');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update country');
      console.error('Error updating country:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading country data...</p>
        </div>
      </div>
    );
  }

  if (isError || !countryData?.data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading country data. Please try again later.</p>
        <button
          onClick={() => navigate('/countries')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Countries
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
          <Link to="/settings" className="flex items-center hover:text-gray-700 transition">
            Settings
          </Link>
          <span className="mx-2">/</span>
          <Link to="/countries" className="flex items-center hover:text-gray-700 transition">
            Countries
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit Country</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Country</h1>
      </div>

      {/* Edit Country Form */}
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
                  {isSubmitting ? 'Updating...' : 'Update Country'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
