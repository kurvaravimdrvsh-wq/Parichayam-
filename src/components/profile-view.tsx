import { useRef, useState, type ReactNode } from "react";
import { Cake, Camera, Info, Lock, LogOut, MapPin, Pencil, Phone, UserRound, Users } from "lucide-react";
import { useApp, type Me } from "@/state/store";

export function ProfileView() {
  const me = useApp((state) => state.me);
  const updateMe = useApp((state) => state.updateMe);
  const logout = useApp((state) => state.logout);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Me>(me);
  const file = useRef<HTMLInputElement>(null);

  function patch(partial: Partial<Me>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function onPhoto(list: FileList | null) {
    const item = list?.[0];
    if (!item) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") patch({ photo: reader.result });
    };
    reader.readAsDataURL(item);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="relative">
          {(editing ? draft.photo : me.photo) ? (
            <img src={(editing ? draft.photo : me.photo) ?? ""} alt="" className="size-28 rounded-full object-cover" />
          ) : (
            <span className="flex size-28 items-center justify-center rounded-full bg-accent text-accent-fg">
              <UserRound className="size-12" />
            </span>
          )}
          {editing ? (
            <button
              type="button"
              aria-label="Change photo"
              onClick={() => file.current?.click()}
              className="press brand-fill absolute right-0 bottom-0 flex size-10 items-center justify-center rounded-full"
            >
              <Camera className="size-4" />
            </button>
          ) : null}
          <input ref={file} type="file" accept="image/*" className="hidden" onChange={(event) => onPhoto(event.target.files)} />
        </div>
        <h2 className="text-2xl font-extrabold">{me.name || "Your name"}</h2>
        <p className="text-muted">@{me.handle}</p>
      </div>

      {editing ? <p className="text-center text-sm text-muted">You can change the photo, bio, and PIN code.</p> : null}

      <Field icon={<UserRound className="size-5" />} label="Full Name" locked={editing}>
        <p className="text-lg font-extrabold">{me.name}</p>
      </Field>
      <Field icon={<Phone className="size-5" />} label="Phone Number" locked={editing}>
        <p className="text-lg font-extrabold">{me.phone}</p>
      </Field>
      <Field icon={<Cake className="size-5" />} label="Age" locked={editing}>
        <p className="text-lg font-extrabold">{me.age}</p>
      </Field>
      <Field icon={<Users className="size-5" />} label="Gender" locked={editing}>
        <p className="text-lg font-extrabold">{me.gender}</p>
      </Field>
      <Field icon={<MapPin className="size-5" />} label="PIN Code">
        {editing ? (
          <input
            value={draft.pin}
            inputMode="numeric"
            onChange={(event) => patch({ pin: event.target.value.replace(/\D/g, "").slice(0, 6) })}
            className="w-full bg-transparent text-lg font-extrabold outline-none"
          />
        ) : (
          <p className="text-lg font-extrabold">{me.pin}</p>
        )}
      </Field>
      <Field icon={<Info className="size-5" />} label="Bio">
        {editing ? (
          <textarea
            value={draft.bio}
            maxLength={200}
            rows={3}
            onChange={(event) => patch({ bio: event.target.value })}
            className="w-full resize-none bg-transparent text-lg font-extrabold outline-none"
          />
        ) : (
          <p className="text-lg font-extrabold">{me.bio}</p>
        )}
      </Field>

      {editing ? (
        <button
          type="button"
          disabled={draft.pin.length !== 6}
          onClick={() => {
            updateMe({ ...me, photo: draft.photo, bio: draft.bio.trim(), pin: draft.pin });
            setEditing(false);
          }}
          className="press brand-fill h-14 rounded-xl text-lg font-extrabold disabled:opacity-40"
        >
          Save
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(me);
            setEditing(true);
          }}
          className="press brand-fill flex h-14 items-center justify-center gap-2 rounded-xl text-lg font-extrabold"
        >
          <Pencil className="size-5" />
          Edit Profile
        </button>
      )}
      <button
        type="button"
        onClick={logout}
        className="press flex h-14 items-center justify-center gap-2 rounded-xl bg-logout text-lg font-extrabold text-accent-fg"
      >
        <LogOut className="size-5" />
        Logout
      </button>
    </div>
  );
}

function Field({
  icon,
  label,
  locked = false,
  children,
}: {
  icon: ReactNode;
  label: string;
  locked?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-sm">
      <span className="text-accent">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">{label}</p>
        {children}
      </div>
      {locked ? <Lock className="size-4 text-muted" /> : null}
    </div>
  );
}
