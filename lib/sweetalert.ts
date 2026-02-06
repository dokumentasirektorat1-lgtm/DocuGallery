import Swal from 'sweetalert2'

// Custom SweetAlert2 configuration matching app theme
const swalConfig = {
    customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-xl font-bold',
        confirmButton: 'px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors',
        cancelButton: 'px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-colors',
        denyButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors',
    },
    buttonsStyling: false,
    reverseButtons: true,
}

/**
 * Show success notification
 */
export const showSuccess = (message: string, title: string = 'Success!') => {
    return Swal.fire({
        ...swalConfig,
        icon: 'success',
        title,
        text: message,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
    })
}

/**
 * Show error notification
 */
export const showError = (message: string, title: string = 'Error!') => {
    return Swal.fire({
        ...swalConfig,
        icon: 'error',
        title,
        text: message,
        confirmButtonText: 'OK',
    })
}

/**
 * Show confirmation dialog
 */
export const showConfirm = async (
    title: string,
    message: string,
    confirmText: string = 'Yes',
    cancelText: string = 'Cancel'
): Promise<boolean> => {
    const result = await Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title,
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
    })

    return result.isConfirmed
}

/**
 * Show info notification
 */
export const showInfo = (message: string, title: string = 'Info') => {
    return Swal.fire({
        ...swalConfig,
        icon: 'info',
        title,
        text: message,
        confirmButtonText: 'OK',
    })
}

/**
 * Show loading indicator
 */
export const showLoading = (message: string = 'Processing...') => {
    return Swal.fire({
        ...swalConfig,
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        },
    })
}

/**
 * Close any open SweetAlert
 */
export const closeSwal = () => {
    Swal.close()
}
