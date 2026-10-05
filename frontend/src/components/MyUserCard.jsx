import { useEffect, useState } from "react";

function MyUserCard({
  username,
  note,
  onUpdate,
  onDelete,
}) {
  const [value, setValue] = useState(note ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // SYNC WITH BACKEND NOTE
  // ==================================================

  useEffect(() => {
    setValue(note ?? "");
  }, [note]);


  // ==================================================
  // UPDATE / CREATE NOTE
  //
  // IMPORTANT:
  // There is NO POST here.
  //
  // PUT is used every time.
  // ==================================================

  const handleSave = async () => {
    setError("");

    const trimmedNote = value.trim();

    if (!trimmedNote) {
      setError("Write something before saving.");
      return;
    }

    if (typeof onUpdate !== "function") {
      setError("Update note handler is missing.");
      return;
    }

    try {
      setSaving(true);


      await onUpdate(trimmedNote);


    } catch (err) {

      setError(
        err?.message || "Could not save note."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==================================================
  // DELETE NOTE
  // ==================================================

  const handleDelete = async () => {
    setError("");

    if (typeof onDelete !== "function") {
      setError("Delete note handler is missing.");
      return;
    }

    try {
      setDeleting(true);


      await onDelete();


      // Clear textarea immediately
      setValue("");

    } catch (err) {

      setError(
        err?.message || "Could not delete note."
      );

    } finally {
      setDeleting(false);
    }
  };


  return (
    <article
      className="
        relative
        overflow-hidden

        rounded-[1.5rem]

        border
        border-red-400/20

        bg-white/[0.035]

        p-5

        backdrop-blur-2xl

        shadow-[
          inset_4px_4px_10px_rgba(255,255,255,0.04),
          inset_-5px_-6px_12px_rgba(0,0,0,0.55),
          0_15px_40px_rgba(239,68,68,0.07)
        ]
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              border
              border-red-400/20

              bg-red-500/[0.08]

              text-xs
              font-black
              text-red-300
            "
          >
            ME
          </div>


          <div>

            <h2
              className="
                text-sm
                font-bold
                text-red-200
              "
            >
              {username || "You"}
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-white/20
              "
            >
              Your note
            </p>

          </div>

        </div>


        <div
          className="
            rounded-full

            border
            border-red-400/10

            bg-red-500/[0.05]

            px-2.5
            py-1

            text-[9px]
            font-bold
            uppercase
            tracking-wider

            text-red-300/60
          "
        >
          Me
        </div>

      </div>


      {/* ==================================================
          NOTE
      ================================================== */}

      <div className="mt-5">

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
          Your Note
        </label>


        <textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError("");
          }}

          placeholder="What do you want people around you to know?"

          rows={5}

          className="
            w-full
            resize-none

            rounded-2xl

            border
            border-red-400/10

            bg-black/[0.18]

            px-4
            py-3

            text-sm
            leading-relaxed

            text-white/75

            outline-none

            placeholder:text-white/15

            transition-all
            duration-200

            focus:border-red-400/25
            focus:bg-black/[0.22]
          "
        />

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <p
          className="
            mt-2
            text-[10px]
            text-red-300/70
          "
        >
          {error}
        </p>
      )}


      {/* ==================================================
          ACTION BUTTONS
      ================================================== */}

      <div
        className="
          mt-4
          flex
          gap-2
        "
      >

        {/* SAVE / UPDATE */}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || deleting}
          className="
            flex-1

            rounded-xl

            border
            border-red-400/20

            bg-red-500/[0.08]

            px-4
            py-2.5

            text-xs
            font-bold
            text-red-200

            transition-all

            hover:border-red-400/30
            hover:bg-red-500/[0.13]

            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {saving ? "Saving..." : "Save Note"}
        </button>


        {/* DELETE */}

        <button
          type="button"
          onClick={handleDelete}
          disabled={saving || deleting}
          aria-label="Delete note"
          title="Delete note"
          className="
            flex
            h-10
            w-10

            items-center
            justify-center

            rounded-xl

            border
            border-red-400/10

            bg-white/[0.025]

            text-lg
            text-white/35

            transition-all
            duration-200

            hover:border-red-400/25
            hover:bg-red-500/[0.08]
            hover:text-red-300

            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {deleting ? "…" : "🗑"}
        </button>

      </div>

    </article>
  );
}

export default MyUserCard;
