import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  MessageCircle,
  Download,
  BookOpen,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
// import ChatPage from "@/pages/chat/ChatPage";
// import Chat from "@/pages/student/home/chat";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [chatTarget, setChatTarget] = useState({
    courseId: null,
    instructorId: null,
  });

  // async function handleOpenChat() {
  //   console.log(
  //     "FULL COURSE DETAILS ===>",
  //     studentCurrentCourseProgress?.courseDetails,
  //   );

  //   const courseId = studentCurrentCourseProgress?.courseDetails?._id;
  //   const instructorId =
  //     studentCurrentCourseProgress?.courseDetails?.instructorId;

  //   console.log("CHAT CLICKED");
  //   console.log("courseId:", courseId);
  //   console.log("instructorId:", instructorId);

  //   if (!courseId || !instructorId) {
  //     console.log("IDs missing, navigation stopped");
  //     return;
  //   }

  //   // Open chat inside the right sidebar (embedded)
  //   setChatTarget({ courseId, instructorId });
  //   setShowChatSidebar(true);
  // }

  async function handleDownloadLecture() {
    if (!currentLecture?.videoUrl) {
      alert("Video URL not available for download");
      return;
    }

    try {
      // Create a temporary link to download the video
      const link = document.createElement("a");
      link.href = currentLecture.videoUrl;
      link.setAttribute("download", currentLecture?.title || "lecture.mp4");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download lecture");
    }
  }

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1,
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ],
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id,
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id,
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  console.log(currentLecture, "currentLecture");

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "#F4F7FA" }}
    >
      {showConfetti && <Confetti />}
      <div
        className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b-2 shadow-md"
        style={{
          backgroundColor: "#071426",
          borderColor: "#1B9AAA",
          boxShadow: "0 4px 12px rgba(27, 154, 170, 0.15)",
        }}
      >
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-xs sm:text-sm font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 flex-shrink-0"
            style={{ backgroundColor: "#1B9AAA", color: "white" }}
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="hidden md:flex flex-col min-w-0">
            <h1
              className="text-sm font-bold truncate"
              style={{ color: "#F4F7FA" }}
            >
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
            <p className="text-xs opacity-75" style={{ color: "#1B9AAA" }}>
              Learning Progress
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          style={{ backgroundColor: "#1B9AAA", color: "white" }}
          className="font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 ml-2"
          size="sm"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[350px] sm:mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div
            className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 border-t-2 shadow-sm"
            style={{ backgroundColor: "#F4F7FA", borderColor: "#1B9AAA" }}
          >
            <div className="flex-1">
              <h2
                className="text-lg sm:text-2xl font-bold mb-1"
                style={{ color: "#071426" }}
              >
                {currentLecture?.title}
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: "#142C52" }}>
                Now Playing
              </p>
            </div>

            {/* BUTTONS SECTION */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => {
                  const instructorId =
                    studentCurrentCourseProgress?.courseDetails?.instructorId;
                  const instructorName =
                    studentCurrentCourseProgress?.courseDetails
                      ?.instructorName || "Instructor";
                  if (!instructorId) {
                    alert("Instructor not available for this course.");
                    return;
                  }

                  navigate("/chat", {
                    state: {
                      selectedUser: {
                        _id: instructorId,
                        userName: instructorName,
                      },
                    },
                  });
                }}
                className="text-xs sm:text-sm font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                style={{ backgroundColor: "#1B9AAA", color: "white" }}
                size="sm"
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Message</span>
                <span className="sm:hidden">Chat</span>
              </Button>
              <Button
                onClick={() => navigate("/quiz")}
                className="text-xs sm:text-sm font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                style={{ backgroundColor: "#1B9AAA", color: "white" }}
                size="sm"
              >
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Quiz</span>
                <span className="sm:hidden">📝</span>
              </Button>
              <Button
                onClick={handleDownloadLecture}
                className="text-xs sm:text-sm font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                style={{ backgroundColor: "#142C52", color: "white" }}
                size="sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
        </div>
        <div
          className={`fixed top-14 sm:top-16 right-0 bottom-0 w-[320px] sm:w-[400px] transition-all duration-300 border-l-2 shadow-2xl ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "#F4F7FA", borderColor: "#1B9AAA" }}
        >
          {showChatSidebar ? (
            <div className="h-full flex flex-col">
              <div
                className="flex items-center justify-between p-3 sm:p-4 border-b-2 shadow-md"
                style={{ backgroundColor: "#071426", borderColor: "#1B9AAA" }}
              >
                <div>
                  <h3
                    className="text-sm sm:text-base font-bold"
                    style={{ color: "#1B9AAA" }}
                  >
                    💬 Instructor Chat
                  </h3>
                  <p
                    className="text-xs leading-tight mt-1"
                    style={{ color: "#F4F7FA", opacity: 0.75 }}
                  >
                    {studentCurrentCourseProgress?.courseDetails?.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowChatSidebar(false)}
                    className="text-xs font-bold hover:scale-110 transition-all"
                    style={{ color: "#1B9AAA" }}
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <Chat
                  courseIdProp={chatTarget.courseId}
                  otherUserIdProp={chatTarget.instructorId}
                  embedded={true}
                />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="content" className="h-full flex flex-col">
              <TabsList
                className="grid w-full grid-cols-2 p-0 h-12 sm:h-14 rounded-none shadow-sm"
                style={{ backgroundColor: "#071426" }}
              >
                <TabsTrigger
                  value="content"
                  className="text-xs sm:text-sm font-bold rounded-none transition-all duration-200"
                  style={{ color: "#1B9AAA" }}
                >
                  📚 Lessons
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="text-xs sm:text-sm font-bold rounded-none transition-all duration-200"
                  style={{ color: "#1B9AAA" }}
                >
                  ℹ️ About
                </TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                      (item, index) => (
                        <div
                          className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-medium cursor-pointer p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-101 group"
                          key={item._id}
                          style={{
                            backgroundColor:
                              studentCurrentCourseProgress?.progress?.find(
                                (progressItem) =>
                                  progressItem.lectureId === item._id,
                              )?.viewed
                                ? "#E8F5F5"
                                : "#FFFFFF",
                            borderLeft: `4px solid ${
                              studentCurrentCourseProgress?.progress?.find(
                                (progressItem) =>
                                  progressItem.lectureId === item._id,
                              )?.viewed
                                ? "#1B9AAA"
                                : "#142C52"
                            }`,
                            boxShadow:
                              studentCurrentCourseProgress?.progress?.find(
                                (progressItem) =>
                                  progressItem.lectureId === item._id,
                              )?.viewed
                                ? "0 2px 8px rgba(27, 154, 170, 0.1)"
                                : "none",
                          }}
                        >
                          <div
                            className="flex items-center justify-center h-6 w-6 rounded-full flex-shrink-0 font-bold text-xs"
                            style={{
                              backgroundColor: "#142C52",
                              color: "#F4F7FA",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="truncate"
                              style={{ color: "#071426" }}
                            >
                              {item?.title}
                            </p>
                          </div>
                          {studentCurrentCourseProgress?.progress?.find(
                            (progressItem) =>
                              progressItem.lectureId === item._id,
                          )?.viewed ? (
                            <Check
                              className="h-4 w-4 flex-shrink-0 font-bold"
                              style={{ color: "#1B9AAA" }}
                            />
                          ) : (
                            <Play
                              className="h-4 w-4 flex-shrink-0 opacity-50"
                              style={{ color: "#142C52" }}
                            />
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="overview" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-3 sm:p-4">
                    <div
                      className="mb-4 p-3 rounded-lg"
                      style={{
                        backgroundColor: "#E8F5F5",
                        borderLeft: "4px solid #1B9AAA",
                      }}
                    >
                      <h2
                        className="text-base sm:text-lg font-bold mb-3"
                        style={{ color: "#071426" }}
                      >
                        About Course
                      </h2>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: "#142C52" }}
                      >
                        {
                          studentCurrentCourseProgress?.courseDetails
                            ?.description
                        }
                      </p>
                    </div>
                    <div
                      className="mt-4 p-3 rounded-lg"
                      style={{
                        backgroundColor: "#F0F8F8",
                        borderLeft: "4px solid #142C52",
                      }}
                    >
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "#071426" }}
                      >
                        💡 Tip: Complete all lessons to earn your certificate!
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent
          className="sm:w-[425px] rounded-xl"
          style={{ backgroundColor: "#F4F7FA" }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: "#1B9AAA", color: "white" }}
              >
                🔒
              </div>
              <DialogTitle style={{ color: "#071426" }}>
                Course Locked
              </DialogTitle>
            </div>
            <DialogDescription style={{ color: "#142C52" }} className="text-sm">
              You need to purchase this course to unlock all lessons and
              materials.
            </DialogDescription>
          </DialogHeader>
          <div
            className="mt-4 p-4 rounded-lg"
            style={{
              backgroundColor: "#E8F5F5",
              borderLeft: "4px solid #1B9AAA",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#071426" }}>
              Get full access to premium learning content today!
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent
          showOverlay={false}
          className="sm:w-[450px] rounded-xl"
          style={{ backgroundColor: "#F4F7FA" }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-2xl animate-bounce"
                style={{ backgroundColor: "#1B9AAA", color: "white" }}
              >
                🎉
              </div>
              <DialogTitle style={{ color: "#1B9AAA" }} className="text-2xl">
                Course Complete!
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div
              className="p-4 rounded-lg text-center"
              style={{
                backgroundColor: "#E8F5F5",
                borderLeft: "4px solid #1B9AAA",
              }}
            >
              <Label
                style={{ color: "#071426" }}
                className="text-base font-bold block mb-2"
              >
                🏆 Congratulations!
              </Label>
              <p style={{ color: "#142C52" }} className="text-sm">
                You've successfully completed this course. Your certificate is
                ready!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                onClick={() => navigate("/student-courses")}
                style={{ backgroundColor: "#1B9AAA", color: "white" }}
                className="font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                My Courses
              </Button>
              <Button
                onClick={handleRewatchCourse}
                style={{ backgroundColor: "#142C52", color: "white" }}
                className="font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Rewatch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
