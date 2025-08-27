"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [account, setAccount] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1);
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Kiểm tra đã đăng nhập chưa
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [router]);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account.trim() || !pass.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:9999/user");

      if (!res.ok) throw new Error("Không thể kết nối đến máy chủ");

      const users = await res.json();
      const matchedUser = users.find(
        (user: { username: string; password: string }) =>
          user.username === account.trim() && user.password === pass
      );

      if (matchedUser) {
        localStorage.setItem("user", JSON.stringify(matchedUser));
        toast.success(`Chào mừng ${matchedUser.username}!`);

        if (matchedUser.role === "admin") router.push("/admin");
        else router.push("/");
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      toast.error("Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = () => {
    setForgot(true);
    setStep(1);
  };

  const handleSendCode = async () => {
    if (!forgotEmail.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    try {
      const res = await fetch("http://localhost:9999/user");
      const users = await res.json();
      const userExists = users.find(
        (u: { username: string }) => u.username === forgotEmail
      );

      if (!userExists) {
        toast.error("Email không tồn tại trong hệ thống!");
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      toast.success(`Mã xác thực: ${code}`);

      setStep(2);
    } catch (err) {
      toast.error("Có lỗi khi kiểm tra email!");
    }
  };

  const handleValidateCode = () => {
    if (verificationCode === generatedCode) {
      toast.success("Mã xác thực đúng!");
      setStep(3);
    } else {
      toast.error("Mã xác thực không đúng!");
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword(newPass)) {
      toast.error(
        "Mật khẩu phải tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
      return;
    }
    if (newPass !== reNewPass) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const res = await fetch("http://localhost:9999/user");
      const users = await res.json();
      const user = users.find(
        (u: { username: string }) => u.username === forgotEmail
      );

      if (!user) {
        toast.error("Không tìm thấy tài khoản!");
        return;
      }

      await fetch(`http://localhost:9999/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass }),
      });

      toast.success("Đổi mật khẩu thành công!");
      setForgot(false);
      setStep(1);
    } catch (err) {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu!");
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
            <p className="text-slate-400">Đăng nhập vào hệ thống</p>
          </div>

          {!forgot ? (
            <form onSubmit={handleLogin} className="space-y-4">
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Nhập tên đăng nhập"
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

              <div
                onClick={handleForgotPassword}
                className="text-end text-slate-400 text-sm hover:text-white cursor-pointer"
              >
                Quên mật khẩu?
              </div>

              <Button
                type="submit"
                disabled={loading || !account.trim() || !pass.trim()}
                className="w-full mt-6 h-12 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {loading ? "Đang kiểm tra..." : "Đăng nhập"}
              </Button>

              <p className="text-center text-slate-400 text-sm pt-2">
                <span>Bạn chưa có tài khoản? </span>
                <Link href="/login/register" className="text-white">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <label className="block text-slate-300 mb-4 font-medium">
                    Nhập email đã đăng ký
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Nhập email"
                    />
                  </div>
                  <Button
                    onClick={handleSendCode}
                    className="w-full mt-6 h-12 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    Gửi mã xác thực
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="block text-slate-300 mb-2 font-medium">
                    Nhập mã xác thực
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white"
                    placeholder="Nhập mã 6 chữ số"
                  />
                  <Button
                    onClick={handleValidateCode}
                    className="w-full mt-6 h-12 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    Gửi mã xác thực
                  </Button>
                </>
              )}

              {step === 3 && (
                <>
                  <label className="block text-slate-300 mb-2 font-medium">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <label className="block text-slate-300 mb-2 font-medium">
                    Nhập lại mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="password"
                      value={reNewPass}
                      onChange={(e) => setReNewPass(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-slate-800/40 border border-slate-700/50 rounded-md text-white"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    className="w-full mt-6 h-12 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    Đổi mật khẩu
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;
