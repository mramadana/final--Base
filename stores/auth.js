import { defineStore } from "pinia";

// Axios
const axios = useApi();

// success response
const { response } = responseApi();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      phone: "",
      country_code: "",
    },
    token: null,
    isLoggedIn: false,
    newPhone: null,
    notificationToken: null,
    test: 'test key',
    currentemail: null,
    currentPasword: null,
    lat: null,
    lng: null,
    userType: null,
    device_id: null,
    updateNotificationCount: 0,
  }),
  actions: {

    // Sign In

    async signInHandler(formData) {

      const { data, error } = await submitApiForm("provider/auth/login", formData);
    
      if (error) {
        console.error("Sign-in error:", error);
        return { status: "error", msg: error.message || "An error occurred" };
      }
  
      if (data.key === "needActive") {
        console.log("Redirecting to activate account");
        navigateTo("/Auth/activateAccount");
        return { status: "needActive", msg: "Activation required" };
      }

      if (data.key === "need_active_package") {
        console.log("Redirecting to complete payment");
        navigateTo("/Auth/completePayment");
        return { status: "need_active_package", msg: "Active package required" };
      }
      
      // Debug: Check for any variation of the key
      if (data.key && data.key.includes("package")) {
        navigateTo("/Auth/completePayment");
        return { status: "need_active_package", msg: "Active package required" };
      }

      if (data.key === "need_to_complete_data") {
        navigateTo("/Auth/completeInfo");
        console.log(data.key,"Redirecting to complete info");
        return { status: "need_to_complete_data", msg: data.msg };
      }
    
      if (data.key === "success") {
        this.user = data.data;
        this.token = data.data.token;
        this.isLoggedIn = true;
        this.userType = data.data.category?.type || null;
        console.log("User type:", this.userType);
        navigateTo("/");
        return { status: "success", msg: data.msg };
      } else {
        return { status: "error", msg: data.msg };
      }
    },

    // Sign Up

    async signUpHandler(formData) {
      const { data, error } = await submitApiForm("provider/auth/register", formData);
    
      if (error) {
        console.error("Sign-up error:", error);
        return { status: "error", msg: error.message || "An error occurred" };
      }
    
      if (data.key === "success") {
        this.user = data.data;
        navigateTo("/Auth/activateAccount");
        return { status: "success", msg: data.msg };
      } else {
        return { status: "error", msg: data.msg };
      }
    },

    // Verification Code
    async verificationHandler(formData) {
      const resData = await axios.post("provider/auth/activate-phone", formData);
      if (response(resData) == "success") {
        this.token = resData.data.data.token;
        this.isLoggedIn = true;
        navigateTo("/Auth/completeInfo");
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // update Profile

    async profileHandler(formData) {
      const options = {
        headers: { Authorization: `Bearer ${this.token}` }
      };

      const { data, error } = await submitApiForm("update-profile", formData, "POST", options);
      
      if (error) {
        console.error("Profile error:", error);
        return { status: "error", msg: error.message || "An error occurred" };
      }
      if (data.key === "success") {
        this.user = data.data;
        console.log(this.user, "9999999999999999");
        return { status: "success", msg: data.msg };
      } else {
        return { status: "error", msg: data.msg };
      }
    },

    // async profileHandler(formData) {
    //   const config = {
    //     headers: { Authorization: `Bearer ${this.token}` },
    //   };

    //   const resData = await axios.post(
    //     "update-profile",
    //     formData,
    //     config
    //   );
    //   if (response(resData) == "success") {
    //     this.user = resData.data.data;
    //     return { status: "success", msg: resData.data.msg };
        
    //   } else {
    //     return { status: "error", msg: resData.data.msg };
    //   }
    // },

    // New Phone
    async phoneHandler(formData, newPhone) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.post(
        "change-phone-send-code",
        formData,
        config
      );
      if (response(resData) == "success") {
        this.newPhone = newPhone;
        navigateTo("/mobileActivateCode");
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // Logout
    async logoutHandler() {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.post("provider/sign-out" , {} , config);
      if (
        response(resData) == "success" ||
        response(resData) == "blocked" ||
        response(resData) == "unauthenticated"
      ) {
        const globalStore = useGlobalStore();
        globalStore.countries = [];
        globalStore.isCountriesLoaded = false;
        this.token = null;
        this.user = {
          phone: "",
          country_code: "",
        };
        this.isLoggedIn = false;
        this.device_id = null;
        navigateTo("/Auth/login");
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // delete account
    async deleteAccountHandler() {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.delete("provider/profile/delete-account", config);
      if (
        response(resData) == "success" ||
        response(resData) == "blocked" ||
        response(resData) == "unauthenticated"
      ) {
        this.token = null;
        this.user = {
          phone: "",
          country_code: "",
          image: null,
          email: null,
          name: null
        };
        this.isLoggedIn = false;
        this.device_id = null;
        navigateTo("/Auth/login");
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // chnage mail
    async changeMailHandler(formData, currentemail, currentPasword) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.post(
        "change-email-send-code",
        formData,
        config
      );
      if (response(resData) == "success") {
        this.currentemail = currentemail;
        this.currentPasword = currentPasword;
        navigateTo('/emailActivateCode');
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // get Countries
    // async getCountriesHandler() {

    //   // check if countries are already loaded
    //   if (this.isCountriesLoaded || this.isCountriesLoading) {
    //     return { status: "success", data: this.countries };
    //   }
      
    //   try {

    //     this.isCountriesLoading = true; 
    //     // Get the Lang value from localStorage
    //     const lang = localStorage.getItem('locale');
    //     const res = await axios.get("countries", {
    //       headers: {
    //         'Lang': lang
    //       }
    //     });
    //     if (response(res) == "success") {
    //       this.countries = res.data.data;
    //       this.isCountriesLoaded = true; 
    //       return { status: "success", data: res.data.data };
    //     } else {
    //       return { status: "error", msg: res.data.msg };
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     return { status: "error", msg: error.message };
    //   } finally {
    //     this.isCountriesLoading = false;
    //   }
    // },
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: "strict",
    }),
  },
});
