<template>
  <div class="layout-form">
    <div :class="messageClass" v-if="messageText">
      <i class="fas fa-info-circle message-icon"></i>
      <span>{{ messageText }}</span>
    </div>

    <div class="page-header">
      <h1 class="main-title">تفاصيل الحجز</h1>
      <div class="header-actions">
        <button v-if="reservationData.buttons?.can_accept" class="action-btn-accept" @click="showAcceptDialog">
          قبول الحجز
        </button>
        <button v-if="reservationData.buttons?.can_reject" class="action-btn-reject" @click="showRejectDialog">
          رفض الحجز
        </button>
      </div>
    </div>

    <div class="card-section">
      <div class="details-grid">
        <div>
          <p>{{ reservationData.reservation_num || '#---' }}</p>
          <p><i class="fas fa-calendar-alt icon"></i> {{ reservationData.reservation_date || '---' }}</p>
          <p><i class="fas fa-user icon"></i> {{ reservationData.user_name || '---' }}</p>
          <p><i class="fas fa-calendar-check icon"></i> {{ $t('reservationDetails.booking_status') }}: <span
              :class="statusClass">{{ reservationData.status_text || bookingStatus }}</span></p>
          <p v-if="paymentStatus" class="payment-status-wrapper">
            <i class="fas fa-dollar-sign icon"></i> حالة الدفع: <span :class="paymentStatusClass">{{ paymentStatus
              }}</span>
          </p>
          <p v-if="reservationData.cancel_reason" class="cancel-reason">
            <i class="fas fa-times-circle icon"></i> سبب الإلغاء: {{ reservationData.cancel_reason }}
          </p>
        </div>
        <div class="details-left">
          <p>{{ reservationData.created_at || '---' }}</p>
          <p><i class="fas fa-money-bill icon"></i> {{ reservationData.total_price || '0' }}
            <img class="mr-1" src="@/assets/images/currency.svg" alt="currency">
          </p>

        </div>
      </div>
    </div>

    <div class="card-section" v-if="reservationData.table_info">
      <h2 class="section-title">{{ $t('reservationDetails.table') }}</h2>
      <div class="table-card mb-4">
        <img :src="reservationData.table_info.image?.file_name || 'https://i.imgur.com/rM195Vn.jpg'" alt="صورة طاولة"
          class="table-image" />
        <span class="table-rating" v-if="reservationData.rate"> <i class="fas fa-star"></i> {{ reservationData.rate
          }}</span>
      </div>

      <div class="restaurant-details">
        <p><i class="fas fa-users icon"></i> {{ $t('reservationDetails.number_of_people') }}: {{
          reservationData.table_info.people_number || '---' }} أفراد</p>
      </div>

      <div v-if="reservationData.meal_info && reservationData.meal_info.length > 0">
        <h2 class="section-title">{{ $t('reservationDetails.requested_services') }}</h2>
        <div class="services-list">
          <span v-for="meal in reservationData.meal_info" :key="meal.id" class="service-tag">
            {{ meal.name }} × {{ meal.quantity }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-section" v-if="reservationData.services_info && reservationData.services_info.length > 0">
      <h2 class="section-title">{{ $t('reservationDetails.requested_services') }}</h2>
      <div class="services-list">
        <span v-for="service in reservationData.services_info" :key="service.id" class="service-tag">
          {{ service.name }} × {{ service.quantity }}
        </span>
      </div>
    </div>


    <Dialog v-model:visible="acceptDialog" modal class="custum_dialog_width without-close" :draggable="false">
      <div class="text-center dialog-content">
        <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
        <h1 class="main-title md mb-0 hint_success">{{ $t('reservationDetails.approval_success') }}</h1>
      </div>
    </Dialog>

    <Dialog v-model:visible="rejectDialog" modal class="custum_dialog_width without-close" :draggable="false">
      <div class="text-center dialog-content-reject">
        <h1 class="main-title bold mb-4">{{ $t('reservationDetails.reject_reason') }}</h1>
        <textarea v-model="rejectReason" class="rejection-textarea"
          :placeholder="$t('reservationDetails.enter_reject_reason')"></textarea>
        <div class="dialog-actions">
          <button class="action-btn-accept" @click="hideRejectDialog">{{ $t('reservationDetails.cancel') }}</button>
          <button class="action-btn-reject" @click="confirmReject">{{ $t('reservationDetails.confirm_reject')
            }}</button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="rejectSuccessDialog" modal class="custum_dialog_width without-close" :draggable="false">
      <div class="text-center dialog-content">
        <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
        <h1 class="main-title md mb-0 hint_success">{{ $t('reservationDetails.reject_success') }}</h1>
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

definePageMeta({
  name: 'reservations.reservation_details',
});

// Get route parameter
const route = useRoute();
const reservationId = route.params.id;

// Axios
const axios = useApi();

// Toast
const { successToast, errorToast } = toastMsg();

// pinia store
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
  headers: { Authorization: `Bearer ${token.value}` }
}));

