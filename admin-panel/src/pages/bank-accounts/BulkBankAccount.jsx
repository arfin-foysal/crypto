import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation, useGetApiQuery } from '../../store/api/commonSlice';

const validationSchema = Yup.object({
  bank_id: Yup.string()
    .required('Bank is required'),
  bank_accounts: Yup.string()
    .required('At least one account number is required')
});

export default function BulkBankAccount() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();

  // Fetch banks for dropdown
  const { data: banksData, isLoading: isLoadingBanks } = useGetApiQuery({
    url: 'banks/dropdown/active'
  });

  const initialValues = {
    bank_id: '',
    bank_accounts: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Convert the textarea input to an array of account numbers
      const accountNumbers = values.bank_accounts
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

      if (accountNumbers.length === 0) {
        toast.error('Please enter at least one account number');
        setSubmitting(false);
        return;
      }

      // Prepare the data in the required format
      const requestData = {
        bank_id: values.bank_id,
        bank_accounts: accountNumbers
      };

      await postApi({
        end_point: 'bank-accounts/bulk-create',
        body: requestData
      }).unwrap();

      toast.success('Bank accounts added successfully');
      navigate('/bank-accounts');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add bank accounts');
      console.error('Error adding bank accounts:', error);
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
          <span className="text-gray-700">Bulk Add Bank Accounts</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Add Bank Accounts</h1>
        <p className="text-gray-600 mt-1">Create multiple bank accounts at once</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Numbers (One per line) </label>
                  <Field
                    as="textarea"
                    name="bank_accounts"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter account numbers, one per line"
                    rows="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter each account number on a new line. Empty lines will be ignored.  Ex:
                    <br />
                    811533065028
                    <br />
                    711533065025
                    <br />
                    611533065027
                  </p>
                  <ErrorMessage name="bank_accounts" component="div" className="text-sm text-red-500 mt-1" />
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
                  disabled={isSubmitting || isLoadingBanks}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Bank Accounts'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
