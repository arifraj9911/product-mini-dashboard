import TableContentNew from "@/components/tables/test/test-table";
import Image from "next/image";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="">
      <TableContentNew/>

      <Toaster />
    </div>
  );
}
