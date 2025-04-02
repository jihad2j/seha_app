
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const AddDoctor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Doctor form state
  const [doctorData, setDoctorData] = useState({
    input_doctor_name_ar: "",
    input_doctor_name_En: "",
    input_doctor_type_ar: "",
    input_doctor_type_En: "",
    input_doctor_num: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await doctorAPI.create(doctorData);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة بيانات الطبيب بنجاح",
      });
      
      navigate("/doctors");
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "حدث خطأ",
        description: "لم يتم إضافة البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            إضافة طبيب جديد
          </CardTitle>
          <CardDescription>أدخل بيانات الطبيب لإضافته إلى النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* اسم الطبيب عربي */}
              <div className="input-group">
                <Label htmlFor="input_doctor_name_ar">اسم الطبيب عربي</Label>
                <Input
                  id="input_doctor_name_ar"
                  name="input_doctor_name_ar"
                  value={doctorData.input_doctor_name_ar}
                  onChange={handleChange}
                  placeholder="اسم الطبيب بالعربية"
                  required
                />
              </div>

              {/* اسم الطبيب انجليزي */}
              <div className="input-group">
                <Label htmlFor="input_doctor_name_En">اسم الطبيب انجليزي</Label>
                <Input
                  id="input_doctor_name_En"
                  name="input_doctor_name_En"
                  value={doctorData.input_doctor_name_En}
                  onChange={handleChange}
                  placeholder="Doctor Name in English"
                  required
                />
              </div>

              {/* تخصص الطبيب عربي */}
              <div className="input-group">
                <Label htmlFor="input_doctor_type_ar">تخصص الطبيب عربي</Label>
                <Input
                  id="input_doctor_type_ar"
                  name="input_doctor_type_ar"
                  value={doctorData.input_doctor_type_ar}
                  onChange={handleChange}
                  placeholder="تخصص الطبيب بالعربية"
                  required
                />
              </div>

              {/* تخصص الطبيب انجليزي */}
              <div className="input-group">
                <Label htmlFor="input_doctor_type_En">تخصص الطبيب انجليزي</Label>
                <Input
                  id="input_doctor_type_En"
                  name="input_doctor_type_En"
                  value={doctorData.input_doctor_type_En}
                  onChange={handleChange}
                  placeholder="Doctor specialization in English"
                  required
                />
              </div>

              {/* كود المستشفى */}
              <div className="input-group">
                <Label htmlFor="input_doctor_num">كود المستشفى</Label>
                <Input
                  id="input_doctor_num"
                  name="input_doctor_num"
                  value={doctorData.input_doctor_num}
                  onChange={handleChange}
                  placeholder="كود المستشفى"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">إضافة الطبيب</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddDoctor;
