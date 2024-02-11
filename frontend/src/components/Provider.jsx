"use client";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

export default function GeneralProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#964b00",
          borderRadius: 2,
          colorBgBase: "#964b00",
          // Alias Token
          colorBgContainer: "#FFE17D",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
}
