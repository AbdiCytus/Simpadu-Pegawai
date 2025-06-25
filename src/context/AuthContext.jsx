import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = "https://ti054c02.agussbn.my.id/";

  const fetchUserData = async (currentToken) => {
    if (currentToken) {
      try {
        const response = await axios.get(`${baseURL}/api/data`, {
          headers: { Authorization: currentToken },
        });

        // --- LOGIKA BARU UNTUK MENANGANI DATA BERBEDA ---
        // Selalu set data pegawai
        if (response.data.pegawai) {
          setUser(response.data.pegawai);
        }

        // Hanya set data mengajar jika ada di dalam response (untuk Dosen)
        if (response.data.mengajar) {
          setJadwal(response.data.mengajar);
        } else {
          // Kosongkan jadwal jika user bukan dosen
          setJadwal([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      fetchUserData(currentToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${baseURL}/login`, {
        username,
        password,
      });
      if (response.data && response.data.token) {
        const receivedToken = response.data.token;
        setToken(receivedToken);
        localStorage.setItem("token", receivedToken);
        await fetchUserData(receivedToken);
      } else {
        throw new Error("username atau password tidak valid.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Terjadi kesalahan.";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setJadwal([]); // Hapus juga jadwal saat logout
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  // Sediakan `jadwal` ke semua komponen anak
  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        user,
        baseURL,
        jadwal,
        loading,
        login,
        logout,
        fetchUserData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
