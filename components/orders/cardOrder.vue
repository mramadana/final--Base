<template>
    <div>
        <div class="row">
            <div class="col-12 col-md-6 mb-5" v-for="order in orders" :key="order.id">
                <div class="order-box" :style="{ backgroundColor: boxColor }" :class="additionalClasses">
                    <div class="info d-flex">
                        <img :src="order.car_image" loading="lazy" alt="order-img" class="order-img">
                        <div class="w-100">
                            <div class="head-title">
                                <h3 class="main-title mb-0">
                                    <span>{{ order.order_number }}</span>
                                </h3>
                                <div v-if="order.isProduct" class="hint">
                                    <span class="shape"></span>
                                    {{ order.type }}</div>
                            </div>
                            <div class="order-info main-disc">

                                <div class="since">
                                    <i class="fa-regular fa-clock"></i>
                                    {{ $t('order.since') }} {{ order.since }}
                                </div>
                                <div class="order-status since">
                                    {{ $t('order.status') }} :
                                    <div class="hint-status">
                                        <img src="@/assets/images/box-time.svg" loading="lazy" alt="box-time">
                                        <span class="status-text" :class="{'iSblue' : isNew}">
                                            {{ order.status_text }}
                                        </span>
                                    </div>
                                    
                                </div>
                                <div class="user-name since">
                                    <i class="fa-regular fa-user"></i>
                                    {{ order.user_name }}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="footer-order">
                        <!-- <div class="price iSblue" v-if="order.isProduct"> -->
                        <div class="price iSblue" v-if="isNew">
                            <img src="@/assets/images/dollar-circle.svg" loading="lazy" alt="dollar-circle">
                            {{ $t('Global.price') }} : {{ order.total }} دينار
                        </div>
                        <nuxt-link class="order-link custom-btn d-inline-block" :to="'/orders/orderDetails/' + order.id">
                            {{ $t('order.order_details') }}
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        orders: Array,
        additionalClasses: {
            type: [String, Object, Array],
            default: () => []
        },

        isNew: {
            type: Boolean,
            default: false
        }
    })
</script>

<style lang="scss" scoped>
    .order-box {
        padding: 16px;
        border-radius: 10px;
        display: flex;
        transition: transform .3s ease-out;
        flex-direction: column;
        .order-img {
            width: 100px;
            height: 80px;
            object-fit: cover;
            border-radius: 10px;
            margin-inline-end: 20px;
            @media (max-width: 768px) {
                margin-inline-end: 0;
                width: 100%;
                margin: 0 auto 20px;
            }
        }
        .info {
            width: 100%;
            text-align: start;
            padding-bottom: 5px;
            margin-bottom: 15px;
            border-bottom: 1px solid #dddddd;
            @media (max-width: 350px) {
                flex-wrap: wrap;
                gap: 10px;
            }
            .head-title {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                .hint {
                    background-color: #757575;
                    color: #fff;
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    display: inline-block;
                    .shape {
                        width: 8px;
                        height: 8px;
                        background-color: #fff;
                        border-radius: 50%;
                        display: inline-block;
                        margin-inline-end: 5px;
                    }
                }
            }
            .order-info {

                .status {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #989898;
                    font-size: 14px;
                    .hint-status {
                        color: var(--main);
                    }
                    
                    @media (max-width: 1024px) {
                       font-size: 13px;
                    }
                }
                .since {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    margin-bottom: 5px;
                    font-size: 13px;
                }
                .hint-status {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
            }
        }

        .order-link {
                min-width: 105px;
                min-height: 30px;
                font-size: 13px;
                padding: 6px 10px;
                margin-inline-start: auto;
        }

        .main-title {
            @media (max-width: 768px) {
                font-size: 14px;
            }
        }
    }

    .price {
        font-size: 14px;
    }

    .footer-order {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
</style>