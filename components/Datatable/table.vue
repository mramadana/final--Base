<template>

<div class="main-table">
      <DataTable
        :value="products"
        :filters="filters"
        :rows="rows"
        :sortable="sortable"
        tableStyle="min-width: 50rem"
        class="main-table"
        id="my_table"
        ref="my_table"
      >
        <template #empty>
          {{ $t("Table.no_records_found") }}
        </template>

        <div v-for="col in columns" :key="col.field">
          <Column
            :field="col.field"
            :header="col.header"
            :sortable="sortable"
            v-if="col.field !== 'abilities'"
          >
            <template #body="slotProps">
              <!-- Image -->
              <img
                v-if="col.field === 'image' && showImage"
                :src="slotProps.data.image"
                loading="lazy"
                class="shadow-4 datatable-image-custom"
              />

              <!-- Status badges -->
              <span 
                v-else-if="col.field === 'status'" 
                :class="['status-badge', `status-${slotProps.data.statusBadge}`]"
              >
                {{ slotProps.data.status }}
              </span>

              <!-- Reservations column as dark chip -->
              <!-- <span
                v-else-if="col.field === 'reservations'"
                class="chip chip-dark"
                @click="openReservations(slotProps.data.id)"
              >
                {{ slotProps.data.reservations }}
              </span> -->

              <span
                v-else-if="col.field === 'reservations'"
                class="chip chip-dark"
                @click="navigateToAppointment(slotProps.data.id)"
              >
                {{ slotProps.data.reservations }}
              </span>

              <!-- Default content -->
              <span v-else>{{ slotProps.data[col.field] }}</span>
            </template>
          </Column>
        </div>


        <!--*********** Actions Column (Slot) ***********-->
        <Column :header="actionsHeader || routeTable?.header" v-if="$slots.actions || routeTable">
            <template #body="slotProps">
                <!-- Use slot if provided -->
                <slot name="actions" :data="slotProps.data" v-if="$slots.actions" />
                
                <!-- Fallback to old routeTable approach -->
                <div class="table-actions-group" v-else-if="routeTable">
                    <button class="table-action-btn btn-view" @click="viewItem(slotProps.data.id)">
                        <i class="fas fa-eye"></i>
                        {{ $t('tables.view') }}
                    </button>
                    <button class="table-action-btn btn-edit" @click="editItem(slotProps.data.id)">
                        {{ $t('tables.edit') }}
                    </button>
                    <button class="table-action-btn btn-delete" @click="deleteItem(slotProps.data.id)">
                        {{ $t('tables.delete_table') }}
                    </button>
                </div>
            </template>
        </Column>

        <!-- in this Column pass dropdown have all dialogs inside branches page  -->
        <Column v-if="DropDownbranches" header="">
          <template #body="slotProps">
            <div class="dropdown drop-lang dropdown-table sort-table">
              <div
                class="dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false">
              </div>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                <li>
                  <router-link :to="'/branches/'+ slotProps.data.id + '/edit'" class="table_link dropdown-item" @click="editItem(slotProps.data.id)">
                    {{ $t("Cars.edit") }}
                    <i class="far fa-edit custom-icon delete"></i>
                  </router-link>
                </li>

                <li>
                  <button
                    class="dropdown-item"
                    @click="deleteItem(slotProps.data.id)">
                    {{ $t("Cars.delete") }}
                    <i class="fas fa-trash-alt custom-icon edit"></i>
                  </button>
                </li>

                <li>
                    <router-link :to="'/branches/branchdata'" class="table_link dropdown-item" @click="viewItem(slotProps.data.id)">
                      {{ $t("Cars.view_data") }}
                      <i class="fas fa-eye custom-icon details"></i>
                  </router-link>
                </li>
              </ul>
            </div>
          </template>
        </Column>

        <!-- this dropdown have all dialogs inside employees page -->

        <Column v-if="DropDownemployees" header="">
          <template #body="slotProps">
            <div class="dropdown drop-lang dropdown-table sort-table">
              <div
                class="dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false">
              </div>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <button
                    class="dropdown-item"
                    @click="deleteItem(slotProps.data.id)">
                    {{ $t("Cars.delete") }}
                    <i class="fas fa-trash-alt custom-icon edit"></i>
                  </button>
                </li>

                <li>
                  <button class="dropdown-item" @click="editItem(slotProps.data.id)">
                    {{ $t("Cars.edit") }}
                    <i class="far fa-edit custom-icon delete"></i>
                  </button>
                </li>
                <li>
                    <button class="table_link dropdown-item" @click="viewItem(slotProps.data.id)">
                      {{ $t("Cars.view_data") }}
                      <i class="fas fa-eye custom-icon details"></i>
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </Column>

        <!-- this dropdown have all routes inside brancheManagers page -->

        <Column v-if="DropDownManagers" header="">
          <template #body="slotProps">
            <div class="dropdown drop-lang dropdown-table sort-table">
              <div
                class="dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false">
              </div>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                <li>

                  <router-link :to="DropDownManagers.path + '/' + DropDownManagers.subroute" class="table_link dropdown-item" @click="editItem(slotProps.data.id)">
                    {{ $t("Cars.edit") }}
                    <i class="far fa-edit custom-icon delete"></i>
                  </router-link>

                </li>

                <li>
                  <button
                    class="dropdown-item"
                    @click="deleteItem(slotProps.data.id)">
                    {{ $t("Cars.delete") }}
                    <i class="fas fa-trash-alt custom-icon edit"></i>
                  </button>
                </li>

                <li>
                    <router-link :to="DropDownManagers.path + '/' + slotProps.data[DropDownManagers.id]" class="table_link dropdown-item" @click="viewItem(slotProps.data.id)">
                      {{ $t("Cars.view_data") }}
                      <i class="fas fa-eye custom-icon details"></i>
                  </router-link>
                </li>
              </ul>
            </div>
          </template>
        </Column>

        <!-- this dropdown have all dialogs inside employee page -->



        <!-- if i need to add Column for order id -->

        <Column v-if="showOrderId">
          <template #body="slotProps">
            <router-link
              :to="{
                name: 'orderDetails',
                params: { orderId: slotProps.data.id },
              }"
            >
              <div class="table-list">
                <i class="fas fa-ellipsis-h"></i>
                <!-- <p>{{ slotProps.data.id }}</p> -->
              </div>
            </router-link>
          </template>
        </Column>

      </DataTable>

      <!-- Reservations Dialog -->
      <Dialog v-model:visible="showReservationsDialog" modal :draggable="false" class="custum_dialog_width">

        <h3 class="main-title md mb-4">{{ $t('tables.reservations_list') }}</h3>

        <div class="times-grid">
          <button 
            v-for="(item, i) in reservationsList" 
            :key="i" 
            type="button" 
            :class="['time-chip', { 'selected': item.isBooked }]"
          >
            <span>{{ item.time }}</span>
            <i class="fas fa-check-circle" v-if="item.isBooked"></i>
          </button>
        </div>

      </Dialog>

    </div>
