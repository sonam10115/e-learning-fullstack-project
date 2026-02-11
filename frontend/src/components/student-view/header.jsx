import { Icon, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="flex items-center justify-between p-2 sm:p-4 md:p-4 border-b relative">
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        <Link to="/home">
          <img src="../../civoraX.png" className="h-6 sm:h-7 md:h-8" />
        </Link>
        <div className="hidden sm:flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className="text-xs sm:text-sm md:text-[16px] font-medium"
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-1 sm:gap-2 md:gap-3"
          >
            <span className="hidden sm:inline font-extrabold text-xs sm:text-base md:text-xl">
              My Courses
            </span>
            <TvMinimalPlay className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 cursor-pointer" />
          </div>
          <Button
            onClick={handleLogout}
            className="text-xs sm:text-sm md:text-base"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
