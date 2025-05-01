const API_BASE_URL = 'https://backend-g78p.onrender.com/api';
const STUDENT_BASE_URL = 'https://backend-g78p.onrender.com/api/student';
const CLEARANCE_BASE_URL = 'https://backend-g78p.onrender.com/api/clearance';
const APPROVAL_BASE_URL = 'https://backend-g78p.onrender.com/api/clearance';

const API_ENDPOINTS = {
    API_BASE_URL:`${API_BASE_URL}`,
    IMAGE:`${API_BASE_URL}/file/get`,
    STUDENT_CHECK:`${API_BASE_URL}/student_check`,
    UPLOAD:`${API_BASE_URL}/upload`,
    LOGIN:`${API_BASE_URL}/auth/login`,
    BIO_REGISTRATION:`${API_BASE_URL}/bio-registrations`,
    PERSONAL_DETAILS:`${API_BASE_URL}/personal-details`,
    SCHOOL_DETAILS:`${API_BASE_URL}/student-details`,
    EDUCATIONALS_APPLICATION:`${API_BASE_URL}/educational-details`,
    APPROVE:`${API_BASE_URL}/approve`,
    
    // Department endpoints
    DEPARTMENTS_BASE: `${API_BASE_URL}/department`,
    ADD_DEPARTMENT: `${API_BASE_URL}/department/add`,
    GET_ALL_DEPARTMENTS: `${API_BASE_URL}/department/departments`,
    GET_DEPARTMENT: `${API_BASE_URL}/department`,  // will append /:id
    UPDATE_DEPARTMENT: `${API_BASE_URL}/department`, // will append /:id
    DELETE_DEPARTMENT: `${API_BASE_URL}/department`, // will append /:id

    // Student endpoints
    STUDENT_BASE: `${STUDENT_BASE_URL}`,
    ADD_STUDENT: `${STUDENT_BASE_URL}/add`,
    GET_ALL_STUDENTS: `${STUDENT_BASE_URL}/students`,
    GET_STUDENT: `${STUDENT_BASE_URL}`,  // will append /:id
    UPDATE_STUDENT: `${STUDENT_BASE_URL}`, // will append /:id
    DELETE_STUDENT: `${STUDENT_BASE_URL}`, // will append /:id

    // Clearance endpoints
    CLEARANCE_BASE: `${CLEARANCE_BASE_URL}`,
    GET_ALL_CLEARANCE_REQUESTS: `${CLEARANCE_BASE_URL}/all`,
    GET_CLEARANCE_REQUEST: `${CLEARANCE_BASE_URL}`,  // will append /:id
    UPDATE_CLEARANCE_REQUEST: `${CLEARANCE_BASE_URL}`, // will append /:id
    DELETE_CLEARANCE_REQUEST: `${CLEARANCE_BASE_URL}`, // will append /:id
}

export default API_ENDPOINTS;
