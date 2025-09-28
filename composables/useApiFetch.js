// composables/useApiFetch.js

// Common options configuration function
const createFetchOptions = (options = {}) => {

    const token = "";
    const lang = useCookie("lang");
    const config = useRuntimeConfig();
    const baseURL = "https://dashboard.amyalcar.com/api/";
  
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Authorization: `Bearer ${token}`,
      lang: lang.value || "ar",
      ...options.headers,
    };
  
    return {
      baseURL,
      headers,
      responseType: "json",
      ...options,
    };
  };
  
  // For data fetching with useFetch
  export const useApiFetch = (url, options = {}) => {
    return useFetch(url, {
      params: options.params || {}, // Set default params if none provided
      ...createFetchOptions(options),
      method: "GET",
    });
  };
  
  // Unified fetch function
  const fetchData = async (url, options = {}, method) => {
    try {
      const response = await $fetch(url, {
        ...createFetchOptions(options),
        method,
        body: options.body || undefined, // Ensure body is included if it exists
      });
  
      // Directly return the response
      return { data: response, error: null };
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return { data: null, error };
    }
  };
  
  // For data fetching with $fetch
  export const fetchApiData = (url, options = {}) => {
    return fetchData(url, options, "GET"); // Call the unified fetch with GET method
  };
  
  // For form submission or other requests with $fetch
  export const submitApiForm = (url, formData, method = "POST", options = {}) => {
    return fetchData(url, { ...options, body: formData }, method); // Include formData and dynamic method in options
  };
  