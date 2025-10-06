<template>

  <div class="row g-3" v-if="!loading">
    <div :class="colClasses" v-for="item in items" :key="item.id">
      <div class="reservation-card" :class="{ 'cursor-pointer': linkTo }"
        @click="linkTo ? navigateTo(`${linkTo}/${item.id}`) : null">
        <div class="card-inner">
          <div class="content-row">
            <div class="thumb" v-if="item.imageSrc">
              <img :src="item.imageSrc" :alt="item.title" />
            </div>

            <div class="content-col">
              <div class="meta-row">
                <div class="res-id">#{{ item.id }}</div>
                <div class="date-time">{{ item.metaTime }}</div>
              </div>
              <h4 class="title">{{ item.title }}</h4>

              <div class="line" v-if="item.dateRange || item.timeRange">
                <span class="muted with-icon">
                  <img class="icon" src="@/assets/images/home-img/clock-img.svg" alt="calendar" />
                  {{ item.dateRange || item.timeRange }}
                </span>
              </div>

              <div class="line" v-if="item.customerName">
                <span class="with-icon">
                  <img class="icon" src="@/assets/images/home-img/user-circle.svg" alt="user" />
                  {{ item.customerName }}
                </span>
              </div>
              <div class="status-row">
                <span class="status-label">حالة الحجز :</span>
                <span :class="['status', getStatusClass(item.status)]">{{ item.statusText ||
                  fallbackStatusText(item.status) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-3" v-else>
    <div :class="colClasses" v-for="i in 3" :key="i">
      <div class="reservation-card">
        <div class="card-inner">
          <div class="content-row">
            <!-- Skeleton Thumb -->
            <div class="thumb">
              <Skeleton width="100%" height="100%" />
            </div>

            <div class="content-col">
              <!-- Skeleton Meta Row -->
              <div class="meta-row">
                <Skeleton height="12px" width="50px" />
                <Skeleton height="12px" width="120px" />
              </div>

              <!-- Skeleton Title -->
              <Skeleton height="15px" width="80%" class="mb-2" />

              <!-- Skeleton Line 1 -->
              <div class="line">
                <Skeleton height="13px" width="150px" />
              </div>

              <!-- Skeleton Line 2 -->
              <div class="line">
                <Skeleton height="13px" width="120px" />
              </div>

              <!-- Skeleton Status Row -->
              <div class="status-row">
                <Skeleton height="13px" width="90px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- if no reservations show this  -->
  <GlobalNoData :noData_text="$t('noData.no_reservations')" v-if="!items?.length && !loading" />
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  linkTo: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  colClasses: {
    type: String,
    default: 'col-12 col-md-6 col-lg-4'
  }
});

const getStatusClass = (status) => {
  const classes = {
    warning: 'status--warning',
    confirmed: 'status--confirmed',
    pending: 'status--pending',
    canceled: 'status--canceled',
  };
  return classes[status] || 'status--confirmed';
};

const fallbackStatusText = (status) => {
  const texts = {
    confirmed: 'مؤكد',
    pending: 'قيد التأكيد',
    canceled: 'ملغي',
  };
  return texts[status] || 'مؤكد';
};
</script>

<style lang="scss" scoped>
.reservation-card {
  background: #2A2A2A;
  border: 1px solid #3a3a3a;
  border-radius: 14px;
  color: #fff;
  display: block;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &.cursor-pointer {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    }
  }
}

.card-inner {
  padding: 14px 16px;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #b0b0b0;
  font-size: 12px;
  margin-bottom: 10px;

  .res-id {
    color: #d0d0d0;
    font-weight: 600;
  }
}

.content-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-col {
  flex: 1;
  text-align: start;

  .title {
    margin-bottom: 6px;
    font-size: 15px;
    font-weight: 500;
  }

  .line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
    font-size: 13px;

    .muted {
      color: #b0b0b0;
    }

    .with-icon {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      .icon {
        width: 16px;
        height: 16px;
        opacity: 0.85;
      }
    }
  }
}

.thumb {
  width: 110px;
  height: 115px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #3a3a3a;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.status-row {

  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

  .status-label {
    color: #b0b0b0;
  }

  .status {
    &.status--confirmed {
      color: #4CAF50;
    }

    &.status--pending {
      color: #FFC107;
    }

    &.status--canceled {
      color: #F44336;
    }

    &.status--warning {
      color: #FFC107;
      font-weight: 700;
    }
  }
}

@media (max-width: 576px) {
  .content-row {
    gap: 10px;
  }

  .thumb {
    width: 90px;
    height: 72px;
  }
}
</style>
