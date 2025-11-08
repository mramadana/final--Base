<template>

    <div>
        <div class="main-table skilton_table">
          <DataTable :value="SkeletonProducts">

            <!-- Header Columns -->
      
            <!-- Body Columns -->
            <Column class="static_column" field="code" v-for="col in SkeletonProducts" :key="col" :header="$t('Table.Loading')">
              <template #body>
                <Skeleton></Skeleton>
              </template>
            </Column>
      
          </DataTable>
        </div>
    </div>
    

</template>

<style lang="scss" scoped>

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

    .static_column {
        .p-column-title {
            font-size: 13px;
        }
    }
    
    .p-column-header-content {
        justify-content: center;
    }

    .skilton_table {
      .p-skeleton.p-component {
        height: 0.6rem !important;
      }
    }
</style>

<script setup>

  const props = defineProps({
    SkeletonProducts: {
      type: Array,
      required: true,
    },
  })
</script>




