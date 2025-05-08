import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation, useGetApiQuery } from '../../store/api/commonSlice';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(50).required('Name is required'),
  currency_id: Yup.string().required('Currency is required'),
  ach_routing_no: Yup.string().max(255),
  wire_routing_no: Yup.string().max(255),
  sort_code: Yup.string().max(255),
  swift_code: Yup.string().max(255),
  address: Yup.string().max(200),
  description: Yup.string().max(500),
  account_type: Yup.string().oneOf(['CHECKING', 'SAVINGS', 'BUSINESS', 'CREDIT']).default('CHECKING'),
  status: Yup.string().oneOf(['PENDING', 'ACTIVE', 'FROZEN']).default('PENDING')
});

export default function AddBank() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('');

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetApiQuery({
    url: 'currencies/dropdown/active'
  });

  const initialValues = {
    name: '',
    address: '',
    description: '',
    currency_id: '',
    ach_routing_no: '',
    wire_routing_no: '',
    sort_code: '',
    swift_code: '',
    account_type: 'CHECKING',
    status: 'PENDING'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postApi({
        end_point: 'banks',
        body: values
      }).unwrap();

      toast.success('Bank added successfully');
      navigate('/banks');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add bank');
      console.error('Error adding bank:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCurrencyChange = (e, setFieldValue) => {
    const selectedId = e.target.value;
    setFieldValue('currency_id', selectedId);

    const selectedCurrency = currenciesData?.data?.find((c) => c.id === selectedId);
    setSelectedCurrencyCode(selectedCurrency?.code || '');
  };

  return (
    <div className="p-6">
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
          <span className="text-gray-700">Add Bank</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Bank</h1>
        <p className="text-gray-600 mt-1">Create a new bank in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <Field
                    as="select"
                    name="currency_id"
                    className="w-full p-2 border rounded-lg"
                    disabled={isLoadingCurrencies}
                    onChange={(e) => handleCurrencyChange(e, setFieldValue)}
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

                {['USD'].includes(selectedCurrencyCode) ? (
                  <>
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
                  </>
                ) : ['EUR', 'EU', 'GBP'].includes(selectedCurrencyCode) ? (
                  <>

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
                  </>
                ) : null}

                {/* Common Fields */}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Address</label>
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
                  {isSubmitting ? 'Adding...' : 'Add Bank'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
