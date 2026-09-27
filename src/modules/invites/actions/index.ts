"use server"

import db from "@/lib/db"
import { currentUser } from "@/modules/authentication/actions"
import { MEMBER_ROLE } from "../../../../prisma/generated/enums"
import { randomBytes } from "crypto"

export const generateWorkspaceInvite = async (workspaceId: string) => {
  const token = randomBytes(16).toString("hex")

  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const invite = await db.workspaceInvite.create({
    data: {
      workspaceId,
      token,
      createdById: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    }
  })

  return `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`
}

export const acceptWorkspaceInvite = async (token: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const invite = await db.workspaceInvite.findUnique({
    where: {
      token,
    }
  })

  if (!invite) {
    throw new Error("Invite not found")
  }

  if (!invite.expiresAt || invite.expiresAt < new Date()) {
    throw new Error("Invite expired")
  }

  await db.workspaceMember.create({
    data: {
      userId: user.id,
      workspaceId: invite.workspaceId,
      role: MEMBER_ROLE.VIEWER,
    }
  })

  await db.workspaceInvite.delete({
    where: {
      id: invite.id,
    }
  })

  return { success: true, message: "Invite accepted" }
}

export const getAllWorkspaceMembers = async (workspaceId: string) => {
  return await db.workspaceMember.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: true,
    }
  })
}

