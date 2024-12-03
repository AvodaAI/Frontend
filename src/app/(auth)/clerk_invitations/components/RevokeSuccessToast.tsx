// src/app/(auth)/clerk_invitations/components/RevokeSuccessToast.tsx
'use client'
import { useToast } from "@/hooks/useToast"
import { useEffect } from "react"

interface SuccessToastProps {
  invitationId: string
}

export function RevokeSuccessToast({ invitationId }: SuccessToastProps) {
  const { toast } = useToast()
  
  useEffect(() => {
    // Show toast once when component mounts
    toast({
      title: "Success",
      description: "The invitation has been successfully revoked.",
      variant: "success",
    })
  }, [invitationId]) // Run effect when invitationId changes

  return null
}
