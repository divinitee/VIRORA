import React, { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AnimationSettingsContext } from "@/components/animation/AnimationSettingsContext";
import { normalizeAnimation } from "@/components/animation/animationConfig";
const QUERY = ["animation-settings"];
export default function AnimationSettingsProvider({ children }) {
  const client = useQueryClient();
  const { user } = useAuth();
  const query = useQuery({ queryKey: QUERY, queryFn: async () => {
    const page = await base44.entities.AnimationSettings.filter({ key: "brand-loader" }, { sort: "-created_date", limit: 1 });
    return page.items[0] || null;
  }, staleTime: 30000, retry: false });
  useEffect(() => {
    if (!user) return;
    return base44.entities.AnimationSettings.subscribe(() => client.invalidateQueries({ queryKey: QUERY }));
  }, [user, client]);
  const config = useMemo(() => normalizeAnimation(query.data?.config), [query.data]);
  const publish = async (record) => {
    await client.cancelQueries({ queryKey: QUERY });
    client.setQueryData(QUERY, record);
  };
  return <AnimationSettingsContext.Provider value={{ config, record: query.data, loading: query.isPending, error: query.error, publish, retry: query.refetch }}>{children}</AnimationSettingsContext.Provider>;
}