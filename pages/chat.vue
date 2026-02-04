<template>
  <div class="chat-page">
    <div class="chat-container" :class="{ open: chatOpen, closed: !chatOpen }">

      <div class="chat-body" v-if="chatOpen">
        <div class="messages-container" ref="messagesContainer">
          <div class="chat-message test" v-for="(msg, index) in messages" :key="index">
            <div class="w-100" :class="msg.sender_type == 'Provider' ? 'provider' : 'user'">
              <div class="d-flex" :dir="user?.id == msg.sender_id ? 'rtl' : 'ltr'">
                <img
                  v-if="user?.id != msg.sender_id"
                  src="~/assets/images/Logo.svg"
                  class="chatLogo msg-avatar"
                  loading="lazy"
                  alt="chatLogo"
                >
                <div class="bubble" style="white-space: break-spaces;">
                  <p :class="user?.id != msg.sender_id ? 'text-black' : ''">{{ msg.body }}</p>
                </div>
                <img
                  v-if="user?.id == msg.sender_id"
                  :src="user?.avatar || '/Logo.svg'"
                  class="chatLogo msg-avatar"
                  loading="lazy"
                  alt="avatar"
                  onerror="this.src='/Logo.svg'"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <Textarea
            v-model="newMessage"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact.prevent="newline"
            :placeholder="$t('enterMsg')"
            class="noRezie chat-textarea"
          />
          <Button
            icon="pi pi-send"
            @click="sendMessage"
            class="p-button-rounded p-button-info chat-send-btn"
            aria-label="send"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </Button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  name: 'settings.chat',
});


import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();

const globalStore = useGlobalStore();
const pageHeadTitle = ref(t('settings.chat'));
globalStore.title = pageHeadTitle.value;

const route = useRoute();
const router = useRouter();

const chatOpen = ref(true);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);

const store = useAuthStore();
const { token, user } = storeToRefs(store);

const { errorToast } = toastMsg();

const config = computed(() => ({
  headers: { Authorization: `Bearer ${token.value}` },
}));

const axios = useApi();

const SOCKET_URL = 'https://reevent-sa.com:4930';
const socket = ref(null);

/* =========================
 * ✅ sessionStorage ONLY (بدون router.replace خالص)
 * ========================= */
const CHAT_QUERY_STORAGE_KEY = 'chat:last_room_query';

// هنا هنحط آخر قيمة محفوظة بشكل reactive
const savedRoomQuery = ref(null); // { key: 'id'|'reservation_id', value: '...' } | null

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj?.key || !obj?.value) return null;
    return { key: obj.key, value: String(obj.value) };
  } catch {
    return null;
  }
};

const readFromSession = () => {
  if (!import.meta.client) return null;
  return safeParse(sessionStorage.getItem(CHAT_QUERY_STORAGE_KEY));
};

const writeToSession = (key, value) => {
  if (!import.meta.client) return;
  const payload = JSON.stringify({ key, value: String(value) });
  sessionStorage.setItem(CHAT_QUERY_STORAGE_KEY, payload);
  savedRoomQuery.value = { key, value: String(value) };
};

// ✅ دي بتضيف الـ param للـ URL "بدون" أي navigation (مفيش loop)
const syncUrlWithSession = () => {
  if (!import.meta.client) return;

  // لو الـ query موجود بالفعل مش محتاجين نعمل حاجة
  if (route.query.id || route.query.reservation_id) return;

  const saved = savedRoomQuery.value || readFromSession();
  if (!saved?.key || !saved?.value) return;

  // نضيفه للـ URL من غير router.replace
  const url = new URL(window.location.href);
  url.searchParams.set(saved.key, saved.value);
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
};

// ✅ الغرفة المعتمدة: من query لو موجود، وإلا من sessionStorage
const activeRoomQuery = computed(() => {
  const id = route.query.id;
  const reservationId = route.query.reservation_id;

  if (id) return { key: 'id', value: String(id) };
  if (reservationId) return { key: 'reservation_id', value: String(reservationId) };

  return savedRoomQuery.value; // fallback
});

// id الغرفة اللي هنستخدمه في API/socket
const roomId = computed(() => activeRoomQuery.value?.value || null);

// ✅ حفظ فقط (مفيش أي تعديل للراوت هنا)
watch(
  () => [route.query.id, route.query.reservation_id],
  ([id, reservationId]) => {
    if (!import.meta.client) return;

    if (id) writeToSession('id', id);
    else if (reservationId) writeToSession('reservation_id', reservationId);
    else {
      // لو اتشال من الراوت، هنخليه يرجع للـ URL (بدون navigation)
      // وهنفضل مستخدمين الـ savedRoomQuery داخليًا
      syncUrlWithSession();
    }
  },
  { immediate: true }
);

const toggleChat = () => {
  if (chatOpen.value) {
    socket.value?.emit('exitChat', {});
    chatOpen.value = false;
    router.back();
  } else {
    chatOpen.value = true;
    enterChat();
  }
};

const enterChat = () => {
  if (roomId.value) {
    socket.value?.emit('enterChat', { room_id: roomId.value });
  }
};

// ملغى: إنشاء الغرفة يتم من مكان آخر
const createRoom = async () => null;

