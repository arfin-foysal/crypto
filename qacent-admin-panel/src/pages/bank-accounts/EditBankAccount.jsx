import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGetApiWithIdQuery, useUpdateApiMutation, useGetApiQuery } from '../../store/api/commonSlice';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  bank_id: Yup.string()
    .required('Bank is required'),
  user_id: Yup.string(),
  account_number: Yup.string()
    .required('Account number is required'),
  is_open: Yup.boolean()
    .default(true)
});

export default function EditBankAccount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: accountData, isLoading: isLoadingAccount, isError: isErrorAccount } = useGetApiWithIdQuery([
    'bank-accounts',
    id,
  ]);

  // Fetch banks for dropdown
  const { data: banksData, isLoading: isLoadingBanks } = useGetApiQuery({
    url: 'banks/dropdown/active'
  });

  // Fetch users for dropdown
  const { data: usersData, isLoading: isLoadingUsers } = useGetApiQuery({
    url: 'users/dropdown/active'
  });



  const [updateAccount] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    bank_id: '',
    user_id: '',
    account_number: '',
    is_open: true
  });

  useEffect(() => {
    if (accountData?.data) {
      const account = accountData.data;
      setInitialValues({
        bank_id: account.bank_id || '',
        user_id: account.user_id || '',
        account_number: account.account_number || '',
        is_open: account.is_open
      });
    }
  }, [accountData]);


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // If user_id is empty string, set it to null
      if (values.user_id === '') {
        values.user_id = null;
      }

      // Use all values including account_number
      const dataToUpdate = values;

      // Compare with initial values and only send changed fields
      const originalValues = accountData?.data || {};
      const changedFields = {};

      // Check which fields have changed
      Object.keys(dataToUpdate).forEach(key => {
        // Special handling for user_id to correctly detect changes between null and empty string
        if (key === 'user_id') {
          const originalValue = originalValues[key] || null;
          const newValue = dataToUpdate[key] || null;
          if (String(originalValue) !== String(newValue)) {
            changedFields[key] = true;
          }
        } else if (dataToUpdate[key] !== originalValues[key]) {
          changedFields[key] = true;
        }
      });

      // Check if any fields were changed
      // if (Object.keys(changedFields).length === 0) {
      //   toast.info('No changes detected');
      //   return;
      // }

      // Ensure user_id is explicitly set to null when empty
      if (dataToUpdate.user_id === '') {
        dataToUpdate.user_id = null;
      }

      await updateAccount({
        end_point: `bank-accounts/${id}`,
        body: dataToUpdate
      }).unwrap();

      toast.success('Bank account updated successfully');
      navigate('/bank-accounts');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update bank account');
      console.error('Error updating bank account:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingAccount || isLoadingBanks || isLoadingUsers) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isErrorAccount) {
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
                Error loading bank account data. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/bank-accounts')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Bank Accounts
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
          <Link to="/bank-accounts" className="flex items-center hover:text-gray-700 transition">
            Bank Accounts
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit Bank Account</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Bank Account</h1>
        <p className="text-gray-600 mt-1">Update bank account information in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={
            initialValues
          }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                  >
                    <option value="">No User</option>
                    {usersData?.data?.map(user => (

                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="user_id" component="div" className="text-sm text-red-500 mt-1" />

                  <div>
                    <p className="text-xs text-gray-500 mt-1">
                      Currently assigned: {accountData?.data?.user?.full_name + ' (' + accountData?.data?.user?.email + ')' || 'No user assigned'}
                    </p>
                  </div>

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
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Bank Account'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
