import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation } from '../../store/api/commonSlice';

const validationSchema = Yup.object({
  fee_type: Yup.string()
    .required('Fee type is required')
    .oneOf(['DEPOSIT', 'WITHDRAW'], 'Fee type must be either DEPOSIT or WITHDRAW'),
  fee: Yup.number()
    .required('Fee amount is required')
    .min(0, 'Fee amount must be a positive number')
});

export default function AddTransactionFee() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();

  const initialValues = {
    fee_type: 'DEPOSIT',
    fee: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Convert fee to number
      values.fee = Number(values.fee);
      
      await postApi({
        end_point: 'transaction-fees',
        body: values
      }).unwrap();

      toast.success('Transaction fee added successfully');
      navigate('/transaction-fees');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add transaction fee');
      console.error('Error adding transaction fee:', error);
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
          <Link to="/transaction-fees" className="flex items-center hover:text-gray-700 transition">
            Transaction Fees
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Add Transaction Fee</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Transaction Fee</h1>
        <p className="text-gray-600 mt-1">Create a new transaction fee for deposits or withdrawals</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <Field
                    as="select"
                    name="fee_type"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="DEPOSIT">Deposit</option>
                    <option value="WITHDRAW">Withdraw</option>
                  </Field>
                  <ErrorMessage name="fee_type" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount</label>
                  <Field
                    type="number"
                    name="fee"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter fee amount"
                    min="0"
                    step="0.01"
                  />
                  <ErrorMessage name="fee" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/transaction-fees')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Transaction Fee'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
