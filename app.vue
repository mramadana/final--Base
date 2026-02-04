<template>
  <div>
    <NuxtLayout>
      <NuxtPage /> <!-- this Nuxtpage is = Routerview in Nuxt3-->
    </NuxtLayout>
    <Toast />
  </div>
</template>

<script setup>


const router = useRouter();
const route = useRoute();

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const authStore = useAuthStore();


// Auth Store
const { notificationToken, updateNotificationCount, device_id } = storeToRefs(authStore);

// Toast

const { successToast, errorToast } = toastMsg();

onMounted(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyDOUOlsKyQNLXS5SkAfjFx_AZNfQwGNmQw",
    authDomain: "reevent-a9329.firebaseapp.com",
    projectId: "reevent-a9329",
    storageBucket: "reevent-a9329.firebasestorage.app",
    messagingSenderId: "809206444734",
    appId: "1:809206444734:web:0c426953192d983e4364ef"
    // measurementId: "G-5399ZP3YFL"
  };

  const app = initializeApp(firebaseConfig);

  const messaging = getMessaging();

  onMessage(messaging, async (payload) => {
    console.log(payload, 'payload');
    payload.data.type == 'block_notification' ? errorToast(payload.notification.title) : successToast(payload.notification.title, 'info')
    updateNotificationCount.value++;
    payload.data.type == 'block_notification' ? navigateTo("/Auth/login") : null;
    if (route.path === '/Notifications') {
      await refreshNuxtData('notifications')
    }
    console.log(payload.data.type, 'payload.data.type');

    // if (payload.data.type == 'decoration_order_new') {
    //   router.push("/ServiceRequests/new");
    // }

    // if (payload.data.type == 'product_order_preparing') {
    //   router.push("/orders");
    // }

    // if (payload.data.type == 'meal_order_preparing') {
    //   router.push("/FoodOrders/current");
    // }

    // if (payload.data.type == 'decoration_order_paid') {
    //   const currentRoute = route.path;
    //   // Check if current page is DetailsServices/[id]
    //   if (currentRoute.startsWith('/DetailsServices/')) {
    //     // Refresh order details data using refreshNuxtData
    //     const orderId = route.params.id;
    //     if (orderId) {
    //       await refreshNuxtData(`order-details-${orderId}`);
    //     }
    //   }
    // }

    // if (payload.data.type == 'accept_product_package_request') {
    //   // Check if currently on babySupplies page
    //   if (route.path === '/categories/babySupplies') {
    //     // Dispatch event to trigger refetch in the page
    //     window.dispatchEvent(new CustomEvent('refetch-products'));
    //   }
    // }

    // if (payload.data.type == 'accept_update_info_request') {
    //   // Fetch updated profile data and update store
    //   const config = {
    //     headers: { Authorization: `Bearer ${authStore.token}` }
    //   };
    //   const { data } = await submitApiForm('profile', '', 'get', config);
    //   if (data?.key === 'success') {
    //     authStore.user = data.data;
    //     // Update user in store (updates sidebar, header, etc.)
    //   }

    //   // If currently on editProfile page, reload to refresh all form data
    //   if (route.path === '/settings/editProfile') {
    //     router.go(0); // Reload page to fetch updated profile in form
    //   }
    // }

  });

  getToken(messaging, { vapidKey: 'BNbEzQLm2ZpeIIH2lHknuubUoAenjMETnlpKQf0EHDUr-PVNr83Q1e3KpyDT6gz3lZFx8KeZlIzuRYiwxACM5l8' }).then((currentToken) => {
    if (currentToken) {
      console.log('Firebase token received:', currentToken);
      notificationToken.value = currentToken;
      device_id.value = currentToken;
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // Request permission if not granted
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Try to get token again
          return getToken(messaging, { vapidKey: 'BKKsynh6T2VTUPSjGBm-LH7oxZYfXo-Pr4SBAssS3X_l-VLkz8ja2_xekbir7eXNLOsRw2FXOv7caWG3K_9iiFk' });
        } else {
          console.log('Unable to get permission to notify.');
        }
      });
    }
  }).catch((err) => {
    console.error('An error occurred while retrieving token:', err);
    // Handle specific error cases
    if (err.code === 'messaging/permission-blocked') {
      console.error('Notification permission blocked by user');
    } else if (err.code === 'messaging/unsupported-browser') {
      console.error('Browser does not support Firebase messaging');
    }
  });

});

</script>
