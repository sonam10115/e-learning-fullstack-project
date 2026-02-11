import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    console.log(indexOfCurrentSeection, getSectionId);
    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id,
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id,
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  console.log(loadingState, "loadingState");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F7FA" }}>
      <div
        style={{ backgroundColor: "#071426" }}
        className="text-white py-8 sm:py-12 px-4 sm:px-6 mb-6 sm:mb-8"
      >
        <div className="container mx-auto px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Discover Our Courses
          </h1>
          <p className="text-base sm:text-lg opacity-90">
            Expand your knowledge with our premium course collection
          </p>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <aside className="w-full md:w-64 lg:w-72 space-y-4">
              <div className="rounded-lg p-4 sm:p-6 border bg-[#F4F7FA] border-[#1B9AAA]">
                {Object.keys(filterOptions).map((ketItem) => (
                  <div
                    key={ketItem}
                    className="mb-6 pb-6 border-b"
                    style={{ borderColor: "#1B9AAA" }}
                  >
                    <h3
                      className="font-bold mb-4 text-lg"
                      style={{ color: "#142C52" }}
                    >
                      {ketItem.toUpperCase()}
                    </h3>
                    <div className="grid gap-3 mt-3">
                      {filterOptions[ketItem].map((option) => (
                        <Label
                          key={option.id}
                          className="flex font-medium items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <Checkbox
                            checked={
                              filters &&
                              Object.keys(filters).length > 0 &&
                              filters[ketItem] &&
                              filters[ketItem].indexOf(option.id) > -1
                            }
                            onCheckedChange={() =>
                              handleFilterOnChange(ketItem, option)
                            }
                            className="border-2"
                            style={{
                              borderColor: "#1B9AAA",
                              accentColor: "#1B9AAA",
                            }}
                          />
                          <span style={{ color: "#142C52" }}>
                            {option.label}
                          </span>
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            <main className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg w-full sm:w-auto"
                      style={{ backgroundColor: "#1B9AAA", color: "white" }}
                    >
                      <ArrowUpDownIcon className="h-4 w-4" />
                      <span className="text-[16px] font-medium">Sort By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[180px] border-2"
                    style={{
                      backgroundColor: "#F4F7FA",
                      borderColor: "#1B9AAA",
                    }}
                  >
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={(value) => setSort(value)}
                    >
                      {sortOptions.map((sortItem) => (
                        <DropdownMenuRadioItem
                          value={sortItem.id}
                          key={sortItem.id}
                          style={{ color: "#142C52" }}
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span
                  className="text-xs sm:text-sm font-bold whitespace-nowrap"
                  style={{ color: "#142C52" }}
                >
                  {studentViewCoursesList.length} Results
                </span>
              </div>
              <div className="space-y-4">
                {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                  studentViewCoursesList.map((courseItem) => (
                    <Card
                      onClick={() => handleCourseNavigate(courseItem?._id)}
                      className="cursor-pointer border-2 transition-all hover:shadow-xl hover:-translate-y-1"
                      style={{
                        borderColor: "#1B9AAA",
                        backgroundColor: "white",
                      }}
                      key={courseItem?._id}
                    >
                      <CardContent className="flex flex-col sm:flex-row gap-3 sm:gap-6 p-4 sm:p-6">
                        <div className="w-full sm:w-48 h-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={courseItem?.image}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <CardTitle
                            className="text-lg sm:text-2xl mb-2"
                            style={{ color: "#071426" }}
                          >
                            {courseItem?.title}
                          </CardTitle>
                          <p
                            className="text-xs sm:text-sm mb-2"
                            style={{ color: "#142C52" }}
                          >
                            Instructor:{" "}
                            <span
                              className="font-bold"
                              style={{ color: "#1B9AAA" }}
                            >
                              {courseItem?.instructorName}
                            </span>
                          </p>
                          <p
                            className="text-xs sm:text-[16px] mt-2 sm:mt-3 mb-2 sm:mb-3"
                            style={{ color: "#142C52" }}
                          >
                            {`${courseItem?.curriculum?.length} ${
                              courseItem?.curriculum?.length <= 1
                                ? "Lecture"
                                : "Lectures"
                            } - ${courseItem?.level.toUpperCase()} Level`}
                          </p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 gap-2">
                            <p
                              className="font-bold text-lg sm:text-2xl"
                              style={{ color: "#1B9AAA" }}
                            >
                              ${courseItem?.pricing}
                            </p>
                            <div
                              className="px-3 sm:px-4 py-2 rounded-lg w-full sm:w-auto text-center"
                              style={{ backgroundColor: "#1B9AAA" }}
                            >
                              <p className="text-white text-xs sm:text-sm font-semibold">
                                View Course
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : loadingState ? (
                  <Skeleton />
                ) : (
                  <div className="text-center py-16">
                    <h1
                      className="font-extrabold text-4xl"
                      style={{ color: "#142C52" }}
                    >
                      No Courses Found
                    </h1>
                    <p className="mt-4" style={{ color: "#1B9AAA" }}>
                      Try adjusting your filters
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
