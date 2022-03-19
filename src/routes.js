//•••••••••••••••••••••••••••••••••••
// ••••••••  CLIENT URLS  •••••••••••
//•••••••••••••••••••••••••••••••••••
export const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
export const CLOUDINARY_URL = `https://res.cloudinary.com/mixstudios/image/upload/v1646090237/`;

/**
 * ---->  BASE ROUTES
 */
export const DASHBOARD = '/dashboard';
export const LANDING = `/`;
export const LOGIN = `/login`;
export const REGISTER = `/register`;
export const USER_SETTINGS = `/settings`;

/**
 * ---->  SUB ROUTES
 */
export const OVERVIEW = '/overview';
export const PROJECT = '/project';

/**
 * ---->  REDIRECTS
 */
export const LOGIN_SUCCES_REDIRECT = `${DASHBOARD}${OVERVIEW}`;
export const NO_AUTH_REDIRECT = LOGIN;

//•••••••••••••••••••••••••••••••••••
// ••••••••  SERVER URLS  •••••••••••
//•••••••••••••••••••••••••••••••••••

/**
 * ----> API URLS
 */
const authDir = 'auth';
export const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}`;
export const GQL_SERVER_URL = `${process.env.REACT_APP_GQL_SERVER_URL}`;

const audioBucketName = 'mix-studios-audio-uploads';
export const AWS_AUDIO_BUCKET = `https://${audioBucketName}.s3.us-west-2.amazonaws.com/`; // follow with object key

/**
 * ----> AUTH ENDPOINTS
 */
export const GOOGLE_AUTH = `/${authDir}/google/token?access_token=`;
export const LOCAL_AUTH = `/${authDir}/login`;
export const LOCAL_REGISTER = `/${authDir}/signup`;
export const LOCAL_PW_CHANGE = `/${authDir}/change-password`;
