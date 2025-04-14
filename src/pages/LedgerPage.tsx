
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LedgerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after a very short timeout to ensure component mounts properly
    const timer = setTimeout(() => {
      navigate("/ledger", { replace: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-lg font-medium">Redirecting to Ledger...</h2>
      </div>
    </div>
  );
};

export default LedgerPage;
