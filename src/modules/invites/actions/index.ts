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
    },
    include: {
      workspace: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      }
    }
  })

  if (!invite) {
    throw new Error("Invite not found")
  }

  if (!invite.expiresAt || invite.expiresAt < new Date()) {
    throw new Error("Invite expired")
  }

  // Check if user is already a member
  const existingMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: invite.workspaceId,
      }
    }
  })

  if (existingMember) {
    throw new Error("You are already a member of this workspace")
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

  return {
    success: true,
    message: "Invite accepted",
    workspace: invite.workspace,
    invitedBy: invite.createdBy,
  }
}

export const getAllWorkspaceMembers = async (workspaceId: string) => {
  return await db.workspaceMember.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        }
      },
    },
    orderBy: {
      createdAt: 'asc',
    }
  })
}

export const getInviteDetails = async (token: string) => {
  const invite = await db.workspaceInvite.findUnique({
    where: {
      token,
    },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          description: true,
        }
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      }
    }
  })

  if (!invite) {
    throw new Error("Invite not found")
  }

  if (!invite.expiresAt || invite.expiresAt < new Date()) {
    throw new Error("Invite expired")
  }

  return invite
}

