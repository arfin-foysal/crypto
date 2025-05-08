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
  ach_routing_no: Yup.string()
    .max(255, 'ACH routing number must be less than 255 characters'),
  wire_routing_no: Yup.string()
    .max(255, 'Wire routing number must be less than 255 characters'),
  sort_code: Yup.string()
    .max(255, 'Sort code must be less than 255 characters'),
  swift_code: Yup.string()
    .max(255, 'SWIFT code must be less than 255 characters'),
  address: Yup.string()
    .max(200, 'Address must be less than 200 characters'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  account_type: Yup.string()
    .default('CHECKING'),
  status: Yup.string()
    .oneOf(['PENDING', 'ACTIVE', 'FROZEN'])
    .default('PENDING')
});

export default function EditBank() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bankData, isLoading: isLoadingBank, isError: isErrorBank } = useGetApiWithIdQuery([
    'banks',
    id,
  ]);

  // Fetch active currencies for dropdown
  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetApiQuery({
    url: 'currencies/dropdown/active'
  });

  const [updateBank] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    name: '',

    currency_id: '',
    ach_routing_no: '',
    wire_routing_no: '',
    sort_code: '',
    swift_code: '',
    address: '',
    description: '',
    account_type: 'CHECKING',
    status: 'PENDING'
  });

  useEffect(() => {
    if (bankData?.data) {
      const bank = bankData.data;
      setInitialValues({
        name: bank.name || '',

        currency_id: bank.currency_id || '',
        ach_routing_no: bank.ach_routing_no || '',
        wire_routing_no: bank.wire_routing_no || '',
        sort_code: bank.sort_code || '',
        swift_code: bank.swift_code || '',
        address: bank.address || '',
        description: bank.description || '',
        account_type: bank.account_type || '',
        status: bank.status || 'PENDING'
      });
    }
  }, [bankData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Compare with initial values and only send changed fields
      const originalValues = bankData?.data || {};
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

      await updateBank({
        end_point: `banks/${id}`,
        body: values
      }).unwrap();

      toast.success('Bank updated successfully');
      navigate('/banks');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update bank');
      console.error('Error updating bank:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingBank) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isErrorBank) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading bank data. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/banks')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Banks
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
          <Link to="/banks" className="flex items-center hover:text-gray-700 transition">
            Banks
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit Bank</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Bank</h1>
        <p className="text-gray-600 mt-1">Update bank information in the system</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter bank name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <Field
                    as="select"
                    name="account_type"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="CHECKING">Checking</option>
                    {/* <option value="SAVINGS">Savings</option>
                    <option value="BUSINESS">Business</option>
                    <option value="CREDIT">Credit</option> */}
                  </Field>
                  <ErrorMessage name="account_type" component="div" className="text-sm text-red-500 mt-1" />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="FROZEN">Frozen</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-sm text-red-500 mt-1" />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ACH Routing Number</label>
                  <Field
                    type="text"
                    name="ach_routing_no"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter ACH routing number"
                  />
                  <ErrorMessage name="ach_routing_no" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wire Routing Number</label>
                  <Field
                    type="text"
                    name="wire_routing_no"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter wire routing number"
                  />
                  <ErrorMessage name="wire_routing_no" component="div" className="text-sm text-red-500 mt-1" />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Code</label>
                  <Field
                    type="text"
                    name="sort_code"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter sort code"
                  />
                  <ErrorMessage name="sort_code" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
                  <Field
                    type="text"
                    name="swift_code"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter SWIFT code"
                  />
                  <ErrorMessage name="swift_code" component="div" className="text-sm text-red-500 mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Field
                    type="text"
                    name="address"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter bank address"
                  />
                  <ErrorMessage name="address" component="div" className="text-sm text-red-500 mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter bank description"
                    rows="3"
                  />
                  <ErrorMessage name="description" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/banks')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingCurrencies}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Bank'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
