import { Plus, Trash } from "lucide-react";

export default function KathaForm({ form, setForm, onSubmit, submitText }) {
  const updateStep = (i, field, value) => {
    const steps = [...form.steps];
    steps[i][field] = value;
    setForm({ ...form, steps });
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [
        ...form.steps,
        {
          stepNumber: form.steps.length + 1,
          text: "",
          mantra: "",
          meaning: "",
          audioUrl: "",
          videoUrl: "",
        },
      ],
    });
  };

  const removeStep = (i) => {
    const steps = form.steps.filter((_, index) => index !== i);
    setForm({
      ...form,
      steps: steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 })),
    });
  };

  return (
    <div className="space-y-6">

      {/* BASIC INFO */}
      <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800">
        <h2 className="text-lg font-semibold text-orange-400 mb-3">
          Katha Details
        </h2>

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Katha Title"
          className="w-full p-3 mb-3 rounded bg-neutral-800"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full p-3 rounded bg-neutral-800"
        />

        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="Thumbnail Image URL"
          className="w-full p-3 mt-3 rounded bg-neutral-800"
        />
      </div>

      {/* STEPS */}
      <div className="space-y-4">
        {form.steps.map((s, i) => (
          <div
            key={i}
            className="bg-neutral-900 p-5 rounded-xl border border-neutral-800"
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-orange-400 font-semibold">
                Step {s.stepNumber}
              </h3>
              <button onClick={() => removeStep(i)}>
                <Trash size={18} className="text-red-500" />
              </button>
            </div>

            <textarea
              value={s.text}
              onChange={(e) => updateStep(i, "text", e.target.value)}
              placeholder="Step Instruction"
              className="w-full p-2 mb-2 rounded bg-neutral-800"
            />

            <input
              value={s.mantra}
              onChange={(e) => updateStep(i, "mantra", e.target.value)}
              placeholder="Mantra"
              className="w-full p-2 mb-2 rounded bg-neutral-800"
            />

            <textarea
              value={s.meaning}
              onChange={(e) => updateStep(i, "meaning", e.target.value)}
              placeholder="Meaning"
              className="w-full p-2 mb-2 rounded bg-neutral-800"
            />

            <input
              value={s.audioUrl}
              onChange={(e) => updateStep(i, "audioUrl", e.target.value)}
              placeholder="Audio URL"
              className="w-full p-2 mb-2 rounded bg-neutral-800"
            />

            <input
              value={s.videoUrl}
              onChange={(e) => updateStep(i, "videoUrl", e.target.value)}
              placeholder="Video URL"
              className="w-full p-2 rounded bg-neutral-800"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addStep}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded"
      >
        <Plus size={18} /> Add Step
      </button>

      <button
        onClick={onSubmit}
        className="w-full py-3 bg-orange-600 rounded-xl font-semibold"
      >
        {submitText}
      </button>
    </div>
  );
}
