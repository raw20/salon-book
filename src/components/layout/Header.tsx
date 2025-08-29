import Button from "@/components/ui/Button";
import { ScissorsLineDashed } from "lucide-react";

export default function Header() {
  return (
    <div className="max-w-full flex items-center justify-between border-b border-[#f4f0e6] px-8 py-4">
      <div className="flex items-center justify-center space-x-4">
        <ScissorsLineDashed className="size-10" />
        <h2 className="font-bold">Salon Booking</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="secondary">서비스</Button>
        <Button variant="secondary">스타일리스트</Button>
        <Button variant="tertiary">로그인</Button>
      </div>
    </div>
  );
}
