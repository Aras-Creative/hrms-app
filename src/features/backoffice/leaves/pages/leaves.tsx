import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackofficeHeader } from "../../shared/components/header";
import DashboardLayouts from "@/layouts/DashboardLayouts";

const LeaveTransactionPage = () => {
  return (
    <DashboardLayouts>
      <div className="flex w-full flex-col gap-6">
        <BackofficeHeader title="Daftar Pengajuan Cuti" description="Semua pengajuan cuti yang sedang menunggu persetujuan atau sudah disetujui" />

        <Tabs defaultValue="leave-requests">
          <TabsList>
            <TabsTrigger value="leave-requests">Daftar Pengajuan Cuti</TabsTrigger>
            <TabsTrigger value="leave-type">Jenis Cuti</TabsTrigger>
            <TabsTrigger value="leave-quotas">Kuota Cuti</TabsTrigger>
          </TabsList>

          <TabsContent value="leave-requests">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pengajuan Cuti</CardTitle>
                <CardDescription>Semua pengajuan cuti yang sedang menunggu persetujuan atau sudah disetujui.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Konten daftar pengajuan cuti akan ditampilkan di sini...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave-type">
            <Card>
              <CardHeader>
                <CardTitle>Jenis Cuti</CardTitle>
                <CardDescription>Macam-macam jenis cuti yang tersedia.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Konten jenis cuti akan ditampilkan di sini...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave-quotas">
            <Card>
              <CardHeader>
                <CardTitle>Kuota Cuti</CardTitle>
                <CardDescription>Sisa kuota cuti yang tersedia.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Konten kuota cuti akan ditampilkan di sini...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayouts>
  );
};

export default LeaveTransactionPage;
