import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => JSON.parse(localStorage.getItem('userInfo'))?.token;

export const marketingApi = createApi({
  reducerPath: 'marketingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/marketing',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getEmailCampaigns: builder.query({ query: () => '/email' }),
    createEmailCampaign: builder.mutation({ query: (data) => ({ url: '/email', method: 'POST', body: data }) }),
    // similar for social, ads, etc.
  }),
});

export const { useGetEmailCampaignsQuery, useCreateEmailCampaignMutation } = marketingApi;
