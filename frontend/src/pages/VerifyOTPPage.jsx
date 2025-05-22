import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem("pendingEmail");

  const verifyOTP = useAuthStore((state) => state.verifyOTP);
  const resendOTP = useAuthStore((state) => state.resendOTP);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);
    const success = await verifyOTP({ email, otp });
    setLoading(false);
    if (success) {
      localStorage.removeItem("pendingEmail");
      navigate("/"); // Redirect to home or wherever you want after verification
    }
  };

  const handleResend = async () => {
    setLoading(true);
    await resendOTP(email);
    setLoading(false);
  };

  if (!email) {
    toast.error("No email found. Please sign up again.");
    navigate("/signup");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
        <p className="text-center text-base-content/60">
          Enter the OTP sent to <b>{email}</b>
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <button className="btn btn-link w-full" onClick={handleResend} disabled={loading}>
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
