const API_URL = import.meta.env.VITE_APP_API_URL;

async function request(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, options);

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }

  if (!response.ok) {
    throw new Error(
      data.detail || "Something went wrong"
    );
  }

  return data;
}


// ===============================
// GET MY PROFILE
// ===============================

export async function getMyProfile(token) {
  return request("/profile/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// ===============================
// UPDATE PROFILE
// ===============================

export async function updateMyProfile(token, data) {
  return request("/profile/me", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}


// ===============================
// DELETE PROFILE
// ===============================

export async function deleteMyProfile(token) {
  return request("/profile/me", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// ===============================
// UPLOAD PROFILE PHOTO
// ===============================

export async function uploadProfilePhoto(token, file) {
  const formData = new FormData();

  formData.append("file", file);

  return request("/profile/upload_photo", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}


// ===============================
// DELETE PROFILE PHOTO
// ===============================

export async function deleteProfilePhoto(token) {
  return request("/profile/photo", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
