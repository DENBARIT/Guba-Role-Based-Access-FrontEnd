
import { useState, useEffect } from "react";
import axios from "axios";

export default function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/roles")
      .then(res => setRoles(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading };
}
