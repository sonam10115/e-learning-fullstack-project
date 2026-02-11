import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  generateCertificateService,
  downloadCertificateService,
} from "@/services";
import { Download, Award, Loader2, CheckCircle } from "lucide-react";

const CertificateModal = ({
  courseId,
  courseName,
  studentName,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateCertificate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await generateCertificateService(courseId);

      if (response?.success) {
        setCertificateData(response);
      } else {
        setError(response?.message || "Failed to generate certificate");
      }
    } catch (err) {
      console.error("Certificate generation error:", err);
      setError(err?.response?.data?.message || "Error generating certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      if (!certificateData?.certificateName) return;

      setLoading(true);
      const blob = await downloadCertificateService(
        certificateData.certificateName,
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = certificateData.certificateName || "certificate.pdf";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download certificate");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setCertificateData(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Award className="text-yellow-500" size={28} />
            Certificate of Completion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!certificateData ? (
            // Before generation
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🎓 Ready to earn your certificate?
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  Click the button below to generate your certificate of
                  completion for:
                </p>
                <div className="bg-white rounded p-4 border-l-4 border-blue-500">
                  <p className="font-bold text-gray-800">{courseName}</p>
                  <p className="text-sm text-gray-600">
                    Completed by {studentName}
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateCertificate}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Generate Certificate
                    </>
                  )}
                </Button>
                <Button onClick={resetModal} variant="outline">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            // After generation
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle
                  className="mx-auto mb-3 text-green-600"
                  size={40}
                />
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Congratulations!
                </h3>
                <p className="text-green-800 text-sm mb-4">
                  Your certificate has been generated successfully!
                </p>
                <p className="text-sm text-green-700 bg-green-100 p-2 rounded">
                  📄 {certificateData.certificateName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  Your certificate is ready to download. This PDF includes:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>✓ Your name and course title</li>
                  <li>✓ Completion date</li>
                  <li>✓ Official certificate seal</li>
                  <li>✓ Professional formatting</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadCertificate}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate (PDF)
                    </>
                  )}
                </Button>
                <Button onClick={resetModal} variant="outline">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
