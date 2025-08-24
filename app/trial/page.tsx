"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Shuffle, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const handleRandomTest = () => {
    const randomIndex = Math.floor(Math.random() * element.length);
    const randomHref = element[randomIndex].href;
    router.push(randomHref);
  };
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center gap-8">
      <Button className="absolute top-8 left-10 z-50 cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4 ml-1" />
          <span className="mr-1">Trang chủ</span>
        </Link>
      </Button>
      <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 group cursor-pointer relative overflow-hidden w-[500px] py-8">
        <div className="relative z-10 text-sm text-slate-400 px-10">
          <div className="flex items-center justify-center mb-4 ">
            <CardTitle className="text-white text-xl font-bold uppercase text-center">
              Bộ đề thi thử bằng lái xe máy A1
            </CardTitle>
          </div>
          <div className="text-justify">
            Bộ đề thi thử bằng lái xe A1 mô phỏng dựa trên phần mềm lý thuyết
            thi bằng lái xe máy của Bộ Công An. Cấu trúc bộ đề thi A1 sẽ bao gồm
            25 câu hỏi trắc nghiệm, bao gồm 11 câu hỏi phần kiến thức luật cơ
            bản; 7 câu hỏi phần biển báo và 7 câu hỏi sa hình.
          </div>
          <div className="flex flex-col py-4 gap-2 font-bold">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>19 phút</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Số câu cần đạt: 21/25 điểm (không sai câu điểm liệt)</span>
            </div>
          </div>
          <div className="text-justify">
            <strong>Lưu ý:</strong> Khi trả lời đúng tất cả các câu hỏi trong 10
            đề thi thử bằng lái xe máy A1 online này, có nghĩa là bạn đã trả lời
            đúng và đầy đủ 250 câu hỏi dùng cho sát hạch, cấp giấy phép lái xe
            hạng A1.
          </div>
        </div>
      </Card>
      <Button
        onClick={handleRandomTest}
        className="z-10 cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Shuffle className="w-4 h-4 ml-1" />
        <span className="mr-1">Chọn đề ngẫu nhiên</span>
      </Button>
      <div className="grid grid-cols-5 w-[500px] gap-4">
        {element.map((item) => (
          <div
            key={item.name}
            className="text-center bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:border-white p-2 text-white rounded-lg hover:transform hover:scale-105 transition-all duration-300"
          >
            <Link href={item.href} key={item.name}>
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;

const element = [
  {
    name: "Đề 01",
    href: "/trial/1",
  },
  {
    name: "Đề 02",
    href: "/trial/2",
  },
  {
    name: "Đề 03",
    href: "/trial/3",
  },
  {
    name: "Đề 04",
    href: "/trial/4",
  },
  {
    name: "Đề 05",
    href: "/trial/5",
  },
  {
    name: "Đề 06",
    href: "/trial/6",
  },
  {
    name: "Đề 07",
    href: "/trial/7",
  },
  {
    name: "Đề 08",
    href: "/trial/8",
  },
  {
    name: "Đề 09",
    href: "/trial/9",
  },
  {
    name: "Đề 10",
    href: "/trial/10",
  },
];
