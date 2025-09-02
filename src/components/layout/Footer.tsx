import Button from "@/components/ui/Button";

export default function Footer() {
  return (
    <div className="max-w-full flex items-center justify-between border-t border-[#f4f0e6] px-8 py-4">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex space-x-100">
          <Button variant="secondary">Contact Us</Button>
          <Button variant="secondary">Privacy Policy</Button>
          <Button variant="secondary">Team of Service</Button>
        </div>
        <div className="flex justify-center text-center">
          <p className="text-[#8c805f] text-base font-normal leading-normal">
            © 2025 Beauty Booking. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
