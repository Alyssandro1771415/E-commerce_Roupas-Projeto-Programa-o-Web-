import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
            .then(data => {
                if (data.user) {
                    setUser(data.user.email);
                }
            })
            .catch(() => setUser(null));
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

            localStorage.setItem("authorization-token", response.headers.get("authorization-token"));
            setUser(data.user.email);
            return true;
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("authorization-token");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
