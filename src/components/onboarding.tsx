import { useState, type ReactNode } from "react";
import { ArrowLeft, Cake, Info, Lock, MapPin, MessageSquare, Phone, UserRound, Users } from "lucide-react";
import type { Gender } from "@/data/people";
import { useApp, type Me } from "@/state/store";

type Step = "phone" | "verify" | "setup" | "login";

export function AuthScreens() {
  const registerAccount = useApp((state) => state.registerAccount);
  const signIn = useApp((state) => state.signIn);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [draft, setDraft] = useState<Me>({
    name: "",
    phone: "",
    age: 0,
    gender: "Male",
    pin: "",
    bio: "",
    handle: "",
    photo: null,
  });

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 3200);
  }

  function sendOtp() {
    if (phone.length !== 10) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentOtp(code);
    setOtp("");
    setError("");
    setStep("verify");
    showToast("OTP Sent Successfully");
  }

  function verify() {
    if (otp !== sentOtp) {
      setError("OTP does not match.");
      return;
    }
    if (!/^[A-Za-z0-9_]{1,16}$/.test(username.trim())) {
      setError("Username can use letters and numbers.");
      return;
    }
    if (password.length < 4) {
      setError("Password needs at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setDraft((current) => ({ ...current, phone, handle: username.trim() }));
    setStep("setup");
  }

  function saveProfile() {
    if (draft.name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (draft.age < 18) {
      setError("You need to be 18 or older.");
      return;
    }
    if (draft.pin.length !== 6) {
      setError("PIN code needs 6 digits.");
      return;
    }
    const message = registerAccount({
      phone,
      username: username.trim(),
      password,
      me: { ...draft, name: draft.name.trim(), bio: draft.bio.trim(), phone, handle: username.trim() },
    });
    if (message) setError(message);
  }

  function enter() {
    const message = signIn(loginId, loginPassword);
    if (message) setError(message);
  }

  return (
    <main className="safe-top safe-bottom relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg">
      <header className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center px-3 py-3">
        <button
          type="button"
          aria-label="Back"
          onClick={() => {
            setError("");
            if (step === "verify") setStep("phone");
            else if (step === "setup") setStep("verify");
            else if (step === "login") setStep("phone");
          }}
          className="press flex size-11 items-center justify-center"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-center text-2xl font-extrabold">{step === "login" ? "Login" : step === "setup" ? "Setup Profile" : "Register"}</h1>
        <span />
      </header>

      {step === "phone" ? (
        <form
          className="flex flex-col gap-5 px-5"
          onSubmit={(event) => {
            event.preventDefault();
            sendOtp();
          }}
        >
          <Outline
            icon={<Phone className="size-5" />}
            label="Mobile Number"
            value={phone}
            prefix="+91"
            inputMode="numeric"
            onChange={(value) => setPhone(value.replace(/\D/g, "").slice(0, 10))}
          />
          {error ? <p className="text-center text-sm font-bold text-logout">{error}</p> : null}
          <button type="submit" className="press brand-fill mt-2 h-14 rounded-full text-lg font-extrabold">
            Send OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setStep("login");
            }}
            className="mx-auto rounded-full bg-soft px-4 py-2 text-sm font-bold text-accent"
          >
            Already have an account? Login
          </button>
          <a href="/parichayam.zip" download="parichayam.zip" className="text-center text-sm font-extrabold text-accent">
            Download ZIP
          </a>
        </form>
      ) : null}

      {step === "verify" ? (
        <form
          className="flex flex-col gap-4 px-5"
          onSubmit={(event) => {
            event.preventDefault();
            verify();
          }}
        >
          <Outline icon={<Phone className="size-5" />} label="Mobile Number" value={phone} prefix="+91" readOnly onChange={() => undefined} />
          <Outline
            icon={<MessageSquare className="size-5" />}
            label="OTP"
            value={otp}
            inputMode="numeric"
            onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
          />
          {sentOtp ? <p className="text-sm font-bold text-muted">Demo OTP: {sentOtp}</p> : null}
          <Outline icon={<UserRound className="size-5" />} label="Username" value={username} onChange={setUsername} />
          <Outline icon={<Lock className="size-5" />} label="Password" value={password} secret onChange={setPassword} />
          <Outline icon={<Lock className="size-5" />} label="Confirm Password" value={confirm} secret onChange={setConfirm} />
          {error ? <p className="text-center text-sm font-bold text-logout">{error}</p> : null}
          <button type="submit" className="press brand-fill mt-2 h-14 rounded-full text-lg font-extrabold">
            Verify & Register
          </button>
          <p className="text-center text-sm font-bold text-muted">
            Already have an account?{" "}
            <button
              type="button"
              className="text-accent"
              onClick={() => {
                setError("");
                setStep("login");
              }}
            >
              Login
            </button>
          </p>
        </form>
      ) : null}

      {step === "setup" ? (
        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-6"
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile();
          }}
        >
          <Photo
            photo={draft.photo}
            onPick={(photo) => setDraft((current) => ({ ...current, photo }))}
          />
          <Outline
            icon={<UserRound className="size-5" />}
            label="Full Name"
            value={draft.name}
            onChange={(value) => setDraft((current) => ({ ...current, name: value }))}
          />
          <Outline
            icon={<Cake className="size-5" />}
            label="Age"
            value={draft.age ? String(draft.age) : ""}
            inputMode="numeric"
            onChange={(value) =>
              setDraft((current) => ({ ...current, age: Number(value.replace(/\D/g, "").slice(0, 2)) }))
            }
          />
          <label className="relative flex h-14 items-center gap-3 rounded-lg border border-line bg-surface px-3">
            <span className="absolute -top-2 left-3 bg-bg px-1 text-xs text-muted">Gender</span>
            <Users className="size-5 text-ink" />
            <select
              value={draft.gender}
              onChange={(event) => setDraft((current) => ({ ...current, gender: event.target.value as Gender }))}
              className="w-full bg-transparent text-base font-bold outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <Outline
            icon={<MapPin className="size-5" />}
            label="PIN Code"
            value={draft.pin}
            inputMode="numeric"
            onChange={(value) => setDraft((current) => ({ ...current, pin: value.replace(/\D/g, "").slice(0, 6) }))}
          />
          <label className="relative rounded-lg border border-line bg-surface px-3 py-3">
            <span className="flex items-start gap-3">
              <Info className="mt-1 size-5" />
              <textarea
                value={draft.bio}
                maxLength={200}
                rows={4}
                placeholder="Bio"
                onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
                className="min-h-20 w-full resize-none bg-transparent text-base outline-none placeholder:text-muted"
              />
            </span>
            <span className="block text-right text-xs text-muted">{draft.bio.length}/200</span>
          </label>
          {error ? <p className="text-center text-sm font-bold text-logout">{error}</p> : null}
          <button type="submit" className="press brand-fill h-14 rounded-full text-lg font-extrabold">
            Save Profile
          </button>
        </form>
      ) : null}

      {step === "login" ? (
        <form
          className="flex flex-col gap-4 px-5"
          onSubmit={(event) => {
            event.preventDefault();
            enter();
          }}
        >
          <Outline icon={<UserRound className="size-5" />} label="Username or mobile" value={loginId} onChange={setLoginId} />
          <Outline icon={<Lock className="size-5" />} label="Password" value={loginPassword} secret onChange={setLoginPassword} />
          {error ? <p className="text-center text-sm font-bold text-logout">{error}</p> : null}
          <button type="submit" className="press brand-fill mt-2 h-14 rounded-full text-lg font-extrabold">
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setStep("phone");
            }}
            className="text-center text-sm font-bold text-accent"
          >
            New here? Register
          </button>
        </form>
      ) : null}

      {toast ? (
        <p className="fixed right-4 bottom-6 left-4 z-20 mx-auto max-w-lg rounded-md bg-ink px-4 py-3 text-sm font-bold whitespace-pre-line text-accent-fg">
          {toast}
        </p>
      ) : null}
    </main>
  );
}

