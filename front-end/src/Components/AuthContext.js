import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authorization-token");
        if (token) {
            fetch("http://localhost:5000/api/user/verify-token", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(async (data) => {
                if (data.user) {
                    setUser(data.user.email);
                    await isAdmin();
                } else {
                    setUser(null);
                    setAdmin(false);
                }
            })
            .catch(() => {
                setUser(null);
                setAdmin(false);
            });
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao fazer login!");

            const token = response.headers.get("authorization-token");
            localStorage.setItem("authorization-token", token);

            setUser(data.user.email);
            localStorage.setItem("userEmail", data.user.email);
            await isAdmin();

            return true;
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            return false;
        }
    };

    const isAdmin = async () => {
        try {
            const token = localStorage.getItem("authorization-token");
            if (!token) return false;

            const response = await fetch("http://localhost:5000/api/user/admin", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            setAdmin(data.isAdmin);
            return data.isAdmin;
        } catch (error) {
            console.error("Erro ao verificar admin:", error.message);
            setAdmin(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("authorization-token");
        localStorage.removeItem("userEmail");
        setUser(null);
        setAdmin(false);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, admin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