const getMessages = async (roomId) => {
  if (!roomId) return;
  try {
    let allMessages = [];
    let loadMore = true;
    let oldestId = null;

    while (loadMore) {
      const params = oldestId !== null ? { oldest_id: oldestId } : {};
      const res = await axios.get(`chat/get-room-messages/${roomId}`, {
        ...config.value,
        params,
      });
      const data = res?.data;
      if (data?.key !== 'success' || !data?.data?.messages) break;

      const batch = data.data.messages;
      const loadOldMessages = data.data.load_old_messages;

      allMessages = [...batch, ...allMessages];

      if (loadOldMessages === 1 && batch.length > 0) {
        oldestId = Math.min(...batch.map((m) => m.id));
        loadMore = true;
      } else {
        loadMore = false;
      }
    }

    allMessages.sort((a, b) => a.id - b.id);
    messages.value = allMessages;
    nextTick(() => scrollToBottom());
  } catch (e) {
    errorToast(e?.response?.data?.msg || e?.response?.data?.message || 'حدث خطأ في تحميل الرسائل');
  }
};

const scrollToBottom = () => {
  const el = messagesContainer.value;
  if (el) el.scrollTop = el.scrollHeight;
};

const newline = () => {
  newMessage.value += '\n';
};

const sendMessage = () => {
  const body = (newMessage.value || '').trim();
  if (!body) return;
  if (socket.value && roomId.value) {
    socket.value.emit('sendMessage', {
      receiver_id: null,
      receiver_type: 'User',
      room_id: roomId.value,
      type: 'text',
      body,
    });
    newMessage.value = '';
    nextTick(() => scrollToBottom());
  }
};

onMounted(async () => {
  if (!import.meta.client) return;

  // ✅ جهز الـ savedRoomQuery من sessionStorage مرة واحدة
  savedRoomQuery.value = readFromSession();

  // ✅ لو الراوت اتشال منه الـ param، ضيفه للـ URL بدون navigation
  syncUrlWithSession();

  // ✅ لو لسه roomId مش موجود في route، هيجي من sessionStorage (activeRoomQuery)
  if (roomId.value) {
    await getMessages(roomId.value);
  }

  const { io } = await import('socket.io-client');
  socket.value = io(SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'],
    query: {
      sender_id: user.value?.id,
      sender_type: 'Provider',
      sender_name: user.value?.name || '',
      avatar: user.value?.avatar || '',
      lang: locale.value || 'ar',
    },
  });

  socket.value.on('connect', () => {
    console.log('connected ******************');
    enterChat();
  });

  socket.value.on('sendMessageRes', (data) => {
    messages.value.push(data);
    nextTick(() => scrollToBottom());
  });

  if (roomId.value) {
    socket.value?.emit('enterChat', { room_id: roomId.value });
  }
});

onBeforeUnmount(() => {
  socket.value?.emit('exitChat', {});
  socket.value?.disconnect();
});
</script>

<style lang="scss" scoped>
// .chat-page {
//   min-height: 100vh;
//   background: #252525;
//   display: flex;
//   align-items: flex-end;
//   justify-content: flex-end;
//   padding: 0;
// }

.chat-container {
  width: 100%;
  height: 560px;
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease;
}

.chat-container.closed {
  height: 56px;
}

.chat-container.open {
  height: 560px;
}

@media (max-width: 520px) {
  .chat-container.open {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
  }
}

.chat-header {
  background-color: #3a3a3a;
  color: #fff;
  padding: 12px 16px;
  font-weight: bold;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.alasbaghArabicname {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-header .close.btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  cursor: pointer;
}

.chat-header .close.btn:hover {
  color: #fff;
}

.chat-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #252525;
  scroll-behavior: smooth;
}

.chat-message {
  margin-bottom: 12px;
}

.chat-message .w-100.provider {
  display: flex;
  justify-content: flex-start;
}

.provider {
  .msg-avatar {
    display: none;
  }
}

.user {
  .d-flex {
    flex-direction: row !important;
  }
}

.chat-message .w-100:not(.provider) {
  display: flex;
  justify-content: flex-end;
}

.chat-message .d-flex {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 85%;
}

.chat-message .w-100.customer .d-flex {
  flex-direction: row;
}

.chat-message .w-100:not(.customer) .d-flex {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #3a3a3a;
}

.chat-message .w-100.customer .msg-avatar {
  background: #3d3d3d;
}

.chat-message .w-100:not(.customer) .msg-avatar {
  background: linear-gradient(135deg, #e67e22 0%, #f1c40f 100%);
}

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  // max-width: 75%;
  word-wrap: break-word;
}

.chat-message .w-100.customer .bubble {
  background-color: #3d3d3d;
  color: #fff;
}

.chat-message .w-100.customer .bubble p.text-black {
  color: #fff !important;
}

.chat-message .w-100:not(.customer) .bubble {
  background-color: #4a4a4a;
  color: #e0e0e0;
}

.chat-message .w-100:not(.customer) .bubble p {
  color: #e0e0e0;
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  // border-top: 1px solid rgba(255, 255, 255, 0.08);
  background-color: #2d2d2d;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.chat-textarea {
  flex: 1;
  background-color: #3a3a3a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px !important;
  color: #e0e0e0 !important;
  padding: 10px 16px !important;
  min-height: 44px !important;
  resize: none !important;
  box-shadow: none !important;
}

.chat-textarea::placeholder {
  color: #888;
}

.chat-send-btn {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  background: #3a3a3a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  border-radius: 12px !important;
}

.chat-send-btn:hover {
  background: #4a4a4a !important;
}

.chat-send-btn .fa-paper-plane {
  font-size: 16px;
}

.chatLogo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 50%;
  background: #3a3a3a;
}

.company {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  text-align: right;
}

.alasbagh {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  text-align: right;
}

.noRezie {
  resize: none;
}
</style>
