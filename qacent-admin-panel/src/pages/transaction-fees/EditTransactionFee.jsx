import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGetApiWithIdQuery, useUpdateApiMutation } from '../../store/api/commonSlice';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  fee_type: Yup.string()
    .required('Fee type is required')
    .oneOf(['DEPOSIT', 'WITHDRAW'], 'Fee type must be either DEPOSIT or WITHDRAW'),
  fee: Yup.number()
    .required('Fee amount is required')
    .min(0, 'Fee amount must be a positive number')
});

export default function EditTransactionFee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: feeData, isLoading: isLoadingFee, isError: isErrorFee } = useGetApiWithIdQuery([
    'transaction-fees',
    id,
  ]);

  const [updateTransactionFee] = useUpdateApiMutation();

  const [initialValues, setInitialValues] = useState({
    fee_type: 'DEPOSIT',
    fee: ''
  });

  useEffect(() => {
    if (feeData?.data) {
      const fee = feeData.data;
      setInitialValues({
        fee_type: fee.fee_type || 'DEPOSIT',
        fee: fee.fee || ''
      });
    }
  }, [feeData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Convert fee to number
      values.fee = Number(values.fee);
      
      // Compare with initial values and only send changed fields
      const originalValues = feeData?.data || {};
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

      await updateTransactionFee({
        end_point: `transaction-fees/${id}`,
        body: values
      }).unwrap();

      toast.success('Transaction fee updated successfully');
      navigate('/transaction-fees');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update transaction fee');
      console.error('Error updating transaction fee:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingFee) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isErrorFee) {
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
                Error loading transaction fee data. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/transaction-fees')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Transaction Fees
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
          <Link to="/transaction-fees" className="flex items-center hover:text-gray-700 transition">
            Transaction Fees
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit Transaction Fee</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Transaction Fee</h1>
        <p className="text-gray-600 mt-1">Update transaction fee information</p>
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
                  {isSubmitting ? 'Updating...' : 'Update Transaction Fee'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
