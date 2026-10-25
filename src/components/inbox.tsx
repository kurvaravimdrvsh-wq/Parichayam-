import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Ban, Heart, MessageCircle, Mic, MoreHorizontal, Search, Send, Trash2, Volume2, VolumeX } from "lucide-react";
import { personById } from "@/data/people";
import { MESSAGE_LIMIT, sentCount, useApp, type ChatMessage } from "@/state/store";
import { Avatar } from "@/components/discover";

export function MatchesScreen() {
  const matches = useApp((state) => state.matches);
  const rel = useApp((state) => state.rel);
  const blocked = useApp((state) => state.blocked);
  const openChat = useApp((state) => state.openChat);
  const visible = matches.filter((id) => !blocked.includes(id));

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
      {visible.length === 0 ? (
        <p className="px-2 py-10 text-center text-muted">
          No matches yet. A match happens only when you both like each other.
        </p>
      ) : (
        visible.map((id) => {
          const person = personById(id);
          if (!person) return null;
          const permanent = rel[id] === "permanent";
          return (
            <article key={id} className="flex items-center gap-3 rounded-xl bg-card px-3 py-3">
              <Avatar person={person} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-extrabold">{person.name}</p>
                <p className="text-sm text-muted">@{person.handle}</p>
                {permanent ? <p className="text-sm font-bold text-accent">Permanent</p> : null}
              </div>
              <button
                type="button"
                onClick={() => openChat(id)}
                className="press brand-fill flex h-11 items-center gap-2 rounded-full px-4 font-bold"
              >
                <MessageCircle className="size-4" />
                Chat
              </button>
            </article>
          );
        })
      )}
    </div>
  );
}

