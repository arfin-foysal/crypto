import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePostApiMutation } from '../../store/api/commonSlice';

const validationSchema = Yup.object({
  full_name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  photo: Yup.mixed(),
  phone: Yup.string().nullable(),
  dob: Yup.string().nullable(),
  address: Yup.string().nullable(),
  status: Yup.string()
    .oneOf(['PENDING', 'ACTIVE', 'FROZEN', 'SUSPENDED'])
    .default('PENDING'),
  role: Yup.string()
    .oneOf(['ADMIN', 'USER'])
    .default('USER')
});

export default function AddUser() {
  const navigate = useNavigate();
  const [postApi] = usePostApiMutation();

  const initialValues = {
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: '',
    phone: '',
    dob: '',
    address: '',
    status: 'PENDING',
    role: 'USER'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {

      const formData = new FormData();

      // Append all text fields except confirmPassword
      Object.keys(values).forEach(key => {
        if (key !== 'photo' && key !== 'confirmPassword') {
          formData.append(key, values[key]);
        }
      });

      // Append file if it exists
      if (values.photo instanceof File) {
        formData.append('photo', values.photo);
      }

      await postApi({
        end_point: "users",
        body: formData
      }).unwrap();

      toast.success('User added successfully');
      navigate('/users');
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to add user');
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
          <span className="text-gray-700">Add User</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        <p className="text-gray-600 mt-1">Create a new user account in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className='text-red-500'>*</span></label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter password"
                  />
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className='text-red-500'>*</span></label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Confirm password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>







                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 ">Photo</label>
                      <input
                        type="file"
                        onChange={(event) => {
                          setFieldValue("photo", event.currentTarget.files[0]);
                        }}
                        className="w-full p-2 border rounded-lg"
                        accept="image/*"
                      />
                      <ErrorMessage name="photo" component="div" className="text-sm text-red-500" />
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
              <div className="md:col-span-2">
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
                  {isSubmitting ? 'Adding...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
