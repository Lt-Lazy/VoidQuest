// auth.js (kun for index.html) — robust mot dobbel lasting
(() => {
  const Supa = window.supabase || window.Supabase;
  const statusEl = document.getElementById("auth-status");

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg || "";
  }

  if (!Supa || !Supa.createClient) {
    setStatus("The SDK did not load.");
    throw new Error("Supabase SDK not loaded");
  }

  // ✅ Lag client kun én gang, selv om auth.js kjøres flere ganger
  const sb = window.__vq_sb || (window.__vq_sb = Supa.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  ));

  const emailEl = document.getElementById("auth-email");
  const passEl = document.getElementById("auth-pass");
  const btnLogin = document.getElementById("btn-login");
  const btnSignup = document.getElementById("btn-signup");

  async function goIfLoggedIn() {
    const { data } = await sb.auth.getSession();
    if (data?.session) window.location.href = "voidquest.html";
  }

  btnLogin?.addEventListener("click", async () => {
    const email = (emailEl?.value || "").trim();
    const password = (passEl?.value || "").trim();
    setStatus("Logging in...");

    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return setStatus(error.message);

    setStatus("Welcome!");
    window.location.href = "voidquest.html";
  });

  btnSignup?.addEventListener("click", async () => {
    const email = (emailEl?.value || "").trim();
    const password = (passEl?.value || "").trim();
    setStatus("Creating account...");

    const { error } = await sb.auth.signUp({ email, password });
    if (error) return setStatus(error.message);

    setStatus("If the email is valid, you will receive an email to confirm/activate your account. If you already have an account, use Log in.");
  });

  goIfLoggedIn();
})();