export function RelationsScreen() {
  const rel = useApp((state) => state.rel);
  const blocked = useApp((state) => state.blocked);
  const muted = useApp((state) => state.muted);
  const openChat = useApp((state) => state.openChat);
  const block = useApp((state) => state.block);
  const unblock = useApp((state) => state.unblock);
  const mute = useApp((state) => state.mute);
  const unmute = useApp((state) => state.unmute);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const ids = Object.entries(rel)
    .filter(([, status]) => status === "permanent")
    .map(([id]) => id)
    .filter((id) => !blocked.includes(id))
    .filter((id) => {
      if (!q) return true;
      const person = personById(id);
      if (!person) return false;
      return person.name.toLowerCase().includes(q) || person.handle.toLowerCase().includes(q);
    });

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
      <label className="flex h-12 items-center gap-2 rounded-full bg-surface px-4 shadow-sm">
        <Search className="size-5 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search username"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
      </label>
      {ids.length === 0 ? (
        <p className="px-2 py-8 text-center text-muted">
          {q ? "No one with that username." : "No relationship yet. After five messages, choose Go to Relationship. Both of you must accept."}
        </p>
      ) : (
        ids.map((id) => {
          const person = personById(id);
          if (!person) return null;
          const isMuted = muted.includes(id);
          return (
            <div key={id} className="relative flex items-center gap-3 rounded-xl bg-card px-3 py-3">
              <button type="button" onClick={() => openChat(id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <Avatar person={person} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-extrabold">{person.name}</span>
                  <span className="block text-sm text-muted">@{person.handle}</span>
                  <span className="text-sm font-bold text-accent">{isMuted ? "Muted" : "Permanent chat"}</span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`Options for ${person.name}`}
                onClick={() => setMenu(menu === id ? null : id)}
                className="press flex size-10 items-center justify-center rounded-full"
              >
                <MoreHorizontal className="size-5" />
              </button>
              {menu === id ? (
                <div className="absolute top-14 right-3 z-10 w-36 overflow-hidden rounded-lg border border-line bg-surface shadow-md">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm font-bold"
                    onClick={() => {
                      if (isMuted) unmute(id);
                      else mute(id);
                      setMenu(null);
                    }}
                  >
                    {isMuted ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm font-bold text-logout"
                    onClick={() => {
                      block(id);
                      setMenu(null);
                    }}
                  >
                    <Ban className="size-4" />
                    Block
                  </button>
                </div>
              ) : null}
            </div>
          );
        })
      )}
      {blocked.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-muted">Blocked</h2>
          {blocked.map((id) => {
            const person = personById(id);
            if (!person) return null;
            return (
              <div key={id} className="flex items-center gap-3 rounded-xl bg-card px-3 py-3">
                <Avatar person={person} size="sm" />
                <span className="min-w-0 flex-1 truncate font-extrabold">{person.name}</span>
                <button type="button" onClick={() => unblock(id)} className="press h-10 rounded-full border border-line px-3 text-sm font-bold">
                  Unblock
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ChatView() {
  const id = useApp((state) => state.activeChat);
  const chats = useApp((state) => state.chats);
  const rel = useApp((state) => state.rel);
  const muted = useApp((state) => state.muted);
  const send = useApp((state) => state.send);
  const sendVoice = useApp((state) => state.sendVoice);
  const deleteMessage = useApp((state) => state.deleteMessage);
  const propose = useApp((state) => state.propose);
  const openChat = useApp((state) => state.openChat);
  const markRead = useApp((state) => state.markRead);
  const block = useApp((state) => state.block);
  const mute = useApp((state) => state.mute);
  const unmute = useApp((state) => state.unmute);
  const [draft, setDraft] = useState("");
  const [menu, setMenu] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const person = id ? personById(id) : undefined;
  const thread = id ? (chats[id] ?? []) : [];
  const sent = sentCount(thread);
  const status = id ? (rel[id] ?? "none") : "none";
  const locked = status !== "permanent" && sent >= MESSAGE_LIMIT;
  const permanent = status === "permanent";

  useEffect(() => {
    if (id) markRead(id);
  }, [id, thread.length, markRead]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [thread.length, status]);

  async function toggleRecord() {
    if (!id) return;
    if (recorder.current && recorder.current.state === "recording") {
      recorder.current.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        recorder.current = null;
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
        if (blob.size < 800) {
          setVoiceError("Voice note was too short.");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") sendVoice(id, reader.result);
        };
        reader.readAsDataURL(blob);
      };
      recorder.current = rec;
      rec.start();
      setRecording(true);
      setVoiceError("");
      window.setTimeout(() => {
        if (rec.state === "recording") rec.stop();
      }, 12000);
    } catch {
      setVoiceError("Microphone is not available.");
    }
  }

  if (!id || !person) return null;
  const isMuted = muted.includes(id);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-3 py-3">
        <button
          type="button"
          aria-label="Back"
          onClick={() => openChat(null)}
          className="press flex size-11 items-center justify-center rounded-full"
        >
          <ArrowLeft className="size-5" />
        </button>
        <Avatar person={person} size="sm" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-extrabold">{person.name}</h1>
          <p className="text-sm text-muted">@{person.handle}{isMuted ? " · Muted" : ""}</p>
        </div>
        {permanent ? (
          <button type="button" aria-label="Chat options" onClick={() => setMenu((value) => !value)} className="press flex size-11 items-center justify-center rounded-full">
            <MoreHorizontal className="size-5" />
          </button>
        ) : null}
      </header>
      {menu && permanent ? (
        <div className="flex gap-2 px-4 py-2">
          <button
            type="button"
            className="press h-10 rounded-full border border-line px-3 text-sm font-bold"
            onClick={() => {
              if (isMuted) unmute(id);
              else mute(id);
              setMenu(false);
            }}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            className="press h-10 rounded-full border border-line px-3 text-sm font-bold text-logout"
            onClick={() => block(id)}
          >
            Block
          </button>
        </div>
      ) : null}
      {permanent ? (
        <p className="bg-card px-4 py-2 text-center text-sm font-bold text-accent">Permanent chat</p>
      ) : (
        <p className="px-4 py-2 text-center text-sm text-muted">
          {sent}/{MESSAGE_LIMIT} messages
        </p>
      )}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
        {thread.map((message) =>
          message.from === "system" ? (
            <p key={message.id} className="text-center text-sm font-bold text-accent">
              {message.text}
            </p>
          ) : (
            <div key={message.id} className={`flex max-w-[86%] items-end gap-1 ${message.from === "me" ? "ml-auto" : ""}`}>
              {message.kind === "voice" && message.audio ? (
                <VoiceNote message={message} mine={message.from === "me"} onHeard={() => deleteMessage(id, message.id)} />
              ) : (
                <p className={`rounded-lg px-3 py-2 leading-normal ${message.from === "me" ? "brand-fill" : "bg-card"}`}>{message.text}</p>
              )}
              {permanent ? (
                <button type="button" aria-label="Delete message" onClick={() => deleteMessage(id, message.id)} className="press text-muted">
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>
          ),
        )}
        <div ref={end} />
      </div>
      {locked && status === "none" ? (
        <div className="px-4 pb-3">
          <button type="button" onClick={() => propose(id)} className="press brand-fill h-12 w-full rounded-xl font-extrabold">
            Go to Relationship
          </button>
        </div>
      ) : null}
      {status === "waiting" ? (
        <p className="px-4 pb-3 text-center text-sm font-bold text-muted">Waiting for {person.name} to accept</p>
      ) : null}
      {voiceError ? <p className="px-4 text-center text-sm font-bold text-logout">{voiceError}</p> : null}
      <form
        className="safe-bottom flex items-center gap-2 border-t border-line px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (locked) return;
          send(id, draft);
          setDraft("");
        }}
      >
        {permanent ? (
          <button
            type="button"
            aria-label={recording ? "Stop voice" : "Voice message"}
            onClick={() => void toggleRecord()}
            className={`press flex size-11 items-center justify-center rounded-full ${recording ? "bg-logout text-accent-fg" : "border border-line"}`}
          >
            <Mic className="size-5" />
          </button>
        ) : null}
        <input
          value={draft}
          disabled={locked}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={recording ? "Recording… tap the mic to send" : locked ? "Five messages sent" : "Write a message"}
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-base outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={locked || !draft.trim()}
          aria-label="Send"
          className="press brand-fill flex size-11 items-center justify-center rounded-full disabled:opacity-40"
        >
          <Send className="size-5" />
        </button>
      </form>
    </section>
  );
}

function VoiceNote({ message, mine, onHeard }: { message: ChatMessage; mine: boolean; onHeard: () => void }) {
  const audio = useRef<HTMLAudioElement>(null);
  const started = useRef(false);

  return (
    <button
      type="button"
      onClick={() => {
        const node = audio.current;
        if (!node || started.current) return;
        started.current = true;
        void node.play().catch(() => {
          started.current = false;
        });
      }}
      className={`rounded-lg px-3 py-2 text-left font-bold ${mine ? "brand-fill" : "bg-card"}`}
    >
      <audio ref={audio} src={message.audio} onEnded={onHeard} />
      Listen once
    </button>
  );
}

export function MatchDialog() {
  const pop = useApp((state) => state.matchPop);
  const clear = useApp((state) => state.clearMatchPop);
  const openChat = useApp((state) => state.openChat);
  const setTab = useApp((state) => state.setTab);
  const person = pop ? personById(pop) : undefined;
  if (!person || !pop) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-end bg-ink/40 p-4 sm:items-center">
      <div role="dialog" aria-modal="true" className="rise mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-xl bg-surface p-5 text-center">
        <Heart className="size-10 fill-accent text-accent" />
        <h2 className="text-2xl font-extrabold">It's a match</h2>
        <p className="text-muted">You and {person.name} both liked each other.</p>
        <button
          type="button"
          className="press brand-fill h-12 w-full rounded-xl font-extrabold"
          onClick={() => {
            clear();
            setTab("matches");
            openChat(pop);
          }}
        >
          Chat
        </button>
        <button type="button" className="press h-11 w-full rounded-xl border border-line font-bold" onClick={clear}>
          Later
        </button>
      </div>
    </div>
  );
}
