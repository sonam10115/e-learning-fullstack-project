import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch, Award } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CertificateModal from "@/components/certificate-modal";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [certificateModal, setCertificateModal] = useState({
    isOpen: false,
    courseId: null,
    courseName: null,
  });

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  const openCertificateModal = (courseId, courseName) => {
    setCertificateModal({
      isOpen: true,
      courseId,
      courseName,
    });
  };

  const closeCertificateModal = () => {
    setCertificateModal({
      isOpen: false,
      courseId: null,
      courseName: null,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F7FA" }}>
      {/* Hero Section */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-b-2 shadow-sm"
        style={{ backgroundColor: "#071426", borderColor: "#1B9AAA" }}
      >
        <div className="container mx-auto px-0">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: "#1B9AAA", color: "white" }}
            >
              📚
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              style={{ color: "#F4F7FA" }}
            >
              My Learning Journey
            </h1>
          </div>
          <p className="text-sm sm:text-base mt-2" style={{ color: "#1B9AAA" }}>
            {studentBoughtCoursesList?.length || 0}{" "}
            {studentBoughtCoursesList?.length === 1 ? "course" : "courses"}{" "}
            enrolled • Keep growing! 🚀
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="container mx-auto px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
              studentBoughtCoursesList.map((course) => (
                <Card
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                  style={{ borderColor: "#1B9AAA", backgroundColor: "white" }}
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={course?.courseImage}
                      alt={course?.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: "#1B9AAA", color: "white" }}
                    >
                      Active
                    </div>
                  </div>

                  <CardContent className="p-4 sm:p-5 flex-grow">
                    <h3
                      className="font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r from-[#1B9AAA] to-[#142C52] group-hover:bg-clip-text transition-all"
                      style={{ color: "#071426" }}
                    >
                      {course?.title}
                    </h3>
                    <p
                      className="text-xs sm:text-sm font-medium mb-3"
                      style={{ color: "#1B9AAA" }}
                    >
                      👨‍🏫 {course?.instructorName}
                    </p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "#142C52" }}
                      >
                        <span>📅</span>
                        <span>
                          {new Date(course?.dateOfPurchase).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "#142C52" }}
                      >
                        <span>⏱️</span>
                        <span>In Progress</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter
                    className="p-4 sm:p-5 flex flex-col gap-2 border-t-2"
                    style={{ borderColor: "#1B9AAA" }}
                  >
                    <Button
                      onClick={() =>
                        navigate(`/course-progress/${course?.courseId}`)
                      }
                      className="w-full text-sm sm:text-base font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
                      style={{ backgroundColor: "#1B9AAA", color: "white" }}
                    >
                      <Watch className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>

                    <Button
                      onClick={() =>
                        openCertificateModal(course?.courseId, course?.title)
                      }
                      className="w-full text-sm sm:text-base font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
                      style={{ backgroundColor: "#142C52", color: "white" }}
                    >
                      <Award className="mr-2 h-4 w-4" />
                      Certificate
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card
                  className="p-8 sm:p-12 text-center rounded-xl border-2"
                  style={{ borderColor: "#1B9AAA", backgroundColor: "white" }}
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className="h-20 w-20 rounded-full flex items-center justify-center text-5xl"
                      style={{ backgroundColor: "#E8F5F5" }}
                    >
                      📖
                    </div>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold mb-3"
                    style={{ color: "#071426" }}
                  >
                    No Courses Yet
                  </h2>
                  <p
                    className="text-sm sm:text-base mb-6"
                    style={{ color: "#142C52" }}
                  >
                    Start your learning journey by exploring our amazing
                    courses!
                  </p>
                  <div
                    className="inline-block p-4 rounded-lg mb-6"
                    style={{
                      backgroundColor: "#E8F5F5",
                      borderLeft: "4px solid #1B9AAA",
                    }}
                  >
                    <p
                      className="text-xs sm:text-sm font-semibold"
                      style={{ color: "#071426" }}
                    >
                      💡 Browse hundreds of courses and expand your skills
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/student/courses")}
                    className="text-sm sm:text-base font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: "#1B9AAA", color: "white" }}
                  >
                    Explore Courses
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        courseId={certificateModal.courseId}
        courseName={certificateModal.courseName}
        studentName={auth?.user?.userName || "Student"}
        isOpen={certificateModal.isOpen}
        onClose={closeCertificateModal}
      />
    </div>
  );
}

export default StudentCoursesPage;
