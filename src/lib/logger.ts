export const logUserAction = async (email: string, action: string, details: string) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    await fetch(`${API_BASE_URL}/api/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: email, action, details })
    });
  } catch (e) {
    // silently fail if backend is offline
  }
};