// Loading state
const loading = ref(false);

// Reservation data from API
const reservationData = ref({});

// حالة الحجز والدفع
const bookingStatus = ref('بانتظار الرد');
const paymentStatus = ref(null);
const acceptDialog = ref(false);
const rejectDialog = ref(false);
const rejectSuccessDialog = ref(false);
const rejectReason = ref('');

// الرسائل والكلاسات الديناميكية
const { t } = useI18n();

// Get reservation details from API
const getReservationDetails = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`provider/reservations/${reservationId}`, config.value);
    if (res.data.key === 'success') {
      const data = res.data.data;
      reservationData.value = data;

      // Update booking status from API
      bookingStatus.value = data.status_text || 'بانتظار الرد';

      // Set payment status if available
      if (data.status === 'confirmed' || data.status === 'approved') {
        paymentStatus.value = 'تم الدفع';
      } else if (data.status === 'pending') {
        paymentStatus.value = null;
      }
    }
  } catch (error) {
    console.error("Get reservation details error:", error);
    errorToast('حصل خطأ في تحميل تفاصيل الحجز');
  } finally {
    loading.value = false;
  }
};

const messageText = computed(() => {
  if (bookingStatus.value === 'مقبول' && paymentStatus.value === 'بانتظار الدفع') {
    return t('reservationDetails.payment_pending_msg');
  } else if (bookingStatus.value === 'مقبول' && paymentStatus.value === 'تم الدفع') {
    return t('reservationDetails.payment_completed_msg');
  } else if (bookingStatus.value === 'ملغي') {
    return t('reservationDetails.payment_failed_msg');
  }
  return '';
});

const messageClass = computed(() => {
  if (bookingStatus.value === 'مقبول' && paymentStatus.value === 'تم الدفع') {
    return 'status-message success';
  } else if (bookingStatus.value === 'مقبول' && paymentStatus.value === 'بانتظار الدفع') {
    return 'status-message pending';
  } else if (bookingStatus.value === 'ملغي') {
    return 'status-message fail';
  }
  return 'status-message warning';
});

const statusClass = computed(() => {
  if (bookingStatus.value === 'مقبول') {
    return 'status-approved';
  } else if (bookingStatus.value === 'ملغي') {
    return 'status-rejected';
  }
  return 'status-pending';
});

const paymentStatusClass = computed(() => {
  if (paymentStatus.value === 'تم الدفع') {
    return 'status-paid';
  }
  return '';
});

// وظائف التفاعل
const showAcceptDialog = async () => {
  loading.value = true;
  try {
    const res = await axios.post(`provider/reservations/${reservationId}/accept`, {}, config.value);
    if (res.data.key === 'success') {
      acceptDialog.value = true;
      bookingStatus.value = 'مقبول';
      paymentStatus.value = 'بانتظار الدفع';
      
      // إخفاء النافذة بعد 2 ثانية
      setTimeout(() => {
        acceptDialog.value = false;
      }, 2000);

      // تحديث البيانات من السيرفر
      await getReservationDetails();
      
      successToast('تم قبول الحجز بنجاح');
    }
  } catch (error) {
    console.error("Accept reservation error:", error);
    errorToast('حصل خطأ في قبول الحجز');
  } finally {
    loading.value = false;
  }
};

