import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { personById, type Gender } from "@/data/people";

export type Tab = "home" | "nearby" | "matches" | "relations" | "profile";
export type RelStatus = "none" | "waiting" | "permanent";

export type Me = {
  name: string;
  phone: string;
  age: number;
  gender: Gender;
  pin: string;
  bio: string;
  handle: string;
  photo: string | null;
};

export type ChatMessage = {
  id: string;
  from: "me" | "them" | "system";
  text: string;
  at: number;
  kind?: "text" | "voice";
  audio?: string;
};

export const MESSAGE_LIMIT = 5;

export type Account = {
  phone: string;
  username: string;
  password: string;
  me: Me;
  likes: string[];
  skips: string[];
  matches: string[];
  chats: Record<string, ChatMessage[]>;
  rel: Record<string, RelStatus>;
  read: Record<string, number>;
  seenNotes: string[];
  blocked: string[];
  muted: string[];
};

type Persisted = {
  loggedIn: boolean;
  me: Me;
  accounts: Account[];
  likes: string[];
  skips: string[];
  matches: string[];
  chats: Record<string, ChatMessage[]>;
  rel: Record<string, RelStatus>;
  read: Record<string, number>;
  seenNotes: string[];
  blocked: string[];
  muted: string[];
};

type State = Persisted & {
  tab: Tab;
  activeChat: string | null;
  matchPop: string | null;
  setTab: (tab: Tab) => void;
  openChat: (id: string | null) => void;
  clearMatchPop: () => void;
  login: (patch: Partial<Me>) => void;
  registerAccount: (input: { phone: string; username: string; password: string; me: Me }) => string | null;
  signIn: (id: string, password: string) => string | null;
  logout: () => void;
  updateMe: (me: Me) => void;
  like: (id: string) => void;
  unlike: (id: string) => void;
  skip: (id: string) => void;
  send: (id: string, text: string) => void;
  propose: (id: string) => void;
  markRead: (id: string) => void;
  seeNote: (id: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  sendVoice: (id: string, audio: string) => void;
  block: (id: string) => void;
  unblock: (id: string) => void;
  mute: (id: string) => void;
  unmute: (id: string) => void;
};

const defaultMe: Me = {
  name: "",
  phone: "",
  age: 0,
  gender: "Male",
  pin: "",
  bio: "",
  handle: "",
  photo: null,
};

const emptySocial = {
  likes: [] as string[],
  skips: [] as string[],
  matches: [] as string[],
  chats: {} as Record<string, ChatMessage[]>,
  rel: {} as Record<string, RelStatus>,
  read: {} as Record<string, number>,
  seenNotes: [] as string[],
  blocked: [] as string[],
  muted: [] as string[],
};

function packAccount(state: Persisted, password: string): Account {
  return {
    phone: state.me.phone,
    username: state.me.handle,
    password,
    me: state.me,
    likes: state.likes,
    skips: state.skips,
    matches: state.matches,
    chats: state.chats,
    rel: state.rel,
    read: state.read,
    seenNotes: state.seenNotes,
    blocked: state.blocked ?? [],
    muted: state.muted ?? [],
  };
}

function memoryStorage(): Storage {
  const bag = new Map<string, string>();
  return {
    getItem: (key) => bag.get(key) ?? null,
    setItem: (key, value) => {
      bag.set(key, value);
    },
    removeItem: (key) => {
      bag.delete(key);
    },
    clear: () => bag.clear(),
    key: (index) => Array.from(bag.keys())[index] ?? null,
    get length() {
      return bag.size;
    },
  };
}

function nextId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sentByMe(messages: ChatMessage[] | undefined): number {
  return (messages ?? []).filter((message) => message.from === "me").length;
}

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      me: defaultMe,
      accounts: [],
      likes: [],
      skips: [],
      matches: [],
      chats: {},
      rel: {},
      read: {},
      seenNotes: [],
      blocked: [],
      muted: [],
      tab: "home",
      activeChat: null,
      matchPop: null,
      setTab: (tab) => set({ tab, activeChat: null }),
      openChat: (id) => set({ activeChat: id }),
      clearMatchPop: () => set({ matchPop: null }),
      login: (patch) => set((state) => ({ loggedIn: true, me: { ...state.me, ...patch } })),
      registerAccount: ({ phone, username, password, me }) => {
        const accounts = get().accounts;
        const handle = username.trim();
        if (accounts.some((item) => item.phone === phone)) return "This mobile number is already registered.";
        if (accounts.some((item) => item.username.toLowerCase() === handle.toLowerCase())) {
          return "That username is taken.";
        }
        const next: Account = {
          phone,
          username: handle,
          password,
          me: { ...me, phone, handle },
          ...emptySocial,
        };
        set({
          accounts: [...accounts, next],
          loggedIn: true,
          me: next.me,
          ...emptySocial,
          tab: "home",
          activeChat: null,
        });
        return null;
      },
      signIn: (id, password) => {
        const key = id.trim().toLowerCase();
        const account = get().accounts.find(
          (item) => item.username.toLowerCase() === key || item.phone === id.trim(),
        );
        if (!account || account.password !== password) return "Username or password is wrong.";
        set({
          loggedIn: true,
          me: account.me,
          likes: account.likes,
          skips: account.skips,
          matches: account.matches,
          chats: account.chats,
          rel: account.rel,
          read: account.read,
          seenNotes: account.seenNotes ?? [],
          blocked: account.blocked ?? [],
          muted: account.muted ?? [],
          tab: "home",
          activeChat: null,
        });
        return null;
      },
      logout: () =>
        set((state) => {
          const saved = state.accounts.map((item) =>
            item.username.toLowerCase() === state.me.handle.toLowerCase()
              ? { ...packAccount(state, item.password), phone: state.me.phone, username: state.me.handle }
              : item,
          );
          return { loggedIn: false, accounts: saved, activeChat: null, tab: "home" };
        }),
      updateMe: (me) =>
        set((state) => ({
          me,
          accounts: state.accounts.map((item) =>
            item.username.toLowerCase() === me.handle.toLowerCase() ? { ...item, me, phone: me.phone } : item,
          ),
        })),
      like: (id) => {
        const state = get();
        if (state.blocked.includes(id) || state.likes.includes(id)) return;
        const person = personById(id);
        if (!person) return;
        const matched = person.likesYou && !state.matches.includes(id);
        const chats = { ...state.chats };
        if (matched) {
          chats[id] = [
            ...(chats[id] ?? []),
            {
              id: nextId(),
              from: "them",
              text: `Hi, I am ${person.name}. We both liked each other.`,
              at: Date.now(),
            },
          ];
        }
        set({
          likes: [...state.likes, id],
          matches: matched ? [...state.matches, id] : state.matches,
          chats,
          matchPop: matched ? id : null,
        });
      },
      unlike: (id) =>
        set((state) => ({
          likes: state.likes.filter((item) => item !== id),
          matches: state.matches.filter((item) => item !== id),
          rel: { ...state.rel, [id]: "none" },
        })),
      skip: (id) =>
        set((state) => ({
          skips: state.skips.includes(id) ? state.skips : [...state.skips, id],
        })),
      send: (id, text) => {
        const clean = text.trim();
        if (!clean || get().blocked.includes(id)) return;
        const person = personById(id);
        if (!person) return;
        const status = get().rel[id] ?? "none";
        const mine = sentByMe(get().chats[id]);
        if (status !== "permanent" && mine >= MESSAGE_LIMIT) return;
        const reply = person.replies[mine % person.replies.length] ?? "";
        set((state) => ({
          chats: {
            ...state.chats,
            [id]: [
              ...(state.chats[id] ?? []),
              { id: nextId(), from: "me", text: clean, at: Date.now() },
            ],
          },
        }));
        if (status === "permanent" || mine + 1 < MESSAGE_LIMIT) {
          window.setTimeout(() => {
            if (!get().matches.includes(id)) return;
            set((state) => ({
              chats: {
                ...state.chats,
                [id]: [
                  ...(state.chats[id] ?? []),
                  { id: nextId(), from: "them", text: reply, at: Date.now() },
                ],
              },
            }));
          }, 700);
        }
      },
      propose: (id) => {
        const person = personById(id);
        if (!person) return;
        if ((get().rel[id] ?? "none") !== "none") return;
        if (sentByMe(get().chats[id]) < MESSAGE_LIMIT) return;
        set((state) => ({
          rel: { ...state.rel, [id]: "waiting" },
          chats: {
            ...state.chats,
            [id]: [
              ...(state.chats[id] ?? []),
              {
                id: nextId(),
                from: "system",
                text: "You chose Go to Relationship. Waiting for them to accept.",
                at: Date.now(),
              },
            ],
          },
        }));
        window.setTimeout(() => {
          if ((get().rel[id] ?? "none") !== "waiting") return;
          set((state) => ({
            rel: { ...state.rel, [id]: "permanent" },
            chats: {
              ...state.chats,
              [id]: [
                ...(state.chats[id] ?? []),
                {
                  id: nextId(),
                  from: "system",
                  text: `${person.name} accepted. This is now a permanent chat.`,
                  at: Date.now(),
                },
              ],
            },
          }));
        }, 1100);
      },
      markRead: (id) => set((state) => ({ read: { ...state.read, [id]: Date.now() } })),
      seeNote: (id) =>
        set((state) => ({
          seenNotes: state.seenNotes.includes(id) ? state.seenNotes : [...state.seenNotes, id],
        })),
      deleteMessage: (chatId, messageId) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: (state.chats[chatId] ?? []).filter((message) => message.id !== messageId),
          },
        })),
      sendVoice: (id, audio) => {
        if ((get().rel[id] ?? "none") !== "permanent") return;
        if (get().blocked.includes(id)) return;
        set((state) => ({
          chats: {
            ...state.chats,
            [id]: [
              ...(state.chats[id] ?? []),
              { id: nextId(), from: "me", text: "Voice", at: Date.now(), kind: "voice", audio },
            ],
          },
        }));
      },
      block: (id) =>
        set((state) => ({
          blocked: state.blocked.includes(id) ? state.blocked : [...state.blocked, id],
          muted: state.muted.filter((item) => item !== id),
          activeChat: state.activeChat === id ? null : state.activeChat,
        })),
      unblock: (id) =>
        set((state) => ({ blocked: state.blocked.filter((item) => item !== id) })),
      mute: (id) =>
        set((state) => ({
          muted: state.muted.includes(id) ? state.muted : [...state.muted, id],
        })),
      unmute: (id) => set((state) => ({ muted: state.muted.filter((item) => item !== id) })),
    }),
    {
      name: "parichayam-v3",
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage() : localStorage,
      ),
      partialize: (state): Persisted => ({
        loggedIn: state.loggedIn,
        me: state.me,
        accounts: state.accounts,
        likes: state.likes,
        skips: state.skips,
        matches: state.matches,
        chats: state.chats,
        rel: state.rel,
        read: state.read,
        seenNotes: state.seenNotes,
        blocked: state.blocked,
        muted: state.muted,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.blocked ??= [];
        state.muted ??= [];
        state.accounts = (state.accounts ?? []).map((account) => ({
          ...account,
          blocked: account.blocked ?? [],
          muted: account.muted ?? [],
        }));
      },
    },
  ),
);

export function sentCount(messages: ChatMessage[] | undefined): number {
  return sentByMe(messages);
}
