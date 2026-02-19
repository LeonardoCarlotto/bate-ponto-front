import { useState, useEffect } from "react";
import { getUserRegisters } from "../services/api";

export default function UseRegisters(isAuthenticated) {
  const [records, setRecords] = useState([]);

  const fetchRegisters = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await getUserRegisters(token);

    const mapped = data
      .map((r) => {
        if (!r.date || !r.time) return null;

        const [day, month, year] = r.date.split("/");
        const iso = `${year}-${month}-${day}T${r.time}:00`;
        const dateObj = new Date(iso);

        return {
          id: r.id,
          datetime: dateObj,
          type: r.type?.toUpperCase(),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.datetime - b.datetime);

    setRecords(mapped);
  };

  useEffect(() => {
    if (isAuthenticated) fetchRegisters();
  }, [isAuthenticated]);

  return { records, fetchRegisters };
}