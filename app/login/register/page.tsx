"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Register = () => {
  const loading = false;
  const [account, setAccount] = useState("");
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Regex validate
  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(account)) {
      toast.error("Tên đăng nhập phải có định dạng @gmail.com");
      return;
    }

    if (!validatePassword(pass)) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
      return;
    }

    if (pass !== rePass) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const res = await fetch("http://localhost:9999/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: account, password: pass }),
      });

      if (res.ok) {
        toast.success("Đăng ký thành công!");
        setAccount("");
        setPass("");
        setRePass("");
        router.push("/login");
      } else {
        toast.error("Đăng ký không thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      toast.error("Có lỗi xảy ra khi kết nối server");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister(e);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <Card className="bg-slate-800/40 w-full max-w-md border border-slate-700/50">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <CardTitle className="text-white text-3xl font-bold">
              Drive Master
            </CardTitle>
            <p className="text-slate-400">Đăng ký tài khoản</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập email @gmail.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Reinput password */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={rePass}
                  onChange={(e) => setRePass(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập lại mật khẩu"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !account.trim() || !pass.trim() || !rePass.trim()}
              className="w-full mt-6 h-12 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang kiểm tra...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Đăng ký
                </div>
              )}
            </Button>

            <p className="text-center text-slate-400 text-sm pt-2">
              <span>Bạn đã có tài khoản? </span>
              <Link href="/login" className="text-white">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Register;
