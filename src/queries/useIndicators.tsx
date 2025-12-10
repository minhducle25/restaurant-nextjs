import indicatorApiRequest from "@/apiRequests/indicators"
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations_backup/indicator.schema"
import { useQuery } from "@tanstack/react-query"

export const useDashboardIndicators = (queryParams: DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams),
        queryKey: ["dashboardIndicators", queryParams],
    })
}
