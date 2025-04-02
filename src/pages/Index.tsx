
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Hospital, UserPlus, Users, Flag, FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">نظام بيانات صحتي</h1>
        <p className="text-xl text-gray-600">إدارة بيانات المرضى والمستشفيات والأطباء</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>المرضى</span>
            </CardTitle>
            <CardDescription>إدارة بيانات المرضى</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Link to="/patients/add">
                <Button className="w-full">إضافة مريض جديد</Button>
              </Link>
              <Link to="/patients/recent">
                <Button variant="outline" className="w-full">عرض آخر 20 ملف</Button>
              </Link>
              <Link to="/patients">
                <Button variant="outline" className="w-full">عرض آخر 100 ملف</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="h-5 w-5" />
              <span>المستشفيات</span>
            </CardTitle>
            <CardDescription>إدارة بيانات المستشفيات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Link to="/hospitals/add">
                <Button className="w-full">إضافة مستشفى جديد</Button>
              </Link>
              <Link to="/hospitals">
                <Button variant="outline" className="w-full">عرض المستشفيات</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>الأطباء</span>
            </CardTitle>
            <CardDescription>إدارة بيانات الأطباء</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Link to="/doctors/add">
                <Button className="w-full">إضافة طبيب جديد</Button>
              </Link>
              <Link to="/doctors">
                <Button variant="outline" className="w-full">عرض الأطباء</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              <span>الجنسيات</span>
            </CardTitle>
            <CardDescription>إدارة بيانات الجنسيات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Link to="/nationalities/add">
                <Button className="w-full">إضافة جنسية جديدة</Button>
              </Link>
              <Link to="/nationalities">
                <Button variant="outline" className="w-full">عرض الجنسيات</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>التقارير</span>
            </CardTitle>
            <CardDescription>إدارة التقارير الطبية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Link to="/patients">
                <Button variant="outline" className="w-full">إدارة التقارير</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>الإعدادات</span>
            </CardTitle>
            <CardDescription>إعدادات النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Link to="/settings">
                <Button variant="outline" className="w-full">عرض الإعدادات</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
