// // utils/arrayExtractor.js
// export const extractArray = (responseData) => {
//   if (Array.isArray(responseData)) {
//     return responseData;
//   } else if (responseData && Array.isArray(responseData.content)) {
//     return responseData.content; // Spring Pageable
//   } else if (responseData && Array.isArray(responseData.data)) {
//     return responseData.data; // Custom wrapper
//   } else if (responseData && Array.isArray(responseData.bookings)) {
//     return responseData.bookings; // Another custom wrapper
//   } else if (responseData && Array.isArray(responseData.items)) {
//     return responseData.items; // Yet another wrapper
//   }
//   return []; // Default to empty array
// };

// // Usage in component
// import { extractArray } from '../../utils/arrayExtractor';

// const loadBookings = async () => {
//   try {
//     const response = await adminService.getAllBookings();
//     const bookingsArray = extractArray(response.data);
//     setBookings(bookingsArray);
//   } catch (err) {
//     // ... error handling
//   }
// };