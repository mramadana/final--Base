<template>
  <div class="chat-page" dir="rtl">
    <div class="chat-container" :class="{ open: chatOpen, closed: !chatOpen }">

      <div class="chat-body" v-if="chatOpen">
        <div class="messages-container" ref="messagesContainer">
          <div class="chat-message test" v-for="(msg, index) in messages" :key="index">
            <div class="w-100" :class="{ 'customer': user?.id != msg.sender_id }">
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
  name: 'chat',
});

const route = useRoute();
const router = useRouter();
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

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

// id الغرفة من الراوت: id أو reservation_id (مثلاً chat?reservation_id=53)
const roomId = computed(() => route.query.id || route.query.reservation_id);

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
    const res = await axios.get(`chat/get-room-messages/${roomId}`, {
      ...config.value,
      params: { per_page: 1 },
    });
    const data = res?.data;
    if (data?.key === 'success' && data?.data?.messages?.data) {
      messages.value = [...(data.data.messages.data || [])].reverse();
      nextTick(() => scrollToBottom());
    }
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
      receiver_type: 'provider',
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

  // جلب الرسائل فور دخول الصفحة: chat/get-room-messages/{id}?per_page=1
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
      sender_type: 'User',
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

.chat-message .w-100.customer {
  display: flex;
  justify-content: flex-start;
}

.chat-message .w-100:not(.customer) {
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
  max-width: 75%;
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
//   border-top: 1px solid rgba(255, 255, 255, 0.08);
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
