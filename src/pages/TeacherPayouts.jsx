import React from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PayoutTerms from "@/components/teacher/PayoutTerms";

export default function TeacherPayouts() {
  const { user } = useAuth();
  if (!user || (user.role !== "admin" && user.teacher_status !== "approved")) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Link to="/teacher" className="text-muted-foreground hover:text-foreground p-1.5"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">Payouts</h1>
        </div>
        <PayoutTerms />
      </div>
    </div>
  );
}