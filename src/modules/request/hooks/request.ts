import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRequestToCollection, type Request, getAllRequestFromCollection, saveRequest, run } from "../action";
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
            saveRequest(id, value)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['requests'] })
            console.log('Request saved successfully:', data);
        }
    })
}

export function useRunRequest(requestId: string) {
    const queryClient = useQueryClient();
    const { setResponseViewerData } = useRequestPlaygroundStore();

    return useMutation({
        mutationFn: async () => await run(requestId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['requests'] })
            // @ts-ignore
            setResponseViewerData(data)

        }
    })
}

