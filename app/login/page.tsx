"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Login = () => {
  const [account, setAccount] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9999/user");
      const users = await res.json();

      const matchedUser = users.find(
        (user: any) => user.username === account && user.password === pass
      );

      if (matchedUser) {
        localStorage.setItem("user", JSON.stringify(matchedUser));
        toast.success("Đăng nhập thành công!");
        router.push("/");
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 w-[500px] py-8 px-6">
        <div className="text-slate-400 space-y-4">
          <div className="text-center">
            <CardTitle className="text-white text-xl font-bold uppercase">
              Đăng nhập
            </CardTitle>
          </div>
          <div>
            <label className="block mb-1 font-medium">Tên đăng nhập</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full bg-slate-800/40 border border-slate-700/50 px-4 py-2 rounded-md text-white"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-800/40 border border-slate-700/50 px-4 py-2 rounded-md text-white"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-4 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-all"
          >
            {loading ? "Đang kiểm tra..." : "Bắt đầu ngay"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
