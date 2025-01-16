import { ref, type Ref } from 'vue'

export function useFetch(
  url: string,
  options: { method?: string; headers?: { [key: string]: string }; body?: any } = {},
): {
  data: Ref<any>
  errorList: Ref<any>
  error: Ref<string | null>
  loading: Ref<boolean>
  abort: () => void
  fetchData: () => void
  statusCode: Ref<number | null>
} {
  const data = ref(null)
  const error = ref<string | null>(null)
  const errorList = ref<any[]>([])
  const loading = ref<boolean>(false)
  const { signal, abort } = new AbortController()
  const baseUrl = import.meta.env.VITE_APP_API_URL
  const statusCode = ref<number | null>(null)

  const defaultHeaders = {
    Accept: 'application/json',
    'X-Locale': 'de',
  }

  options.headers = { ...defaultHeaders, ...options.headers }

  const fetchData = async () => {
    console.log(baseUrl);
    
    loading.value = true
    try {
      const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers:
          options.body instanceof FormData
            ? options.headers
            : { ...options.headers, 'Content-Type': 'application/json' },
        signal,
      }

      if (options.body) {
        fetchOptions.body =
          options.body instanceof FormData ? options.body : JSON.stringify(options.body)
      }

      const response = await fetch(`${baseUrl}${url}`, fetchOptions)
      statusCode.value = response.status

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = 'Could not fetch data'
        let errors = []

        switch (response.status) {
          case 422:
            errorMessage = errorData.message || 'Unprocessable Entity'
            errors = errorData.errors || []
            break
          case 404:
            errorMessage = 'Resource not found'
            errors = { resource: [errorMessage] }
            break
          case 403:
            errorMessage = errorData.message || 'Not Allowed'
            errors = { forbidden: [errorMessage] }
            break
          case 409:
            errorMessage = 'Email already exists'
            errors = { conflict: [errorMessage] }
            break
          case 413:
            errorMessage = 'Content is too large'
            errors = { content: [errorMessage] }
            break
          case 500:
          default:
            errorMessage = errorData.message || `Error: ${response.status}`
            errors = { server: [errorMessage] }
            break
        }

        // Update error state
        error.value = errorMessage
        errorList.value = errors
        return
      }

      // If response is OK, clear errors and set data
      error.value = null
      errorList.value = []
      data.value = await response.json()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('fetch aborted')
      } else {
        error.value = err.message
        errorList.value = { general: [err.message] }
      }
    } finally {
      loading.value = false
    }
  }

  return { data, error, errorList, loading, statusCode, abort, fetchData }
}
