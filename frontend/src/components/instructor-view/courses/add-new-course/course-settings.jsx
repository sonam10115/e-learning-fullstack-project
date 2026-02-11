import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage,
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Card className="border border-[#E0E7F1] shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-[#F4F7FA] to-white border-b border-[#E0E7F1]">
        <CardTitle className="text-[#142C52] font-bold">
          Course Settings
        </CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent className="pt-6">
        {courseLandingFormData?.image ? (
          <div className="relative">
            <img
              src={courseLandingFormData.image}
              className="rounded-lg border-2 border-[#16808D] shadow-md"
            />
            <p className="text-sm text-[#16808D] font-medium mt-3">
              Course image uploaded successfully
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-[#1B9AAA] rounded-lg bg-[#F4F7FA] hover:bg-[#E8F0F2] transition-colors duration-300">
            <Label className="text-[#142C52] font-semibold">
              Upload Course Image
            </Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="border border-[#E0E7F1] focus:border-[#16808D] focus:ring-2 focus:ring-[#1B9AAA] focus:ring-opacity-20 rounded-md cursor-pointer"
            />
            <p className="text-xs text-[#16808D]">
              Recommended: 1280x720px (16:9 aspect ratio)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
