import { useEffect } from "react";
import { useToast } from "@/lib/hooks/ui/use-toast";

const ErrorHandler = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      // Get the fragment identifier (everything after #)
      const hash = window.location.hash;

      if (hash) {
        // Remove the # and parse the parameters
        const params = new URLSearchParams(hash.substring(1));
        const error = params.get("error");
        const errorDescription = params.get("error_description");

        if (error) {
          toast({
            variant: "destructive",
            title: "Error: " + error,
            description:
              errorDescription?.replace(/\+/g, " ") || "An error occurred",
          });

          // Optional: Clear the hash after showing the toast
          history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  }, [toast]);

  return null; // This component doesn't render anything
};

export default ErrorHandler;
