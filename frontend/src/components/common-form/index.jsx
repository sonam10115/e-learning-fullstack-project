import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button
        disabled={isButtonDisabled}
        type="submit"
        className="mt-5 w-full bg-[#16808D] hover:bg-[#142C52] text-white font-medium py-2 rounded-md transition-all duration-300 disabled:bg-[#B0D4D9] disabled:cursor-not-allowed"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
