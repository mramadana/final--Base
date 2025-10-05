<template>
  <div class="row g-3">
    <div class="col-12 col-md-6" v-for="item in items" :key="item.id">
      <component
        :is="item.asLink ? 'NuxtLink' : 'div'"
        :to="item.asLink ? item.to : undefined"
        class="reservation-card"
        :class="{ clickable: item.asLink }"
      >
        <div class="card-inner">
          <!-- Top meta (time/date and id) -->
          <div class="meta-row">
            <div class="date-time">{{ item.metaTime }}</div>
            <div class="res-id">#{{ item.id }}</div>
          </div>

          <div class="content-row">
            <div class="content-col">
              <h4 class="title">{{ item.title }}</h4>

              <div class="line" v-if="item.dateRange || item.timeRange">
                <span class="muted with-icon">
                  <img class="icon" src="@/assets/images/Logo.svg" alt="calendar" />
                  {{ item.dateRange || item.timeRange }}
                </span>
              </div>

              <div class="line" v-if="item.customerName">
                <span class="with-icon">
                  <img class="icon" src="@/assets/images/Logo.svg" alt="user" />
                  {{ item.customerName }}
                </span>
              </div>
            </div>

            <div class="thumb" v-if="item.imageSrc">
              <img :src="item.imageSrc" :alt="item.title" />
            </div>
          </div>

          <div class="status-row">
            <span class="status-label">حالة الحجز :</span>
            <span :class="['status', getStatusClass(item.status)]">{{ item.statusText || fallbackStatusText(item.status) }}</span>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const getStatusClass = (status) => {
  const classes = {
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

  &.clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
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
  display: grid;
  grid-template-columns: 1fr 110px;
  align-items: center;
  gap: 14px;
}

.content-col {
  .title {
    margin: 0 0 6px 0;
    font-size: 16px;
    font-weight: 700;
  }

  .line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
    font-size: 13px;

    .muted { color: #b0b0b0; }

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
  height: 86px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #3a3a3a;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.status-row {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #3a3a3a;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

  .status-label { color: #b0b0b0; }

  .status {
    &.status--confirmed { color: #4CAF50; font-weight: 700; }
    &.status--pending { color: #FFC107; font-weight: 700; }
    &.status--canceled { color: #F44336; font-weight: 700; }
  }
}

@media (max-width: 576px) {
  .content-row {
    grid-template-columns: 1fr 90px;
    gap: 10px;
  }

  .thumb {
    width: 90px;
    height: 72px;
  }
}
</style>
