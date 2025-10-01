"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export default function PremiumCard({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [isPremium, setIsPremium] = useState(false);
  const supabase = createClient();
  const {profile} = useAuth()

  useEffect(() => {
    const checkPremium = async () => {
    
      setIsPremium(profile?.subscription_tier === "premium");
    };
    checkPremium();
  }, []);

  return (
    <div className="relative group">
      <Link
        href={isPremium ? href : "#"}
        className={`block ${!isPremium ? "pointer-events-none" : ""}`}
      >
        {children}
      </Link>

      {!isPremium && (
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-sm font-bold">
          <span>للاشتراك المميز</span>
          <span className="text-xs mt-1">اشترك الآن للوصول</span>
        </div>
      )}
    </div>
  );
}
