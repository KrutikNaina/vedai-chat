import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/contacts", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setContacts(res.data.contacts || []))
            .catch(() => setContacts([]));
    }, [token]);

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-orange-500">
                    Contact Messages
                </h1>

                <span className="text-sm text-neutral-400">
                    Total: {contacts.length}
                </span>
            </div>

            {/* Inbox */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {contacts.length === 0 ? (
                    <div className="p-10 text-center text-neutral-400">
                        📭 No contact messages yet
                    </div>
                ) : (
                    contacts.map((c) => (
                        <Link
                            key={c._id}
                            to={`/admin/contacts/${c._id}`}
                            className="group flex items-center justify-between gap-4 px-6 py-4 border-b border-neutral-800 hover:bg-neutral-800/60 transition"
                        >
                            {/* Left status bar */}
                            <div
                                className={`w-1 h-12 rounded-full ${c.status === "new"
                                        ? "bg-orange-500"
                                        : c.status === "read"
                                            ? "bg-blue-500"
                                            : "bg-green-500"
                                    }`}
                            />

                            {/* Main content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-white group-hover:text-orange-400 transition">
                                        {c.subject}
                                    </h3>

                                    {c.status === "new" && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-neutral-400 mt-1">
                                    {c.name} · {c.email}
                                </p>
                            </div>

                            {/* Status badge */}
                            <span
                                className={`text-xs px-3 py-1 rounded-full font-semibold ${c.status === "new"
                                    ? "bg-orange-500 text-black"
                                    : c.status === "read"
                                        ? "bg-blue-600 text-white"
                                        : "bg-green-600 text-white"
                                    }`}
                            >
                                {c.status.toUpperCase()}
                            </span>

                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
