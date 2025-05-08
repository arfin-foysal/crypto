import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGetApiWithIdQuery, useUpdateApiMutation, useGetApiQuery } from '../../store/api/commonSlice';
import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  // These fields match the backend Joi schema
  full_name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .test('password-check', 'Password is required when changing password', function (value) {
      // If confirmPassword has a value, password is required
      return !this.parent.confirmPassword || (this.parent.confirmPassword && value);
    }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .test('confirm-check', 'Confirm password is required when changing password', function (value) {
      // If password has a value, confirmPassword is required
      return !this.parent.password || (this.parent.password && value);
    }),
  photo: Yup.mixed(),
  phone: Yup.string().nullable(),
  dob: Yup.string().nullable(),
  address: Yup.string().nullable(),
  country_id: Yup.number().nullable(),
  status: Yup.string()
    .oneOf(['PENDING', 'ACTIVE', 'FROZEN', 'SUSPENDED'])
    .default('PENDING'),
  role: Yup.string()
    .oneOf(['ADMIN', 'USER'])
    .default('USER')
});

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetApiWithIdQuery([
    'users',
    id,
  ]);

  // Fetch active countries for dropdown
  const { data: countriesData, isLoading: isLoadingCountries } = useGetApiQuery({
    url: 'countries/dropdown/active'
  });

  const [updateUser] = useUpdateApiMutation();
  const [initialValues, setInitialValues] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    country_id: '',
    status: 'PENDING',
    role: 'USER',
    photo: ''
  });

  useEffect(() => {
    if (user) {
      setInitialValues({
        full_name: user?.data?.full_name || '',
        email: user?.data?.email || '',
        password: '',
        confirmPassword: '',
        phone: user?.data?.phone || '',
        dob: user?.data?.dob || '',
        address: user?.data?.address || '',
        country_id: user?.data?.country_id || '',
        status: user?.data?.status || 'PENDING',
        role: user?.data?.role || 'USER',
        photo: user?.data?.photo || ''
      });
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Compare with initial values and only send changed fields
      const originalValues = user || {};
      const changedFields = {};
      const updatedData = {};

      // Check which fields have changed and match backend schema
      const validFields = ['full_name', 'email', 'phone', 'dob', 'address', 'country_id', 'status', 'role'];

      // First handle regular fields (not password or photo)
      validFields.forEach(key => {
        if (values[key] !== originalValues[key] && values[key] !== '') {
          changedFields[key] = true;
          updatedData[key] = values[key];
        }
      });

      // Handle password separately
      if (values.password && values.password.trim() !== '') {
        changedFields.password = true;
        updatedData.password = values.password;
      }

      // Check if any fields were changed
      if (Object.keys(changedFields).length === 0 && !(values.photo instanceof File)) {
        toast.info('No changes detected');
        return;
      }

      // If we have a photo, use FormData
      if (values.photo instanceof File) {
        const formDataToSend = new FormData();

        // Add all updated fields to FormData
        Object.keys(updatedData).forEach(key => {
          formDataToSend.append(key, String(updatedData[key]));
        });

        // Add the photo
        changedFields.photo = true;
        formDataToSend.append('photo', values.photo);

        await updateUser({
          end_point: `users/${id}`,
          body: formDataToSend
        }).unwrap();
      } else {
        // If no photo, send as JSON
        await updateUser({
          end_point: `users/${id}`,
          body: updatedData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).unwrap();
      }

      toast.success('User updated successfully');
      navigate('/users');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update user');
      console.error('Failed to update user:', error);
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
          <Link to="/users" className="flex items-center hover:text-gray-700 transition">
            Users
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit User</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-600 mt-1">Update user information in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className='text-red-500'>*</span></label>
                  <Field
                    type="text"
                    name="full_name"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter full name"
                  />
                  <ErrorMessage name="full_name" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className='text-red-500'>*</span></label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter email"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Confirm new password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Field
                    type="text"
                    name="phone"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter phone number"
                  />
                  <ErrorMessage name="phone" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <Field
                    type="date"
                    name="dob"
                    className="w-full p-2 border rounded-lg"
                  />
                  <ErrorMessage name="dob" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Field
                    as="select"
                    name="country_id"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Country</option>
                    {isLoadingCountries ? (
                      <option value="" disabled>Loading countries...</option>
                    ) : countriesData?.data ? (
                      countriesData.data.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No countries available</option>
                    )}
                  </Field>
                  <ErrorMessage name="country_id" component="div" className="text-sm text-red-500" />
                </div>

                <div className="md:col-span-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      <input
                        type="file"
                        onChange={(event) => {
                          setFieldValue("photo", event.currentTarget.files[0]);
                        }}
                        className="w-full p-2 border rounded-lg"
                        accept="image/*"
                      />
                      <ErrorMessage name="photo" component="div" className="text-sm text-red-500" />
                      {initialValues.photo && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Current photo: {initialValues.photo.split('/').pop()}</p>
                        </div>
                      )}
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
                        <option value="FROZEN">FROZEN</option>
                        <option value="SUSPENDED">Suspended</option>
                      </Field>
                      <ErrorMessage name="status" component="div" className="text-sm text-red-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <Field
                        as="select"
                        name="role"
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </Field>
                      <ErrorMessage name="role" component="div" className="text-sm text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Field
                  as="textarea"
                  name="address"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter address"
                  rows="3"
                />
                <ErrorMessage name="address" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}