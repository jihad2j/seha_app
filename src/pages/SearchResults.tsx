
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { patientAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { Patient, ReportType } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, FilePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DownloadProgress from "@/components/DownloadProgress";

const reportTypes: ReportType[] = [
  { id: "medical", name: "تقرير طبي", route: "medical", color: "bg-report" },
  { id: "sick", name: "تقرير جديد", route: "sick_n", color: "bg-[#1c5a40]" },
  { id: "leave", name: "تقرير إجازة", route: "sick", color: "bg-[#0ab7cd]" },
  { id: "visit", name: "مشهد مراجعة", route: "visit", color: "bg-report-visit" },
  { id: "companion", name: "تقرير مرافق", route: "companion", color: "bg-report-companion" },
  { id: "companion_visit", name: "مشهد مرافق", route: "companion_visit", color: "bg-[#5426bC]" },
];

const SearchResults = () => {
  const { query } = useParams<{ query: string }>();
  const { toast } = useToast();
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    progress: 0,
    fileUrl: null as string | null,
    fileName: "",
    reportType: ""
  });
  
  const { data: searchResults = [], isLoading, error, refetch } = useQuery({
    queryKey: ["search", query],
    queryFn: () => patientAPI.search(query || ""),
    enabled: !!query,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query, refetch]);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical" />
          <p className="mt-4 text-lg">جاري البحث...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            <span>نتائج البحث: {query}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchResults.length === 0 ? (
            <p className="text-center py-8 text-gray-500">لم يتم العثور على نتائج</p>
          ) : (
            <p className="mb-4">تم العثور على {searchResults.length} نتيجة</p>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardContent className="pt-6">
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
                  {searchResults.map((patient, index) => (
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
      )}

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

export default SearchResults;
