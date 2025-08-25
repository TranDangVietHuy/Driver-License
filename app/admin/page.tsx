"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Image as ImageIcon,
  LogOut,
  Check,
  X,
  Save,
  Cancel,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Answer {
  id: number;
  content: string;
  correct: boolean;
}

interface Question {
  id: string;
  question: string;
  answer: Answer[];
  categories: string[];
  compulsory: boolean;
  img_url: string | null;
}

const AdminPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [compulsoryFilter, setCompulsoryFilter] = useState("all");
  const [imageFilter, setImageFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    answer: [
      { id: 1, content: "", correct: false },
      { id: 2, content: "", correct: false },
      { id: 3, content: "", correct: false },
    ],
    categories: [],
    compulsory: false,
    img_url: null,
  });

  const router = useRouter();

  useEffect(() => {
    // Kiểm tra quyền admin
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang này!");
      router.push("/");
      return;
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, categoryFilter, compulsoryFilter, imageFilter]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:9999/questions");
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error);
      toast.error("Không thể tải danh sách câu hỏi");
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.categories.includes(categoryFilter));
    }

    // Lọc theo compulsory
    if (compulsoryFilter !== "all") {
      filtered = filtered.filter((q) =>
        compulsoryFilter === "true" ? q.compulsory : !q.compulsory
      );
    }

    // Lọc theo có ảnh
    if (imageFilter !== "all") {
      filtered = filtered.filter((q) =>
        imageFilter === "true" ? q.img_url !== null : q.img_url === null
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditForm({ ...question });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(
        `http://localhost:9999/questions/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        toast.success("Cập nhật câu hỏi thành công!");
        fetchQuestions();
        setEditingId(null);
        setEditForm({});
      } else {
        toast.error("Cập nhật câu hỏi thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;

    try {
      const response = await fetch(`http://localhost:9999/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xóa câu hỏi thành công!");
        fetchQuestions();
      } else {
        toast.error("Xóa câu hỏi thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Có lỗi xảy ra khi xóa!");
    }
  };

  const handleAddQuestion = async () => {
    // Validation
    if (!newQuestion.question || !newQuestion.categories?.length) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const hasCorrectAnswer = newQuestion.answer?.some((a) => a.correct);
    if (!hasCorrectAnswer) {
      toast.error("Vui lòng chọn ít nhất một đáp án đúng!");
      return;
    }

    try {
      const nextId = Math.max(...questions.map((q) => parseInt(q.id))) + 1;
      const questionToAdd = {
        ...newQuestion,
        id: nextId.toString(),
      };

      const response = await fetch("http://localhost:9999/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionToAdd),
      });

      if (response.ok) {
        toast.success("Thêm câu hỏi thành công!");
        fetchQuestions();
        setShowAddForm(false);
        setNewQuestion({
          question: "",
          answer: [
            { id: 1, content: "", correct: false },
            { id: 2, content: "", correct: false },
            { id: 3, content: "", correct: false },
          ],
          categories: [],
          compulsory: false,
          img_url: null,
        });
      } else {
        toast.error("Thêm câu hỏi thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      toast.error("Có lỗi xảy ra khi thêm!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🚗 Drive Master - Admin Panel
            </h1>
            <p className="text-slate-400">Quản lý câu hỏi thi bằng lái xe</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Bộ lọc & Tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-md text-white placeholder-slate-400"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="law">Luật giao thông</option>
                <option value="traffic-sign">Biển báo</option>
                <option value="situation">Tình huống</option>
              </select>

              {/* Compulsory Filter */}
              <select
                value={compulsoryFilter}
                onChange={(e) => setCompulsoryFilter(e.target.value)}
                className="bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
              >
                <option value="all">Tất cả câu hỏi</option>
                <option value="true">Câu hỏi liệt</option>
                <option value="false">Câu hỏi thường</option>
              </select>

              {/* Image Filter */}
              <select
                value={imageFilter}
                onChange={(e) => setImageFilter(e.target.value)}
                className="bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
              >
                <option value="all">Tất cả</option>
                <option value="true">Có hình ảnh</option>
                <option value="false">Không có hình ảnh</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-slate-400">
                Hiển thị {filteredQuestions.length} / {questions.length} câu hỏi
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm câu hỏi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Form Modal */}
        {showAddForm && (
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Thêm câu hỏi mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question */}
              <div>
                <label className="block text-slate-300 mb-2">Câu hỏi</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
                  rows={3}
                />
              </div>

              {/* Answers */}
              <div>
                <label className="block text-slate-300 mb-2">Đáp án</label>
                {newQuestion.answer?.map((answer, index) => (
                  <div key={answer.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={answer.correct}
                      onChange={(e) => {
                        const updatedAnswers = newQuestion.answer?.map((a, i) =>
                          i === index ? { ...a, correct: e.target.checked } : a
                        );
                        setNewQuestion({
                          ...newQuestion,
                          answer: updatedAnswers,
                        });
                      }}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={answer.content}
                      onChange={(e) => {
                        const updatedAnswers = newQuestion.answer?.map((a, i) =>
                          i === index ? { ...a, content: e.target.value } : a
                        );
                        setNewQuestion({
                          ...newQuestion,
                          answer: updatedAnswers,
                        });
                      }}
                      className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-1 text-white"
                      placeholder={`Đáp án ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Danh mục</label>
                  <select
                    value={newQuestion.categories?.[0] || ""}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        categories: [e.target.value],
                      })
                    }
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="law">Luật giao thông</option>
                    <option value="traffic-sign">Biển báo</option>
                    <option value="situation">Tình huống</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">
                    URL hình ảnh
                  </label>
                  <input
                    type="text"
                    value={newQuestion.img_url || ""}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        img_url: e.target.value || null,
                      })
                    }
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
                    placeholder="http://..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    checked={newQuestion.compulsory}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        compulsory: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-slate-300">Câu hỏi liệt</label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Cancel className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card
              key={question.id}
              className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50"
            >
              <CardContent className="p-6">
                {editingId === question.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <textarea
                      value={editForm.question}
                      onChange={(e) =>
                        setEditForm({ ...editForm, question: e.target.value })
                      }
                      className="w-full bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-2 text-white"
                      rows={3}
                    />

                    {editForm.answer?.map((answer, index) => (
                      <div key={answer.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={answer.correct}
                          onChange={(e) => {
                            const updatedAnswers = editForm.answer?.map(
                              (a, i) =>
                                i === index
                                  ? { ...a, correct: e.target.checked }
                                  : a
                            );
                            setEditForm({
                              ...editForm,
                              answer: updatedAnswers,
                            });
                          }}
                        />
                        <input
                          type="text"
                          value={answer.content}
                          onChange={(e) => {
                            const updatedAnswers = editForm.answer?.map(
                              (a, i) =>
                                i === index
                                  ? { ...a, content: e.target.value }
                                  : a
                            );
                            setEditForm({
                              ...editForm,
                              answer: updatedAnswers,
                            });
                          }}
                          className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-md px-3 py-1 text-white"
                        />
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Lưu
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300"
                      >
                        <Cancel className="w-4 h-4 mr-1" />
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Question
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">
                            ID: {question.id}
                          </span>
                          {question.categories.map((cat) => (
                            <span
                              key={cat}
                              className="text-sm bg-purple-600 text-white px-2 py-1 rounded"
                            >
                              {cat === "law"
                                ? "Luật"
                                : cat === "traffic-sign"
                                ? "Biển báo"
                                : "Tình huống"}
                            </span>
                          ))}
                          {question.compulsory && (
                            <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
                              Câu liệt
                            </span>
                          )}
                          {question.img_url && (
                            <span className="text-sm bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              Có ảnh
                            </span>
                          )}
                        </div>
                        <h3 className="text-white text-lg font-medium mb-3">
                          {question.question}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(question)}
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(question.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-700 text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {question.answer.map((answer, index) => (
                        <div
                          key={answer.id}
                          className={`p-3 rounded-md flex items-center gap-2 ${
                            answer.correct
                              ? "bg-green-900/20 border border-green-700/30"
                              : "bg-slate-700/20 border border-slate-700/30"
                          }`}
                        >
                          {answer.correct ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <X className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-slate-300">
                            {String.fromCharCode(65 + index)}. {answer.content}
                          </span>
                        </div>
                      ))}
                    </div>

                    {question.img_url && (
                      <div className="mt-4">
                        <img
                          src={question.img_url}
                          alt="Question illustration"
                          className="max-w-md rounded-md border border-slate-700/50"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
            <CardContent className="p-12 text-center">
              <div className="text-slate-400 text-lg">
                Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
