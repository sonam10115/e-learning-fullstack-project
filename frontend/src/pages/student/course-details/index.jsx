import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const checkCoursePurchaseInfoResponse =
      await checkCoursePurchaseInfoService(
        currentCourseDetailsId,
        auth?.user._id,
      );

    if (
      checkCoursePurchaseInfoResponse?.success &&
      checkCoursePurchaseInfoResponse?.data
    ) {
      navigate(`/course-progress/${currentCourseDetailsId}`);
      return;
    }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId,
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId),
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      (setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null));
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview,
        )
      : -1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F7FA" }}>
      <div
        className="text-white p-6 sm:p-8 lg:p-12 rounded-b-3xl"
        style={{ backgroundColor: "#071426" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {studentViewCourseDetails?.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">
            {studentViewCourseDetails?.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
            <span>Created By {studentViewCourseDetails?.instructorName}</span>
            <span>
              Created On {studentViewCourseDetails?.date.split("T")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              {studentViewCourseDetails?.primaryLanguage}
            </span>
            <span>
              {studentViewCourseDetails?.students.length}{" "}
              {studentViewCourseDetails?.students.length <= 1
                ? "Student"
                : "Students"}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <main className="flex-grow">
              <Card
                className="mb-8 border-2 shadow-lg"
                style={{ borderColor: "#1B9AAA" }}
              >
                <CardHeader
                  className="pb-3 sm:pb-4"
                  style={{
                    backgroundColor: "#F4F7FA",
                    borderBottom: "2px solid #1B9AAA",
                  }}
                >
                  <CardTitle
                    style={{ color: "#071426" }}
                    className="text-xl sm:text-2xl"
                  >
                    What you'll learn
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {studentViewCourseDetails?.objectives
                      .split(",")
                      .map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle
                            className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-1"
                            style={{ color: "#1B9AAA" }}
                          />
                          <span
                            style={{ color: "#142C52" }}
                            className="font-medium text-sm sm:text-base"
                          >
                            {objective}
                          </span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
              <Card
                className="mb-8 border-2 shadow-lg"
                style={{ borderColor: "#1B9AAA" }}
              >
                <CardHeader
                  className="pb-3 sm:pb-4"
                  style={{
                    backgroundColor: "#F4F7FA",
                    borderBottom: "2px solid #1B9AAA",
                  }}
                >
                  <CardTitle
                    style={{ color: "#071426" }}
                    className="text-xl sm:text-2xl"
                  >
                    Course Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <p
                    style={{ color: "#142C52" }}
                    className="leading-relaxed text-sm sm:text-base lg:text-lg"
                  >
                    {studentViewCourseDetails?.description}
                  </p>
                </CardContent>
              </Card>
              <Card
                className="mb-8 border-2 shadow-lg"
                style={{ borderColor: "#1B9AAA" }}
              >
                <CardHeader
                  className="pb-3 sm:pb-4"
                  style={{
                    backgroundColor: "#F4F7FA",
                    borderBottom: "2px solid #1B9AAA",
                  }}
                >
                  <CardTitle
                    style={{ color: "#071426" }}
                    className="text-xl sm:text-2xl"
                  >
                    Course Curriculum
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-2 sm:space-y-3">
                    {studentViewCourseDetails?.curriculum?.map(
                      (curriculumItem, index) => (
                        <div
                          key={index}
                          className={`${
                            curriculumItem?.freePreview
                              ? "cursor-pointer hover:bg-opacity-80"
                              : "cursor-not-allowed opacity-60"
                          } flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all`}
                          style={{
                            backgroundColor: curriculumItem?.freePreview
                              ? "#F4F7FA"
                              : "#E8E8E8",
                            borderLeft: `4px solid ${curriculumItem?.freePreview ? "#1B9AAA" : "#142C52"}`,
                          }}
                          onClick={
                            curriculumItem?.freePreview
                              ? () => handleSetFreePreview(curriculumItem)
                              : null
                          }
                        >
                          {curriculumItem?.freePreview ? (
                            <PlayCircle
                              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                              style={{ color: "#1B9AAA" }}
                            />
                          ) : (
                            <Lock
                              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                              style={{ color: "#142C52" }}
                            />
                          )}
                          <span
                            style={{ color: "#142C52" }}
                            className="font-medium text-sm sm:text-base flex-1"
                          >
                            {curriculumItem?.title}
                          </span>
                          {curriculumItem?.freePreview && (
                            <span
                              className="text-xs px-2 py-1 rounded whitespace-nowrap"
                              style={{
                                backgroundColor: "#1B9AAA",
                                color: "white",
                              }}
                            >
                              Free Preview
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </main>
            <aside className="w-full lg:w-96 xl:w-[500px]">
              <Card
                className="sticky top-4 border-2 shadow-2xl"
                style={{ borderColor: "#1B9AAA" }}
              >
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div
                    className="aspect-video mb-4 sm:mb-6 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "#071426" }}
                  >
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[
                              getIndexOfFreePreviewUrl
                            ].videoUrl
                          : ""
                      }
                      width="450px"
                      height="200px"
                    />
                  </div>
                  <div
                    className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg"
                    style={{ backgroundColor: "#F4F7FA" }}
                  >
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: "#142C52" }}
                    >
                      Course Price
                    </p>
                    <p
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2"
                      style={{ color: "#1B9AAA" }}
                    >
                      ${studentViewCourseDetails?.pricing}
                    </p>
                  </div>
                  <Button
                    onClick={handleCreatePayment}
                    className="w-full py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-bold rounded-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#1B9AAA", color: "white" }}
                  >
                    Buy Now
                  </Button>
                  <p
                    className="text-center mt-3 sm:mt-4 text-xs sm:text-sm"
                    style={{ color: "#142C52" }}
                  >
                    30-day money back guarantee
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
          <Dialog
            open={showFreePreviewDialog}
            onOpenChange={() => {
              setShowFreePreviewDialog(false);
              setDisplayCurrentVideoFreePreview(null);
            }}
          >
            <DialogContent
              className="w-full max-w-2xl sm:max-w-4xl"
              style={{ backgroundColor: "#F4F7FA" }}
            >
              <DialogHeader>
                <DialogTitle
                  style={{ color: "#071426" }}
                  className="text-xl sm:text-2xl"
                >
                  Course Preview
                </DialogTitle>
              </DialogHeader>
              <div
                className="aspect-video rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: "#071426" }}
              >
                <VideoPlayer
                  url={displayCurrentVideoFreePreview}
                  width="450px"
                  height="200px"
                />
              </div>
              <div
                className="flex flex-col gap-2 border-t-2"
                style={{ borderColor: "#1B9AAA" }}
              >
                <p
                  className="font-bold mt-4 text-sm sm:text-base"
                  style={{ color: "#142C52" }}
                >
                  Other Free Previews:
                </p>
                {studentViewCourseDetails?.curriculum
                  ?.filter((item) => item.freePreview)
                  .map((filteredItem) => (
                    <p
                      key={filteredItem._id}
                      onClick={() => handleSetFreePreview(filteredItem)}
                      className="cursor-pointer text-sm sm:text-[16px] font-medium p-2 rounded-lg transition-all hover:bg-opacity-80 py-2 px-3"
                      style={{ color: "#1B9AAA", backgroundColor: "#F4F7FA" }}
                    >
                      ▶ {filteredItem?.title}
                    </p>
                  ))}
              </div>
              <DialogFooter className="sm:justify-start gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    style={{ backgroundColor: "#1B9AAA", color: "white" }}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
