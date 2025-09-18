"use client"

import { useState, useEffect } from "react"

export type UserTier = "free" | "standard" | "premium"

export interface TierFeatures {
  maxUploads: number
  accessToQuestions: boolean
  accessToAmbassadors: boolean
  accessToSessions: boolean
  accessToMarket: boolean
  prioritySupport: boolean
  exportFeatures: boolean
}

export const tierFeatures: Record<UserTier, TierFeatures> = {
  free: {
    maxUploads: 5,
    accessToQuestions: false, // Limited access
    accessToAmbassadors: false,
    accessToSessions: false,
    accessToMarket: true,
    prioritySupport: false,
    exportFeatures: false,
  },
  standard: {
    maxUploads: 50,
    accessToQuestions: true,
    accessToAmbassadors: false,
    accessToSessions: false,
    accessToMarket: true,
    prioritySupport: false,
    exportFeatures: true,
  },
  premium: {
    maxUploads: -1, // Unlimited
    accessToQuestions: true,
    accessToAmbassadors: true,
    accessToSessions: true,
    accessToMarket: true,
    prioritySupport: true,
    exportFeatures: true,
  },
}

export function useTier() {
  const [tier, setTier] = useState<UserTier>("free")
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  useEffect(() => {
    // Load tier from localStorage if available
    const savedTier = localStorage.getItem("userTier") as UserTier
    if (savedTier && ["free", "standard", "premium"].includes(savedTier)) {
      setTier(savedTier)
    }
  }, [])

  useEffect(() => {
    // Save tier to localStorage
    localStorage.setItem("userTier", tier)
  }, [tier])

  const canAccess = (requiredTier: UserTier) => {
    const tierLevels = { free: 0, standard: 1, premium: 2 }
    return tierLevels[tier] >= tierLevels[requiredTier]
  }

  const getFeatures = () => {
    return tierFeatures[tier]
  }

  const upgradeTier = (newTier: UserTier) => {
    setTier(newTier)
    setUpgradeModalOpen(false)
  }

  const showUpgradeModal = () => {
    setUpgradeModalOpen(true)
  }

  const getTierLabel = (tierType: UserTier) => {
    const labels = {
      free: "مجاني",
      standard: "قياسي",
      premium: "مميز",
    }
    return labels[tierType]
  }

  const getTierPrice = (tierType: UserTier) => {
    const prices = {
      free: "0 دينار",
      standard: "4 دنانير",
      premium: "8 دنانير",
    }
    return prices[tierType]
  }

  return {
    tier,
    setTier,
    canAccess,
    isFree: tier === "free",
    isStandard: tier === "standard",
    isPremium: tier === "premium",
    getFeatures,
    upgradeTier,
    showUpgradeModal,
    upgradeModalOpen,
    setUpgradeModalOpen,
    getTierLabel,
    getTierPrice,
  }
}