</template>

<script setup>
/******************* Import *******************/


/******************* Data *******************/

// Paginator
const currentPage = ref(1);

// Reservations dialog state
const showReservationsDialog = ref(false);
const selectedRowId = ref(null);
const reservationsList = ref([]);

// Open reservations with static data for now
const openReservations = (rowId) => {
  selectedRowId.value = rowId;
  // Static times (simulate API response)
  reservationsList.value = [
    { time: '٠٩:٠٠ ص', isBooked: true },
    { time: '٠٩:٣٠ ص', isBooked: false },
    { time: '١٠:٠٠ ص', isBooked: true },
    { time: '١٠:٣٠ ص', isBooked: true },
    { time: '١١:٠٠ ص', isBooked: false },
    { time: '١١:٣٠ ص', isBooked: false },
    { time: '١٢:٠٠ م', isBooked: false },
    { time: '١٢:٣٠ م', isBooked: true },
    { time: '٠١:٠٠ م', isBooked: false },
    { time: '٠١:٣٠ م', isBooked: true },
    { time: '٠٢:٠٠ م', isBooked: false },
    { time: '١١:٣٠ م', isBooked: true }
  ];
  showReservationsDialog.value = true;
};

// Navigate to addAppointment page with table id
const navigateToAppointment = (tableId) => {
  navigateTo({
    path: '/tables/addAppointment',
    query: { tableId: tableId }
  });
};

/******************* Provide && Inject *******************/

/******************* Emits *******************/

const emit = defineEmits(['deleteItem', 'editItem', 'viewItem', 'refreshData']);

