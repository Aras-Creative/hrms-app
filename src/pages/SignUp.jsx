import axios from "axios";
import React, { useState, useEffect } from "react";

const SignUp = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mengambil data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    // Ganti dengan URL API yang sesuai
    const apiUrl = "http://localhost:3000/api/v1/auth/test"; // Contoh API

    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data); // Menyimpan data ke state
        setLoading(false); // Menandakan loading selesai
      })
      .catch((err) => {
        setError("Failed to fetch data"); // Menangani error
        setLoading(false);
      });
  }, []); // useEffect hanya dipanggil sekali saat komponen pertama kali dimuat

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data &&
          data.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SignUp;
