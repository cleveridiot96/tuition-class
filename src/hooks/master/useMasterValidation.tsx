
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

export const useMasterValidation = () => {
  const [nameError, setNameError] = useState("");

  const commonSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  const validateMaster = (name: string) => {
    try {
      commonSchema.parse({ name });
      setNameError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0].message);
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  return {
    nameError,
    setNameError,
    validateMaster,
  };
};
