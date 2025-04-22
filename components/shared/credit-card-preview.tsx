import { cn } from "@/lib/utils"

const brandLogos: Record<string, string> = {
    visa: "https://img.icons8.com/color/48/visa.png",
    mastercard: "https://img.icons8.com/color/48/mastercard-logo.png",
    amex: "https://img.icons8.com/color/48/amex.png",
    discover: "https://img.icons8.com/color/48/discover.png",
    default: "https://img.icons8.com/ios-filled/50/credit-card.png",
}

interface CreditCardPreviewProps {
    brand?: string
    last4?: string
    expiry?: string
    className?: string
}

export function CreditCardPreview({
                                      brand,
                                      last4,
                                      expiry,
                                      className,
                                  }: CreditCardPreviewProps) {
    const logo = brandLogos[brand?.toLowerCase() || ""] || brandLogos.default

    return (
        <div
            className={cn(
                "w-[280px] h-[160px] rounded-xl bg-gradient-to-br from-slate-900 to-gray-800 text-white shadow-lg p-4 flex flex-col justify-between",
                className
            )}
        >
            <div className="flex justify-between text-sm text-gray-400">
                <span>Credit Card</span>
                <img src={logo} alt="Brand" className="h-6" />
            </div>
            <div className="text-lg font-mono tracking-widest">•••• •••• •••• {last4}</div>
            <div className="flex justify-between text-xs text-gray-300">
                <span>EXP {expiry}</span>
                <span className="capitalize">{brand}</span>
            </div>
        </div>
    )
}
