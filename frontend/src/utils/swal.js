import Swal from 'sweetalert2'

export const useSwal = () => {
  const swal = Swal.mixin({
    customClass: {
      popup: 'bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]',
      title: 'text-xl font-semibold text-gray-900',
      htmlContainer: 'text-gray-500 text-sm mt-2',
      confirmButton:
        'inline-flex items-center justify-center rounded-md border border-transparent bg-charcoal px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-charcoal-light focus:outline-none focus:ring-2 focus:ring-marble-400 focus:ring-offset-2 transition-colors mx-2',
      cancelButton:
        'inline-flex items-center justify-center rounded-md border border-marble-300 bg-white px-4 py-2 text-sm font-medium text-marble-800 shadow-sm hover:bg-marble-50 focus:outline-none focus:ring-2 focus:ring-marble-400 focus:ring-offset-2 transition-colors mx-2',
    },
    buttonsStyling: false,
  })

  return {
    confirm: async (titleOrOptions, text) => {
      const options =
        typeof titleOrOptions === 'string'
          ? { title: titleOrOptions, text }
          : titleOrOptions ?? {}

      const result = await swal.fire({
        title: 'Você tem certeza?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
      })

      return result.isConfirmed === true
    },
    success: (title, text) => swal.fire({ title, text, icon: 'success' }),
    error: (title, text) => swal.fire({ title, text, icon: 'error' }),
    info: (title, text) => swal.fire({ title, text, icon: 'info' }),
  }
}
