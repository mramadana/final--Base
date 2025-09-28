import { defineStore } from "pinia";
import { useApiFetch } from "~/composables/useApiFetch";

// success response
const { response } = responseApi();

export const useGlobalStore = defineStore("global", {
  state: () => ({
    countries : [],
    isCountriesLoaded: false,
    isCountriesLoading: false,
    title: ''
  }),
  actions: {

    setTitle(newTitle) {
      this.title = newTitle
    },

    // get Countries
    async getCountriesHandler() {

      // check if countries are already loaded
      if (this.isCountriesLoaded || this.isCountriesLoading) {
        return { status: "success", data: this.countries };
      }
      
      try {

        this.isCountriesLoading = true; 
        // Get the Lang value from localStorage
        const lang = localStorage.getItem('locale');
        
        const { data: response } = await useApiFetch('countries', {
          headers: {
            lang: lang || 'ar'
          }
        });

        if (response.value) {
          this.countries = response.value.data;
          this.isCountriesLoaded = true; 
          return { status: "success", data: this.countries };
        }
        
        return { status: "error", message: "Failed to fetch countries" };
      } catch (error) {
        console.error('Error fetching countries:', error);
        return { status: "error", message: error.message };
      } finally {
        this.isCountriesLoading = false;
      }
    },
    
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: "strict",
    }),
  },
});