function Photo({ photo, onPick }: { photo: string | null; onPick: (photo: string | null) => void }) {
  return (
    <label className="mx-auto flex size-28 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-fg">
      {photo ? <img src={photo} alt="" className="size-28 rounded-full object-cover" /> : <UserRound className="size-12" />}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const item = event.target.files?.[0];
          if (!item) return;
          const reader = new FileReader();
          reader.onload = () => onPick(typeof reader.result === "string" ? reader.result : null);
          reader.readAsDataURL(item);
        }}
      />
    </label>
  );
}

function Outline({
  icon,
  label,
  value,
  onChange,
  secret = false,
  prefix,
  inputMode,
  readOnly = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  secret?: boolean;
  prefix?: string;
  inputMode?: "numeric" | "text";
  readOnly?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const raised = focus || value.length > 0;
  return (
    <label className={`relative flex h-14 items-center gap-3 rounded-lg border bg-surface px-3 ${focus ? "border-accent" : "border-line"}`}>
      {raised ? <span className="absolute -top-2 left-3 bg-bg px-1 text-xs text-muted">{label}</span> : null}
      <span className="text-ink">{icon}</span>
      {prefix ? <span className="text-base font-bold">{prefix}</span> : null}
      <input
        value={value}
        readOnly={readOnly}
        type={secret ? "password" : "text"}
        inputMode={inputMode}
        placeholder={raised ? "" : label}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:font-semibold placeholder:text-muted"
      />
    </label>
  );
}
