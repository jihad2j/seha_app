
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DownloadProgressProps {
  open: boolean;
  progress: number;
  fileName: string;
  fileUrl: string | null;
  onClose: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  open,
  progress,
  fileName,
  fileUrl,
  onClose
}) => {
  const isCompleted = progress === 100 && fileUrl;
  
  const handleShare = async () => {
    if (!fileUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: fileName,
          url: fileUrl
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(fileUrl);
        alert("تم نسخ رابط الملف إلى الحافظة");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };
  
  const handleOpenFile = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="w-5 h-5 ml-2" />
              {isCompleted ? "تم تحميل الملف" : "جاري تحميل الملف"}
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center mb-2">
            <p>{fileName || "sickleaves.pdf"}</p>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <p className="text-center text-sm">
            {isCompleted 
              ? "اكتمل التحميل بنجاح" 
              : `جاري التحميل... ${progress}%`}
          </p>
          
          {isCompleted && (
            <div className="flex justify-center gap-3 mt-4">
              <Button onClick={handleOpenFile}>
                <FileText className="ml-2 h-4 w-4" />
                فتح الملف
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="ml-2 h-4 w-4" />
                مشاركة
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadProgress;
