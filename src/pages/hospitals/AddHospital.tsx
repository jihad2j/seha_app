
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { hospitalAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "lucide-react";

const AddHospital = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hospital form state
  const [hospitalData, setHospitalData] = useState({
    input_central_type: "GSL",
    input_central_name_ar: "",
    input_central_name_en: "",
    input_central_id: "",
    input_central_logo: "",
    input_central_location: "",
    input_central_doctor_num: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHospitalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setHospitalData(prev => ({ ...prev, input_central_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await hospitalAPI.create(hospitalData);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة بيانات المستشفى بنجاح",
      });
      
      navigate("/hospitals");
    } catch (error) {
      console.error("Error adding hospital:", error);
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
            <Building className="mr-2 h-5 w-5" />
            إضافة مستشفى جديد
          </CardTitle>
          <CardDescription>أدخل بيانات المستشفى لإضافته إلى النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نوع المستشفى */}
              <div className="input-group">
                <Label htmlFor="Hospital_Type_Gsl">نوع المستشفى</Label>
                <Select
                  value={hospitalData.input_central_type}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المستشفى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GSL">حكومي</SelectItem>
                    <SelectItem value="PSL">أهلي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* اسم المستشفى عربي */}
              <div className="input-group">
                <Label htmlFor="input_central_name_ar">اسم المستشفى عربي</Label>
                <Input
                  id="input_central_name_ar"
                  name="input_central_name_ar"
                  value={hospitalData.input_central_name_ar}
                  onChange={handleChange}
                  placeholder="اسم المستشفى بالعربية"
                  required
                />
              </div>

              {/* اسم المستشفى انجليزي */}
              <div className="input-group">
                <Label htmlFor="input_central_name_en">اسم المستشفى انجليزي</Label>
                <Input
                  id="input_central_name_en"
                  name="input_central_name_en"
                  value={hospitalData.input_central_name_en}
                  onChange={handleChange}
                  placeholder="Hospital Name in English"
                  required
                />
              </div>

              {/* رقم الترخيص */}
              <div className="input-group">
                <Label htmlFor="input_central_id">رقم الترخيص</Label>
                <Input
                  id="input_central_id"
                  name="input_central_id"
                  value={hospitalData.input_central_id}
                  onChange={handleChange}
                  placeholder="رقم ترخيص المستشفى"
                  required
                />
              </div>

              {/* شعار المستشفى */}
              <div className="input-group">
                <Label htmlFor="input_central_logo">شعار المستشفى</Label>
                <Input
                  id="input_central_logo"
                  name="input_central_logo"
                  value={hospitalData.input_central_logo}
                  onChange={handleChange}
                  placeholder="Base64 type code"
                />
              </div>

              {/* موقع المستشفى */}
              <div className="input-group">
                <Label htmlFor="input_central_location">موقع المستشفى</Label>
                <Input
                  id="input_central_location"
                  name="input_central_location"
                  value={hospitalData.input_central_location}
                  onChange={handleChange}
                  placeholder="الموقع"
                  required
                />
              </div>

              {/* كود المستشفى */}
              <div className="input-group">
                <Label htmlFor="input_central_doctor_num">كود المستشفى</Label>
                <Input
                  id="input_central_doctor_num"
                  name="input_central_doctor_num"
                  value={hospitalData.input_central_doctor_num}
                  onChange={handleChange}
                  placeholder="كود المستشفى"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">إضافة المستشفى</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddHospital;
