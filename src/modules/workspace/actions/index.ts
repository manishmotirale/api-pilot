"use server";

import db from "@/lib/db";
import { currentUser } from "@/modules/authentication/actions";
import { MEMBER_ROLE } from "../../../../prisma/generated/enums";


export const initializeWorkspace = async () => {
    const user = await currentUser();

    if (!user) {
        return {
            success: true,
            error: "User not found",
        };
    }

    try {
        const workspace = await db.workspace.upsert({
            where: {
                name_ownerId: {
                    ownerId: user.id,
                    name: "Personal Workspace",
                },
            },
            update: {},
            create: {
                name: "Personal Workspace",
                description: "Default workspace for personal use",
                ownerId: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: MEMBER_ROLE.ADMIN,
                    },
                },
            },
            include: {
                members: true
            }
        });

        return {
            success: true,
            workspace,
        };
    } catch (error) {
        console.error("Error initializing workspace:", error);
        return {
            success: false,
            error: "Failed to initialize workspace",
        };
    }
};


export async function getWorkspaces() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const workspaces = await db.workspace.findMany({
            where: {
                OR: [
                    { ownerId: user.id },
                    { members: { some: { userId: user.id } } },
                ],
            },
            orderBy: { createdAt: "asc" },
        });

        return workspaces;
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        throw new Error(`Failed to fetch workspaces: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function createWorkspace(name: string) {
    console.log('🔍 createWorkspace called with name:', name);
    
    const user = await currentUser();
    console.log('🔍 Current user:', user ? user.email : 'NO USER');
    
    if (!user) {
        console.error('❌ No user found - not authenticated');
        throw new Error("Unauthorized - Please sign in first");
    }

    try {
        console.log('🔍 Creating workspace in database...');
        const workspace = await db.workspace.create({
            data: {
                name,
                ownerId: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: MEMBER_ROLE.ADMIN,
                    },
                },
            },
        });

        console.log('✅ Workspace created successfully:', workspace.id);
        return workspace;
    } catch (error: any) {
        console.error('❌ Error creating workspace:');
        console.error('   Error type:', error?.constructor?.name);
        console.error('   Error code:', error?.code);
        console.error('   Error message:', error?.message);
        console.error('   Full error:', error);
        throw new Error(`Failed to create workspace: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export const getWorkspaceById = async (id: string) => {
    try {
        const workspace = await db.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return workspace;
    } catch (error) {
        console.error("Error fetching workspace:", error);
        throw new Error(`Failed to fetch workspace: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
