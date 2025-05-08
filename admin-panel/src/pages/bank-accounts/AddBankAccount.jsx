import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation, useGetApiQuery } from '../../store/api/commonSlice';

const validationSchema = Yup.object({
  bank_id: Yup.string()
    .required('Bank is required'),
  user_id: Yup.string(),
  account_number: Yup.string()
    .required('Account number is required'),
  is_open: Yup.boolean()
    .default(true)
});

export default function AddBankAccount() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();

  // Fetch banks for dropdown
  const { data: banksData, isLoading: isLoadingBanks } = useGetApiQuery({
    url: 'banks/dropdown/active'
  });

  // Fetch users for dropdown
  const { data: usersData, isLoading: isLoadingUsers } = useGetApiQuery({
    url: 'users/dropdown/active'
  });

  const initialValues = {
    bank_id: '',
    user_id: '',
    account_number: '',
    is_open: true
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // If user_id is empty string, set it to null
      if (values.user_id === '') {
        values.user_id = null;
      }

      await postApi({
        end_point: 'bank-accounts',
        body: values
      }).unwrap();

      toast.success('Bank account added successfully');
      navigate('/bank-accounts');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add bank account');
      console.error('Error adding bank account:', error);
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
          <Link to="/bank-accounts" className="flex items-center hover:text-gray-700 transition">
            Bank Accounts
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Add Bank Account</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Bank Account</h1>
        <p className="text-gray-600 mt-1">Create a new bank account in the system</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <Field
                    as="select"
                    name="bank_id"
                    className="w-full p-2 border rounded-lg"
                    disabled={isLoadingBanks}
                  >
                    <option value="">Select Bank</option>
                    {banksData?.data?.map(bank => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="bank_id" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User (Optional)</label>
                  <Field
                    as="select"
                    name="user_id"
                    className="w-full p-2 border rounded-lg"
                    disabled={isLoadingUsers}
                  >
                    <option value="">No User</option>
                    {usersData?.data?.map(user => (
                      <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
                    ))}
                  </Field>
                  <ErrorMessage name="user_id" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <Field
                    type="text"
                    name="account_number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter account number"
                  />
                  <ErrorMessage name="account_number" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="is_open"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Account is open
                    </label>
                  </div>
                  <ErrorMessage name="is_open" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/bank-accounts')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingBanks || isLoadingUsers}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Bank Account'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
