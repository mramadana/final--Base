<template>
    <section>
        <div v-if="!loading">

            <div class="slider" dir="ltr" v-if="slider?.length">
                <Carousel :value="slider" :responsiveOptions="responsiveOptions" :autoplayInterval="5000" :transitionInterval="3000" class="dir-slider">
                    <template #item="slotProps">
                        <div class="slider-item">
                            <img :src="slotProps.data.image" loading="lazy" alt="slider-img" class="slider-img">
                            <div class="slider_text" v-if="props.slider_title">

                                <div class="text">{{ slotProps.data.title }}</div>

                                <div class="text">{{ slotProps.data.description }}</div>

                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>
            <div  v-else>
                <GlobalNoData :noData_text="$t('Global.imgs')" />
            </div>
            
        </div>
        
        <div class="position-relative" v-if="loading">
            <Skeleton width="100%" height="480px" class="slider-img rounded-0"></Skeleton>
            <img  loading="lazy" src="@/assets/images/black_logo.png" alt="image" class="login_logo sm position">
        </div>
    </section>
</template>


<script setup>
    const props = defineProps({
    slider: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false,
    },

    slider_title: {
        type: Boolean,
        default: false,
    }

});

</script>


<style lang="scss">
    .slider-item {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        .slider_text {
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 30%);
            width: 100%;
            height: 100%;
            color: #fff;
            gap: 10px;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: end;
            .text {
                 font-size: 18px;
                 padding: 0 10px;
                transform: translatey(-70px);
                @media (max-width: 550px) {
                    transform: translatey(-50px);
                    font-size: 14px;
                }
            }
        }
    }
</style>