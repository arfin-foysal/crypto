/**
 * Examples of how to use the new API client
 * This file is for demonstration purposes only
 */

import { apiClient } from '@/services/api';
import apiService from '@/services/api';

/**
 * Example 1: Using the apiClient directly
 * This approach gives you more control and flexibility
 */
async function directApiClientUsage() {
  try {
    // GET request with query parameters
    const users = await apiClient.get('/users', { page: 1, perPage: 10 });
    console.log('Users:', users);
    
    // POST request with JSON data
    const newUser = await apiClient.post('/users', {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    });
    console.log('New user created:', newUser);
    
    // PUT request with JSON data
    const updatedUser = await apiClient.put(`/users/${newUser.id}`, {
      name: 'John Updated',
      role: 'admin'
    });
    console.log('User updated:', updatedUser);
    
    // DELETE request
    const deletedUser = await apiClient.delete(`/users/${newUser.id}`);
    console.log('User deleted:', deletedUser);
    
    // FormData example (file upload)
    const formData = new FormData();
    formData.append('profile_photo', fileInput.files[0]);
    formData.append('name', 'John Doe');
    
    const userWithPhoto = await apiClient.post('/users/with-photo', formData);
    console.log('User with photo created:', userWithPhoto);
    
    // Setting custom headers for a specific request
    const response = await apiClient.get('/protected-resource', {}, {
      'X-Custom-Header': 'custom-value'
    });
    console.log('Protected resource:', response);
  } catch (error) {
    console.error('API error:', error);
  }
}

/**
 * Example 2: Using the apiService
 * This approach uses predefined methods for common operations
 */
async function apiServiceUsage() {
  try {
    // Login
    const loginResponse = await apiService.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse);
    
    // Get profile
    const profile = await apiService.getProfile();
    console.log('User profile:', profile);
    
    // Update profile with JSON
    const updatedProfile = await apiService.updateProfile({
      full_name: 'John Updated',
      email: 'john.updated@example.com'
    });
    console.log('Updated profile:', updatedProfile);
    
    // Update profile with FormData (including photo)
    const profileFormData = new FormData();
    profileFormData.append('full_name', 'John With Photo');
    profileFormData.append('photo', fileInput.files[0]);
    
    const profileWithPhoto = await apiService.updateProfile(profileFormData);
    console.log('Profile with photo:', profileWithPhoto);
    
    // Get transactions with filters
    const transactions = await apiService.getTransactions({
      page: 1,
      per_page: 10,
      status: 'COMPLETED'
    });
    console.log('Transactions:', transactions);
  } catch (error) {
    console.error('API service error:', error);
  }
}

// These functions are for demonstration only and are not meant to be executed directly
export { directApiClientUsage, apiServiceUsage };
