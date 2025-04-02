
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { patientAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FilePen, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportType } from "@/types/models";
import DownloadProgress from "@/components/DownloadProgress";

interface PatientsListProps {
  limit?: number;
}

const reportTypes: ReportType[] = [
  { id: "medical", name: "تقرير طبي", route: "medical", color: "bg-report" },
  { id: "sick", name: "تقرير جديد", route: "model_sikleaves_n/sickleavecreate", color: "bg-[#1c5a40]" },
  { id: "leave", name: "تقرير إجازة", route: "sick", color: "bg-[#0ab7cd]" },
  { id: "visit", name: "مشهد مراجعة", route: "model_sikleaves_visit/sickleavecreate", color: "bg-report-visit" },
  { id: "companion", name: "تقرير مرافق", route: "model_sikleaves_comp/sickleavecreate", color: "bg-report-companion" },
  { id: "companion_visit", name: "مشهد مرافق", route: "model_sikleaves_comp_visit/sickleavecreate", color: "bg-[#5426bC]" },
];

const PatientsList: React.FC<PatientsListProps> = ({ limit }) => {
  const { toast } = useToast();
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    progress: 0,
    fileUrl: null as string | null,
    fileName: "",
    reportType: ""
  });
  
  // Fetch patients data
  const { data: patients = [], isLoading: isLoadingPatients, refetch } = useQuery({
    queryKey: ["patients", limit],
    queryFn: () => limit ? patientAPI.getRecent(limit) : patientAPI.getAll(),
  });

  // Handle generating reports with progress
  const handleGenerateReport = async (patientId: string, reportType: string, reportName: string) => {
    try {
      setDownloadState({
        isDownloading: true,
        progress: 0,
        fileUrl: null,
        fileName: "sickleaves.pdf",
        reportType
      });

      const result = await patientAPI.generateReport(
        patientId, 
        reportType,
        (progress) => {
          setDownloadState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      if (result) {
        setDownloadState(prev => ({
          ...prev,
          progress: 100,
          fileUrl: result.url,
          fileName: result.filename
        }));
      }
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      toast({
        title: "خطأ في إنشاء التقرير",
        description: "لم يتم إنشاء التقرير بنجاح، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setDownloadState(prev => ({
        ...prev,
        isDownloading: false
      }));
    }
  };

  const closeDownloadDialog = () => {
    if (downloadState.fileUrl) {
      URL.revokeObjectURL(downloadState.fileUrl);
    }
    setDownloadState({
      isDownloading: false,
      progress: 0,
      fileUrl: null,
      fileName: "",
      reportType: ""
    });
  };

  // Handle patient deletion
  const handleDelete = async (patientId: string) => {
    if (confirm("هل تريد حذف بيانات المريض؟")) {
      try {
        await patientAPI.delete(patientId);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف بيانات المريض بنجاح",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast({
          title: "خطأ في الحذف",
          description: "لم يتم حذف البيانات، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoadingPatients) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical" />
          <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {limit ? `آخر ${limit} ملف` : "قائمة المرضى"}
          </CardTitle>
          <Link to="/patients/add">
            <Button className="btn-medical">إضافة مريض</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-right">#</TableHead>
                  <TableHead className="text-right">رقم الملف</TableHead>
                  <TableHead className="text-right">الهوية</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">من تاريخ</TableHead>
                  <TableHead className="text-right">إلى تاريخ</TableHead>
                  <TableHead className="text-right">المدة</TableHead>
                  <TableHead className="text-right">الجنسية</TableHead>
                  <TableHead className="text-right">نوع الزيارة</TableHead>
                  <TableHead className="text-right">الاجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient, index) => (
                  <TableRow key={patient._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{patient.inputgsl}</TableCell>
                    <TableCell>{patient.inputidentity}</TableCell>
                    <TableCell>{patient.inputnamear}</TableCell>
                    <TableCell>{patient.inputdatefrom}</TableCell>
                    <TableCell>{patient.inputdateto}</TableCell>
                    <TableCell>{patient.inputdaynum} يوم</TableCell>
                    <TableCell>{patient.inputnationalityar || "-"}</TableCell>
                    <TableCell>{patient.inputTypeVisitAr || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {reportTypes.map((report) => (
                            <Button 
                              key={report.id}
                              className={`${report.color} text-xs p-1 h-auto`}
                              onClick={() => handleGenerateReport(patient._id, report.route, report.name)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {report.name}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex gap-1">
                          <Link to={`/patients/edit/${patient._id}`}>
                            <Button className="btn-edit text-xs p-1 h-auto">
                              <FilePen className="h-3 w-3 mr-1" />
                              تعديل
                            </Button>
                          </Link>
                          
                          <Button 
                            className="btn-delete text-xs p-1 h-auto"
                            onClick={() => handleDelete(patient._id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Download Progress Dialog */}
      <DownloadProgress
        open={downloadState.isDownloading}
        progress={downloadState.progress}
        fileName={downloadState.fileName}
        fileUrl={downloadState.fileUrl}
        onClose={closeDownloadDialog}
      />
    </Layout>
  );
};

export default PatientsList;
