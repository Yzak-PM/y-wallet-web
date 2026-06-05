import UserBadge from "../ui/UserBadge";
import Link from "next/link";

export default function NavMain() {
  return ( 
    <div className="flex flex-row justify-between items-center">
      <div>
        <Link href={"/dashboard/"}>
          <h1 
            className="text-xl font-bold text-neutral-600"
          >
            Y-Wallet
          </h1>
        </Link>
        {/* <p className="text-xs text-neutral-400">Finance Dashboard</p> */}
      </div>
      <UserBadge />
    </div>
  )
}