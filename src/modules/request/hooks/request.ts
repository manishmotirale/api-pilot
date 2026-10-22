import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRequestToCollection, type Request, getAllRequestFromCollection, saveRequest, run, runDirect } from "../action";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export function useAddRequestToCollection(collectionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (value: Request) => {
            return addRequestToCollection(collectionId, value)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['requests', collectionId] })
            console.log('Request added successfully:', data);
        }
    })
}

export function useGetAllRequestsFromCollection(collectionId: string) {
    return useQuery({
        queryKey: ['requests', collectionId],
        queryFn: async () => {
            return getAllRequestFromCollection(collectionId)
        }
    })
}

export function useSaveRequest(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (value: Request) => {
            return saveRequest(id, value)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['requests'] })
            console.log('Request saved successfully:', data);
        }
    })
}

export function useRunRequest(requestId?: string) {
    const queryClient = useQueryClient();
    const { setResponseViewerData, tabs, activeTabId } = useRequestPlaygroundStore();

    return useMutation({
        mutationFn: async () => {
            const activeTab = tabs.find((tab) => tab.id === activeTabId);
            
            if (!activeTab) {
                throw new Error("No active tab found");
            }

            // Parse headers and parameters safely
            let headers: Record<string, string> | undefined;
            let parameters: Record<string, any> | undefined;

            try {
                headers = activeTab.headers ? JSON.parse(activeTab.headers) : undefined;
            } catch (e) {
                console.warn("Failed to parse headers, using empty object");
                headers = {};
            }

            try {
                parameters = activeTab.parameters ? JSON.parse(activeTab.parameters) : undefined;
            } catch (e) {
                console.warn("Failed to parse parameters, using empty object");
                parameters = {};
            }

            // If the request has a saved ID, use the regular run function
            if (requestId && activeTab.requestId) {
                return await run(requestId);
            }

            // Otherwise, run directly with the tab data (unsaved request)
            return await runDirect({
                id: requestId || "temp-" + Date.now(),
                method: activeTab.method,
                url: activeTab.url,
                headers,
                parameters,
                body: activeTab.body,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['requests'] })
            setResponseViewerData(data as any)
        }
    })
}

