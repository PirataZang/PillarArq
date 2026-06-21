import Swal from 'sweetalert2'

export const useSwal = () => {
  const swal = Swal.mixin({
    customClass: {
      popup: 'bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]',
      title: 'text-xl font-semibold text-gray-900',
      htmlContainer: 'text-gray-500 text-sm mt-2',
      confirmButton: 'inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mx-2',
      cancelButton: 'inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors mx-2',
    },
    buttonsStyling: false
  })

  return {
    confirm: (options) => {
      return swal.fire({
        title: 'Você tem certeza?',
        text: 'Esta ação não poderá ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options
      })
    },
    success: (title, text) => swal.fire({ title, text, icon: 'success' }),
    error: (title, text) => swal.fire({ title, text, icon: 'error' }),
    info: (title, text) => swal.fire({ title, text, icon: 'info' })
  }
}
