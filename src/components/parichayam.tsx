import { useEffect, useState } from "react";
import { Bell, Heart, Home, MapPin, UserRound, Users } from "lucide-react";
import { PEOPLE } from "@/data/people";
import { useApp, type Tab } from "@/state/store";
import { HomeScreen } from "@/components/discover";
import { ChatView, MatchDialog, MatchesScreen, RelationsScreen } from "@/components/inbox";
import { AuthScreens } from "@/components/onboarding";
import { ProfileView } from "@/components/profile-view";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "nearby", label: "Nearby", icon: MapPin },
  { id: "matches", label: "Matches", icon: Heart },
  { id: "relations", label: "Relations", icon: Users },
  { id: "profile", label: "Profile", icon: UserRound },
];

export function Parichayam() {
  const [ready, setReady] = useState(false);
  const [hold, setHold] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const loggedIn = useApp((state) => state.loggedIn);
  const tab = useApp((state) => state.tab);
  const setTab = useApp((state) => state.setTab);
  const activeChat = useApp((state) => state.activeChat);
  const likes = useApp((state) => state.likes);
  const seenNotes = useApp((state) => state.seenNotes);
  const seeNote = useApp((state) => state.seeNote);

  useEffect(() => {
    const finish = () => setReady(true);
    const unsub = useApp.persist.onFinishHydration(finish);
    if (useApp.persist.hasHydrated()) finish();
    else void useApp.persist.rehydrate();
    const fallback = window.setTimeout(finish, 2000);
    const release = window.setTimeout(() => setHold(false), 1500);
    return () => {
      unsub();
      window.clearTimeout(fallback);
      window.clearTimeout(release);
    };
  }, []);

  if (!ready || hold) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg">
        <img src="/logo.png" alt="పరిచయం" className="w-72 max-w-[80%]" />
      </main>
    );
  }

  if (!loggedIn) return <AuthScreens />;

  const notes = PEOPLE.filter((person) => person.likesYou && !likes.includes(person.id));
  const unread = notes.filter((person) => !seenNotes.includes(person.id)).length;
  const title =
    tab === "home"
      ? "Parichayam"
      : tab === "nearby"
        ? "Nearby"
        : tab === "matches"
          ? "Matches"
          : tab === "relations"
            ? "Relations"
            : "My Profile";

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-lg flex-col bg-bg">
      {activeChat ? (
        <div className="safe-top flex min-h-0 flex-1 flex-col">
          <ChatView />
        </div>
      ) : (
        <>
          <header className="safe-top flex items-center justify-between px-4 pb-3">
            <h1 className="flex items-center gap-2 text-3xl font-extrabold">
              {title}
              {tab === "home" || tab === "matches" ? <Heart className="size-7 fill-accent text-accent" /> : null}
            </h1>
            {tab === "home" ? (
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setNotesOpen((value) => !value);
                  notes.forEach((person) => seeNote(person.id));
                }}
                className="press relative flex size-11 items-center justify-center"
              >
                <Bell className="size-6" />
                {unread > 0 ? (
                  <span className="absolute top-1 right-0 flex size-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {unread}
                  </span>
                ) : null}
              </button>
            ) : (
              <span className="size-11" />
            )}
          </header>
          {notesOpen && tab === "home" ? (
            <ul className="mx-4 mb-3 rounded-xl bg-surface p-3 shadow-sm">
              {notes.length === 0 ? (
                <li className="text-sm text-muted">No new likes.</li>
              ) : (
                notes.map((person) => (
                  <li key={person.id} className="py-1 text-sm font-bold">
                    {person.name} liked you
                  </li>
                ))
              )}
            </ul>
          ) : null}
          {tab === "home" ? <HomeScreen /> : null}
          {tab === "nearby" ? <HomeScreen nearby /> : null}
          {tab === "matches" ? <MatchesScreen /> : null}
          {tab === "relations" ? <RelationsScreen /> : null}
          {tab === "profile" ? <ProfileView /> : null}
          <nav className="safe-bottom grid grid-cols-5 border-t border-line bg-surface">
            {TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setNotesOpen(false);
                    setTab(item.id);
                  }}
                  className={`flex flex-col items-center gap-1 py-2 text-xs font-bold ${active ? "text-accent" : "text-muted"}`}
                >
                  <Icon className={`size-5 ${active && item.id === "matches" ? "fill-accent" : ""}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </>
      )}
      <MatchDialog />
    </main>
  );
}
