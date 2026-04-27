import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout";

import Overview from "@/pages/overview";
import Predictions from "@/pages/predictions";
import Tracking from "@/pages/tracking";
import Assets from "@/pages/assets";
import Scanner from "@/pages/scanner";
import AppList from "@/pages/apps";
import Enforcement from "@/pages/enforcement";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/scan" component={Scanner} />
        <Route path="/apps" component={AppList} />
        <Route path="/predictions" component={Predictions} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/assets" component={Assets} />
        <Route path="/enforcement" component={Enforcement} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster theme="dark" position="bottom-right" />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
