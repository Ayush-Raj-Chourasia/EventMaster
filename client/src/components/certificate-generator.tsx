import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Award } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Event } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

interface CertificateGeneratorProps {
  event: Event;
}

export default function CertificateGenerator({ event }: CertificateGeneratorProps) {
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      // Capture the certificate template as canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true
      });

      // Convert to PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });

      // Add the canvas as image
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Download the PDF
      pdf.save(`${event.title}-certificate.pdf`);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
    setIsGenerating(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Certificate Preview */}
      <div ref={certificateRef} className="relative w-full aspect-[1.414] bg-white p-8 shadow-sm">
        <div className="absolute inset-0 border-[16px] border-primary/10 pointer-events-none" />
        
        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
          {/* Certificate Header */}
          <div className="space-y-2">
            <Award className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-3xl font-bold text-primary tracking-wide uppercase">
              Certificate of Achievement
            </h1>
          </div>

          {/* Certificate Content */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground">
              This is to certify that
            </p>
            <p className="text-2xl font-semibold">
              {user.name}
            </p>
            <p className="text-lg text-muted-foreground">
              has successfully participated in
            </p>
            <p className="text-2xl font-semibold text-primary">
              {event.title}
            </p>
            <p className="text-base text-muted-foreground">
              held from {new Date(event.startDate).toLocaleDateString()} to{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Certificate Footer */}
          <div className="mt-auto pt-8 flex items-end justify-between w-full">
            <div className="text-left">
              <div className="w-40 h-px bg-border mb-2" />
              <p className="text-sm text-muted-foreground">Date</p>
            </div>
            <div className="text-right">
              <div className="w-40 h-px bg-border mb-2" />
              <p className="text-sm text-muted-foreground">Event Organizer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Card className="p-4 flex items-center justify-between bg-primary/5">
        <div>
          <h3 className="font-semibold">Certificate Ready</h3>
          <p className="text-sm text-muted-foreground">
            Download your personalized certificate for {event.title}
          </p>
        </div>
        <Button
          onClick={generateCertificate}
          disabled={isGenerating}
          className="ml-4"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Download Certificate"}
        </Button>
      </Card>
    </div>
  );
}
