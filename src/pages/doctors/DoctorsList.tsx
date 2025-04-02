
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { doctorAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Loader2, UserPlus } from "lucide-react";
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

const DoctorsList = () => {
  const { toast } = useToast();
  
  const { data: doctors = [], isLoading, refetch } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorAPI.getAll,
  });

  // Handle doctor deletion
  const handleDelete = async (doctorId: string) => {
    if (confirm("هل تريد حذف بيانات الطبيب؟")) {
      try {
        await doctorAPI.delete(doctorId);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف بيانات الطبيب بنجاح",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting doctor:", error);
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
          <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            قائمة الأطباء
          </CardTitle>
          <Link to="/doctors/add">
            <Button className="btn-medical">إضافة طبيب</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-right">#</TableHead>
                  <TableHead className="text-right">الاسم (عربي)</TableHead>
                  <TableHead className="text-right">الاسم (إنجليزي)</TableHead>
                  <TableHead className="text-right">التخصص (عربي)</TableHead>
                  <TableHead className="text-right">التخصص (إنجليزي)</TableHead>
                  <TableHead className="text-right">كود المستشفى</TableHead>
                  <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor, index) => (
                  <TableRow key={doctor._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{doctor.input_doctor_name_ar}</TableCell>
                    <TableCell>{doctor.input_doctor_name_En}</TableCell>
                    <TableCell>{doctor.input_doctor_type_ar}</TableCell>
                    <TableCell>{doctor.input_doctor_type_En}</TableCell>
                    <TableCell>{doctor.input_doctor_num}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Link to={`/doctors/edit/${doctor._id}`}>
                          <Button className="btn-edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          className="btn-delete"
                          onClick={() => handleDelete(doctor._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DoctorsList;
