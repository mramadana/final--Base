<template>
    <div>
        
        <div class="container">
            <div class="layout-form custom-width lg">
                <h1 class="main-title bold">{{ $t("Global.terms_and_conditions") }}</h1>

                <div class="main-title normal mt-3 about_disc" v-if="!loading" v-html="terms" >

                </div>

                <div v-if="loading">
                    <div v-for="i in 8" :key="i">
                        <Skeleton height=".5rem" width="80%" class="rounded-0 mb-2 mx-auto"></Skeleton>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>

definePageMeta({
    name: "Global.terms_and_conditions",
});


const loading = ref(true);

const { response } = responseApi();

const axios = useApi();

const terms = ref('');

const getTerms = async () => {
    loading.value = true;
    await axios.get(`terms`).then(res => {
    if (response(res) == "success") {
        terms.value = res.data.data;
    }
    loading.value = false;
    }).catch(err => {
        console.error(err);
    });
};

onMounted(() => {
    getTerms();
})

</script>

<style lang="scss">
    .about_disc {
        * {
            &:first-child {
                font-size: 16px;
                font-weight: bold;
            }
        }
    }
</style>
