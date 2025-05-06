
import { useDialogStates } from "./hooks/useDialogStates";
import { useNewEntityStates } from "./hooks/useNewEntityStates";
import { useSimilarPartyCheck } from "./hooks/useSimilarPartyCheck";
import { useEntityManagement } from "./hooks/useEntityManagement";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "./PurchaseFormSchema";

interface UsePartyManagementProps {
  form: UseFormReturn<PurchaseFormData>;
  loadData: () => void;
}

export const usePartyManagement = ({ form, loadData }: UsePartyManagementProps) => {
  const dialogStates = useDialogStates();
  const entityStates = useNewEntityStates();
  const similarPartyStates = useSimilarPartyCheck();
  const entityManagement = useEntityManagement({
    loadData,
    form,
    ...dialogStates,
    ...entityStates
  });

  const useSuggestedParty = () => {
    if (similarPartyStates.similarParty && similarPartyStates.similarParty.name) {
      form.setValue("party", similarPartyStates.similarParty.name);
    }
    dialogStates.setShowSimilarPartyDialog(false);
    similarPartyStates.resetSimilarPartyState();
  };

  return {
    ...dialogStates,
    ...entityStates,
    ...similarPartyStates,
    ...entityManagement,
    useSuggestedParty
  };
};
