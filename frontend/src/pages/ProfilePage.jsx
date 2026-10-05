import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../api/ProfileApi";


function ProfilePage() {

  const navigate = useNavigate();

  const token = useAuthStore(
    (state) => state.token
  );


  // ==================================================
  // STATE
  // ==================================================

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [deletingPhoto, setDeletingPhoto] = useState(false);

  const [deletingProfile, setDeletingProfile] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");


  // ==================================================
  // FORM
  // ==================================================

  const [form, setForm] = useState({
    username: "",
    address: "",
    dob: "",
    gender: "",
    gender_of_intrest: "",
    about: "",
    hometown: "",
    ethinicity: "",
    gender_orientation: "",
  });


  // ==================================================
  // LOAD PROFILE EVERY TIME PAGE OPENS
  // ==================================================

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    loadProfile();

  }, [token]);


  async function loadProfile() {

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const data = await getMyProfile(token);


      setProfile(data);

      setForm({
        username: data.username ?? "",
        address: data.address ?? "",
        dob: data.dob ?? "",
        gender: data.gender ?? "",
        gender_of_intrest:
          data.gender_of_intrest ?? "",
        about: data.about ?? "",
        hometown: data.hometown ?? "",
        ethinicity: data.ethinicity ?? "",
        gender_orientation:
          data.gender_orientation ?? "",
      });

    } catch (err) {

      setError(
        err.message || "Failed to load profile."
      );

    } finally {

      setLoading(false);

    }
  }


  // ==================================================
  // INPUT CHANGE
  // ==================================================

  function handleChange(event) {

    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  }


  // ==================================================
  // UPDATE PROFILE
  // ==================================================

  async function handleSave(event) {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");
      setMessage("");

      const data = await updateMyProfile(
        token,
        form
      );

      setMessage(
        "Profile updated successfully."
      );

      // Reload fresh data
      await loadProfile();

    } catch (err) {

      setError(
        err.message ||
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }
  }


  // ==================================================
  // PROFILE PHOTO
  // ==================================================

  async function handlePhotoUpload(event) {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {

      setUploading(true);
      setError("");
      setMessage("");

      const data =
        await uploadProfilePhoto(
          token,
          file
        );

      setMessage(
        "Profile picture updated."
      );

      await loadProfile();

    } catch (err) {

      setError(
        err.message ||
        "Failed to upload photo."
      );

    } finally {

      setUploading(false);

      event.target.value = "";

    }
  }


  // ==================================================
  // DELETE PHOTO
  // ==================================================

  async function handleDeletePhoto() {

    try {

      setDeletingPhoto(true);
      setError("");
      setMessage("");

      await deleteProfilePhoto(token);

      setMessage(
        "Profile picture deleted."
      );

      await loadProfile();

    } catch (err) {

      setError(
        err.message ||
        "Failed to delete photo."
      );

    } finally {

      setDeletingPhoto(false);

    }
  }


  // ==================================================
  // DELETE PROFILE
  // ==================================================

  async function handleDeleteProfile() {

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete your profile?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingProfile(true);
      setError("");

      await deleteMyProfile(token);

      // Clear authentication
      useAuthStore.setState({
        token: null,
        username: null,
      });

      navigate("/login");

    } catch (err) {

      setError(
        err.message ||
        "Failed to delete profile."
      );

      setDeletingProfile(false);

    }
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#050508]
          text-white/40
          text-sm
        "
      >
        Loading profile...
      </div>
    );
  }


  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#050508]
        text-white
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          mx-auto
          max-w-4xl
        "
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <header
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white/25
              "
            >
              LOKOL
            </p>

            <h1
              className="
                mt-1
                text-2xl
                font-black
              "
            >
              Your Profile
            </h1>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/location")
            }
            className="
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.04]
              px-4
              py-2
              text-xs
              font-semibold
              text-white/60
              transition
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            ← Nearby
          </button>

        </header>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div
            className="
              mb-4
              rounded-xl
              border
              border-red-400/10
              bg-red-500/[0.05]
              px-4
              py-3
              text-xs
              text-red-300/75
            "
          >
            {error}
          </div>

        )}


        {/* ==========================================
            SUCCESS
        ========================================== */}

        {message && (

          <div
            className="
              mb-4
              rounded-xl
              border
              border-emerald-400/10
              bg-emerald-500/[0.05]
              px-4
              py-3
              text-xs
              text-emerald-300/75
            "
          >
            {message}
          </div>

        )}


        {/* ==========================================
            PROFILE CARD
        ========================================== */}

        <section
          className="
            rounded-[2rem]

            border
            border-white/[0.08]

            bg-white/[0.025]

            p-6

            backdrop-blur-2xl

            shadow-[
              inset_5px_5px_14px_rgba(255,255,255,0.035),
              inset_-7px_-8px_18px_rgba(0,0,0,0.65),
              0_25px_60px_rgba(0,0,0,0.30)
            ]
          "
        >

          {/* ========================================
              PHOTO
          ======================================== */}

          <div
            className="
              mb-8
              flex
              flex-col
              items-center
            "
          >

            <div
              className="
                relative
                h-28
                w-28
              "
            >

              {profile?.profile_pic ? (

                <img
                  src={profile.profile_pic}
                  alt="Profile"
                  className="
                    h-full
                    w-full
                    rounded-[2rem]
                    border
                    border-purple-400/15
                    object-cover
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center

                    rounded-[2rem]

                    border
                    border-purple-400/10

                    bg-gradient-to-br
                    from-purple-800/90
                    to-purple-950

                    text-3xl
                    font-black
                    text-purple-200

                    shadow-[
                      inset_5px_5px_12px_rgba(255,255,255,0.1),
                      inset_-7px_-8px_14px_rgba(0,0,0,0.75)
                    ]
                  "
                >
                  {(
                    profile?.username ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

              )}

            </div>


            <div
              className="
                mt-4
                flex
                gap-2
              "
            >

              <label
                className="
                  cursor-pointer
                  rounded-xl
                  border
                  border-purple-400/15
                  bg-purple-700/20
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-purple-200
                  transition
                  hover:bg-purple-700/30
                "
              >

                {uploading
                  ? "Uploading..."
                  : "Change Photo"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />

              </label>


              {profile?.profile_pic && (

                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={deletingPhoto}
                  className="
                    rounded-xl
                    border
                    border-red-400/10
                    bg-red-500/[0.05]
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-red-300/70
                    transition
                    hover:bg-red-500/[0.10]
                    disabled:opacity-40
                  "
                >
                  {deletingPhoto
                    ? "..."
                    : "Delete Photo"}
                </button>

              )}

            </div>

          </div>


          {/* ========================================
              PROFILE FORM
          ======================================== */}

          <form
            onSubmit={handleSave}
            className="
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            <Field
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />

            <Field
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />

            <Field
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            />

            <Field
              label="Gender of Interest"
              name="gender_of_intrest"
              value={form.gender_of_intrest}
              onChange={handleChange}
            />

            <Field
              label="Hometown"
              name="hometown"
              value={form.hometown}
              onChange={handleChange}
            />

            <Field
              label="Ethnicity"
              name="ethinicity"
              value={form.ethinicity}
              onChange={handleChange}
            />

            <Field
              label="Gender Orientation"
              name="gender_orientation"
              value={form.gender_orientation}
              onChange={handleChange}
            />


            {/* ABOUT */}

            <div className="sm:col-span-2">

              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/25
                "
              >
                About
              </label>

              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows={5}
                placeholder="Tell people something about you..."
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-black/[0.20]
                  px-4
                  py-3
                  text-sm
                  text-white/75
                  outline-none
                  placeholder:text-white/15
                  focus:border-purple-400/20
                "
              />

            </div>


            {/* SAVE */}

            <div className="sm:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="
                  w-full
                  rounded-xl

                  border
                  border-purple-400/15

                  bg-gradient-to-br
                  from-purple-800/70
                  to-purple-950

                  px-5
                  py-3

                  text-sm
                  font-bold
                  text-purple-100

                  shadow-[
                    inset_3px_3px_7px_rgba(255,255,255,0.08),
                    inset_-4px_-5px_8px_rgba(0,0,0,0.65)
                  ]

                  transition

                  hover:border-purple-400/25
                  hover:from-purple-700/70

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </section>


        {/* ==========================================
            DANGER ZONE
        ========================================== */}

        <section
          className="
            mt-6

            rounded-[2rem]

            border
            border-red-400/10

            bg-red-500/[0.025]

            p-6
          "
        >

          <h2
            className="
              text-sm
              font-bold
              text-red-300/80
            "
          >
            Delete Account
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-white/25
            "
          >
            Permanently delete your profile and account.
          </p>


          <button
            type="button"
            onClick={handleDeleteProfile}
            disabled={deletingProfile}
            className="
              mt-4

              rounded-xl

              border
              border-red-400/15

              bg-red-500/[0.06]

              px-4
              py-2.5

              text-xs
              font-bold
              text-red-300/70

              transition

              hover:bg-red-500/[0.12]
              hover:text-red-300

              disabled:opacity-40
            "
          >
            {deletingProfile
              ? "Deleting..."
              : "Delete Account"}
          </button>

        </section>

      </div>

    </div>
  );
}


// ==================================================
// REUSABLE FIELD
// ==================================================

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {

  return (
    <div>

      <label
        className="
          mb-2
          block

          text-[10px]
          font-bold
          uppercase
          tracking-[0.18em]

          text-white/25
        "
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}

        className="
          w-full

          rounded-2xl

          border
          border-white/[0.08]

          bg-black/[0.20]

          px-4
          py-3

          text-sm
          text-white/75

          outline-none

          placeholder:text-white/15

          focus:border-purple-400/20
        "
      />

    </div>
  );
}


export default ProfilePage;
