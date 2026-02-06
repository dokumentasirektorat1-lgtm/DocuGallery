import toast from 'react-hot-toast'

// Success toast with custom styling
export const showSuccessToast = (message: string) => {
    return toast.success(message, {
        duration: 3000,
        style: {
            background: '#06B6D4',
            color: '#fff',
            fontWeight: '600',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#06B6D4',
        },
    })
}

// Error toast
export const showErrorToast = (message: string) => {
    return toast.error(message, {
        duration: 4000,
        style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: '600',
        },
    })
}

// Loading toast
export const showLoadingToast = (message: string) => {
    return toast.loading(message, {
        style: {
            background: '#3B82F6',
            color: '#fff',
            fontWeight: '600',
        },
    })
}

// Dismiss toast
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId)
}

// Promise toast (auto handles success/error)
export const promiseToast = (
    promise: Promise<any>,
    messages: {
        loading: string
        success: string
        error: string
    }
) => {
    return toast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
    })
}