/******************* Props *******************/
const props = defineProps({
    products: Array,
    columns: Array,
    filters: Object,
    currency: String,
    rows: Number,
    showSearch: {
      type: Boolean,
      default: false, // Show search by default, change to false when you want to hide it
    },

    sortable: {
      type: Boolean,
      default: true, // show sortable by default, change to false when you want to hide it
    },

    showImage: {
      type: Boolean,
      default: false, // show image by default, change to false when you want to hide it
    },

    showOrderId: {
      type: Boolean,
      default: false, // hide showOrderId by default, change to true when you want to show it
    },

    actionsHeader: {
        type: String,
        default: '', // header for actions column when using slot
    },

    routeTable: {
        type: Object, // pass object with path and header (legacy - prefer using actions slot)
    },

    DropDownManagers: {
        type: Object, // pass object with path and header
    },

    DropDownbranches: {
        type: Boolean,
        default: false, // hide dropdown by default, change to true when you want to show it
    },

    DropDownemployees: {
        type: Boolean,
        default: false, // hide dropdown by default, change to true when you want to show it
    }
});

/******************* Methods *******************/

const deleteItem = (id) => {
  itemToDelete.value = id;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    // API Call - replace with your actual endpoint
    const response = await $fetch(`/api/tables/${itemToDelete.value}`, {
      method: 'DELETE'
    });
    
    // Success - emit to parent and refresh data
    emit('deleteItem', itemToDelete.value);
    emit('refreshData');
    
    // Close dialog and reset
    showDeleteDialog.value = false;
    itemToDelete.value = null;
    
    // Optional: Show success message
    // useToast().success('تم حذف الطاولة بنجاح');
    
  } catch (error) {
    console.error('Delete error:', error);
    // Optional: Show error message
    // useToast().error('حدث خطأ أثناء حذف الطاولة');
  } finally {
    isDeleting.value = false;
  }
};

const editItem = (id) => {
  emit('editItem', id);
};

const viewItem = (id) => {
  emit('viewItem', id);
};

// Expose methods to parent if needed
defineExpose({
  openReservations
});

</script>

<style lang="scss" scoped>
:deep(.p-column-header-content) {
    justify-content: center;
}
:deep(.p-datatable) {
    thead, tbody, tfoot, tr, td, th {
        text-align: center;
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff; 
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        white-space: nowrap;
    }
}

:deep(.main-table .p-datatable-wrapper) {
    border-radius: 8px;
  :deep(.p-datatable .p-column-header-content) {
    justify-content: center;
  }
}

// Status Badges
.status-badge {
  padding: 7px 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  &.status-available {
    background-color: #305539;
  }
  &.status-reserved {
    background-color: #FFFFFF40;
  }
  &.status-accepted {
    color: #4ADE80;
  }
  &.status-rejected {
    color: #F87171;
  }
  .action-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s;
    white-space: nowrap;
    
    i {
      font-size: 13px;
    }
    
    &.btn-edit {
      background-color: #1e1e1e;
      color: #fff;
      border: none;
      &:hover { background-color: #2a2a2a; }
    }
    
    &.btn-view {
      background-color: #1e1e1e;
      color: #fff;
      border: none;
      &:hover { background-color: #2a2a2a; }
    }
  }
}

// Table Image
.datatable-image-custom {
  width: 70px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

// Generic chips
.chip {
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}
.chip-dark { background-color: #1e1e1e; color: #fff; }

.chip-dark {
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #2a2a2a !important;
  }
}

/* Reservations Dialog */
// :deep(.reservations-dialog) {
//   .p-dialog {
//     background: #1a1a1a;
//     border-radius: 16px;
//     overflow: hidden;
//   }
  
//   .p-dialog-header {
//     background: #1a1a1a;
//     border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//     padding: 20px 24px;
//   }
  
//   .p-dialog-content {
//     background: #1a1a1a;
//     padding: 24px;
//   }
  
//   .p-dialog-header-close {
//     color: #fff;
    
//     &:hover {
//       background: rgba(255, 255, 255, 0.1);
//     }
//   }
// }

.dialog-title {
  color: #fff;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: right;
}

.times-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.time-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2b2b2b;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  
  span {
    font-weight: 500;
  }
  
  i {
    color: #666;
    font-size: 14px;
    margin-inline-start: 10px;
  }
  
  &:hover {
    background: #353535;
  }
}
</style>
