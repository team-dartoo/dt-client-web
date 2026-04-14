const CHAT_BASE = import.meta.env.VITE_CHAT_BASE_URL;
const ACCESS_TOKEN_KEY = "accessToken";

const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const throwIfNotOk = async (res) => {
  if (res.ok) return;
  let message = "요청 실패";
  try {
    const body = await res.json();
    message = body.message || body.detail || body.error || message;
  } catch {
    /* ignore parse error */
  }
  const err = new Error(message);
  err.status = res.status;
  throw err;
};

export const chatApi = {
  async listConversations() {
    const res = await fetch(`${CHAT_BASE}/conversations`, {
      headers: headers(),
    });
    await throwIfNotOk(res);
    const data = await res.json();
    return data.conversations || [];
  },

  async createConversation(title = null) {
    const body = {};
    if (title) body.title = title;
    const res = await fetch(`${CHAT_BASE}/conversations`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    await throwIfNotOk(res);
    return res.json();
  },

  async getConversation(conversationId) {
    const res = await fetch(`${CHAT_BASE}/conversations/${conversationId}`, {
      headers: headers(),
    });
    await throwIfNotOk(res);
    return res.json();
  },

  async sendMessage(conversationId, content) {
    const res = await fetch(
      `${CHAT_BASE}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ content }),
      },
    );
    await throwIfNotOk(res);
    return res.json();
  },
};
