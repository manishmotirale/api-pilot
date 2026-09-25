import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRequestToCollection, type Request, getAllRequestsFromCollection, saveRequest } from "../action";

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
            getAllRequestsFromCollection(collectionId)
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