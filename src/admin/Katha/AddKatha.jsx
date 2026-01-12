import { useState } from "react";
import axios from "axios";
import KathaForm from "./KathaForm";

export default function AddKatha() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    language: ["EN", "HI"],
    steps: [
      {
        stepNumber: 1,
        text: "",
        mantra: "",
        meaning: "",
        audioUrl: "",
        videoUrl: "",
      },
    ],
  });

  const submit = async () => {
    await axios.post("http://localhost:5000/api/ekatha", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Katha added successfully");
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-orange-500 mb-4">
        Add New Katha
      </h1>

      <KathaForm
        form={form}
        setForm={setForm}
        onSubmit={submit}
        submitText="Save Katha"
      />
    </div>
  );
}
