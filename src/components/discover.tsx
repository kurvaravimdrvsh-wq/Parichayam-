import { useMemo, useState } from "react";
import { Heart, Search, SkipForward, ChevronDown } from "lucide-react";
import { PEOPLE, type Gender, type Person } from "@/data/people";
import { useApp } from "@/state/store";

export function HomeScreen({ nearby = false }: { nearby?: boolean }) {
  const me = useApp((state) => state.me);
  const likes = useApp((state) => state.likes);
  const skips = useApp((state) => state.skips);
  const blocked = useApp((state) => state.blocked);
  const like = useApp((state) => state.like);
  const unlike = useApp((state) => state.unlike);
  const skip = useApp((state) => state.skip);
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<Gender | "All">("All");
  const [open, setOpen] = useState(false);

  const people = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PEOPLE.filter((person) => {
      if (!nearby && skips.includes(person.id)) return false;
      if (blocked.includes(person.id)) return false;
      if (nearby && person.pin.slice(0, 3) !== me.pin.slice(0, 3)) return false;
      if (gender !== "All" && person.gender !== gender) return false;
      if (!q) return true;
      return (
        person.name.toLowerCase().includes(q) ||
        person.handle.toLowerCase().includes(q) ||
        person.pin.includes(q)
      );
    });
  }, [query, gender, nearby, skips, blocked, me.pin]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-4 px-4 pb-3">
        <label className="flex h-12 items-center gap-2 rounded-full bg-surface px-4 shadow-sm">
          <Search className="size-5 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Username or PIN"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-2 text-base font-extrabold"
          >
            Gender : {gender}
            <ChevronDown className="size-4" />
          </button>
          {open ? (
            <ul className="absolute top-8 left-0 z-10 w-36 overflow-hidden rounded-md border border-line bg-surface shadow-md">
              {(["All", "Male", "Female", "Other"] as const).map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={`block w-full px-4 py-3 text-left font-bold ${item === gender ? "bg-bg" : ""}`}
                    onClick={() => {
                      setGender(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
        {people.length === 0 ? (
          <p className="px-2 py-8 text-center text-muted">No one here yet.</p>
        ) : (
          people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              liked={likes.includes(person.id)}
              onLike={() => like(person.id)}
              onUnlike={() => unlike(person.id)}
              onSkip={() => skip(person.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PersonCard({
  person,
  liked,
  onLike,
  onUnlike,
  onSkip,
}: {
  person: Person;
  liked: boolean;
  onLike: () => void;
  onUnlike: () => void;
  onSkip: () => void;
}) {
  const [photoOpen, setPhotoOpen] = useState(false);

  return (
    <article className="flex flex-col items-center gap-3 rounded-xl bg-card px-4 py-6">
      <button
        type="button"
        aria-label={`Open ${person.name}'s photo`}
        onClick={() => person.photo && setPhotoOpen(true)}
        className="rounded-full"
      >
        <Avatar person={person} />
      </button>
      <h2 className="text-2xl font-extrabold leading-normal">{person.name}</h2>
      <p className="font-bold text-accent">@{person.handle}</p>
      <p className="text-base font-extrabold">
        Age {person.age} • {person.city}
      </p>
      <p className="rounded-full bg-soft px-4 py-1 text-sm font-extrabold text-accent">
        {person.gender} • PIN : {person.pin}
      </p>
      <div className="mt-2 flex w-full gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="press flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-surface font-bold"
        >
          <SkipForward className="size-4" />
          Skip
        </button>
        {liked ? (
          <button
            type="button"
            onClick={onUnlike}
            className="press flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-milk font-bold text-ink"
          >
            <Heart className="size-4" />
            Unlike
          </button>
        ) : (
          <button
            type="button"
            onClick={onLike}
            className="press brand-fill flex h-12 flex-1 items-center justify-center gap-2 rounded-lg font-bold"
          >
            <Heart className="size-4 fill-current" />
            Like
          </button>
        )}
      </div>
      {photoOpen && person.photo ? (
        <button
          type="button"
          aria-label="Close photo"
          onClick={() => setPhotoOpen(false)}
          className="fixed inset-0 z-30 flex items-center justify-center bg-ink/80 p-4"
        >
          <img src={person.photo} alt="" className="max-h-[88dvh] max-w-full rounded-xl object-contain" />
        </button>
      ) : null}
    </article>
  );
}

export function Avatar({
  person,
  size = "lg",
}: {
  person: { name: string; photo: string | null };
  size?: "lg" | "sm";
}) {
  const box = size === "lg" ? "size-28" : "size-14";
  if (person.photo) {
    return <img src={person.photo} alt="" className={`${box} rounded-full object-cover`} />;
  }
  return (
    <span className={`${box} flex items-center justify-center rounded-full bg-accent text-white`}>
      <PersonGlyph />
    </span>
  );
}

function PersonGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-12" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="currentColor" />
      <path d="M6 19c1.2-3 3.2-4.5 6-4.5S16.8 16 18 19" fill="currentColor" />
    </svg>
  );
}
