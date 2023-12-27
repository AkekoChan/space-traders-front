import { useState, useEffect } from "react";

const useFetch = (options) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.spacetraders.io/v2/${options.endpoint}`,
        {
          method: options.method,
          headers: options.headers,
          body: options.body,
        }
      );
      const data = await response.json();

      setData(data);

      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
