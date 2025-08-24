"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.refresh();
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return isLoggedIn ? (
    <Button onClick={handleLogout} className="border border-slate-500 bg-slate-800 text-white cursor-pointer hover:scale-110 transition-all duration-300">
      Đăng xuất
    </Button>
  ) : (
    <Button onClick={handleLoginRedirect}>Đăng nhập</Button>
  );
};

export default Auth;
