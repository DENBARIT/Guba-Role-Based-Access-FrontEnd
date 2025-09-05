
import axios from "axios";

export default function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}
