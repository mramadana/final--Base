<template>
  <div>
    <div class="layout-form">
      <!-- Loading state while fetching user data -->
      <div v-if="loadingUserData" class="loading-state">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <p>{{ $t("users.loading_user_data") }}</p>
      </div>

      <div v-else>
        <div class="row">
          <div class="col-12 col-md-6">
            <!-- Customer name input -->
            <FormInput
              v-model:modelValue="name"
              name="name"
              type="text"
              :label="$t('Auth.customer_name')"
              :placeholder="$t('Auth.customer_name')"
              :hasIcon="true"
              icon="/_nuxt/assets/images/auth-img/user.svg"
              :with_icon="true"
              :readonly="true"
            />
          </div>

          <div class="col-12 col-md-6">
            <!-- Mobile number input with country dropdown -->
            <div class="form-group">
              <label class="label">
                {{ $t("Auth.mobile_number") }}
              </label>
              <div class="with_cun_select">
                <FormInput
                  ref="phoneInputRef"
                  v-model:modelValue="phone"
                  name="phone"
                  type="number"
                  :placeholder="$t('Auth.enter_mobile_number')"
                  :hasIcon="true"
                  icon="/_nuxt/assets/images/auth-img/mobile.svg"
                  :with_icon="true"
                  :readonly="true"
                />
                <GlobalCountryDropdown
                  v-model="selectedCountry"
                  :placeholder="$t('Auth.select_country')"
                  :disabled="true"
                />
              </div>
            </div>
          </div>

          <div class="col-12">
            <!-- Permissions -->
            <h4 class="main-title md mb-4">
              {{ $t("users.permissions") }}
            </h4>

            <!-- Loading state -->
            <div v-if="loadingPermissions" class="text-center py-4">
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span class="ms-2">{{ $t("users.loading_permissions") }}</span>
            </div>

            <!-- Permissions Sections -->
            <div v-else class="permissions-wrapper">
              <div
                v-for="(section, sectionIndex) in permissionSections"
                :key="sectionIndex"
                class="permission-section mb-4"
              >
                <!-- Section Title -->
                <h5 class="section-title mb-3">
                  {{ section.title }}
                </h5>

                <!-- Permissions in this section -->
                <div
                  class="permissions-section d-flex flex-wrap align-items-center gap-3"
                >
                  <div
                    v-for="(permission, permIndex) in section.permissions"
                    :key="permIndex"
                    class="mb-3"
                  >
                    <div
                      class="d-flex align-items-center justify-content-between payment-field"
                    >
                      <div class="check-text hint d-flex ml-4">
                        <div class="main-title mb-0">
                          {{ permission.title }}
                        </div>
                      </div>

                      <!-- Checkbox (disabled for view only) -->
                      <div class="radios form-group check-inner mb-0">
                        <div
                          class="d-flex align-items-center justify-content-between gap-3"
                        >
                          <label class="custom-radio custom-check">
                            <input
                              type="checkbox"
                              v-model="permission.is_selected"
                              class="d-none"
                              disabled
                            />
                            <span class="mark m-0">
                              <i class="fas fa-check icon"></i>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports and utilities
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const route = useRoute();
const userId = ref(route.query.id || route.params.id || null);

// Authentication
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const config = computed(() => ({
  headers: { Authorization: `Bearer ${token.value}` },
}));

// Form fields
const name = ref("");
const phone = ref("");
const loadingUserData = ref(false);

// Permissions data
const permissionSections = ref([]);
const loadingPermissions = ref(false);

// Fetch permissions from API
const fetchPermissions = async () => {
  loadingPermissions.value = true;
  try {
    const res = await axios.get("provider/admins/permissions", config.value);
    if (response(res) === "success") {
      permissionSections.value = res?.data?.data || [];
    } else {
      errorToast(res?.data?.msg || t("users.failed_to_load_permissions"));
    }
  } catch (error) {
    console.error("Error fetching permissions:", error);
    errorToast(t("users.failed_to_load_permissions"));
  } finally {
    loadingPermissions.value = false;
  }
};

