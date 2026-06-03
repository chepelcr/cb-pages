import { Switch, Route, Redirect } from "wouter";
import AdminLayout from "@/admin/components/AdminLayout";
import DashboardPage from "@/admin/pages/DashboardPage";
import IdentityPage from "@/admin/pages/IdentityPage";
import SeoPage from "@/admin/pages/SeoPage";
import NavigationPage from "@/admin/pages/NavigationPage";
import HeroPage from "@/admin/pages/HeroPage";
import ContactAdminPage from "@/admin/pages/ContactPage";
import FooterAdminPage from "@/admin/pages/FooterPage";
import HistoryCopyPage from "@/admin/pages/HistoryPage";
import MilestonesPage from "@/admin/pages/MilestonesPage";
import HistoricalImagesPage from "@/admin/pages/HistoricalImagesPage";
import LeadershipAdminPage from "@/admin/pages/LeadershipPage";
import ShieldsAdminPage from "@/admin/pages/ShieldsPage";
import ShieldValuesPage from "@/admin/pages/ShieldValuesPage";
import GalleryAdminPage from "@/admin/pages/GalleryPage";
import MediaPage from "@/admin/pages/MediaPage";
import TranslationsPage from "@/admin/pages/TranslationsPage";
import InventoryPage from "@/admin/pages/InventoryPage";
import ContentVersionsPage from "@/admin/pages/ContentVersionsPage";
import DiagnosticsPage from "@/admin/pages/DiagnosticsPage";
import ContentExplorerPage from "@/admin/pages/ContentExplorerPage";

export default function AdminApp() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={DashboardPage} />
        <Route path="/admin/identity" component={IdentityPage} />
        <Route path="/admin/seo" component={SeoPage} />
        <Route path="/admin/navigation" component={NavigationPage} />
        <Route path="/admin/hero" component={HeroPage} />
        <Route path="/admin/contact" component={ContactAdminPage} />
        <Route path="/admin/footer" component={FooterAdminPage} />
        <Route path="/admin/history" component={HistoryCopyPage} />
        <Route path="/admin/milestones" component={MilestonesPage} />
        <Route path="/admin/historical-images" component={HistoricalImagesPage} />
        <Route path="/admin/leadership" component={LeadershipAdminPage} />
        <Route path="/admin/shields" component={ShieldsAdminPage} />
        <Route path="/admin/shield-values" component={ShieldValuesPage} />
        <Route path="/admin/gallery" component={GalleryAdminPage} />
        <Route path="/admin/media" component={MediaPage} />
        <Route path="/admin/translations" component={TranslationsPage} />
        <Route path="/admin/inventory" component={InventoryPage} />
        <Route path="/admin/versions" component={ContentVersionsPage} />
        <Route path="/admin/diagnostics" component={DiagnosticsPage} />
        <Route path="/admin/explorer" component={ContentExplorerPage} />
        {/* Legacy redirects */}
        <Route path="/admin/themes"><Redirect to="/admin/identity" /></Route>
        <Route path="/admin/branding"><Redirect to="/admin/identity" /></Route>
        <Route><Redirect to="/admin" /></Route>
      </Switch>
    </AdminLayout>
  );
}
