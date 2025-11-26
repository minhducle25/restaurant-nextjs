import dishApiRequest from "@/apiRequests/dish"
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetDishList = () => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: dishApiRequest.list,
    })
}
export const useGetDish = ({id, enable}: {id: number, enable?: boolean}) => {
    return useQuery({
        queryKey: ['dish', id],
        queryFn: () => dishApiRequest.get(id),
        enabled: enable
    })
}
export const useAddDishMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dishApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] });
        }
    });
}
export const useUpdateDishMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, ...body}: UpdateDishBodyType & {id: number}) =>
            dishApiRequest.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'], exact: true });
        }
    });
}

export const useDeleteDishMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => dishApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] });
        }
    });
}