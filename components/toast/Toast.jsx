import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastStyles.css'; // Import your custom styles

const toastTypes = {
    success: 'toast-success',
    failure: 'toast-failure',
    info: 'toast-info',
};

export function showToast(type, message) {
    const options = {
        position: 'bottom-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        theme: 'colored',
    };

    // Make sure the message is always a string
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);

    // Choose toast type dynamically based on `type`
    const toastType = toastTypes[type] || toastTypes.info;  // Default to 'info' if type is invalid

    switch (type) {
        case 'success':
            toast.success(messageString, { ...options, className: toastType });
            break;
        case 'failure':
            toast.error(messageString, { ...options, className: toastType });
            break;
        case 'info':
        default:
            toast.info(messageString, { ...options, className: toastType });
            break;
    }
}
