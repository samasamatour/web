
import { Button, ButtonProps } from "@/components/ui/button";
import { WhatsappIcon } from "./Icons";
import { cn } from "@/lib/utils";

interface WhatsAppProps extends ButtonProps {
  phoneNumber: string;
  message?: string;
  children: React.ReactNode;
}

export const WhatsApp = ({
  phoneNumber,
  message = "",
  className,
  children,
  ...props
}: WhatsAppProps) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}${message ? `?text=${message}` : ""}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      className={cn("bg-[#25D366] hover:bg-[#22c55e] flex items-center", className)}
      onClick={handleClick}
      {...props}
    >
      <WhatsappIcon className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
};

export const FloatingWhatsAppButton = ({ phoneNumber }: { phoneNumber: string }) => {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#22c55e] transition-all rounded-full p-4 shadow-lg animate-float group"
      aria-label="Chat on WhatsApp"
    >
      <WhatsappIcon className="w-6 h-6 text-white" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-medium">
        Chat with us
      </span>
    </a>
  );
};
