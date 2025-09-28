<template>
  <div class="custom-height">
    <div class="container">
        <div class="layout-form custom-width">
            <h1 class="main-title bold lg mb-5">{{ $t("Global.notifications_settings") }}</h1>
            <div class="layout-form sm">
                <h3 class="main-title sm mb-0">{{ $t("Global.Activate_notifications") }}</h3>
                <label class="switch">
                    <input type="checkbox" @click="toggleNotifications" v-model="isSelected">
                    <div class="slider round"></div>
                </label>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>

      definePageMeta({
        name: "Global.notifications_settings",
        middleware: 'auth',
    });

    const isSelected = ref(false);
    
    const store = useAuthStore();
    
    const { token } = storeToRefs(store);

    const { response } = responseApi();
    const { successToast, errorToast } = toastMsg();
    const axios = useApi();

    const config = {
        headers: { Authorization: `Bearer ${token.value}` }
    };

    const toggleNotifications = async () => {
      axios.patch('switch-notify', {}, config).then(res => {
        if (response(res) == "success") {
                    successToast(res.data.msg);
                    isSelected.value = res.data.data.notify
                    localStorage.setItem('notify', isSelected.value)
                    
                } else {
                    errorToast(res.data.msg)
                }
      })
      console.log("toggleNotifications")
    };

    

    onMounted(() => {
      isSelected.value = localStorage.getItem('notify')
  });
</script>


<style lang="scss" scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 35px;
    height: 18px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: 1px solid var(--main);
}

.slider:before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    left: 4px;
    top: 50%;
    background-color: var(--main);
    transition: 0.4s;
    transform: translateY(-50%);
}

input:checked + .slider {
  background-color: var(--main);
  border-color: var(--main);
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translate(17px, -50%);
  -ms-transform: translate(17px, -50%);
  transform: translate(17px, -50%);
  background-color: #fff;
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.custom-height {
    min-height: 310px;
    @media (max-width: 1024px) {
        min-height: 100%;
    }
}
</style>