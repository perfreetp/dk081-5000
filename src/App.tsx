import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Sell from "@/pages/Sell";
import Buy from "@/pages/Buy";
import Orders from "@/pages/Orders";
import Support from "@/pages/Support";
import FamilyView from "@/pages/FamilyView";
import ReceiptPackage from "@/pages/ReceiptPackage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/support" element={<Support />} />
          <Route path="/receipt-package" element={<ReceiptPackage />} />
        </Route>
        <Route path="/family-view" element={<FamilyView />} />
      </Routes>
    </Router>
  );
}
