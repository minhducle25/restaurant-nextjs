import tableApiRequest from "@/apiRequests/table"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTableList = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: tableApiRequest.list,
    })
}
export const useGetTable = ({id, enable}: {id: number, enable?: boolean}) => {
    return useQuery({
        queryKey: ['table', id],
        queryFn: () => tableApiRequest.get(id),
        enabled: enable
    })
}
export const useAddTableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tableApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
        }
    });
}
export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, ...body}: UpdateTableBodyType & {id: number}) =>
            tableApiRequest.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'], exact: true });
        }
    });
}

export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => tableApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
        }
    });
}