// success response
const { response } = responseApi();

// Toast
const { errorToast } = toastMsg();

// Axios
const axios = useApi();

// Countries
const selectedCountry = ref(null);

// FormInput ref for phone
const phoneInputRef = ref(null);

// Fetch user data from API
const fetchUserData = async () => {
  if (!userId.value) {
    errorToast(t("users.user_id_required"));
    navigateTo("/users");
    return;
  }

  loadingUserData.value = true;
  try {
    const res = await axios.get(
      `provider/admins/${userId.value}/show`,
      config.value
    );

    if (response(res) === "success") {
      const userData = res.data.data;

      // Set form fields
      name.value = userData.name || "";
      phone.value = userData.phone || "";

      // Set country
      if (userData.country) {
        selectedCountry.value = {
          id: userData.country.id,
          key: userData.country.key,
          name: userData.country.name,
          image: userData.country.image,
        };
      }

      // Set permissions from API response
      if (userData.permissions && Array.isArray(userData.permissions)) {
        // First, fetch all available permissions
        await fetchPermissions();

        // Then, map the user's selected permissions
        userData.permissions.forEach((userSection) => {
          const section = permissionSections.value.find(
            (s) => s.title === userSection.title
          );
          if (section) {
            userSection.permissions.forEach((userPermission) => {
              const permission = section.permissions.find(
                (p) => p.slug === userPermission.slug
              );
              if (permission) {
                permission.is_selected = userPermission.is_selected;
              }
            });
          }
        });
      } else {
        // If no permissions in response, just fetch available permissions
        await fetchPermissions();
      }
    } else {
      errorToast(res?.data?.msg || t("Auth.fetch_failed"));
      navigateTo("/users");
    }
  } catch (error) {
    console.error("Fetch user error:", error);
    errorToast(t("Auth.fetch_failed"));
    navigateTo("/users");
  } finally {
    loadingUserData.value = false;
  }
};

// OnMounted - Get user data on page load
onMounted(() => {
  fetchUserData();
});

// Set page title
const globalStore = useGlobalStore();
globalStore.title = t("users.users");
globalStore.titleIcon = "fa-solid fa-angle-left";
globalStore.subTitleIcon = "fa-solid fa-angle-left";
globalStore.titleLink = "/users";
globalStore.subtitle = t("sideMenu.view_users");
globalStore.subSubTitle = t("users.user_details");

// Page meta
definePageMeta({
  name: "users.user_details",
  layout: "default",
});
</script>

<style scoped>
.with_cun_select.is-invalid {
  border: 1px solid #e74c3c !important;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
  border-radius: 8px;
}

.main_input.is-invalid {
  border: 1px solid #e74c3c !important;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}
</style>

<style lang="scss" scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    border: 0.25em solid #f3f3f3;
    border-top: 0.25em solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.permissions-wrapper {
  .permission-section {
    border-bottom: 1px solid #ffffff1a;
    padding-bottom: 20px;

    &:last-child {
      border-bottom: none;
    }

    .section-title {
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }
  }
}

.payment-field {
  padding: 20px 15px;
  background-color: #ffffff0f;
  border-radius: 10px;
  min-width: 200px;
  max-width: auto;

  @media (max-width: 550px) {
    min-width: 150px;
  }
}

.custom-radio {
  cursor: default; // Changed from pointer since it's disabled

  .mark {
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;

    .icon {
      display: none;
      color: #000;
      font-size: 12px;
    }
  }

  input:checked + .mark {
    background: #848484;
    border-color: #848484;

    .icon {
      display: block;
      color: #fff;
    }
  }

  input:disabled + .mark {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.main_input,
.with_cun_select,
.dropdown_card,
.dropdown_card .p-dropdown {
  background-color: #262626 !important;
}

.dropdown_card :deep(.p-dropdown) {
  background-color: transparent;
}
</style>
