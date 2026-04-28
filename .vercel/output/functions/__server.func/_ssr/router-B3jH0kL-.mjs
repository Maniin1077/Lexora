import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/Lexora/assets/styles-C-LMd9yW.css";
const AUTH_ACCOUNTS_KEY = "lexora.auth.accounts";
const AUTH_SESSION_KEY = "lexora.auth.session";
const AUTH_ADMIN_EMAILS_KEY = "lexora.auth.admin-emails";
const AUTH_OWNER_EMAILS_KEY = "lexora.auth.owner-emails";
const AUTH_CHANGED_EVENT = "lexora:auth-changed";
const DEFAULT_OWNER_EMAIL = "bsmanikanta2004@gmail.com";
const SYSTEM_ADMIN_EMAIL = "lexora.community@gmail.com";
const MAX_ADMINS = 2;
const Ctx = reactExports.createContext(void 0);
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function readAccounts() {
  if (typeof window === "undefined") return [];
  return safeParse(
    localStorage.getItem(AUTH_ACCOUNTS_KEY),
    []
  );
}
function writeAccounts(accounts) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
function setSession(accountId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_SESSION_KEY, accountId);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
function sanitizeOwnerEmails(raw) {
  const owners = [DEFAULT_OWNER_EMAIL, ...raw].map(normalizeEmail).filter(Boolean);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const owner of owners) {
    if (seen.has(owner)) continue;
    seen.add(owner);
    normalized.push(owner);
  }
  return normalized;
}
function readOwnerEmails() {
  if (typeof window === "undefined") return [DEFAULT_OWNER_EMAIL];
  const raw = safeParse(
    localStorage.getItem(AUTH_OWNER_EMAILS_KEY),
    [DEFAULT_OWNER_EMAIL]
  );
  const normalized = sanitizeOwnerEmails(raw);
  if (normalized.length !== raw.length) {
    localStorage.setItem(AUTH_OWNER_EMAILS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}
function sanitizeAdminEmails(raw, owners) {
  const ownerSet = new Set(owners);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of raw) {
    const email = normalizeEmail(value);
    if (!email || ownerSet.has(email) || email === SYSTEM_ADMIN_EMAIL || seen.has(email)) {
      continue;
    }
    seen.add(email);
    normalized.push(email);
    if (normalized.length >= MAX_ADMINS) break;
  }
  return normalized;
}
function readAdminEmails() {
  if (typeof window === "undefined") return [];
  const owners = readOwnerEmails();
  const raw = safeParse(
    localStorage.getItem(AUTH_ADMIN_EMAILS_KEY),
    []
  );
  const normalized = sanitizeAdminEmails(raw, owners);
  if (normalized.length !== raw.length) {
    localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}
function writeAdminEmails(emails) {
  if (typeof window === "undefined") return;
  const normalized = sanitizeAdminEmails(emails, readOwnerEmails());
  localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
function writeOwnerEmails(emails) {
  if (typeof window === "undefined") return;
  const owners = sanitizeOwnerEmails(emails);
  localStorage.setItem(AUTH_OWNER_EMAILS_KEY, JSON.stringify(owners));
  const admins = safeParse(
    localStorage.getItem(AUTH_ADMIN_EMAILS_KEY),
    []
  );
  const sanitizedAdmins = sanitizeAdminEmails(admins, owners);
  localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(sanitizedAdmins));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
function getUserRole(email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  if (!normalizedEmail) return "user";
  const owners = readOwnerEmails();
  if (owners.includes(normalizedEmail)) return "owner";
  if (normalizedEmail === SYSTEM_ADMIN_EMAIL) return "admin";
  const admins = readAdminEmails();
  if (admins.includes(normalizedEmail)) return "admin";
  return "user";
}
function toAdminRecord(account) {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    course: account.course,
    institute: account.institute,
    email: account.email,
    createdAt: account.createdAt
  };
}
function getAllUsersForAdmin() {
  return readAccounts().map(toAdminRecord).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
function hasCompleteProfile(user) {
  if (!user) return false;
  return [
    user.firstName,
    user.lastName,
    user.course,
    user.institute,
    user.email
  ].every((value) => value.trim().length > 0);
}
function toAuthUser(account) {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    course: account.course,
    institute: account.institute,
    email: account.email
  };
}
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const hydrate = () => {
      if (typeof window === "undefined") return;
      const accounts = readAccounts();
      const sessionId = localStorage.getItem(AUTH_SESSION_KEY);
      if (sessionId) {
        const account = accounts.find((acc) => acc.id === sessionId) ?? null;
        if (account) {
          setUser(toAuthUser(account));
        } else {
          clearSession();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    hydrate();
    const onStorage = (e) => {
      if (e.key === null || e.key === AUTH_SESSION_KEY || e.key === AUTH_ACCOUNTS_KEY || e.key === AUTH_ADMIN_EMAILS_KEY || e.key === AUTH_OWNER_EMAILS_KEY) {
        hydrate();
      }
    };
    const onAuthChanged = () => hydrate();
    window.addEventListener("storage", onStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    };
  }, []);
  const signInWithPassword = async (email, password) => {
    if (typeof window === "undefined") return;
    const normalizedEmail = normalizeEmail(email);
    const account = readAccounts().find((a) => a.email === normalizedEmail);
    if (!account) {
      throw new Error("No account found for this email.");
    }
    if (account.password !== password) {
      throw new Error("Incorrect password.");
    }
    setSession(account.id);
    setUser(toAuthUser(account));
  };
  const register = async (input) => {
    if (typeof window === "undefined") return;
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const course = input.course.trim();
    const institute = input.institute.trim();
    const email = normalizeEmail(input.email);
    const password = input.password;
    if (!firstName || !lastName || !course || !institute || !email || !password) {
      throw new Error("Please fill all fields.");
    }
    const accounts = readAccounts();
    if (accounts.some((acc) => acc.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const next = {
      id: makeId(),
      firstName,
      lastName,
      course,
      institute,
      email,
      password,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    writeAccounts([next, ...accounts]);
    setSession(next.id);
    setUser(toAuthUser(next));
  };
  const updateProfile = async (input) => {
    if (!user) {
      throw new Error("You must be signed in to update your profile.");
    }
    const profile = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      course: input.course.trim(),
      institute: input.institute.trim()
    };
    if (!profile.firstName || !profile.lastName || !profile.course || !profile.institute) {
      throw new Error("Please fill all profile fields.");
    }
    const accounts = readAccounts();
    const idx = accounts.findIndex((account) => account.id === user.id);
    if (idx === -1) {
      throw new Error("Could not find your account.");
    }
    const updatedAccount = {
      ...accounts[idx],
      firstName: profile.firstName,
      lastName: profile.lastName,
      course: profile.course,
      institute: profile.institute
    };
    const nextAccounts = [...accounts];
    nextAccounts[idx] = updatedAccount;
    writeAccounts(nextAccounts);
    setUser(toAuthUser(updatedAccount));
  };
  const resetPassword = async (email, newPassword) => {
    if (typeof window === "undefined") return;
    const normalizedEmail = normalizeEmail(email);
    const password = newPassword;
    if (!normalizedEmail || !password) {
      throw new Error("Email and new password are required.");
    }
    const accounts = readAccounts();
    const idx = accounts.findIndex((acc) => acc.email === normalizedEmail);
    if (idx === -1) {
      throw new Error("No account found for this email.");
    }
    accounts[idx] = { ...accounts[idx], password };
    writeAccounts(accounts);
  };
  const grantAdminAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to grant admin access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only the owner can assign admin access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    if (readOwnerEmails().includes(normalized)) {
      throw new Error("Owner already has full access.");
    }
    const accounts = readAccounts();
    if (!accounts.some((account) => account.email === normalized)) {
      throw new Error("Only registered users can be granted admin access.");
    }
    if (normalized === SYSTEM_ADMIN_EMAIL) {
      return;
    }
    const admins = readAdminEmails();
    if (admins.includes(normalized)) {
      return;
    }
    if (admins.length >= MAX_ADMINS) {
      throw new Error(`A maximum of ${MAX_ADMINS} admins is allowed.`);
    }
    writeAdminEmails([...admins, normalized]);
  };
  const grantOwnerAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to grant owner access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only an owner can assign owner access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    const accounts = readAccounts();
    if (!accounts.some((account) => account.email === normalized)) {
      throw new Error("Only registered users can be granted owner access.");
    }
    const owners = readOwnerEmails();
    if (owners.includes(normalized)) {
      return;
    }
    writeOwnerEmails([...owners, normalized]);
  };
  const revokeOwnerAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to revoke owner access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only an owner can revoke owner access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    const owners = readOwnerEmails();
    if (!owners.includes(normalized)) {
      return;
    }
    if (owners.length <= 1) {
      throw new Error("At least one owner must remain.");
    }
    writeOwnerEmails(owners.filter((ownerEmail) => ownerEmail !== normalized));
  };
  const revokeAdminAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to revoke admin access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only the owner can revoke admin access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    if (normalized === SYSTEM_ADMIN_EMAIL) {
      throw new Error("Reserved admin access cannot be revoked.");
    }
    const admins = readAdminEmails();
    if (!admins.includes(normalized)) {
      return;
    }
    writeAdminEmails(admins.filter((adminEmail) => adminEmail !== normalized));
  };
  const signOut = async () => {
    if (typeof window === "undefined") return;
    clearSession();
    setUser(null);
  };
  const role = getUserRole(user?.email);
  const isOwner = role === "owner";
  const isAdmin = role === "owner" || role === "admin";
  const ownerEmails = readOwnerEmails();
  const managedAdminEmails = readAdminEmails();
  const adminEmails = [SYSTEM_ADMIN_EMAIL, ...managedAdminEmails];
  const isProfileComplete = hasCompleteProfile(user);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        user,
        loading,
        role,
        isOwner,
        isAdmin,
        ownerEmails,
        adminEmails,
        managedAdminEmails,
        isProfileComplete,
        signInWithPassword,
        register,
        updateProfile,
        resetPassword,
        grantOwnerAccess,
        revokeOwnerAccess,
        grantAdminAccess,
        revokeAdminAccess,
        signOut
      },
      children
    }
  );
}
function useAuth() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$a = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lexora" },
      {
        name: "description",
        content: "Lexora Community Hub is a website showcasing community information, activities, and internship opportunities."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lexora" },
      {
        property: "og:description",
        content: "Lexora Community Hub is a website showcasing community information, activities, and internship opportunities."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lexora" },
      {
        name: "twitter:description",
        content: "Lexora Community Hub is a website showcasing community information, activities, and internship opportunities."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4437d8a8-216a-40ae-9242-0573dd66d662/id-preview-6cb511a4--1a1c3341-982f-4acc-80b6-976b486d4ed3.lovable.app-1777140693817.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4437d8a8-216a-40ae-9242-0573dd66d662/id-preview-6cb511a4--1a1c3341-982f-4acc-80b6-976b486d4ed3.lovable.app-1777140693817.png"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$9 = () => import("./profile-CPuB2sSI.mjs");
const Route$9 = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "My Profile — Lexora Community"
    }, {
      name: "description",
      content: "Your Lexora profile and history of applied internships."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./members-DXvAztht.mjs");
const Route$8 = createFileRoute("/members")({
  head: () => ({
    meta: [{
      title: "Members — Lexora Community"
    }, {
      name: "description",
      content: "Meet the founding and core members behind Lexora Community."
    }, {
      property: "og:title",
      content: "Lexora Members"
    }, {
      property: "og:description",
      content: "The founding and core team driving Lexora's mission forward."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./magazines-CILVlk1J.mjs");
const Route$7 = createFileRoute("/magazines")({
  head: () => ({
    meta: [{
      title: "Internship Magazines — Lexora Community"
    }, {
      name: "description",
      content: "Curated internship opportunities posted by Lexora. Sign in to apply and track your applications."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./login-C-XDFKBd.mjs");
const Route$6 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign In — Lexora Community"
    }, {
      name: "description",
      content: "Sign in to Lexora with email/password, create an account, and recover your password."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./internships-mJSM80Ug.mjs");
const Route$5 = createFileRoute("/internships")({
  head: () => ({
    meta: [{
      title: "Internships — Lexora Community"
    }, {
      name: "description",
      content: "Explore internship opportunities, apply with one click, and track your application status."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contact-COqqHiU_.mjs");
const Route$4 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact — Lexora Community"
    }, {
      name: "description",
      content: "Get in touch with Lexora Community via email, phone, LinkedIn or Instagram."
    }, {
      property: "og:title",
      content: "Contact Lexora Community"
    }, {
      property: "og:description",
      content: "Reach the Lexora team — we'd love to hear from you."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin-DkTrjh8P.mjs");
const Route$3 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard - Lexora Community"
    }, {
      name: "description",
      content: "Admin controls for users, permissions, website content, and activity insights."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./activities-BgRf6Bs6.mjs");
const Route$2 = createFileRoute("/activities")({
  head: () => ({
    meta: [{
      title: "Activities — Lexora Community"
    }, {
      name: "description",
      content: "Debates, blog writing, seminars, conferences, webinars, internships and monthly magazines at Lexora."
    }, {
      property: "og:title",
      content: "Lexora Activities"
    }, {
      property: "og:description",
      content: "A wide range of academic and professional activities organised year-round."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-CIfSdO6H.mjs");
const Route$1 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — Lexora Community"
    }, {
      name: "description",
      content: "Learn about Lexora's mission to spread knowledge through collective contribution across law, management and allied domains."
    }, {
      property: "og:title",
      content: "About Lexora Community"
    }, {
      property: "og:description",
      content: "A multidisciplinary student community founded to maximise the spread of knowledge."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-By1blGER.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Lexora Community — Knowledge that Liberates"
    }, {
      name: "description",
      content: "Lexora is a multidisciplinary student community for law, management, and allied domains. Sa Vidyā Ya Vimuktaye."
    }, {
      property: "og:title",
      content: "Lexora Community"
    }, {
      property: "og:description",
      content: "Knowledge that liberates. Join a multidisciplinary ecosystem of debates, blogs, conferences and internships."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ProfileRoute = Route$9.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$a
});
const MembersRoute = Route$8.update({
  id: "/members",
  path: "/members",
  getParentRoute: () => Route$a
});
const MagazinesRoute = Route$7.update({
  id: "/magazines",
  path: "/magazines",
  getParentRoute: () => Route$a
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$a
});
const InternshipsRoute = Route$5.update({
  id: "/internships",
  path: "/internships",
  getParentRoute: () => Route$a
});
const ContactRoute = Route$4.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$a
});
const AdminRoute = Route$3.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$a
});
const ActivitiesRoute = Route$2.update({
  id: "/activities",
  path: "/activities",
  getParentRoute: () => Route$a
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$a
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ActivitiesRoute,
  AdminRoute,
  ContactRoute,
  InternshipsRoute,
  LoginRoute,
  MagazinesRoute,
  MembersRoute,
  ProfileRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({
  error,
  reset
}) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AUTH_CHANGED_EVENT as A,
  MAX_ADMINS as M,
  SYSTEM_ADMIN_EMAIL as S,
  getAllUsersForAdmin as a,
  AUTH_ACCOUNTS_KEY as b,
  AUTH_ADMIN_EMAILS_KEY as c,
  getUserRole as g,
  router as r,
  useAuth as u
};
