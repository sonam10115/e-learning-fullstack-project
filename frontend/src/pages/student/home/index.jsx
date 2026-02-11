import { courseCategories } from "@/config";
import { heroLogos } from "../../constant/data";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import * as variants from "../../../motion/animation";
import { RiPlayFill } from "@remixicon/react";
import Marquee from "react-fast-marquee";
import StudentBenefitPage from "./benefit";
import Footer from "./footer";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    console.log(
      "handleCourseNavigate called with courseId:",
      getCurrentCourseId,
    );
    try {
      if (!auth?.user?._id) {
        console.error("User not authenticated, auth:", auth);
        navigate("/login");
        return;
      }

      console.log(
        "Calling checkCoursePurchaseInfoService with courseId:",
        getCurrentCourseId,
        "studentId:",
        auth.user._id,
      );
      const response = await checkCoursePurchaseInfoService(
        getCurrentCourseId,
        auth?.user?._id,
      );

      console.log("Response from service:", response);
      if (response?.success) {
        if (response?.data) {
          console.log("Navigating to course-progress");
          navigate(`/course-progress/${getCurrentCourseId}`);
        } else {
          console.log("Navigating to course details");
          navigate(`/course/details/${getCurrentCourseId}`);
        }
      } else {
        console.error("Service response not successful:", response);
      }
    } catch (error) {
      console.error("Axios error in handleCourseNavigate:", error);
      // Optionally, show a toast or alert to the user
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <section className="overflow-x-hidden w-full pr-0">
      {/* <section> */}
      <motion.div
        variants={variants.staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container pr-0"
      >
        {/* content */}
        <div className="text-center bg-[#142C52]">
          {/* {title} */}
          <div className="relative  max-w-full pt-8 pl-8 pr-8 ">
            <motion.div
              variants={variants.fadeInUp}
              className="flex items-center bg-[#F4F7FA] rounded-lg p-3.5 justify-center gap-2.5 max-w-max mx-auto flex-wrap text-center "
            >
              <span>
                <img
                  src="/shape-2.png"
                  alt="title shape"
                  width={48}
                  height={48}
                />
              </span>
              <motion.h1
                variants={variants.fadeInUp}
                className="text-2xl md:text-4xl font-bold text-[#142C52]"
              >
                <span className="text-[#1B9AAA]">unlock</span> your creative
                potential
              </motion.h1>
            </motion.div>
          </div>
          <motion.p
            variants={variants.fadeInUp}
            className="text-2xl font-medium mt-4 md:text-[28px] text-[#F4F7FA]"
          >
            with Online Design and Development Courses.
          </motion.p>
          <motion.p
            variants={variants.fadeInUp}
            className="mt-4 text-lg text-[#F4F7FA]"
          >
            Learn from Industry Experts and Enhance Your Skills.
          </motion.p>

          {/* buttons wrapper */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            <motion.button
              variants={variants.fadeInUp}
              className="max-sm:[80%]"
            >
              <Button className=" bg-[#1B9AAA] ">
                <a href="courses">Explore Courses</a>
              </Button>
            </motion.button>
          </div>

          {/* client logo */}

          <motion.div
            variants={variants.fadeIn}
            className="mt-8 lg:mt-[100px] relative overflow-hidden "
          >
            <Marquee pauseOnHover={true}>
              {heroLogos.map((logo) => (
                //logo
                <div className=" px-14 py-5 bg-[#F4F7FA] " key={logo.id}>
                  <img src={logo.img} alt="logo" className="w-auto h-7" />
                </div>
              ))}
            </Marquee>
          </motion.div>
        </div>
        {/* Banner */}
        <motion.figure
          variants={variants.fadeIn}
          className="relative  max-w-full w-full h-[300px] md:h-[500px] mx-auto rounded-xl overflow-hidden"
        >
          <img
            src="/hero-image.jpg"
            alt="hero-banner"
            className="w-full h-full object-cover"
          />
          {/* 
          dark overlay
          <div className="absolute insert-0 bg-black/20 z-10"></div>

          {/* play button */}
          {/* <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            <span className="flex bg-white w-16 h-16 items-center justify-center rounded-full play-btn ">
              <RiPlayFill size={30} />
            </span>
          </div> */}
        </motion.figure>
      </motion.div>
      <div className=" mt-2 ">
        <StudentBenefitPage></StudentBenefitPage>
      </div>
      {/* </section> */}

      <h2 className="text-2xl font-bold mb-6 mt-2 text-[#142C52]">
        Course Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {courseCategories.map((categoryItem) => (
          <Button
            className="justify-start"
            variant="outline"
            key={categoryItem.id}
            onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
          >
            {categoryItem.label}
          </Button>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-2 text-[#142C52] mb-6">
        Featured Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
          studentViewCoursesList.map((courseItem) => (
            <div
              onClick={() => handleCourseNavigate(courseItem?._id)}
              className="border rounded-lg overflow-hidden shadow cursor-pointer"
            >
              <img
                src={courseItem?.image}
                width={300}
                height={150}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {courseItem?.instructorName}
                </p>
                <p className="font-bold text-[16px] mb-4">
                  ${courseItem?.pricing}
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleCourseNavigate(courseItem?._id);
                  }}
                  className="w-full bg-[#4e595a] hover:bg-[#142C52] text-white"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ))
        ) : (
          <h1>No Courses Found</h1>
        )}
      </div>
      <Footer></Footer>
    </section>
  );
}

export default StudentHomePage;
