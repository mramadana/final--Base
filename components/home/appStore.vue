<template>
    <section>
        <div class="inner-app mb-5">
            <div class="container">
                <div class="row d-flex align-items-center">
                    <div class="col-12 col-xl-6">
                        <div class="app-info">
                            <h2 class="main-title lg fw-500 mb-4 color-wh" v-if="!loading">
                                {{ banner_home.description }}
                            </h2>
                            <Skeleton class="rounded-2 mb-4" width="180px" height="15px"  v-if="loading"></Skeleton>

                            <div class="app-btns">
                                <NuxtLink :to="banner_home.android_link" class="btn-app d-flex">
                                    <img src="@/assets/images/google-paly-img.png" alt="google-img" class="store-img" />
                                </NuxtLink>
                                <NuxtLink :to="banner_home.ios_link" class="btn-app d-flex">
                                    <img src="@/assets/images/app-store-img.png" alt="app-store" class="store-img"/>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                
                    <div class="col-12 col-xl-6">

                        <div class="main-app-imgs">

                            <div class="frame-parent with-translate">
                                <img src="@/assets/images/frame-img.png" alt="frame-image" class="frame-shape">
                                <img :src="banner_home.image" alt="site-image" class="frame-child" v-if="!loading">
                                <Skeleton class="rounded-0 frame-child frame-skelton" v-if="loading"></Skeleton>
                            </div>
                            <div class="frame-parent">
                                <img src="@/assets/images/frame-img.png" alt="frame-image" class="frame-shape">
                                <img :src="banner_home.image1" alt="site-image" class="frame-child" v-if="!loading">
                                <Skeleton class="rounded-0 frame-child frame-skelton" v-if="loading"></Skeleton>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script setup>
    defineProps(['banner_home', 'loading'])
</script>





