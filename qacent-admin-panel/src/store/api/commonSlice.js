import { server } from "../server";

export const commonApi = server.injectEndpoints({
  reducerPath: "commonSliceApi",
  tagTypes: ["LIST_API", "Menu"],
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: () => ({
        url: "details",
        method: "GET",
      }),
      providesTags: ["Menu", "LIST_API"],
    }),

    getApi: builder.query({
      query: ({ url, params }) => {
        const queryObject = {
          url,
          method: "GET",
        };
        if (params) {
          queryObject.params = params;
        }
        return queryObject;
      },
      providesTags: ["LIST_API"],
    }),

    getApiWithId: builder.query({
        query: ([url, id]) => ({
          url: `${url}/${id}`,
          method: "GET",
        }),
        providesTags: ["LIST_API"],
      }),
    getApiWithString: builder.query({
        query: ([url, string]) => ({
          url: `${url}/${string}`,
          method: "GET",
        }),
        providesTags: ["LIST_API"],
      }),

    postApi: builder.mutation({
      query: (data) => {
        return {
          url: data.end_point,
          method: "POST",
          body: data.body,
        };
      },
      invalidatesTags: ["LIST_API"],
    }),

    updateApiJson: builder.mutation({
      query: (data) => ({
        url: data.end_point,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.body),
      }),
      invalidatesTags: ["LIST_API"],
    }),

    updateApi: builder.mutation({
      query: (data) => {
        // data.body._method = "PUT";
        // data.body.append("_method", "PUT");
        return {
          url: data.end_point,
          method: "PUT",
          body: data.body,
        };
      },
      invalidatesTags: ["LIST_API"],
    }),

    updateFormDataApi: builder.mutation({
      query: (data) => {
        // data.body._method = "PUT";
        // data.body.append("_method", "PUT");
        return {
          url: data.end_point,
          method: "POST",
          body: data.body,
        };
      },
      invalidatesTags: ["LIST_API"],
    }),
    deleteApi: builder.mutation({
      query: (data) => {
        data.body._method = "DELETE";
        return {
          url: data.end_point,
          method: "DELETE",
          body: data.body,
        };
      },
      invalidatesTags: ["LIST_API"],
    }),
  }),
});

export const {
  useGetDivisionListQuery,
  useGetApiQuery,
  useGetApiWithIdQuery,
  useUpdateApiJsonMutation,
  usePostApiMutation,
  useUpdateApiMutation,
  useDeleteApiMutation,
  useGetMenuItemsQuery,
  useGetApiWithStringQuery,
} = commonApi;
