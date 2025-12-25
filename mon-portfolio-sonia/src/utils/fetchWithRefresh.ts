export const fetchWithRefresh = async (url: string, options: any = {}) => {
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401 || res.status === 403) {
    // tente de rafraîchir le token
    const refreshRes = await fetch("http://localhost:5000/api/admin/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // retry original request
      res = await fetch(url, { ...options, credentials: "include" });
    } else {
      alert("Session expirée, veuillez vous reconnecter");
      window.location.href = "/admin/login";
      return null;
    }
  }

  return res;
};
