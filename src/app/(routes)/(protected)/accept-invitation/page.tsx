"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAcceptInvitation } from "@/hooks";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "accepting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const acceptInvitation = useAcceptInvitation();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid invitation link. No token provided.");
      return;
    }

    // Auto-accept the invitation when the page loads
    const handleAccept = async () => {
      setStatus("accepting");
      try {
        await acceptInvitation.mutateAsync({ token });
        setStatus("success");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to accept invitation. The link may have expired or is invalid.",
        );
      }
    };

    handleAccept();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {status === "accepting" && (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            )}
            {status === "error" && <XCircle className="h-8 w-8 text-red-600" />}
            {status === "idle" && <Mail className="h-8 w-8 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "accepting" && "Accepting Invitation..."}
            {status === "success" && "Invitation Accepted!"}
            {status === "error" && "Invitation Failed"}
            {status === "idle" && "Processing Invitation"}
          </CardTitle>
          <CardDescription className="text-base">
            {status === "accepting" &&
              "Please wait while we process your invitation."}
            {status === "success" &&
              "You are now a collaborator on this project. Redirecting to dashboard..."}
            {status === "error" && errorMessage}
            {status === "idle" && "Validating your invitation..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "accepting" && (
            <div className="space-y-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full animate-pulse rounded-full bg-primary"
                  style={{ width: "60%" }}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Setting up your collaboration access...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Welcome to the team! 🎉
                </p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                  You now have access to collaborate on this project.
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Common reasons for this error:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-red-700 dark:text-red-300">
                  <li>• The invitation link has expired</li>
                  <li>• The invitation has already been accepted</li>
                  <li>• You are already a collaborator on this project</li>
                  <li>• The invitation was revoked by the project owner</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/help")}
                  variant="default"
                  className="flex-1"
                >
                  Get Help
                </Button>
              </div>
            </div>
          )}

          {status === "idle" && !token && (
            <div className="space-y-4">
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  No invitation token found in the URL.
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full"
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          <CardDescription className="text-base">
            Processing your invitation...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AcceptInvitationContent />
    </Suspense>
  );
}
