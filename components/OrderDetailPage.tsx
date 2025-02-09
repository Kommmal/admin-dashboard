import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"

export default function OrderDetail() {
    return (
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Orders</h1>
                <div className="flex gap-2 items-center">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
                        Dashboard
                    </Link>
                    <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg]" />
                    <Link href="/admin/orders" className="text-gray-500 hover:underline">
                        Orders
                    </Link>
                    <Link href="/admin/orders/orderDetail" className="text-gray-500 hover:underline">
                        Orders Details
                    </Link>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>
    )
}