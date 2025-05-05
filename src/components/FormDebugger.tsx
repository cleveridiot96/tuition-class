
import React from "react";

interface FormDebuggerProps {
  form: any;
  show?: boolean;
}

/**
 * A component to debug form values and errors
 * Only renders in development mode when show is true
 */
const FormDebugger: React.FC<FormDebuggerProps> = ({ form, show = false }) => {
  if (!show || process.env.NODE_ENV === "production") return null;

  const formValues = form.getValues ? form.getValues() : {};
  const formErrors = form.formState?.errors || {};
  const dirtyFields = form.formState?.dirtyFields || {};
  
  return (
    <div className="bg-gray-100 p-4 rounded-md mt-4 border border-gray-300">
      <h3 className="text-lg font-medium mb-2">Form Debug Info</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-1">Form Values:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">Form Errors:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-60 text-red-500">
            {JSON.stringify(formErrors, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-2">
        <h4 className="font-medium mb-1">Dirty Fields:</h4>
        <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(dirtyFields, null, 2)}
        </pre>
      </div>
      
      <div className="mt-2">
        <h4 className="font-medium mb-1">Form State:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div><span className="font-medium">Is Valid:</span> {form.formState?.isValid ? "✅" : "❌"}</div>
          <div><span className="font-medium">Is Submitted:</span> {form.formState?.isSubmitted ? "✅" : "❌"}</div>
          <div><span className="font-medium">Is Submitting:</span> {form.formState?.isSubmitting ? "✅" : "❌"}</div>
          <div><span className="font-medium">Is Dirty:</span> {form.formState?.isDirty ? "✅" : "❌"}</div>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => console.log('Form state:', { 
          values: formValues, 
          errors: formErrors, 
          state: form.formState 
        })}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Log to Console
      </button>
    </div>
  );
};

export default FormDebugger;
