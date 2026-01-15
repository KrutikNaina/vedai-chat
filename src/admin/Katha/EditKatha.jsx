import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import KathaForm from "./KathaForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditKatha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/ekatha/${id}`).then((res) => {
      setForm(res.data);
    });
  }, []);

  const submit = async () => {
    await axios.put(`${API_URL}/api/ekatha/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/admin/katha");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-orange-500 mb-4">
        Edit Katha
      </h1>

      <KathaForm
        form={form}
        setForm={setForm}
        onSubmit={submit}
        submitText="Update Katha"
      />
    </div>
  );
}
