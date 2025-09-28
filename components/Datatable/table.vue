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

        <div v-for="(col, index) in columns" :key="col.field">
          <Column
            :field="col.field"
            :header="col.header"
            :sortable="sortable"
            v-if="col.field !== 'abilities'"
          >
            <!--  if i need to add image it index is one in my data table  -->
            <template v-if="index === 1 && showImage" #body="slotProps">
              <img
                :src="slotProps.data.image"
                loading="lazy"
                class="shadow-4 datatable-image-custom"
              />
            </template>
          </Column>
        </div>


        <!--*********** Route To Details ***********-->
        <Column :field="routeTable.header" :header="routeTable.header" v-if="routeTable">
            <template #body="slotProps">
                <router-link :to="routeTable.path + '/' + slotProps.data[routeTable.id]" class="table_link">
                    <span v-if="routeTable.proptext">{{ routeTable.proptext }}</span>
                    <span class="table-icon" v-if="!routeTable.icon"><i class="fas fa-ellipsis-h"></i></span>
                </router-link>
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
    </div>
</template>

<script setup>
/******************* Import *******************/


/******************* Data *******************/

// Paginator
const currentPage = ref(1);

/******************* Provide && Inject *******************/

/******************* Emits *******************/

const emit = defineEmits(['deleteItem', 'editItem', 'viewItem']);

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

    routeTable: {
        type: Object, // pass object with path and header
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
  emit('deleteItem', id);
};

const editItem = (id) => {
  emit('editItem', id);
};

const viewItem = (id) => {
  emit('viewItem', id);
};

</script>