const showRejectDialog = () => {
  rejectDialog.value = true;
};

const hideRejectDialog = () => {
  rejectDialog.value = false;
  rejectReason.value = '';
};

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    errorToast('يجب إدخال سبب الرفض');
    return;
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('reason', rejectReason.value);

    const res = await axios.post(`provider/reservations/${reservationId}/reject`, formData, config.value);
    if (res.data.key === 'success') {
      hideRejectDialog();
      rejectSuccessDialog.value = true;

      // إخفاء النافذة بعد 1000 ميلي ثانية (1 ثانية)
      setTimeout(() => {
        rejectSuccessDialog.value = false;
        bookingStatus.value = 'ملغي';
      }, 1000);

      // تحديث البيانات من السيرفر
      await getReservationDetails();
      
      successToast('تم رفض الحجز بنجاح');
    }
  } catch (error) {
    console.error("Reject reservation error:", error);
    errorToast('حصل خطأ في رفض الحجز');
  } finally {
    loading.value = false;
  }
};

// Initialize data on mount
onMounted(async () => {
  await getReservationDetails();
});
</script>

<style scoped lang="scss">
$bg-dark: #1E1E1E;
$card-dark: #2A2A2A;
$text-light: #F0F0F0;
$text-sub: #A0A0A0;
$red-btn: #DC2626;
$green-btn: #16A34A;
$primary-green: #38A169;
$primary-red: #E53E53;
$primary-blue: #3B82F6;


.reservation-page {
  padding: 20px;
  background-color: $bg-dark;
  color: $text-light;
  min-height: 100vh;
}

.status-message {
  padding: 12px 16px;
  margin-bottom: 24px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;

  &.success {
    background-color: $green-btn;
    color: white;
  }

  &.pending {
    background-color: #191919;
    color: #fff;
    font-weight: 500;
  }

  &.warning {
    background-color: #FEF2F2;
    color: #E53E53;
    font-weight: 500;
  }

  &.fail {
    background-color: #F95555;
    color: #fff;
    font-weight: 500;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn-accept,
.action-btn-reject {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
  min-width: 180px;
}

.action-btn-accept {
  background-color: #191919;
  color: #fff;
}

.action-btn-reject {
  background-color: #fff;
  color: #EC2D30;
}

.card-section {
  background-color: $card-dark;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: $text-light;
  margin-top: 0;
  margin-bottom: 16px;
}

.details-grid {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.9rem;
  color: $text-sub;

  p {
    color: #fff;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  .icon {
    margin-left: 8px;
    color: $text-sub;
  }

  .status-pending {
    color: orange;
  }

  .status-approved {
    color: $primary-green;
  }

  .status-rejected {
    color: $red-btn;
  }

  .status-paid {
    color: $green-btn;
  }
}

.details-left {
  text-align: end;
}

.table-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 200px;
}

.table-image {
  width: 100%;
  height: auto;
}

.table-rating {
  position: absolute;
  top: 10px;
  inset-inline-end: 10px;
  background-color: rgba($card-dark, 0.7);
  color: $text-light;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.restaurant-details {
  font-size: 0.9rem;
  color: $text-sub;
  margin-bottom: 16px;

  p {
    margin: 0 0 8px 0;
  }
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-tag {
  background-color: #444444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.dialog-content {
  text-align: center;
  padding: 24px;
}

.success-icon-wrapper {
  background-color: #7E41C4;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  margin-bottom: 24px;

  i {
    color: white;
  }
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-light;
  margin: 0;
}

.custom-dialog-width {
  width: 90%;
  max-width: 400px;
  background-color: $card-dark;
  color: $text-light;
  border-radius: 12px;
  padding: 24px;
}

.rejection-textarea {
  width: 100%;
  height: 120px;
  background-color: $bg-dark;
  color: #fff;
  border: 1px solid rgba($text-sub, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.9rem;
  margin-top: 16px;
  resize: none;

  &::placeholder {
    color: #fff;
  }
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.action-btn-cancel {
  background-color: transparent;
  color: $text-light;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
}
</style>