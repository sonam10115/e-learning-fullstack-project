import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {
  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border border-[#E0E7F1] focus:border-[#16808D] focus:ring-2 focus:ring-[#1B9AAA] focus:ring-opacity-20 rounded-md px-3 py-2 transition-all duration-300"
          />
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full border border-[#E0E7F1] focus:border-[#16808D] focus:ring-2 focus:ring-[#1B9AAA] focus:ring-opacity-20 rounded-md">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border border-[#E0E7F1] focus:border-[#16808D] focus:ring-2 focus:ring-[#1B9AAA] focus:ring-opacity-20 rounded-md px-3 py-2 transition-all duration-300"
          />
        );
        break;
      case "radio":
        element = (
          <div className="flex gap-6">
            {getControlItem.options && getControlItem.options.length > 0
              ? getControlItem.options.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`${getControlItem.name}-${option.id}`}
                      name={getControlItem.name}
                      value={option.id}
                      checked={currentControlItemValue === option.id}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [getControlItem.name]: event.target.value,
                        })
                      }
                      className="w-4 h-4 accent-[#1B9AAA] cursor-pointer"
                    />
                    <Label
                      htmlFor={`${getControlItem.name}-${option.id}`}
                      className="text-[#142C52] font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))
              : null}
          </div>
        );
        break;

      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border border-[#E0E7F1] focus:border-[#16808D] focus:ring-2 focus:ring-[#1B9AAA] focus:ring-opacity-20 rounded-md px-3 py-2 transition-all duration-300"
          />
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label
            htmlFor={controleItem.name}
            className="text-[#142C52] font-medium mb-2"
          >
            {controleItem.label}
          </Label>
          {renderComponentByType(controleItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
