"use client";

import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

const invoices = [
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
  { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
  { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV007", paymentStatus: "Unpaid", totalAmount: "$300.00", paymentMethod: "Credit Card" },
];

export default function DashboardHome() {
  const token = getToken();
  let username = "Guest";

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.username) username = decoded.username;
    } catch (e) {
      console.error("Token decoding failed:", e);
    }
  }

  return (
    <div className="max-h-screen w-full bg-black text-white overflow-x-hidden overflow-y-auto p-6">
      {/* Username */}
      <h2 className="text-3xl font-bold mb-6">Welcome! {username}</h2>

      {/* TOKEN LABEL */}
      <p className="text-sm mb-3">Your Bearer Token:</p>

      {/* TOKEN INLINE TEXT */}
      <p className="text-[13px] break-all leading-relaxed">{token}</p>

      {/* WHITE DASHED LINE */}
      <div className="border-b border-dashed border-white my-6"></div>

      {/* INVOICES TABLE */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.invoice}>
              <TableCell className="font-medium">{inv.invoice}</TableCell>
              <TableCell>{inv.paymentStatus}</TableCell>
              <TableCell>{inv.paymentMethod}</TableCell>
              <TableCell className="text-right">{inv.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
