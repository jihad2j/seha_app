
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات النظام بنجاح",
    });
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            إعدادات النظام
          </CardTitle>
          <CardDescription>يمكنك تعديل إعدادات النظام من هذه الصفحة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <Label htmlFor="api_url">رابط API</Label>
                <Input
                  id="api_url"
                  name="api_url"
                  defaultValue="/api"
                  placeholder="أدخل رابط الـ API"
                />
              </div>
              
              <div className="input-group">
                <Label htmlFor="report_path">مسار التقارير</Label>
                <Input
                  id="report_path"
                  name="report_path"
                  defaultValue="/reports"
                  placeholder="أدخل مسار حفظ التقارير"
                />
              </div>
              
              <div className="input-group">
                <Label htmlFor="system_name">اسم النظام</Label>
                <Input
                  id="system_name"
                  name="system_name"
                  defaultValue="نظام صحة V4.1"
                  placeholder="أدخل اسم النظام"
                />
              </div>
              
              <div className="input-group">
                <Label htmlFor="report_footer">نص تذييل التقارير</Label>
                <Input
                  id="report_footer"
                  name="report_footer"
                  defaultValue="جميع الحقوق محفوظة - نظام صحة"
                  placeholder="أدخل نص تذييل التقارير"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">
                <Save className="mr-2 h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;
