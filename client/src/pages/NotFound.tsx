
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-brisk-600">404</h1>
        <p className="text-xl text-neutral-800 mb-6">
          Oops! We couldn't find the page you were looking for.
        </p>
        <p className="text-neutral-600 mb-8">
          The page might have been moved, deleted, or might never have existed.
        </p>
        <Link to="/">
          <Button className="gap-2">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
