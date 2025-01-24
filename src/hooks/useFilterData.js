import { useState, useEffect } from "react";
import { api } from "services/api";

export const useFilterData = () => {
  const [markets, setMarkets] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [marketsResponse, sectorsResponse] = await Promise.all([
          api.getMarkets(),
          api.getSectors(),
        ]);

        setMarkets(marketsResponse.data);
        setSectors(sectorsResponse.data);
        setError(null);
      } catch (err) {
        setError("Error fetching filter data");
        console.error("Error fetching filter data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { markets, sectors, loading, error };
};
